// =============================================================
//  FEATURES v3.1
//  #8 Focus Mode + #7 Link Tracking
// =============================================================

// =============================================================
//  🎯 #8 - FOCUS MODE
//  يخفي كل شيء ويعرض مهمة واحدة فقط مع بومودورو مدمج
// =============================================================
const FocusMode = {
    active: false,
    taskRef: null, // { planId, groupId, taskId }
    focusTimer: null,
    focusTimeLeft: 25 * 60,
    focusRunning: false,
    focusMode: 'work',
    focusSessions: 0,
    startTime: null,

    // ---- فتح وضع التركيز ----
    enter(planId, groupId, taskId) {
        const found = findTask(planId, groupId, taskId);
        if (!found || !found.task) return;

        this.taskRef = { planId, groupId, taskId };
        this.active = true;
        this.focusMode = 'work';
        this.focusTimeLeft = Pomodoro.config.work;
        this.focusRunning = false;
        this.focusSessions = 0;
        this.startTime = Date.now();

        this.render();

        // اختصار Escape للخروج
        document.addEventListener('keydown', this._escHandler);
    },

    // ---- الخروج ----
    exit() {
        this.active = false;
        this.pause();
        document.removeEventListener('keydown', this._escHandler);

        const overlay = document.getElementById('focus-overlay');
        if (overlay) overlay.remove();

        // حفظ الملاحظات إن وجدت
        this._saveNotes();

        render(); // إعادة العرض العادي
    },

    _escHandler(e) {
        if (e.key === 'Escape') {
            FocusMode.exit();
        }
    },

    // ---- التشغيل ----
    start() {
        if (this.focusRunning) return;
        this.focusRunning = true;
        this.focusTimer = setInterval(() => this.tick(), 1000);
        this.updateDisplay();
    },

    pause() {
        this.focusRunning = false;
        if (this.focusTimer) clearInterval(this.focusTimer);
        this.updateDisplay();
    },

    reset() {
        this.pause();
        this.focusMode = 'work';
        this.focusTimeLeft = Pomodoro.config.work;
        this.updateDisplay();
    },

    tick() {
        this.focusTimeLeft--;
        if (this.focusTimeLeft <= 0) {
            this.onComplete();
        }
        this.updateDisplay();
    },

    onComplete() {
        this.pause();
        Pomodoro.playNotification();

        if (this.focusMode === 'work') {
            this.focusSessions++;

            // سجل في البومودورو
            if (!data.pomodoroLog) data.pomodoroLog = {};
            const today = new Date().toISOString().split('T')[0];
            if (!data.pomodoroLog[today]) data.pomodoroLog[today] = 0;
            data.pomodoroLog[today] += Pomodoro.config.work / 60;
            updateStreak();
            save();

            if (this.focusSessions % Pomodoro.config.longBreakEvery === 0) {
                this.focusMode = 'longBreak';
                this.focusTimeLeft = Pomodoro.config.longBreak;
                toast('🌴 استراحة طويلة! أنجزت ' + this.focusSessions + ' جلسات', 'success');
            } else {
                this.focusMode = 'break';
                this.focusTimeLeft = Pomodoro.config.break;
                toast('☕ استراحة - جلسة #' + this.focusSessions, 'success');
            }
        } else {
            this.focusMode = 'work';
            this.focusTimeLeft = Pomodoro.config.work;
            toast('💪 نرجع للتركيز!', 'info');
        }

        this.updateDisplay();
    },

    // ---- حفظ الملاحظات ----
    _saveNotes() {
        if (!this.taskRef) return;
        const textarea = document.getElementById('focus-notes');
        if (!textarea) return;

        const found = findTask(this.taskRef.planId, this.taskRef.groupId, this.taskRef.taskId);
        if (found && found.task) {
            found.task.notes = textarea.value;
            save();
        }
    },

    // ---- تبديل حالة درس فرعي ----
    toggleFocusSub(index) {
        if (!this.taskRef) return;
        const found = findTask(this.taskRef.planId, this.taskRef.groupId, this.taskRef.taskId);
        if (!found || !found.task) return;

        const sub = (found.task.subs || [])[index];
        if (!sub) return;

        sub.status = sub.status === 'done' ? 'pending' : 'done';
        if (sub.status === 'done') {
            updateStreak();
            Achievements.checkAndNotify();
        }
        save();
        this.render();
    },

    // ---- إكمال المهمة ----
    completeTask() {
        if (!this.taskRef) return;
        const found = findTask(this.taskRef.planId, this.taskRef.groupId, this.taskRef.taskId);
        if (!found || !found.task) return;

        found.task.status = 'done';
        updateStreak();
        Achievements.checkAndNotify();
        this._saveNotes();
        save();

        toast('🎉 أحسنت! تم إكمال المهمة', 'success');
        this.exit();
    },

    // ---- تنسيق الوقت ----
    formatTime() {
        const mins = Math.floor(this.focusTimeLeft / 60);
        const secs = this.focusTimeLeft % 60;
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    },

    getModeLabel() {
        return this.focusMode === 'work' ? '🍅 تركيز'
            : this.focusMode === 'break' ? '☕ استراحة'
            : '🌴 استراحة طويلة';
    },

    // ---- حساب الوقت المنقضي ----
    getElapsed() {
        if (!this.startTime) return '0 د';
        const mins = Math.round((Date.now() - this.startTime) / 60000);
        if (mins < 60) return mins + ' د';
        return Math.floor(mins / 60) + ' س ' + (mins % 60) + ' د';
    },

    // ---- تحديث العرض (الأرقام فقط) ----
    updateDisplay() {
        const timerEl = document.getElementById('focus-timer-display');
        const modeEl = document.getElementById('focus-mode-label');
        const startBtn = document.getElementById('focus-start-btn');
        const pauseBtn = document.getElementById('focus-pause-btn');
        const elapsedEl = document.getElementById('focus-elapsed');
        const sessionsEl = document.getElementById('focus-sessions-count');

        if (timerEl) {
            timerEl.textContent = this.formatTime();
            timerEl.className = 'focus-timer ' + this.focusMode;
        }
        if (modeEl) modeEl.textContent = this.getModeLabel();
        if (startBtn) startBtn.style.display = this.focusRunning ? 'none' : 'inline-flex';
        if (pauseBtn) pauseBtn.style.display = this.focusRunning ? 'inline-flex' : 'none';
        if (elapsedEl) elapsedEl.textContent = this.getElapsed();
        if (sessionsEl) sessionsEl.textContent = this.focusSessions;

        // عنوان الصفحة
        if (this.active) {
            document.title = this.focusRunning
                ? `🎯 ${this.formatTime()} - تركيز`
                : '🎯 وضع التركيز';
        }
    },

    // ---- الرسم الكامل ----
    render() {
        if (!this.taskRef) return;
        const found = findTask(this.taskRef.planId, this.taskRef.groupId, this.taskRef.taskId);
        if (!found || !found.task) return;

        const task = found.task;
        const plan = found.plan;
        const subs = task.subs || [];
        const subsDone = subs.filter(s => s.status === 'done').length;
        const links = task.links || [];

        // إزالة أي overlay قديم
        document.getElementById('focus-overlay')?.remove();

        const overlay = document.createElement('div');
        overlay.id = 'focus-overlay';
        overlay.className = 'focus-overlay';

        overlay.innerHTML = `
            <div class="focus-card">
                <div style="display:flex;justify-content:space-between;align-items:center">
                    <span style="font-size:0.82rem;color:var(--text-secondary)">${this.getModeLabel()}</span>
                    <button class="btn btn-ghost btn-sm" onclick="FocusMode.exit()">✕ خروج</button>
                </div>

                <div class="focus-plan-name">${plan.icon} ${plan.name}</div>
                <div class="focus-task-name">${task.name}</div>

                ${subs.length > 0 ? `
                    <div style="font-size:0.78rem;color:var(--text-secondary);margin-bottom:0.5rem">
                        الدروس: ${subsDone}/${subs.length}
                    </div>
                    <div class="progress-track" style="height:6px">
                        <div class="progress-fill fill-success" style="width:${subs.length ? (subsDone/subs.length*100) : 0}%"></div>
                    </div>
                ` : ''}

                <div id="focus-mode-label" style="font-size:0.85rem;color:var(--text-secondary);margin-top:1rem">
                    ${this.getModeLabel()}
                </div>

                <div class="focus-timer ${this.focusMode}" id="focus-timer-display">
                    ${this.formatTime()}
                </div>

                <div class="focus-controls">
                    <button class="btn btn-primary" id="focus-start-btn" onclick="FocusMode.start()"
                            style="${this.focusRunning ? 'display:none' : ''}">▶ بدء</button>
                    <button class="btn btn-danger" id="focus-pause-btn" onclick="FocusMode.pause()"
                            style="${!this.focusRunning ? 'display:none' : ''}">⏸ إيقاف</button>
                    <button class="btn btn-ghost" onclick="FocusMode.reset()">↺ إعادة</button>
                    <button class="btn btn-success" onclick="FocusMode.completeTask()">✅ إكمال المهمة</button>
                </div>

                <div class="focus-stats">
                    <div>
                        <span class="focus-stat-value" id="focus-sessions-count">${this.focusSessions}</span>
                        جلسات
                    </div>
                    <div>
                        <span class="focus-stat-value" id="focus-elapsed">${this.getElapsed()}</span>
                        وقت منقضي
                    </div>
                </div>

                ${subs.length > 0 ? `
                    <div class="focus-subs">
                        <h4>📝 الدروس الفرعية</h4>
                        ${subs.map((s, i) => `
                            <div class="focus-sub-item">
                                <div class="focus-sub-check ${s.status === 'done' ? 'done' : ''}"
                                     onclick="FocusMode.toggleFocusSub(${i})">
                                    ${s.status === 'done' ? '✓' : ''}
                                </div>
                                <span style="${s.status === 'done' ? 'text-decoration:line-through;opacity:0.4' : ''}">${s.name}</span>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}

                ${links.length > 0 ? `
                    <div style="margin-top:1rem;text-align:right;border-top:1px solid var(--border);padding-top:0.75rem">
                        <h4 style="font-size:0.85rem;margin-bottom:0.5rem">🔗 روابط مرتبطة</h4>
                        ${links.map(l => `
                            <div class="link-item">
                                <span>${l.type === 'video' ? '🎬' : l.type === 'article' ? '📄' : l.type === 'course' ? '🎓' : '🔗'}</span>
                                <a href="${l.url}" target="_blank" rel="noopener">${l.title || l.url}</a>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}

                <textarea class="focus-notes" id="focus-notes"
                          placeholder="ملاحظات أثناء التركيز..."
                          onblur="FocusMode._saveNotes()">${task.notes || ''}</textarea>
            </div>
        `;

        document.body.appendChild(overlay);
    }
};

// =============================================================
//  🔗 #7 - LINK TRACKING
//  ربط مصادر/روابط بأي مهمة
// =============================================================
const LinkTracker = {
    linkTypes: [
        { value: 'video', label: '🎬 فيديو' },
        { value: 'article', label: '📄 مقال' },
        { value: 'course', label: '🎓 كورس' },
        { value: 'docs', label: '📚 توثيق' },
        { value: 'github', label: '💻 GitHub' },
        { value: 'other', label: '🔗 أخرى' }
    ],

    // ---- فتح نافذة إدارة الروابط ----
    open(planId, groupId, taskId) {
        const found = findTask(planId, groupId, taskId);
        if (!found || !found.task) return;

        const task = found.task;
        if (!task.links) task.links = [];

        const linksHtml = task.links.length === 0
            ? '<p style="color:var(--text-secondary);text-align:center;padding:1rem;font-size:0.85rem">لا توجد روابط. أضف أول رابط!</p>'
            : task.links.map((link, i) => `
                <div class="link-item" style="padding:0.5rem 0">
                    <span>${this._getIcon(link.type)}</span>
                    <a href="${link.url}" target="_blank" rel="noopener" style="flex:1">${link.title || link.url}</a>
                    <span class="link-type">${this._getLabel(link.type)}</span>
                    <button class="task-btn" onclick="LinkTracker.editLink('${planId}','${groupId}','${taskId}',${i})" title="تعديل">✏️</button>
                    <button class="task-btn delete" onclick="LinkTracker.removeLink('${planId}','${groupId}','${taskId}',${i})" title="حذف">✕</button>
                </div>
            `).join('');

        openModal(`🔗 روابط: ${task.name}`, `
            <div class="links-list" id="links-list">
                ${linksHtml}
            </div>

            <div style="border-top:1px solid var(--border);padding-top:1rem;margin-top:0.75rem">
                <h4 style="font-size:0.85rem;margin-bottom:0.5rem">إضافة رابط جديد</h4>
                <div class="setup-form">
                    <input type="text" id="link-title-input" class="input-field"
                           placeholder="عنوان الرابط (اختياري)">
                    <input type="url" id="link-url-input" class="input-field"
                           placeholder="https://..."
                           onkeydown="if(event.key==='Enter')LinkTracker.addLink('${planId}','${groupId}','${taskId}')">
                    <div style="display:flex;gap:0.3rem;flex-wrap:wrap">
                        ${this.linkTypes.map(t => `
                            <button class="btn btn-ghost btn-sm link-type-btn"
                                    data-type="${t.value}"
                                    onclick="LinkTracker._selectType(this,'${t.value}')">
                                ${t.label}
                            </button>
                        `).join('')}
                    </div>
                    <input type="hidden" id="link-type-input" value="other">
                    <button class="btn btn-primary" style="margin-top:0.5rem"
                            onclick="LinkTracker.addLink('${planId}','${groupId}','${taskId}')">
                        + إضافة رابط
                    </button>
                </div>
            </div>
        `);

        setTimeout(() => document.getElementById('link-url-input')?.focus(), 100);
    },

    // ---- إضافة رابط ----
    addLink(planId, groupId, taskId) {
        const urlInput = document.getElementById('link-url-input');
        const titleInput = document.getElementById('link-title-input');
        const typeInput = document.getElementById('link-type-input');

        if (!urlInput || !urlInput.value.trim()) {
            toast('أدخل رابط!', 'error');
            return;
        }

        let url = urlInput.value.trim();
        if (!url.startsWith('http')) url = 'https://' + url;

        const found = findTask(planId, groupId, taskId);
        if (!found || !found.task) return;
        if (!found.task.links) found.task.links = [];

        // تخمين العنوان من URL إذا لم يُدخل
        let title = titleInput?.value.trim() || '';
        if (!title) {
            try {
                const urlObj = new URL(url);
                title = urlObj.hostname.replace('www.', '');
            } catch {
                title = url.substring(0, 40);
            }
        }

        // تخمين النوع من URL
        let type = typeInput?.value || 'other';
        if (type === 'other') {
            type = this._guessType(url);
        }

        found.task.links.push({ url, title, type });
        save();

        // أعد فتح النافذة
        this.open(planId, groupId, taskId);
        toast('تم إضافة الرابط ✅', 'success');
    },

    // ---- حذف رابط ----
    removeLink(planId, groupId, taskId, index) {
        const found = findTask(planId, groupId, taskId);
        if (!found || !found.task) return;
        found.task.links.splice(index, 1);
        save();
        this.open(planId, groupId, taskId);
    },

    // ---- تعديل رابط ----
    editLink(planId, groupId, taskId, index) {
        const found = findTask(planId, groupId, taskId);
        if (!found || !found.task) return;
        const link = found.task.links[index];
        if (!link) return;

        openModal('✏️ تعديل الرابط', `
            <div class="setup-form">
                <label>العنوان</label>
                <input type="text" id="edit-link-title" class="input-field" value="${link.title || ''}">
                <label>الرابط</label>
                <input type="url" id="edit-link-url" class="input-field" value="${link.url}">
                <label>النوع</label>
                <select id="edit-link-type" class="input-field">
                    ${this.linkTypes.map(t =>
                        `<option value="${t.value}" ${link.type === t.value ? 'selected' : ''}>${t.label}</option>`
                    ).join('')}
                </select>
            </div>
            <div style="display:flex;gap:0.5rem;margin-top:1rem">
                <button class="btn btn-primary" onclick="LinkTracker._saveEdit('${planId}','${groupId}','${taskId}',${index})">حفظ</button>
                <button class="btn btn-ghost" onclick="LinkTracker.open('${planId}','${groupId}','${taskId}')">رجوع</button>
            </div>
        `);
    },

    _saveEdit(planId, groupId, taskId, index) {
        const found = findTask(planId, groupId, taskId);
        if (!found || !found.task) return;

        const link = found.task.links[index];
        if (!link) return;

        link.title = document.getElementById('edit-link-title')?.value.trim() || link.title;
        link.url = document.getElementById('edit-link-url')?.value.trim() || link.url;
        link.type = document.getElementById('edit-link-type')?.value || link.type;

        save();
        this.open(planId, groupId, taskId);
        toast('تم التعديل ✅', 'success');
    },

    // ---- اختيار النوع ----
    _selectType(btn, type) {
        document.querySelectorAll('.link-type-btn').forEach(b => {
            b.classList.remove('btn-primary');
            b.classList.add('btn-ghost');
        });
        btn.classList.remove('btn-ghost');
        btn.classList.add('btn-primary');
        document.getElementById('link-type-input').value = type;
    },

    // ---- تخمين النوع من URL ----
    _guessType(url) {
        const u = url.toLowerCase();
        if (u.includes('youtube') || u.includes('youtu.be') || u.includes('vimeo')) return 'video';
        if (u.includes('github.com') || u.includes('gitlab')) return 'github';
        if (u.includes('udemy') || u.includes('coursera') || u.includes('edx')) return 'course';
        if (u.includes('docs.') || u.includes('documentation') || u.includes('readthedocs')) return 'docs';
        if (u.includes('medium') || u.includes('dev.to') || u.includes('blog')) return 'article';
        return 'other';
    },

    // ---- أيقونة النوع ----
    _getIcon(type) {
        const icons = { video: '🎬', article: '📄', course: '🎓', docs: '📚', github: '💻', other: '🔗' };
        return icons[type] || '🔗';
    },

    // ---- تسمية النوع ----
    _getLabel(type) {
        const labels = { video: 'فيديو', article: 'مقال', course: 'كورس', docs: 'توثيق', github: 'GitHub', other: 'أخرى' };
        return labels[type] || 'أخرى';
    }
};

// =============================================================
//  🔌 ربط الميزات بالكود الحالي
//  Override renderTask لإضافة الأزرار الجديدة
// =============================================================
(function patchRenderTask() {
    const _originalRenderTask = window.renderTask;

    window.renderTask = function(planId, groupId, task) {
        // استدعي الأصلي
        let html = _originalRenderTask(planId, groupId, task);

        // أضف عدد الروابط كـ badge
        const linksCount = (task.links || []).length;
        if (linksCount > 0) {
            const badgeHtml = `<span class="badge badge-link">🔗 ${linksCount}</span>`;
            html = html.replace('</div>\n            <div class="task-actions">',
                badgeHtml + '</div>\n            <div class="task-actions">');
        }

        // أضف أزرار جديدة في task-actions
        const focusBtn = `<button class="task-btn" onclick="event.stopPropagation();FocusMode.enter('${planId}','${groupId}','${task.id}')" title="وضع التركيز">🎯</button>`;
        const linkBtn = `<button class="task-btn" onclick="event.stopPropagation();LinkTracker.open('${planId}','${groupId}','${task.id}')" title="روابط">🔗</button>`;

        // أدخل قبل زر البومودورو
        html = html.replace(
            `onclick="startPomodoroForTask('${planId}','${groupId}','${task.id}')" title="بومودورو">🍅</button>`,
            `onclick="startPomodoroForTask('${planId}','${groupId}','${task.id}')" title="بومودورو">🍅</button>${focusBtn}${linkBtn}`
        );

        return html;
    };
})();

// =============================================================
//  ⌨️ اختصار Focus Mode: Alt + F
// =============================================================
document.addEventListener('keydown', (e) => {
    if (e.altKey && e.key === 'f') {
        e.preventDefault();
        if (FocusMode.active) {
            FocusMode.exit();
        } else {
            toast('اختر مهمة واضغط 🎯 لدخول وضع التركيز', 'info');
        }
    }
});

// =============================================================
//  تحديث SW cache
// =============================================================
if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    // أضف features.js و features.css للكاش
    caches.open('learning-journey-v3.1').then(cache => {
        cache.addAll(['./features.js', './features.css']).catch(() => {});
    });
}

console.log('✅ Features v3.1 loaded: Focus Mode + Link Tracking');
// =============================================================
//  🗓️ #4 - HEATMAP CALENDAR
//  خريطة حرارية للنشاط مثل GitHub Contributions
// =============================================================

const Heatmap = {
    currentYear: new Date().getFullYear(),
    currentFilter: 'all',
    tooltip: null,

    // ---- جمع بيانات النشاط لكل يوم ----
    getActivityData(year) {
        const activities = {};

        // 1. بومودورو
        Object.entries(data.pomodoroLog || {}).forEach(([date, mins]) => {
            if (date.startsWith(String(year))) {
                if (!activities[date]) activities[date] = { pomodoro: 0, tasks: 0, journal: 0, subs: 0 };
                activities[date].pomodoro = mins;
            }
        });

        // 2. مهام مكتملة (نقدّر من date field)
        data.plans.forEach(p => p.groups.forEach(g => g.tasks.forEach(t => {
            if (t.status === 'done' && t.date && t.date.startsWith(String(year))) {
                if (!activities[t.date]) activities[t.date] = { pomodoro: 0, tasks: 0, journal: 0, subs: 0 };
                activities[t.date].tasks++;
            }
        })));

        // 3. يوميات
        (data.journalEntries || []).forEach(entry => {
            const date = entry.date ? entry.date.split('T')[0] : null;
            if (date && date.startsWith(String(year))) {
                if (!activities[date]) activities[date] = { pomodoro: 0, tasks: 0, journal: 0, subs: 0 };
                activities[date].journal++;
            }
        });

        // 4. lastActive (ضمان يوم النشاط الحالي)
        if (data.lastActive && data.lastActive.startsWith(String(year))) {
            if (!activities[data.lastActive]) {
                activities[data.lastActive] = { pomodoro: 0, tasks: 0, journal: 0, subs: 0 };
            }
        }

        return activities;
    },

    // ---- حساب مستوى النشاط (0-4) ----
    getLevel(activity, filter) {
        if (!activity) return 0;

        let score = 0;

        switch (filter) {
            case 'pomodoro':
                score = activity.pomodoro || 0;
                if (score >= 120) return 4;
                if (score >= 60) return 3;
                if (score >= 25) return 2;
                if (score > 0) return 1;
                return 0;

            case 'tasks':
                score = activity.tasks || 0;
                if (score >= 5) return 4;
                if (score >= 3) return 3;
                if (score >= 2) return 2;
                if (score > 0) return 1;
                return 0;

            case 'journal':
                return (activity.journal || 0) > 0 ? 3 : 0;

            default: // all
                score = (activity.pomodoro || 0) / 15
                    + (activity.tasks || 0) * 3
                    + (activity.journal || 0) * 2;
                if (score >= 15) return 4;
                if (score >= 8) return 3;
                if (score >= 3) return 2;
                if (score > 0) return 1;
                return 0;
        }
    },

    // ---- بناء شبكة الأيام ----
    buildGrid(year) {
        const activities = this.getActivityData(year);
        const startDate = new Date(year, 0, 1);
        const endDate = new Date(year, 11, 31);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // ابدأ من أول أحد
        const firstDay = new Date(startDate);
        firstDay.setDate(firstDay.getDate() - firstDay.getDay());

        const weeks = [];
        let current = new Date(firstDay);

        while (current <= endDate || weeks.length < 53) {
            const week = [];
            for (let d = 0; d < 7; d++) {
                const dateStr = current.toISOString().split('T')[0];
                const isInYear = current.getFullYear() === year;
                const isFuture = current > today;
                const activity = activities[dateStr];
                const level = (isInYear && !isFuture) ? this.getLevel(activity, this.currentFilter) : -1;

                week.push({
                    date: dateStr,
                    level,
                    activity: activity || null,
                    isInYear,
                    isFuture,
                    month: current.getMonth()
                });

                current.setDate(current.getDate() + 1);
            }
            weeks.push(week);

            if (current.getFullYear() > year && current.getDay() === 0) break;
        }

        return { weeks, activities };
    },

    // ---- حساب الإحصائيات ----
    getStats(activities) {
        const dates = Object.keys(activities);
        let totalDays = dates.length;
        let totalPomodoro = 0;
        let totalTasks = 0;
        let totalJournal = 0;
        let longestStreak = 0;
        let currentStreak = 0;
        let maxPomodoro = 0;
        let maxPomodoroDate = '';

        // ترتيب التواريخ
        const sortedDates = dates.sort();

        sortedDates.forEach((date, i) => {
            const a = activities[date];
            totalPomodoro += a.pomodoro || 0;
            totalTasks += a.tasks || 0;
            totalJournal += a.journal || 0;

            if (a.pomodoro > maxPomodoro) {
                maxPomodoro = a.pomodoro;
                maxPomodoroDate = date;
            }

            // حساب أطول سلسلة
            if (i === 0) {
                currentStreak = 1;
            } else {
                const prev = new Date(sortedDates[i - 1]);
                const curr = new Date(date);
                const diff = (curr - prev) / 86400000;
                if (diff === 1) {
                    currentStreak++;
                } else {
                    currentStreak = 1;
                }
            }
            longestStreak = Math.max(longestStreak, currentStreak);
        });

        return {
            totalDays,
            totalPomodoro: Math.round(totalPomodoro),
            totalTasks,
            totalJournal,
            longestStreak,
            maxPomodoro: Math.round(maxPomodoro),
            maxPomodoroDate,
            avgPomodoro: totalDays > 0 ? Math.round(totalPomodoro / totalDays) : 0
        };
    },

    // ---- Tooltip ----
    showTooltip(e, day) {
        this.hideTooltip();
        if (!day.isInYear || day.isFuture) return;

        const tip = document.createElement('div');
        tip.className = 'heatmap-tooltip';
        tip.id = 'heatmap-tooltip';

        const dateLabel = new Date(day.date).toLocaleDateString('ar-EG', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
        });

        let details = '';
        if (day.activity) {
            const a = day.activity;
            if (a.pomodoro > 0) details += `🍅 ${Math.round(a.pomodoro)} دقيقة تعلم<br>`;
            if (a.tasks > 0) details += `✅ ${a.tasks} مهمة مكتملة<br>`;
            if (a.journal > 0) details += `📝 ${a.journal} يومية<br>`;
        }

        if (!details) details = 'لا يوجد نشاط';

        tip.innerHTML = `
            <div class="heatmap-tooltip-date">${dateLabel}</div>
            <div class="heatmap-tooltip-details">${details}</div>
        `;

        document.body.appendChild(tip);

        // حساب الموقع
        const rect = e.target.getBoundingClientRect();
        let top = rect.top - tip.offsetHeight - 8;
        let left = rect.left + rect.width / 2 - tip.offsetWidth / 2;

        if (top < 10) top = rect.bottom + 8;
        if (left < 10) left = 10;
        if (left + tip.offsetWidth > window.innerWidth - 10) {
            left = window.innerWidth - tip.offsetWidth - 10;
        }

        tip.style.top = top + 'px';
        tip.style.left = left + 'px';
    },

    hideTooltip() {
        document.getElementById('heatmap-tooltip')?.remove();
    },

    // ---- النقر على يوم ----
    clickDay(dateStr) {
        this.hideTooltip();
        if (typeof showDayDetail === 'function') {
            showDayDetail(dateStr);
        }
    },

    // ---- تغيير الفلتر ----
    setFilter(filter) {
        this.currentFilter = filter;
        this.renderInPlace();
    },

    // ---- تغيير السنة ----
    setYear(delta) {
        this.currentYear += delta;
        const now = new Date().getFullYear();
        if (this.currentYear > now) this.currentYear = now;
        if (this.currentYear < now - 5) this.currentYear = now - 5;
        this.renderInPlace();
    },

    // ---- إعادة رسم في المكان ----
    renderInPlace() {
        const container = document.getElementById('heatmap-root');
        if (!container) return;
        container.innerHTML = this._buildHTML();
    },

    // ---- أسماء الأشهر ----
    _getMonthLabels(weeks) {
        const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
            'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];

        const labels = [];
        let lastMonth = -1;

        weeks.forEach((week, i) => {
            const firstDayInYear = week.find(d => d.isInYear);
            if (firstDayInYear && firstDayInYear.month !== lastMonth) {
                labels.push({ index: i, name: months[firstDayInYear.month] });
                lastMonth = firstDayInYear.month;
            }
        });

        return labels;
    },

    // ---- بناء HTML ----
    _buildHTML() {
        const { weeks, activities } = this.buildGrid(this.currentYear);
        const stats = this.getStats(activities);
        const monthLabels = this._getMonthLabels(weeks);
        const dayNames = ['', 'إثن', '', 'أرب', '', 'جمع', ''];

        return `
            <!-- Filters -->
            <div class="heatmap-filters">
                <button class="heatmap-filter-btn ${this.currentFilter === 'all' ? 'active' : ''}"
                        onclick="Heatmap.setFilter('all')">📊 الكل</button>
                <button class="heatmap-filter-btn ${this.currentFilter === 'pomodoro' ? 'active' : ''}"
                        onclick="Heatmap.setFilter('pomodoro')">🍅 بومودورو</button>
                <button class="heatmap-filter-btn ${this.currentFilter === 'tasks' ? 'active' : ''}"
                        onclick="Heatmap.setFilter('tasks')">✅ مهام</button>
                <button class="heatmap-filter-btn ${this.currentFilter === 'journal' ? 'active' : ''}"
                        onclick="Heatmap.setFilter('journal')">📝 يوميات</button>
            </div>

            <!-- Heatmap -->
            <div class="heatmap-container">
                <div style="display:flex;gap:0.15rem">
                    <!-- Day Labels -->
                    <div class="heatmap-day-labels">
                        ${dayNames.map(d => `<div class="heatmap-day-label">${d}</div>`).join('')}
                    </div>

                    <!-- Grid -->
                    <div>
                        <!-- Month Labels -->
                        <div style="display:flex;gap:0.15rem;margin-bottom:0.25rem;height:14px">
                            ${weeks.map((_, i) => {
                                const label = monthLabels.find(l => l.index === i);
                                return `<div style="width:14px;font-size:0.6rem;color:var(--text-secondary);text-align:center;overflow:visible;white-space:nowrap">${label ? label.name : ''}</div>`;
                            }).join('')}
                        </div>

                        <div class="heatmap-grid">
                            ${weeks.map(week => `
                                <div class="heatmap-week">
                                    ${week.map(day => {
                                        if (!day.isInYear || day.isFuture) {
                                            return `<div class="heatmap-cell" style="opacity:0.1;background:var(--border-light)"></div>`;
                                        }
                                        return `<div class="heatmap-cell heatmap-level-${day.level}"
                                                     onmouseenter="Heatmap.showTooltip(event,${JSON.stringify(day).replace(/"/g, '&quot;')})"
                                                     onmouseleave="Heatmap.hideTooltip()"
                                                     onclick="Heatmap.clickDay('${day.date}')">
                                                </div>`;
                                    }).join('')}
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>

            <!-- Legend -->
            <div class="heatmap-legend">
                <span>أقل</span>
                <div class="heatmap-legend-cell heatmap-level-0"></div>
                <div class="heatmap-legend-cell heatmap-level-1"></div>
                <div class="heatmap-legend-cell heatmap-level-2"></div>
                <div class="heatmap-legend-cell heatmap-level-3"></div>
                <div class="heatmap-legend-cell heatmap-level-4"></div>
                <span>أكثر</span>
            </div>

            <!-- Stats -->
            <div class="heatmap-summary">
                <div class="heatmap-stat">
                    <div class="heatmap-stat-value" style="color:var(--success)">${stats.totalDays}</div>
                    <div class="heatmap-stat-label">يوم نشط</div>
                </div>
                <div class="heatmap-stat">
                    <div class="heatmap-stat-value" style="color:var(--primary)">${stats.longestStreak}</div>
                    <div class="heatmap-stat-label">أطول سلسلة</div>
                </div>
                <div class="heatmap-stat">
                    <div class="heatmap-stat-value" style="color:var(--danger)">${Math.round(stats.totalPomodoro / 60 * 10) / 10}</div>
                    <div class="heatmap-stat-label">ساعة تعلم</div>
                </div>
                <div class="heatmap-stat">
                    <div class="heatmap-stat-value" style="color:var(--warning)">${stats.totalTasks}</div>
                    <div class="heatmap-stat-label">مهمة مكتملة</div>
                </div>
                <div class="heatmap-stat">
                    <div class="heatmap-stat-value">${stats.avgPomodoro}</div>
                    <div class="heatmap-stat-label">د/يوم متوسط</div>
                </div>
                <div class="heatmap-stat">
                    <div class="heatmap-stat-value">${stats.totalJournal}</div>
                    <div class="heatmap-stat-label">يومية</div>
                </div>
            </div>
        `;
    },

    // ---- الرسم الكامل (يُستدعى من render) ----
    renderSection() {
        return `
            <div class="card heatmap-section">
                <div class="card-header">
                    <div class="card-title">🗓️ خريطة النشاط</div>
                    <div class="heatmap-year-selector">
                        <button onclick="Heatmap.setYear(-1)">◀</button>
                        <span>${this.currentYear}</span>
                        <button onclick="Heatmap.setYear(1)">▶</button>
                    </div>
                </div>
                <div id="heatmap-root">
                    ${this._buildHTML()}
                </div>
            </div>
        `;
    }
};

// =============================================================
//  🔌 ربط Heatmap بالداشبورد والإحصائيات
// =============================================================
(function patchDashboard() {
    const _originalRenderDashboard = window.renderDashboard;

    window.renderDashboard = function (c) {
        _originalRenderDashboard(c);

        // أضف Heatmap قبل الإنجازات
        const achievementsCard = c.querySelector('.achievements-grid')?.closest('.card');
        if (achievementsCard) {
            const heatmapDiv = document.createElement('div');
            heatmapDiv.innerHTML = Heatmap.renderSection();
            achievementsCard.parentNode.insertBefore(heatmapDiv.firstElementChild, achievementsCard);
        } else {
            // أضف في النهاية
            c.insertAdjacentHTML('beforeend', Heatmap.renderSection());
        }
    };

    const _originalRenderStatsPage = window.renderStatsPage;

    window.renderStatsPage = function (c) {
        _originalRenderStatsPage(c);
        c.insertAdjacentHTML('beforeend', Heatmap.renderSection());
    };
})();

// إزالة tooltip عند التمرير
document.addEventListener('scroll', () => Heatmap.hideTooltip(), true);

console.log('✅ Heatmap v3.1 loaded');
// =============================================================
//  📸 #2 - SHARE AS IMAGE
//  تصوير بطاقة التقدم وتحميلها كصورة PNG
// =============================================================

const ShareCard = {
    currentBg: 'gradient1',

    backgrounds: [
        { id: 'gradient1', css: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
        { id: 'gradient2', css: 'linear-gradient(135deg, #0f2027, #203a43, #2c5364)' },
        { id: 'gradient3', css: 'linear-gradient(135deg, #11998e, #38ef7d)' },
        { id: 'gradient4', css: 'linear-gradient(135deg, #ee0979, #ff6a00)' },
        { id: 'gradient5', css: 'linear-gradient(135deg, #2d1b69, #6b21a8, #a855f7)' },
        { id: 'dark', css: 'linear-gradient(135deg, #0f1117, #1a1b23, #24252e)' }
    ],

    // ---- فتح نافذة المشاركة ----
    open() {
        const s = getStats();
        const taskPct = s.totalTasks ? Math.round(s.doneTasks / s.totalTasks * 100) : 0;
        const totalHours = Math.round(s.totalPomodoroMins / 60 * 10) / 10;

        openModal('📸 مشاركة التقدم كصورة', `
            <div style="max-width:100%">
                <!-- خيارات الخلفية -->
                <div class="share-options">
                    <label>الخلفية:</label>
                    ${this.backgrounds.map(bg => `
                        <div class="share-bg-option ${this.currentBg === bg.id ? 'active' : ''}"
                             style="background:${bg.css}"
                             onclick="ShareCard.setBg('${bg.id}')">
                        </div>
                    `).join('')}
                </div>

                <!-- معاينة البطاقة -->
                <div class="share-canvas-wrapper" id="share-capture-area">
                    <div class="share-card share-bg-${this.currentBg}" id="share-card-inner">
                        <div class="share-card-pattern"></div>

                        <div class="share-card-header">
                            <div class="share-card-logo">🎯 رحلة التعلم</div>
                            <div class="share-card-date">${new Date().toLocaleDateString('ar-EG', {
                                year: 'numeric', month: 'long', day: 'numeric'
                            })}</div>
                        </div>

                        <div class="share-card-body">
                            <div class="share-card-title">التقدم العام ${taskPct}%</div>
                            <div class="share-card-subtitle">
                                ${data.streak >= 7 ? '🔥' : '🌱'} سلسلة ${data.streak} يوم متواصل
                            </div>

                            <div class="share-stats-row">
                                <div class="share-stat-box">
                                    <div class="share-stat-num">${s.doneTasks}</div>
                                    <div class="share-stat-label">مهمة مكتملة</div>
                                </div>
                                <div class="share-stat-box">
                                    <div class="share-stat-num">${s.donePhases}</div>
                                    <div class="share-stat-label">مرحلة مشروع</div>
                                </div>
                                <div class="share-stat-box">
                                    <div class="share-stat-num">${totalHours}</div>
                                    <div class="share-stat-label">ساعة تعلم</div>
                                </div>
                                <div class="share-stat-box">
                                    <div class="share-stat-num">${s.achievementsCount}</div>
                                    <div class="share-stat-label">إنجاز</div>
                                </div>
                            </div>

                            <div class="share-plans-list">
                                ${data.plans.map(p => {
                                    let total = 0, done = 0;
                                    p.groups.forEach(g => g.tasks.forEach(t => { total++; if (t.status === 'done') done++; }));
                                    const pct = total ? Math.round(done / total * 100) : 0;
                                    return `
                                        <div class="share-plan-row">
                                            <span>${p.icon}</span>
                                            <span style="min-width:60px;font-size:0.82rem">${p.name.length > 20 ? p.name.substring(0, 20) + '...' : p.name}</span>
                                            <div class="share-plan-bar">
                                                <div class="share-plan-fill" style="width:${pct}%"></div>
                                            </div>
                                            <span class="share-plan-pct">${pct}%</span>
                                        </div>
                                    `;
                                }).join('')}
                            </div>
                        </div>

                        <div class="share-card-footer">
                            <span>🏆 ${s.achievementsCount}/${Achievements.list.length} إنجازات</span>
                            <span>📚 ${s.totalTasks} موضوع</span>
                        </div>
                    </div>
                </div>

                <!-- أزرار -->
                <div class="share-actions" style="margin-top:1rem">
                    <button class="btn btn-primary" onclick="ShareCard.download()">
                        📥 تحميل كصورة
                    </button>
                    <button class="btn btn-success" onclick="ShareCard.copyToClipboard()">
                        📋 نسخ للحافظة
                    </button>
                    <button class="btn btn-ghost" onclick="ShareCard.shareNative()">
                        📤 مشاركة
                    </button>
                    <button class="btn btn-ghost" onclick="closeModal()">إغلاق</button>
                </div>
            </div>
        `);
    },

    // ---- تغيير الخلفية ----
    setBg(bgId) {
        this.currentBg = bgId;
        const card = document.getElementById('share-card-inner');
        if (!card) return;

        // إزالة كل كلاسات الخلفية
        this.backgrounds.forEach(bg => card.classList.remove('share-bg-' + bg.id));
        card.classList.add('share-bg-' + bgId);

        // تحديث الزر النشط
        document.querySelectorAll('.share-bg-option').forEach(el => el.classList.remove('active'));
        event.target.classList.add('active');
    },

    // ---- تحويل العنصر لـ Canvas ----
    async _elementToCanvas(element) {
        // استخدام html2canvas إذا متوفر
        if (typeof html2canvas !== 'undefined') {
            return await html2canvas(element, {
                scale: 2,
                useCORS: true,
                allowTaint: true,
                backgroundColor: null,
                logging: false
            });
        }

        // Fallback: رسم يدوي على Canvas
        return this._manualCanvasRender(element);
    },

    // ---- رسم يدوي بدون مكتبة ----
    _manualCanvasRender(element) {
        return new Promise((resolve) => {
            const rect = element.getBoundingClientRect();
            const scale = 2;
            const canvas = document.createElement('canvas');
            canvas.width = rect.width * scale;
            canvas.height = rect.height * scale;
            const ctx = canvas.getContext('2d');
            ctx.scale(scale, scale);

            // الخلفية
            const bgDef = this.backgrounds.find(b => b.id === this.currentBg);
            this._drawGradientBackground(ctx, rect.width, rect.height, bgDef);

            // النمط
            ctx.globalAlpha = 0.07;
            for (let x = 0; x < rect.width; x += 60) {
                for (let y = 0; y < rect.height; y += 60) {
                    ctx.beginPath();
                    ctx.arc(x + 20, y + 20, 1.5, 0, Math.PI * 2);
                    ctx.fillStyle = 'white';
                    ctx.fill();
                }
            }
            ctx.globalAlpha = 1;

            // النصوص
            const s = getStats();
            const taskPct = s.totalTasks ? Math.round(s.doneTasks / s.totalTasks * 100) : 0;
            const totalHours = Math.round(s.totalPomodoroMins / 60 * 10) / 10;
            const padding = 32;
            let y = padding;

            // RTL
            ctx.direction = 'rtl';
            ctx.textAlign = 'right';
            const rightEdge = rect.width - padding;

            // العنوان
            ctx.fillStyle = 'white';
            ctx.font = 'bold 20px -apple-system, sans-serif';
            ctx.fillText('🎯 رحلة التعلم', rightEdge, y + 20);

            ctx.font = '12px -apple-system, sans-serif';
            ctx.globalAlpha = 0.8;
            ctx.textAlign = 'left';
            ctx.fillText(new Date().toLocaleDateString('ar-EG'), padding, y + 20);
            ctx.globalAlpha = 1;
            ctx.textAlign = 'right';

            y += 55;

            // النسبة
            ctx.font = 'bold 28px -apple-system, sans-serif';
            ctx.fillText(`التقدم العام ${taskPct}%`, rightEdge, y);

            y += 30;
            ctx.font = '14px -apple-system, sans-serif';
            ctx.globalAlpha = 0.85;
            ctx.fillText(`${data.streak >= 7 ? '🔥' : '🌱'} سلسلة ${data.streak} يوم متواصل`, rightEdge, y);
            ctx.globalAlpha = 1;

            y += 40;

            // الإحصائيات
            const stats = [
                { num: s.doneTasks, label: 'مهمة' },
                { num: s.donePhases, label: 'مرحلة' },
                { num: totalHours, label: 'ساعة' },
                { num: s.achievementsCount, label: 'إنجاز' }
            ];

            const boxW = (rect.width - padding * 2 - 24) / 4;
            stats.forEach((stat, i) => {
                const x = rightEdge - i * (boxW + 8);
                ctx.fillStyle = 'rgba(255,255,255,0.15)';
                this._roundRect(ctx, x - boxW, y, boxW, 60, 10);
                ctx.fill();

                ctx.fillStyle = 'white';
                ctx.textAlign = 'center';
                ctx.font = 'bold 22px -apple-system, sans-serif';
                ctx.fillText(String(stat.num), x - boxW / 2, y + 28);

                ctx.font = '10px -apple-system, sans-serif';
                ctx.globalAlpha = 0.8;
                ctx.fillText(stat.label, x - boxW / 2, y + 48);
                ctx.globalAlpha = 1;
            });

            ctx.textAlign = 'right';

            y += 85;

            // الخطط
            data.plans.forEach(p => {
                let total = 0, done = 0;
                p.groups.forEach(g => g.tasks.forEach(t => { total++; if (t.status === 'done') done++; }));
                const pct = total ? Math.round(done / total * 100) : 0;

                ctx.fillStyle = 'white';
                ctx.font = '13px -apple-system, sans-serif';

                const name = p.name.length > 25 ? p.name.substring(0, 25) + '...' : p.name;
                ctx.fillText(`${p.icon} ${name}`, rightEdge, y);

                ctx.textAlign = 'left';
                ctx.font = 'bold 12px -apple-system, sans-serif';
                ctx.fillText(`${pct}%`, padding, y);
                ctx.textAlign = 'right';

                // شريط
                const barY = y + 5;
                const barW = rect.width - padding * 2 - 120;
                const barX = padding + 40;

                ctx.fillStyle = 'rgba(255,255,255,0.2)';
                this._roundRect(ctx, barX, barY, barW, 6, 3);
                ctx.fill();

                ctx.fillStyle = 'rgba(255,255,255,0.8)';
                this._roundRect(ctx, barX, barY, barW * pct / 100, 6, 3);
                ctx.fill();

                y += 28;
            });

            // Footer
            y = rect.height - padding;
            ctx.fillStyle = 'rgba(255,255,255,0.5)';
            ctx.font = '11px -apple-system, sans-serif';
            ctx.fillText(`🏆 ${s.achievementsCount}/${Achievements.list.length} إنجازات`, rightEdge, y);

            ctx.textAlign = 'left';
            ctx.fillText(`📚 ${s.totalTasks} موضوع`, padding, y);

            resolve(canvas);
        });
    },

    _drawGradientBackground(ctx, w, h, bgDef) {
        const gradients = {
            gradient1: [['#667eea', 0], ['#764ba2', 1]],
            gradient2: [['#0f2027', 0], ['#203a43', 0.5], ['#2c5364', 1]],
            gradient3: [['#11998e', 0], ['#38ef7d', 1]],
            gradient4: [['#ee0979', 0], ['#ff6a00', 1]],
            gradient5: [['#2d1b69', 0], ['#6b21a8', 0.5], ['#a855f7', 1]],
            dark: [['#0f1117', 0], ['#1a1b23', 0.5], ['#24252e', 1]]
        };

        const colors = gradients[this.currentBg] || gradients.gradient1;
        const grad = ctx.createLinearGradient(0, 0, w, h);
        colors.forEach(([color, stop]) => grad.addColorStop(stop, color));
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
    },

    _roundRect(ctx, x, y, w, h, r) {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h - r);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        ctx.lineTo(x + r, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
    },

    // ---- تحميل كصورة ----
    async download() {
        try {
            toast('جاري إنشاء الصورة...', 'info');

            const element = document.getElementById('share-capture-area');
            const canvas = await this._elementToCanvas(element);

            const link = document.createElement('a');
            link.download = `learning-progress-${new Date().toISOString().split('T')[0]}.png`;
            link.href = canvas.toDataURL('image/png', 1.0);
            link.click();

            toast('تم تحميل الصورة ✅', 'success');
        } catch (err) {
            console.error('Download failed:', err);
            toast('فشل إنشاء الصورة ❌', 'error');
        }
    },

    // ---- نسخ للحافظة ----
    async copyToClipboard() {
        try {
            toast('جاري النسخ...', 'info');

            const element = document.getElementById('share-capture-area');
            const canvas = await this._elementToCanvas(element);

            canvas.toBlob(async (blob) => {
                if (!blob) {
                    toast('فشل إنشاء الصورة', 'error');
                    return;
                }

                try {
                    await navigator.clipboard.write([
                        new ClipboardItem({ 'image/png': blob })
                    ]);
                    toast('تم نسخ الصورة للحافظة ✅', 'success');
                } catch {
                    // Fallback: حمّل بدلاً من النسخ
                    const link = document.createElement('a');
                    link.download = 'learning-progress.png';
                    link.href = URL.createObjectURL(blob);
                    link.click();
                    toast('تم التحميل (النسخ غير مدعوم)', 'info');
                }
            }, 'image/png');
        } catch (err) {
            console.error('Copy failed:', err);
            toast('فشل النسخ ❌', 'error');
        }
    },

    // ---- مشاركة أصلية (Web Share API) ----
    async shareNative() {
        if (!navigator.share || !navigator.canShare) {
            toast('المشاركة غير مدعومة في هذا المتصفح', 'info');
            this.download();
            return;
        }

        try {
            toast('جاري التحضير...', 'info');

            const element = document.getElementById('share-capture-area');
            const canvas = await this._elementToCanvas(element);

            canvas.toBlob(async (blob) => {
                if (!blob) return;

                const file = new File([blob], 'learning-progress.png', { type: 'image/png' });

                const shareData = {
                    title: '🎯 تقدمي في رحلة التعلم',
                    text: `تقدمي: ${getStats().totalTasks ? Math.round(getStats().doneTasks / getStats().totalTasks * 100) : 0}% | 🔥 ${data.streak} يوم`,
                    files: [file]
                };

                if (navigator.canShare(shareData)) {
                    await navigator.share(shareData);
                    toast('تمت المشاركة ✅', 'success');
                } else {
                    this.download();
                }
            }, 'image/png');
        } catch (err) {
            if (err.name !== 'AbortError') {
                console.error('Share failed:', err);
                this.download();
            }
        }
    }
};

// =============================================================
//  🔌 ربط زر المشاركة بالداشبورد
// =============================================================
(function patchDashboardForShare() {
    const _prevRenderDashboard = window.renderDashboard;

    window.renderDashboard = function (c) {
        _prevRenderDashboard(c);

        // أضف زر المشاركة بجانب زر التقرير الأسبوعي
        const header = c.querySelector('.section-header');
        if (header) {
            const btnContainer = header.querySelector('div');
            if (btnContainer) {
                const shareBtn = document.createElement('button');
                shareBtn.className = 'btn btn-ghost btn-sm';
                shareBtn.innerHTML = '📸 مشاركة كصورة';
                shareBtn.onclick = () => ShareCard.open();
                btnContainer.appendChild(shareBtn);
            }
        }
    };
})();

// =============================================================
//  اختصار: Alt + S = مشاركة
// =============================================================
document.addEventListener('keydown', (e) => {
    if (e.altKey && e.key === 's') {
        e.preventDefault();
        ShareCard.open();
    }
});

console.log('✅ Share as Image v3.1 loaded');
// =============================================================
//  📝 #3 - MARKDOWN EDITOR WITH PREVIEW
// =============================================================

const MarkdownEditor = {

    // ---- تحويل Markdown إلى HTML ----
    parse(md) {
        if (!md || !md.trim()) return '<p style="color:var(--text-secondary)">لا يوجد محتوى للمعاينة</p>';

        let html = this._escapeHtml(md);

        // Code blocks (```)
        html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
            return `<pre><code class="lang-${lang}">${code.trim()}</code></pre>`;
        });

        // Inline code
        html = html.replace(/`([^`]+)`/g, '<code>\$1</code>');

        // Headers
        html = html.replace(/^### (.+)$/gm, '<h3>\$1</h3>');
        html = html.replace(/^## (.+)$/gm, '<h2>\$1</h2>');
        html = html.replace(/^# (.+)$/gm, '<h1>\$1</h1>');

        // Bold & Italic
        html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>\$1</em></strong>');
        html = html.replace(/\*\*(.+?)\*\*/g, '<strong>\$1</strong>');
        html = html.replace(/\*(.+?)\*/g, '<em>\$1</em>');

        // Strikethrough
        html = html.replace(/~~(.+?)~~/g, '<del>\$1</del>');

        // Highlight
        html = html.replace(/==(.+?)==/g, '<span class="highlight">\$1</span>');

        // Links
        html = html.replace(/$$([^$$]+)\]\(([^)]+)\)/g, '<a href="\$2" target="_blank" rel="noopener">\$1</a>');

        // Images
        html = html.replace(/!$$([^$$]*)\]\(([^)]+)\)/g, '<img src="\$2" alt="\$1">');

        // Blockquotes
        html = html.replace(/^> (.+)$/gm, '<blockquote>\$1</blockquote>');

        // Horizontal rule
        html = html.replace(/^---$/gm, '<hr>');

        // Task lists
        html = html.replace(/^- $$x$$ (.+)$/gm, '<li class="task-item"><input type="checkbox" checked disabled> \$1</li>');
        html = html.replace(/^- $$ $$ (.+)$/gm, '<li class="task-item"><input type="checkbox" disabled> \$1</li>');

        // Unordered lists
        html = html.replace(/^- (.+)$/gm, '<li>\$1</li>');
        html = html.replace(/(<li>.*<\/li>\n?)+/g, (match) => {
            if (match.includes('task-item')) return `<ul style="list-style:none;padding-right:0">${match}</ul>`;
            return `<ul>${match}</ul>`;
        });

        // Ordered lists
        html = html.replace(/^\d+\. (.+)$/gm, '<li>\$1</li>');

        // Tables
        html = this._parseTables(html);

        // Paragraphs
        html = html.replace(/^(?!<[huplbod]|<li|<hr|<blockquote|<pre|<table|<tr|<th|<td)(.+)$/gm, '<p>\$1</p>');

        // Clean empty paragraphs
        html = html.replace(/<p><\/p>/g, '');

        // Line breaks
        html = html.replace(/\n\n/g, '<br>');

        return html;
    },

    _escapeHtml(text) {
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    },

    _parseTables(html) {
        const lines = html.split('\n');
        let inTable = false;
        let tableHtml = '';
        let result = [];

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();

            if (line.includes('|') && line.startsWith('|')) {
                if (!inTable) {
                    inTable = true;
                    tableHtml = '<table>';
                }

                // تجاهل separator row
                if (/^\|[\s-:|]+\|$/.test(line)) continue;

                const cells = line.split('|').filter(c => c.trim());
                const isHeader = !inTable || (i + 1 < lines.length && /^\|[\s-:|]+\|$/.test(lines[i + 1]?.trim() || ''));

                const tag = isHeader && tableHtml === '<table>' ? 'th' : 'td';
                tableHtml += '<tr>' + cells.map(c => `<${tag}>${c.trim()}</${tag}>`).join('') + '</tr>';

            } else {
                if (inTable) {
                    tableHtml += '</table>';
                    result.push(tableHtml);
                    inTable = false;
                    tableHtml = '';
                }
                result.push(lines[i]);
            }
        }

        if (inTable) {
            tableHtml += '</table>';
            result.push(tableHtml);
        }

        return result.join('\n');
    },

    // ---- مكون المحرر الكامل ----
    render(id, content, onSave) {
        const editorId = 'md-' + id;

        return `
            <div class="md-editor-wrapper" id="${editorId}">
                <div class="md-toolbar">
                    <button class="md-toolbar-btn" onclick="MarkdownEditor.insert('${editorId}','**','**')" title="عريض"><b>B</b></button>
                    <button class="md-toolbar-btn" onclick="MarkdownEditor.insert('${editorId}','*','*')" title="مائل"><i>I</i></button>
                    <button class="md-toolbar-btn" onclick="MarkdownEditor.insert('${editorId}','~~','~~')" title="شطب"><del>S</del></button>
                    <button class="md-toolbar-btn" onclick="MarkdownEditor.insert('${editorId}','==','==')" title="تمييز">🖍</button>
                    <div class="md-toolbar-sep"></div>
                    <button class="md-toolbar-btn" onclick="MarkdownEditor.insertLine('${editorId}','# ')" title="عنوان">H1</button>
                    <button class="md-toolbar-btn" onclick="MarkdownEditor.insertLine('${editorId}','## ')" title="عنوان فرعي">H2</button>
                    <button class="md-toolbar-btn" onclick="MarkdownEditor.insertLine('${editorId}','### ')" title="عنوان صغير">H3</button>
                    <div class="md-toolbar-sep"></div>
                    <button class="md-toolbar-btn" onclick="MarkdownEditor.insertLine('${editorId}','- ')" title="قائمة">•</button>
                    <button class="md-toolbar-btn" onclick="MarkdownEditor.insertLine('${editorId}','1. ')" title="قائمة مرقمة">1.</button>
                    <button class="md-toolbar-btn" onclick="MarkdownEditor.insertLine('${editorId}','- [ ] ')" title="مهمة">☑</button>
                    <div class="md-toolbar-sep"></div>
                    <button class="md-toolbar-btn" onclick="MarkdownEditor.insert('${editorId}','\`','\`')" title="كود">&lt;/&gt;</button>
                    <button class="md-toolbar-btn" onclick="MarkdownEditor.insertLine('${editorId}','> ')" title="اقتباس">❝</button>
                    <button class="md-toolbar-btn" onclick="MarkdownEditor.insertLine('${editorId}','---')" title="خط فاصل">—</button>
                    <button class="md-toolbar-btn" onclick="MarkdownEditor.insertLink('${editorId}')" title="رابط">🔗</button>

                    <div class="md-tabs">
                        <button class="md-tab active" onclick="MarkdownEditor.showTab('${editorId}','write',this)">✏️ كتابة</button>
                        <button class="md-tab" onclick="MarkdownEditor.showTab('${editorId}','preview',this)">👁 معاينة</button>
                        <button class="md-tab" onclick="MarkdownEditor.showTab('${editorId}','split',this)">⫽ تقسيم</button>
                    </div>
                </div>

                <div class="md-body" id="${editorId}-body">
                    <textarea class="md-textarea" id="${editorId}-textarea"
                              placeholder="اكتب بصيغة Markdown..."
                              oninput="MarkdownEditor.onInput('${editorId}')">${content || ''}</textarea>
                    <div class="md-preview" id="${editorId}-preview" style="display:none">
                        ${this.parse(content || '')}
                    </div>
                </div>
            </div>
        `;
    },

    // ---- التبديل بين الأوضاع ----
    showTab(editorId, mode, btn) {
        const textarea = document.getElementById(editorId + '-textarea');
        const preview = document.getElementById(editorId + '-preview');
        const body = document.getElementById(editorId + '-body');
        if (!textarea || !preview) return;

        // تحديث tabs
        btn.closest('.md-tabs').querySelectorAll('.md-tab').forEach(t => t.classList.remove('active'));
        btn.classList.add('active');

        switch (mode) {
            case 'write':
                textarea.style.display = 'block';
                preview.style.display = 'none';
                body.style.display = 'block';
                textarea.style.width = '100%';
                break;
            case 'preview':
                preview.innerHTML = this.parse(textarea.value);
                textarea.style.display = 'none';
                preview.style.display = 'block';
                body.style.display = 'block';
                break;
            case 'split':
                preview.innerHTML = this.parse(textarea.value);
                textarea.style.display = 'block';
                preview.style.display = 'block';
                body.style.display = 'flex';
                body.style.gap = '0';
                textarea.style.width = '50%';
                preview.style.width = '50%';
                preview.style.borderRight = '1px solid var(--border)';
                break;
        }
    },

    onInput(editorId) {
        const textarea = document.getElementById(editorId + '-textarea');
        const preview = document.getElementById(editorId + '-preview');
        if (textarea && preview && preview.style.display !== 'none') {
            preview.innerHTML = this.parse(textarea.value);
        }
    },

    // ---- إدراج تنسيق حول النص المحدد ----
    insert(editorId, before, after) {
        const textarea = document.getElementById(editorId + '-textarea');
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selected = textarea.value.substring(start, end);
        const replacement = before + (selected || 'نص') + after;

        textarea.setRangeText(replacement, start, end, 'select');
        textarea.focus();

        if (!selected) {
            textarea.setSelectionRange(start + before.length, start + before.length + 2);
        }
    },

    // ---- إدراج في بداية السطر ----
    insertLine(editorId, prefix) {
        const textarea = document.getElementById(editorId + '-textarea');
        if (!textarea) return;

        const start = textarea.selectionStart;
        const lineStart = textarea.value.lastIndexOf('\n', start - 1) + 1;

        textarea.setRangeText(prefix, lineStart, lineStart, 'end');
        textarea.focus();
    },

    // ---- إدراج رابط ----
    insertLink(editorId) {
        const textarea = document.getElementById(editorId + '-textarea');
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selected = textarea.value.substring(start, end);

        const link = '[' + (selected || 'العنوان') + '](https://)';
        textarea.setRangeText(link, start, end, 'end');
        textarea.focus();
    },

    // ---- استخراج القيمة ----
    getValue(editorId) {
        const textarea = document.getElementById('md-' + editorId + '-textarea');
        return textarea ? textarea.value : '';
    }
};

// =============================================================
//  🔌 ربط Markdown بالملاحظات واليوميات
// =============================================================
(function patchNotesAndJournal() {

    // تعديل openTaskNotes لتستخدم Markdown Editor
    const _origOpenTaskNotes = window.openTaskNotes;
    window.openTaskNotes = function (planId, groupId, taskId) {
        const found = findTask(planId, groupId, taskId);
        if (!found || !found.task) return;

        openModal(`📄 ${i18n.t('notes')}: ${found.task.name}`, `
            ${MarkdownEditor.render('task-notes', found.task.notes || '')}
            <div style="display:flex;gap:0.5rem;margin-top:1rem">
                <button class="btn btn-primary" onclick="saveTaskNotesMD('${planId}','${groupId}','${taskId}')">💾 ${i18n.t('save')}</button>
                <button class="btn btn-ghost" onclick="closeModal()">${i18n.t('cancel')}</button>
            </div>
        `);
    };

    // حفظ بـ Markdown
    window.saveTaskNotesMD = function (planId, groupId, taskId) {
        const value = MarkdownEditor.getValue('task-notes');
        const found = findTask(planId, groupId, taskId);
        if (!found || !found.task) return;
        found.task.notes = value;
        save();
        closeModal();
        render();
        toast(i18n.t('saved') + ' ✅', 'success');
    };

    // تعديل renderJournal لتستخدم Markdown
    const _origRenderJournal = window.renderJournal;
    window.renderJournal = function (c) {
        _origRenderJournal(c);

        // استبدل textarea العادي بـ Markdown Editor
        const oldTextarea = document.getElementById('journal-text');
        if (oldTextarea) {
            const currentValue = oldTextarea.value;
            const wrapper = oldTextarea.parentNode;

            const mdDiv = document.createElement('div');
            mdDiv.innerHTML = MarkdownEditor.render('journal', currentValue);

            oldTextarea.replaceWith(mdDiv.firstElementChild);

            // تحديث أزرار الحفظ
            const saveBtn = wrapper?.querySelector('.btn-primary');
            if (saveBtn) {
                saveBtn.onclick = function () {
                    data.journal = MarkdownEditor.getValue('journal');
                    save();
                    toast(i18n.t('saved') + ' ✅', 'success');
                };
            }

            const entryBtn = wrapper?.querySelector('.btn-success');
            if (entryBtn) {
                entryBtn.onclick = function () {
                    const text = MarkdownEditor.getValue('journal');
                    if (!text.trim()) {
                        toast(i18n.t('writeFirst'), 'error');
                        return;
                    }
                    if (!data.journalEntries) data.journalEntries = [];
                    data.journalEntries.push({
                        id: uid(),
                        date: new Date().toISOString(),
                        text: text.trim()
                    });
                    data.journal = '';
                    updateStreak();
                    Achievements.checkAndNotify();
                    save();
                    render();
                    toast(i18n.t('journalSaved') + ' 📌', 'success');
                };
            }
        }

        // عرض اليوميات السابقة بـ Markdown
        const entriesList = document.getElementById('journal-entries-list');
        if (entriesList) {
            entriesList.querySelectorAll('.journal-entry').forEach(entry => {
                const textDiv = entry.querySelector('div[style*="white-space"]');
                if (textDiv) {
                    const rawText = textDiv.textContent;
                    textDiv.innerHTML = MarkdownEditor.parse(rawText);
                    textDiv.style.whiteSpace = 'normal';
                    textDiv.classList.add('md-preview');
                }
            });
        }
    };
})();


// =============================================================
//  🌐 #10 - MULTI-LANGUAGE SYSTEM
// =============================================================

const i18n = {
    currentLang: 'ar',

    translations: {
        ar: {
            // عام
            appName: '🎯 رحلتي',
            dashboard: '📊 لوحة التحكم',
            plans: 'خطط التعلم',
            projects: 'المشاريع',
            tools: 'أدوات',
            other: 'أخرى',
            pomodoro: '🍅 بومودورو',
            achievements: '🏆 الإنجازات',
            statistics: '📈 الإحصائيات',
            calendar: '📅 التقويم',
            resources: '📖 المصادر',
            journal: '📝 اليوميات',
            settings: '⚙️ الإعدادات',
            newPlan: '➕ خطة جديدة',
            newProject: '➕ مشروع جديد',

            // داشبورد
            overallProgress: 'التقدم العام',
            projectsLabel: 'المشاريع',
            subLessons: 'الدروس الفرعية',
            streak: 'سلسلة الإنجاز',
            streakDays: 'يوم متواصل',
            weeklyReport: '📋 تقرير أسبوعي',
            shareImage: '📸 مشاركة كصورة',
            overdueTasks: 'مهام متأخرة',
            upcoming7: 'قادم خلال 7 أيام',
            learningPlans: '📋 خطط التعلم',
            projectsList: '🛠️ المشاريع',

            // مهام
            addTopic: 'موضوع جديد...',
            add: 'إضافة',
            edit: 'تعديل',
            delete: 'حذف',
            save: 'حفظ',
            cancel: 'إلغاء',
            close: 'إغلاق',
            done: 'تم',
            pending: 'معلق',
            postponed: 'مؤجل',
            completed: 'مكتمل',
            remaining: 'متبقي',
            notes: 'ملاحظات',
            tags: 'تصنيفات',
            date: 'تاريخ',
            links: 'روابط',
            subs: 'دروس فرعية',
            focus: 'تركيز',

            // بومودورو
            focusMode: '🍅 تركيز',
            shortBreak: '☕ استراحة',
            longBreak: '🌴 استراحة طويلة',
            start: '▶ بدء',
            pause: '⏸ إيقاف',
            reset: '↺ إعادة',
            sessions: 'جلسات اليوم',
            minutes: 'دقيقة',

            // تقويم
            today: 'اليوم',
            previous: '◀ السابق',
            next: 'التالي ▶',

            // مصادر
            resourcesTitle: '📖 المصادر والمراجع',
            newGroup: '+ مجموعة جديدة',
            newResource: 'مصدر جديد...',
            urlOptional: 'رابط (اختياري)',

            // يوميات
            todayNotes: '✍️ ملاحظات اليوم',
            saveDraft: '💾 حفظ مسودة',
            saveEntry: '📌 حفظ كإدخال يومي',
            learningTemplate: '📚 قالب تعلم',
            reviewTemplate: '🔄 قالب مراجعة',
            previousEntries: '📅 الإدخالات السابقة',
            searchJournal: 'بحث في اليوميات...',
            writeFirst: 'اكتب شيئاً أولاً!',
            journalSaved: 'تم حفظ الإدخال اليومي',
            saved: 'تم الحفظ',

            // مزامنة
            synced: '● متزامن',
            syncing: '● يزامن...',
            syncError: '● خطأ',
            local: '● محلي',
            offline: '● غير متصل',
            syncNow: 'مزامنة الآن',
            export: 'تصدير',
            import: 'استيراد',

            // إنجازات
            achievementsProgress: 'التقدم في الإنجازات',
            unlocked: 'المفتوحة',
            locked: 'المقفلة',

            // بحث
            search: 'بحث... (Ctrl+K)',
            noResults: 'لا توجد نتائج',
            results: 'نتيجة',

            // تأكيد
            confirmDelete: 'حذف هذا العنصر؟',
            confirmReset: '⚠️ حذف كل البيانات؟',

            // أوقات
            day: 'يوم',
            days: 'أيام',
            hour: 'ساعة',
            hours: 'ساعات',

            // heatmap
            activityMap: '🗓️ خريطة النشاط',
            all: '📊 الكل',
            tasks: '✅ مهام',
            journalFilter: '📝 يوميات',
            activeDays: 'يوم نشط',
            longestStreak: 'أطول سلسلة',
            learningHours: 'ساعة تعلم',
            completedTasks: 'مهمة مكتملة',
            avgPerDay: 'د/يوم متوسط',
            less: 'أقل',
            more: 'أكثر'
        },

        en: {
            appName: '🎯 My Journey',
            dashboard: '📊 Dashboard',
            plans: 'Learning Plans',
            projects: 'Projects',
            tools: 'Tools',
            other: 'Other',
            pomodoro: '🍅 Pomodoro',
            achievements: '🏆 Achievements',
            statistics: '📈 Statistics',
            calendar: '📅 Calendar',
            resources: '📖 Resources',
            journal: '📝 Journal',
            settings: '⚙️ Settings',
            newPlan: '➕ New Plan',
            newProject: '➕ New Project',

            overallProgress: 'Overall Progress',
            projectsLabel: 'Projects',
            subLessons: 'Sub-lessons',
            streak: 'Streak',
            streakDays: 'consecutive days',
            weeklyReport: '📋 Weekly Report',
            shareImage: '📸 Share as Image',
            overdueTasks: 'Overdue Tasks',
            upcoming7: 'Upcoming in 7 days',
            learningPlans: '📋 Learning Plans',
            projectsList: '🛠️ Projects',

            addTopic: 'New topic...',
            add: 'Add',
            edit: 'Edit',
            delete: 'Delete',
            save: 'Save',
            cancel: 'Cancel',
            close: 'Close',
            done: 'Done',
            pending: 'Pending',
            postponed: 'Postponed',
            completed: 'Completed',
            remaining: 'Remaining',
            notes: 'Notes',
            tags: 'Tags',
            date: 'Date',
            links: 'Links',
            subs: 'Sub-lessons',
            focus: 'Focus',

            focusMode: '🍅 Focus',
            shortBreak: '☕ Break',
            longBreak: '🌴 Long Break',
            start: '▶ Start',
            pause: '⏸ Pause',
            reset: '↺ Reset',
            sessions: 'Today\'s sessions',
            minutes: 'minutes',

            today: 'Today',
            previous: '◀ Previous',
            next: 'Next ▶',

            resourcesTitle: '📖 Resources & References',
            newGroup: '+ New Group',
            newResource: 'New resource...',
            urlOptional: 'URL (optional)',

            todayNotes: '✍️ Today\'s Notes',
            saveDraft: '💾 Save Draft',
            saveEntry: '📌 Save as Entry',
            learningTemplate: '📚 Learning Template',
            reviewTemplate: '🔄 Review Template',
            previousEntries: '📅 Previous Entries',
            searchJournal: 'Search journal...',
            writeFirst: 'Write something first!',
            journalSaved: 'Journal entry saved',
            saved: 'Saved',

            synced: '● Synced',
            syncing: '● Syncing...',
            syncError: '● Error',
            local: '● Local',
            offline: '● Offline',
            syncNow: 'Sync Now',
            export: 'Export',
            import: 'Import',

            achievementsProgress: 'Achievements Progress',
            unlocked: 'Unlocked',
            locked: 'Locked',

            search: 'Search... (Ctrl+K)',
            noResults: 'No results',
            results: 'results',

            confirmDelete: 'Delete this item?',
            confirmReset: '⚠️ Delete all data?',

            day: 'day',
            days: 'days',
            hour: 'hour',
            hours: 'hours',

            activityMap: '🗓️ Activity Map',
            all: '📊 All',
            tasks: '✅ Tasks',
            journalFilter: '📝 Journal',
            activeDays: 'Active Days',
            longestStreak: 'Longest Streak',
            learningHours: 'Learning Hours',
            completedTasks: 'Tasks Done',
            avgPerDay: 'min/day avg',
            less: 'Less',
            more: 'More'
        }
    },

    // ---- الترجمة ----
    t(key) {
        return this.translations[this.currentLang]?.[key]
            || this.translations['ar']?.[key]
            || key;
    },

    // ---- تحميل اللغة المحفوظة ----
    init() {
        const saved = data?.lang || localStorage.getItem('journey_lang');
        if (saved && this.translations[saved]) {
            this.currentLang = saved;
        }
        this.applyDirection();
    },

    // ---- تغيير اللغة ----
    setLang(lang) {
        if (!this.translations[lang]) return;
        this.currentLang = lang;

        // حفظ
        if (data) {
            data.lang = lang;
            save();
        }
        localStorage.setItem('journey_lang', lang);

        this.applyDirection();
        this.updateSidebarLabels();
        render();
        toast(lang === 'ar' ? 'تم التغيير للعربية ✅' : 'Changed to English ✅', 'success');
    },

    // ---- اتجاه الصفحة ----
    applyDirection() {
        const dir = this.currentLang === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.setAttribute('dir', dir);
        document.documentElement.setAttribute('lang', this.currentLang);
    },

    // ---- تحديث القائمة الجانبية ----
    updateSidebarLabels() {
        const nav = document.getElementById('sidebar-nav');
        if (!nav) return;

        const mappings = {
            'dashboard': this.t('dashboard'),
            'pomodoro': this.t('pomodoro'),
            'achievements': this.t('achievements'),
            'stats': this.t('statistics'),
            'calendar': this.t('calendar'),
            'resources': this.t('resources'),
            'journal': this.t('journal')
        };

        nav.querySelectorAll('.nav-item[data-section]').forEach(btn => {
            const section = btn.dataset.section;
            if (mappings[section]) {
                const span = btn.querySelector('span:last-child');
                if (span) span.textContent = mappings[section].replace(/^[^\s]+ /, '');
            }
        });

        // تحديث dividers
        const dividers = nav.querySelectorAll('.nav-divider');
        if (dividers[0]) dividers[0].textContent = this.t('plans');
        if (dividers[1]) dividers[1].textContent = this.t('projects');
        if (dividers[2]) dividers[2].textContent = this.t('tools');
        if (dividers[3]) dividers[3].textContent = this.t('other');

        // Logo
        const logo = document.querySelector('.logo');
        if (logo) logo.textContent = this.t('appName');

        // Search
        const searchInput = document.getElementById('search-input');
        if (searchInput) searchInput.placeholder = this.t('search');
    },

    // ---- زر تبديل اللغة ----
    renderSwitcher() {
        return `
            <div class="lang-switcher">
                <button class="lang-btn ${this.currentLang === 'ar' ? 'active' : ''}"
                        onclick="i18n.setLang('ar')">عربي</button>
                <button class="lang-btn ${this.currentLang === 'en' ? 'active' : ''}"
                        onclick="i18n.setLang('en')">EN</button>
            </div>
        `;
    }
};

// =============================================================
//  🔌 ربط زر اللغة بالـ Sidebar Footer
// =============================================================
(function patchSidebarForLang() {
    // أضف زر اللغة في footer
    const observer = new MutationObserver(() => {
        const footer = document.querySelector('.sidebar-footer');
        if (footer && !footer.querySelector('.lang-switcher')) {
            const langDiv = document.createElement('div');
            langDiv.innerHTML = i18n.renderSwitcher();
            // أضف قبل أول زر
            footer.insertBefore(langDiv.firstElementChild, footer.firstChild);
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // تشغيل أولي
    setTimeout(() => {
        const footer = document.querySelector('.sidebar-footer');
        if (footer && !footer.querySelector('.lang-switcher')) {
            const langDiv = document.createElement('div');
            langDiv.innerHTML = i18n.renderSwitcher();
            footer.insertBefore(langDiv.firstElementChild, footer.firstChild);
        }
    }, 500);
})();

// ---- تهيئة اللغة عند التحميل ----
i18n.init();

// ---- اختصار Alt + L لتبديل اللغة ----
document.addEventListener('keydown', (e) => {
    if (e.altKey && e.key === 'l') {
        e.preventDefault();
        i18n.setLang(i18n.currentLang === 'ar' ? 'en' : 'ar');
    }
});

console.log('✅ Markdown Editor + Multi-language v3.1 loaded');
