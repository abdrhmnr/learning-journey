// =============================================================
//  DATA STORE
// =============================================================
const STORAGE_KEY = 'journey_app_v3';

const DEFAULT = {
    plans: [
        {
            id: 'plan_ds',
            name: 'علم البيانات - من مبتدئ إلى متوسط',
            icon: '📊',
            groups: [
                {
                    id: 'g1',
                    name: 'الشهر 1: تقوية الأساسيات',
                    collapsed: false,
                    tasks: [
                        { id: 't1', name: 'Python المتقدم - OOP', status: 'pending', date: '', subs: [] },
                        { id: 't2', name: 'Decorators & Generators', status: 'pending', date: '', subs: [] },
                        { id: 't3', name: 'File I/O - PyMuPDF, pandas, openpyxl', status: 'pending', date: '', subs: [] },
                        { id: 't4', name: 'SQL المتقدم - Window Functions', status: 'pending', date: '', subs: [] },
                        { id: 't5', name: 'Statistics - Probability & Hypothesis Testing', status: 'pending', date: '', subs: [] },
                    ]
                },
                {
                    id: 'g2',
                    name: 'الشهر 2: Machine Learning',
                    collapsed: true,
                    tasks: [
                        { id: 't6', name: 'Scikit-learn أساسيات', status: 'pending', date: '', subs: [] },
                        { id: 't7', name: 'Linear & Logistic Regression', status: 'pending', date: '', subs: [] },
                        { id: 't8', name: 'Decision Trees & Random Forest', status: 'pending', date: '', subs: [] },
                        { id: 't9', name: 'Cross Validation & Tuning', status: 'pending', date: '', subs: [] },
                        { id: 't10', name: 'Feature Engineering', status: 'pending', date: '', subs: [] },
                    ]
                },
                {
                    id: 'g3',
                    name: 'الشهر 3: Git + Docker + مشروع',
                    collapsed: true,
                    tasks: [
                        { id: 't11', name: 'Git & GitHub', status: 'pending', date: '', subs: [] },
                        { id: 't12', name: 'Docker & Docker Compose', status: 'pending', date: '', subs: [] },
                        { id: 't13', name: 'Flask API', status: 'pending', date: '', subs: [] },
                        { id: 't14', name: '🎯 مشروع ML + API + Docker', status: 'pending', date: '', subs: [] },
                    ]
                }
            ]
        },
        {
            id: 'plan_dl',
            name: 'Deep Learning + NLP + RAG',
            icon: '🤖',
            groups: [
                {
                    id: 'g4', name: 'الشهر 4: Deep Learning', collapsed: true,
                    tasks: [
                        { id: 't15', name: 'PyTorch أساسيات', status: 'pending', date: '', subs: [] },
                        { id: 't16', name: 'Neural Networks', status: 'pending', date: '', subs: [] },
                        { id: 't17', name: 'CNNs & Transfer Learning', status: 'pending', date: '', subs: [] },
                        { id: 't18', name: 'RNN & LSTM', status: 'pending', date: '', subs: [] },
                        { id: 't19', name: 'NLP & Transformers & Hugging Face', status: 'pending', date: '', subs: [] },
                    ]
                },
                {
                    id: 'g5', name: 'الشهر 5: مشروع Mini RAG 🎯', collapsed: true,
                    tasks: [
                        { id: 't20', name: 'RAG Architecture + Embeddings', status: 'pending', date: '', subs: [] },
                        { id: 't21', name: 'Vector DB (Chroma) + Chunking', status: 'pending', date: '', subs: [] },
                        { id: 't22', name: 'LangChain + Ollama', status: 'pending', date: '', subs: [] },
                        { id: 't23', name: 'OCR - Tesseract', status: 'pending', date: '', subs: [] },
                        { id: 't24', name: 'Streamlit + Docker', status: 'pending', date: '', subs: [] },
                    ]
                }
            ]
        },
        {
            id: 'plan_de',
            name: 'هندسة البيانات',
            icon: '🔧',
            groups: [
                {
                    id: 'g6', name: 'الشهر 6: PySpark + ETL', collapsed: true,
                    tasks: [
                        { id: 't25', name: 'PySpark DataFrames & SQL', status: 'pending', date: '', subs: [] },
                        { id: 't26', name: 'ETL + Airflow', status: 'pending', date: '', subs: [] },
                        { id: 't27', name: 'PostgreSQL', status: 'pending', date: '', subs: [] },
                    ]
                },
                {
                    id: 'g7', name: 'Kafka Streaming', collapsed: true,
                    tasks: [
                        { id: 't28', name: 'Kafka Architecture', status: 'pending', date: '', subs: [] },
                        { id: 't29', name: 'Spark Streaming + Kafka', status: 'pending', date: '', subs: [] },
                    ]
                }
            ]
        },
        {
            id: 'plan_masters',
            name: 'رحلة الماستر - Data Drift',
            icon: '🎓',
            groups: [
                {
                    id: 'g8', name: 'الأساسيات البحثية', collapsed: true,
                    tasks: [
                        { id: 't30', name: 'Research Methodology + LaTeX', status: 'pending', date: '', subs: [] },
                        { id: 't31', name: 'قراءة: Survey on Concept Drift', status: 'pending', date: '', subs: [] },
                        { id: 't32', name: 'River Library - ADWIN, DDM', status: 'pending', date: '', subs: [] },
                    ]
                },
                {
                    id: 'g9', name: 'التعمق + المشروع', collapsed: true,
                    tasks: [
                        { id: 't33', name: 'قراءة الأوراق البحثية الأساسية', status: 'pending', date: '', subs: [] },
                        { id: 't34', name: 'Online Learning Algorithms', status: 'pending', date: '', subs: [] },
                        { id: 't35', name: '🎯 مشروع Data Drift System', status: 'pending', date: '', subs: [] },
                    ]
                },
                {
                    id: 'g10', name: 'البحث والكتابة', collapsed: true,
                    tasks: [
                        { id: 't36', name: 'Literature Review', status: 'pending', date: '', subs: [] },
                        { id: 't37', name: 'Research Proposal', status: 'pending', date: '', subs: [] },
                        { id: 't38', name: 'تقديم رسمي للماستر', status: 'pending', date: '', subs: [] },
                    ]
                }
            ]
        }
    ],
    projects: [
        {
            id: 'proj_1', name: 'ML Pipeline متكامل', icon: '🔬',
            phases: [
                { id: 'p1', name: 'جمع وتنظيف البيانات', status: 'pending' },
                { id: 'p2', name: 'EDA + Feature Engineering', status: 'pending' },
                { id: 'p3', name: 'بناء النموذج + Flask API', status: 'pending' },
                { id: 'p4', name: 'Docker + GitHub', status: 'pending' },
            ]
        },
        {
            id: 'proj_2', name: 'Mini RAG System', icon: '🤖',
            phases: [
                { id: 'p5', name: 'Document Loader + Chunking', status: 'pending' },
                { id: 'p6', name: 'Embedding + Vector Store', status: 'pending' },
                { id: 'p7', name: 'OCR + Streamlit UI', status: 'pending' },
                { id: 'p8', name: 'Docker + Docs', status: 'pending' },
            ]
        },
        {
            id: 'proj_3', name: 'Data Drift Detection', icon: '📊',
            phases: [
                { id: 'p9', name: 'Architecture Design', status: 'pending' },
                { id: 'p10', name: 'Drift Detection Module', status: 'pending' },
                { id: 'p11', name: 'Dashboard + API', status: 'pending' },
                { id: 'p12', name: 'Docker Deploy', status: 'pending' },
            ]
        }
    ],
    resources: [
        {
            id: 'res_1', name: 'Stanford LLM Lectures',
            items: [
                { id: 'r1', text: 'Lecture 1 - Transformer', url: 'https://lnkd.in/dGnQW39t', done: false },
                { id: 'r2', text: 'Lecture 2 - Transformer Models', url: 'https://lnkd.in/dT_VEpVH', done: false },
                { id: 'r3', text: 'Lecture 3 - LLMs', url: 'https://lnkd.in/dwjjpjaP', done: false },
                { id: 'r4', text: 'Lecture 4 - Training', url: 'https://lnkd.in/dSi_xCEN', done: false },
                { id: 'r5', text: 'Lecture 5 - Tuning', url: 'https://lnkd.in/dUK5djpB', done: false },
                { id: 'r6', text: 'Lecture 6 - Reasoning', url: 'https://lnkd.in/dAGQTNAM', done: false },
                { id: 'r7', text: 'Lecture 7 - Agentic', url: 'https://lnkd.in/dWD4j7vm', done: false },
                { id: 'r8', text: 'Lecture 8 - Evaluation', url: 'https://lnkd.in/ddxE5zvb', done: false },
                { id: 'r9', text: 'Lecture 9 - Trends', url: 'https://lnkd.in/dGsTd8jN', done: false },
            ]
        },
        {
            id: 'res_2', name: 'أوراق بحثية',
            items: [
                { id: 'r10', text: 'Survey on Concept Drift (Gama 2014)', url: '', done: false },
                { id: 'r11', text: 'ADWIN Algorithm (Bifet 2007)', url: '', done: false },
                { id: 'r12', text: 'Learning under Concept Drift', url: '', done: false },
            ]
        }
    ],
    journal: '',
    journalEntries: [],
    streak: 0,
    lastActive: null,
    theme: 'dark'
};

