// =============================================================
//  FEATURES v3.2
//  Flashcards + Gantt + Export + YouTube Tracker
// =============================================================

// =============================================================
//  🧠 #6 - FLASHCARDS (Spaced Repetition)
// =============================================================

const Flashcards = {
    currentDeck: null,
    currentIndex: 0,
    isFlipped: false,

    // ---- ضمان وجود البيانات ----
    _ensure() {
        if (!data.flashcards) data.flashcards = { decks: [] };
        if (!data.flashcards.decks) data.flashcards.decks = [];
    },

    // ---- إنشاء بطاقة من مهمة ----
    createFromTask(planId, groupId, taskId) {
        this._ensure();
        const found = findTask(planId, groupId, taskId);
        if (!found || !found.task) return;

        const task = found.task;
        const deckName = found.plan.name;

        let deck = data.flashcards.decks.find(d => d.planId === planId);
        if (!deck) {
            deck = { id: uid(), planId, name: deckName, icon: found.plan.icon, cards: [] };
            data.flashcards.decks.push(deck);
        }

        // أضف بطاقة رئيسية
        if (!deck.cards.find(c => c.taskId === taskId && !c.subIndex)) {
            deck.cards.push({
                id: uid(),
                taskId,
                front: task.name,
                back: task.notes || 'أضف شرح للبطاقة',
                nextReview: new Date().toISOString(),
                interval: 1,
                ease: 2.5,
                reviews: 0
            });
        }

        // أضف بطاقات من الدروس الفرعية
        (task.subs || []).forEach((sub, i) => {
            if (!deck.cards.find(c => c.taskId === taskId && c.subIndex === i)) {
                deck.cards.push({
                    id: uid(),
                    taskId,
                    subIndex: i,
                    front: sub.name,
                    back: 'أضف شرح للبطاقة',
                    nextReview: new Date().toISOString(),
                    interval: 1,
                    ease: 2.5,
                    reviews: 0
                });
            }
        });

        save();
        toast(`تم إنشاء بطاقات لـ: ${task.name} ✅`, 'success');
    },

    // ---- البطاقات المستحقة للمراجعة ----
    getDueCards(deckId) {
        this._ensure();
        const now = new Date().toISOString();
        const deck = deckId
            ? data.flashcards.decks.find(d => d.id === deckId)
            : null;

        const cards = deck ? deck.cards : data.flashcards.decks.flatMap(d =>
            d.cards.map(c => ({ ...c, deckName: d.name, deckIcon: d.icon }))
        );

        return cards.filter(c => !c.nextReview || c.nextReview <= now);
    },

    // ---- خوارزمية SM-2 ----
    review(cardId, quality) {
        // quality: 0=نسيت, 1=صعب, 2=متوسط, 3=سهل, 4=ممتاز
        this._ensure();

        let card = null;
        let deck = null;

        for (const d of data.flashcards.decks) {
            const c = d.cards.find(c => c.id === cardId);
            if (c) { card = c; deck = d; break; }
        }

        if (!card) return;

        card.reviews++;
        card.lastReview = new Date().toISOString();

        if (quality < 2) {
            // نسيت أو صعب جداً - أعد من البداية
            card.interval = 1;
            card.ease = Math.max(1.3, card.ease - 0.2);
        } else {
            if (card.interval === 1) {
                card.interval = quality >= 3 ? 3 : 1;
            } else {
                card.interval = Math.round(card.interval * card.ease);
            }

            // تعديل السهولة
            card.ease = card.ease + (0.1 - (4 - quality) * (0.08 + (4 - quality) * 0.02));
            card.ease = Math.max(1.3, card.ease);
        }

        // حساب الموعد التالي
        const next = new Date();
        next.setDate(next.getDate() + card.interval);
        card.nextReview = next.toISOString();

        save();
    },

    // ---- بدء جلسة مراجعة ----
    startSession(deckId) {
        const dueCards = this.getDueCards(deckId);
        if (dueCards.length === 0) {
            toast('🎉 لا توجد بطاقات مستحقة للمراجعة!', 'success');
            return;
        }

        this.currentDeck = deckId;
        this.currentIndex = 0;
        this.isFlipped = false;
        this.sessionCards = dueCards.slice(0, 20); // حد أقصى 20 بطاقة
        this.renderCard();
    },

    // ---- عرض بطاقة ----
    renderCard() {
        if (!this.sessionCards || this.currentIndex >= this.sessionCards.length) {
            this.showSessionComplete();
            return;
        }

        const card = this.sessionCards[this.currentIndex];
        const total = this.sessionCards.length;
        const c = document.getElementById('content');

        c.innerHTML = `
            <div class="section-header">
                <h2>🧠 مراجعة البطاقات</h2>
                <span style="font-size:0.85rem;color:var(--text-secondary)">${this.currentIndex + 1} / ${total}</span>
            </div>

            <div class="flashcard-progress">
                ${this.sessionCards.map((_, i) => `
                    <div class="fc-dot ${i === this.currentIndex ? 'active' : i < this.currentIndex ? 'done' : ''}"></div>
                `).join('')}
            </div>

            <div class="flashcard-container" onclick="Flashcards.flip()">
                <div class="flashcard ${this.isFlipped ? 'flipped' : ''}" id="flashcard">
                    <div class="flashcard-face flashcard-front">
                        <div class="flashcard-label">السؤال</div>
                        <div class="flashcard-text">${card.front}</div>
                        <div class="flashcard-hint">اضغط للقلب</div>
                    </div>
                    <div class="flashcard-face flashcard-back">
                        <div class="flashcard-label">الإجابة</div>
                        <div class="flashcard-text">${card.back}</div>
                    </div>
                </div>
            </div>

            ${this.isFlipped ? `
                <div class="flashcard-rating">
                    <button class="rating-btn hard" onclick="Flashcards.rate(0)">😞 نسيت</button>
                    <button class="rating-btn medium" onclick="Flashcards.rate(1)">😐 صعب</button>
                    <button class="rating-btn easy" onclick="Flashcards.rate(3)">😊 سهل</button>
                    <button class="rating-btn perfect" onclick="Flashcards.rate(4)">🤩 ممتاز</button>
                </div>
            ` : ''}

            <div class="flashcard-controls">
                <button class="btn btn-ghost btn-sm" onclick="Flashcards.editCard('${card.id}')">✏️ تعديل</button>
                <button class="btn btn-ghost btn-sm" onclick="Flashcards.skipCard()">⏭ تخطي</button>
                <button class="btn btn-ghost btn-sm" onclick="Flashcards.renderPage(document.getElementById('content'))">↩ رجوع</button>
            </div>
        `;
    },

    flip() {
        this.isFlipped = !this.isFlipped;
        this.renderCard();
    },

    rate(quality) {
        const card = this.sessionCards[this.currentIndex];
        this.review(card.id, quality);
        this.isFlipped = false;
        this.currentIndex++;
        this.renderCard();
    },

    skipCard() {
        this.isFlipped = false;
        this.currentIndex++;
        this.renderCard();
    },

    showSessionComplete() {
        const c = document.getElementById('content');
        c.innerHTML = `
            <div class="empty-state" style="padding:3rem">
                <div class="icon">🎉</div>
                <h2 style="margin-bottom:0.5rem">جلسة مكتملة!</h2>
                <p>راجعت ${this.currentIndex} بطاقة</p>
                <div style="display:flex;gap:0.5rem;justify-content:center;margin-top:1rem">
                    <button class="btn btn-primary" onclick="Flashcards.renderPage(document.getElementById('content'))">↩ العودة</button>
                    <button class="btn btn-ghost" onclick="navigate('dashboard')">🏠 الرئيسية</button>
                </div>
            </div>
        `;
        updateStreak();
        Achievements.checkAndNotify();
    },

    // ---- تعديل بطاقة ----
    editCard(cardId) {
        this._ensure();
        let card = null;
        for (const d of data.flashcards.decks) {
            const c = d.cards.find(c => c.id === cardId);
            if (c) { card = c; break; }
        }
        if (!card) return;

        openModal('✏️ تعديل البطاقة', `
            <div class="setup-form">
                <label>السؤال (الأمام)</label>
                <input type="text" id="fc-edit-front" class="input-field" value="${card.front}">
                <label>الإجابة (الخلف)</label>
                <textarea id="fc-edit-back" class="journal-textarea" style="min-height:100px">${card.back}</textarea>
            </div>
            <div style="display:flex;gap:0.5rem;margin-top:1rem">
                <button class="btn btn-primary" onclick="Flashcards._saveEdit('${cardId}')">حفظ</button>
                <button class="btn btn-danger" onclick="Flashcards._deleteCard('${cardId}')">حذف</button>
                <button class="btn btn-ghost" onclick="closeModal()">إلغاء</button>
            </div>
        `);
    },

    _saveEdit(cardId) {
        let card = null;
        for (const d of data.flashcards.decks) {
            const c = d.cards.find(c => c.id === cardId);
            if (c) { card = c; break; }
        }
        if (!card) return;
        card.front = document.getElementById('fc-edit-front')?.value || card.front;
        card.back = document.getElementById('fc-edit-back')?.value || card.back;
        save();
        closeModal();
        if (this.sessionCards) this.renderCard();
        else this.renderPage(document.getElementById('content'));
    },

    _deleteCard(cardId) {
        if (!confirm('حذف هذه البطاقة؟')) return;
        for (const d of data.flashcards.decks) {
            d.cards = d.cards.filter(c => c.id !== cardId);
        }
        data.flashcards.decks = data.flashcards.decks.filter(d => d.cards.length > 0);
        save();
        closeModal();
        this.renderPage(document.getElementById('content'));
    },

    // ---- إضافة بطاقة يدوية ----
    addManual(deckId) {
        openModal('➕ بطاقة جديدة', `
            <div class="setup-form">
                <label>السؤال</label>
                <input type="text" id="fc-new-front" class="input-field" placeholder="ما هو...؟">
                <label>الإجابة</label>
                <textarea id="fc-new-back" class="journal-textarea" style="min-height:80px" placeholder="الشرح..."></textarea>
            </div>
            <div style="display:flex;gap:0.5rem;margin-top:1rem">
                <button class="btn btn-primary" onclick="Flashcards._saveManual('${deckId}')">إضافة</button>
                <button class="btn btn-ghost" onclick="closeModal()">إلغاء</button>
            </div>
        `);
    },

    _saveManual(deckId) {
        this._ensure();
        const front = document.getElementById('fc-new-front')?.value?.trim();
        const back = document.getElementById('fc-new-back')?.value?.trim();
        if (!front) { toast('اكتب السؤال!', 'error'); return; }

        let deck = data.flashcards.decks.find(d => d.id === deckId);
        if (!deck) {
            deck = { id: deckId || uid(), name: 'بطاقات عامة', icon: '🧠', cards: [] };
            data.flashcards.decks.push(deck);
        }

        deck.cards.push({
            id: uid(),
            front,
            back: back || '',
            nextReview: new Date().toISOString(),
            interval: 1,
            ease: 2.5,
            reviews: 0
        });

        save();
        closeModal();
        this.renderPage(document.getElementById('content'));
        toast('تم إضافة البطاقة ✅', 'success');
    },

    // ---- صفحة البطاقات الرئيسية ----
    renderPage(c) {
        this._ensure();
        this.sessionCards = null;

        const allDue = this.getDueCards();
        const totalCards = data.flashcards.decks.reduce((s, d) => s + d.cards.length, 0);
        const totalReviews = data.flashcards.decks.reduce((s, d) =>
            s + d.cards.reduce((ss, c) => ss + (c.reviews || 0), 0), 0);

        c.innerHTML = `
            <div class="section-header">
                <h2>🧠 البطاقات التعليمية</h2>
                <div style="display:flex;gap:0.5rem">
                    ${allDue.length > 0 ? `<button class="btn btn-primary btn-sm" onclick="Flashcards.startSession()">🔄 مراجعة ${allDue.length} بطاقة</button>` : ''}
                    <button class="btn btn-ghost btn-sm" onclick="Flashcards.addManual()">➕ بطاقة يدوية</button>
                </div>
            </div>

            <div class="flashcard-stats-grid">
                <div class="fc-stat">
                    <div class="fc-stat-num" style="color:var(--primary)">${totalCards}</div>
                    <div class="fc-stat-label">إجمالي البطاقات</div>
                </div>
                <div class="fc-stat">
                    <div class="fc-stat-num" style="color:var(--danger)">${allDue.length}</div>
                    <div class="fc-stat-label">مستحقة الآن</div>
                </div>
                <div class="fc-stat">
                    <div class="fc-stat-num" style="color:var(--success)">${totalReviews}</div>
                    <div class="fc-stat-label">إجمالي المراجعات</div>
                </div>
                <div class="fc-stat">
                    <div class="fc-stat-num">${data.flashcards.decks.length}</div>
                    <div class="fc-stat-label">مجموعات</div>
                </div>
            </div>

            ${allDue.length > 0 ? `
                <div class="card" style="border-color:var(--warning);margin-bottom:1rem">
                    <div class="card-title" style="color:var(--warning)">🔔 بطاقات مستحقة للمراجعة (${allDue.length})</div>
                    <button class="btn btn-primary" onclick="Flashcards.startSession()" style="margin-top:0.5rem">ابدأ المراجعة الآن</button>
                </div>
            ` : `
                <div class="card" style="border-color:var(--success)">
                    <div class="card-title" style="color:var(--success)">✅ لا توجد بطاقات مستحقة حالياً</div>
                    <p style="font-size:0.85rem;color:var(--text-secondary)">أحسنت! عد لاحقاً للمراجعة.</p>
                </div>
            `}

            <h3 style="font-size:1rem;margin:1.5rem 0 0.75rem">📚 المجموعات</h3>
            ${data.flashcards.decks.length === 0 ? `
                <div class="empty-state" style="padding:1.5rem">
                    <p>لا توجد بطاقات. أنشئ بطاقات من المهام بالضغط على 🧠 في قائمة المهام.</p>
                </div>
            ` : data.flashcards.decks.map(deck => {
                const due = deck.cards.filter(c => !c.nextReview || c.nextReview <= new Date().toISOString()).length;
                return `
                    <div class="flashcard-deck-item" onclick="Flashcards.startSession('${deck.id}')">
                        <span style="font-size:1.2rem">${deck.icon || '🧠'}</span>
                        <div style="flex:1">
                            <div style="font-weight:600;font-size:0.88rem">${deck.name}</div>
                            <div style="font-size:0.75rem;color:var(--text-secondary)">${deck.cards.length} بطاقة</div>
                        </div>
                        ${due > 0 ? `<span class="fc-due-badge due-now">${due} مستحقة</span>` :
                            `<span class="fc-due-badge due-later">مراجعة لاحقاً</span>`}
                        <button class="btn btn-ghost btn-sm" onclick="event.stopPropagation();Flashcards.addManual('${deck.id}')">+</button>
                    </div>
                `;
            }).join('')}

            <div class="card" style="margin-top:1.5rem">
                <div class="card-title">💡 إنشاء بطاقات من المهام</div>
                <p style="font-size:0.85rem;color:var(--text-secondary);margin-bottom:0.75rem">اذهب لأي مهمة واضغط 🧠 لإنشاء بطاقات مراجعة تلقائياً</p>
                ${data.plans.map(p => `
                    <div style="cursor:pointer;padding:0.4rem;border-radius:var(--radius-sm);transition:var(--transition)"
                         onmouseover="this.style.background='var(--bg-hover)'"
                         onmouseout="this.style.background=''"
                         onclick="navigateToPlan('${p.id}')">
                        ${p.icon} ${p.name}
                    </div>
                `).join('')}
            </div>
        `;
    }
};

