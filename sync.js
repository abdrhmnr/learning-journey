// =============================================================
//  GITHUB SYNC ENGINE v2.0
//  يحفظ ويقرأ البيانات من/إلى ملف data.json في GitHub repo
//  مع: تشفير، retry، rate limiting، conflict resolution
// =============================================================

const SyncEngine = {
    config: null,
    isSyncing: false,
    lastSyncHash: null,
    pendingSave: false,
    saveTimer: null,

    // ==================
    //  TOKEN ENCRYPTION
    // ==================
    _encryptToken(token) {
        try {
            const reversed = token.split('').reverse().join('');
            const shifted = reversed.split('').map((c, i) =>
                String.fromCharCode(c.charCodeAt(0) + (i % 5) + 1)
            ).join('');
            return btoa(shifted);
        } catch { return btoa(token); }
    },

    _decryptToken(encrypted) {
        try {
            const shifted = atob(encrypted);
            const unshifted = shifted.split('').map((c, i) =>
                String.fromCharCode(c.charCodeAt(0) - (i % 5) - 1)
            ).join('');
            return unshifted.split('').reverse().join('');
        } catch {
            try { return atob(encrypted); }
            catch { return encrypted; }
        }
    },

    // ==================
    //  RATE LIMITER
    // ==================
    rateLimiter: {
        requests: [],
        maxPerMinute: 25,
        maxPerHour: 200,

        canProceed() {
            const now = Date.now();
            this.requests = this.requests.filter(t => now - t < 3600000);
            const lastMinute = this.requests.filter(t => now - t < 60000).length;
            return lastMinute < this.maxPerMinute && this.requests.length < this.maxPerHour;
        },

        record() {
            this.requests.push(Date.now());
        },

        getWaitTime() {
            const now = Date.now();
            const lastMinute = this.requests.filter(t => now - t < 60000);
            if (lastMinute.length >= this.maxPerMinute) {
                return 60000 - (now - lastMinute[0]) + 1000;
            }
            return 0;
        }
    },

    // ==================
    //  SETUP
    // ==================
    getConfig() {
        try {
            const raw = localStorage.getItem('journey_sync_config');
            if (!raw) return null;
            const config = JSON.parse(raw);
            if (config._encrypted && config.token) {
                config.token = this._decryptToken(config.token);
                delete config._encrypted;
            }
            return config;
        } catch { return null; }
    },

    saveConfig(config) {
        const safeConfig = {
            username: config.username,
            repo: config.repo,
            token: config.token ? this._encryptToken(config.token) : '',
            _encrypted: true
        };
        localStorage.setItem('journey_sync_config', JSON.stringify(safeConfig));
        this.config = config;
    },

    isConfigured() {
        this.config = this.getConfig();
        return this.config && this.config.token && this.config.username && this.config.repo;
    },

    // ==================
    //  GITHUB API (with retry + rate limit)
    // ==================
    async apiRequest(method, path, body = null, retries = 3) {
        // Rate limit check
        if (!this.rateLimiter.canProceed()) {
            const waitTime = this.rateLimiter.getWaitTime();
            console.warn(`Rate limit: waiting ${waitTime}ms`);
            await new Promise(r => setTimeout(r, waitTime));
        }

        const url = `https://api.github.com/repos/${this.config.username}/${this.config.repo}${path}`;
        const headers = {
            'Authorization': `token ${this.config.token}`,
            'Accept': 'application/vnd.github.v3+json',
        };
        if (body) headers['Content-Type'] = 'application/json';

        for (let attempt = 1; attempt <= retries; attempt++) {
            try {
                this.rateLimiter.record();

                const controller = new AbortController();
                const timeout = setTimeout(() => controller.abort(), 15000);

                const response = await fetch(url, {
                    method,
                    headers,
                    body: body ? JSON.stringify(body) : null,
                    signal: controller.signal
                });

                clearTimeout(timeout);

                if (response.status === 404 && method === 'GET') {
                    return { notFound: true };
                }

                if (response.status === 409) {
                    // Conflict - سنتعامل معه في saveToGitHub
                    return { conflict: true };
                }

                if (response.status === 403) {
                    const remaining = response.headers.get('X-RateLimit-Remaining');
                    if (remaining === '0') {
                        const resetTime = response.headers.get('X-RateLimit-Reset');
                        const waitMs = (parseInt(resetTime) * 1000) - Date.now() + 1000;
                        console.warn(`GitHub rate limit hit. Waiting ${waitMs}ms`);
                        if (attempt < retries) {
                            await new Promise(r => setTimeout(r, Math.min(waitMs, 60000)));
                            continue;
                        }
                    }
                }

                if (!response.ok) {
                    const err = await response.json().catch(() => ({}));
                    throw new Error(err.message || `HTTP ${response.status}`);
                }

                return await response.json();

            } catch (error) {
                console.error(`API attempt ${attempt}/${retries} failed:`, error.message);

                if (error.name === 'AbortError') {
                    error.message = 'Request timeout';
                }

                if (attempt < retries) {
                    const delay = Math.min(1000 * Math.pow(2, attempt - 1), 10000);
                    console.log(`Retrying in ${delay}ms...`);
                    await new Promise(r => setTimeout(r, delay));
                } else {
                    throw error;
                }
            }
        }
    },

    // ==================
    //  READ DATA (with retry)
    // ==================
    async loadFromGitHub() {
        if (!this.isConfigured()) return null;
        if (!navigator.onLine) {
            this.updateSyncStatus('offline');
            return null;
        }

        this.updateSyncStatus('syncing');

        try {
            const result = await this.apiRequest('GET', '/contents/data.json');

            if (result.notFound) {
                this.updateSyncStatus('synced');
                return null;
            }

            this.lastSyncHash = result.sha;
            const content = atob(result.content);
            const data = JSON.parse(decodeURIComponent(escape(content)));

            this.updateSyncStatus('synced');
            return data;

        } catch (error) {
            console.error('Load from GitHub failed:', error);
            this.updateSyncStatus('error');
            return null;
        }
    },

    // ==================
    //  WRITE DATA (with conflict resolution)
    // ==================
    async saveToGitHub(data) {
        if (!this.isConfigured()) return false;
        if (!navigator.onLine) {
            this.updateSyncStatus('offline');
            OfflineQueue.markPending();
            return false;
        }
        if (this.isSyncing) {
            this.pendingSave = true;
            return false;
        }

        this.isSyncing = true;
        this.updateSyncStatus('syncing');

        try {
            // جلب أحدث SHA
            let sha = this.lastSyncHash;
            let needsMerge = false;

            try {
                const existing = await this.apiRequest('GET', '/contents/data.json');
                if (!existing.notFound) {
                    if (sha && existing.sha !== sha) {
                        // الملف تغير من جهاز آخر!
                        needsMerge = true;
                        const remoteContent = atob(existing.content);
                        const remoteData = JSON.parse(decodeURIComponent(escape(remoteContent)));
                        data = this.mergeData(data, remoteData);
                    }
                    sha = existing.sha;
                }
            } catch (e) {
                // الملف غير موجود
            }

            // إضافة metadata
            data.lastSync = new Date().toISOString();
            data.syncDevice = this._getDeviceId();

            const content = btoa(unescape(encodeURIComponent(JSON.stringify(data, null, 2))));
            const body = {
                message: `Sync: ${new Date().toLocaleString('ar-EG')} [${this._getDeviceId()}]`,
                content: content,
                branch: 'main'
            };
            if (sha) body.sha = sha;

            const result = await this.apiRequest('PUT', '/contents/data.json', body);

            if (result.conflict) {
                // 409 Conflict - أعد المحاولة
                this.lastSyncHash = null;
                this.isSyncing = false;
                return await this.saveToGitHub(data);
            }

            this.lastSyncHash = result.content.sha;
            this.updateSyncStatus('synced');
            this.isSyncing = false;

            if (needsMerge) {
                // حدّث المحلي بالنسخة المدمجة
                localStorage.setItem('journey_app_v3', JSON.stringify(data));
            }

            if (this.pendingSave) {
                this.pendingSave = false;
                setTimeout(() => this.debouncedSave(data), 2000);
            }

            return true;

        } catch (error) {
            console.error('Save to GitHub failed:', error);
            this.updateSyncStatus('error');
            this.isSyncing = false;
            OfflineQueue.markPending();
            return false;
        }
    },

    // ==================
    //  SMART MERGE
    // ==================
    mergeData(local, remote) {
        const merged = JSON.parse(JSON.stringify(local));

        // ---- دمج الخطط ----
        if (remote.plans) {
            remote.plans.forEach(remotePlan => {
                const localPlan = merged.plans.find(p => p.id === remotePlan.id);
                if (!localPlan) {
                    merged.plans.push(remotePlan);
                    return;
                }

                // دمج المجموعات
                remotePlan.groups?.forEach(remoteGroup => {
                    const localGroup = localPlan.groups.find(g => g.id === remoteGroup.id);
                    if (!localGroup) {
                        localPlan.groups.push(remoteGroup);
                        return;
                    }

                    // دمج المهام
                    remoteGroup.tasks?.forEach(remoteTask => {
                        const localTask = localGroup.tasks.find(t => t.id === remoteTask.id);
                        if (!localTask) {
                            localGroup.tasks.push(remoteTask);
                        } else {
                            // المهمة المكتملة تفوز دائماً
                            if (remoteTask.status === 'done' && localTask.status !== 'done') {
                                localTask.status = 'done';
                            }
                            // دمج الدروس الفرعية
                            if (remoteTask.subs) {
                                remoteTask.subs.forEach(remoteSub => {
                                    const localSub = (localTask.subs || []).find(s => s.name === remoteSub.name);
                                    if (!localSub) {
                                        if (!localTask.subs) localTask.subs = [];
                                        localTask.subs.push(remoteSub);
                                    } else if (remoteSub.status === 'done') {
                                        localSub.status = 'done';
                                    }
                                });
                            }
                            // التاريخ: الأحدث يفوز
                            if (remoteTask.date && (!localTask.date || remoteTask.date > localTask.date)) {
                                localTask.date = remoteTask.date;
                            }
                        }
                    });
                });
            });
        }

        // ---- دمج المشاريع ----
        if (remote.projects) {
            remote.projects.forEach(remoteProj => {
                const localProj = merged.projects.find(p => p.id === remoteProj.id);
                if (!localProj) {
                    merged.projects.push(remoteProj);
                    return;
                }
                remoteProj.phases?.forEach(remotePhase => {
                    const localPhase = localProj.phases.find(p => p.id === remotePhase.id);
                    if (!localPhase) {
                        localProj.phases.push(remotePhase);
                    } else if (remotePhase.status === 'done' && localPhase.status !== 'done') {
                        localPhase.status = 'done';
                    } else if (remotePhase.status === 'active' && localPhase.status === 'pending') {
                        localPhase.status = 'active';
                    }
                });
            });
        }

        // ---- دمج اليوميات ----
        if (remote.journalEntries) {
            const existingDates = new Set(
                (merged.journalEntries || []).map(e => e.date)
            );
            remote.journalEntries.forEach(entry => {
                if (!existingDates.has(entry.date)) {
                    if (!merged.journalEntries) merged.journalEntries = [];
                    merged.journalEntries.push(entry);
                }
            });
            if (merged.journalEntries) {
                merged.journalEntries.sort((a, b) => new Date(a.date) - new Date(b.date));
            }
        }

        // ---- دمج المصادر ----
        if (remote.resources) {
            remote.resources.forEach(remoteGroup => {
                const localGroup = (merged.resources || []).find(g => g.id === remoteGroup.id);
                if (!localGroup) {
                    if (!merged.resources) merged.resources = [];
                    merged.resources.push(remoteGroup);
                } else {
                    remoteGroup.items?.forEach(remoteItem => {
                        const localItem = localGroup.items.find(i => i.id === remoteItem.id);
                        if (!localItem) {
                            localGroup.items.push(remoteItem);
                        } else if (remoteItem.done && !localItem.done) {
                            localItem.done = true;
                        }
                    });
                }
            });
        }

        // ---- دمج الإنجازات ----
        if (remote.achievements) {
            if (!merged.achievements) merged.achievements = [];
            remote.achievements.forEach(a => {
                if (!merged.achievements.includes(a)) {
                    merged.achievements.push(a);
                }
            });
        }

        // ---- دمج سجل البومودورو ----
        if (remote.pomodoroLog) {
            if (!merged.pomodoroLog) merged.pomodoroLog = {};
            Object.entries(remote.pomodoroLog).forEach(([date, mins]) => {
                merged.pomodoroLog[date] = Math.max(merged.pomodoroLog[date] || 0, mins);
            });
        }

        // ---- الـ streak: الأعلى يفوز ----
        merged.streak = Math.max(merged.streak || 0, remote.streak || 0);

        return merged;
    },

    // ==================
    //  DEBOUNCED SAVE
    // ==================
    debouncedSave(data) {
        if (this.saveTimer) clearTimeout(this.saveTimer);

        // حفظ محلي فوري دائماً
        localStorage.setItem('journey_app_v3', JSON.stringify(data));

        this.saveTimer = setTimeout(async () => {
            if (this.isConfigured() && navigator.onLine) {
                await this.saveToGitHub(data);
            }
        }, 3000);
    },

    // ==================
    //  DEVICE ID
    // ==================
    _getDeviceId() {
        let id = localStorage.getItem('journey_device_id');
        if (!id) {
            const ua = navigator.userAgent;
            if (/Mobile|Android|iPhone/.test(ua)) id = 'mobile';
            else if (/Tablet|iPad/.test(ua)) id = 'tablet';
            else id = 'desktop';
            id += '_' + Math.random().toString(36).substr(2, 4);
            localStorage.setItem('journey_device_id', id);
        }
        return id;
    },

    // ==================
    //  SYNC STATUS UI
    // ==================
    updateSyncStatus(status) {
        const el = document.getElementById('sync-status');
        if (!el) return;

        const states = {
            synced: { text: '● متزامن', class: 'synced' },
            syncing: { text: '● يزامن...', class: 'syncing' },
            error: { text: '● خطأ', class: 'error' },
            local: { text: '● محلي', class: 'local' },
            offline: { text: '● غير متصل', class: 'offline' }
        };

        const state = states[status] || states.local;
        el.textContent = state.text;
        el.className = `sync-status ${state.class}`;
    },

    // ==================
    //  VALIDATE CONNECTION
    // ==================
    async validateConnection(username, repo, token) {
        if (!navigator.onLine) {
            return { valid: false, error: 'لا يوجد اتصال بالإنترنت.' };
        }

        const url = `https://api.github.com/repos/${username}/${repo}`;
        try {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 10000);

            const response = await fetch(url, {
                headers: {
                    'Authorization': `token ${token}`,
                    'Accept': 'application/vnd.github.v3+json'
                },
                signal: controller.signal
            });

            clearTimeout(timeout);

            if (response.ok) return { valid: true };
            if (response.status === 404) {
                return { valid: false, error: 'الـ Repository غير موجود. أنشئه أولاً على GitHub.' };
            }
            if (response.status === 401) {
                return { valid: false, error: 'الـ Token غير صحيح أو منتهي الصلاحية.' };
            }
            return { valid: false, error: `خطأ: ${response.status}` };
        } catch (error) {
            if (error.name === 'AbortError') {
                return { valid: false, error: 'انتهت مهلة الاتصال. حاول مرة أخرى.' };
            }
            return { valid: false, error: 'لا يمكن الاتصال بـ GitHub. تحقق من الإنترنت.' };
        }
    }
};