let data;
let currentView = 'dashboard';

// =============================================================
//  PERSISTENCE - HYBRID (LOCAL + GITHUB)
// =============================================================

async function load() {
    // 1. حمّل من localStorage أولاً (سريع)
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        data = raw ? JSON.parse(raw) : null;
    } catch {
        data = null;
    }

    // 2. حاول التحميل من GitHub (إذا مُعد)
    if (SyncEngine.isConfigured()) {
        try {
            const remoteData = await SyncEngine.loadFromGitHub();
            if (remoteData) {
                // قارن: أيهما أحدث؟
                const localDate = data?.lastActive || '';
                const remoteDate = remoteData?.lastActive || '';

                if (remoteDate >= localDate) {
                    data = remoteData;
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
                }
            }
        } catch (e) {
            console.warn('GitHub load failed, using local:', e);
        }
    }

    // 3. إذا لا يوجد بيانات أصلاً
    if (!data || !data.plans) {
        data = JSON.parse(JSON.stringify(DEFAULT));
    }

    // ضمان الحقول الجديدة
    if (!data.journalEntries) data.journalEntries = [];
    if (!data.resources) data.resources = [];
}

function save() {
    // حفظ محلي فوري
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

    // حفظ على GitHub (مع تأخير)
    SyncEngine.debouncedSave(data);
}

async function forceSyncNow() {
    if (!SyncEngine.isConfigured()) {
        toast('المزامنة غير مُعدة. اذهب للإعدادات.', 'error');
        return;
    }
    toast('جاري المزامنة...', 'info');
    const success = await SyncEngine.saveToGitHub(data);
    if (success) {
        toast('تمت المزامنة ✅', 'success');
    } else {
        toast('فشلت المزامنة ❌', 'error');
    }
}

function uid() {
    return '_' + Math.random().toString(36).substr(2, 9);
}

// =============================================================
//  SETUP FLOW
// =============================================================

async function saveSetup() {
    const username = document.getElementById('setup-username').value.trim();
    const repo = document.getElementById('setup-repo').value.trim();
    const token = document.getElementById('setup-token').value.trim();

    if (!username || !repo || !token) {
        toast('أكمل جميع الحقول', 'error');
        return;
    }

    toast('جاري التحقق...', 'info');

    const validation = await SyncEngine.validateConnection(username, repo, token);

    if (!validation.valid) {
        toast(validation.error, 'error');
        return;
    }

    SyncEngine.saveConfig({ username, repo, token });

    // حاول تحميل البيانات من GitHub
    const remoteData = await SyncEngine.loadFromGitHub();
    if (remoteData && remoteData.plans) {
        data = remoteData;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        toast('تم تحميل بياناتك من GitHub ✅', 'success');
    } else {
        // أول مرة: ارفع البيانات الافتراضية
        await SyncEngine.saveToGitHub(data);
        toast('تم الإعداد وحفظ البيانات ✅', 'success');
    }

    startApp();
}

function skipSetup() {
    SyncEngine.saveConfig({ username: '', repo: '', token: '' });
    startApp();
}

function startApp() {
    document.getElementById('setup-screen').style.display = 'none';
    document.getElementById('app').style.display = 'flex';
    render();
}

function openSettings() {
    const config = SyncEngine.getConfig() || {};

    openModal('⚙️ الإعدادات', `
        <div class="setup-form">
            <label>GitHub Username</label>
            <input type="text" id="settings-username" value="${config.username || ''}">

            <label>Repository Name</label>
            <input type="text" id="settings-repo" value="${config.repo || ''}">

            <label>GitHub Token</label>
            <input type="password" id="settings-token" value="${config.token || ''}" placeholder="ghp_xxxxxxxxxxxx">

            <div style="display:flex;gap:0.5rem;margin-top:1rem">
                <button class="btn btn-primary" onclick="updateSettings()">حفظ</button>
                <button class="btn btn-ghost" onclick="closeModal()">إلغاء</button>
                <button class="btn btn-danger" onclick="resetAllData()" style="margin-right:auto">حذف كل البيانات</button>
            </div>

            <div style="margin-top:1rem;padding:0.75rem;background:var(--bg);border-radius:var(--radius-sm);font-size:0.8rem;color:var(--text-secondary)">
                <strong>حالة المزامنة:</strong>
                ${config.token ? '🟢 متصل' : '🔴 غير متصل (حفظ محلي فقط)'}
                <br>
                <strong>آخر نشاط:</strong> ${data.lastActive || 'لا يوجد'}
            </div>
        </div>
    `);
}

async function updateSettings() {
    const username = document.getElementById('settings-username').value.trim();
    const repo = document.getElementById('settings-repo').value.trim();
    const token = document.getElementById('settings-token').value.trim();

    if (token && username && repo) {
        const validation = await SyncEngine.validateConnection(username, repo, token);
        if (!validation.valid) {
            toast(validation.error, 'error');
            return;
        }
    }

    SyncEngine.saveConfig({ username, repo, token });
    closeModal();

    if (token) {
        SyncEngine.updateSyncStatus('synced');
        toast('تم تحديث الإعدادات ✅', 'success');
        forceSyncNow();
    } else {
        SyncEngine.updateSyncStatus('local');
        toast('الحفظ محلي فقط', 'info');
    }
}

