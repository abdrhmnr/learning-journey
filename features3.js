// =============================================================
//  FEATURES v3.3 FIXED & COMPLETE
//  XP + Habits + Kanban + Countdown + Templates + Charts + Sticky + PDF + AI Plan
// =============================================================

// ---- حماية من التحميل المتكرر ----
if (window.__v33_loaded) {
    console.warn('⚠️ Features v3.3 already loaded, skipping duplicate.');
} else {
window.__v33_loaded = true;

// ---- ضمان الحقول ----
(function ensureV33Fields() {
    if (!data.xp) data.xp = { points: 0, history: [] };
    if (!data.habits) data.habits = [];
    if (!data.countdowns) data.countdowns = [];
    if (!data.stickyNotes) data.stickyNotes = [];
})();

// =============================================================
//  🎮 XP & LEVELING SYSTEM
// =============================================================
const XPSystem = {
    levels: [
        { level: 1, name: 'مبتدئ', icon: '🌱', xp: 0 },
        { level: 2, name: 'متعلم', icon: '📖', xp: 50 },
        { level: 3, name: 'نشيط', icon: '⭐', xp: 150 },
        { level: 4, name: 'مجتهد', icon: '💪', xp: 350 },
        { level: 5, name: 'متقدم', icon: '🔥', xp: 600 },
        { level: 6, name: 'خبير', icon: '🧠', xp: 1000 },
        { level: 7, name: 'محترف', icon: '💎', xp: 1500 },
        { level: 8, name: 'أسطورة', icon: '👑', xp: 2500 },
        { level: 9, name: 'عبقري', icon: '🏆', xp: 4000 },
        { level: 10, name: 'سيد المعرفة', icon: '🌟', xp: 6000 }
    ],
    xpRewards: {
        taskDone: 10, subDone: 3, pomodoroSession: 8, journalEntry: 5,
        habitCheck: 4, resourceDone: 5, flashcardReview: 2, videoWatched: 5,
        streakDay: 2, achievementUnlock: 25, planComplete: 100, projectPhase: 20
    },

    getTotal() { return data.xp?.points || 0; },

    getCurrentLevel() {
        const total = this.getTotal();
        let current = this.levels[0];
        for (const lvl of this.levels) {
            if (total >= lvl.xp) current = lvl; else break;
        }
        return current;
    },

    getNextLevel() {
        const current = this.getCurrentLevel();
        const idx = this.levels.findIndex(l => l.level === current.level);
        return idx < this.levels.length - 1 ? this.levels[idx + 1] : null;
    },

    getProgress() {
        const current = this.getCurrentLevel();
        const next = this.getNextLevel();
        if (!next) return 100;
        const total = this.getTotal();
        const range = next.xp - current.xp;
        if (range <= 0) return 100;
        return Math.min(100, Math.round(((total - current.xp) / range) * 100));
    },

    addXP(amount, reason) {
        if (!data.xp) data.xp = { points: 0, history: [] };
        const oldLevel = this.getCurrentLevel();
        data.xp.points += amount;
        data.xp.history.push({ amount, reason, date: new Date().toISOString() });
        if (data.xp.history.length > 100) data.xp.history = data.xp.history.slice(-100);
        save();
        const newLevel = this.getCurrentLevel();
        if (newLevel.level > oldLevel.level) {
            this._showLevelUp(newLevel);
        } else {
            this._showXPPopup(amount, reason);
        }
    },

    _showXPPopup(amount, reason) {
        const popup = document.createElement('div');
        popup.className = 'xp-popup';
        popup.innerHTML = `<div class="xp-popup-text">+${amount} XP</div><div class="xp-popup-sub">${reason}</div>`;
        document.body.appendChild(popup);
        setTimeout(() => { if (popup.parentNode) popup.remove(); }, 2200);
    },

    _showLevelUp(level) {
        toast(`🎉 ارتقيت إلى المستوى ${level.level}: ${level.icon} ${level.name}!`, 'success');
        const popup = document.createElement('div');
        popup.className = 'xp-popup';
        popup.innerHTML = `<div class="xp-popup-text">${level.icon} Level ${level.level}!</div><div class="xp-popup-sub">${level.name}</div>`;
        document.body.appendChild(popup);
        setTimeout(() => { if (popup.parentNode) popup.remove(); }, 3000);
    },

    renderBar() {
        const current = this.getCurrentLevel();
        const next = this.getNextLevel();
        const pct = this.getProgress();
        const total = this.getTotal();
        return `
            <div class="xp-bar-container">
                <div class="xp-avatar">${current.icon}</div>
                <div class="xp-info">
                    <div class="xp-level-row">
                        <span class="xp-level-name">${current.name}</span>
                        <span class="xp-level-num">Lv.${current.level} | ${total} XP</span>
                    </div>
                    <div class="xp-progress-bar">
                        <div class="xp-progress-fill" style="width:${pct}%"></div>
                    </div>
                    <div class="xp-text">
                        <span>${next ? `${next.xp - total} XP للمستوى التالي` : '🌟 أعلى مستوى!'}</span>
                        <span>${next ? `${next.icon} ${next.name}` : ''}</span>
                    </div>
                </div>
            </div>
        `;
    }
};

// ---- ربط XP بالأحداث ----
(function hookXPEvents() {
    const _origCycleTask = window.cycleTaskStatus;
    if (typeof _origCycleTask === 'function') {
        window.cycleTaskStatus = function (planId, groupId, taskId) {
            const found = findTask(planId, groupId, taskId);
            const wasDone = found?.task?.status === 'done';
            _origCycleTask(planId, groupId, taskId);
            if (found?.task?.status === 'done' && !wasDone) {
                XPSystem.addXP(XPSystem.xpRewards.taskDone, 'إكمال مهمة');
            }
        };
    }

    const _origSaveJournalEntry = window.saveJournalEntry;
    if (typeof _origSaveJournalEntry === 'function') {
        window.saveJournalEntry = function () {
            const before = (data.journalEntries || []).length;
            _origSaveJournalEntry();
            if ((data.journalEntries || []).length > before) {
                XPSystem.addXP(XPSystem.xpRewards.journalEntry, 'إدخال يومية');
            }
        };
    }
})();

// =============================================================
//  ✅ B - HABIT TRACKER
// =============================================================

const HabitTracker = {
    _ensure() {
        if (!data.habits) data.habits = [];
    },

    addHabit() {
        openModal('➕ عادة جديدة', `
            <div class="setup-form">
                <label>اسم العادة</label>
                <input type="text" id="habit-name" class="input-field" placeholder="مثال: قراءة 30 دقيقة">
                <label>الأيقونة</label>
                <div style="display:flex;gap:0.3rem;flex-wrap:wrap;margin-bottom:0.5rem">
                    ${['📖','💪','🧘','🏃','💧','🍎','😴','✍️','🧠','🎯'].map(e =>
                        `<button class="btn btn-ghost btn-sm" onclick="document.getElementById('habit-icon').value='${e}'">${e}</button>`
                    ).join('')}
                </div>
                <input type="text" id="habit-icon" class="input-field" value="📖" style="max-width:60px">
            </div>
            <div style="display:flex;gap:0.5rem;margin-top:1rem">
                <button class="btn btn-primary" onclick="HabitTracker._save()">إضافة</button>
                <button class="btn btn-ghost" onclick="closeModal()">إلغاء</button>
            </div>
        `);
    },

    _save() {
        this._ensure();
        const name = document.getElementById('habit-name')?.value?.trim();
        if (!name) { toast('اكتب اسم العادة!', 'error'); return; }

        data.habits.push({
            id: uid(),
            name,
            icon: document.getElementById('habit-icon')?.value || '📖',
            log: {},
            bestStreak: 0,
            createdAt: new Date().toISOString()
        });
        save();
        closeModal();
        this.renderPage(document.getElementById('content'));
    },

    toggle(habitId, dateStr) {
        this._ensure();
        const habit = data.habits.find(h => h.id === habitId);
        if (!habit) return;
        if (!habit.log) habit.log = {};

        if (habit.log[dateStr]) {
            delete habit.log[dateStr];
        } else {
            habit.log[dateStr] = true;
            XPSystem.addXP(XPSystem.xpRewards.habitCheck, 'تحقيق عادة');
            if (typeof updateStreak === 'function') updateStreak();
        }

        // تحديث أطول سلسلة
        const currentStreak = this.getCurrentStreak(habit);
        const bestStreak = this.getBestStreak(habit);
        habit.bestStreak = Math.max(habit.bestStreak || 0, bestStreak, currentStreak);

        save();
        this.renderPage(document.getElementById('content'));
    },

    getCurrentStreak(habit) {
        let streak = 0;
        const today = new Date();
        for (let i = 0; i < 365; i++) {
            const d = new Date(today);
            d.setDate(d.getDate() - i);
            const key = d.toISOString().split('T')[0];
            if (habit.log?.[key]) streak++;
            else break;
        }
        return streak;
    },

    getBestStreak(habit) {
        if (!habit.log) return 0;
        const dates = Object.keys(habit.log).sort();
        if (dates.length === 0) return 0;

        let best = 1, current = 1;
        for (let i = 1; i < dates.length; i++) {
            const prev = new Date(dates[i - 1]);
            const curr = new Date(dates[i]);
            const diffDays = Math.round((curr - prev) / 86400000);
            if (diffDays === 1) {
                current++;
                best = Math.max(best, current);
            } else {
                current = 1;
            }
        }
        return Math.max(best, current);
    },

    // للتوافق مع الكود القديم
    getStreak(habit) {
        return this.getCurrentStreak(habit);
    },

    deleteHabit(habitId) {
        if (!confirm('حذف هذه العادة؟')) return;
        data.habits = data.habits.filter(h => h.id !== habitId);
        save();
        this.renderPage(document.getElementById('content'));
    },

    renderPage(c) {
        this._ensure();
        const today = new Date();
        const days = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(d.getDate() - i);
            days.push({
                key: d.toISOString().split('T')[0],
                label: d.toLocaleDateString('ar-SA', { weekday: 'narrow' }),
                isToday: i === 0
            });
        }

        c.innerHTML = `
            <div class="section-header">
                <h2>✅ تتبع العادات</h2>
                <button class="btn btn-primary btn-sm" onclick="HabitTracker.addHabit()">+ عادة جديدة</button>
            </div>

            ${data.habits.length === 0 ? `
                <div class="empty-state">
                    <div class="icon">✅</div>
                    <p>لا توجد عادات. أضف أول عادة يومية!</p>
                    <button class="btn btn-primary" onclick="HabitTracker.addHabit()">+ إضافة</button>
                </div>
            ` : `
                <div class="habits-grid">
                    ${data.habits.map(habit => {
                        const currentStreak = this.getCurrentStreak(habit);
                        const bestStreak = Math.max(habit.bestStreak || 0, this.getBestStreak(habit));
                        const totalChecks = Object.keys(habit.log || {}).length;
                        return `
                            <div class="habit-card">
                                <div class="habit-header">
                                    <span class="habit-name">${habit.icon} ${habit.name}</span>
                                    <div style="display:flex;align-items:center;gap:0.3rem">
                                        ${currentStreak > 0 ? `<span class="habit-streak">🔥 ${currentStreak}</span>` : ''}
                                        <button class="task-btn delete" onclick="HabitTracker.deleteHabit('${habit.id}')">✕</button>
                                    </div>
                                </div>
                                <div class="habit-week">
                                    ${days.map(day => {
                                        const checked = habit.log?.[day.key];
                                        return `
                                            <div class="habit-day ${checked ? 'checked' : ''} ${day.isToday ? 'today' : ''}"
                                                 onclick="HabitTracker.toggle('${habit.id}','${day.key}')">
                                                <span class="habit-day-label">${day.label}</span>
                                                <span class="habit-day-check">${checked ? '✓' : ''}</span>
                                            </div>
                                        `;
                                    }).join('')}
                                </div>
                                <div class="habit-mini-stats">
                                    <span>📊 ${totalChecks} يوم</span>
                                    <span>🔥 السلسلة الحالية: ${currentStreak}</span>
                                    <span>🏆 أطول سلسلة: ${bestStreak}</span>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            `}
        `;
    }
};

// =============================================================
//  ⏰ F - COUNTDOWN TIMER
// =============================================================

const Countdowns = {
    _ensure() { if (!data.countdowns) data.countdowns = []; },

    add() {
        openModal('⏰ عد تنازلي جديد', `
            <div class="setup-form">
                <label>الاسم</label>
                <input type="text" id="cd-name" class="input-field" placeholder="مثال: امتحان ML">
                <label>التاريخ</label>
                <input type="date" id="cd-date" class="input-field">
                <label>الأيقونة</label>
                <div style="display:flex;gap:0.3rem;flex-wrap:wrap">
                    ${['📝','🎓','🏆','🚀','💼','📅','🎯','⏰'].map(e =>
                        `<button class="btn btn-ghost btn-sm" onclick="document.getElementById('cd-icon').value='${e}'">${e}</button>`
                    ).join('')}
                </div>
                <input type="text" id="cd-icon" class="input-field" value="🎯" style="max-width:60px">
            </div>
            <div style="display:flex;gap:0.5rem;margin-top:1rem">
                <button class="btn btn-primary" onclick="Countdowns._save()">إضافة</button>
                <button class="btn btn-ghost" onclick="closeModal()">إلغاء</button>
            </div>
        `);
    },

    _save() {
        this._ensure();
        const name = document.getElementById('cd-name')?.value?.trim();
        const date = document.getElementById('cd-date')?.value;
        if (!name || !date) { toast('أكمل البيانات!', 'error'); return; }

        data.countdowns.push({
            id: uid(), name, date,
            icon: document.getElementById('cd-icon')?.value || '🎯'
        });
        save();
        closeModal();
        this.renderPage(document.getElementById('content'));
    },

    delete(id) {
        data.countdowns = data.countdowns.filter(c => c.id !== id);
        save();
        this.renderPage(document.getElementById('content'));
    },

    _calcRemaining(dateStr) {
        const now = new Date();
        const target = new Date(dateStr + 'T23:59:59');
        const diff = target - now;
        if (diff <= 0) return { expired: true, days: 0, hours: 0, mins: 0 };
        return {
            expired: false,
            days: Math.floor(diff / 86400000),
            hours: Math.floor((diff % 86400000) / 3600000),
            mins: Math.floor((diff % 3600000) / 60000)
        };
    },

    renderPage(c) {
        this._ensure();
        c.innerHTML = `
            <div class="section-header">
                <h2>⏰ العد التنازلي</h2>
                <button class="btn btn-primary btn-sm" onclick="Countdowns.add()">+ جديد</button>
            </div>
            ${data.countdowns.length === 0 ? `
                <div class="empty-state">
                    <div class="icon">⏰</div>
                    <p>لا يوجد عد تنازلي</p>
                    <button class="btn btn-primary" onclick="Countdowns.add()">+ إضافة</button>
                </div>
            ` : `
                <div class="countdown-grid">
                    ${data.countdowns.map(cd => {
                        const r = this._calcRemaining(cd.date);
                        const urgent = !r.expired && r.days < 3;
                        return `
                            <div class="countdown-card ${r.expired ? 'expired' : ''} ${urgent ? 'urgent' : ''}">
                                <button class="task-btn delete" style="position:absolute;top:0.5rem;left:0.5rem" onclick="Countdowns.delete('${cd.id}')">✕</button>
                                <div class="countdown-icon">${cd.icon}</div>
                                <div class="countdown-name">${cd.name}</div>
                                <div class="countdown-date">${new Date(cd.date).toLocaleDateString('ar-EG',{year:'numeric',month:'long',day:'numeric'})}</div>
                                <div class="countdown-numbers">
                                    ${r.expired ? '<div class="countdown-unit"><div class="countdown-value">✅</div><div class="countdown-label">انتهى!</div></div>' : `
                                        <div class="countdown-unit"><div class="countdown-value">${r.days}</div><div class="countdown-label">يوم</div></div>
                                        <div class="countdown-unit"><div class="countdown-value">${r.hours}</div><div class="countdown-label">ساعة</div></div>
                                        <div class="countdown-unit"><div class="countdown-value">${r.mins}</div><div class="countdown-label">دقيقة</div></div>
                                    `}
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            `}
        `;
    }
};

// =============================================================
//  📌 E - STICKY NOTES
// =============================================================

const StickyNotes = {
    colors: ['yellow', 'blue', 'green', 'pink', 'purple'],
    _ensure() { if (!data.stickyNotes) data.stickyNotes = []; },

    add() {
        openModal('📌 ملاحظة لاصقة', `
            <div class="setup-form">
                <label>النص</label>
                <textarea id="sn-text" class="journal-textarea" style="min-height:80px" placeholder="اكتب ملاحظتك..."></textarea>
                <label>اللون</label>
                <div style="display:flex;gap:0.4rem" id="sn-color-picker">
                    ${this.colors.map((c, i) => `
                        <div class="sticky-note ${c}"
                             style="width:36px;height:36px;min-height:auto;cursor:pointer;border-radius:50%;display:flex;align-items:center;justify-content:center;${i === 0 ? 'border:3px solid var(--text)' : ''}"
                             onclick="document.getElementById('sn-color').value='${c}';document.querySelectorAll('#sn-color-picker .sticky-note').forEach(e=>e.style.border='');this.style.border='3px solid var(--text)'">
                        </div>
                    `).join('')}
                </div>
                <input type="hidden" id="sn-color" value="yellow">
            </div>
            <div style="display:flex;gap:0.5rem;margin-top:1rem">
                <button class="btn btn-primary" onclick="StickyNotes._save()">إضافة</button>
                <button class="btn btn-ghost" onclick="closeModal()">إلغاء</button>
            </div>
        `);
    },

    _save() {
        this._ensure();
        const text = document.getElementById('sn-text')?.value?.trim();
        if (!text) { toast('اكتب شيئاً!', 'error'); return; }
        data.stickyNotes.push({
            id: uid(), text,
            color: document.getElementById('sn-color')?.value || 'yellow',
            createdAt: new Date().toISOString()
        });
        save();
        closeModal();
        render();
    },

    delete(id) {
        data.stickyNotes = data.stickyNotes.filter(n => n.id !== id);
        save();
        render();
    },

    edit(id) {
        const note = data.stickyNotes.find(n => n.id === id);
        if (!note) return;
        openModal('✏️ تعديل', `
            <textarea id="sn-edit" class="journal-textarea" style="min-height:80px">${note.text}</textarea>
            <div style="display:flex;gap:0.5rem;margin-top:1rem">
                <button class="btn btn-primary" onclick="StickyNotes._saveEdit('${id}')">حفظ</button>
                <button class="btn btn-ghost" onclick="closeModal()">إلغاء</button>
            </div>
        `);
    },

    _saveEdit(id) {
        const note = data.stickyNotes.find(n => n.id === id);
        if (!note) return;
        const newText = document.getElementById('sn-edit')?.value?.trim();
        if (newText) note.text = newText;
        save();
        closeModal();
        render();
    },

    renderSection() {
        this._ensure();
        if (data.stickyNotes.length === 0) return '';
        return `
            <div class="card" style="margin-bottom:1rem">
                <div class="card-header">
                    <div class="card-title">📌 ملاحظات سريعة</div>
                    <button class="btn btn-ghost btn-sm" onclick="StickyNotes.add()">+</button>
                </div>
                <div class="sticky-notes-grid">
                    ${data.stickyNotes.map(note => `
                        <div class="sticky-note ${note.color}" onclick="StickyNotes.edit('${note.id}')">
                            <button class="sticky-note-delete" onclick="event.stopPropagation();StickyNotes.delete('${note.id}')">✕</button>
                            ${note.text}
                        </div>
                    `).join('')}
                    <div class="sticky-note-add" onclick="StickyNotes.add()">+</div>
                </div>
            </div>
        `;
    }
};

// =============================================================
//  📋 I - PLAN TEMPLATES
// =============================================================

const PlanTemplates = {
    templates: [
        {
            id: 'tpl_python', name: 'Python من الصفر', icon: '🐍',
            desc: 'تعلم Python من المستوى المبتدئ للمتقدم', duration: '3 أشهر',
            groups: [
                { name: 'الأساسيات', tasks: ['المتغيرات والأنواع','الشروط والحلقات','الدوال','القوائم والقواميس','التعامل مع الملفات'] },
                { name: 'المتقدم', tasks: ['OOP','Decorators','Generators','Error Handling','Modules & Packages'] },
                { name: 'المشاريع', tasks: ['مشروع CLI Tool','مشروع Web Scraper','مشروع API'] }
            ]
        },
        {
            id: 'tpl_ml', name: 'Machine Learning', icon: '🤖',
            desc: 'أساسيات تعلم الآلة مع Scikit-learn', duration: '2 شهر',
            groups: [
                { name: 'الأساسيات', tasks: ['NumPy & Pandas','Matplotlib & Seaborn','Statistics Basics','EDA'] },
                { name: 'النماذج', tasks: ['Linear Regression','Logistic Regression','Decision Trees','Random Forest','SVM','KNN'] },
                { name: 'متقدم', tasks: ['Cross Validation','Hyperparameter Tuning','Feature Engineering','Pipeline','مشروع ML كامل'] }
            ]
        },
        {
            id: 'tpl_web', name: 'تطوير الويب', icon: '🌐',
            desc: 'HTML/CSS/JS ثم React', duration: '4 أشهر',
            groups: [
                { name: 'HTML & CSS', tasks: ['HTML Basics','CSS Flexbox','CSS Grid','Responsive Design','CSS Animations'] },
                { name: 'JavaScript', tasks: ['JS Basics','DOM Manipulation','Async/Await','Fetch API','ES6+ Features'] },
                { name: 'React', tasks: ['Components & Props','State & Hooks','React Router','Context API','مشروع React كامل'] }
            ]
        },
        {
            id: 'tpl_ds', name: 'علم البيانات', icon: '📊',
            desc: 'من تحليل البيانات للتصور', duration: '2 شهر',
            groups: [
                { name: 'التحليل', tasks: ['Pandas المتقدم','Data Cleaning','Groupby & Merge','Time Series','Window Functions'] },
                { name: 'التصور', tasks: ['Matplotlib','Seaborn','Plotly','Dashboard مع Streamlit'] },
                { name: 'SQL', tasks: ['SQL Basics','Joins','Subqueries','Window Functions','PostgreSQL'] }
            ]
        },
        {
            id: 'tpl_devops', name: 'DevOps أساسيات', icon: '⚙️',
            desc: 'Git, Docker, CI/CD', duration: '2 شهر',
            groups: [
                { name: 'Git', tasks: ['Git Basics','Branching','Merge & Rebase','GitHub Actions'] },
                { name: 'Docker', tasks: ['Docker Basics','Dockerfile','Docker Compose','Volumes & Networks'] },
                { name: 'CI/CD', tasks: ['GitHub Actions','Automated Testing','Deploy Pipeline'] }
            ]
        },
        {
            id: 'tpl_english', name: 'تعلم الإنجليزية', icon: '🇬🇧',
            desc: 'خطة لتحسين اللغة الإنجليزية', duration: '3 أشهر',
            groups: [
                { name: 'القواعد', tasks: ['Tenses','Conditionals','Passive Voice','Reported Speech','Articles'] },
                { name: 'المفردات', tasks: ['1000 كلمة شائعة','Technical Vocabulary','Idioms & Phrases'] },
                { name: 'المهارات', tasks: ['Listening Practice','Reading Articles','Writing Essays','Speaking Practice'] }
            ]
        }
    ],

    openBrowser() {
        openModal('📋 قوالب خطط جاهزة', `
            <p style="font-size:0.85rem;color:var(--text-secondary);margin-bottom:1rem">اختر قالب لإنشاء خطة جديدة بمحتوى جاهز:</p>
            <div class="templates-grid">
                ${this.templates.map(t => `
                    <div class="template-card" onclick="PlanTemplates.use('${t.id}')">
                        <div class="template-icon">${t.icon}</div>
                        <div class="template-name">${t.name}</div>
                        <div class="template-desc">${t.desc}</div>
                        <div class="template-meta">
                            <span>⏱️ ${t.duration}</span>
                            <span>📂 ${t.groups.length} مجموعات</span>
                            <span>📝 ${t.groups.reduce((sum, g) => sum + g.tasks.length, 0)} مهمة</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        `);
    },

    use(templateId) {
        const tpl = this.templates.find(t => t.id === templateId);
        if (!tpl) return;

        const plan = {
            id: uid(),
            name: tpl.name,
            icon: tpl.icon,
            templateId: tpl.id,
            groups: tpl.groups.map(g => ({
                id: uid(),
                name: g.name,
                collapsed: false,
                tasks: g.tasks.map(t => {
                    // دعم المهام النصية والكائنات
                    const isObject = typeof t === 'object' && t !== null;
                    return {
                        id: uid(),
                        name: isObject ? (t.title || t.name || '') : t,
                        file: isObject ? (t.file || null) : null,
                        status: 'pending',
                        date: '',
                        subs: [],
                        notes: '',
                        tags: [],
                        links: []
                    };
                })
            }))
        };

        // نسخ rootPath إذا وُجد
        if (tpl.rootPath) {
            plan.rootPath = tpl.rootPath;
        }

        data.plans.push(plan);
        save();
        closeModal();
        navigateToPlan(plan.id);
        toast(`تم إنشاء خطة: ${tpl.name} ✅`, 'success');
    }
};

// =============================================================
//  📊 J - WEEKLY COMPARE
// =============================================================

const WeeklyCompare = {
    render() {
        const now = new Date();
        // بداية الأسبوع: السبت (لدعم التقويم العربي)
        const dayOfWeek = now.getDay();
        const diffToSat = (dayOfWeek + 1) % 7; // السبت = 6, الأحد = 0, ...
        const thisWeekStart = new Date(now);
        thisWeekStart.setDate(now.getDate() - diffToSat);
        thisWeekStart.setHours(0, 0, 0, 0);

        const lastWeekStart = new Date(thisWeekStart);
        lastWeekStart.setDate(lastWeekStart.getDate() - 7);

        const thisStr = thisWeekStart.toISOString().split('T')[0];
        const lastStr = lastWeekStart.toISOString().split('T')[0];

        const thisWeek = this._getWeekData(thisStr);
        const lastWeek = this._getWeekData(lastStr);

        const metrics = [
            { label: 'دقائق التعلم', icon: '⏱️', thisVal: thisWeek.minutes, lastVal: lastWeek.minutes },
            { label: 'يوميات', icon: '📝', thisVal: thisWeek.journals, lastVal: lastWeek.journals },
        ];

        return `
            <div class="card">
                <div class="card-title">📊 مقارنة أسبوعية</div>
                <div class="compare-grid">
                    ${metrics.map(m => {
                        const diff = m.thisVal - m.lastVal;
                        const diffClass = diff > 0 ? 'positive' : diff < 0 ? 'negative' : 'neutral';
                        const arrow = diff > 0 ? '↑' : diff < 0 ? '↓' : '=';
                        return `
                            <div class="compare-card">
                                <div class="compare-label">${m.icon} ${m.label} - الأسبوع الماضي</div>
                                <div class="compare-value">${m.lastVal}</div>
                            </div>
                            <div class="compare-card current">
                                <div class="compare-label">${m.icon} ${m.label} - هذا الأسبوع</div>
                                <div class="compare-value">${m.thisVal}</div>
                                <div class="compare-diff ${diffClass}">${arrow} ${Math.abs(diff)}</div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    },

    _getWeekData(weekStartStr) {
        const start = new Date(weekStartStr);
        const end = new Date(start);
        end.setDate(end.getDate() + 7);
        const endStr = end.toISOString().split('T')[0];

        let minutes = 0;
        Object.entries(data.pomodoroLog || {}).forEach(([date, mins]) => {
            if (date >= weekStartStr && date < endStr) minutes += mins;
        });

        const journals = (data.journalEntries || []).filter(e => {
            const d = e.date?.split('T')[0];
            return d >= weekStartStr && d < endStr;
        }).length;

        return { minutes: Math.round(minutes), journals };
    }
};

// =============================================================
//  📊 C - PIE CHART (Canvas)
// =============================================================

const AdvancedCharts = {
    renderPieChart() {
        const stats = getStats();
        const remaining = stats.totalTasks - stats.doneTasks - (stats.postponedTasks || 0);
        const slices = [
            { label: 'مكتمل', value: stats.doneTasks, color: '#059669' },
            { label: 'مؤجل', value: stats.postponedTasks || 0, color: '#d97706' },
            { label: 'متبقي', value: Math.max(0, remaining), color: '#6b7280' }
        ].filter(sl => sl.value > 0);

        const total = slices.reduce((sum, sl) => sum + sl.value, 0);

        return `
            <div class="card">
                <div class="card-title">📊 توزيع المهام</div>
                ${total === 0 ? '<p style="text-align:center;color:var(--text-secondary)">لا توجد مهام بعد</p>' : `
                    <div class="chart-canvas-wrapper">
                        <div class="pie-chart-container">
                            <canvas id="pie-canvas" width="200" height="200"></canvas>
                            <div class="pie-chart-center">${total}</div>
                        </div>
                    </div>
                    <div class="pie-legend">
                        ${slices.map(sl => `
                            <div class="pie-legend-item">
                                <div class="pie-legend-dot" style="background:${sl.color}"></div>
                                <span>${sl.label}: ${sl.value} (${total > 0 ? Math.round(sl.value / total * 100) : 0}%)</span>
                            </div>
                        `).join('')}
                    </div>
                `}
            </div>
        `;
    },

    drawPie() {
        const canvas = document.getElementById('pie-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const stats = getStats();

        const remaining = stats.totalTasks - stats.doneTasks - (stats.postponedTasks || 0);
        const slices = [
            { value: stats.doneTasks, color: '#059669' },
            { value: stats.postponedTasks || 0, color: '#d97706' },
            { value: Math.max(0, remaining), color: '#6b7280' }
        ].filter(sl => sl.value > 0);

        const total = slices.reduce((sum, sl) => sum + sl.value, 0);
        if (total === 0) return;

        const cx = 100, cy = 100, r = 85;
        let startAngle = -Math.PI / 2;

        // مسح الكانفاس
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        slices.forEach(slice => {
            const angle = (slice.value / total) * Math.PI * 2;
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.arc(cx, cy, r, startAngle, startAngle + angle);
            ctx.closePath();
            ctx.fillStyle = slice.color;
            ctx.fill();
            startAngle += angle;
        });

        // وسط شفاف يتبع لون الخلفية
        ctx.beginPath();
        ctx.arc(cx, cy, 50, 0, Math.PI * 2);
        const bgColor = getComputedStyle(document.documentElement).getPropertyValue('--bg-card').trim();
        ctx.fillStyle = bgColor || '#ffffff';
        ctx.fill();
    }
};

// =============================================================
//  📄 H - PDF EXPORT
// =============================================================

const PDFExport = {
    generate() {
        const stats = getStats();
        const pct = stats.totalTasks ? Math.round(stats.doneTasks / stats.totalTasks * 100) : 0;

        openModal('📄 تصدير تقرير', `
            <div class="pdf-preview" id="pdf-content">
                <div class="pdf-header">
                    <div class="pdf-title">🎯 تقرير رحلة التعلم</div>
                    <div class="pdf-date">${new Date().toLocaleDateString('ar-EG', {year:'numeric',month:'long',day:'numeric'})}</div>
                </div>

                <div class="pdf-section">
                    <h3>📊 ملخص عام</h3>
                    <p>التقدم: ${pct}% | المهام: ${stats.doneTasks}/${stats.totalTasks} | السلسلة: ${data.streak || 0} يوم | الوقت: ${Math.round((stats.totalPomodoroMins || 0) / 60)} ساعة</p>
                </div>

                <div class="pdf-section">
                    <h3>📋 الخطط</h3>
                    ${(data.plans || []).map(p => {
                        let t = 0, d = 0;
                        (p.groups || []).forEach(g => (g.tasks || []).forEach(task => { t++; if (task.status === 'done') d++; }));
                        return `<p>${p.icon || '📋'} ${p.name}: ${t ? Math.round(d / t * 100) : 0}% (${d}/${t})</p>`;
                    }).join('')}
                </div>

                <div class="pdf-section">
                    <h3>🛠️ المشاريع</h3>
                    ${(data.projects || []).map(p => {
                        const d = (p.phases || []).filter(ph => ph.status === 'done').length;
                        return `<p>${p.icon || '🛠️'} ${p.name}: ${d}/${(p.phases || []).length}</p>`;
                    }).join('')}
                </div>

                <div class="pdf-section">
                    <h3>🎮 المستوى</h3>
                    <p>${XPSystem.getCurrentLevel().icon} ${XPSystem.getCurrentLevel().name} - المستوى ${XPSystem.getCurrentLevel().level} (${XPSystem.getTotal()} XP)</p>
                </div>
            </div>
            <div style="display:flex;gap:0.5rem;margin-top:1rem">
                <button class="btn btn-primary" onclick="PDFExport.print()">🖨️ طباعة / PDF</button>
                <button class="btn btn-ghost" onclick="closeModal()">إغلاق</button>
            </div>
        `);
    },

    print() {
        const content = document.getElementById('pdf-content')?.innerHTML;
        if (!content) return;

        const win = window.open('', '_blank');
        if (!win) {
            toast('تعذر فتح نافذة الطباعة. تحقق من إعدادات حظر النوافذ المنبثقة.', 'error');
            return;
        }

        win.document.write(`
            <html dir="rtl"><head><title>تقرير رحلة التعلم</title>
            <style>
                body{font-family:'Segoe UI',Tahoma,sans-serif;padding:2rem;color:#1f2937;line-height:1.8}
                h3{color:#4f46e5;border-bottom:1px solid #e5e7eb;padding-bottom:0.3rem;margin-top:1.5rem}
                .pdf-header{text-align:center;margin-bottom:2rem;border-bottom:2px solid #4f46e5;padding-bottom:1rem}
                .pdf-title{font-size:1.5rem;font-weight:800;color:#4f46e5}
                .pdf-date{color:#6b7280;margin-top:0.5rem}
                p{margin:0.3rem 0}
            </style></head>
            <body>${content}</body></html>
        `);
        win.document.close();
        setTimeout(() => win.print(), 300);
    }
};

// =============================================================
//  🗂️ A - KANBAN BOARD
// =============================================================

const KanbanBoard = {
    dragCard: null,

    getColumns() {
        const cols = {
            pending: { title: '⭕ معلق', tasks: [] },
            active: { title: '🔄 جاري', tasks: [] },
            done: { title: '✅ مكتمل', tasks: [] },
            postponed: { title: '⏸ مؤجل', tasks: [] }
        };

        (data.plans || []).forEach(plan => {
            (plan.groups || []).forEach(group => {
                (group.tasks || []).forEach(task => {
                    let status;
                    switch (task.status) {
                        case 'done': status = 'done'; break;
                        case 'postponed': status = 'postponed'; break;
                        case 'active': status = 'active'; break;
                        default: status = 'pending';
                    }
                    cols[status].tasks.push({
                        ...task,
                        planId: plan.id,
                        groupId: group.id,
                        planIcon: plan.icon || '📋',
                        planName: plan.name
                    });
                });
            });
        });

        return cols;
    },

    renderPage(c) {
        const cols = this.getColumns();

        c.innerHTML = `
            <div class="section-header">
                <h2>🗂️ لوحة Kanban</h2>
                <div style="display:flex;gap:0.5rem">
                    <button class="btn btn-ghost btn-sm" onclick="navigate('dashboard')">↩ الرئيسية</button>
                </div>
            </div>

            <div class="kanban-container">
                ${Object.entries(cols).map(([status, col]) => `
                    <div class="kanban-column" data-status="${status}">
                        <div class="kanban-col-header">
                            <span>${col.title}</span>
                            <span class="kanban-col-count">${col.tasks.length}</span>
                        </div>
                        <div class="kanban-col-body"
                             ondragover="event.preventDefault();this.classList.add('kanban-drop-zone','drag-over')"
                             ondragleave="this.classList.remove('drag-over')"
                             ondrop="KanbanBoard.onDrop(event,'${status}');this.classList.remove('drag-over')">
                            ${col.tasks.map(task => `
                                <div class="kanban-card"
                                     draggable="true"
                                     data-task-id="${task.id}"
                                     data-plan-id="${task.planId}"
                                     data-group-id="${task.groupId}"
                                     ondragstart="KanbanBoard.onDragStart(event)"
                                     ondragend="this.classList.remove('dragging')">
                                    <div class="kanban-card-title">${task.name}</div>
                                    <div class="kanban-card-meta">
                                        <span class="badge badge-tag">${task.planIcon} ${task.planName.substring(0, 15)}</span>
                                        ${task.date ? `<span class="badge badge-date">📅 ${formatDate(task.date)}</span>` : ''}
                                        ${(task.subs || []).length > 0 ? `<span class="badge badge-count">📝 ${task.subs.filter(sub => sub.status === 'done').length}/${task.subs.length}</span>` : ''}
                                    </div>
                                </div>
                            `).join('')}
                            ${col.tasks.length === 0 ? '<div style="text-align:center;padding:1.5rem;color:var(--text-secondary);font-size:0.8rem">فارغ</div>' : ''}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    },

    onDragStart(e) {
        const card = e.target.closest('.kanban-card');
        if (!card) return;
        card.classList.add('dragging');
        this.dragCard = {
            taskId: card.dataset.taskId,
            planId: card.dataset.planId,
            groupId: card.dataset.groupId
        };
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', '');
    },

    onDrop(e, newStatus) {
        e.preventDefault();
        if (!this.dragCard) return;

        const found = findTask(this.dragCard.planId, this.dragCard.groupId, this.dragCard.taskId);
        if (!found || !found.task) { this.dragCard = null; return; }

        const oldStatus = found.task.status;

        // الآن Kanban يدعم active فعلياً
        const statusMap = {
            'pending': 'pending',
            'active': 'active',
            'done': 'done',
            'postponed': 'postponed'
        };

        found.task.status = statusMap[newStatus] || 'pending';

        if (found.task.status === 'done' && oldStatus !== 'done') {
            if (typeof updateStreak === 'function') updateStreak();
            XPSystem.addXP(XPSystem.xpRewards.taskDone, 'إكمال مهمة من Kanban');
            if (typeof Achievements !== 'undefined' && Achievements.checkAndNotify) {
                Achievements.checkAndNotify();
            }
        }

        save();
        this.dragCard = null;
        this.renderPage(document.getElementById('content'));
        toast('تم نقل المهمة ✅', 'success');
    }
};

// =============================================================
//  🔌 ربط كل شيء بالتطبيق - السايدبار
// =============================================================

(function patchSidebarV33() {
    const addButtons = () => {
        const nav = document.getElementById('sidebar-nav');
        if (!nav || nav.querySelector('[data-section="habits"]')) return;

        const toolsDividers = nav.querySelectorAll('.nav-divider');
        let otherDiv = null;
        toolsDividers.forEach(d => {
            if (d.textContent.includes('أخرى') || d.textContent.includes('Other')) otherDiv = d;
        });

        if (!otherDiv) return;

        const buttons = [
            { section: 'habits', icon: '✅', label: 'العادات', handler: () => { currentView = 'habits'; HabitTracker.renderPage(document.getElementById('content')); }},
            { section: 'countdowns', icon: '⏰', label: 'عد تنازلي', handler: () => { currentView = 'countdowns'; Countdowns.renderPage(document.getElementById('content')); }},
            { section: 'kanban', icon: '🗂️', label: 'Kanban', handler: () => { currentView = 'kanban'; KanbanBoard.renderPage(document.getElementById('content')); }},
            { section: 'templates', icon: '📋', label: 'قوالب جاهزة', handler: () => PlanTemplates.openBrowser() }
        ];

        buttons.forEach(b => {
            const btn = document.createElement('button');
            btn.className = 'nav-item';
            btn.setAttribute('data-section', b.section);
            btn.innerHTML = `<span class="nav-icon">${b.icon}</span><span>${b.label}</span>`;
            btn.onclick = () => {
                document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
                btn.classList.add('active');
                b.handler();
                const sidebar = document.getElementById('sidebar');
                if (sidebar) sidebar.classList.remove('open');
            };
            otherDiv.parentNode.insertBefore(btn, otherDiv);
        });
    };

    const observer = new MutationObserver(addButtons);
    observer.observe(document.body, { childList: true, subtree: true });
    setTimeout(addButtons, 800);
})();

// =============================================================
//  🔌 ربط بالـ render router (مرة واحدة فقط)
// =============================================================

(function patchRenderV33() {
    const _origRender = window.render;
    if (typeof _origRender !== 'function') return;

    window.render = function () {
        _origRender();

        const c = document.getElementById('content');
        if (!c) return;

        // التوجيه للأقسام الإضافية
        switch (currentView) {
            case 'habits':
                HabitTracker.renderPage(c);
                break;
            case 'countdowns':
                Countdowns.renderPage(c);
                break;
            case 'kanban':
                KanbanBoard.renderPage(c);
                break;
        }

        // رسم Pie Chart إذا كان الكانفاس موجوداً
        setTimeout(() => {
            if (document.getElementById('pie-canvas')) {
                AdvancedCharts.drawPie();
            }
        }, 200);
    };
})();

// =============================================================
//  🔌 ربط بالداشبورد (تكملة)
// =============================================================

(function patchDashboardV33() {
    const _origDashboard = window.renderDashboard;
    if (typeof _origDashboard !== 'function') return;

    window.renderDashboard = function (c) {
        _origDashboard(c);

        // أضف XP Bar في الأعلى
        const header = c.querySelector('.section-header');
        if (header) {
            header.insertAdjacentHTML('afterend', XPSystem.renderBar());
        }

        // أضف Sticky Notes بعد XP
        const xpBar = c.querySelector('.xp-bar-container');
        if (xpBar) {
            xpBar.insertAdjacentHTML('afterend', StickyNotes.renderSection());
        } else {
            const statsGrid = c.querySelector('.stats-grid');
            if (statsGrid) {
                statsGrid.insertAdjacentHTML('beforebegin', StickyNotes.renderSection());
            }
        }

        // أضف العادات قبل الإنجازات
        const achievementsCard = c.querySelector('.achievements-grid')?.closest('.card');
        if (achievementsCard && data.habits && data.habits.length > 0) {
            const today = new Date();
            const days = [];
            for (let i = 6; i >= 0; i--) {
                const d = new Date(today);
                d.setDate(d.getDate() - i);
                days.push({
                    key: d.toISOString().split('T')[0],
                    label: d.toLocaleDateString('ar-SA', { weekday: 'narrow' }),
                    isToday: i === 0
                });
            }

            const habitsHtml = `
                <div class="card" style="margin-bottom:1rem">
                    <div class="card-header">
                        <div class="card-title" style="cursor:pointer" onclick="currentView='habits';render();">
                            ✅ العادات اليومية
                            <span style="font-size:0.75rem;color:var(--primary);margin-right:0.5rem">عرض الكل ←</span>
                        </div>
                    </div>
                    <div class="habits-grid" style="grid-template-columns:repeat(auto-fill,minmax(250px,1fr))">
                        ${data.habits.slice(0, 4).map(habit => {
                            const streak = HabitTracker.getCurrentStreak(habit);
                            return `
                                <div class="habit-card" style="padding:0.75rem">
                                    <div class="habit-header" style="margin-bottom:0.5rem">
                                        <span class="habit-name" style="font-size:0.85rem">${habit.icon} ${habit.name}</span>
                                        ${streak > 0 ? `<span class="habit-streak">🔥 ${streak}</span>` : ''}
                                    </div>
                                    <div class="habit-week">
                                        ${days.map(day => {
                                            const checked = habit.log?.[day.key];
                                            return `
                                                <div class="habit-day ${checked ? 'checked' : ''} ${day.isToday ? 'today' : ''}"
                                                     onclick="HabitTracker.toggle('${habit.id}','${day.key}')"
                                                     style="width:28px;height:28px">
                                                    <span class="habit-day-label">${day.label}</span>
                                                    <span class="habit-day-check" style="font-size:0.6rem">${checked ? '✓' : ''}</span>
                                                </div>
                                            `;
                                        }).join('')}
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            `;
            achievementsCard.insertAdjacentHTML('beforebegin', habitsHtml);
        }

        // أضف Countdowns إذا وجدت وقريبة
        if (data.countdowns && data.countdowns.length > 0) {
            const urgentCountdowns = data.countdowns.filter(cd => {
                const r = Countdowns._calcRemaining(cd.date);
                return !r.expired && r.days <= 30;
            });

            if (urgentCountdowns.length > 0) {
                const insertTarget = achievementsCard || c.querySelector('.card:last-child');
                if (insertTarget) {
                    const cdHtml = `
                        <div class="card" style="margin-bottom:1rem">
                            <div class="card-title" style="cursor:pointer" onclick="currentView='countdowns';render();">
                                ⏰ قادم قريباً
                                <span style="font-size:0.75rem;color:var(--primary);margin-right:0.5rem">عرض الكل ←</span>
                            </div>
                            <div class="countdown-grid" style="grid-template-columns:repeat(auto-fill,minmax(200px,1fr))">
                                ${urgentCountdowns.slice(0, 3).map(cd => {
                                    const r = Countdowns._calcRemaining(cd.date);
                                    return `
                                        <div class="countdown-card ${r.days < 3 ? 'urgent' : ''}" style="padding:0.85rem">
                                            <div class="countdown-icon" style="font-size:1.3rem">${cd.icon}</div>
                                            <div class="countdown-name" style="font-size:0.85rem">${cd.name}</div>
                                            <div class="countdown-numbers" style="gap:0.5rem">
                                                <div class="countdown-unit"><div class="countdown-value" style="font-size:1.3rem">${r.days}</div><div class="countdown-label">يوم</div></div>
                                                <div class="countdown-unit"><div class="countdown-value" style="font-size:1.3rem">${r.hours}</div><div class="countdown-label">ساعة</div></div>
                                            </div>
                                        </div>
                                    `;
                                }).join('')}
                            </div>
                        </div>
                    `;
                    insertTarget.insertAdjacentHTML('beforebegin', cdHtml);
                }
            }
        }

        // Weekly Compare
        const lastCard = c.querySelector('.card:last-child');
        if (lastCard) {
            lastCard.insertAdjacentHTML('afterend', WeeklyCompare.render());
        }
    };
})();

// =============================================================
//  🔌 ربط بالإحصائيات
// =============================================================

(function patchStatsV33() {
    const _origStats = window.renderStatsPage;
    if (typeof _origStats !== 'function') return;

    window.renderStatsPage = function (c) {
        _origStats(c);

        // Pie Chart
        c.insertAdjacentHTML('beforeend', AdvancedCharts.renderPieChart());

        // Weekly Compare
        c.insertAdjacentHTML('beforeend', WeeklyCompare.render());

        // XP Stats
        const level = XPSystem.getCurrentLevel();
        c.insertAdjacentHTML('beforeend', `
            <div class="card">
                <div class="card-title">🎮 نظام النقاط</div>
                <div style="display:flex;align-items:center;gap:1rem;margin-bottom:1rem">
                    <span style="font-size:2.5rem">${level.icon}</span>
                    <div>
                        <div style="font-size:1.2rem;font-weight:800">${level.name}</div>
                        <div style="font-size:0.82rem;color:var(--text-secondary)">المستوى ${level.level} | ${XPSystem.getTotal()} XP</div>
                    </div>
                </div>
                ${XPSystem.renderBar()}
                <div style="margin-top:1rem">
                    <h4 style="font-size:0.88rem;margin-bottom:0.5rem">📊 مكافآت XP:</h4>
                    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:0.4rem;font-size:0.78rem">
                        ${Object.entries(XPSystem.xpRewards).map(([key, val]) => {
                            const labels = {
                                taskDone: 'إكمال مهمة', subDone: 'درس فرعي', pomodoroSession: 'جلسة بومودورو',
                                journalEntry: 'يومية', habitCheck: 'تحقيق عادة', resourceDone: 'إكمال مصدر',
                                flashcardReview: 'مراجعة بطاقة', videoWatched: 'مشاهدة فيديو',
                                streakDay: 'يوم سلسلة', achievementUnlock: 'فتح إنجاز',
                                planComplete: 'إكمال خطة', projectPhase: 'مرحلة مشروع'
                            };
                            return `<div style="padding:0.3rem;background:var(--bg);border-radius:4px">+${val} XP — ${labels[key] || key}</div>`;
                        }).join('')}
                    </div>
                </div>
            </div>
        `);

        // Habit Stats
        if (data.habits && data.habits.length > 0) {
            const totalDays = data.habits.reduce((sum, h) => sum + Object.keys(h.log || {}).length, 0);
            const avgPerHabit = data.habits.length > 0 ? Math.round(totalDays / data.habits.length) : 0;

            c.insertAdjacentHTML('beforeend', `
                <div class="card">
                    <div class="card-title">✅ إحصائيات العادات</div>
                    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:0.5rem;text-align:center">
                        <div style="padding:0.5rem;background:var(--bg);border-radius:8px">
                            <div style="font-size:1.5rem;font-weight:800">${data.habits.length}</div>
                            <div style="font-size:0.75rem;color:var(--text-secondary)">عادات نشطة</div>
                        </div>
                        <div style="padding:0.5rem;background:var(--bg);border-radius:8px">
                            <div style="font-size:1.5rem;font-weight:800">${totalDays}</div>
                            <div style="font-size:0.75rem;color:var(--text-secondary)">إجمالي الأيام</div>
                        </div>
                        <div style="padding:0.5rem;background:var(--bg);border-radius:8px">
                            <div style="font-size:1.5rem;font-weight:800">${avgPerHabit}</div>
                            <div style="font-size:0.75rem;color:var(--text-secondary)">متوسط لكل عادة</div>
                        </div>
                    </div>
                </div>
            `);
        }

        // رسم Pie Chart
        setTimeout(() => AdvancedCharts.drawPie(), 100);
    };
})();

// =============================================================
//  🔌 ربط قوالب الخطط بزر "خطة جديدة"
// =============================================================

(function patchNewPlan() {
    const _origAddNewPlan = window.addNewPlan;
    if (typeof _origAddNewPlan !== 'function') return;

    // حفظ مرجع آمن للدالة الأصلية
    const safeOrigAddNewPlan = _origAddNewPlan;

    window.addNewPlan = function () {
        openModal('📚 خطة جديدة', `
            <div style="display:flex;flex-direction:column;gap:1rem">
                <div class="card" style="cursor:pointer" onclick="closeModal();PlanTemplates.openBrowser()">
                    <div class="card-title">📋 من قالب جاهز</div>
                    <p style="font-size:0.82rem;color:var(--text-secondary)">اختر من قوالب Python, ML, Web Dev والمزيد</p>
                </div>
                <div class="card" style="cursor:pointer" onclick="closeModal();window.__origAddNewPlan()">
                    <div class="card-title">✏️ خطة فارغة</div>
                    <p style="font-size:0.82rem;color:var(--text-secondary)">ابدأ من الصفر وأنشئ خطتك الخاصة</p>
                </div>
            </div>
        `);
    };

    // حفظ الدالة الأصلية على window لاستدعائها من onclick
    window.__origAddNewPlan = safeOrigAddNewPlan;
})();

// =============================================================
//  ⌨️ اختصارات v3.3
// =============================================================

document.addEventListener('keydown', (e) => {
    // Alt + H = العادات
    if (e.altKey && e.key === 'h') {
        e.preventDefault();
        currentView = 'habits';
        render();
    }

    // Alt + T = قوالب
    if (e.altKey && e.key === 't') {
        e.preventDefault();
        PlanTemplates.openBrowser();
    }

    // Alt + K = Kanban
    if (e.altKey && e.key === 'k') {
        e.preventDefault();
        currentView = 'kanban';
        render();
    }

    // Alt + E = تصدير PDF
    if (e.altKey && e.key === 'e') {
        e.preventDefault();
        PDFExport.generate();
    }

    // Alt + N = ملاحظة لاصقة جديدة
    if (e.altKey && e.key === 'n') {
        e.preventDefault();
        StickyNotes.add();
    }
});

// =============================================================
//  تحديث العد التنازلي كل دقيقة
// =============================================================
const _countdownInterval = setInterval(() => {
    if (currentView === 'countdowns') {
        const c = document.getElementById('content');
        if (c) Countdowns.renderPage(c);
    }
}, 60000);

// =============================================================
//  🔥 AI ENGINEER MASTERY – LLM & RAG (24 أسبوع) – النسخة المُصلّحة
// =============================================================
PlanTemplates.templates = PlanTemplates.templates.filter(t => t.id !== 'tpl_ai_engineer_full');

PlanTemplates.templates.unshift({
    id: 'tpl_ai_engineer_full',
    name: '🤖 AI Engineer Mastery – LLM & RAG',
    icon: '🤖',
    desc: 'خطة كاملة 24 أسبوع: رياضيات + ML + DL + LLMs + RAG + مشاريع',
    duration: '6 أشهر',
    rootPath: '/Volumes/dt/AI-ENGINEER',
    groups: [
        {
            name: 'أسابيع 1-2: أساسيات الرياضيات',
            tasks: [
                { title: 'Functions', file: '01_Math_Basics/Functions [2SpgdHN5dKU].webm' },
                { title: 'Transformations of Functions', file: '01_Math_Basics/Transformations of Functions \uFF1A Shifting, Scaling, Reflection, Absoluting [t644SoGQ4xU].webm' },
                { title: 'Absolute Function - Even & Odd', file: '01_Math_Basics/Absolute Function - Even &Odd Functions [v8WLmE2bGSQ].webm' },
                { title: 'Inverse Function', file: '01_Math_Basics/Inverse Function [i2izH2b2PlY].webm' },
                { title: 'Trigonometric Functions', file: '01_Math_Basics/Trigonometric Functions - Part 01 [fzlWZ5KUM7A].webm' },
                { title: 'Exponential & Logarithmic Functions', file: '01_Math_Basics/Exponential & Logarithmic Functions [4xv6JSnnBno].webm' },
                { title: 'Hyperbolic Functions', file: '01_Math_Basics/Hyperbolic Functions [5P5KOjTBr9Q].webm' },
                { title: 'Inverse Trigonometric Functions', file: '01_Math_Basics/Inverse Trigonometric Functions [UwAqGDrowsY].webm' },
                { title: 'Inverse Hyperbolic Functions', file: '01_Math_Basics/Inverse Hyperbolic Functions [giJc5s6q2js].mkv' },
                { title: 'Limits L\'Hopital\'s Rule', file: '01_Math_Basics/Limits L\'Hopital\'s Rule [jl_B8--XQS0].mkv' },
                { title: 'Differentiation - Basic Rules', file: '01_Math_Basics/Basic Table and Rules of Differentiation - Imlicit & Parametric Differentiation [cfZGo5B3J6E].webm' },
                { title: 'Additional Notes on Differentiation', file: '01_Math_Basics/Additional Notes on Differentation [bDPmE0rzHyQ].mkv' },
                { title: 'Differentiation II', file: '01_Math_Basics/Lecture03- Differentiation II [PNkvpZALu8E].webm' },
                { title: 'Inverse Trig Differentiation', file: '01_Math_Basics/Lecture04- Inverse Function and Inverse Trigonometric Functions [VuCHLzhz_io].mkv' },
                { title: 'Applications of Differentiation', file: '01_Math_Basics/Lecture 06 - Applications of Differentiation [0MWdUPosYh8].mkv' },
                { title: 'Selected Applications of Differentiation', file: '01_Math_Basics/Selected applications of differentiation [qc7RC8OjYgQ].mkv' },
                { title: 'Introduction to Integration (1)', file: '01_Math_Basics/Introduction to integration(1) [aTh6710uaeY].webm' },
                { title: 'Introduction to Integration (2)', file: '01_Math_Basics/Introduction to integration (2) [D6ELbhq-xag].mkv' }
            ]
        },
        {
            name: 'أسابيع 3-4: الاحتمالات والإحصاء',
            tasks: [
                { title: '00- مقدمة التحليل الإحصائي', file: '01_Probability_Statistics/00- Statistical Analysis \uFF5C \u0627\u0644\u0625\u062D\u0635\u0627\u0621 \u0645\u0634 \u0623\u0631\u0642\u0627\u0645 \u0648\u0628\u0633! ... \u0645\u0642\u062F\u0645\u0629 \u0645\u0628\u0633\u0637\u0629 \u0644\u0645\u062D\u062A\u0648\u0649 \u0645\u0627\u062F\u0629 \u0627\u0644\u062A\u062D\u0644\u064A\u0644 \u0627\u0644\u0625\u062D\u0635\u0627\u0626\u064A [CL-fAMiysnk].webm' },
                { title: '01- Sample Space & Event', file: '01_Probability_Statistics/01- Probability and Statistics \uFF5C Sample Space & Event \uFF5C \u0627\u062D\u062A\u0645\u0627\u0644\u0627\u062A \u0648\u0625\u062D\u0635\u0627\u0621 \uFF5C \u0641\u0636\u0627\u0621 \u0627\u0644\u0639\u064A\u0646\u0629 \u0648\u0627\u0644\u062D\u062F\u062B [GmJJ2iZz08c].webm' },
                { title: '02- Counting & Probability', file: '01_Probability_Statistics/02- Probability and Statistics \uFF5C Counting & Probability \uFF5C \u0627\u062D\u062A\u0645\u0627\u0644\u0627\u062A \u0648\u0625\u062D\u0635\u0627\u0621 \uFF5C \u062A\u0642\u0646\u064A\u0627\u062A \u0627\u0644\u0639\u062F \u0648\u0627\u0644\u0627\u062D\u062A\u0645\u0627\u0644 [NrdCDmSAn7c].webm' },
                { title: '03- Conditional Probability', file: '01_Probability_Statistics/03- Probability and Statistics \uFF5C Rules& Conditional Probability \uFF5C \u0627\u062D\u062A\u0645\u0627\u0644\u0627\u062A \u0648\u0625\u062D\u0635\u0627\u0621 \uFF5C \u0627\u0644\u0627\u062D\u062A\u0645\u0627\u0644 \u0627\u0644\u0645\u0634\u0631\u0648\u0637 [raeVQxzY7iE].webm' },
                { title: '04- Bayes Rule & RV', file: '01_Probability_Statistics/04- Probability and Statistics \uFF5C Bayes Rule & RV \uFF5C \u0627\u062D\u062A\u0645\u0627\u0644\u0627\u062A \u0648\u0625\u062D\u0635\u0627\u0621 \uFF5C \u0642\u0627\u0639\u062F\u0629 \u0628\u0627\u064A\u0632 \u0648\u0627\u0644\u0645\u062A\u063A\u064A\u0631\u0627\u062A \u0627\u0644\u0639\u0634\u0648\u0627\u0626\u064A\u0629 [zWDzNUTfk9s].webm' },
                { title: 'Probability - Lecture 01 Introduction', file: '01_Probability/Lecture01 - Introduction to probability [aMK6hM7NeSk].webm' },
                { title: 'Probability - Counting Part 01', file: '01_Probability/Lecture02 - Techniques of Counting - Part 01 [a-vqSmhugrI].webm' },
                { title: 'Probability - Counting Part 02', file: '01_Probability/Lecture03 - Techniques of Counting - Part 02 [PFMMQR43a58].webm' },
                { title: 'Probability - Conditional Probability', file: '01_Probability/Lecture04.1 - Conditional Probability [0psrQBB3p88].webm' },
                { title: 'Probability - Independent Events', file: '01_Probability/Lecture04.2 - Independent Events [1RIL5-28FmU].webm' },
                { title: 'Probability - Discrete RV PDF & CDF', file: '01_Probability/Lecture05 - Discret Random Variable PDF and CDF [6zfAYjbTr0g].webm' },
                { title: 'Probability - Expectation & Variance', file: '01_Probability/Lecture06 - Expectation and variance and Moment generating function of discrete random variable [sb_gIwZXUds].webm' }
            ]
        },
        {
            name: 'أسابيع 5-7: Machine Learning (CS229)',
            tasks: [
                { title: 'CS229 Lec 1 - Introduction', file: '02_CS229_Machine_Learning/Stanford CS229 Machine Learning I Introduction I 2022 I Lecture 1 [Bl4Feh_Mjvo].webm' },
                { title: 'CS229 Lec 2 - Supervised Learning, LMS', file: '02_CS229_Machine_Learning/Stanford CS229 Machine Learning I Supervised learning setup, LMS I 2022 I Lecture 2 [gqKaVgQxEJ0].webm' },
                { title: 'CS229 Lec 3 - Logistic Regression', file: '02_CS229_Machine_Learning/Stanford CS229 I Weighted Least Squares, Logistic regression, Newton\'s Method I 2022 I Lecture 3 [k_pDh_68K6c].webm' },
                { title: 'CS229 Lec 4 - GLMs', file: '02_CS229_Machine_Learning/Stanford CS229 Machine Learning I Exponential family, Generalized Linear Models I 2022 I Lecture 4 [goDDnBbJQ4g].mkv' },
                { title: 'CS229 Lec 5 - GDA, Naive Bayes', file: '02_CS229_Machine_Learning/Stanford CS229 Machine Learning I Gaussian discriminant analysis, Naive Bayes I 2022 I Lecture 5 [RMy_1mO4HLk].mkv' },
                { title: 'CS229 Lec 6 - Laplace Smoothing', file: '02_CS229_Machine_Learning/Stanford CS229 Machine Learning I Naive Bayes, Laplace Smoothing I 2022 I Lecture 6 [ADj95edZc0w].mkv' },
                { title: 'CS229 Lec 7 - Kernels', file: '02_CS229_Machine_Learning/Stanford CS229 Machine Learning I Kernels I 2022 I Lecture 7 [dzDOqrac9Ks].mkv' },
                { title: 'CS229 Lec 8 - Neural Networks 1', file: '02_CS229_Machine_Learning/Stanford CS229 Machine Learning I Neural Networks 1 I 2022 I Lecture 8 [ZMxfDWPXmjc].mkv' },
                { title: 'CS229 Lec 9 - Backpropagation', file: '02_CS229_Machine_Learning/Stanford CS229 Machine Learning I Neural Networks 2 (backprop) I 2022 I Lecture 9 [UbtTv7j1tzU].mkv' },
                { title: 'CS229 Lec 10 - Bias-Variance', file: '02_CS229_Machine_Learning/Stanford CS229 Machine Learning I Bias - Variance, Regularization I 2022 I Lecture 10 [7AQYw5FOVcw].mkv' },
                { title: 'CS229 Lec 11 - Feature/Model Selection', file: '02_CS229_Machine_Learning/Stanford CS229 Machine Learning I Feature \u29F8 Model selection, ML Advice I 2022 I Lecture 11 [NirZnqwYfYU].mkv' }
            ]
        },
        {
            name: 'أسابيع 8-11: Deep Learning (CS230)',
            tasks: [
                { title: 'CS230 Lec 1 - Introduction', file: '03_CS230_Deep_Learning/Stanford CS230\uFF1A Deep Learning \uFF5C Autumn 2018 \uFF5C Lecture 1 - Class Introduction & Logistics, Andrew Ng [PySo_6S4ZAg].webm' },
                { title: 'CS230 Lec 2 - DL Intuition', file: '03_CS230_Deep_Learning/Stanford CS230\uFF1A Deep Learning \uFF5C Autumn 2018 \uFF5C Lecture 2 - Deep Learning Intuition [AwQHqWyHRpU].webm' },
                { title: 'CS230 Lec 3 - Full-Cycle DL', file: '03_CS230_Deep_Learning/Stanford CS230\uFF1A Deep Learning \uFF5C Autumn 2018 \uFF5C Lecture 3 - Full-Cycle Deep Learning Projects [JUJNGv_sb4Y].mkv' },
                { title: 'CS230 Lec 4 - GANs', file: '03_CS230_Deep_Learning/Stanford CS230\uFF1A Deep Learning \uFF5C Autumn 2018 \uFF5C Lecture 4 - Adversarial Attacks \u29F8 GANs [ANszao6YQuM].mkv' },
                { title: 'CS230 Lec 5 - AI + Healthcare', file: '03_CS230_Deep_Learning/Stanford CS230\uFF1A Deep Learning \uFF5C Autumn 2018 \uFF5C Lecture 5 - AI + Healthcare [IM9ANAbufYM].mkv' },
                { title: 'CS230 Lec 6 - Project Strategy', file: '03_CS230_Deep_Learning/Stanford CS230\uFF1A Deep Learning \uFF5C Autumn 2018 \uFF5C Lecture 6 - Deep Learning Project Strategy [G5FNYxbW_Qw].mkv' },
                { title: 'CS230 Lec 7 - Interpretability', file: '03_CS230_Deep_Learning/Stanford CS230\uFF1A Deep Learning \uFF5C Autumn 2018 \uFF5C Lecture 7 - Interpretability of Neural Network [gCJCgQW_LKc].mkv' },
                { title: 'CS230 Lec 8 - Career Advice', file: '03_CS230_Deep_Learning/Stanford CS230\uFF1A Deep Learning \uFF5C Autumn 2018 \uFF5C Lecture 8 - Career Advice \u29F8 Reading Research Papers [733m6qBH-jI].webm' },
                { title: 'CS230 Lec 9 - Deep RL', file: '03_CS230_Deep_Learning/Stanford CS230\uFF1A Deep Learning \uFF5C Autumn 2018 \uFF5C Lecture 9 - Deep Reinforcement Learning [NP2XqpgTJyo].mkv' },
                { title: 'CS230 Lec 10 - Chatbots / Closing', file: '03_CS230_Deep_Learning/Stanford CS230\uFF1A Deep Learning \uFF5C Autumn 2018 \uFF5C Lecture 10 - Chatbots \u29F8 Closing Remarks [IFLstgCNOA4].mkv' }
            ]
        },
        {
            name: 'أسابيع 12-19: LLMs من الصفر (CS336)',
            tasks: [
                { title: 'CS336 Lec 1 - Tokenization', file: '04_CS336_LLMs_From_Scratch/Stanford CS336 Language Modeling from Scratch \uFF5C Spring 2025 \uFF5C Lecture 1\uFF1A Overview and Tokenization [SQ3fZ1sAqXI].webm' },
                { title: 'CS336 Lec 2 - Pytorch', file: '04_CS336_LLMs_From_Scratch/Stanford CS336 Language Modeling from Scratch \uFF5C Spring 2025 \uFF5C Lec. 2\uFF1A Pytorch, Resource Accounting [msHyYioAyNE].webm' },
                { title: 'CS336 Lec 3 - Architectures', file: '04_CS336_LLMs_From_Scratch/Stanford CS336 Lang. Modeling from Scratch \uFF5C Spring 2025 \uFF5C Lec. 3\uFF1A Architectures, Hyperparameters [ptFiH_bHnJw].webm' },
                { title: 'CS336 Lec 4 - Mixture of Experts', file: '04_CS336_LLMs_From_Scratch/Stanford CS336 Language Modeling from Scratch \uFF5C Spring 2025 \uFF5C Lecture 4\uFF1A Mixture of experts [LPv1KfUXLCo].webm' },
                { title: 'CS336 Lec 5 - GPUs', file: '04_CS336_LLMs_From_Scratch/Stanford CS336 I Language Modeling from Scratch \uFF5C Spring 2025 \uFF5C Lecture 5\uFF1A GPUs [6OBtO9niT00].webm' },
                { title: 'CS336 Lec 6 - Kernels, Triton', file: '04_CS336_LLMs_From_Scratch/Stanford CS336 Language Modeling from Scratch \uFF5C Spring 2025 \uFF5C Lecture 6\uFF1A Kernels, Triton [E8Mju53VB00].webm' },
                { title: 'CS336 Lec 7 - Parallelism 1', file: '04_CS336_LLMs_From_Scratch/Stanford CS336 Language Modeling from Scratch \uFF5C Spring 2025 \uFF5C Lecture 7\uFF1A Parallelism 1 [l1RJcDjzK8M].webm' },
                { title: 'CS336 Lec 8 - Parallelism 2', file: '04_CS336_LLMs_From_Scratch/Stanford CS336 Language Modeling from Scratch \uFF5C Spring 2025 \uFF5C Lecture 8\uFF1A Parallelism 2 [LHpr5ytssLo].webm' },
                { title: 'CS336 Lec 9 - Scaling Laws 1', file: '04_CS336_LLMs_From_Scratch/Stanford CS336 Language Modeling from Scratch \uFF5C Spring 2025 \uFF5C Lecture 9\uFF1A Scaling laws 1 [6Q-ESEmDf4Q].webm' },
                { title: 'CS336 Lec 10 - Inference', file: '04_CS336_LLMs_From_Scratch/Stanford CS336 Language Modeling from Scratch \uFF5C Spring 2025 \uFF5C Lecture 10\uFF1A Inference [fcgPYo3OtV0].webm' },
                { title: 'CS336 Lec 11 - Scaling Laws 2', file: '04_CS336_LLMs_From_Scratch/Stanford CS336 Language Modeling from Scratch \uFF5C Spring 2025 \uFF5C Lecture 11\uFF1A Scaling laws 2 [OSYuUqGBQxw].webm' },
                { title: 'CS336 Lec 12 - Evaluation', file: '04_CS336_LLMs_From_Scratch/Stanford CS336 Language Modeling from Scratch \uFF5C Spring 2025 \uFF5C Lecture 12\uFF1A Evaluation [x-R5l2HsXqM].webm' },
                { title: 'CS336 Lec 13 - Data 1', file: '04_CS336_LLMs_From_Scratch/Stanford CS336 Language Modeling from Scratch \uFF5C Spring 2025 \uFF5C Lecture 13\uFF1A Data 1 [WePxmeXU1xg].webm' },
                { title: 'CS336 Lec 14 - Data 2', file: '04_CS336_LLMs_From_Scratch/Stanford CS336 Language Modeling from Scratch \uFF5C Spring 2025 \uFF5C Lecture 14\uFF1A Data 2 [9Cd0THLS1t0].webm' },
                { title: 'CS336 Lec 15 - Alignment SFT/RLHF', file: '04_CS336_LLMs_From_Scratch/Stanford CS336 Language Modeling from Scratch \uFF5C Spring 2025 \uFF5C Lecture 15\uFF1A Alignment - SFT\u29F8RLHF [Dfu7vC9jo4w].webm' },
                { title: 'CS336 Lec 16 - Alignment RL 1', file: '04_CS336_LLMs_From_Scratch/Stanford CS336 Language Modeling from Scratch \uFF5C Spring 2025 \uFF5C Lecture 16\uFF1A Alignment - RL 1 [46f2QTDB08Q].webm' },
                { title: 'CS336 Lec 17 - Alignment RL 2', file: '04_CS336_LLMs_From_Scratch/Stanford CS336 Language Modeling from Scratch \uFF5C Spring 2025 \uFF5C Lecture 17\uFF1A Alignment - RL 2 [JdGFdViaOJk].webm' }
            ]
        },
        {
            name: 'mini-RAG Course',
            tasks: [
                { title: 'mini-RAG 01 - About the Course', file: '05_mini_rag/10_mini_rag_Course/027 - mini-RAG \uFF5C 01 \uFF5C About the Course \u0645\u0627\u0630\u0627 \u0648\u0644\u0645\u0640\u0640\u0640\u0627\u0630\u0627.webm' },
                { title: 'mini-RAG 02 - What will we build', file: '05_mini_rag/10_mini_rag_Course/026 - mini-RAG \uFF5C 02 \uFF5C What will we build \u0645\u0627\u0630\u0627 \u0633\u0646\u0628\u0646\u0649 \u0641\u064A \u0627\u0644\u0645\u0634\u0631\u0648\u0639.webm' },
                { title: 'mini-RAG 03 - Setup your tools', file: '05_mini_rag/10_mini_rag_Course/025 - mini-RAG \uFF5C 03 \uFF5C Setup your tools \u0627\u0644\u0623\u062F\u0648\u0627\u062A \u0627\u0644\u0623\u0633\u0627\u0633\u064A\u0629.webm' },
                { title: 'mini-RAG 04 - Project Architecture', file: '05_mini_rag/10_mini_rag_Course/024 - mini-RAG \uFF5C 04 \uFF5C Project Architecture.webm' },
                { title: 'mini-RAG 05 - Welcome to FastAPI', file: '05_mini_rag/10_mini_rag_Course/023 - mini-RAG \uFF5C 05 \uFF5C Welcome to FastAPI.webm' },
                { title: 'mini-RAG 06 - Nested Routes + Env', file: '05_mini_rag/10_mini_rag_Course/022 - mini-RAG \uFF5C 06 \uFF5C Nested Routes + Env Values.webm' },
                { title: 'mini-RAG 07 - Uploading a File', file: '05_mini_rag/10_mini_rag_Course/021 - mini-RAG \uFF5C 07 \uFF5C Uploading a File.webm' },
                { title: 'mini-RAG 08 - File Processing', file: '05_mini_rag/10_mini_rag_Course/020 - mini-RAG \uFF5C 08 \uFF5C File Processing.webm' },
                { title: 'mini-RAG 09 - Docker MongoDB Motor', file: '05_mini_rag/10_mini_rag_Course/019 - mini-RAG \uFF5C 09 \uFF5C Docker - MongoDB - Motor.webm' },
                { title: 'mini-RAG 10 - Mongo Schemes & Models', file: '05_mini_rag/10_mini_rag_Course/018 - mini-RAG \uFF5C 10 \uFF5C Mongo Schemes and Models.webm' },
                { title: 'mini-RAG 11 - Mongo Indexing', file: '05_mini_rag/10_mini_rag_Course/017 - mini-RAG \uFF5C 11 \uFF5C Mongo Indexing.webm' },
                { title: 'mini-RAG 12 - Data Pipeline', file: '05_mini_rag/10_mini_rag_Course/016 - mini-RAG \uFF5C 12 \uFF5C Data Pipeline Enhancements.webm' },
                { title: 'mini-RAG 13 - Checkpoint 1', file: '05_mini_rag/10_mini_rag_Course/015 - mini-RAG \uFF5C 13 \uFF5C Checkpoint-1 \uFF5C What have we learned so far\uFF1F.webm' },
                { title: 'mini-RAG 14 - LLM Factory', file: '05_mini_rag/10_mini_rag_Course/014 - mini-RAG \uFF5C 14 \uFF5C LLM Factory.webm' },
                { title: 'mini-RAG 15 - Vector DB QDrant', file: '05_mini_rag/10_mini_rag_Course/013 - mini-RAG \uFF5C 15 \uFF5C Vector DB Factory \uFF5C QDrant.webm' },
                { title: 'mini-RAG 16 - Semantic Search', file: '05_mini_rag/10_mini_rag_Course/012 - mini-RAG \uFF5C 16 \uFF5C Semantic Search.webm' },
                { title: 'mini-RAG 17 - Augmented Answers', file: '05_mini_rag/10_mini_rag_Course/011 - mini-RAG \uFF5C 17 \uFF5C Augmented Answers.webm' },
                { title: 'mini-RAG 18 - Checkpoint 2 Fixes', file: '05_mini_rag/10_mini_rag_Course/009 - mini-RAG \uFF5C 18 \uFF5C Checkpoint-2 \uFF5C Fixes.webm' },
                { title: 'mini-RAG 19 - Ollama Local LLM', file: '05_mini_rag/10_mini_rag_Course/008 - mini-RAG \uFF5C 19 \uFF5C Ollama Local LLM Server.webm' },
                { title: 'mini-RAG 20 - Postgres + SQLAlchemy', file: '05_mini_rag/10_mini_rag_Course/006 - mini-RAG \uFF5C 20 \uFF5C From Mongo to Postgres + SQLAlchemy & Alembic.webm' },
                { title: 'mini-RAG 21 - PGVector', file: '05_mini_rag/10_mini_rag_Course/004 - mini-RAG \uFF5C 21 \uFF5C The Way to PGVector.webm' },
                { title: 'mini-RAG 22 - Deployment Step 1', file: '05_mini_rag/10_mini_rag_Course/003 - mini-RAG \uFF5C 22 \uFF5C App Deployment \uFF5C Step 1\u29F82.webm' },
                { title: 'mini-RAG 23 - Deployment Step 2', file: '05_mini_rag/10_mini_rag_Course/002 - mini-RAG \uFF5C 23 \uFF5C App Deployment \uFF5C Step 2\u29F82.webm' }
            ]
        },
        {
            name: 'مشاريع ML تطبيقية',
            tasks: [
                { title: 'Air Quality Prediction', file: '06_Projects/11_ML_Projects/Air Quality Index Prediction in Python \uFF5C Machine Learning Projects \uFF5C GeeksforGeeks [0myaZxl4XWw].webm' },
                { title: 'Diabetes Prediction', file: '06_Projects/11_ML_Projects/Diabetes Prediction in Machine Learning using Python \uFF5C Machine Learning Projects \uFF5C GeeksforGeeks [AxYgzie4x2E].mkv' },
                { title: 'Fake News Detection', file: '06_Projects/11_ML_Projects/FAKE NEWS DETECTION Using MACHINE LEARNING \uFF5C Machine Learning Projects \uFF5C GeeksforGeeks [CkiXRQvz4Z4].webm' },
                { title: 'Heart Disease Detection', file: '06_Projects/11_ML_Projects/HEART DISEASE DETECTION using MACHINE LEARNING \uFF5C Machine Learning Projects \uFF5C GeeksforGeeks [F_9gGyCs3YY].mkv' },
                { title: 'Image Classification CNN', file: '06_Projects/11_ML_Projects/Image Classification using CNN \uFF5C Machine Learning Projects \uFF5C GeeksforGeeks [qm56XcRBXWc].mkv' },
                { title: 'Movie Recommendation', file: '06_Projects/11_ML_Projects/MOVIE RECOMMENDATION SYSTEM Using Machine Learning \uFF5C Machine Leaning Projects \uFF5C GeeksforGeeks [kxT8AursXXw].mkv' },
                { title: 'Stock Price Prediction', file: '06_Projects/11_ML_Projects/STOCK PRICE PREDICTION using Machine Learning\uD83D\uDCC8 \uFF5C Machine Learning Projects \uFF5C GeeksforGeeks [tn07dCSFOfQ].mkv' },
                { title: 'Titanic Survival', file: '06_Projects/11_ML_Projects/TITANIC SURVIVAL PREDICTION using TensorFlow \uFF5C Machine Learning Projects \uFF5C GeeksforGeeks [cRYSIR6LaNQ].mkv' },
                { title: 'Twitter Sentiment Analysis', file: '06_Projects/11_ML_Projects/TWITTER SENTIMENT ANALYSIS (NLP) \uFF5C Machine Learning Projects \uFF5C GeeksforGeeks [4YGkfAd2iXM].webm' },
                { title: 'Wine Quality Prediction', file: '06_Projects/11_ML_Projects/\uD83C\uDF77 WINE QUALITY PREDICTION using RANDOM FOREST Algorithm \uFF5C Machine Learning Projects \uFF5C GeeksforGeeks [MyllYgc-kh8].mkv' }
            ]
        },
        {
            name: 'Production + Portfolio',
            tasks: [
                { title: 'Big Data Engineering Part 1', file: '00_Loose_Files_Root/Big Data Engineering Full Course Part 1 _ 17 Hours.mp4' },
                { title: 'Big Data Engineering Part 2', file: '00_Loose_Files_Root/Big Data Engineering Full Course Part 2 _ 17 Hours.mp4' },
                { title: 'Python Pandas Tutorial', file: '00_Loose_Files_Root/Complete Python Pandas Data Science Tutorial! (Reading CSV_Excel files, Sorting, Filtering, Groupby).mp4' },
                { title: 'إعادة بناء mini-RAG كامل من الصفر (مشروع التخرج)', file: null }
            ]
        }
    ]
});
// =============================================================
//  🎬 VideoMover - نظام نقل الفيديوهات
// =============================================================

const VideoMover = {
    SERVER_URL: 'http://localhost:7777',
    serverOnline: false,

    async checkServer() {
        try {
            const resp = await fetch(this.SERVER_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'check', file: 'test' }),
                signal: AbortSignal.timeout(2000)
            });
            this.serverOnline = resp.ok || resp.status === 404;
            return this.serverOnline;
        } catch {
            this.serverOnline = false;
            return false;
        }
    },

    async moveFile(filePath) {
        try {
            const resp = await fetch(this.SERVER_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'move', file: filePath }),
                signal: AbortSignal.timeout(10000)
            });
            const result = await resp.json();
            if (resp.ok && result.success) {
                return { success: true, message: result.message };
            }
            return { success: false, message: result.error || 'خطأ غير معروف' };
        } catch (err) {
            return { success: false, message: 'تعذر الاتصال: ' + err.message };
        }
    },

    async undoMove(filePath) {
        try {
            const resp = await fetch(this.SERVER_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'undo', file: filePath })
            });
            return await resp.json();
        } catch {
            return { success: false, message: 'تعذر الاتصال بالسيرفر' };
        }
    },

    downloadMoveScript(filePath, title, rootPath) {
        const cleanFilePath = filePath.replace(/\\/g, '/');
        const cleanTitle = (title || 'video').replace(/[^a-zA-Z0-9_\-]/g, '_').substring(0, 50);
        const root = rootPath || '/Volumes/dt/AI-ENGINEER';

        const script = `#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import shutil
from pathlib import Path

root = Path(r"${root}")
video = root / r"${cleanFilePath}"
done_folder = video.parent / "✅_منتهي"

if not video.exists():
    print(f"⚠️ الملف غير موجود: {video}")
else:
    done_folder.mkdir(exist_ok=True)
    dest = done_folder / video.name
    if dest.exists():
        print(f"⚠️ موجود بالفعل: {dest}")
    else:
        shutil.move(str(video), str(dest))
        print(f"✅ تم نقل: {video.name}")
        print(f"   إلى: {dest}")
`.trim();

        const blob = new Blob([script], { type: 'text/x-python' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `move_${cleanTitle}.py`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        return a.download;
    }
};

window.VideoMover = VideoMover;

VideoMover.checkServer().then(online => {
    console.log(online ? '🟢 Video Mover Server متصل' : '🔴 Video Mover Server غير متصل');
});

setInterval(() => VideoMover.checkServer(), 30000);

// =============================================================
//  🔗 تعديل renderTask لدعم روابط فيديوهات AI Engineer
//  ⚠️ ترتيب البارامترات: (planId, groupId, task) مطابق للأصل
// =============================================================

(function patchRenderTaskForVideos() {
    const _originalRenderTask = window.renderTask;

    window.renderTask = function(planId, groupId, task) {
        const plan = (data.plans || []).find(p => p.id === planId);

        const isAIPlan = plan && plan.templateId === 'tpl_ai_engineer_full';
        const hasFile = task && task.file && task.file.trim().length > 0;

        if (!isAIPlan || !hasFile) {
            if (typeof _originalRenderTask === 'function') {
                return _originalRenderTask(planId, groupId, task);
            }
            return '';
        }

        const rootPath = plan.rootPath || '/Volumes/dt/AI-ENGINEER';
        const fullPath = `file://${rootPath}/${encodeURI(task.file)}`;

        const isDone = task.status === 'done';
        const isPostponed = task.status === 'postponed';
        const subsCount = (task.subs || []).length;
        const subsDone = (task.subs || []).filter(s => s.status === 'done').length;
        const isOverdue = task.date && new Date(task.date) < new Date() && !isDone;
        const hasTags = (task.tags || []).length > 0;
        const hasNotes = task.notes && task.notes.trim().length > 0;

        const safeFile = task.file.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
        const safeName = (task.name || '').replace(/\\/g, '\\\\').replace(/'/g, "\\'");

        const serverOnline = window.VideoMover && window.VideoMover.serverOnline;
        const serverDot = serverOnline ? '🟢' : '🔴';
        const serverTitle = serverOnline ? 'السيرفر متصل - نقل تلقائي' : 'السيرفر غير متصل - سكريبت يدوي';

        return `
            <div class="task"
                 draggable="true"
                 data-task-id="${task.id}"
                 data-group-id="${groupId}"
                 data-plan-id="${planId}"
                 style="${isDone ? 'opacity:0.6;' : ''}">

                <div class="drag-handle" title="اسحب لإعادة الترتيب">⠿</div>

                <div class="task-check ${isDone ? 'done' : isPostponed ? 'postponed' : ''}"
                     onclick="cycleTaskStatus('${planId}','${groupId}','${task.id}')">
                    ${isDone ? '✓' : isPostponed ? '⏸' : ''}
                </div>

                <span class="task-name ${isDone ? 'done' : ''}" style="display:flex;align-items:center;gap:8px;flex:1">
                    <a href="${fullPath}" target="_blank"
                       onclick="event.stopPropagation();"
                       style="display:flex;align-items:center;gap:6px;color:inherit;text-decoration:${isDone ? 'line-through' : 'none'};flex:1"
                       title="🎬 اضغط لفتح الفيديو">
                        <span style="font-size:1.1rem;min-width:20px">${isDone ? '✅' : '📹'}</span>
                        <span>${task.name}</span>
                    </a>
                </span>

                <div class="task-badges">
                    ${hasTags ? task.tags.map(tag => `<span class="badge badge-tag">${tag}</span>`).join('') : ''}
                    ${hasNotes ? '<span class="badge badge-date" title="ملاحظات">📄</span>' : ''}
                    ${subsCount > 0 ? `<span class="badge badge-count">📝 ${subsDone}/${subsCount}</span>` : ''}
                    ${task.date ? `<span class="badge ${isOverdue ? 'badge-overdue' : 'badge-date'}">${isOverdue ? '⏰' : '📅'} ${formatDate(task.date)}</span>` : ''}
                    <span class="badge" style="font-size:0.6rem;padding:1px 3px;opacity:0.4" title="${serverTitle}">${serverDot}</span>
                </div>

                <div class="task-actions">
                    ${isDone ? `
                        <button class="task-btn" onclick="event.stopPropagation();undoVideoDone('${planId}','${groupId}','${task.id}','${safeFile}','${safeName}')" title="تراجع">↩️</button>
                    ` : `
                        <button class="task-btn" onclick="event.stopPropagation();markVideoDone('${planId}','${groupId}','${task.id}','${safeFile}','${safeName}')"
                                title="✅ تم - نقل للمنتهي"
                                style="background:#10b981;color:white;border-radius:6px;padding:2px 10px;font-size:0.8rem;font-weight:600">
                            ✅ تم
                        </button>
                    `}
                    <button class="task-btn sub" onclick="openSubTasks('${planId}','${groupId}','${task.id}')" title="فرعية">📝</button>
                    <button class="task-btn" onclick="openTaskNotes('${planId}','${groupId}','${task.id}')" title="ملاحظات">📄</button>
                    <button class="task-btn" onclick="openTaskTags('${planId}','${groupId}','${task.id}')" title="تصنيفات">🏷️</button>
                    <button class="task-btn" onclick="setTaskDate('${planId}','${groupId}','${task.id}')" title="تاريخ">📅</button>
                    <button class="task-btn" onclick="startPomodoroForTask('${planId}','${groupId}','${task.id}')" title="بومودورو">🍅</button>
                    <button class="task-btn postpone" onclick="postponeTask('${planId}','${groupId}','${task.id}')" title="تأجيل">⏸</button>
                    <button class="task-btn delete" onclick="deleteTask('${planId}','${groupId}','${task.id}')" title="حذف">🗑</button>
                </div>
            </div>
        `;
    };

    console.log('🔗 renderTask patched for AI Engineer video links');
})();

// =============================================================
//  ✅ markVideoDone
// =============================================================

window.markVideoDone = async function(planId, groupId, taskId, filePath, title) {
    const found = findTask(planId, groupId, taskId);
    if (!found || !found.task) {
        toast('لم يتم العثور على المهمة!', 'error');
        return;
    }

    if (found.task.status === 'done') {
        toast('هذا الفيديو مُكتمل بالفعل ✅', 'info');
        return;
    }

    found.task.status = 'done';
    save();

    XPSystem.addXP(XPSystem.xpRewards.videoWatched, 'فيديو: ' + (title || '').substring(0, 30));

    if (typeof Achievements !== 'undefined' && Achievements.checkAndNotify) Achievements.checkAndNotify();
    if (typeof updateStreak === 'function') updateStreak();

    if (filePath) {
        const plan = (data.plans || []).find(p => p.id === planId);
        const rootPath = plan?.rootPath || '/Volumes/dt/AI-ENGINEER';

        await VideoMover.checkServer();

        if (VideoMover.serverOnline) {
            toast('⏳ جاري نقل الملف...', 'info');
            const result = await VideoMover.moveFile(filePath);

            if (result.success) {
                toast(`✅ تم! "${(title || '').substring(0, 25)}" → مجلد المنتهي`, 'success');
            } else {
                toast(`⚠️ فشل النقل: ${result.message}`, 'warning');
                if (confirm('تنزيل سكريبت نقل يدوي؟')) {
                    VideoMover.downloadMoveScript(filePath, title, rootPath);
                }
            }
        } else {
            const fileName = VideoMover.downloadMoveScript(filePath, title, rootPath);
            toast(`✅ تم. شغّل: python3 ${fileName}`, 'success');
        }
    } else {
        toast(`✅ "${(title || '').substring(0, 25)}" مكتمل!`, 'success');
    }

    render();
};

// =============================================================
//  ↩️ undoVideoDone
// =============================================================

window.undoVideoDone = async function(planId, groupId, taskId, filePath, title) {
    const found = findTask(planId, groupId, taskId);
    if (!found || !found.task) return;

    if (found.task.status !== 'done') {
        toast('هذا الفيديو ليس مكتملاً', 'info');
        return;
    }

    if (!confirm(`إرجاع "${title || 'الفيديو'}" إلى غير مكتمل؟`)) return;

    found.task.status = 'pending';
    save();

    if (filePath && VideoMover.serverOnline) {
        const result = await VideoMover.undoMove(filePath);
        if (result.success) {
            toast('↩️ تم إرجاع الفيديو والملف', 'success');
        } else {
            toast('↩️ تم إرجاع الحالة فقط', 'warning');
        }
    } else {
        toast('↩️ تم إرجاع حالة الفيديو', 'success');
    }

    render();
};

// =============================================================
//  🔧 دالة مساعدة
// =============================================================

window.findAITaskByFile = function(filePath) {
    for (const plan of (data.plans || [])) {
        if (plan.templateId !== 'tpl_ai_engineer_full') continue;
        for (const group of (plan.groups || [])) {
            for (const task of (group.tasks || [])) {
                if (task.file === filePath) return { plan, group, task };
            }
        }
    }
    return null;
};

// =============================================================
//  تسجيل عالمي
// =============================================================

window.XPSystem = XPSystem;
window.HabitTracker = HabitTracker;
window.Countdowns = Countdowns;
window.StickyNotes = StickyNotes;
window.PlanTemplates = PlanTemplates;
window.WeeklyCompare = WeeklyCompare;
window.AdvancedCharts = AdvancedCharts;
window.PDFExport = PDFExport;
window.KanbanBoard = KanbanBoard;

console.log('✅ Features v3.3 FIXED loaded');

} // إغلاق if (!window.__v33_loaded)