// =============================================================
//  📊 #5 - GANTT CHART
// =============================================================

const GanttChart = {
    // ---- حساب نطاق الأشهر ----
    getMonthRange() {
        const months = [];
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);

        for (let i = 0; i < 8; i++) {
            const d = new Date(start.getFullYear(), start.getMonth() + i, 1);
            months.push({
                key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
                label: d.toLocaleDateString('ar-EG', { month: 'short' }),
                year: d.getFullYear(),
                month: d.getMonth(),
                start: d,
                end: new Date(d.getFullYear(), d.getMonth() + 1, 0)
            });
        }
        return months;
    },

    // ---- حساب موقع البار ----
    getBarPosition(startDate, endDate, months) {
        if (!startDate) return null;

        const totalStart = months[0].start.getTime();
        const totalEnd = months[months.length - 1].end.getTime();
        const totalRange = totalEnd - totalStart;

        const s = new Date(startDate).getTime();
        const e = endDate ? new Date(endDate).getTime() : s + 86400000 * 14;

        const left = Math.max(0, ((s - totalStart) / totalRange) * 100);
        const width = Math.min(100 - left, Math.max(1, ((e - s) / totalRange) * 100));

        return { left: left + '%', width: width + '%' };
    },

    // ---- رسم المخطط ----
    render() {
        const months = this.getMonthRange();
        const today = new Date();
        const totalStart = months[0].start.getTime();
        const totalEnd = months[months.length - 1].end.getTime();
        const todayPos = ((today.getTime() - totalStart) / (totalEnd - totalStart)) * 100;

        // جمع البيانات
        const rows = [];

        data.plans.forEach(plan => {
            plan.groups.forEach(group => {
                const tasks = group.tasks.filter(t => t.date);
                if (tasks.length === 0) return;

                tasks.forEach(task => {
                    const endDate = new Date(task.date);
                    endDate.setDate(endDate.getDate() + 7);

                    rows.push({
                        label: task.name.length > 28 ? task.name.substring(0, 28) + '...' : task.name,
                        icon: plan.icon,
                        status: task.status,
                        bar: this.getBarPosition(task.date, endDate.toISOString().split('T')[0], months)
                    });
                });
            });
        });

        data.projects.forEach(proj => {
            proj.phases.forEach((phase, i) => {
                const start = new Date();
                start.setDate(start.getDate() + i * 14);
                const end = new Date(start);
                end.setDate(end.getDate() + 14);

                rows.push({
                    label: phase.name.length > 28 ? phase.name.substring(0, 28) + '...' : phase.name,
                    icon: proj.icon,
                    status: phase.status,
                    bar: this.getBarPosition(start.toISOString().split('T')[0], end.toISOString().split('T')[0], months)
                });
            });
        });

        return `
            <div class="card">
                <div class="card-title">📊 مخطط Gantt الزمني</div>
                <div class="gantt-container">
                    <div class="gantt-wrapper">
                        <div class="gantt-header">
                            <div class="gantt-label-col">المهمة</div>
                            <div class="gantt-timeline">
                                ${months.map(m => `<div class="gantt-month">${m.label}</div>`).join('')}
                            </div>
                        </div>

                        ${rows.length === 0 ? `
                            <div style="text-align:center;padding:2rem;color:var(--text-secondary);font-size:0.85rem">
                                حدد تواريخ للمهام لتظهر في المخطط الزمني
                            </div>
                        ` : rows.map(row => `
                            <div class="gantt-row">
                                <div class="gantt-row-label">
                                    <span>${row.icon}</span>
                                    <span style="overflow:hidden;text-overflow:ellipsis">${row.label}</span>
                                </div>
                                <div class="gantt-row-bars" style="position:relative">
                                    ${row.bar ? `
                                        <div class="gantt-bar ${row.status}"
                                             style="left:${row.bar.left};width:${row.bar.width}">
                                            ${row.status === 'done' ? '✓' : ''}
                                        </div>
                                    ` : ''}
                                </div>
                            </div>
                        `).join('')}

                        ${todayPos > 0 && todayPos < 100 ? `
                            <div style="position:relative;height:0">
                                <div class="gantt-today-line" style="left:calc(200px + ${todayPos}% * (100% - 200px) / 100)"></div>
                            </div>
                        ` : ''}
                    </div>
                </div>

                <div class="gantt-legend">
                    <div class="gantt-legend-item"><div class="gantt-legend-color" style="background:var(--success)"></div> مكتمل</div>
                    <div class="gantt-legend-item"><div class="gantt-legend-color" style="background:var(--primary)"></div> جاري</div>
                    <div class="gantt-legend-item"><div class="gantt-legend-color" style="background:var(--border)"></div> معلق</div>
                    <div class="gantt-legend-item"><div class="gantt-legend-color" style="background:var(--warning)"></div> مؤجل</div>
                    <div class="gantt-legend-item"><div class="gantt-legend-color" style="background:var(--danger);width:2px;height:14px"></div> اليوم</div>
                </div>
            </div>
        `;
    }
};