function resetAllData() {
    if (!confirm('⚠️ حذف كل البيانات؟ لا يمكن التراجع!')) return;
    if (!confirm('تأكيد أخير: سيتم حذف كل شيء!')) return;

    localStorage.removeItem(STORAGE_KEY);
    data = JSON.parse(JSON.stringify(DEFAULT));
    save();
    closeModal();
    render();
    toast('تم إعادة التعيين', 'info');
}

// =============================================================
//  THEME
// =============================================================
function applyTheme() {
    document.documentElement.setAttribute('data-theme', data.theme || 'dark');
}

function toggleTheme() {
    data.theme = data.theme === 'dark' ? 'light' : 'dark';
    applyTheme();
    save();
}

// =============================================================
//  STREAK
// =============================================================
function updateStreak() {
    const today = new Date().toISOString().split('T')[0];
    if (data.lastActive === today) return;
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    data.streak = data.lastActive === yesterday ? data.streak + 1 : 1;
    data.lastActive = today;
    save();
}

// =============================================================
//  THEME
// =============================================================
function applyTheme() {
    document.documentElement.setAttribute('data-theme', data.theme || 'dark');
}

function toggleTheme() {
    data.theme = data.theme === 'dark' ? 'light' : 'dark';
    applyTheme();
    save();
}

// =============================================================
//  STREAK
// =============================================================
function updateStreak() {
    const today = new Date().toISOString().split('T')[0];
    if (data.lastActive === today) return;
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    data.streak = data.lastActive === yesterday ? data.streak + 1 : 1;
    data.lastActive = today;
    save();
}

// =============================================================
//  NAVIGATION
// =============================================================
function navigate(section, btn) {
    currentView = section;
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    if (btn) btn.classList.add('active');
    render();
    // Close sidebar on mobile
    document.getElementById('sidebar').classList.remove('open');
}

function navigateToPlan(planId) {
    currentView = 'plan:' + planId;
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    const btn = document.querySelector(`[data-plan="${planId}"]`);
    if (btn) btn.classList.add('active');
    render();
    document.getElementById('sidebar').classList.remove('open');
}

function navigateToProject(projId) {
    currentView = 'project:' + projId;
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    const btn = document.querySelector(`[data-project="${projId}"]`);
    if (btn) btn.classList.add('active');
    render();
    document.getElementById('sidebar').classList.remove('open');
}

function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('open');
}

// =============================================================
//  STATS
// =============================================================
function getStats() {
    let totalTasks = 0, doneTasks = 0, totalSubs = 0, doneSubs = 0;
    data.plans.forEach(p => p.groups.forEach(g => g.tasks.forEach(t => {
        totalTasks++;
        if (t.status === 'done') doneTasks++;
        (t.subs || []).forEach(s => { totalSubs++; if (s.status === 'done') doneSubs++; });
    })));

    let totalPhases = 0, donePhases = 0;
    data.projects.forEach(p => p.phases.forEach(ph => {
        totalPhases++;
        if (ph.status === 'done') donePhases++;
    }));

    return { totalTasks, doneTasks, totalSubs, doneSubs, totalPhases, donePhases };
}

// =============================================================
//  BUILD SIDEBAR NAV
// =============================================================
function buildSidebarNav() {
    const plansNav = document.getElementById('plans-nav');
    plansNav.innerHTML = data.plans.map(p => `
        <button class="nav-item ${currentView === 'plan:' + p.id ? 'active' : ''}"
                data-plan="${p.id}" onclick="navigateToPlan('${p.id}')">
            <span class="nav-icon">${p.icon || '📚'}</span>
            <span>${p.name}</span>
        </button>
    `).join('');

    const projNav = document.getElementById('projects-nav');
    projNav.innerHTML = data.projects.map(p => `
        <button class="nav-item ${currentView === 'project:' + p.id ? 'active' : ''}"
                data-project="${p.id}" onclick="navigateToProject('${p.id}')">
            <span class="nav-icon">${p.icon || '🛠️'}</span>
            <span>${p.name}</span>
        </button>
    `).join('');
}

// =============================================================
//  RENDER ROUTER
// =============================================================
function render() {
    buildSidebarNav();
    updateTopbar();

    const c = document.getElementById('content');

    if (currentView === 'dashboard') renderDashboard(c);
    else if (currentView === 'calendar') renderCalendar(c);
    else if (currentView === 'resources') renderResources(c);
    else if (currentView === 'journal') renderJournal(c);
    else if (currentView.startsWith('plan:')) renderPlan(c, currentView.split(':')[1]);
    else if (currentView.startsWith('project:')) renderProject(c, currentView.split(':')[1]);
    else renderDashboard(c);
}

function updateTopbar() {
    document.getElementById('current-date').textContent =
        new Date().toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    document.getElementById('streak-badge').textContent = `🔥 ${data.streak} يوم`;
}