// =============================================================
//  OFFLINE QUEUE SYSTEM
// =============================================================
const OfflineQueue = {
    hasPending: false,
    banner: null,

    init() {
        // استرجاع الحالة
        this.hasPending = localStorage.getItem('journey_pending_sync') === 'true';

        // مراقبة الاتصال
        window.addEventListener('online', () => {
            this.removeBanner();
            if (this.hasPending) {
                this.flush();
            }
            SyncEngine.updateSyncStatus(SyncEngine.isConfigured() ? 'synced' : 'local');
        });

        window.addEventListener('offline', () => {
            this.showBanner();
            SyncEngine.updateSyncStatus('offline');
        });

        // فحص أولي
        if (!navigator.onLine) {
            this.showBanner();
        } else if (this.hasPending) {
            this.flush();
        }
    },

    markPending() {
        this.hasPending = true;
        localStorage.setItem('journey_pending_sync', 'true');
    },

    clearPending() {
        this.hasPending = false;
        localStorage.removeItem('journey_pending_sync');
    },

    async flush() {
        if (!SyncEngine.isConfigured() || !navigator.onLine) return;

        try {
            const raw = localStorage.getItem('journey_app_v3');
            if (!raw) return;

            const localData = JSON.parse(raw);
            if (typeof toast === 'function') {
                toast('📡 جاري مزامنة التعديلات المعلقة...', 'info');
            }

            const success = await SyncEngine.saveToGitHub(localData);
            if (success) {
                this.clearPending();
                if (typeof toast === 'function') {
                    toast('✅ تمت مزامنة كل التعديلات', 'success');
                }
            }
        } catch (e) {
            console.error('Offline queue flush failed:', e);
        }
    },

    showBanner() {
        if (this.banner) return;
        this.banner = document.createElement('div');
        this.banner.id = 'offline-banner';
        this.banner.className = 'offline-banner';
        this.banner.innerHTML = '📴 أنت غير متصل بالإنترنت — التعديلات تُحفظ محلياً وستتزامن عند عودة الاتصال';
        document.body.prepend(this.banner);
    },

    removeBanner() {
        if (this.banner) {
            this.banner.remove();
            this.banner = null;
        }
    }
};

