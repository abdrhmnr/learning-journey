// =============================================================
//  GITHUB SYNC ENGINE
//  يحفظ ويقرأ البيانات من/إلى ملف data.json في GitHub repo
// =============================================================

const SyncEngine = {
    config: null,
    isSyncing: false,
    lastSyncHash: null,
    pendingSave: false,
    saveTimer: null,

    // ==================
    //  SETUP
    // ==================

    getConfig() {
        try {
            const raw = localStorage.getItem('journey_sync_config');
            return raw ? JSON.parse(raw) : null;
        } catch {
            return null;
        }
    },

    saveConfig(config) {
        localStorage.setItem('journey_sync_config', JSON.stringify(config));
        this.config = config;
    },

    isConfigured() {
        this.config = this.getConfig();
        return this.config && this.config.token && this.config.username && this.config.repo;
    },

    // ==================
    //  GITHUB API
    // ==================

    async apiRequest(method, path, body = null) {
        const url = `https://api.github.com/repos/${this.config.username}/${this.config.repo}${path}`;

        const headers = {
            'Authorization': `token ${this.config.token}`,
            'Accept': 'application/vnd.github.v3+json',
        };

        if (body) headers['Content-Type'] = 'application/json';

        try {
            const response = await fetch(url, {
                method,
                headers,
                body: body ? JSON.stringify(body) : null
            });

            if (response.status === 404 && method === 'GET') {
                return { notFound: true };
            }

            if (!response.ok) {
                const err = await response.json().catch(() => ({}));
                throw new Error(err.message || `HTTP ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('GitHub API Error:', error);
            throw error;
        }
    },

    // ==================
    //  READ DATA
    // ==================

    async loadFromGitHub() {
        if (!this.isConfigured()) return null;

        this.updateSyncStatus('syncing');

        try {
            const result = await this.apiRequest('GET', '/contents/data.json');

            if (result.notFound) {
                this.updateSyncStatus('synced');
                return null; // ملف لا يوجد بعد
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
    //  WRITE DATA
    // ==================

    async saveToGitHub(data) {
        if (!this.isConfigured()) return false;
        if (this.isSyncing) {
            this.pendingSave = true;
            return false;
        }

        this.isSyncing = true;
        this.updateSyncStatus('syncing');

        try {
            // نحتاج الـ SHA الحالي
            let sha = this.lastSyncHash;

            if (!sha) {
                try {
                    const existing = await this.apiRequest('GET', '/contents/data.json');
                    if (!existing.notFound) {
                        sha = existing.sha;
                    }
                } catch {
                    // الملف غير موجود، سننشئه
                }
            }

            const content = btoa(unescape(encodeURIComponent(JSON.stringify(data, null, 2))));

            const body = {
                message: `Update data - ${new Date().toISOString()}`,
                content: content,
                branch: 'main'
            };

            if (sha) body.sha = sha;

            const result = await this.apiRequest('PUT', '/contents/data.json', body);

            this.lastSyncHash = result.content.sha;
            this.updateSyncStatus('synced');
            this.isSyncing = false;

            // لو في حفظ معلق، نفذه
            if (this.pendingSave) {
                this.pendingSave = false;
                // انتظر ثانية واحدة قبل الحفظ مرة أخرى
                setTimeout(() => this.debouncedSave(data), 1000);
            }

            return true;

        } catch (error) {
            console.error('Save to GitHub failed:', error);
            this.updateSyncStatus('error');
            this.isSyncing = false;
            return false;
        }
    },

    // ==================
    //  DEBOUNCED SAVE
    //  ينتظر 3 ثواني بعد آخر تعديل قبل الحفظ
    // ==================

    debouncedSave(data) {
        if (this.saveTimer) clearTimeout(this.saveTimer);

        this.saveTimer = setTimeout(async () => {
            // حفظ محلي فوري دائماً
            localStorage.setItem('journey_app_v3', JSON.stringify(data));

            // حفظ على GitHub
            if (this.isConfigured()) {
                await this.saveToGitHub(data);
            }
        }, 3000); // 3 ثواني انتظار

        // حفظ محلي فوري (بدون انتظار)
        localStorage.setItem('journey_app_v3', JSON.stringify(data));
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
            local: { text: '● محلي', class: 'local' }
        };

        const state = states[status] || states.local;
        el.textContent = state.text;
        el.className = `sync-status ${state.class}`;
    },

    // ==================
    //  VALIDATE CONNECTION
    // ==================

    async validateConnection(username, repo, token) {
        const url = `https://api.github.com/repos/${username}/${repo}`;

        try {
            const response = await fetch(url, {
                headers: {
                    'Authorization': `token ${token}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });

            if (response.ok) return { valid: true };

            if (response.status === 404) {
                return { valid: false, error: 'الـ Repository غير موجود. أنشئه أولاً على GitHub.' };
            }

            if (response.status === 401) {
                return { valid: false, error: 'الـ Token غير صحيح أو منتهي الصلاحية.' };
            }

            return { valid: false, error: `خطأ: ${response.status}` };

        } catch (error) {
            return { valid: false, error: 'لا يمكن الاتصال بـ GitHub. تحقق من الإنترنت.' };
        }
    }
};