// =============================================================
//  DASHBOARD
// =============================================================
function renderDashboard(c) {
    const s = getStats();
    const taskPct = s.totalTasks ? Math.round(s.doneTasks / s.totalTasks * 100) : 0;
    const projPct = s.totalPhases ? Math.round(s.donePhases / s.totalPhases * 100) : 0;
    const subPct = s.totalSubs ? Math.round(s.doneSubs / s.totalSubs * 100) : 0;

    c.innerHTML = `
        <div class="section-header">
            <h2>لوحة التحكم</h2>
        </div>

        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-label">التقدم العام</div>
                <div class="stat-value" style="color:var(--primary)">${taskPct}%</div>
                <div class="stat-sub">${s.doneTasks} من ${s.totalTasks} موضوع</div>
                <div class="progress-track"><div class="progress-fill fill-primary" style="width:${taskPct}%"></div></div>
            </div>
            <div class="stat-card">
                <div class="stat-label">المشاريع</div>
                <div class="stat-value" style="color:var(--success)">${projPct}%</div>
                <div class="stat-sub">${s.donePhases} من ${s.totalPhases} مرحلة</div>
                <div class="progress-track"><div class="progress-fill fill-success" style="width:${projPct}%"></div></div>
            </div>
            <div class="stat-card">
                <div class="stat-label">الدروس الفرعية</div>
                <div class="stat-value" style="color:var(--warning)">${s.doneSubs}</div>
                <div class="stat-sub">من ${s.totalSubs} درس</div>
                <div class="progress-track"><div class="progress-fill fill-warning" style="width:${subPct}%"></div></div>
            </div>
            <div class="stat-card">
                <div class="stat-label">سلسلة الإنجاز</div>
                <div class="stat-value" style="color:var(--warning)">${data.streak}</div>
                <div class="stat-sub">يوم متواصل ${data.streak >= 7 ? '🔥' : '🌱'}</div>
            </div>
        </div>

        <div class="two-col">
            <div class="card">
                <div class="card-title">📋 خطط التعلم</div>
                ${data.plans.map(p => {
                    let total = 0, done = 0;
                    p.groups.forEach(g => g.tasks.forEach(t => { total++; if (t.status === 'done') done++; }));
                    const pct = total ? Math.round(done / total * 100) : 0;
                    return `
                        <div class="task" onclick="navigateToPlan('${p.id}')" style="cursor:pointer">
                            <span>${p.icon || '📚'}</span>
                            <span class="task-name">${p.name}</span>
                            <span class="badge badge-count">${pct}%</span>
                        </div>
                    `;
                }).join('')}
            </div>
            <div class="card">
                <div class="card-title">🛠️ المشاريع</div>
                ${data.projects.map(p => {
                    const total = p.phases.length;
                    const done = p.phases.filter(ph => ph.status === 'done').length;
                    const pct = total ? Math.round(done / total * 100) : 0;
                    return `
                        <div class="task" onclick="navigateToProject('${p.id}')" style="cursor:pointer">
                            <span>${p.icon || '🛠️'}</span>
                            <span class="task-name">${p.name}</span>
                            <span class="badge badge-count">${pct}%</span>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `;
}

// =============================================================
//  PLAN VIEW
// =============================================================
function renderPlan(c, planId) {
    const plan = data.plans.find(p => p.id === planId);
    if (!plan) { renderDashboard(c); return; }

    let totalT = 0, doneT = 0;
    plan.groups.forEach(g => g.tasks.forEach(t => { totalT++; if (t.status === 'done') doneT++; }));
    const pct = totalT ? Math.round(doneT / totalT * 100) : 0;

    c.innerHTML = `
        <div class="section-header">
            <h2>
                <span>${plan.icon || '📚'}</span>
                <span class="editable" onclick="editPlanName('${plan.id}')">${plan.name}</span>
                <span style="font-size:0.85rem;color:var(--text-secondary);font-weight:400;margin-right:0.5rem">${pct}%</span>
            </h2>
            <div style="display:flex;gap:0.5rem">
                <button class="btn btn-primary btn-sm" onclick="addGroup('${plan.id}')">+ مجموعة</button>
                <button class="btn btn-ghost btn-sm" onclick="editPlanIcon('${plan.id}')">تغيير الأيقونة</button>
                <button class="btn btn-ghost btn-sm" style="color:var(--danger)" onclick="deletePlan('${plan.id}')">حذف الخطة</button>
            </div>
        </div>
        <div class="progress-track" style="margin-bottom:1.5rem;height:6px">
            <div class="progress-fill fill-primary" style="width:${pct}%"></div>
        </div>
        ${plan.groups.map(g => renderGroup(plan.id, g)).join('')}
    `;
}

function renderGroup(planId, group) {
    const done = group.tasks.filter(t => t.status === 'done').length;
    const total = group.tasks.length;
    const isOpen = !group.collapsed;

    return `
        <div class="card list-group">
            <div class="list-header" onclick="toggleGroup('${planId}','${group.id}')">
                <h3>
                    <span class="arrow ${isOpen ? 'open' : ''}">▶</span>
                    <span class="editable" onclick="event.stopPropagation();editGroupName('${planId}','${group.id}')">${group.name}</span>
                </h3>
                <div class="list-meta">
                    <span>${done}/${total}</span>
                    <div class="progress-track" style="width:60px"><div class="progress-fill fill-success" style="width:${total?Math.round(done/total*100):0}%"></div></div>
                    <button class="task-btn delete" onclick="event.stopPropagation();deleteGroup('${planId}','${group.id}')" title="حذف">🗑</button>
                </div>
            </div>
            <div class="list-items ${isOpen ? 'open' : ''}">
                ${group.tasks.map(t => renderTask(planId, group.id, t)).join('')}
                <div class="add-form">
                    <input type="text" placeholder="موضوع جديد..." id="input-${group.id}"
                           onkeydown="if(event.key==='Enter')addTask('${planId}','${group.id}')">
                    <button class="btn btn-primary btn-sm" onclick="addTask('${planId}','${group.id}')">إضافة</button>
                </div>
            </div>
        </div>
    `;
}

function renderTask(planId, groupId, task) {
    const isDone = task.status === 'done';
    const isPostponed = task.status === 'postponed';
    const subsCount = (task.subs || []).length;
        const subsDone = (task.subs || []).filter(s => s.status === 'done').length;
    const isOverdue = task.date && new Date(task.date) < new Date() && !isDone;

    return `
        <div class="task">
            <div class="task-check ${isDone ? 'done' : isPostponed ? 'postponed' : ''}"
                 onclick="cycleTaskStatus('${planId}','${groupId}','${task.id}')">
                ${isDone ? '✓' : isPostponed ? '⏸' : ''}
            </div>
            <span class="task-name ${isDone ? 'done' : ''}"
                  onclick="editTaskName('${planId}','${groupId}','${task.id}')">${task.name}</span>
            <div class="task-badges">
                ${subsCount > 0 ? `<span class="badge badge-count">📝 ${subsDone}/${subsCount}</span>` : ''}
                ${task.date ? `<span class="badge ${isOverdue ? 'badge-overdue' : 'badge-date'}">${isOverdue ? '⏰' : '📅'} ${formatDate(task.date)}</span>` : ''}
            </div>
            <div class="task-actions">
                <button class="task-btn sub" onclick="openSubTasks('${planId}','${groupId}','${task.id}')" title="الدروس">📝</button>
                <button class="task-btn" onclick="setTaskDate('${planId}','${groupId}','${task.id}')" title="تاريخ">📅</button>
                <button class="task-btn postpone" onclick="postponeTask('${planId}','${groupId}','${task.id}')" title="تأجيل">⏸</button>
                <button class="task-btn delete" onclick="deleteTask('${planId}','${groupId}','${task.id}')" title="حذف">🗑</button>
            </div>
        </div>
    `;
}

function formatDate(dateStr) {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('ar-EG', { month: 'short', day: 'numeric' });
}

// =============================================================
//  TASK ACTIONS
// =============================================================
function findTask(planId, groupId, taskId) {
    const plan = data.plans.find(p => p.id === planId);
    if (!plan) return null;
    const group = plan.groups.find(g => g.id === groupId);
    if (!group) return null;
    const task = group.tasks.find(t => t.id === taskId);
    return { plan, group, task };
}

function cycleTaskStatus(planId, groupId, taskId) {
    const found = findTask(planId, groupId, taskId);
    if (!found || !found.task) return;
    const t = found.task;

    if (t.status === 'pending') t.status = 'done';
    else if (t.status === 'done') t.status = 'pending';
    else if (t.status === 'postponed') t.status = 'done';

    if (t.status === 'done') updateStreak();
    save();
    render();
}

function postponeTask(planId, groupId, taskId) {
    const found = findTask(planId, groupId, taskId);
    if (!found || !found.task) return;
    found.task.status = found.task.status === 'postponed' ? 'pending' : 'postponed';

    // إذا كان له تاريخ، نقله ليوم واحد
    if (found.task.date && found.task.status === 'postponed') {
        const d = new Date(found.task.date);
        d.setDate(d.getDate() + 1);
        found.task.date = d.toISOString().split('T')[0];
    }

    save();
    render();
}

function setTaskDate(planId, groupId, taskId) {
    const found = findTask(planId, groupId, taskId);
    if (!found || !found.task) return;

    const current = found.task.date || new Date().toISOString().split('T')[0];
    openModal('📅 تحديد التاريخ', `
        <p style="margin-bottom:1rem;color:var(--text-secondary)">${found.task.name}</p>
        <input type="date" id="date-input" class="input-field" value="${current}" style="width:100%;padding:0.6rem">
        <div style="display:flex;gap:0.5rem;margin-top:1rem">
            <button class="btn btn-primary" onclick="saveTaskDate('${planId}','${groupId}','${taskId}')">حفظ</button>
            <button class="btn btn-ghost" onclick="clearTaskDate('${planId}','${groupId}','${taskId}')">إزالة التاريخ</button>
        </div>
    `);
}

function saveTaskDate(planId, groupId, taskId) {
    const found = findTask(planId, groupId, taskId);
    if (!found || !found.task) return;
    found.task.date = document.getElementById('date-input').value;
    save();
    closeModal();
    render();
}

function clearTaskDate(planId, groupId, taskId) {
    const found = findTask(planId, groupId, taskId);
    if (!found || !found.task) return;
    found.task.date = '';
    save();
    closeModal();
    render();
}

function addTask(planId, groupId) {
    const input = document.getElementById('input-' + groupId);
    if (!input || !input.value.trim()) return;

    const plan = data.plans.find(p => p.id === planId);
    const group = plan?.groups.find(g => g.id === groupId);
    if (!group) return;

    group.tasks.push({
        id: uid(),
        name: input.value.trim(),
        status: 'pending',
        date: '',
        subs: []
    });

    input.value = '';
    save();
    render();
}

function deleteTask(planId, groupId, taskId) {
    if (!confirm('حذف هذا الموضوع؟')) return;
    const plan = data.plans.find(p => p.id === planId);
    const group = plan?.groups.find(g => g.id === groupId);
    if (!group) return;
    group.tasks = group.tasks.filter(t => t.id !== taskId);
    save();
    render();
}

function editTaskName(planId, groupId, taskId) {
    const found = findTask(planId, groupId, taskId);
    if (!found || !found.task) return;
    const newName = prompt('تعديل اسم الموضوع:', found.task.name);
    if (newName && newName.trim()) {
        found.task.name = newName.trim();
        save();
        render();
    }
}

// =============================================================
//  SUB-TASKS (LESSONS)
// =============================================================
function openSubTasks(planId, groupId, taskId) {
    const found = findTask(planId, groupId, taskId);
    if (!found || !found.task) return;
    const task = found.task;
    if (!task.subs) task.subs = [];

    const subsHtml = task.subs.length === 0
        ? '<p style="color:var(--text-secondary);text-align:center;padding:1.5rem">لا توجد دروس. أضف أول درس!</p>'
        : task.subs.map((s, i) => `
            <div class="task" style="padding:0.45rem 0.6rem">
                <div class="task-check ${s.status === 'done' ? 'done' : ''}"
                     onclick="toggleSub('${planId}','${groupId}','${taskId}',${i})">
                    ${s.status === 'done' ? '✓' : ''}
                </div>
                <span class="task-name ${s.status === 'done' ? 'done' : ''}"
                      onclick="editSubName('${planId}','${groupId}','${taskId}',${i})">${s.name}</span>
                <div class="task-actions" style="opacity:1">
                    <button class="task-btn delete" onclick="deleteSub('${planId}','${groupId}','${taskId}',${i})">✕</button>
                </div>
            </div>
        `).join('');

    openModal(`📝 دروس: ${task.name}`, `
        <div class="add-form">
            <input type="text" id="sub-input" class="input-field" placeholder="أضف درس جديد..."
                   onkeydown="if(event.key==='Enter')addSub('${planId}','${groupId}','${taskId}')">
            <button class="btn btn-primary btn-sm" onclick="addSub('${planId}','${groupId}','${taskId}')">إضافة</button>
        </div>
        <div id="subs-list">${subsHtml}</div>
    `);

    setTimeout(() => document.getElementById('sub-input')?.focus(), 100);
}

function addSub(planId, groupId, taskId) {
    const input = document.getElementById('sub-input');
    if (!input || !input.value.trim()) return;

    const found = findTask(planId, groupId, taskId);
    if (!found || !found.task) return;
    if (!found.task.subs) found.task.subs = [];

    found.task.subs.push({ name: input.value.trim(), status: 'pending' });
    input.value = '';
    save();

    // إعادة رسم المحتوى داخل Modal
    openSubTasks(planId, groupId, taskId);
    render(); // تحديث الـ badges في الخلفية
}

function toggleSub(planId, groupId, taskId, subIndex) {
    const found = findTask(planId, groupId, taskId);
    if (!found || !found.task) return;
    const sub = found.task.subs[subIndex];
    if (!sub) return;
    sub.status = sub.status === 'done' ? 'pending' : 'done';
    if (sub.status === 'done') updateStreak();
    save();
    openSubTasks(planId, groupId, taskId);
    render();
}

function deleteSub(planId, groupId, taskId, subIndex) {
    const found = findTask(planId, groupId, taskId);
    if (!found || !found.task) return;
    found.task.subs.splice(subIndex, 1);
    save();
    openSubTasks(planId, groupId, taskId);
    render();
}

function editSubName(planId, groupId, taskId, subIndex) {
    const found = findTask(planId, groupId, taskId);
    if (!found || !found.task) return;
    const sub = found.task.subs[subIndex];
    if (!sub) return;
    const newName = prompt('تعديل اسم الدرس:', sub.name);
    if (newName && newName.trim()) {
        sub.name = newName.trim();
        save();
        openSubTasks(planId, groupId, taskId);
    }
}

// =============================================================
//  GROUP ACTIONS
// =============================================================
function toggleGroup(planId, groupId) {
    const plan = data.plans.find(p => p.id === planId);
    const group = plan?.groups.find(g => g.id === groupId);
    if (!group) return;
    group.collapsed = !group.collapsed;
    save();
    render();
}

function addGroup(planId) {
    const name = prompt('اسم المجموعة الجديدة:');
    if (!name || !name.trim()) return;
    const plan = data.plans.find(p => p.id === planId);
    if (!plan) return;
    plan.groups.push({
        id: uid(),
        name: name.trim(),
        collapsed: false,
        tasks: []
    });
    save();
    render();
}

function editGroupName(planId, groupId) {
    const plan = data.plans.find(p => p.id === planId);
    const group = plan?.groups.find(g => g.id === groupId);
    if (!group) return;
    const newName = prompt('تعديل اسم المجموعة:', group.name);
    if (newName && newName.trim()) {
        group.name = newName.trim();
        save();
        render();
    }
}

function deleteGroup(planId, groupId) {
    if (!confirm('حذف هذه المجموعة وكل محتوياتها؟')) return;
    const plan = data.plans.find(p => p.id === planId);
    if (!plan) return;
    plan.groups = plan.groups.filter(g => g.id !== groupId);
    save();
    render();
}

// =============================================================
//  PLAN ACTIONS
// =============================================================
function addNewPlan() {
    const name = prompt('اسم الخطة الجديدة:');
    if (!name || !name.trim()) return;
    const icon = prompt('أيقونة (emoji):', '📚') || '📚';

    data.plans.push({
        id: uid(),
        name: name.trim(),
        icon: icon,
        groups: []
    });
    save();
    navigateToPlan(data.plans[data.plans.length - 1].id);
}

function editPlanName(planId) {
    const plan = data.plans.find(p => p.id === planId);
    if (!plan) return;
    const newName = prompt('تعديل اسم الخطة:', plan.name);
    if (newName && newName.trim()) {
        plan.name = newName.trim();
        save();
        render();
    }
}

function editPlanIcon(planId) {
    const plan = data.plans.find(p => p.id === planId);
    if (!plan) return;
    const newIcon = prompt('أيقونة جديدة (emoji):', plan.icon);
    if (newIcon) {
        plan.icon = newIcon;
        save();
        render();
    }
}

function deletePlan(planId) {
    if (!confirm('حذف هذه الخطة بالكامل؟ لا يمكن التراجع!')) return;
    data.plans = data.plans.filter(p => p.id !== planId);
    save();
    currentView = 'dashboard';
    render();
}

// =============================================================
//  PROJECT VIEW
// =============================================================
function renderProject(c, projId) {
    const proj = data.projects.find(p => p.id === projId);
    if (!proj) { renderDashboard(c); return; }

    const total = proj.phases.length;
    const done = proj.phases.filter(p => p.status === 'done').length;
    const active = proj.phases.filter(p => p.status === 'active').length;
    const pct = total ? Math.round(done / total * 100) : 0;

    c.innerHTML = `
        <div class="section-header">
            <h2>
                <span>${proj.icon || '🛠️'}</span>
                <span class="editable" onclick="editProjectName('${proj.id}')">${proj.name}</span>
                <span style="font-size:0.85rem;color:var(--text-secondary);font-weight:400;margin-right:0.5rem">${pct}%</span>
            </h2>
            <div style="display:flex;gap:0.5rem">
                <button class="btn btn-primary btn-sm" onclick="addPhase('${proj.id}')">+ مرحلة</button>
                <button class="btn btn-ghost btn-sm" onclick="editProjectIcon('${proj.id}')">تغيير الأيقونة</button>
                <button class="btn btn-ghost btn-sm" style="color:var(--danger)" onclick="deleteProject('${proj.id}')">حذف المشروع</button>
            </div>
        </div>
        <div class="progress-track" style="margin-bottom:0.5rem;height:6px">
            <div class="progress-fill fill-success" style="width:${pct}%"></div>
        </div>
        <div style="color:var(--text-secondary);font-size:0.82rem;margin-bottom:1.5rem">
            ✅ ${done} مكتمل | 🔄 ${active} جاري | ⭕ ${total - done - active} متبقي
        </div>
        <div class="card">
            ${proj.phases.map((ph, i) => `
                <div class="phase-item ${ph.status === 'done' ? 'done' : ph.status === 'active' ? 'active' : ''}">
                    <span>${ph.status === 'done' ? '✅' : ph.status === 'active' ? '🔄' : '⭕'}</span>
                    <span class="task-name ${ph.status === 'done' ? 'done' : ''}" style="flex:1;cursor:pointer"
                          onclick="editPhaseName('${proj.id}',${i})">${ph.name}</span>
                    <div style="display:flex;gap:0.3rem">
                        ${ph.status !== 'done' ? `
                            <button class="btn btn-success btn-sm" onclick="setPhaseStatus('${proj.id}',${i},'done')">✓ تم</button>
                            ${ph.status !== 'active' ? `<button class="btn btn-primary btn-sm" onclick="setPhaseStatus('${proj.id}',${i},'active')">▶ جاري</button>` : ''}
                        ` : `
                            <button class="btn btn-ghost btn-sm" onclick="setPhaseStatus('${proj.id}',${i},'pending')">↺</button>
                        `}
                        <button class="task-btn delete" onclick="deletePhase('${proj.id}',${i})">🗑</button>
                    </div>
                </div>
            `).join('')}
            <div class="add-form" style="margin-top:0.5rem">
                <input type="text" placeholder="مرحلة جديدة..." id="phase-input-${proj.id}"
                       onkeydown="if(event.key==='Enter')addPhase('${proj.id}')">
                <button class="btn btn-primary btn-sm" onclick="addPhase('${proj.id}')">إضافة</button>
            </div>
        </div>
    `;
}

// =============================================================
//  PROJECT ACTIONS
// =============================================================
function addNewProject() {
    const name = prompt('اسم المشروع:');
    if (!name || !name.trim()) return;
    const icon = prompt('أيقونة (emoji):', '🛠️') || '🛠️';

    data.projects.push({
        id: uid(),
        name: name.trim(),
        icon: icon,
        phases: []
    });
    save();
    navigateToProject(data.projects[data.projects.length - 1].id);
}

function editProjectName(projId) {
    const proj = data.projects.find(p => p.id === projId);
    if (!proj) return;
    const newName = prompt('تعديل اسم المشروع:', proj.name);
    if (newName && newName.trim()) {
        proj.name = newName.trim();
        save();
        render();
    }
}

function editProjectIcon(projId) {
    const proj = data.projects.find(p => p.id === projId);
    if (!proj) return;
    const newIcon = prompt('أيقونة جديدة:', proj.icon);
    if (newIcon) {
        proj.icon = newIcon;
        save();
        render();
    }
}

function deleteProject(projId) {
    if (!confirm('حذف هذا المشروع؟')) return;
    data.projects = data.projects.filter(p => p.id !== projId);
    save();
    currentView = 'dashboard';
    render();
}

function addPhase(projId) {
    const input = document.getElementById('phase-input-' + projId);
    let name = '';

    if (input && input.value.trim()) {
        name = input.value.trim();
        input.value = '';
    } else {
        name = prompt('اسم المرحلة:');
        if (!name || !name.trim()) return;
        name = name.trim();
    }

    const proj = data.projects.find(p => p.id === projId);
    if (!proj) return;
    proj.phases.push({ id: uid(), name: name, status: 'pending' });
    save();
    render();
}

function setPhaseStatus(projId, index, status) {
    const proj = data.projects.find(p => p.id === projId);
    if (!proj || !proj.phases[index]) return;
    proj.phases[index].status = status;
    if (status === 'done') updateStreak();
    save();
    render();
}

function editPhaseName(projId, index) {
    const proj = data.projects.find(p => p.id === projId);
    if (!proj || !proj.phases[index]) return;
    const newName = prompt('تعديل:', proj.phases[index].name);
    if (newName && newName.trim()) {
        proj.phases[index].name = newName.trim();
        save();
        render();
    }
}

function deletePhase(projId, index) {
    if (!confirm('حذف هذه المرحلة؟')) return;
    const proj = data.projects.find(p => p.id === projId);
    if (!proj) return;
    proj.phases.splice(index, 1);
    save();
    render();
}

// =============================================================
//  CALENDAR
// =============================================================
let calOffset = 0;

function renderCalendar(c) {
    const today = new Date();
    const display = new Date(today.getFullYear(), today.getMonth() + calOffset, 1);
    const year = display.getFullYear();
    const month = display.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();

    const monthNames = ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];
    const dayNames = ['أحد','إثنين','ثلاثاء','أربعاء','خميس','جمعة','سبت'];

    // Collect all tasks with dates
    const tasksByDate = {};
    data.plans.forEach(p => p.groups.forEach(g => g.tasks.forEach(t => {
        if (t.date && t.status !== 'done') {
            if (!tasksByDate[t.date]) tasksByDate[t.date] = [];
            tasksByDate[t.date].push(t.name);
        }
    })));

    let daysHtml = dayNames.map(d => `<div class="cal-day-name">${d}</div>`).join('');

    for (let i = 0; i < firstDay; i++) {
        daysHtml += '<div class="cal-day empty"></div>';
    }

    const todayStr = today.toISOString().split('T')[0];

    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
        const isToday = dateStr === todayStr;
        const tasks = tasksByDate[dateStr] || [];
        const isOverdue = dateStr < todayStr;

        daysHtml += `
            <div class="cal-day ${isToday ? 'today' : ''}">
                <div class="cal-day-num">${day}</div>
                ${tasks.slice(0, 2).map(t =>
                    `<div class="cal-event ${isOverdue ? 'overdue' : ''}" title="${t}">${t.substring(0, 20)}</div>`
                ).join('')}
                ${tasks.length > 2 ? `<div style="font-size:0.6rem;color:var(--text-secondary)">+${tasks.length-2}</div>` : ''}
            </div>
        `;
    }

    // Upcoming deadlines
    const upcoming = [];
    const futureDate = new Date(today);
    futureDate.setDate(futureDate.getDate() + 7);
    const futureStr = futureDate.toISOString().split('T')[0];

    Object.entries(tasksByDate).forEach(([date, tasks]) => {
        if (date >= todayStr && date <= futureStr) {
            tasks.forEach(t => upcoming.push({ name: t, date }));
        }
    });

    // Overdue
    const overdue = [];
    Object.entries(tasksByDate).forEach(([date, tasks]) => {
        if (date < todayStr) {
            tasks.forEach(t => overdue.push({ name: t, date }));
        }
    });

    c.innerHTML = `
        <div class="section-header">
            <h2>📅 التقويم</h2>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem">
            <button class="btn btn-ghost" onclick="calOffset--;render()">◀ السابق</button>
            <h3 style="font-size:1.1rem">${monthNames[month]} ${year}</h3>
            <button class="btn btn-ghost" onclick="calOffset++;render()">التالي ▶</button>
        </div>
        <div class="cal-grid">${daysHtml}</div>

        ${overdue.length > 0 ? `
            <div class="card" style="margin-top:1.5rem;border-color:var(--danger)">
                <div class="card-title" style="color:var(--danger)">⏰ مهام متأخرة (${overdue.length})</div>
                ${overdue.map(t => `
                    <div class="task">
                        <span>⚠️</span>
                        <span class="task-name">${t.name}</span>
                        <span class="badge badge-overdue">${formatDate(t.date)}</span>
                    </div>
                `).join('')}
            </div>
        ` : ''}

        ${upcoming.length > 0 ? `
            <div class="card" style="margin-top:1rem;border-color:var(--primary)">
                <div class="card-title" style="color:var(--primary)">📋 قادم خلال 7 أيام (${upcoming.length})</div>
                ${upcoming.map(t => `
                    <div class="task">
                        <span>📌</span>
                        <span class="task-name">${t.name}</span>
                        <span class="badge badge-date">${formatDate(t.date)}</span>
                    </div>
                `).join('')}
            </div>
        ` : ''}
    `;
}

// =============================================================
//  RESOURCES
// =============================================================
function renderResources(c) {
    c.innerHTML = `
        <div class="section-header">
            <h2>📖 المصادر والمراجع</h2>
            <button class="btn btn-primary btn-sm" onclick="addResourceGroup()">+ مجموعة جديدة</button>
        </div>
        ${data.resources.map((group, gi) => {
            const done = group.items.filter(i => i.done).length;
            const total = group.items.length;
            return `
                <div class="card resource-group">
                    <div class="card-header">
                        <div class="card-title">
                            <span class="editable" onclick="editResourceGroupName(${gi})">${group.name}</span>
                            <span class="badge badge-count">${done}/${total}</span>
                        </div>
                        <div style="display:flex;gap:0.3rem">
                            <button class="task-btn delete" onclick="deleteResourceGroup(${gi})">🗑</button>
                        </div>
                    </div>
                    ${group.items.map((item, ii) => `
                        <div class="resource-item">
                            <input type="checkbox" ${item.done ? 'checked' : ''} onchange="toggleResourceItem(${gi},${ii})">
                            <span class="${item.done ? 'done-text' : ''}">
                                ${item.url ? `<a href="${item.url}" target="_blank">${item.text}</a>` : item.text}
                            </span>
                            <div class="task-actions" style="opacity:1;margin-right:auto">
                                <button class="task-btn" onclick="editResourceItem(${gi},${ii})">✏️</button>
                                <button class="task-btn delete" onclick="deleteResourceItem(${gi},${ii})">✕</button>
                            </div>
                        </div>
                    `).join('')}
                    <div class="add-form" style="margin-top:0.5rem">
                        <input type="text" placeholder="مصدر جديد..." id="res-input-${gi}"
                               onkeydown="if(event.key==='Enter')addResourceItem(${gi})">
                        <input type="text" placeholder="رابط (اختياري)" id="res-url-${gi}" style="max-width:200px"
                               onkeydown="if(event.key==='Enter')addResourceItem(${gi})">
                        <button class="btn btn-primary btn-sm" onclick="addResourceItem(${gi})">+</button>
                    </div>
                </div>
            `;
        }).join('')}
        ${data.resources.length === 0 ? `
            <div class="empty-state">
                <div class="icon">📖</div>
                <p>لا توجد مصادر بعد</p>
                <button class="btn btn-primary" onclick="addResourceGroup()">إضافة مجموعة</button>
            </div>
        ` : ''}
    `;
}

function addResourceGroup() {
    const name = prompt('اسم المجموعة:');
    if (!name || !name.trim()) return;
    data.resources.push({ id: uid(), name: name.trim(), items: [] });
    save();
    render();
}

function editResourceGroupName(gi) {
    const newName = prompt('تعديل:', data.resources[gi].name);
    if (newName && newName.trim()) {
        data.resources[gi].name = newName.trim();
        save();
        render();
    }
}

function deleteResourceGroup(gi) {
    if (!confirm('حذف هذه المجموعة؟')) return;
    data.resources.splice(gi, 1);
    save();
    render();
}

function addResourceItem(gi) {
    const input = document.getElementById('res-input-' + gi);
    const urlInput = document.getElementById('res-url-' + gi);
    if (!input || !input.value.trim()) return;

    data.resources[gi].items.push({
        id: uid(),
        text: input.value.trim(),
        url: urlInput?.value.trim() || '',
        done: false
    });

    input.value = '';
    if (urlInput) urlInput.value = '';
    save();
    render();
}

function toggleResourceItem(gi, ii) {
    data.resources[gi].items[ii].done = !data.resources[gi].items[ii].done;
    save();
}

function editResourceItem(gi, ii) {
    const item = data.resources[gi].items[ii];
    const newText = prompt('تعديل:', item.text);
    if (newText && newText.trim()) {
        item.text = newText.trim();
        const newUrl = prompt('الرابط:', item.url);
        if (newUrl !== null) item.url = newUrl.trim();
        save();
        render();
    }
}

function deleteResourceItem(gi, ii) {
    data.resources[gi].items.splice(ii, 1);
    save();
    render();
}

// =============================================================
//  JOURNAL
// =============================================================
function renderJournal(c) {
    c.innerHTML = `
        <div class="section-header">
            <h2>📝 اليوميات</h2>
        </div>
        <div class="card">
            <textarea class="journal-textarea" id="journal-text" placeholder="اكتب ملاحظاتك لليوم...">${data.journal || ''}</textarea>
            <div style="display:flex;gap:0.5rem;margin-top:0.75rem">
                <button class="btn btn-primary" onclick="saveJournal()">💾 حفظ</button>
                <button class="btn btn-ghost" onclick="saveJournalEntry()">📌 حفظ كإدخال يومي</button>
            </div>
        </div>

        <h3 style="margin:1.5rem 0 0.75rem;font-size:1rem">📅 الإدخالات السابقة</h3>
        ${(data.journalEntries || []).slice().reverse().map((entry, i) => `
            <div class="journal-entry">
                <div class="journal-date">
                    ${new Date(entry.date).toLocaleDateString('ar-EG', {weekday:'long', year:'numeric', month:'long', day:'numeric'})}
                    <button class="task-btn delete" style="float:left" onclick="deleteJournalEntry(${data.journalEntries.length - 1 - i})">✕</button>
                </div>
                <div style="font-size:0.88rem;white-space:pre-wrap">${entry.text}</div>
            </div>
        `).join('')}
        ${(!data.journalEntries || data.journalEntries.length === 0) ? `
            <div class="empty-state" style="padding:1.5rem">
                <p style="font-size:0.85rem">لا توجد إدخالات سابقة</p>
            </div>
        ` : ''}
    `;
}

function saveJournal() {
    const textarea = document.getElementById('journal-text');
    if (textarea) {
        data.journal = textarea.value;
        save();
        toast('تم الحفظ ✅', 'success');
    }
}

function saveJournalEntry() {
    const textarea = document.getElementById('journal-text');
    if (!textarea || !textarea.value.trim()) return;

    if (!data.journalEntries) data.journalEntries = [];
    data.journalEntries.push({
        date: new Date().toISOString(),
        text: textarea.value.trim()
    });

    textarea.value = '';
    data.journal = '';
    save();
    render();
    toast('تم حفظ الإدخال 📌', 'success');
}

function deleteJournalEntry(index) {
    if (!confirm('حذف هذا الإدخال؟')) return;
    data.journalEntries.splice(index, 1);
    save();
    render();
}

// =============================================================
//  SEARCH
// =============================================================
function handleSearch(query) {
    if (!query || !query.trim()) {
        render();
        return;
    }

    const q = query.toLowerCase().trim();
    const results = [];

    data.plans.forEach(plan => {
        plan.groups.forEach(group => {
            group.tasks.forEach(task => {
                if (task.name.toLowerCase().includes(q)) {
                    results.push({
                        type: '📚',
                        name: task.name,
                        location: `${plan.name} > ${group.name}`,
                        action: () => navigateToPlan(plan.id)
                    });
                }
                (task.subs || []).forEach(sub => {
                    if (sub.name.toLowerCase().includes(q)) {
                        results.push({
                            type: '📝',
                            name: sub.name,
                            location: task.name,
                            action: () => navigateToPlan(plan.id)
                        });
                    }
                });
            });
        });
    });

    data.projects.forEach(proj => {
        proj.phases.forEach(ph => {
            if (ph.name.toLowerCase().includes(q)) {
                results.push({
                    type: '🛠️',
                    name: ph.name,
                    location: proj.name,
                    action: () => navigateToProject(proj.id)
                });
            }
        });
    });

    const c = document.getElementById('content');
    c.innerHTML = `
        <div class="section-header">
            <h2>🔍 نتائج البحث: "${query}" (${results.length})</h2>
            <button class="btn btn-ghost" onclick="document.getElementById('search-input').value='';render()">إلغاء</button>
        </div>
        ${results.length === 0 ? '<div class="empty-state"><div class="icon">🔍</div><p>لا توجد نتائج</p></div>' : ''}
        ${results.map(r => `
            <div class="task" onclick="(${r.action.toString()})()" style="cursor:pointer">
                <span>${r.type}</span>
                <span class="task-name">${r.name}</span>
                <span class="badge badge-date">${r.location}</span>
            </div>
        `).join('')}
    `;
}

// =============================================================
//  MODAL
// =============================================================
function openModal(title, bodyHtml) {
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-body').innerHTML = bodyHtml;
    document.getElementById('modal-backdrop').classList.add('open');
}

function closeModal() {
    document.getElementById('modal-backdrop').classList.remove('open');
}

// =============================================================
//  TOAST
// =============================================================
function toast(msg, type = 'info') {
    const container = document.getElementById('toast-container');
    const el = document.createElement('div');
    el.className = `toast toast-${type}`;
    el.textContent = msg;
    container.appendChild(el);
    setTimeout(() => el.remove(), 3200);
}

// =============================================================
//  EXPORT / IMPORT
// =============================================================
function exportData() {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `journey-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast('تم التصدير ✅', 'success');
}