// =============================================================
//  🎬 YOUTUBE PLAYLIST TRACKER
// =============================================================

const YouTubeTracker = {
    _ensure() {
        if (!data.ytPlaylists) data.ytPlaylists = [];
    },

    // ---- إضافة قائمة تشغيل ----
    addPlaylist() {
        openModal('🎬 إضافة قائمة تشغيل YouTube', `
            <div class="setup-form">
                <label>اسم القائمة</label>
                <input type="text" id="yt-name" class="input-field" placeholder="مثال: Python Full Course">
                <label>رابط القائمة (اختياري)</label>
                <input type="text" id="yt-url" class="input-field" placeholder="https://youtube.com/playlist?list=...">
                <label>ربط بخطة (اختياري)</label>
                <select id="yt-plan" class="input-field">
                    <option value="">— بدون ربط —</option>
                    ${data.plans.map(p => `<option value="${p.id}">${p.icon} ${p.name}</option>`).join('')}
                </select>
            </div>
            <div style="display:flex;gap:0.5rem;margin-top:1rem">
                <button class="btn btn-primary" onclick="YouTubeTracker._savePlaylist()">إنشاء</button>
                <button class="btn btn-ghost" onclick="closeModal()">إلغاء</button>
            </div>
        `);
    },

    _savePlaylist() {
        this._ensure();
        const name = document.getElementById('yt-name')?.value?.trim();
        if (!name) { toast('اكتب اسم القائمة!', 'error'); return; }

        data.ytPlaylists.push({
            id: uid(),
            name,
            url: document.getElementById('yt-url')?.value?.trim() || '',
            planId: document.getElementById('yt-plan')?.value || '',
            videos: [],
            createdAt: new Date().toISOString()
        });

        save();
        closeModal();
        this.renderPage(document.getElementById('content'));
        toast('تم إنشاء القائمة ✅', 'success');
    },

    // ---- إضافة فيديو ----
    addVideo(playlistId) {
        openModal('🎥 إضافة فيديو', `
            <div class="setup-form">
                <label>عنوان الفيديو</label>
                <input type="text" id="yt-vid-title" class="input-field" placeholder="Lecture 1 - Introduction">
                <label>رابط الفيديو</label>
                <input type="text" id="yt-vid-url" class="input-field" placeholder="https://youtube.com/watch?v=...">
                <label>المدة (اختياري)</label>
                <input type="text" id="yt-vid-duration" class="input-field" placeholder="مثال: 45:30">
            </div>
            <div style="display:flex;gap:0.5rem;margin-top:1rem">
                <button class="btn btn-primary" onclick="YouTubeTracker._saveVideo('${playlistId}')">إضافة</button>
                <button class="btn btn-ghost" onclick="closeModal()">إلغاء</button>
            </div>
        `);
    },

    _saveVideo(playlistId) {
        this._ensure();
        const playlist = data.ytPlaylists.find(p => p.id === playlistId);
        if (!playlist) return;

        const title = document.getElementById('yt-vid-title')?.value?.trim();
        if (!title) { toast('اكتب عنوان الفيديو!', 'error'); return; }

        playlist.videos.push({
            id: uid(),
            title,
            url: document.getElementById('yt-vid-url')?.value?.trim() || '',
            duration: document.getElementById('yt-vid-duration')?.value?.trim() || '',
            watched: false,
            notes: ''
        });

        save();
        closeModal();
        this.renderPage(document.getElementById('content'));
    },

    // ---- تبديل حالة مشاهدة ----
    toggleVideo(playlistId, videoId) {
        this._ensure();
        const playlist = data.ytPlaylists.find(p => p.id === playlistId);
        if (!playlist) return;

        const video = playlist.videos.find(v => v.id === videoId);
        if (!video) return;

        video.watched = !video.watched;
        if (video.watched) {
            updateStreak();
            Achievements.checkAndNotify();
        }
        save();
        this.renderPage(document.getElementById('content'));
    },

    // ---- حذف قائمة ----
    deletePlaylist(playlistId) {
        if (!confirm('حذف هذه القائمة؟')) return;
        data.ytPlaylists = data.ytPlaylists.filter(p => p.id !== playlistId);
        save();
        this.renderPage(document.getElementById('content'));
    },

    // ---- حذف فيديو ----
    deleteVideo(playlistId, videoId) {
        const playlist = data.ytPlaylists.find(p => p.id === playlistId);
        if (!playlist) return;
        playlist.videos = playlist.videos.filter(v => v.id !== videoId);
        save();
        this.renderPage(document.getElementById('content'));
    },

    // ---- ملاحظات فيديو ----
    openVideoNotes(playlistId, videoId) {
        const playlist = data.ytPlaylists.find(p => p.id === playlistId);
        const video = playlist?.videos.find(v => v.id === videoId);
        if (!video) return;

        openModal(`📝 ملاحظات: ${video.title}`, `
            ${MarkdownEditor.render('yt-notes', video.notes || '')}
            <div style="display:flex;gap:0.5rem;margin-top:1rem">
                <button class="btn btn-primary" onclick="YouTubeTracker._saveVideoNotes('${playlistId}','${videoId}')">حفظ</button>
                <button class="btn btn-ghost" onclick="closeModal()">إلغاء</button>
            </div>
        `);
    },

    _saveVideoNotes(playlistId, videoId) {
        const playlist = data.ytPlaylists.find(p => p.id === playlistId);
        const video = playlist?.videos.find(v => v.id === videoId);
        if (!video) return;
        video.notes = MarkdownEditor.getValue('yt-notes');
        save();
        closeModal();
        toast('تم الحفظ ✅', 'success');
    },

    // ---- صفحة العرض ----
    renderPage(c) {
        this._ensure();

        const totalVideos = data.ytPlaylists.reduce((s, p) => s + p.videos.length, 0);
        const watchedVideos = data.ytPlaylists.reduce((s, p) => s + p.videos.filter(v => v.watched).length, 0);

        c.innerHTML = `
            <div class="section-header">
                <h2>🎬 قوائم تشغيل YouTube</h2>
                <button class="btn btn-primary btn-sm" onclick="YouTubeTracker.addPlaylist()">+ قائمة جديدة</button>
            </div>

            ${totalVideos > 0 ? `
                <div class="stat-card" style="margin-bottom:1rem">
                    <div style="display:flex;justify-content:space-between;align-items:center">
                        <div>
                            <span style="font-size:0.82rem;color:var(--text-secondary)">التقدم الإجمالي</span>
                            <div style="font-size:1.3rem;font-weight:800;color:var(--primary)">${watchedVideos}/${totalVideos}</div>
                        </div>
                        <div style="font-size:2rem">${watchedVideos === totalVideos && totalVideos > 0 ? '🎉' : '🎬'}</div>
                    </div>
                    <div class="progress-track" style="margin-top:0.5rem;height:6px">
                        <div class="progress-fill fill-primary" style="width:${totalVideos ? (watchedVideos/totalVideos*100) : 0}%"></div>
                    </div>
                </div>
            ` : ''}

            ${data.ytPlaylists.length === 0 ? `
                <div class="empty-state">
                    <div class="icon">🎬</div>
                    <p>لا توجد قوائم تشغيل. أضف أول قائمة!</p>
                    <button class="btn btn-primary" onclick="YouTubeTracker.addPlaylist()">+ إضافة</button>
                </div>
            ` : data.ytPlaylists.map(playlist => {
                const watched = playlist.videos.filter(v => v.watched).length;
                const total = playlist.videos.length;
                const pct = total ? Math.round(watched / total * 100) : 0;
                const plan = playlist.planId ? data.plans.find(p => p.id === playlist.planId) : null;

                return `
                    <div class="yt-playlist-card">
                        <div class="yt-playlist-header">
                            <div class="yt-playlist-title">
                                🎬 ${playlist.name}
                                ${plan ? `<span class="badge badge-tag">${plan.icon} ${plan.name}</span>` : ''}
                            </div>
                            <div style="display:flex;gap:0.3rem;align-items:center">
                                <div class="yt-total-progress">
                                    <span>${watched}/${total}</span>
                                    <div class="progress-track" style="width:60px;margin:0">
                                        <div class="progress-fill fill-primary" style="width:${pct}%"></div>
                                    </div>
                                    <span>${pct}%</span>
                                </div>
                                ${playlist.url ? `<a href="${playlist.url}" target="_blank" class="yt-video-link" title="فتح القائمة">▶</a>` : ''}
                                <button class="task-btn delete" onclick="YouTubeTracker.deletePlaylist('${playlist.id}')">🗑</button>
                            </div>
                        </div>

                        ${playlist.videos.map(video => `
                            <div class="yt-video-item">
                                <div class="yt-video-check ${video.watched ? 'done' : ''}"
                                     onclick="YouTubeTracker.toggleVideo('${playlist.id}','${video.id}')">
                                    ${video.watched ? '✓' : ''}
                                </div>
                                <span class="yt-video-title ${video.watched ? 'done' : ''}">${video.title}</span>
                                ${video.duration ? `<span class="yt-video-duration">${video.duration}</span>` : ''}
                                ${video.url ? `<a href="${video.url}" target="_blank" class="yt-video-link">▶</a>` : ''}
                                <button class="task-btn" onclick="YouTubeTracker.openVideoNotes('${playlist.id}','${video.id}')" title="ملاحظات">📝</button>
                                <button class="task-btn delete" onclick="YouTubeTracker.deleteVideo('${playlist.id}','${video.id}')">✕</button>
                            </div>
                        `).join('')}

                        <div class="add-form" style="margin-top:0.5rem">
                            <button class="btn btn-ghost btn-sm" onclick="YouTubeTracker.addVideo('${playlist.id}')">+ إضافة فيديو</button>
                        </div>
                    </div>
                `;
            }).join('')}
        `;
    }
};

