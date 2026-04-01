// =============================================================
//  FEATURES v3.3
//  XP + Habits + Kanban + Countdown + Templates +
//  Charts + Sticky Notes + PDF + Weekly Compare
// =============================================================

// ---- ضمان الحقول ----
(function ensureV33Fields() {
    if (!data.xp) data.xp = { points: 0, history: [] };
    if (!data.habits) data.habits = [];
    if (!data.countdowns) data.countdowns = [];
    if (!data.stickyNotes) data.stickyNotes = [];
})();

// =============================================================
//  🎮 G - XP & LEVELING SYSTEM
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
        taskDone: 10,
        subDone: 3,
        pomodoroSession: 8,
        journalEntry: 5,
        habitCheck: 4,
        resourceDone: 5,
        flashcardReview: 2,
        videoWatched: 5,
        streakDay: 2,
        achievementUnlock: 25,
        planComplete: 100,
        projectPhase: 20
    },

    getTotal() {
        return data.xp?.points || 0;
    },

    getCurrentLevel() {
        const total = this.getTotal();
        let current = this.levels[0];
        for (const lvl of this.levels) {
            if (total >= lvl.xp) current = lvl;
            else break;
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
        return Math.round(((total - current.xp) / (next.xp - current.xp)) * 100);
    },

    addXP(amount, reason) {
        if (!data.xp) data.xp = { points: 0, history: [] };
        data.xp.points += amount;
        data.xp.history.push({
            amount,
            reason,
            date: new Date().toISOString()
        });

        // حد أقصى 100 سجل
        if (data.xp.history.length > 100) {
            data.xp.history = data.xp.history.slice(-100);
        }

        // فحص ارتقاء المستوى
        const oldLevel = this.getCurrentLevel();
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
        popup.innerHTML = `
            <div class="xp-popup-text">+${amount} XP</div>
            <div class="xp-popup-sub">${reason}</div>
        `;
        document.body.appendChild(popup);
        setTimeout(() => popup.remove(), 2200);
    },

    _showLevelUp(level) {
        toast(`🎉 ارتقيت إلى المستوى ${level.level}: ${level.icon} ${level.name}!`, 'success');
        const popup = document.createElement('div');
        popup.className = 'xp-popup';
        popup.innerHTML = `
            <div class="xp-popup-text">${level.icon} Level ${level.level}!</div>
            <div class="xp-popup-sub">${level.name}</div>
        `;
        document.body.appendChild(popup);
        setTimeout(() => popup.remove(), 3000);
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
    window.cycleTaskStatus = function (planId, groupId, taskId) {
        const found = findTask(planId, groupId, taskId);
        const wasDone = found?.task?.status === 'done';
        _origCycleTask(planId, groupId, taskId);
        if (found?.task?.status === 'done' && !wasDone) {
            XPSystem.addXP(XPSystem.xpRewards.taskDone, 'إكمال مهمة');
        }
    };

    const _origSaveJournalEntry = window.saveJournalEntry;
    window.saveJournalEntry = function () {
        const before = (data.journalEntries || []).length;
        _origSaveJournalEntry();
        if ((data.journalEntries || []).length > before) {
            XPSystem.addXP(XPSystem.xpRewards.journalEntry, 'إدخال يومية');
        }
    };
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
            updateStreak();
        }
        save();
        this.renderPage(document.getElementById('content'));
    },

    getStreak(habit) {
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
                        const streak = this.getStreak(habit);
                        const totalChecks = Object.keys(habit.log || {}).length;
                        return `
                            <div class="habit-card">
                                <div class="habit-header">
                                    <span class="habit-name">${habit.icon} ${habit.name}</span>
                                    <div style="display:flex;align-items:center;gap:0.3rem">
                                        ${streak > 0 ? `<span class="habit-streak">🔥 ${streak}</span>` : ''}
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
                                    <span>🔥 أطول سلسلة: ${streak}</span>
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
        save(); closeModal();
        this.renderPage(document.getElementById('content'));
    },

    delete(id) {
        data.countdowns = data.countdowns.filter(c => c.id !== id);
        save(); this.renderPage(document.getElementById('content'));
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
                <div class="empty-state"><div class="icon">⏰</div><p>لا يوجد عد تنازلي</p>
                    <button class="btn btn-primary" onclick="Countdowns.add()">+ إضافة</button></div>
            ` : `<div class="countdown-grid">
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
            </div>`}
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
                <div style="display:flex;gap:0.4rem">
                    ${this.colors.map(c => `
                        <div class="sticky-note ${c}" style="width:36px;height:36px;min-height:auto;cursor:pointer;border-radius:50%;display:flex;align-items:center;justify-content:center"
                             onclick="document.getElementById('sn-color').value='${c}';document.querySelectorAll('.sticky-note[style]').forEach(e=>e.style.border='');this.style.border='3px solid var(--text)'">
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
        save(); closeModal(); render();
    },

    delete(id) {
        data.stickyNotes = data.stickyNotes.filter(n => n.id !== id);
        save(); render();
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
        note.text = document.getElementById('sn-edit')?.value || note.text;
        save(); closeModal(); render();
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
                            <span>📝 ${t.groups.reduce((s,g) => s + g.tasks.length, 0)} مهمة</span>
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
            groups: tpl.groups.map(g => ({
                id: uid(),
                name: g.name,
                collapsed: false,
                tasks: g.tasks.map(t => ({
                    id: uid(), name: t, status: 'pending',
                    date: '', subs: [], notes: '', tags: [], links: []
                }))
            }))
        };

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
        const thisWeekStart = new Date(now);
        thisWeekStart.setDate(now.getDate() - now.getDay());
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
        const s = getStats();
        const slices = [
            { label: 'مكتمل', value: s.doneTasks, color: '#059669' },
            { label: 'مؤجل', value: s.postponedTasks, color: '#d97706' },
            { label: 'متبقي', value: s.totalTasks - s.doneTasks - s.postponedTasks, color: '#6b7280' }
        ].filter(s => s.value > 0);

        const total = slices.reduce((s, sl) => s + sl.value, 0);

        return `
            <div class="card">
                <div class="card-title">📊 توزيع المهام</div>
                <div class="chart-canvas-wrapper">
                    <div class="pie-chart-container">
                        <canvas id="pie-canvas" width="200" height="200"></canvas>
                        <div class="pie-chart-center">${total}</div>
                    </div>
                </div>
                <div class="pie-legend">
                    ${slices.map(s => `
                        <div class="pie-legend-item">
                            <div class="pie-legend-dot" style="background:${s.color}"></div>
                            <span>${s.label}: ${s.value} (${Math.round(s.value/total*100)}%)</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    },

    drawPie() {
        const canvas = document.getElementById('pie-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const s = getStats();

        const slices = [
            { value: s.doneTasks, color: '#059669' },
            { value: s.postponedTasks, color: '#d97706' },
            { value: s.totalTasks - s.doneTasks - s.postponedTasks, color: '#6b7280' }
        ].filter(s => s.value > 0);

        const total = slices.reduce((s, sl) => s + sl.value, 0);
        if (total === 0) return;

        const cx = 100, cy = 100, r = 85;
        let startAngle = -Math.PI / 2;

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

        // وسط أبيض
        ctx.beginPath();
        ctx.arc(cx, cy, 50, 0, Math.PI * 2);
        ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--bg-card').trim() || '#fff';
        ctx.fill();
    }
};

// =============================================================
//  📄 H - PDF EXPORT
// =============================================================

const PDFExport = {
    generate() {
        const s = getStats();
        const pct = s.totalTasks ? Math.round(s.doneTasks / s.totalTasks * 100) : 0;

        openModal('📄 تصدير تقرير', `
            <div class="pdf-preview" id="pdf-content">
                <div class="pdf-header">
                    <div class="pdf-title">🎯 تقرير رحلة التعلم</div>
                    <div class="pdf-date">${new Date().toLocaleDateString('ar-EG', {year:'numeric',month:'long',day:'numeric'})}</div>
                </div>

                <div class="pdf-section">
                    <h3>📊 ملخص عام</h3>
                    <p>التقدم: ${pct}% | المهام: ${s.doneTasks}/${s.totalTasks} | السلسلة: ${data.streak} يوم | الوقت: ${Math.round(s.totalPomodoroMins/60)} ساعة</p>
                </div>

                <div class="pdf-section">
                    <h3>📋 الخطط</h3>
                    ${data.plans.map(p => {
                        let t = 0, d = 0;
                        p.groups.forEach(g => g.tasks.forEach(task => { t++; if (task.status === 'done') d++; }));
                        return `<p>${p.icon} ${p.name}: ${t ? Math.round(d/t*100) : 0}% (${d}/${t})</p>`;
                    }).join('')}
                </div>

                <div class="pdf-section">
                    <h3>🛠️ المشاريع</h3>
                    ${data.projects.map(p => {
                        const d = p.phases.filter(ph => ph.status === 'done').length;
                        return `<p>${p.icon} ${p.name}: ${d}/${p.phases.length}</p>`;
                    }).join('')}
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
        win.document.write(`
            <html dir="rtl"><head><title>تقرير رحلة التعلم</title>
            <style>body{font-family:sans-serif;padding:2rem;color:#1f2937;line-height:1.8}
            h3{color:#4f46e5;border-bottom:1px solid #e5e7eb;padding-bottom:0.3rem}
            .pdf-header{text-align:center;margin-bottom:2rem;border-bottom:2px solid #4f46e5;padding-bottom:1rem}
            .pdf-title{font-size:1.5rem;font-weight:800;color:#4f46e5}</style></head>
            <body>${content}</body></html>
        `);
        win.document.close();
        win.print();
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

        data.plans.forEach(plan => {
            plan.groups.forEach(group => {
                group.tasks.forEach(task => {
                    const status = task.status === 'done' ? 'done' : task.status === 'postponed' ? 'postponed' : 'pending';
                    cols[status].tasks.push({
                        ...task,
                        planId: plan.id,
                        groupId: group.id,
                        planIcon: plan.icon,
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
                                        ${(task.subs || []).length > 0 ? `<span class="badge badge-count">📝 ${task.subs.filter(s=>s.status==='done').length}/${task.subs.length}</span>` : ''}
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
        if (!found || !found.task) return;

        const statusMap = {
            'pending': 'pending',
            'active': 'pending',
            'done': 'done',
            'postponed': 'postponed'
        };

        const oldStatus = found.task.status;
        found.task.status = statusMap[newStatus] || 'pending';

        if (found.task.status === 'done' && oldStatus !== 'done') {
            updateStreak();
            XPSystem.addXP(XPSystem.xpRewards.taskDone, 'إكمال مهمة من Kanban');
            Achievements.checkAndNotify();
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
                document.getElementById('sidebar').classList.remove('open');
            };
            otherDiv.parentNode.insertBefore(btn, otherDiv);
        });
    };

    const observer = new MutationObserver(addButtons);
    observer.observe(document.body, { childList: true, subtree: true });
    setTimeout(addButtons, 800);
})();
// =============================================================
//  🔌 ربط بالـ render router
// =============================================================

(function patchRenderV33() {
    const _origRender = window.render;
    window.render = function () {
        _origRender();

        const c = document.getElementById('content');
        if (!c) return;

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
    };
})();

// =============================================================
//  🔌 ربط بالداشبورد
// =============================================================

(function patchDashboardV33() {
    const _origDashboard = window.renderDashboard;
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
                        <div class="card-title" style="cursor:pointer" onclick="currentView='habits';render();HabitTracker.renderPage(document.getElementById('content'))">
                            ✅ العادات اليومية
                            <span style="font-size:0.75rem;color:var(--primary);margin-right:0.5rem">عرض الكل ←</span>
                        </div>
                    </div>
                    <div class="habits-grid" style="grid-template-columns:repeat(auto-fill,minmax(250px,1fr))">
                        ${data.habits.slice(0, 4).map(habit => {
                            const streak = HabitTracker.getStreak(habit);
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

            if (urgentCountdowns.length > 0 && achievementsCard) {
                const cdHtml = `
                    <div class="card" style="margin-bottom:1rem">
                        <div class="card-title">⏰ قادم قريباً</div>
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
                achievementsCard.insertAdjacentHTML('beforebegin', cdHtml);
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

        // رسم Pie Chart
        setTimeout(() => AdvancedCharts.drawPie(), 100);
    };
})();
// =============================================================
//  🔌 ربط قوالب الخطط بزر "خطة جديدة"
// =============================================================

(function patchNewPlan() {
    const _origAddNewPlan = window.addNewPlan;
    window.addNewPlan = function () {
        openModal('📚 خطة جديدة', `
            <div style="display:flex;flex-direction:column;gap:1rem">
                <div class="card" style="cursor:pointer" onclick="closeModal();PlanTemplates.openBrowser()">
                    <div class="card-title">📋 من قالب جاهز</div>
                    <p style="font-size:0.82rem;color:var(--text-secondary)">اختر من قوالب Python, ML, Web Dev والمزيد</p>
                </div>
                <div class="card" style="cursor:pointer" onclick="closeModal();setTimeout(function(){(${_origAddNewPlan.toString()})()},100)">
                    <div class="card-title">✏️ خطة فارغة</div>
                    <p style="font-size:0.82rem;color:var(--text-secondary)">ابدأ من الصفر وأنشئ خطتك الخاصة</p>
                </div>
            </div>
        `);
    };
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
        HabitTracker.renderPage(document.getElementById('content'));
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
        KanbanBoard.renderPage(document.getElementById('content'));
    }

    // Alt + E = تصدير PDF
    if (e.altKey && e.key === 'e') {
        e.preventDefault();
        PDFExport.generate();
    }
});

// =============================================================
//  تحديث العد التنازلي كل دقيقة
// =============================================================
setInterval(() => {
    if (currentView === 'countdowns') {
        Countdowns.renderPage(document.getElementById('content'));
    }
}, 60000);

// =============================================================
//  ضمان رسم Pie Chart بعد كل render
// =============================================================
const _origRenderFinal = window.render;
window.render = function () {
    _origRenderFinal();
    setTimeout(() => {
        if (document.getElementById('pie-canvas')) {
            AdvancedCharts.drawPie();
        }
    }, 200);
};
// =============================================================
//  🔥 AI ENGINEER MASTERY – LLM & RAG FROM SCRATCH (24 أسبوع)
//  الخطة الكاملة التي طلبتها مع أسماء الملفات بالضبط من الـ tree
// =============================================================
PlanTemplates.templates.unshift({
    id: 'tpl_ai_engineer_full',
    name: '🤖 AI Engineer Mastery – LLM & RAG',
    icon: '🤖',
    desc: 'من الصفر إلى مهندس ذكاء اصطناعي متخصص (LLMs + RAG + Production) - 24 أسبوع',
    duration: '6 أشهر',
    groups: [
        {
            name: 'أسابيع 1-4: الأساسيات (رياضيات + احتمال + إحصاء)',
            tasks: [
                'math 1/Functions [2SpgdHN5dKU].webm',
                'math 1/Transformations of Functions [t644SoGQ4xU].webm',
                'math 1/Absolute Function [v8WLmE2bGSQ].webm',
                'math 1/Inverse Function [i2izH2b2PlY].webm',
                'math 1/Trigonometric Functions [fzlWZ5KUM7A].webm',
                'math 1/Exponential & Logarithmic [4xv6JSnnBno].webm',
                'math 1/Hyperbolic Functions [5P5KOjTBr9Q].webm',
                'math 1/Inverse Trigonometric [UwAqGDrowsY].webm',
                'math 1/Inverse Hyperbolic [giJc5s6q2js].mkv',
                'math 1/Limits L\'Hopital [jl_B8--XQS0].mkv',
                'math 1/Basic Table and Rules of Differentiation [cfZGo5B3J6E].webm',
                'math 1/Additional Notes on Differentiation [bDPmE0rzHyQ].mkv',
                'math 1/Lecture03- Differentiation II [PNkvpZALu8E].webm',
                'math 1/Lecture04- Inverse Function and Inverse Trigonometric [VuCHLzhz_io].mkv',
                'math 1/Lecture 06 - Applications of Differentiation [0MWdUPosYh8].mkv',
                'math 1/Selected applications of differentiation [qc7RC8OjYgQ].mkv',
                'math 1/Introduction to integration(1) [aTh6710uaeY].webm',
                'math 1/Introduction to integration (2) [D6ELbhq-xag].mkv',
                'probability & stat/00- Statistical Analysis [CL-fAMiysnk].webm',
                'probability & stat/01- Probability and Statistics [GmJJ2iZz08c].webm',
                'probability & stat/02- Counting & Probability [NrdCDmSAn7c].webm',
                'probability & stat/03- Rules& Conditional Probability [raeVQxzY7iE].webm',
                'probability & stat/04- Bayes Rule & RV [zWDzNUTfk9s].webm',
                'Coursera - Bayesian Statistics From Concept to Data Analysis (كامل)',
                'Coursera - Bayesian Statistics Techniques and Models (كامل)',
                'Coursera - Bayesian Statistics Mixture Models (كامل)',
                'Coursera - Bayesian Statistics Time Series Analysis (كامل)'
            ]
        },
        {
            name: 'أسابيع 5-7: Machine Learning أساسي (CS229 2022)',
            tasks: [
                '229/Stanford CS229 Machine Learning I Introduction I 2022 I Lecture 1 [Bl4Feh_Mjvo].webm',
                '229/Stanford CS229 Machine Learning I Supervised learning setup, LMS I 2022 I Lecture 2 [gqKaVgQxEJ0].webm',
                '229/Stanford CS229 Machine Learning I Weighted Least Squares, Logistic regression, Newton\'s Method I 2022 I Lecture 3 [k_pDh_68K6c].webm',
                '229/Stanford CS229 Machine Learning I Exponential family, Generalized Linear Models I 2022 I Lecture 4 [goDDnBbJQ4g].mkv',
                '229/Stanford CS229 Machine Learning I Gaussian discriminant analysis, Naive Bayes I 2022 I Lecture 5 [RMy_1mO4HLk].mkv',
                '229/Stanford CS229 Machine Learning I Naive Bayes, Laplace Smoothing I 2022 I Lecture 6 [ADj95edZc0w].mkv',
                '229/Stanford CS229 Machine Learning I Kernels I 2022 I Lecture 7 [dzDOqrac9Ks].mkv',
                '229/Stanford CS229 Machine Learning I Neural Networks 1 I 2022 I Lecture 8 [ZMxfDWPXmjc].mkv',
                '229/Stanford CS229 Machine Learning I Neural Networks 2 (backprop) I 2022 I Lecture 9 [UbtTv7j1tzU].mkv',
                '229/Stanford CS229 Machine Learning I Bias - Variance, Regularization I 2022 I Lecture 10 [7AQYw5FOVcw].mkv',
                '229/Stanford CS229 Machine Learning I Feature / Model selection, ML Advice I 2022 I Lecture 11 [NirZnqwYfYU].mkv'
            ]
        },
        {
            name: 'أسابيع 8-11: Deep Learning (CS230 + fast.ai + DS620)',
            tasks: [
                '230/Stanford CS230： Deep Learning ｜ Autumn 2018 ｜ Lecture 1 [PySo_6S4ZAg].webm',
                '230/Stanford CS230： Deep Learning ｜ Autumn 2018 ｜ Lecture 2 [AwQHqWyHRpU].webm',
                '230/Stanford CS230： Deep Learning ｜ Autumn 2018 ｜ Lecture 3 [JUJNGv_sb4Y].mkv',
                '230/Stanford CS230： Deep Learning ｜ Autumn 2018 ｜ Lecture 4 [ANszao6YQuM].mkv',
                '230/Stanford CS230： Deep Learning ｜ Autumn 2018 ｜ Lecture 5 [IM9ANAbufYM].mkv',
                '230/Stanford CS230： Deep Learning ｜ Autumn 2018 ｜ Lecture 6 [G5FNYxbW_Qw].mkv',
                '230/Stanford CS230： Deep Learning ｜ Autumn 2018 ｜ Lecture 7 [gCJCgQW_LKc].mkv',
                '230/Stanford CS230： Deep Learning ｜ Autumn 2018 ｜ Lecture 8 [733m6qBH-jI].webm',
                '230/Stanford CS230： Deep Learning ｜ Autumn 2018 ｜ Lecture 9 [NP2XqpgTJyo].mkv',
                '230/Stanford CS230： Deep Learning ｜ Autumn 2018 ｜ Lecture 10 [IFLstgCNOA4].mkv',
                'DL/Lesson 1： Practical Deep Learning for Coders 2022 [8SF_h3xF3cE].webm',
                'DL/Lesson 2： Practical Deep Learning for Coders 2022 [F4tvM4Vb3A0].webm',
                'DL/Lesson 3： Practical Deep Learning for Coders 2022 [hBBOjCiFcuo].webm',
                'DL/Lesson 4： Practical Deep Learning for Coders 2022 [toUgBQv1BT8].webm',
                'DL/Lesson 5： Practical Deep Learning for Coders 2022 [_rXzeWq4C6w].webm',
                'DL/Lesson 6： Practical Deep Learning for Coders 2022 [AdhG64NF76E].mkv',
                'DL/Lesson 7： Practical Deep Learning for Coders 2022 [p4ZZq0736Po].mkv',
                'DL/Lesson 8 - Practical Deep Learning for Coders 2022 [htiNBPxcXgo].mkv',
                'DL/Lesson 9： Deep Learning Foundations to Stable Diffusion [_7rMfsA24Ls].webm',
                'DS620/01-01-DS610LectureOne_Introduction.mp4',
                'DS620/02-01-DS620LectureTwo-Perceptron.mp4',
                'DS620/03-01-DS620LectureThree-GD.mp4',
                'DS620/04-01-DS620LectureFour-ِActivationFuctions.mp4',
                'DS620/05-01-DS620LectureFive-ِOptimization.mp4'
            ]
        },
        {
            name: 'أسابيع 12-19: LLMs من الصفر (CS336 + mini-rag)',
            tasks: [
                '336/Stanford CS336 Language Modeling from Scratch ｜ Spring 2025 ｜ Lecture 1： Overview and Tokenization [SQ3fZ1sAqXI].webm',
                '336/Stanford CS336 Language Modeling from Scratch ｜ Spring 2025 ｜ Lec. 2： Pytorch, Resource Accounting [msHyYioAyNE].webm',
                '336/Stanford CS336 Lang. Modeling from Scratch ｜ Spring 2025 ｜ Lec. 3： Architectures, Hyperparameters [ptFiH_bHnJw].webm',
                '336/Stanford CS336 Language Modeling from Scratch ｜ Spring 2025 ｜ Lecture 4： Mixture of experts [LPv1KfUXLCo].webm',
                '336/Stanford CS336 Language Modeling from Scratch ｜ Spring 2025 ｜ Lecture 5： GPUs [6OBtO9niT00].webm',
                '336/Stanford CS336 Language Modeling from Scratch ｜ Spring 2025 ｜ Lecture 6： Kernels, Triton [E8Mju53VB00].webm',
                '336/Stanford CS336 Language Modeling from Scratch ｜ Spring 2025 ｜ Lecture 7： Parallelism 1 [l1RJcDjzK8M].webm',
                '336/Stanford CS336 Language Modeling from Scratch ｜ Spring 2025 ｜ Lecture 8： Parallelism 2 [LHpr5ytssLo].webm',
                '336/Stanford CS336 Language Modeling from Scratch ｜ Spring 2025 ｜ Lecture 9： Scaling laws 1 [6Q-ESEmDf4Q].webm',
                '336/Stanford CS336 Language Modeling from Scratch ｜ Spring 2025 ｜ Lecture 10： Inference [fcgPYo3OtV0].webm',
                '336/Stanford CS336 Language Modeling from Scratch ｜ Spring 2025 ｜ Lecture 11： Scaling laws 2 [OSYuUqGBQxw].webm',
                '336/Stanford CS336 Language Modeling from Scratch ｜ Spring 2025 ｜ Lecture 12： Evaluation [x-R5l2HsXqM].webm',
                '336/Stanford CS336 Language Modeling from Scratch ｜ Spring 2025 ｜ Lecture 13： Data 1 [WePxmeXU1xg].webm',
                '336/Stanford CS336 Language Modeling from Scratch ｜ Spring 2025 ｜ Lecture 14： Data 2 [9Cd0THLS1t0].webm',
                '336/Stanford CS336 Language Modeling from Scratch ｜ Spring 2025 ｜ Lecture 15： Alignment - SFT⧸RLHF [Dfu7vC9jo4w].webm',
                '336/Stanford CS336 Language Modeling from Scratch ｜ Spring 2025 ｜ Lecture 16： Alignment - RL 1 [46f2QTDB08Q].webm',
                '336/Stanford CS336 Language Modeling from Scratch ｜ Spring 2025 ｜ Lecture 17： Alignment - RL 2 [JdGFdViaOJk].webm',
                'mini-rag/027 - mini-RAG ｜ 01 ｜ About the Course [Arabic].mkv',
                'mini-rag/026 - mini-RAG ｜ 02 ｜ What will we build.mkv',
                'mini-rag/025 - mini-RAG ｜ 03 ｜ Setup your tools.mkv',
                'mini-rag/024 - mini-RAG ｜ 04 ｜ Project Architecture.mkv',
                'mini-rag/023 - mini-RAG ｜ 05 ｜ Welcome to FastAPI.mkv',
                'mini-rag/022 - mini-RAG ｜ 06 ｜ Nested Routes + Env Values.mkv',
                'mini-rag/021 - mini-RAG ｜ 07 ｜ Uploading a File.mkv',
                'mini-rag/020 - mini-RAG ｜ 08 ｜ File Processing.mkv',
                'mini-rag/019 - mini-RAG ｜ 09 ｜ Docker - MongoDB - Motor.mkv',
                'mini-rag/018 - mini-RAG ｜ 10 ｜ Mongo Schemes and Models.mkv',
                'mini-rag/017 - mini-RAG ｜ 11 ｜ Mongo Indexing.mkv',
                'mini-rag/016 - mini-RAG ｜ 12 ｜ Data Pipeline Enhancements.mkv',
                'mini-rag/015 - mini-RAG ｜ 13 ｜ Checkpoint-1.mkv',
                'mini-rag/014 - mini-RAG ｜ 14 ｜ LLM Factory.mkv',
                'mini-rag/013 - mini-RAG ｜ 15 ｜ Vector DB Factory ｜ QDrant.mkv',
                'mini-rag/012 - mini-RAG ｜ 16 ｜ Semantic Search.mkv',
                'mini-rag/011 - mini-RAG ｜ 17 ｜ Augmented Answers.mkv',
                'mini-rag/009 - mini-RAG ｜ 18 ｜ Checkpoint-2.mkv',
                'mini-rag/008 - mini-RAG ｜ 19 ｜ Ollama Local LLM Server.mkv',
                'mini-rag/006 - mini-RAG ｜ 20 ｜ From Mongo to Postgres.mkv',
                'mini-rag/004 - mini-RAG ｜ 21 ｜ The Way to PGVector.mkv',
                'mini-rag/003 - mini-RAG ｜ 22 ｜ App Deployment ｜ Step 1.mkv',
                'mini-rag/002 - mini-RAG ｜ 23 ｜ App Deployment ｜ Step 2.mkv'
            ]
        },
        {
            name: 'أسابيع 20-24: مشاريع + Production + Portfolio',
            tasks: [
                'ml projects/Air Quality Index Prediction [0myaZxl4XWw].webm',
                'ml projects/Diabetes Prediction [AxYgzie4x2E].mkv',
                'ml projects/FAKE NEWS DETECTION [CkiXRQvz4Z4].webm',
                'ml projects/HEART DISEASE DETECTION [F_9gGyCs3YY].mkv',
                'ml projects/Image Classification using CNN [qm56XcRBXWc].mkv',
                'ml projects/MOVIE RECOMMENDATION SYSTEM [kxT8AursXXw].mkv',
                'ml projects/STOCK PRICE PREDICTION [tn07dCSFOfQ].mkv',
                'ml projects/TITANIC SURVIVAL PREDICTION [cRYSIR6LaNQ].mkv',
                'ml projects/TWITTER SENTIMENT ANALYSIS [4YGkfAd2iXM].webm',
                'ml projects/WINE QUALITY PREDICTION [MyllYgc-kh8].mkv',
                'data engineering/The Data Engineering Bootcamp Zero to Mastery (كامل)',
                'CS231N/Stanford CS231N Deep Learning for Computer Vision ｜ Spring 2025 (كل المحاضرات)',
                'إعادة بناء mini-RAG كامل من الصفر (مشروع التخرج)',
                'إنشاء Portfolio على GitHub + نشر النموذج'
            ]
        }
    ]
});

console.log('✅ تم إضافة خطة AI Engineer Mastery الكاملة (24 أسبوع) إلى PlanTemplates');

console.log('✅ Features v3.3 loaded: XP + Habits + Kanban + Countdown + Templates + Charts + Sticky Notes + PDF + Weekly Compare');
