/*  GITHUB SYNC ENGINE  */
const SyncEngine = {
    config: null,
    isSyncing: false,
    lastSHA: null,
    timer: null,

    getConfig() {
        try { return JSON.parse(localStorage.getItem('journey_sync_cfg') || 'null'); }
        catch { return null; }
    },

    saveConfig(c) {
        localStorage.setItem('journey_sync_cfg', JSON.stringify(c));
        this.config = c;
    },

    isConfigured() {
        this.config = this.getConfig();
        return !!(this.config && this.config.token && this.config.username && this.config.repo);
    },

    async api(method, path, body) {
        const r = await fetch(
            `https://api.github.com/repos/${this.config.username}/${this.config.repo}${path}`,
            {
                method,
                headers: {
                    'Authorization': `token ${this.config.token}`,
                    'Accept': 'application/vnd.github.v3+json',
                    ...(body ? { 'Content-Type': 'application/json' } : {})
                },
                body: body ? JSON.stringify(body) : null
            }
        );
        if (r.status === 404) return { _notFound: true };
        if (!r.ok) throw new Error(`GitHub API ${r.status}`);
        return r.json();
    },

    async loadRemote() {
        if (!this.isConfigured()) return null;
        this.setStatus('syncing');
        try {
            const r = await this.api('GET', '/contents/data.json');
            if (r._notFound) { this.setStatus('synced'); return null; }
            this.lastSHA = r.sha;
            const txt = decodeURIComponent(escape(atob(r.content)));
            this.setStatus('synced');
            return JSON.parse(txt);
        } catch (e) {
            console.error('Load failed:', e);
            this.setStatus('error');
            return null;
        }
    },

    async saveRemote(data) {
        if (!this.isConfigured() || this.isSyncing) return false;
        this.isSyncing = true;
        this.setStatus('syncing');
        try {
            if (!this.lastSHA) {
                try {
                    const ex = await this.api('GET', '/contents/data.json');
                    if (!ex._notFound) this.lastSHA = ex.sha;
                } catch {}
            }
            const body = {
                message: `sync ${new Date().toISOString()}`,
                content: btoa(unescape(encodeURIComponent(JSON.stringify(data, null, 2)))),
                branch: 'main'
            };
            if (this.lastSHA) body.sha = this.lastSHA;
            const r = await this.api('PUT', '/contents/data.json', body);
            this.lastSHA = r.content.sha;
            this.setStatus('synced');
            this.isSyncing = false;
            return true;
        } catch (e) {
            console.error('Save failed:', e);
            this.setStatus('error');
            this.isSyncing = false;
            return false;
        }
    },

    debouncedSave(data) {
        if (this.timer) clearTimeout(this.timer);
        localStorage.setItem('journey_app_v3', JSON.stringify(data));
        if (!this.isConfigured()) return;
        this.timer = setTimeout(() => this.saveRemote(data), 3000);
    },

    setStatus(s) {
        const el = document.getElementById('sync-status');
        if (!el) return;
        const m = { synced: ['● متزامن', 'synced'], syncing: ['● يزامن...', 'syncing'], error: ['● خطأ', 'error'], local: ['● محلي', ''] };
        const v = m[s] || m.local;
        el.textContent = v[0];
        el.className = 'sync-status ' + v[1];
    },

    async validate(u, r, t) {
        try {
            const res = await fetch(`https://api.github.com/repos/${u}/${r}`, {
                headers: { 'Authorization': `token ${t}`, 'Accept': 'application/vnd.github.v3+json' }
            });
            if (res.ok) return { ok: true };
            if (res.status === 404) return { ok: false, msg: 'Repository غير موجود' };
            if (res.status === 401) return { ok: false, msg: 'Token غير صحيح' };
            return { ok: false, msg: 'خطأ ' + res.status };
        } catch { return { ok: false, msg: 'لا يوجد اتصال' }; }
    }
};