// =============================================================
//  📤 #9 - EXPORT TO NOTION / OBSIDIAN
// =============================================================

const ExportTools = {
    // ---- تصدير Markdown (Obsidian) ----
    exportObsidian() {
        let md = `# 🎯 رحلة التعلم\n`;
        md += `> تاريخ التصدير: ${new Date().toLocaleDateString('ar-EG')}\n\n`;
        md += `## 📊 الإحصائيات\n`;

        const s = getStats();
        md += `- التقدم: ${s.doneTasks}/${s.totalTasks} مهمة\n`;
        md += `- المشاريع: ${s.donePhases}/${s.totalPhases} مرحلة\n`;
        md += `- سلسلة الإنجاز: ${data.streak} يوم\n\n`;

        // الخطط
        data.plans.forEach(plan => {
            md += `## ${plan.icon} ${plan.name}\n\n`;
            plan.groups.forEach(group => {
                md += `### ${group.name}\n\n`;
                group.tasks.forEach(task => {
                    const check = task.status === 'done' ? 'x' : ' ';
                    md += `- [${check}] ${task.name}`;
                    if (task.date) md += ` 📅 ${task.date}`;
                    if ((task.tags || []).length > 0) md += ` 🏷️ ${task.tags.join(', ')}`;
                    md += `\n`;

                    if (task.notes) md += `  > ${task.notes.replace(/\n/g, '\n  > ')}\n`;

                    (task.subs || []).forEach(sub => {
                        const subCheck = sub.status === 'done' ? 'x' : ' ';
                        md += `  - [${subCheck}] ${sub.name}\n`;
                    });

                    (task.links || []).forEach(link => {
                        md += `  - 🔗 [${link.title}](${link.url})\n`;
                    });
                });
                md += `\n`;
            });
        });

        // المشاريع
        md += `## 🛠️ المشاريع\n\n`;
        data.projects.forEach(proj => {
            md += `### ${proj.icon} ${proj.name}\n\n`;
            proj.phases.forEach(phase => {
                const check = phase.status === 'done' ? 'x' : phase.status === 'active' ? '/' : ' ';
                md += `- [${check}] ${phase.name}\n`;
            });
            md += `\n`;
        });

        // اليوميات
        if (data.journalEntries && data.journalEntries.length > 0) {
            md += `## 📝 اليوميات\n\n`;
            data.journalEntries.forEach(entry => {
                md += `### ${new Date(entry.date).toLocaleDateString('ar-EG')}\n\n`;
                md += entry.text + '\n\n---\n\n';
            });
        }

        this._download(md, `learning-journey-obsidian-${new Date().toISOString().split('T')[0]}.md`);
        toast('تم التصدير لـ Obsidian ✅', 'success');
    },

    // ---- تصدير Notion (CSV) ----
    exportNotion() {
        let csv = 'Name,Status,Date,Plan,Group,Tags,Notes\n';

        data.plans.forEach(plan => {
            plan.groups.forEach(group => {
                group.tasks.forEach(task => {
                    const row = [
                        `"${task.name.replace(/"/g, '""')}"`,
                        task.status,
                        task.date || '',
                        `"${plan.name}"`,
                        `"${group.name}"`,
                        `"${(task.tags || []).join(', ')}"`,
                        `"${(task.notes || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`,
                    ];
                    csv += row.join(',') + '\n';
                });
            });
        });

        this._download(csv, `learning-journey-notion-${new Date().toISOString().split('T')[0]}.csv`, 'text/csv');
        toast('تم التصدير لـ Notion ✅', 'success');
    },

    // ---- فتح نافذة التصدير ----
    openExportDialog() {
        openModal('📤 تصدير البيانات', `
            <div style="display:flex;flex-direction:column;gap:1rem">
                <div class="card" style="cursor:pointer" onclick="ExportTools.exportObsidian();closeModal()">
                    <div class="card-title">📝 Obsidian / Markdown</div>
                    <p style="font-size:0.82rem;color:var(--text-secondary)">ملف .md متوافق مع Obsidian وأي محرر Markdown</p>
                </div>
                <div class="card" style="cursor:pointer" onclick="ExportTools.exportNotion();closeModal()">
                    <div class="card-title">📋 Notion (CSV)</div>
                    <p style="font-size:0.82rem;color:var(--text-secondary)">ملف CSV يمكن استيراده في Notion كقاعدة بيانات</p>
                </div>
                <div class="card" style="cursor:pointer" onclick="exportData();closeModal()">
                    <div class="card-title">💾 JSON (نسخة احتياطية)</div>
                    <p style="font-size:0.82rem;color:var(--text-secondary)">ملف JSON كامل لاستعادة البيانات لاحقاً</p>
                </div>
            </div>
        `);
    },

    _download(content, filename, type = 'text/markdown') {
        const blob = new Blob(['\ufeff' + content], { type: type + ';charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    }
};

// =============================================================
//  🔌 ربط كل شيء بالتطبيق
// =============================================================

// ---- إضافة Flashcards + YouTube في السايدبار ----
(function patchSidebarForNewFeatures() {
    const observer = new MutationObserver(() => {
        const nav = document.getElementById('sidebar-nav');
        if (!nav) return;

        // أضف Flashcards
        if (!nav.querySelector('[data-section="flashcards"]')) {
            const toolsDividers = nav.querySelectorAll('.nav-divider');
            let toolsDiv = null;
            toolsDividers.forEach(d => {
                if (d.textContent.includes('أدوات') || d.textContent.includes('Tools')) toolsDiv = d;
            });

            if (toolsDiv) {
                const fcBtn = document.createElement('button');
                fcBtn.className = 'nav-item';
                fcBtn.setAttribute('data-section', 'flashcards');
                fcBtn.onclick = () => { currentView = 'flashcards'; navigate('flashcards', fcBtn); Flashcards.renderPage(document.getElementById('content')); };
                fcBtn.innerHTML = '<span class="nav-icon">🧠</span><span>البطاقات</span>';

                const ytBtn = document.createElement('button');
                                ytBtn.className = 'nav-item';
                ytBtn.setAttribute('data-section', 'youtube');
                ytBtn.onclick = () => { currentView = 'youtube'; navigate('youtube', ytBtn); YouTubeTracker.renderPage(document.getElementById('content')); };
                ytBtn.innerHTML = '<span class="nav-icon">🎬</span><span>قوائم الفيديو</span>';

                const ganttBtn = document.createElement('button');
                ganttBtn.className = 'nav-item';
                ganttBtn.setAttribute('data-section', 'gantt');
                ganttBtn.onclick = () => { currentView = 'gantt'; navigate('gantt', ganttBtn); document.getElementById('content').innerHTML = `<div class="section-header"><h2>📊 مخطط Gantt</h2></div>${GanttChart.render()}`; };
                ganttBtn.innerHTML = '<span class="nav-icon">📊</span><span>مخطط زمني</span>';

                // أدخل بعد divider الأدوات
                const nextSibling = toolsDiv.nextElementSibling;
                const pomodoroBtn = nav.querySelector('[onclick*="pomodoro"]');

                if (pomodoroBtn) {
                    pomodoroBtn.parentNode.insertBefore(fcBtn, pomodoroBtn.nextElementSibling);
                    fcBtn.parentNode.insertBefore(ytBtn, fcBtn.nextElementSibling);
                    ytBtn.parentNode.insertBefore(ganttBtn, ytBtn.nextElementSibling);
                }
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();

// ---- ربط render router بالصفحات الجديدة ----
(function patchRenderRouter() {
    const _origRender = window.render;
    window.render = function () {
        _origRender();

        const c = document.getElementById('content');
        if (!c) return;

        switch (currentView) {
            case 'flashcards':
                Flashcards.renderPage(c);
                break;
            case 'youtube':
                YouTubeTracker.renderPage(c);
                break;
            case 'gantt':
                c.innerHTML = `<div class="section-header"><h2>📊 مخطط Gantt الزمني</h2></div>${GanttChart.render()}`;
                break;
        }
    };
})();

// ---- إضافة زر 🧠 في task actions ----
(function patchTaskForFlashcards() {
    const _origRenderTask = window.renderTask;
    window.renderTask = function (planId, groupId, task) {
        let html = _origRenderTask(planId, groupId, task);

        // أضف زر Flashcard قبل زر الحذف
        const fcBtn = `<button class="task-btn" onclick="event.stopPropagation();Flashcards.createFromTask('${planId}','${groupId}','${task.id}')" title="إنشاء بطاقات مراجعة">🧠</button>`;

        html = html.replace(
            `onclick="deleteTask('${planId}','${groupId}','${task.id}')" title="حذف">🗑</button>`,
            `onclick="deleteTask('${planId}','${groupId}','${task.id}')" title="حذف">🗑</button>${fcBtn}`
        );

        return html;
    };
})();

// ---- إضافة Gantt في صفحة الإحصائيات ----
(function patchStatsForGantt() {
    const _origRenderStats = window.renderStatsPage;
    window.renderStatsPage = function (c) {
        _origRenderStats(c);
        c.insertAdjacentHTML('beforeend', GanttChart.render());
    };
})();

// ---- تعديل زر التصدير في السايدبار ----
(function patchExportButton() {
    setTimeout(() => {
        const exportBtns = document.querySelectorAll('.btn-icon[title="تصدير"], .btn-icon[title="Export"]');
        exportBtns.forEach(btn => {
            btn.onclick = () => ExportTools.openExportDialog();
        });
    }, 1000);

    // مراقبة مستمرة
    const observer = new MutationObserver(() => {
        const exportBtns = document.querySelectorAll('.btn-icon[title="تصدير"], .btn-icon[title="Export"]');
        exportBtns.forEach(btn => {
            if (!btn._patched) {
                btn._patched = true;
                btn.onclick = () => ExportTools.openExportDialog();
            }
        });
    });
    observer.observe(document.body, { childList: true, subtree: true });
})();

// ---- ضمان حقول البيانات الجديدة ----
(function ensureNewDataFields() {
    if (!data.flashcards) data.flashcards = { decks: [] };
    if (!data.ytPlaylists) data.ytPlaylists = [];
})();

// ---- اختصارات ----
document.addEventListener('keydown', (e) => {
    // Alt + R = مراجعة البطاقات
    if (e.altKey && e.key === 'r') {
        e.preventDefault();
        const due = Flashcards.getDueCards();
        if (due.length > 0) {
            currentView = 'flashcards';
            render();
            Flashcards.startSession();
        } else {
            toast('لا توجد بطاقات مستحقة للمراجعة 🎉', 'success');
        }
    }

    // Alt + Y = YouTube
    if (e.altKey && e.key === 'y') {
        e.preventDefault();
        currentView = 'youtube';
        render();
        YouTubeTracker.renderPage(document.getElementById('content'));
    }

    // Alt + G = Gantt
    if (e.altKey && e.key === 'g') {
        e.preventDefault();
        currentView = 'gantt';
        render();
    }
});

console.log('✅ Features v3.2 loaded: Flashcards + Gantt + Export + YouTube Tracker');