// =============================================================
//  AUTO BACKUP (كل يوم نسخة احتياطية محلية)
// =============================================================
const AutoBackup = {
    maxBackups: 7,

    run() {
        const today = new Date().toISOString().split('T')[0];
        const lastBackup = localStorage.getItem('journey_last_backup');

        if (lastBackup === today) return;

        try {
            const data = localStorage.getItem('journey_app_v3');
            if (!data) return;

            // احفظ نسخة اليوم
            localStorage.setItem(`journey_backup_${today}`, data);
            localStorage.setItem('journey_last_backup', today);

            // احذف النسخ القديمة
            this.cleanOldBackups();

            console.log('Auto backup saved:', today);
        } catch (e) {
            console.warn('Auto backup failed:', e);
        }
    },

    cleanOldBackups() {
        const backupKeys = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('journey_backup_')) {
                backupKeys.push(key);
            }
        }

        backupKeys.sort().reverse();
        backupKeys.slice(this.maxBackups).forEach(key => {
            localStorage.removeItem(key);
        });
    },

    getBackups() {
        const backups = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('journey_backup_')) {
                const date = key.replace('journey_backup_', '');
                backups.push({ key, date });
            }
        }
        return backups.sort((a, b) => b.date.localeCompare(a.date));
    },

    restore(backupKey) {
        const data = localStorage.getItem(backupKey);
        if (data) {
            localStorage.setItem('journey_app_v3', data);
            return JSON.parse(data);
        }
        return null;
    }
};