function importData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = e => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = evt => {
            try {
                const imported = JSON.parse(evt.target.result);
                if (!imported.plans) throw new Error('Invalid');
                if (confirm('استبدال جميع البيانات الحالية؟')) {
                    data = imported;
                    save();
                    render();
                    toast('تم الاستيراد ✅', 'success');
                }
            } catch {
                toast('ملف غير صالح ❌', 'error');
            }
        };
        reader.readAsText(file);
    };
    input.click();
}

// =============================================================
//  KEYBOARD SHORTCUTS
// =============================================================
document.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        save();
        toast('تم الحفظ 💾', 'success');
    }
    if (e.key === 'Escape') closeModal();
});

// =============================================================
//  INIT
// =============================================================

async function initApp() {
    // تحميل البيانات
    await load();
    applyTheme();
    updateStreak();

    // تحقق من الإعداد
    const config = SyncEngine.getConfig();

    if (!config) {
        // أول مرة: أظهر شاشة الإعداد
        document.getElementById('setup-screen').style.display = 'flex';
        document.getElementById('app').style.display = 'none';
    } else {
        // مُعد مسبقاً
        startApp();
    }

    // تحديث حالة المزامنة
    if (SyncEngine.isConfigured()) {
        SyncEngine.updateSyncStatus('synced');
    } else {
        SyncEngine.updateSyncStatus('local');
    }

    // حفظ تلقائي كل 30 ثانية
    setInterval(save, 30000);

    // مزامنة من GitHub كل 5 دقائق
    setInterval(async () => {
        if (SyncEngine.isConfigured()) {
            const remote = await SyncEngine.loadFromGitHub();
            if (remote && remote.lastActive > data.lastActive) {
                data = remote;
                localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
                render();
                toast('تم تحديث البيانات من جهاز آخر 🔄', 'info');
            }
        }
    }, 300000); // 5 دقائق
}

// Keyboard shortcuts
document.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        save();
        toast('تم الحفظ 💾', 'success');
    }
    if (e.key === 'Escape') closeModal();
});

// Start
initApp();
