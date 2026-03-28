// =============================================================
//  LEARNING JOURNEY APP v3.0
//  Main Application File - Part 1: Core + Dashboard
// =============================================================

const STORAGE_KEY = 'journey_app_v3';

// =============================================================
//  DEFAULT DATA
// =============================================================
const DEFAULT = {
    plans: [
        {
            id: 'plan_ds',
            name: 'علم البيانات - من مبتدئ إلى متوسط',
            icon: '📊',
            groups: [
                {
                    id: 'g1', name: 'الشهر 1: تقوية الأساسيات', collapsed: false,
                    tasks: [
                        { id: 't1', name: 'Python المتقدم - OOP', status: 'pending', date: '', subs: [], notes: '', tags: [] },
                        { id: 't2', name: 'Decorators & Generators', status: 'pending', date: '', subs: [], notes: '', tags: [] },
                        { id: 't3', name: 'File I/O - PyMuPDF, pandas, openpyxl', status: 'pending', date: '', subs: [], notes: '', tags: [] },
                        { id: 't4', name: 'SQL المتقدم - Window Functions', status: 'pending', date: '', subs: [], notes: '', tags: [] },
                        { id: 't5', name: 'Statistics - Probability & Hypothesis Testing', status: 'pending', date: '', subs: [], notes: '', tags: [] },
                    ]
                },
                {
                    id: 'g2', name: 'الشهر 2: Machine Learning', collapsed: true,
                    tasks: [
                        { id: 't6', name: 'Scikit-learn أساسيات', status: 'pending', date: '', subs: [], notes: '', tags: [] },
                        { id: 't7', name: 'Linear & Logistic Regression', status: 'pending', date: '', subs: [], notes: '', tags: [] },
                        { id: 't8', name: 'Decision Trees & Random Forest', status: 'pending', date: '', subs: [], notes: '', tags: [] },
                        { id: 't9', name: 'Cross Validation & Tuning', status: 'pending', date: '', subs: [], notes: '', tags: [] },
                        { id: 't10', name: 'Feature Engineering', status: 'pending', date: '', subs: [], notes: '', tags: [] },
                    ]
                },
                {
                    id: 'g3', name: 'الشهر 3: Git + Docker + مشروع', collapsed: true,
                    tasks: [
                        { id: 't11', name: 'Git & GitHub', status: 'pending', date: '', subs: [], notes: '', tags: [] },
                        { id: 't12', name: 'Docker & Docker Compose', status: 'pending', date: '', subs: [], notes: '', tags: [] },
                        { id: 't13', name: 'Flask API', status: 'pending', date: '', subs: [], notes: '', tags: [] },
                        { id: 't14', name: '🎯 مشروع ML + API + Docker', status: 'pending', date: '', subs: [], notes: '', tags: [] },
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
                        { id: 't15', name: 'PyTorch أساسيات', status: 'pending', date: '', subs: [], notes: '', tags: [] },
                        { id: 't16', name: 'Neural Networks', status: 'pending', date: '', subs: [], notes: '', tags: [] },
                        { id: 't17', name: 'CNNs & Transfer Learning', status: 'pending', date: '', subs: [], notes: '', tags: [] },
                        { id: 't18', name: 'RNN & LSTM', status: 'pending', date: '', subs: [], notes: '', tags: [] },
                        { id: 't19', name: 'NLP & Transformers & Hugging Face', status: 'pending', date: '', subs: [], notes: '', tags: [] },
                    ]
                },
                {
                    id: 'g5', name: 'الشهر 5: مشروع Mini RAG 🎯', collapsed: true,
                    tasks: [
                        { id: 't20', name: 'RAG Architecture + Embeddings', status: 'pending', date: '', subs: [], notes: '', tags: [] },
                        { id: 't21', name: 'Vector DB (Chroma) + Chunking', status: 'pending', date: '', subs: [], notes: '', tags: [] },
                        { id: 't22', name: 'LangChain + Ollama', status: 'pending', date: '', subs: [], notes: '', tags: [] },
                        { id: 't23', name: 'OCR - Tesseract', status: 'pending', date: '', subs: [], notes: '', tags: [] },
                        { id: 't24', name: 'Streamlit + Docker', status: 'pending', date: '', subs: [], notes: '', tags: [] },
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
                        { id: 't25', name: 'PySpark DataFrames & SQL', status: 'pending', date: '', subs: [], notes: '', tags: [] },
                        { id: 't26', name: 'ETL + Airflow', status: 'pending', date: '', subs: [], notes: '', tags: [] },
                        { id: 't27', name: 'PostgreSQL', status: 'pending', date: '', subs: [], notes: '', tags: [] },
                    ]
                },
                {
                    id: 'g7', name: 'Kafka Streaming', collapsed: true,
                    tasks: [
                        { id: 't28', name: 'Kafka Architecture', status: 'pending', date: '', subs: [], notes: '', tags: [] },
                        { id: 't29', name: 'Spark Streaming + Kafka', status: 'pending', date: '', subs: [], notes: '', tags: [] },
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
                        { id: 't30', name: 'Research Methodology + LaTeX', status: 'pending', date: '', subs: [], notes: '', tags: [] },
                        { id: 't31', name: 'قراءة: Survey on Concept Drift', status: 'pending', date: '', subs: [], notes: '', tags: [] },
                        { id: 't32', name: 'River Library - ADWIN, DDM', status: 'pending', date: '', subs: [], notes: '', tags: [] },
                    ]
                },
                {
                    id: 'g9', name: 'التعمق + المشروع', collapsed: true,
                    tasks: [
                        { id: 't33', name: 'قراءة الأوراق البحثية الأساسية', status: 'pending', date: '', subs: [], notes: '', tags: [] },
                        { id: 't34', name: 'Online Learning Algorithms', status: 'pending', date: '', subs: [], notes: '', tags: [] },
                        { id: 't35', name: '🎯 مشروع Data Drift System', status: 'pending', date: '', subs: [], notes: '', tags: [] },
                    ]
                },
                {
                    id: 'g10', name: 'البحث والكتابة', collapsed: true,
                    tasks: [
                        { id: 't36', name: 'Literature Review', status: 'pending', date: '', subs: [], notes: '', tags: [] },
                        { id: 't37', name: 'Research Proposal', status: 'pending', date: '', subs: [], notes: '', tags: [] },
                        { id: 't38', name: 'تقديم رسمي للماستر', status: 'pending', date: '', subs: [], notes: '', tags: [] },
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
    theme: 'dark',
    achievements: [],
    pomodoroLog: {},
    weeklyGoals: null,
    tags: ['سهل', 'متوسط', 'صعب', 'مهم', 'مراجعة'],
    _nightActivity: false,
    _earlyActivity: false
};

let data;
let currentView = 'dashboard';
let calOffset = 0;

// =============================================================
//  UNIQUE ID GENERATOR
// =============================================================
function uid() {
    return '_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

// =============================================================
//  PERSISTENCE - HYBRID (LOCAL + GITHUB)
// =============================================================
async function load() {
    // 1. حمّل من localStorage
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        data = raw ? JSON.parse(raw) : null;
    } catch { data = null; }

    // 2. حاول التحميل من GitHub
    if (SyncEngine.isConfigured() && navigator.onLine) {
        try {
            const remoteData = await SyncEngine.loadFromGitHub();
            if (remoteData) {
                const localDate = data?.lastActive || '';
                const remoteDate = remoteData?.lastActive || '';

                if (!data || !data.plans) {
                    data = remoteData;
                } else if (remoteDate > localDate) {
                    data = remoteData;
                } else if (remoteDate < localDate) {
                    // المحلي أحدث - ارفعه
                    SyncEngine.debouncedSave(data);
                } else if (remoteDate === localDate && remoteData.lastSync !== data.lastSync) {
                    // نفس التاريخ لكن sync مختلف - ادمج
                    data = SyncEngine.mergeData(data, remoteData);
                }

                localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
            }
        } catch (e) {
            console.warn('GitHub load failed, using local:', e);
        }
    }

    // 3. إذا لا يوجد بيانات
    if (!data || !data.plans) {
        data = JSON.parse(JSON.stringify(DEFAULT));
    }

    // ضمان الحقول الجديدة
    ensureDataFields();
}

function ensureDataFields() {
    if (!data.journalEntries) data.journalEntries = [];
    if (!data.resources) data.resources = [];
    if (!data.achievements) data.achievements = [];
    if (!data.pomodoroLog) data.pomodoroLog = {};
    if (!data.weeklyGoals) data.weeklyGoals = null;
    if (!data.tags) data.tags = ['سهل', 'متوسط', 'صعب', 'مهم', 'مراجعة'];
    if (data._nightActivity === undefined) data._nightActivity = false;
    if (data._earlyActivity === undefined) data._earlyActivity = false;

    // ضمان الحقول الجديدة لكل task
    data.plans.forEach(p => p.groups.forEach(g => g.tasks.forEach(t => {
        if (!t.notes) t.notes = '';
        if (!t.tags) t.tags = [];
        if (!t.subs) t.subs = [];
    })));
}

function save() {
    data.lastModified = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    SyncEngine.debouncedSave(data);

    // نسخ احتياطي يومي
    AutoBackup.run();
}

async function forceSyncNow() {
    if (!SyncEngine.isConfigured()) {
        toast('المزامنة غير مُعدة. اذهب للإعدادات.', 'error');
        return;
    }
    if (!navigator.onLine) {
        toast('لا يوجد اتصال بالإنترنت', 'error');
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

    const remoteData = await SyncEngine.loadFromGitHub();
    if (remoteData && remoteData.plans) {
        data = remoteData;
        ensureDataFields();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        toast('تم تحميل بياناتك من GitHub ✅', 'success');
    } else {
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
    const backups = AutoBackup.getBackups();

    openModal('⚙️ الإعدادات', `
        <div class="setup-form">
            <label>GitHub Username</label>
            <input type="text" id="settings-username" value="${config.username || ''}">

            <label>Repository Name</label>
            <input type="text" id="settings-repo" value="${config.repo || ''}">

            <label>GitHub Token</label>
            <input type="password" id="settings-token" value="${config.token || ''}" placeholder="ghp_xxxxxxxxxxxx">

            <div style="display:flex;gap:0.5rem;margin-top:1rem;flex-wrap:wrap">
                <button class="btn btn-primary" onclick="updateSettings()">حفظ</button>
                <button class="btn btn-ghost" onclick="closeModal()">إلغاء</button>
                <button class="btn btn-danger" onclick="resetAllData()" style="margin-right:auto">حذف كل البيانات</button>
            </div>

            <div style="margin-top:1.5rem;padding:0.75rem;background:var(--bg);border-radius:var(--radius-sm);font-size:0.8rem;color:var(--text-secondary)">
                <strong>حالة المزامنة:</strong>
                ${config.token ? '🟢 متصل' : '🔴 غير متصل (حفظ محلي فقط)'}
                <br>
                <strong>آخر نشاط:</strong> ${data.lastActive || 'لا يوجد'}
                <br>
                <strong>آخر مزامنة:</strong> ${data.lastSync || 'لم تتم'}
                <br>
                <strong>الجهاز:</strong> ${SyncEngine._getDeviceId ? SyncEngine._getDeviceId() : 'غير معروف'}
            </div>

            ${backups.length > 0 ? `
                <div style="margin-top:1.5rem">
                    <h4 style="font-size:0.88rem;margin-bottom:0.5rem">📦 النسخ الاحتياطية (${backups.length})</h4>
                    ${backups.map(b => `
                        <div style="display:flex;justify-content:space-between;align-items:center;padding:0.4rem 0;border-bottom:1px solid var(--border-light);font-size:0.8rem">
                            <span>📅 ${new Date(b.date).toLocaleDateString('ar-EG', {year:'numeric',month:'long',day:'numeric'})}</span>
                            <button class="btn btn-ghost btn-sm" onclick="restoreBackup('${b.key}')">استعادة</button>
                        </div>
                    `).join('')}
                </div>
            ` : ''}
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

function restoreBackup(backupKey) {
    if (!confirm('استعادة هذه النسخة الاحتياطية؟ ستُستبدل البيانات الحالية.')) return;
    const restored = AutoBackup.restore(backupKey);
    if (restored) {
        data = restored;
        ensureDataFields();
        save();
        closeModal();
        render();
        toast('تم استعادة النسخة الاحتياطية ✅', 'success');
    } else {
        toast('فشل استعادة النسخة ❌', 'error');
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
    const btn = document.getElementById('theme-toggle-btn');
    if (btn) btn.textContent = data.theme === 'dark' ? '☀️' : '🌙';
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

    // تتبع أوقات النشاط
    const hour = new Date().getHours();
    if (hour >= 0 && hour < 5) data._nightActivity = true;
    if (hour >= 4 && hour < 6) data._earlyActivity = true;

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
//  STATS CALCULATION
// =============================================================
function getStats() {
    let totalTasks = 0, doneTasks = 0, totalSubs = 0, doneSubs = 0;
    let postponedTasks = 0;
    data.plans.forEach(p => p.groups.forEach(g => g.tasks.forEach(t => {
        totalTasks++;
        if (t.status === 'done') doneTasks++;
        if (t.status === 'postponed') postponedTasks++;
        (t.subs || []).forEach(s => {
            totalSubs++;
            if (s.status === 'done') doneSubs++;
        });
    })));

    let totalPhases = 0, donePhases = 0, activePhases = 0;
    data.projects.forEach(p => p.phases.forEach(ph => {
        totalPhases++;
        if (ph.status === 'done') donePhases++;
        if (ph.status === 'active') activePhases++;
    }));

    let totalResources = 0, doneResources = 0;
    data.resources.forEach(g => g.items.forEach(i => {
        totalResources++;
        if (i.done) doneResources++;
    }));

    // إجمالي وقت البومودورو
    let totalPomodoroMins = 0;
    Object.values(data.pomodoroLog || {}).forEach(v => totalPomodoroMins += v);

    return {
        totalTasks, doneTasks, postponedTasks,
        totalSubs, doneSubs,
        totalPhases, donePhases, activePhases,
        totalResources, doneResources,
        totalPomodoroMins,
        journalCount: (data.journalEntries || []).length,
        achievementsCount: (data.achievements || []).length
    };
}

// =============================================================
//  BUILD SIDEBAR NAV
// =============================================================
function buildSidebarNav() {
    const plansNav = document.getElementById('plans-nav');
    plansNav.innerHTML = data.plans.map(p => {
        let total = 0, done = 0;
        p.groups.forEach(g => g.tasks.forEach(t => { total++; if (t.status === 'done') done++; }));
        const pct = total ? Math.round(done / total * 100) : 0;
        return `
            <button class="nav-item ${currentView === 'plan:' + p.id ? 'active' : ''}"
                    data-plan="${p.id}" onclick="navigateToPlan('${p.id}')">
                <span class="nav-icon">${p.icon || '📚'}</span>
                <span style="flex:1;text-align:right">${p.name}</span>
                <span style="font-size:0.65rem;opacity:0.6;min-width:28px">${pct}%</span>
            </button>
        `;
    }).join('');

    const projNav = document.getElementById('projects-nav');
    projNav.innerHTML = data.projects.map(p => {
        const total = p.phases.length;
        const done = p.phases.filter(ph => ph.status === 'done').length;
        const pct = total ? Math.round(done / total * 100) : 0;
        return `
            <button class="nav-item ${currentView === 'project:' + p.id ? 'active' : ''}"
                    data-project="${p.id}" onclick="navigateToProject('${p.id}')">
                <span class="nav-icon">${p.icon || '🛠️'}</span>
                <span style="flex:1;text-align:right">${p.name}</span>
                <span style="font-size:0.65rem;opacity:0.6;min-width:28px">${pct}%</span>
            </button>
        `;
    }).join('');
}

// =============================================================
//  RENDER ROUTER
// =============================================================
function render() {
    buildSidebarNav();
    updateTopbar();

    const c = document.getElementById('content');

    // إزالة skeleton
    const skeleton = document.getElementById('loading-skeleton');
    if (skeleton) skeleton.remove();

    switch (true) {
        case currentView === 'dashboard': renderDashboard(c); break;
        case currentView === 'calendar': renderCalendar(c); break;
        case currentView === 'resources': renderResources(c); break;
        case currentView === 'journal': renderJournal(c); break;
        case currentView === 'pomodoro': renderPomodoroPage(c); break;
        case currentView === 'achievements': renderAchievementsPage(c); break;
        case currentView === 'stats': renderStatsPage(c); break;
        case currentView.startsWith('plan:'): renderPlan(c, currentView.split(':')[1]); break;
        case currentView.startsWith('project:'): renderProject(c, currentView.split(':')[1]); break;
        default: renderDashboard(c);
    }
}

function updateTopbar() {
    document.getElementById('current-date').textContent =
        new Date().toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    const streakBadge = document.getElementById('streak-badge');
    const streakEmoji = data.streak >= 30 ? '💎' : data.streak >= 7 ? '🔥' : '🌱';
    streakBadge.textContent = `${streakEmoji} ${data.streak} يوم`;
}

// =============================================================
//  POMODORO TIMER
// =============================================================
const Pomodoro = {
    running: false,
    timeLeft: 25 * 60,
    mode: 'work',
    sessions: 0,
    interval: null,
    currentTask: null,

    config: {
        work: 25 * 60,
        break: 5 * 60,
        longBreak: 15 * 60,
        longBreakEvery: 4
    },

    start(taskName = null) {
        if (this.running) return;
        this.running = true;
        this.currentTask = taskName;
        this.interval = setInterval(() => this.tick(), 1000);
        this.updateUI();
    },

    pause() {
        this.running = false;
        clearInterval(this.interval);
        this.updateUI();
    },

    reset() {
        this.pause();
        this.mode = 'work';
        this.timeLeft = this.config.work;
        this.updateUI();
    },

    tick() {
        this.timeLeft--;
        if (this.timeLeft <= 0) {
            this.onComplete();
        }
        this.updateUI();
    },

    onComplete() {
        this.pause();
        this.playNotification();

        if (this.mode === 'work') {
            this.sessions++;
            this.logSession();

            if (this.sessions % this.config.longBreakEvery === 0) {
                this.mode = 'longBreak';
                this.timeLeft = this.config.longBreak;
                toast('🌴 استراحة طويلة! أحسنت عمل ' + this.sessions + ' جلسات!', 'success');
            } else {
                this.mode = 'break';
                this.timeLeft = this.config.break;
                toast('☕ استراحة قصيرة - جلسة #' + this.sessions + ' مكتملة!', 'success');
            }
        } else {
            this.mode = 'work';
            this.timeLeft = this.config.work;
            toast('💪 هيا نعود للعمل!', 'info');
        }
        this.updateUI();
    },

    logSession() {
        if (!data.pomodoroLog) data.pomodoroLog = {};
        const today = new Date().toISOString().split('T')[0];
        if (!data.pomodoroLog[today]) data.pomodoroLog[today] = 0;
        data.pomodoroLog[today] += this.config.work / 60;
        updateStreak();
        Achievements.checkAndNotify();
        save();
    },

    playNotification() {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.frequency.value = 800;
            gain.gain.value = 0.3;
            osc.start();
            setTimeout(() => { osc.frequency.value = 1000; }, 150);
            setTimeout(() => { osc.frequency.value = 800; }, 300);
            setTimeout(() => osc.stop(), 500);
        } catch (e) { console.warn('Audio failed:', e); }

        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(this.mode === 'work' ? '☕ وقت الراحة!' : '💪 وقت العمل!', {
                body: this.mode === 'work'
                    ? `أكملت ${this.sessions} جلسات اليوم`
                    : 'الراحة انتهت، هيا نكمل!',
            });
        }
    },

    formatTime() {
        const mins = Math.floor(this.timeLeft / 60);
        const secs = this.timeLeft % 60;
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    },

    getModeLabel() {
        return this.mode === 'work' ? '🍅 تركيز'
            : this.mode === 'break' ? '☕ استراحة'
            : '🌴 استراحة طويلة';
    },

    getModeColor() {
        return this.mode === 'work' ? 'var(--danger)'
            : this.mode === 'break' ? 'var(--success)'
            : 'var(--primary)';
    },

    getTodayMinutes() {
        const today = new Date().toISOString().split('T')[0];
        return (data.pomodoroLog || {})[today] || 0;
    },

    updateUI() {
        const el = document.getElementById('pomodoro-widget');
        if (!el) return;

        const timeEl = el.querySelector('.pomo-time');
        const modeEl = el.querySelector('.pomo-mode');
        const sessionsEl = el.querySelector('.pomo-sessions');

        if (timeEl) timeEl.textContent = this.formatTime();
        if (modeEl) modeEl.textContent = this.getModeLabel();
        if (sessionsEl) sessionsEl.textContent = `جلسات اليوم: ${this.sessions} | ⏱️ ${Math.round(this.getTodayMinutes())} دقيقة`;

        const startBtn = el.querySelector('.pomo-start');
        const pauseBtn = el.querySelector('.pomo-pause');
        if (startBtn) startBtn.style.display = this.running ? 'none' : 'inline-flex';
        if (pauseBtn) pauseBtn.style.display = this.running ? 'inline-flex' : 'none';

        // Progress ring
        const total = this.config[this.mode] || this.config.work;
        const pct = ((total - this.timeLeft) / total) * 100;
        const ring = el.querySelector('.pomo-ring-fill');
        if (ring) {
            const circumference = 2 * Math.PI * 54;
            ring.style.strokeDashoffset = circumference - (pct / 100) * circumference;
            ring.setAttribute('stroke', this.getModeColor());
        }

        // عنوان الصفحة
        document.title = this.running
            ? `${this.formatTime()} - ${this.getModeLabel()}`
            : '🎯 رحلة التعلم';
    },

    renderWidget() {
        const circumference = 2 * Math.PI * 54;
        return `
            <div id="pomodoro-widget" class="pomodoro-widget card">
                <div class="pomo-header">
                    <span class="pomo-mode">${this.getModeLabel()}</span>
                    <span class="pomo-sessions">جلسات اليوم: ${this.sessions} | ⏱️ ${Math.round(this.getTodayMinutes())} دقيقة</span>
                </div>
                <div class="pomo-circle">
                    <svg width="130" height="130" viewBox="0 0 120 120">
                        <circle cx="60" cy="60" r="54" fill="none" stroke="var(--border)" stroke-width="6"/>
                        <circle class="pomo-ring-fill" cx="60" cy="60" r="54" fill="none"
                                stroke="${this.getModeColor()}"
                                stroke-width="6" stroke-linecap="round"
                                stroke-dasharray="${circumference}"
                                stroke-dashoffset="${circumference}"
                                transform="rotate(-90 60 60)"
                                style="transition: stroke-dashoffset 1s linear"/>
                    </svg>
                    <div class="pomo-time">${this.formatTime()}</div>
                </div>
                <div class="pomo-controls">
                    <button class="btn btn-primary btn-sm pomo-start" onclick="Pomodoro.start()"
                            style="${this.running ? 'display:none' : ''}">▶ بدء</button>
                    <button class="btn btn-danger btn-sm pomo-pause" onclick="Pomodoro.pause()"
                            style="${!this.running ? 'display:none' : ''}">⏸ إيقاف</button>
                    <button class="btn btn-ghost btn-sm" onclick="Pomodoro.reset()">↺ إعادة</button>
                </div>
            </div>
        `;
    }
};

// =============================================================
//  ACHIEVEMENTS SYSTEM
// =============================================================
const Achievements = {
    list: [
        { id: 'first_step', name: 'الخطوة الأولى', desc: 'أكمل أول مهمة', icon: '🌟',
            check: () => { let d = 0; data.plans.forEach(p => p.groups.forEach(g => g.tasks.forEach(t => { if (t.status === 'done') d++; }))); return d >= 1; }},

        { id: 'five_tasks', name: 'بداية موفقة', desc: 'أكمل 5 مهام', icon: '⭐',
            check: () => { let d = 0; data.plans.forEach(p => p.groups.forEach(g => g.tasks.forEach(t => { if (t.status === 'done') d++; }))); return d >= 5; }},

        { id: 'ten_tasks', name: 'متعلم جاد', desc: 'أكمل 10 مهام', icon: '📚',
            check: () => { let d = 0; data.plans.forEach(p => p.groups.forEach(g => g.tasks.forEach(t => { if (t.status === 'done') d++; }))); return d >= 10; }},

        { id: 'twenty_five', name: 'ربع الطريق', desc: 'أكمل 25 مهمة', icon: '🚀',
            check: () => { let d = 0; data.plans.forEach(p => p.groups.forEach(g => g.tasks.forEach(t => { if (t.status === 'done') d++; }))); return d >= 25; }},

        { id: 'three_streak', name: 'ثلاثة أيام', desc: '3 أيام متتالية', icon: '🌱',
            check: () => data.streak >= 3 },

        { id: 'week_streak', name: 'أسبوع ناري', desc: '7 أيام متتالية', icon: '🔥',
            check: () => data.streak >= 7 },

        { id: 'two_weeks', name: 'أسبوعان!', desc: '14 يوم متتالي', icon: '⚡',
            check: () => data.streak >= 14 },

        { id: 'month_streak', name: 'شهر من الإلتزام', desc: '30 يوم متتالي!', icon: '💎',
            check: () => data.streak >= 30 },

        { id: 'group_complete', name: 'مجموعة كاملة', desc: 'أكمل مجموعة بالكامل', icon: '🎯',
            check: () => data.plans.some(p => p.groups.some(g => g.tasks.length > 0 && g.tasks.every(t => t.status === 'done'))) },

        { id: 'plan_complete', name: 'خطة منجزة', desc: 'أكمل خطة كاملة!', icon: '🏆',
            check: () => data.plans.some(p => {
                let total = 0, done = 0;
                p.groups.forEach(g => g.tasks.forEach(t => { total++; if (t.status === 'done') done++; }));
                return total > 0 && total === done;
            })},

        { id: 'first_project', name: 'بنّاء', desc: 'أكمل مشروع كامل', icon: '🏗️',
            check: () => data.projects.some(p => p.phases.length > 0 && p.phases.every(ph => ph.status === 'done')) },

        { id: 'journal_5', name: 'كاتب مبتدئ', desc: '5 يوميات', icon: '📝',
            check: () => (data.journalEntries || []).length >= 5 },

        { id: 'journal_25', name: 'كاتب نشط', desc: '25 يومية', icon: '✍️',
            check: () => (data.journalEntries || []).length >= 25 },

        { id: 'journal_50', name: 'مدوّن محترف', desc: '50 يومية!', icon: '📖',
            check: () => (data.journalEntries || []).length >= 50 },

        { id: 'pomodoro_5', name: 'أول 5 جلسات', desc: '5 جلسات بومودورو', icon: '🍅',
            check: () => {
                let total = 0;
                Object.values(data.pomodoroLog || {}).forEach(v => total += v);
                return total >= 125; // 5 × 25 min
            }},

        { id: 'pomodoro_25', name: 'منتج', desc: '25 جلسة بومودورو', icon: '🔥',
            check: () => {
                let total = 0;
                Object.values(data.pomodoroLog || {}).forEach(v => total += v);
                return total >= 625; // 25 × 25 min
            }},

        { id: 'pomodoro_100', name: 'ماكينة إنتاج', desc: '100 جلسة!', icon: '💪',
            check: () => {
                let total = 0;
                Object.values(data.pomodoroLog || {}).forEach(v => total += v);
                return total >= 2500;
            }},

        { id: 'night_owl', name: 'بومة الليل', desc: 'تعلم بعد منتصف الليل', icon: '🦉',
            check: () => data._nightActivity === true },

        { id: 'early_bird', name: 'عصفور الصباح', desc: 'تعلم قبل 6 صباحاً', icon: '🐦',
            check: () => data._earlyActivity === true },

        { id: 'resource_10', name: 'باحث', desc: 'أكمل 10 مصادر', icon: '🔬',
            check: () => {
                let d = 0;
                data.resources.forEach(g => g.items.forEach(i => { if (i.done) d++; }));
                return d >= 10;
            }},

        { id: 'sub_master', name: 'متقن التفاصيل', desc: 'أكمل 50 درس فرعي', icon: '🎓',
            check: () => {
                let d = 0;
                data.plans.forEach(p => p.groups.forEach(g => g.tasks.forEach(t => {
                    (t.subs || []).forEach(s => { if (s.status === 'done') d++; });
                })));
                return d >= 50;
            }},
    ],

    checkAndNotify() {
        if (!data.achievements) data.achievements = [];

        let newUnlocks = [];
        this.list.forEach(a => {
            if (!data.achievements.includes(a.id)) {
                try {
                    if (a.check()) {
                        data.achievements.push(a.id);
                        newUnlocks.push(a);
                    }
                } catch (e) { /* ignore */ }
            }
        });

        newUnlocks.forEach(a => {
            toast(`🏆 إنجاز جديد: ${a.icon} ${a.name} — ${a.desc}`, 'success');
        });

        if (newUnlocks.length > 0) save();
        return newUnlocks;
    },

    render() {
        const unlocked = data.achievements || [];
        return `
            <div class="achievements-grid">
                ${this.list.map(a => {
                    const isUnlocked = unlocked.includes(a.id);
                    return `
                        <div class="achievement-card ${isUnlocked ? 'unlocked' : 'locked'}" title="${a.desc}">
                            <div class="achievement-icon">${a.icon}</div>
                            <div class="achievement-name">${a.name}</div>
                            <div class="achievement-desc">${a.desc}</div>
                            ${isUnlocked ? '<div class="achievement-badge">✅</div>' : ''}
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }
};

// =============================================================
//  TIME CHART
// =============================================================
function renderTimeChart() {
    const pomodoroLog = data.pomodoroLog || {};
    const days = [];

    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const key = d.toISOString().split('T')[0];
        days.push({
            key,
            label: d.toLocaleDateString('ar-SA', { weekday: 'short' }),
            minutes: pomodoroLog[key] || 0
        });
    }

    const maxMins = Math.max(...days.map(d => d.minutes), 30);
    const totalWeek = Math.round(days.reduce((s, d) => s + d.minutes, 0));

    return `
        <div class="time-chart card">
            <div class="card-title">⏱️ وقت التعلم - آخر 7 أيام</div>
            <div class="chart-container">
                ${days.map(day => {
                    const height = maxMins > 0 ? Math.max(3, (day.minutes / maxMins) * 100) : 3;
                    const isToday = day.key === new Date().toISOString().split('T')[0];
                    return `
                        <div class="chart-col">
                            <div class="chart-value">${Math.round(day.minutes)}د</div>
                            <div class="chart-bar-wrap">
                                <div class="chart-bar ${isToday ? 'today' : ''}" style="height:${height}%"></div>
                            </div>
                            <div class="chart-label ${isToday ? 'today' : ''}">${day.label}</div>
                        </div>
                    `;
                }).join('')}
            </div>
            <div class="chart-summary">
                <span>📊 إجمالي: <strong>${totalWeek} دقيقة</strong></span>
                <span>📈 معدل يومي: <strong>${Math.round(totalWeek / 7)} دقيقة</strong></span>
            </div>
        </div>
    `;
}

// =============================================================
//  DASHBOARD
// =============================================================
function renderDashboard(c) {
    const s = getStats();
    const taskPct = s.totalTasks ? Math.round(s.doneTasks / s.totalTasks * 100) : 0;
    const projPct = s.totalPhases ? Math.round(s.donePhases / s.totalPhases * 100) : 0;
    const subPct = s.totalSubs ? Math.round(s.doneSubs / s.totalSubs * 100) : 0;

    // Check achievements silently
    Achievements.checkAndNotify();

    // المهام القادمة
    const upcoming = getUpcomingTasks(7);
    const overdue = getOverdueTasks();

    c.innerHTML = `
        <div class="section-header">
            <h2>📊 لوحة التحكم</h2>
            <div style="display:flex;gap:0.5rem">
                <button class="btn btn-ghost btn-sm" onclick="generateWeeklyReport()">📋 تقرير أسبوعي</button>
            </div>
        </div>

        <!-- Stats Cards -->
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
                <div class="stat-sub">من ${s.totalSubs} درس (${subPct}%)</div>
                <div class="progress-track"><div class="progress-fill fill-warning" style="width:${subPct}%"></div></div>
            </div>
            <div class="stat-card">
                <div class="stat-label">سلسلة الإنجاز</div>
                <div class="stat-value" style="color:var(--warning)">${data.streak}</div>
                <div class="stat-sub">يوم متواصل ${data.streak >= 30 ? '💎' : data.streak >= 7 ? '🔥' : '🌱'}</div>
            </div>
        </div>

        ${overdue.length > 0 ? `
            <div class="card" style="border-color:var(--danger);margin-bottom:1rem">
                <div class="card-title" style="color:var(--danger)">⏰ مهام متأخرة (${overdue.length})</div>
                ${overdue.slice(0, 5).map(t => `
                    <div class="task" onclick="navigateToPlan('${t.planId}')" style="cursor:pointer">
                        <span>⚠️</span>
                        <span class="task-name">${t.name}</span>
                        <span class="badge badge-overdue">${formatDate(t.date)}</span>
                    </div>
                `).join('')}
                ${overdue.length > 5 ? `<div style="text-align:center;font-size:0.8rem;color:var(--text-secondary);padding:0.5rem">+ ${overdue.length - 5} أخرى</div>` : ''}
            </div>
        ` : ''}

        <!-- Pomodoro + Time Chart -->
        <div class="two-col">
            ${Pomodoro.renderWidget()}
            ${renderTimeChart()}
        </div>

        <!-- Plans + Projects -->
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
                            <div style="display:flex;align-items:center;gap:0.4rem">
                                <div class="progress-track" style="width:50px;margin:0"><div class="progress-fill fill-primary" style="width:${pct}%"></div></div>
                                <span class="badge badge-count">${pct}%</span>
                            </div>
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
                            <div style="display:flex;align-items:center;gap:0.4rem">
                                <div class="progress-track" style="width:50px;margin:0"><div class="progress-fill fill-success" style="width:${pct}%"></div></div>
                                <span class="badge badge-count">${pct}%</span>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>

        ${upcoming.length > 0 ? `
            <div class="card">
                <div class="card-title">📅 قادم خلال 7 أيام (${upcoming.length})</div>
                ${upcoming.slice(0, 5).map(t => `
                    <div class="task" onclick="navigateToPlan('${t.planId}')" style="cursor:pointer">
                        <span>📌</span>
                        <span class="task-name">${t.name}</span>
                        <span class="badge badge-date">${formatDate(t.date)}</span>
                    </div>
                `).join('')}
            </div>
        ` : ''}

        <!-- Quick Achievements -->
        <div class="card">
            <div class="card-title" style="cursor:pointer" onclick="navigate('achievements')">
                🏆 الإنجازات (${(data.achievements || []).length}/${Achievements.list.length})
                <span style="font-size:0.75rem;color:var(--primary);margin-right:0.5rem">عرض الكل ←</span>
            </div>
            <div class="achievements-grid" style="grid-template-columns:repeat(auto-fill,minmax(100px,1fr))">
                ${Achievements.list.slice(0, 8).map(a => {
                    const isUnlocked = (data.achievements || []).includes(a.id);
                    return `
                        <div class="achievement-card ${isUnlocked ? 'unlocked' : 'locked'}" title="${a.desc}" style="padding:0.75rem 0.5rem">
                            <div class="achievement-icon" style="font-size:1.5rem">${a.icon}</div>
                            <div class="achievement-name" style="font-size:0.7rem">${a.name}</div>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `;
}

// =============================================================
//  HELPER: Get upcoming & overdue tasks
// =============================================================
function getUpcomingTasks(days = 7) {
    const today = new Date().toISOString().split('T')[0];
    const future = new Date();
    future.setDate(future.getDate() + days);
    const futureStr = future.toISOString().split('T')[0];

    const tasks = [];
    data.plans.forEach(plan => {
        plan.groups.forEach(group => {
            group.tasks.forEach(task => {
                if (task.date && task.status !== 'done' && task.date >= today && task.date <= futureStr) {
                    tasks.push({ ...task, planId: plan.id, planName: plan.name });
                }
            });
        });
    });

    return tasks.sort((a, b) => a.date.localeCompare(b.date));
}

function getOverdueTasks() {
    const today = new Date().toISOString().split('T')[0];
    const tasks = [];
    data.plans.forEach(plan => {
        plan.groups.forEach(group => {
            group.tasks.forEach(task => {
                if (task.date && task.status !== 'done' && task.date < today) {
                    tasks.push({ ...task, planId: plan.id, planName: plan.name });
                }
            });
        });
    });
    return tasks.sort((a, b) => a.date.localeCompare(b.date));
    }

// =============================================================
//  WEEKLY REPORT
// =============================================================
function generateWeeklyReport() {
    const s = getStats();
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - 7);
    const weekStartStr = weekStart.toISOString().split('T')[0];

    // مهام مكتملة هذا الأسبوع
    let weeklyCompleted = 0;
    data.plans.forEach(p => p.groups.forEach(g => g.tasks.forEach(t => {
        if (t.status === 'done') weeklyCompleted++;
    })));

    // وقت البومودورو هذا الأسبوع
    let weeklyMinutes = 0;
    Object.entries(data.pomodoroLog || {}).forEach(([date, mins]) => {
        if (date >= weekStartStr) weeklyMinutes += mins;
    });

    // يوميات هذا الأسبوع
    const weeklyJournals = (data.journalEntries || []).filter(e =>
        e.date >= weekStartStr
    ).length;

    openModal('📋 التقرير الأسبوعي', `
        <div style="text-align:center;padding:1rem 0">
            <h3 style="margin-bottom:1.5rem;color:var(--primary)">📊 ملخص الأسبوع</h3>

            <div class="stats-grid" style="grid-template-columns:repeat(2,1fr);gap:0.75rem">
                <div class="stat-card">
                    <div class="stat-label">التقدم العام</div>
                    <div class="stat-value" style="font-size:1.5rem;color:var(--primary)">${s.totalTasks ? Math.round(s.doneTasks/s.totalTasks*100) : 0}%</div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">سلسلة الإنجاز</div>
                    <div class="stat-value" style="font-size:1.5rem;color:var(--warning)">🔥 ${data.streak} يوم</div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">وقت التعلم</div>
                    <div class="stat-value" style="font-size:1.5rem;color:var(--success)">⏱️ ${Math.round(weeklyMinutes)} د</div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">اليوميات</div>
                    <div class="stat-value" style="font-size:1.5rem">📝 ${weeklyJournals}</div>
                </div>
            </div>

            <div style="margin-top:1.5rem;text-align:right">
                <h4 style="font-size:0.9rem;margin-bottom:0.5rem">📋 تقدم الخطط:</h4>
                ${data.plans.map(p => {
                    let total = 0, done = 0;
                    p.groups.forEach(g => g.tasks.forEach(t => { total++; if (t.status === 'done') done++; }));
                    const pct = total ? Math.round(done / total * 100) : 0;
                    return `
                        <div style="margin-bottom:0.5rem">
                            <div style="display:flex;justify-content:space-between;font-size:0.82rem;margin-bottom:0.2rem">
                                <span>${p.icon} ${p.name}</span>
                                <span>${pct}%</span>
                            </div>
                            <div class="progress-track" style="height:6px">
                                <div class="progress-fill fill-primary" style="width:${pct}%"></div>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>

            <div style="margin-top:1.5rem;display:flex;gap:0.5rem;justify-content:center">
                <button class="btn btn-primary btn-sm" onclick="copyReportToClipboard()">📋 نسخ التقرير</button>
                <button class="btn btn-ghost btn-sm" onclick="closeModal()">إغلاق</button>
            </div>
        </div>
    `);
}

function copyReportToClipboard() {
    const s = getStats();
    let report = `📊 تقرير رحلة التعلم - ${new Date().toLocaleDateString('ar-EG')}\n`;
    report += `━━━━━━━━━━━━━━━━━━\n`;
    report += `🔥 سلسلة الإنجاز: ${data.streak} يوم\n`;
    report += `📚 التقدم: ${s.doneTasks}/${s.totalTasks} مهمة\n`;
    report += `🛠️ المشاريع: ${s.donePhases}/${s.totalPhases} مرحلة\n`;
    report += `⏱️ وقت التعلم: ${Math.round(s.totalPomodoroMins)} دقيقة\n`;
    report += `🏆 الإنجازات: ${s.achievementsCount}/${Achievements.list.length}\n`;
    report += `━━━━━━━━━━━━━━━━━━\n`;

    data.plans.forEach(p => {
        let total = 0, done = 0;
        p.groups.forEach(g => g.tasks.forEach(t => { total++; if (t.status === 'done') done++; }));
        const pct = total ? Math.round(done / total * 100) : 0;
        report += `${p.icon} ${p.name}: ${pct}%\n`;
    });

    navigator.clipboard.writeText(report).then(() => {
        toast('تم نسخ التقرير ✅', 'success');
    }).catch(() => {
        toast('فشل النسخ', 'error');
    });
}

// =============================================================
//  POMODORO PAGE
// =============================================================
function renderPomodoroPage(c) {
    c.innerHTML = `
        <div class="section-header"><h2>🍅 مؤقت بومودورو</h2></div>
        <div class="two-col">
            ${Pomodoro.renderWidget()}
            ${renderTimeChart()}
        </div>
        <div class="card" style="margin-top:1rem">
            <div class="card-title">⚙️ إعدادات المؤقت</div>
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:1rem;margin-top:0.75rem">
                <div>
                    <label style="font-size:0.8rem;color:var(--text-secondary)">وقت العمل (دقيقة)</label>
                    <input type="number" value="${Pomodoro.config.work/60}" min="1" max="90"
                           class="input-field" style="margin-top:0.3rem"
                           onchange="Pomodoro.config.work=this.value*60;Pomodoro.reset()">
                </div>
                <div>
                    <label style="font-size:0.8rem;color:var(--text-secondary)">استراحة قصيرة</label>
                    <input type="number" value="${Pomodoro.config.break/60}" min="1" max="30"
                           class="input-field" style="margin-top:0.3rem"
                           onchange="Pomodoro.config.break=this.value*60">
                </div>
                <div>
                    <label style="font-size:0.8rem;color:var(--text-secondary)">استراحة طويلة</label>
                    <input type="number" value="${Pomodoro.config.longBreak/60}" min="1" max="60"
                           class="input-field" style="margin-top:0.3rem"
                           onchange="Pomodoro.config.longBreak=this.value*60">
                </div>
                <div>
                    <label style="font-size:0.8rem;color:var(--text-secondary)">طويلة كل X جلسات</label>
                    <input type="number" value="${Pomodoro.config.longBreakEvery}" min="2" max="10"
                           class="input-field" style="margin-top:0.3rem"
                           onchange="Pomodoro.config.longBreakEvery=parseInt(this.value)">
                </div>
            </div>
        </div>
        <div class="card" style="margin-top:1rem">
            <div class="card-title">📊 سجل الجلسات</div>
            ${renderPomodoroHistory()}
        </div>
    `;
}

function renderPomodoroHistory() {
    const log = data.pomodoroLog || {};
    const entries = Object.entries(log).sort((a, b) => b[0].localeCompare(a[0]));

    if (entries.length === 0) {
        return '<p style="color:var(--text-secondary);text-align:center;padding:1.5rem">لا توجد جلسات بعد. ابدأ أول جلسة! 🍅</p>';
    }

    return entries.slice(0, 21).map(([date, mins]) => {
        const sessions = Math.round(mins / 25);
        const barWidth = Math.min(100, (mins / 120) * 100);
        return `
            <div class="task" style="gap:0.5rem">
                <span style="font-size:0.82rem;min-width:90px">
                    ${new Date(date).toLocaleDateString('ar-EG', {month:'short', day:'numeric', weekday:'short'})}
                </span>
                <div class="progress-track" style="flex:1;margin:0;height:8px">
                    <div class="progress-fill fill-primary" style="width:${barWidth}%"></div>
                </div>
                <span class="badge badge-count" style="min-width:55px;text-align:center">${Math.round(mins)} د</span>
                <span class="badge badge-date" style="min-width:55px;text-align:center">${sessions} 🍅</span>
            </div>
        `;
    }).join('');
}

// =============================================================
//  ACHIEVEMENTS PAGE
// =============================================================
function renderAchievementsPage(c) {
    Achievements.checkAndNotify();
    const unlocked = (data.achievements || []).length;
    const total = Achievements.list.length;
    const pct = Math.round(unlocked / total * 100);

    c.innerHTML = `
        <div class="section-header"><h2>🏆 الإنجازات</h2></div>
        <div class="stat-card" style="margin-bottom:1.5rem">
            <div class="stat-label">التقدم في الإنجازات</div>
            <div class="stat-value" style="color:var(--warning)">${unlocked}/${total}</div>
            <div class="stat-sub">${pct}% مكتمل — ${total - unlocked} متبقي</div>
            <div class="progress-track" style="height:8px"><div class="progress-fill fill-warning" style="width:${pct}%"></div></div>
        </div>

        <h3 style="font-size:0.95rem;margin-bottom:0.75rem;color:var(--success)">✅ المفتوحة (${unlocked})</h3>
        <div class="achievements-grid" style="margin-bottom:1.5rem">
            ${Achievements.list.filter(a => (data.achievements || []).includes(a.id)).map(a => `
                <div class="achievement-card unlocked" title="${a.desc}">
                    <div class="achievement-icon">${a.icon}</div>
                    <div class="achievement-name">${a.name}</div>
                    <div class="achievement-desc">${a.desc}</div>
                    <div class="achievement-badge">✅</div>
                </div>
            `).join('') || '<p style="color:var(--text-secondary);font-size:0.85rem">لا إنجازات مفتوحة بعد. ابدأ التعلم!</p>'}
        </div>

        <h3 style="font-size:0.95rem;margin-bottom:0.75rem;color:var(--text-secondary)">🔒 المقفلة (${total - unlocked})</h3>
        <div class="achievements-grid">
            ${Achievements.list.filter(a => !(data.achievements || []).includes(a.id)).map(a => `
                <div class="achievement-card locked" title="${a.desc}">
                    <div class="achievement-icon">${a.icon}</div>
                    <div class="achievement-name">${a.name}</div>
                    <div class="achievement-desc">${a.desc}</div>
                </div>
            `).join('')}
        </div>
    `;
}

// =============================================================
//  STATS PAGE
// =============================================================
function renderStatsPage(c) {
    const s = getStats();
    const totalHours = Math.round(s.totalPomodoroMins / 60 * 10) / 10;
    const activeDays = Object.keys(data.pomodoroLog || {}).length;

    c.innerHTML = `
        <div class="section-header"><h2>📈 الإحصائيات التفصيلية</h2></div>

        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-label">إجمالي المهام المكتملة</div>
                <div class="stat-value" style="color:var(--primary)">${s.doneTasks}</div>
                <div class="stat-sub">من ${s.totalTasks} (${s.postponedTasks} مؤجل)</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">الدروس الفرعية</div>
                <div class="stat-value" style="color:var(--success)">${s.doneSubs}</div>
                <div class="stat-sub">من ${s.totalSubs}</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">ساعات التعلم</div>
                <div class="stat-value" style="color:var(--warning)">${totalHours}</div>
                <div class="stat-sub">ساعة (${activeDays} يوم نشط)</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">المصادر</div>
                <div class="stat-value">${s.doneResources}</div>
                <div class="stat-sub">من ${s.totalResources}</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">اليوميات</div>
                <div class="stat-value">${s.journalCount}</div>
                <div class="stat-sub">إدخال</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">الإنجازات</div>
                <div class="stat-value" style="color:var(--warning)">${s.achievementsCount}</div>
                <div class="stat-sub">من ${Achievements.list.length}</div>
            </div>
        </div>

        ${renderTimeChart()}

        <div class="card" style="margin-top:1rem">
            <div class="card-title">📋 تقدم كل خطة</div>
            ${data.plans.map(p => {
                let total = 0, done = 0, postponed = 0;
                p.groups.forEach(g => g.tasks.forEach(t => {
                    total++;
                    if (t.status === 'done') done++;
                    if (t.status === 'postponed') postponed++;
                }));
                const pct = total ? Math.round(done / total * 100) : 0;
                return `
                    <div style="margin-bottom:0.75rem;cursor:pointer" onclick="navigateToPlan('${p.id}')">
                        <div style="display:flex;justify-content:space-between;font-size:0.85rem;margin-bottom:0.3rem">
                            <span>${p.icon} ${p.name}</span>
                            <span>${pct}% (${done}/${total}${postponed > 0 ? ` | ${postponed} مؤجل` : ''})</span>
                        </div>
                        <div class="progress-track" style="height:8px">
                            <div class="progress-fill fill-primary" style="width:${pct}%"></div>
                        </div>
                    </div>
                `;
            }).join('')}
        </div>

        <div class="card" style="margin-top:1rem">
            <div class="card-title">🛠️ تقدم المشاريع</div>
            ${data.projects.map(p => {
                const total = p.phases.length;
                const done = p.phases.filter(ph => ph.status === 'done').length;
                const pct = total ? Math.round(done / total * 100) : 0;
                return `
                    <div style="margin-bottom:0.75rem;cursor:pointer" onclick="navigateToProject('${p.id}')">
                        <div style="display:flex;justify-content:space-between;font-size:0.85rem;margin-bottom:0.3rem">
                            <span>${p.icon} ${p.name}</span>
                            <span>${pct}% (${done}/${total})</span>
                        </div>
                        <div class="progress-track" style="height:8px">
                            <div class="progress-fill fill-success" style="width:${pct}%"></div>
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

// =============================================================
//  FORMAT DATE HELPER
// =============================================================
function formatDate(dateStr) {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('ar-EG', { month: 'short', day: 'numeric' });
}

// =============================================================
//  PLAN VIEW
// =============================================================
function renderPlan(c, planId) {
    const plan = data.plans.find(p => p.id === planId);
    if (!plan) { renderDashboard(c); return; }

    let totalT = 0, doneT = 0, postponedT = 0;
    plan.groups.forEach(g => g.tasks.forEach(t => {
        totalT++;
        if (t.status === 'done') doneT++;
        if (t.status === 'postponed') postponedT++;
    }));
    const pct = totalT ? Math.round(doneT / totalT * 100) : 0;

    c.innerHTML = `
        <div class="section-header">
            <h2>
                <span>${plan.icon || '📚'}</span>
                <span class="editable" onclick="editPlanName('${plan.id}')">${plan.name}</span>
                <span style="font-size:0.85rem;color:var(--text-secondary);font-weight:400;margin-right:0.5rem">${pct}%</span>
            </h2>
            <div style="display:flex;gap:0.5rem;flex-wrap:wrap">
                <button class="btn btn-primary btn-sm" onclick="addGroup('${plan.id}')">+ مجموعة</button>
                <button class="btn btn-ghost btn-sm" onclick="editPlanIcon('${plan.id}')">تغيير الأيقونة</button>
                <button class="btn btn-ghost btn-sm" onclick="expandAllGroups('${plan.id}')">فتح الكل</button>
                <button class="btn btn-ghost btn-sm" onclick="collapseAllGroups('${plan.id}')">إغلاق الكل</button>
                <button class="btn btn-ghost btn-sm" style="color:var(--danger)" onclick="deletePlan('${plan.id}')">حذف الخطة</button>
            </div>
        </div>

        <div style="display:flex;gap:1rem;align-items:center;margin-bottom:1.5rem;flex-wrap:wrap">
            <div class="progress-track" style="flex:1;height:8px;min-width:200px">
                <div class="progress-fill fill-primary" style="width:${pct}%"></div>
            </div>
            <span style="font-size:0.82rem;color:var(--text-secondary)">
                ✅ ${doneT} مكتمل | ⏸ ${postponedT} مؤجل | ⭕ ${totalT - doneT - postponedT} متبقي
            </span>
        </div>

        ${plan.groups.map(g => renderGroup(plan.id, g)).join('')}
    `;

    // Enable drag & drop
    enableDragDrop();
}

function renderGroup(planId, group) {
    const done = group.tasks.filter(t => t.status === 'done').length;
    const total = group.tasks.length;
    const isOpen = !group.collapsed;
    const pct = total ? Math.round(done / total * 100) : 0;

    return `
        <div class="card list-group" data-group-id="${group.id}">
            <div class="list-header" onclick="toggleGroup('${planId}','${group.id}')">
                <h3>
                    <span class="arrow ${isOpen ? 'open' : ''}">▶</span>
                    <span class="editable" onclick="event.stopPropagation();editGroupName('${planId}','${group.id}')">${group.name}</span>
                </h3>
                <div class="list-meta">
                    <span>${done}/${total}</span>
                    <div class="progress-track" style="width:60px;margin:0">
                        <div class="progress-fill ${pct === 100 ? 'fill-success' : 'fill-primary'}" style="width:${pct}%"></div>
                    </div>
                    ${pct === 100 ? '<span style="font-size:0.75rem">✅</span>' : ''}
                    <button class="task-btn" onclick="event.stopPropagation();moveGroupUp('${planId}','${group.id}')" title="أعلى">⬆</button>
                    <button class="task-btn" onclick="event.stopPropagation();moveGroupDown('${planId}','${group.id}')" title="أسفل">⬇</button>
                    <button class="task-btn delete" onclick="event.stopPropagation();deleteGroup('${planId}','${group.id}')" title="حذف">🗑</button>
                </div>
            </div>
            <div class="list-items ${isOpen ? 'open' : ''}">
                <div>
                    ${group.tasks.map(t => renderTask(planId, group.id, t)).join('')}
                    <div class="add-form">
                        <input type="text" placeholder="موضوع جديد..." id="input-${group.id}"
                               onkeydown="if(event.key==='Enter')addTask('${planId}','${group.id}')">
                        <button class="btn btn-primary btn-sm" onclick="addTask('${planId}','${group.id}')">إضافة</button>
                    </div>
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
    const hasTags = (task.tags || []).length > 0;
    const hasNotes = task.notes && task.notes.trim().length > 0;

    return `
        <div class="task"
             draggable="true"
             data-task-id="${task.id}"
             data-group-id="${groupId}"
             data-plan-id="${planId}">
            <div class="drag-handle" title="اسحب لإعادة الترتيب">⠿</div>
            <div class="task-check ${isDone ? 'done' : isPostponed ? 'postponed' : ''}"
                 onclick="cycleTaskStatus('${planId}','${groupId}','${task.id}')">
                ${isDone ? '✓' : isPostponed ? '⏸' : ''}
            </div>
            <span class="task-name ${isDone ? 'done' : ''}"
                  onclick="editTaskName('${planId}','${groupId}','${task.id}')">${task.name}</span>
            <div class="task-badges">
                ${hasTags ? task.tags.map(tag => `<span class="badge badge-tag">${tag}</span>`).join('') : ''}
                ${hasNotes ? '<span class="badge badge-date" title="يوجد ملاحظات">📄</span>' : ''}
                ${subsCount > 0 ? `<span class="badge badge-count">📝 ${subsDone}/${subsCount}</span>` : ''}
                ${task.date ? `<span class="badge ${isOverdue ? 'badge-overdue' : 'badge-date'}">${isOverdue ? '⏰' : '📅'} ${formatDate(task.date)}</span>` : ''}
            </div>
            <div class="task-actions">
                <button class="task-btn sub" onclick="openSubTasks('${planId}','${groupId}','${task.id}')" title="الدروس الفرعية">📝</button>
                <button class="task-btn" onclick="openTaskNotes('${planId}','${groupId}','${task.id}')" title="ملاحظات">📄</button>
                <button class="task-btn" onclick="openTaskTags('${planId}','${groupId}','${task.id}')" title="تصنيفات">🏷️</button>
                <button class="task-btn" onclick="setTaskDate('${planId}','${groupId}','${task.id}')" title="تاريخ">📅</button>
                <button class="task-btn" onclick="startPomodoroForTask('${planId}','${groupId}','${task.id}')" title="بومودورو">🍅</button>
                <button class="task-btn postpone" onclick="postponeTask('${planId}','${groupId}','${task.id}')" title="تأجيل">⏸</button>
                <button class="task-btn delete" onclick="deleteTask('${planId}','${groupId}','${task.id}')" title="حذف">🗑</button>
            </div>
        </div>
    `;
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

    if (t.status === 'done') {
        updateStreak();
        Achievements.checkAndNotify();
    }
    save();
    render();
}

function postponeTask(planId, groupId, taskId) {
    const found = findTask(planId, groupId, taskId);
    if (!found || !found.task) return;
    found.task.status = found.task.status === 'postponed' ? 'pending' : 'postponed';

    if (found.task.date && found.task.status === 'postponed') {
        const d = new Date(found.task.date);
        d.setDate(d.getDate() + 1);
        found.task.date = d.toISOString().split('T')[0];
    }

    save();
    render();
}

function startPomodoroForTask(planId, groupId, taskId) {
    const found = findTask(planId, groupId, taskId);
    if (!found || !found.task) return;
    Pomodoro.reset();
    Pomodoro.currentTask = found.task.name;
    Pomodoro.start(found.task.name);
    toast(`🍅 بدأ بومودورو: ${found.task.name}`, 'info');
}

function setTaskDate(planId, groupId, taskId) {
    const found = findTask(planId, groupId, taskId);
    if (!found || !found.task) return;

    const current = found.task.date || new Date().toISOString().split('T')[0];
    openModal('📅 تحديد التاريخ', `
        <p style="margin-bottom:1rem;color:var(--text-secondary);font-size:0.88rem">${found.task.name}</p>
        <input type="date" id="date-input" class="input-field" value="${current}">
        <div style="display:flex;gap:0.5rem;margin-top:1rem;flex-wrap:wrap">
            <button class="btn btn-primary" onclick="saveTaskDate('${planId}','${groupId}','${taskId}')">حفظ</button>
            <button class="btn btn-ghost" onclick="clearTaskDate('${planId}','${groupId}','${taskId}')">إزالة التاريخ</button>
            <button class="btn btn-ghost" onclick="closeModal()">إلغاء</button>
        </div>
        <div style="margin-top:1rem">
            <p style="font-size:0.8rem;color:var(--text-secondary);margin-bottom:0.5rem">اختصارات:</p>
            <div style="display:flex;gap:0.3rem;flex-wrap:wrap">
                <button class="btn btn-ghost btn-sm" onclick="setQuickDate('${planId}','${groupId}','${taskId}',0)">اليوم</button>
                <button class="btn btn-ghost btn-sm" onclick="setQuickDate('${planId}','${groupId}','${taskId}',1)">غداً</button>
                <button class="btn btn-ghost btn-sm" onclick="setQuickDate('${planId}','${groupId}','${taskId}',7)">بعد أسبوع</button>
                <button class="btn btn-ghost btn-sm" onclick="setQuickDate('${planId}','${groupId}','${taskId}',30)">بعد شهر</button>
            </div>
        </div>
    `);
}

function setQuickDate(planId, groupId, taskId, daysFromNow) {
    const d = new Date();
    d.setDate(d.getDate() + daysFromNow);
    document.getElementById('date-input').value = d.toISOString().split('T')[0];
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
        subs: [],
        notes: '',
        tags: []
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

    openModal('✏️ تعديل المهمة', `
        <input type="text" id="edit-task-input" class="input-field" value="${found.task.name}"
               onkeydown="if(event.key==='Enter')saveEditedTaskName('${planId}','${groupId}','${taskId}')">
        <div style="display:flex;gap:0.5rem;margin-top:1rem">
            <button class="btn btn-primary" onclick="saveEditedTaskName('${planId}','${groupId}','${taskId}')">حفظ</button>
            <button class="btn btn-ghost" onclick="closeModal()">إلغاء</button>
        </div>
    `);
    setTimeout(() => {
        const input = document.getElementById('edit-task-input');
        if (input) { input.focus(); input.select(); }
    }, 100);
}

function saveEditedTaskName(planId, groupId, taskId) {
    const input = document.getElementById('edit-task-input');
    if (!input || !input.value.trim()) return;
    const found = findTask(planId, groupId, taskId);
    if (!found || !found.task) return;
    found.task.name = input.value.trim();
    save();
    closeModal();
    render();
}

// =============================================================
//  TASK NOTES
// =============================================================
function openTaskNotes(planId, groupId, taskId) {
    const found = findTask(planId, groupId, taskId);
    if (!found || !found.task) return;

    openModal(`📄 ملاحظات: ${found.task.name}`, `
        <textarea id="task-notes-input" class="journal-textarea" style="min-height:200px"
                  placeholder="اكتب ملاحظاتك هنا... (يدعم الكتابة الحرة)">${found.task.notes || ''}</textarea>
        <div style="display:flex;gap:0.5rem;margin-top:1rem">
            <button class="btn btn-primary" onclick="saveTaskNotes('${planId}','${groupId}','${taskId}')">💾 حفظ</button>
            <button class="btn btn-ghost" onclick="closeModal()">إلغاء</button>
        </div>
    `);
    setTimeout(() => document.getElementById('task-notes-input')?.focus(), 100);
}

function saveTaskNotes(planId, groupId, taskId) {
    const textarea = document.getElementById('task-notes-input');
    if (!textarea) return;
    const found = findTask(planId, groupId, taskId);
    if (!found || !found.task) return;
    found.task.notes = textarea.value;
    save();
    closeModal();
    render();
    toast('تم حفظ الملاحظات ✅', 'success');
}

// =============================================================
//  TASK TAGS
// =============================================================
function openTaskTags(planId, groupId, taskId) {
    const found = findTask(planId, groupId, taskId);
    if (!found || !found.task) return;
    if (!found.task.tags) found.task.tags = [];

    const allTags = data.tags || ['سهل', 'متوسط', 'صعب', 'مهم', 'مراجعة'];

    openModal(`🏷️ تصنيفات: ${found.task.name}`, `
        <div style="margin-bottom:1rem">
            <p style="font-size:0.82rem;color:var(--text-secondary);margin-bottom:0.5rem">التصنيفات الحالية:</p>
            <div id="current-tags" style="display:flex;flex-wrap:wrap;gap:0.3rem;min-height:30px">
                ${found.task.tags.length === 0 ? '<span style="color:var(--text-secondary);font-size:0.82rem">لا توجد تصنيفات</span>' : ''}
                ${found.task.tags.map(tag => `
                    <span class="badge badge-tag" style="cursor:pointer" onclick="removeTaskTag('${planId}','${groupId}','${taskId}','${tag}')">${tag} ✕</span>
                `).join('')}
            </div>
        </div>
        <div style="margin-bottom:1rem">
            <p style="font-size:0.82rem;color:var(--text-secondary);margin-bottom:0.5rem">إضافة تصنيف:</p>
            <div style="display:flex;flex-wrap:wrap;gap:0.3rem">
                ${allTags.filter(t => !found.task.tags.includes(t)).map(tag => `
                    <button class="btn btn-ghost btn-sm" onclick="addTaskTag('${planId}','${groupId}','${taskId}','${tag}')">${tag}</button>
                `).join('')}
            </div>
        </div>
        <div class="add-form" style="margin-bottom:1rem">
            <input type="text" id="new-tag-input" class="input-field" placeholder="تصنيف جديد..."
                   onkeydown="if(event.key==='Enter')addCustomTag('${planId}','${groupId}','${taskId}')">
            <button class="btn btn-primary btn-sm" onclick="addCustomTag('${planId}','${groupId}','${taskId}')">إضافة</button>
        </div>
        <button class="btn btn-ghost" onclick="closeModal()">إغلاق</button>
    `);
}

function addTaskTag(planId, groupId, taskId, tag) {
    const found = findTask(planId, groupId, taskId);
    if (!found || !found.task) return;
    if (!found.task.tags) found.task.tags = [];
    if (!found.task.tags.includes(tag)) {
        found.task.tags.push(tag);
        save();
    }
    openTaskTags(planId, groupId, taskId);
    render();
}

function removeTaskTag(planId, groupId, taskId, tag) {
    const found = findTask(planId, groupId, taskId);
    if (!found || !found.task) return;
    found.task.tags = (found.task.tags || []).filter(t => t !== tag);
    save();
    openTaskTags(planId, groupId, taskId);
    render();
}

function addCustomTag(planId, groupId, taskId) {
    const input = document.getElementById('new-tag-input');
    if (!input || !input.value.trim()) return;
    const tag = input.value.trim();

    // أضف للقائمة العامة
    if (!data.tags) data.tags = [];
    if (!data.tags.includes(tag)) data.tags.push(tag);

    addTaskTag(planId, groupId, taskId, tag);
    input.value = '';
}

// =============================================================
//  SUB-TASKS (LESSONS)
// =============================================================
function openSubTasks(planId, groupId, taskId) {
    const found = findTask(planId, groupId, taskId);
    if (!found || !found.task) return;
    const task = found.task;
    if (!task.subs) task.subs = [];

    const done = task.subs.filter(s => s.status === 'done').length;
    const total = task.subs.length;
    const pct = total ? Math.round(done / total * 100) : 0;

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
        ${total > 0 ? `
            <div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:1rem">
                <div class="progress-track" style="flex:1;margin:0;height:6px">
                    <div class="progress-fill fill-success" style="width:${pct}%"></div>
                </div>
                <span style="font-size:0.78rem;color:var(--text-secondary)">${done}/${total} (${pct}%)</span>
            </div>
        ` : ''}
        <div class="add-form">
            <input type="text" id="sub-input" class="input-field" placeholder="أضف درس جديد..."
                   onkeydown="if(event.key==='Enter')addSub('${planId}','${groupId}','${taskId}')">
            <button class="btn btn-primary btn-sm" onclick="addSub('${planId}','${groupId}','${taskId}')">إضافة</button>
        </div>
        <div id="subs-list">${subsHtml}</div>
        ${total > 0 ? `
            <div style="margin-top:0.75rem;display:flex;gap:0.5rem">
                <button class="btn btn-ghost btn-sm" onclick="markAllSubsDone('${planId}','${groupId}','${taskId}')">✅ إكمال الكل</button>
                <button class="btn btn-ghost btn-sm" onclick="markAllSubsPending('${planId}','${groupId}','${taskId}')">↺ إعادة الكل</button>
            </div>
        ` : ''}
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
    openSubTasks(planId, groupId, taskId);
    render();
}

function toggleSub(planId, groupId, taskId, subIndex) {
    const found = findTask(planId, groupId, taskId);
    if (!found || !found.task) return;
    const sub = found.task.subs[subIndex];
    if (!sub) return;
    sub.status = sub.status === 'done' ? 'pending' : 'done';
    if (sub.status === 'done') {
        updateStreak();
        Achievements.checkAndNotify();
    }
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

function markAllSubsDone(planId, groupId, taskId) {
    const found = findTask(planId, groupId, taskId);
    if (!found || !found.task) return;
    found.task.subs.forEach(s => s.status = 'done');
    updateStreak();
    save();
    openSubTasks(planId, groupId, taskId);
    render();
}

function markAllSubsPending(planId, groupId, taskId) {
    const found = findTask(planId, groupId, taskId);
    if (!found || !found.task) return;
    found.task.subs.forEach(s => s.status = 'pending');
    save();
    openSubTasks(planId, groupId, taskId);
    render();
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

function expandAllGroups(planId) {
    const plan = data.plans.find(p => p.id === planId);
    if (!plan) return;
    plan.groups.forEach(g => g.collapsed = false);
    save();
    render();
}

function collapseAllGroups(planId) {
    const plan = data.plans.find(p => p.id === planId);
    if (!plan) return;
    plan.groups.forEach(g => g.collapsed = true);
    save();
    render();
}

function addGroup(planId) {
    openModal('📂 مجموعة جديدة', `
        <input type="text" id="new-group-input" class="input-field" placeholder="اسم المجموعة..."
               onkeydown="if(event.key==='Enter')saveNewGroup('${planId}')">
        <div style="display:flex;gap:0.5rem;margin-top:1rem">
            <button class="btn btn-primary" onclick="saveNewGroup('${planId}')">إضافة</button>
            <button class="btn btn-ghost" onclick="closeModal()">إلغاء</button>
        </div>
    `);
    setTimeout(() => document.getElementById('new-group-input')?.focus(), 100);
}

function saveNewGroup(planId) {
    const input = document.getElementById('new-group-input');
    if (!input || !input.value.trim()) return;
    const plan = data.plans.find(p => p.id === planId);
    if (!plan) return;
    plan.groups.push({
        id: uid(),
        name: input.value.trim(),
        collapsed: false,
        tasks: []
    });
    save();
    closeModal();
    render();
}

function editGroupName(planId, groupId) {
    const plan = data.plans.find(p => p.id === planId);
    const group = plan?.groups.find(g => g.id === groupId);
    if (!group) return;

    openModal('✏️ تعديل المجموعة', `
        <input type="text" id="edit-group-input" class="input-field" value="${group.name}"
               onkeydown="if(event.key==='Enter')saveEditedGroupName('${planId}','${groupId}')">
        <div style="display:flex;gap:0.5rem;margin-top:1rem">
            <button class="btn btn-primary" onclick="saveEditedGroupName('${planId}','${groupId}')">حفظ</button>
            <button class="btn btn-ghost" onclick="closeModal()">إلغاء</button>
        </div>
    `);
    setTimeout(() => {
        const input = document.getElementById('edit-group-input');
        if (input) { input.focus(); input.select(); }
    }, 100);
}

function saveEditedGroupName(planId, groupId) {
    const input = document.getElementById('edit-group-input');
    if (!input || !input.value.trim()) return;
    const plan = data.plans.find(p => p.id === planId);
    const group = plan?.groups.find(g => g.id === groupId);
    if (!group) return;
    group.name = input.value.trim();
    save();
    closeModal();
    render();
}

function deleteGroup(planId, groupId) {
    if (!confirm('حذف هذه المجموعة وكل محتوياتها؟')) return;
    const plan = data.plans.find(p => p.id === planId);
    if (!plan) return;
    plan.groups = plan.groups.filter(g => g.id !== groupId);
    save();
    render();
}

function moveGroupUp(planId, groupId) {
    const plan = data.plans.find(p => p.id === planId);
    if (!plan) return;
    const idx = plan.groups.findIndex(g => g.id === groupId);
    if (idx <= 0) return;
    [plan.groups[idx - 1], plan.groups[idx]] = [plan.groups[idx], plan.groups[idx - 1]];
    save();
    render();
}

function moveGroupDown(planId, groupId) {
    const plan = data.plans.find(p => p.id === planId);
    if (!plan) return;
    const idx = plan.groups.findIndex(g => g.id === groupId);
    if (idx >= plan.groups.length - 1) return;
    [plan.groups[idx], plan.groups[idx + 1]] = [plan.groups[idx + 1], plan.groups[idx]];
    save();
    render();
}

// =============================================================
//  PLAN ACTIONS
// =============================================================
function addNewPlan() {
    openModal('📚 خطة جديدة', `
        <div class="setup-form">
            <label>اسم الخطة</label>
            <input type="text" id="new-plan-name" class="input-field" placeholder="مثال: تعلم React"
                   onkeydown="if(event.key==='Enter')saveNewPlan()">
            <label>الأيقونة (emoji)</label>
            <div style="display:flex;gap:0.3rem;flex-wrap:wrap;margin-bottom:0.5rem">
                ${['📚','💻','🔬','🎨','📊','🤖','🔧','🎓','🌐','⚡','🧪','📱'].map(e =>
                    `<button class="btn btn-ghost btn-sm" onclick="document.getElementById('new-plan-icon').value='${e}'">${e}</button>`
                ).join('')}
            </div>
            <input type="text" id="new-plan-icon" class="input-field" value="📚" style="max-width:80px">
        </div>
        <div style="display:flex;gap:0.5rem;margin-top:1rem">
            <button class="btn btn-primary" onclick="saveNewPlan()">إنشاء</button>
            <button class="btn btn-ghost" onclick="closeModal()">إلغاء</button>
        </div>
    `);
    setTimeout(() => document.getElementById('new-plan-name')?.focus(), 100);
}

function saveNewPlan() {
    const nameInput = document.getElementById('new-plan-name');
    const iconInput = document.getElementById('new-plan-icon');
    if (!nameInput || !nameInput.value.trim()) return;

    data.plans.push({
        id: uid(),
        name: nameInput.value.trim(),
        icon: iconInput?.value || '📚',
        groups: []
    });
    save();
    closeModal();
    navigateToPlan(data.plans[data.plans.length - 1].id);
}

function editPlanName(planId) {
    const plan = data.plans.find(p => p.id === planId);
    if (!plan) return;

    openModal('✏️ تعديل الخطة', `
        <input type="text" id="edit-plan-input" class="input-field" value="${plan.name}"
               onkeydown="if(event.key==='Enter')saveEditedPlanName('${planId}')">
        <div style="display:flex;gap:0.5rem;margin-top:1rem">
            <button class="btn btn-primary" onclick="saveEditedPlanName('${planId}')">حفظ</button>
            <button class="btn btn-ghost" onclick="closeModal()">إلغاء</button>
        </div>
    `);
    setTimeout(() => {
        const input = document.getElementById('edit-plan-input');
        if (input) { input.focus(); input.select(); }
    }, 100);
}

function saveEditedPlanName(planId) {
    const input = document.getElementById('edit-plan-input');
    if (!input || !input.value.trim()) return;
    const plan = data.plans.find(p => p.id === planId);
    if (!plan) return;
    plan.name = input.value.trim();
    save();
    closeModal();
    render();
}

function editPlanIcon(planId) {
    const plan = data.plans.find(p => p.id === planId);
    if (!plan) return;

    openModal('🎨 تغيير الأيقونة', `
        <div style="display:flex;flex-wrap:wrap;gap:0.4rem;margin-bottom:1rem">
            ${['📚','💻','🔬','🎨','📊','🤖','🔧','🎓','🌐','⚡','🧪','📱','🎯','🏆','🔥','💡','🧠','📐','🎵','🌍','💼','📈','🛡️','🔑'].map(e =>
                `<button class="btn btn-ghost" style="font-size:1.3rem;padding:0.5rem" onclick="savePlanIcon('${planId}','${e}')">${e}</button>`
            ).join('')}
        </div>
        <div class="add-form">
            <input type="text" id="custom-icon-input" class="input-field" placeholder="أو اكتب emoji..." style="max-width:100px">
            <button class="btn btn-primary btn-sm" onclick="savePlanIcon('${planId}',document.getElementById('custom-icon-input').value)">حفظ</button>
        </div>
    `);
}

function savePlanIcon(planId, icon) {
    if (!icon) return;
    const plan = data.plans.find(p => p.id === planId);
    if (!plan) return;
    plan.icon = icon;
    save();
    closeModal();
    render();
}

function deletePlan(planId) {
    if (!confirm('حذف هذه الخطة بالكامل؟ لا يمكن التراجع!')) return;
    data.plans = data.plans.filter(p => p.id !== planId);
    save();
    currentView = 'dashboard';
    render();
}

// =============================================================
//  DRAG & DROP
// =============================================================
let dragState = null;

function enableDragDrop() {
    const content = document.getElementById('content');
    if (!content) return;

    content.addEventListener('dragstart', (e) => {
        const taskEl = e.target.closest('[data-task-id]');
        if (!taskEl) return;
        dragState = {
            taskId: taskEl.dataset.taskId,
            groupId: taskEl.dataset.groupId,
            planId: taskEl.dataset.planId
        };
        taskEl.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', ''); // Required for Firefox
    });

    content.addEventListener('dragend', (e) => {
        const taskEl = e.target.closest('[data-task-id]');
        if (taskEl) taskEl.classList.remove('dragging');
        document.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over'));
        dragState = null;
    });

    content.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        const target = e.target.closest('[data-task-id]');
        document.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over'));
        if (target && dragState && target.dataset.taskId !== dragState.taskId) {
            target.classList.add('drag-over');
        }
    });

    content.addEventListener('drop', (e) => {
        e.preventDefault();
        document.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over'));

        const target = e.target.closest('[data-task-id]');
        if (!target || !dragState) return;
        if (target.dataset.taskId === dragState.taskId) return;

        const to = {
            taskId: target.dataset.taskId,
            groupId: target.dataset.groupId,
            planId: target.dataset.planId
        };

        moveTask(dragState, to);
        dragState = null;
    });
}

function moveTask(from, to) {
    const fromPlan = data.plans.find(p => p.id === from.planId);
    const fromGroup = fromPlan?.groups.find(g => g.id === from.groupId);
    if (!fromGroup) return;

    const taskIndex = fromGroup.tasks.findIndex(t => t.id === from.taskId);
    if (taskIndex === -1) return;
    const [task] = fromGroup.tasks.splice(taskIndex, 1);

    const toPlan = data.plans.find(p => p.id === to.planId);
    const toGroup = toPlan?.groups.find(g => g.id === to.groupId);
    if (!toGroup) return;

    const targetIndex = toGroup.tasks.findIndex(t => t.id === to.taskId);
    if (targetIndex === -1) {
        toGroup.tasks.push(task);
    } else {
        toGroup.tasks.splice(targetIndex, 0, task);
    }

    save();
    render();
    toast('تم نقل المهمة ✅', 'success');
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
            <div style="display:flex;gap:0.5rem;flex-wrap:wrap">
                <button class="btn btn-primary btn-sm" onclick="addPhase('${proj.id}')">+ مرحلة</button>
                <button class="btn btn-ghost btn-sm" onclick="editProjectIcon('${proj.id}')">تغيير الأيقونة</button>
                <button class="btn btn-ghost btn-sm" style="color:var(--danger)" onclick="deleteProject('${proj.id}')">حذف المشروع</button>
            </div>
        </div>

        <div style="display:flex;gap:1rem;align-items:center;margin-bottom:1.5rem;flex-wrap:wrap">
            <div class="progress-track" style="flex:1;height:8px;min-width:200px">
                <div class="progress-fill fill-success" style="width:${pct}%"></div>
            </div>
            <span style="font-size:0.82rem;color:var(--text-secondary)">
                ✅ ${done} مكتمل | 🔄 ${active} جاري | ⭕ ${total - done - active} متبقي
            </span>
        </div>

        <div class="card">
            ${proj.phases.map((ph, i) => `
                <div class="phase-item ${ph.status === 'done' ? 'done' : ph.status === 'active' ? 'active' : ''}">
                    <span>${ph.status === 'done' ? '✅' : ph.status === 'active' ? '🔄' : '⭕'}</span>
                    <span class="task-name ${ph.status === 'done' ? 'done' : ''}" style="flex:1;cursor:pointer"
                          onclick="editPhaseName('${proj.id}',${i})">${ph.name}</span>
                    <div style="display:flex;gap:0.3rem;flex-wrap:wrap">
                        ${ph.status !== 'done' ? `
                            <button class="btn btn-success btn-sm" onclick="setPhaseStatus('${proj.id}',${i},'done')">✓ تم</button>
                            ${ph.status !== 'active' ? `<button class="btn btn-primary btn-sm" onclick="setPhaseStatus('${proj.id}',${i},'active')">▶ جاري</button>` : ''}
                        ` : `
                            <button class="btn btn-ghost btn-sm" onclick="setPhaseStatus('${proj.id}',${i},'pending')">↺ إرجاع</button>
                        `}
                        <button class="task-btn" onclick="movePhaseUp('${proj.id}',${i})" title="أعلى">⬆</button>
                        <button class="task-btn" onclick="movePhaseDown('${proj.id}',${i})" title="أسفل">⬇</button>
                        <button class="task-btn delete" onclick="deletePhase('${proj.id}',${i})">🗑</button>
                    </div>
                </div>
            `).join('')}

            <div class="add-form" style="margin-top:0.75rem">
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
    openModal('🛠️ مشروع جديد', `
        <div class="setup-form">
            <label>اسم المشروع</label>
            <input type="text" id="new-proj-name" class="input-field" placeholder="مثال: Dashboard App"
                   onkeydown="if(event.key==='Enter')saveNewProject()">
            <label>الأيقونة</label>
            <div style="display:flex;gap:0.3rem;flex-wrap:wrap;margin-bottom:0.5rem">
                ${['🛠️','🔬','🤖','💻','🌐','📊','📱','⚡','🎮','🧪'].map(e =>
                    `<button class="btn btn-ghost btn-sm" onclick="document.getElementById('new-proj-icon').value='${e}'">${e}</button>`
                ).join('')}
            </div>
            <input type="text" id="new-proj-icon" class="input-field" value="🛠️" style="max-width:80px">
        </div>
        <div style="display:flex;gap:0.5rem;margin-top:1rem">
            <button class="btn btn-primary" onclick="saveNewProject()">إنشاء</button>
            <button class="btn btn-ghost" onclick="closeModal()">إلغاء</button>
        </div>
    `);
    setTimeout(() => document.getElementById('new-proj-name')?.focus(), 100);
}

function saveNewProject() {
    const nameInput = document.getElementById('new-proj-name');
    const iconInput = document.getElementById('new-proj-icon');
    if (!nameInput || !nameInput.value.trim()) return;

    data.projects.push({
        id: uid(),
        name: nameInput.value.trim(),
        icon: iconInput?.value || '🛠️',
        phases: []
    });
    save();
    closeModal();
    navigateToProject(data.projects[data.projects.length - 1].id);
}

function editProjectName(projId) {
    const proj = data.projects.find(p => p.id === projId);
    if (!proj) return;

    openModal('✏️ تعديل المشروع', `
        <input type="text" id="edit-proj-input" class="input-field" value="${proj.name}"
               onkeydown="if(event.key==='Enter')saveEditedProjectName('${projId}')">
        <div style="display:flex;gap:0.5rem;margin-top:1rem">
            <button class="btn btn-primary" onclick="saveEditedProjectName('${projId}')">حفظ</button>
            <button class="btn btn-ghost" onclick="closeModal()">إلغاء</button>
        </div>
    `);
    setTimeout(() => {
        const input = document.getElementById('edit-proj-input');
        if (input) { input.focus(); input.select(); }
    }, 100);
}

function saveEditedProjectName(projId) {
    const input = document.getElementById('edit-proj-input');
    if (!input || !input.value.trim()) return;
    const proj = data.projects.find(p => p.id === projId);
    if (!proj) return;
    proj.name = input.value.trim();
    save();
    closeModal();
    render();
}

function editProjectIcon(projId) {
    const proj = data.projects.find(p => p.id === projId);
    if (!proj) return;

    openModal('🎨 تغيير الأيقونة', `
        <div style="display:flex;flex-wrap:wrap;gap:0.4rem;margin-bottom:1rem">
            ${['🛠️','🔬','🤖','💻','🌐','📊','📱','⚡','🎮','🧪','🏗️','🔧','💡','🎯','🚀','🧠'].map(e =>
                `<button class="btn btn-ghost" style="font-size:1.3rem;padding:0.5rem" onclick="saveProjectIcon('${projId}','${e}')">${e}</button>`
            ).join('')}
        </div>
    `);
}

function saveProjectIcon(projId, icon) {
    const proj = data.projects.find(p => p.id === projId);
    if (!proj) return;
    proj.icon = icon;
    save();
    closeModal();
    render();
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
    if (status === 'done') {
        updateStreak();
        Achievements.checkAndNotify();
    }
    save();
    render();
}

function editPhaseName(projId, index) {
    const proj = data.projects.find(p => p.id === projId);
    if (!proj || !proj.phases[index]) return;

    openModal('✏️ تعديل المرحلة', `
        <input type="text" id="edit-phase-input" class="input-field" value="${proj.phases[index].name}"
               onkeydown="if(event.key==='Enter')saveEditedPhaseName('${projId}',${index})">
        <div style="display:flex;gap:0.5rem;margin-top:1rem">
            <button class="btn btn-primary" onclick="saveEditedPhaseName('${projId}',${index})">حفظ</button>
            <button class="btn btn-ghost" onclick="closeModal()">إلغاء</button>
        </div>
    `);
    setTimeout(() => {
        const input = document.getElementById('edit-phase-input');
        if (input) { input.focus(); input.select(); }
    }, 100);
}

function saveEditedPhaseName(projId, index) {
    const input = document.getElementById('edit-phase-input');
    if (!input || !input.value.trim()) return;
    const proj = data.projects.find(p => p.id === projId);
    if (!proj || !proj.phases[index]) return;
    proj.phases[index].name = input.value.trim();
    save();
    closeModal();
    render();
}

function deletePhase(projId, index) {
    if (!confirm('حذف هذه المرحلة؟')) return;
    const proj = data.projects.find(p => p.id === projId);
    if (!proj) return;
    proj.phases.splice(index, 1);
    save();
    render();
}

function movePhaseUp(projId, index) {
    const proj = data.projects.find(p => p.id === projId);
    if (!proj || index <= 0) return;
    [proj.phases[index - 1], proj.phases[index]] = [proj.phases[index], proj.phases[index - 1]];
    save();
    render();
}

function movePhaseDown(projId, index) {
    const proj = data.projects.find(p => p.id === projId);
    if (!proj || index >= proj.phases.length - 1) return;
    [proj.phases[index], proj.phases[index + 1]] = [proj.phases[index + 1], proj.phases[index]];
    save();
    render();
}

// =============================================================
//  CALENDAR VIEW
// =============================================================
function renderCalendar(c) {
    const today = new Date();
    const display = new Date(today.getFullYear(), today.getMonth() + calOffset, 1);
    const year = display.getFullYear();
    const month = display.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();

    const monthNames = ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];
    const dayNames = ['أحد','إثنين','ثلاثاء','أربعاء','خميس','جمعة','سبت'];

    // Collect tasks with dates
    const tasksByDate = {};
    data.plans.forEach(p => p.groups.forEach(g => g.tasks.forEach(t => {
        if (t.date) {
            if (!tasksByDate[t.date]) tasksByDate[t.date] = [];
            tasksByDate[t.date].push({
                name: t.name,
                status: t.status,
                planId: p.id,
                planIcon: p.icon
            });
        }
    })));

    // Pomodoro activity
    const pomodoroLog = data.pomodoroLog || {};

    let daysHtml = dayNames.map(d => `<div class="cal-day-name">${d}</div>`).join('');

    for (let i = 0; i < firstDay; i++) {
        daysHtml += '<div class="cal-day empty"></div>';
    }

    const todayStr = today.toISOString().split('T')[0];

    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const isToday = dateStr === todayStr;
        const tasks = tasksByDate[dateStr] || [];
        const pomoMins = pomodoroLog[dateStr] || 0;
        const pendingTasks = tasks.filter(t => t.status !== 'done');
        const doneTasks = tasks.filter(t => t.status === 'done');
        const isOverdue = dateStr < todayStr;

        daysHtml += `
            <div class="cal-day ${isToday ? 'today' : ''}" onclick="showDayDetail('${dateStr}')">
                <div class="cal-day-num">${day}</div>
                ${pomoMins > 0 ? `<div class="cal-pomo">🍅 ${Math.round(pomoMins)}د</div>` : ''}
                ${pendingTasks.slice(0, 2).map(t =>
                    `<div class="cal-event ${isOverdue ? 'overdue' : ''}" title="${t.name}">${t.planIcon || ''} ${t.name.substring(0, 15)}</div>`
                ).join('')}
                ${doneTasks.slice(0, 1).map(t =>
                    `<div class="cal-event done" title="${t.name}">✅ ${t.name.substring(0, 12)}</div>`
                ).join('')}
                ${tasks.length > 3 ? `<div style="font-size:0.6rem;color:var(--text-secondary)">+${tasks.length - 3}</div>` : ''}
            </div>
        `;
    }

    // Upcoming & Overdue
    const upcoming = getUpcomingTasks(7);
    const overdue = getOverdueTasks();

    c.innerHTML = `
        <div class="section-header">
            <h2>📅 التقويم</h2>
            <div style="display:flex;gap:0.5rem">
                <button class="btn btn-ghost btn-sm" onclick="exportToGoogleCalendar()">📅 Google Calendar</button>
                <button class="btn btn-ghost btn-sm" onclick="exportToICS()">📥 تصدير .ics</button>
            </div>
        </div>

        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem">
            <button class="btn btn-ghost btn-sm" onclick="calOffset--;render()">◀ السابق</button>
            <h3 style="font-size:1.1rem">${monthNames[month]} ${year}</h3>
            <div style="display:flex;gap:0.5rem">
                <button class="btn btn-ghost btn-sm" onclick="calOffset=0;render()">اليوم</button>
                <button class="btn btn-ghost btn-sm" onclick="calOffset++;render()">التالي ▶</button>
            </div>
        </div>

        <div class="cal-grid">${daysHtml}</div>

        ${overdue.length > 0 ? `
            <div class="card" style="margin-top:1.5rem;border-color:var(--danger)">
                <div class="card-title" style="color:var(--danger)">⏰ مهام متأخرة (${overdue.length})</div>
                ${overdue.map(t => `
                    <div class="task" onclick="navigateToPlan('${t.planId}')" style="cursor:pointer">
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
                    <div class="task" onclick="navigateToPlan('${t.planId}')" style="cursor:pointer">
                        <span>📌</span>
                        <span class="task-name">${t.name}</span>
                        <span class="badge badge-date">${formatDate(t.date)}</span>
                    </div>
                `).join('')}
            </div>
        ` : ''}
    `;
}

function showDayDetail(dateStr) {
    const tasks = [];
    data.plans.forEach(p => p.groups.forEach(g => g.tasks.forEach(t => {
        if (t.date === dateStr) {
            tasks.push({ ...t, planName: p.name, planIcon: p.icon, planId: p.id });
        }
    })));

    const pomoMins = (data.pomodoroLog || {})[dateStr] || 0;
    const dateLabel = new Date(dateStr).toLocaleDateString('ar-EG', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });

    openModal(`📅 ${dateLabel}`, `
        ${pomoMins > 0 ? `
            <div style="background:var(--primary-bg);padding:0.6rem 0.85rem;border-radius:var(--radius-sm);margin-bottom:1rem;font-size:0.85rem">
                🍅 وقت التعلم: <strong>${Math.round(pomoMins)} دقيقة</strong> (${Math.round(pomoMins / 25)} جلسة)
            </div>
        ` : ''}
        ${tasks.length > 0 ? `
            <h4 style="font-size:0.88rem;margin-bottom:0.5rem">المهام (${tasks.length})</h4>
            ${tasks.map(t => `
                <div class="task" onclick="navigateToPlan('${t.planId}');closeModal()" style="cursor:pointer">
                    <div class="task-check ${t.status === 'done' ? 'done' : ''}">${t.status === 'done' ? '✓' : ''}</div>
                    <span class="task-name ${t.status === 'done' ? 'done' : ''}">${t.name}</span>
                    <span class="badge badge-date">${t.planIcon} ${t.planName}</span>
                </div>
            `).join('')}
        ` : `
            <p style="color:var(--text-secondary);text-align:center;padding:1.5rem">لا توجد مهام لهذا اليوم</p>
        `}
    `);
}

// =============================================================
//  GOOGLE CALENDAR INTEGRATION
// =============================================================
function exportToGoogleCalendar() {
    const tasks = [];
    data.plans.forEach(p => p.groups.forEach(g => g.tasks.forEach(t => {
        if (t.date && t.status !== 'done') {
            tasks.push({ name: t.name, date: t.date, planName: p.name });
        }
    })));

    if (tasks.length === 0) {
        toast('لا توجد مهام مجدولة للتصدير', 'info');
        return;
    }

    openModal('📅 تصدير إلى Google Calendar', `
        <p style="font-size:0.85rem;color:var(--text-secondary);margin-bottom:1rem">
            اختر المهام التي تريد إضافتها إلى Google Calendar:
        </p>
        <div id="gcal-tasks">
            ${tasks.map((t, i) => `
                <div class="task" style="padding:0.4rem 0.6rem">
                    <input type="checkbox" id="gcal-${i}" checked style="cursor:pointer">
                    <label for="gcal-${i}" style="flex:1;cursor:pointer;font-size:0.85rem">${t.name}</label>
                    <span class="badge badge-date">${formatDate(t.date)}</span>
                </div>
            `).join('')}
        </div>
        <div style="margin-top:1rem">
            <p style="font-size:0.78rem;color:var(--text-secondary);margin-bottom:0.5rem">طريقة الإضافة:</p>
            <div style="display:flex;gap:0.5rem;flex-wrap:wrap">
                <button class="btn btn-primary btn-sm" onclick="addSelectedToGCal('individual')">
                    📅 إضافة كل مهمة على حدة
                </button>
                <button class="btn btn-ghost btn-sm" onclick="exportToICS()">
                    📥 تصدير ملف .ics
                </button>
            </div>
        </div>
    `);
}

function addSelectedToGCal(mode) {
    const tasks = [];
    data.plans.forEach(p => p.groups.forEach(g => g.tasks.forEach(t => {
        if (t.date && t.status !== 'done') {
            tasks.push({ name: t.name, date: t.date, planName: p.name });
        }
    })));

    const checkboxes = document.querySelectorAll('[id^="gcal-"]');
    const selectedTasks = [];
    checkboxes.forEach((cb, i) => {
        if (cb.checked && tasks[i]) {
            selectedTasks.push(tasks[i]);
        }
    });

    if (selectedTasks.length === 0) {
        toast('اختر مهمة واحدة على الأقل', 'error');
        return;
    }

    // Open Google Calendar for each task
    selectedTasks.forEach((task, index) => {
        setTimeout(() => {
            const startDate = task.date.replace(/-/g, '');
            const endDate = startDate; // Same day
            const title = encodeURIComponent(`📚 ${task.name}`);
            const details = encodeURIComponent(`خطة التعلم: ${task.planName}\nمن تطبيق رحلة التعلم 🎯`);

            const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE` +
                `&text=${title}` +
                `&dates=${startDate}/${startDate}` +
                `&details=${details}` +
                `&sf=true`;

            window.open(gcalUrl, '_blank');
        }, index * 500); // تأخير بسيط بين كل نافذة
    });

    closeModal();
    toast(`تم فتح ${selectedTasks.length} مهمة في Google Calendar`, 'success');
}

function exportToICS() {
    const tasks = [];
    data.plans.forEach(p => p.groups.forEach(g => g.tasks.forEach(t => {
        if (t.date && t.status !== 'done') {
            tasks.push({ name: t.name, date: t.date, planName: p.name });
        }
    })));

    if (tasks.length === 0) {
        toast('لا توجد مهام مجدولة', 'info');
        return;
    }

    let icsContent = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Learning Journey//AR',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH',
        'X-WR-CALNAME:رحلة التعلم',
        'X-WR-TIMEZONE:Asia/Riyadh'
    ];

    tasks.forEach(task => {
        const dateFormatted = task.date.replace(/-/g, '');
        const uid_val = `${task.date}-${Math.random().toString(36).substr(2, 8)}@learning-journey`;

        icsContent.push(
            'BEGIN:VEVENT',
            `DTSTART;VALUE=DATE:${dateFormatted}`,
            `DTEND;VALUE=DATE:${dateFormatted}`,
            `SUMMARY:📚 ${task.name}`,
            `DESCRIPTION:خطة: ${task.planName}`,
            `UID:${uid_val}`,
            `STATUS:CONFIRMED`,
            'BEGIN:VALARM',
            'TRIGGER:-PT30M',
            'ACTION:DISPLAY',
            `DESCRIPTION:حان وقت: ${task.name}`,
            'END:VALARM',
            'END:VEVENT'
        );
    });

    icsContent.push('END:VCALENDAR');

    const blob = new Blob([icsContent.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `learning-journey-${new Date().toISOString().split('T')[0]}.ics`;
    a.click();
    URL.revokeObjectURL(url);

    toast(`تم تصدير ${tasks.length} مهمة كملف .ics ✅`, 'success');
    if (document.getElementById('modal-backdrop').classList.contains('open')) {
        closeModal();
    }
}

// =============================================================
//  RESOURCES VIEW
// =============================================================
function renderResources(c) {
    let totalItems = 0, doneItems = 0;
    data.resources.forEach(g => g.items.forEach(i => {
        totalItems++;
        if (i.done) doneItems++;
    }));
    const pct = totalItems ? Math.round(doneItems / totalItems * 100) : 0;

    c.innerHTML = `
        <div class="section-header">
            <h2>📖 المصادر والمراجع</h2>
            <div style="display:flex;gap:0.5rem;align-items:center">
                <span style="font-size:0.82rem;color:var(--text-secondary)">${doneItems}/${totalItems} (${pct}%)</span>
                <button class="btn btn-primary btn-sm" onclick="addResourceGroup()">+ مجموعة جديدة</button>
            </div>
        </div>

        ${data.resources.map((group, gi) => {
            const done = group.items.filter(i => i.done).length;
            const total = group.items.length;
            const groupPct = total ? Math.round(done / total * 100) : 0;
            return `
                <div class="card resource-group">
                    <div class="card-header">
                        <div class="card-title">
                            <span class="editable" onclick="editResourceGroupName(${gi})">${group.name}</span>
                            <span class="badge badge-count">${done}/${total}</span>
                            <div class="progress-track" style="width:50px;margin:0">
                                <div class="progress-fill fill-primary" style="width:${groupPct}%"></div>
                            </div>
                        </div>
                        <div style="display:flex;gap:0.3rem">
                            <button class="task-btn" onclick="moveResourceGroupUp(${gi})" title="أعلى">⬆</button>
                            <button class="task-btn" onclick="moveResourceGroupDown(${gi})" title="أسفل">⬇</button>
                            <button class="task-btn delete" onclick="deleteResourceGroup(${gi})">🗑</button>
                        </div>
                    </div>
                    ${group.items.map((item, ii) => `
                        <div class="resource-item">
                            <input type="checkbox" ${item.done ? 'checked' : ''} onchange="toggleResourceItem(${gi},${ii})">
                            <span class="${item.done ? 'done-text' : ''}" style="flex:1">
                                ${item.url ? `<a href="${item.url}" target="_blank" rel="noopener">${item.text}</a>` : item.text}
                            </span>
                            <div class="task-actions" style="opacity:1;margin-right:0">
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
    openModal('📚 مجموعة مصادر جديدة', `
        <input type="text" id="new-res-group" class="input-field" placeholder="اسم المجموعة..."
               onkeydown="if(event.key==='Enter')saveNewResourceGroup()">
        <div style="display:flex;gap:0.5rem;margin-top:1rem">
            <button class="btn btn-primary" onclick="saveNewResourceGroup()">إضافة</button>
            <button class="btn btn-ghost" onclick="closeModal()">إلغاء</button>
        </div>
    `);
    setTimeout(() => document.getElementById('new-res-group')?.focus(), 100);
}

function saveNewResourceGroup() {
    const input = document.getElementById('new-res-group');
    if (!input || !input.value.trim()) return;
    data.resources.push({ id: uid(), name: input.value.trim(), items: [] });
    save();
    closeModal();
    render();
}

function editResourceGroupName(gi) {
    openModal('✏️ تعديل المجموعة', `
        <input type="text" id="edit-res-group" class="input-field" value="${data.resources[gi].name}"
               onkeydown="if(event.key==='Enter')saveEditedResourceGroupName(${gi})">
        <div style="display:flex;gap:0.5rem;margin-top:1rem">
            <button class="btn btn-primary" onclick="saveEditedResourceGroupName(${gi})">حفظ</button>
            <button class="btn btn-ghost" onclick="closeModal()">إلغاء</button>
        </div>
    `);
    setTimeout(() => {
        const input = document.getElementById('edit-res-group');
        if (input) { input.focus(); input.select(); }
    }, 100);
}

function saveEditedResourceGroupName(gi) {
    const input = document.getElementById('edit-res-group');
    if (!input || !input.value.trim()) return;
    data.resources[gi].name = input.value.trim();
    save();
    closeModal();
    render();
}

function deleteResourceGroup(gi) {
    if (!confirm('حذف هذه المجموعة؟')) return;
    data.resources.splice(gi, 1);
    save();
    render();
}

function moveResourceGroupUp(gi) {
    if (gi <= 0) return;
    [data.resources[gi - 1], data.resources[gi]] = [data.resources[gi], data.resources[gi - 1]];
    save();
    render();
}

function moveResourceGroupDown(gi) {
    if (gi >= data.resources.length - 1) return;
    [data.resources[gi], data.resources[gi + 1]] = [data.resources[gi + 1], data.resources[gi]];
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
    if (data.resources[gi].items[ii].done) {
        Achievements.checkAndNotify();
    }
    save();
    render();
}

function editResourceItem(gi, ii) {
    const item = data.resources[gi].items[ii];

    openModal('✏️ تعديل المصدر', `
        <div class="setup-form">
            <label>اسم المصدر</label>
            <input type="text" id="edit-res-text" class="input-field" value="${item.text}">
            <label>الرابط (اختياري)</label>
            <input type="text" id="edit-res-url" class="input-field" value="${item.url || ''}" placeholder="https://...">
        </div>
        <div style="display:flex;gap:0.5rem;margin-top:1rem">
            <button class="btn btn-primary" onclick="saveEditedResourceItem(${gi},${ii})">حفظ</button>
            <button class="btn btn-ghost" onclick="closeModal()">إلغاء</button>
        </div>
    `);
}

function saveEditedResourceItem(gi, ii) {
    const textInput = document.getElementById('edit-res-text');
    const urlInput = document.getElementById('edit-res-url');
    if (!textInput || !textInput.value.trim()) return;

    data.resources[gi].items[ii].text = textInput.value.trim();
    data.resources[gi].items[ii].url = urlInput?.value.trim() || '';
    save();
    closeModal();
    render();
}

function deleteResourceItem(gi, ii) {
    data.resources[gi].items.splice(ii, 1);
    save();
    render();
}

// =============================================================
//  JOURNAL VIEW
// =============================================================
function renderJournal(c) {
    const todayStr = new Date().toISOString().split('T')[0];
    const todayEntry = (data.journalEntries || []).find(e => e.date && e.date.startsWith(todayStr));

    c.innerHTML = `
        <div class="section-header">
            <h2>📝 اليوميات</h2>
            <span style="font-size:0.82rem;color:var(--text-secondary)">${(data.journalEntries || []).length} إدخال</span>
        </div>

        <div class="card">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.5rem">
                <span style="font-size:0.88rem;font-weight:600">✍️ ملاحظات اليوم</span>
                ${todayEntry ? '<span class="badge badge-count">تم الحفظ ✅</span>' : ''}
            </div>
            <textarea class="journal-textarea" id="journal-text" placeholder="اكتب ملاحظاتك لليوم... ماذا تعلمت؟ ما التحديات؟ ما الخطوة التالية؟">${data.journal || ''}</textarea>
            <div style="display:flex;gap:0.5rem;margin-top:0.75rem;flex-wrap:wrap">
                <button class="btn btn-primary" onclick="saveJournal()">💾 حفظ مسودة</button>
                <button class="btn btn-success" onclick="saveJournalEntry()">📌 حفظ كإدخال يومي</button>
                <div style="margin-right:auto;display:flex;gap:0.3rem">
                    <button class="btn btn-ghost btn-sm" onclick="insertJournalTemplate('learning')">📚 قالب تعلم</button>
                    <button class="btn btn-ghost btn-sm" onclick="insertJournalTemplate('review')">🔄 قالب مراجعة</button>
                </div>
            </div>
        </div>

        <div style="display:flex;justify-content:space-between;align-items:center;margin:1.5rem 0 0.75rem">
            <h3 style="font-size:1rem">📅 الإدخالات السابقة</h3>
            <input type="text" placeholder="بحث في اليوميات..." id="journal-search"
                   class="input-field" style="max-width:200px;padding:0.35rem 0.75rem"
                   oninput="filterJournalEntries(this.value)">
        </div>

        <div id="journal-entries-list">
            ${renderJournalEntries(data.journalEntries || [])}
        </div>
    `;
}

function renderJournalEntries(entries) {
    if (!entries || entries.length === 0) {
        return `
            <div class="empty-state" style="padding:1.5rem">
                <p style="font-size:0.85rem">لا توجد إدخالات سابقة. ابدأ بكتابة أول يومية! ✍️</p>
            </div>
        `;
    }

    return entries.slice().reverse().map((entry, i) => {
        const actualIndex = entries.length - 1 - i;
        return `
            <div class="journal-entry">
                <div class="journal-date">
                    ${new Date(entry.date).toLocaleDateString('ar-EG', {
                        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                    })}
                    <div style="float:left;display:flex;gap:0.3rem">
                        <button class="task-btn" onclick="editJournalEntry(${actualIndex})" title="تعديل">✏️</button>
                        <button class="task-btn delete" onclick="deleteJournalEntry(${actualIndex})" title="حذف">✕</button>
                    </div>
                </div>
                <div style="font-size:0.88rem;white-space:pre-wrap;line-height:1.8">${entry.text}</div>
            </div>
        `;
    }).join('');
}

function filterJournalEntries(query) {
    const container = document.getElementById('journal-entries-list');
    if (!container) return;

    if (!query || !query.trim()) {
        container.innerHTML = renderJournalEntries(data.journalEntries || []);
        return;
    }

    const q = query.toLowerCase().trim();
    const filtered = (data.journalEntries || []).filter(e =>
        e.text.toLowerCase().includes(q)
    );

    container.innerHTML = renderJournalEntries(filtered);
}

function insertJournalTemplate(type) {
    const textarea = document.getElementById('journal-text');
    if (!textarea) return;

    const templates = {
        learning: `📚 ما تعلمته اليوم:\n- \n\n💡 أهم فكرة:\n\n🤔 تحديات واجهتها:\n\n📌 الخطوة التالية:\n`,
        review: `🔄 مراجعة الأسبوع:\n\n✅ ما أنجزته:\n- \n\n❌ ما لم أنجزه:\n- \n\n🎯 أهداف الأسبوع القادم:\n- \n\n💪 ملاحظات:\n`
    };

    const template = templates[type] || '';
    if (textarea.value.trim()) {
        textarea.value += '\n\n' + template;
    } else {
        textarea.value = template;
    }

    textarea.focus();
    textarea.setSelectionRange(textarea.value.indexOf('- ') + 2, textarea.value.indexOf('- ') + 2);
}

function saveJournal() {
    const textarea = document.getElementById('journal-text');
    if (textarea) {
        data.journal = textarea.value;
        save();
        toast('تم حفظ المسودة ✅', 'success');
    }
}

function saveJournalEntry() {
    const textarea = document.getElementById('journal-text');
    if (!textarea || !textarea.value.trim()) {
        toast('اكتب شيئاً أولاً!', 'error');
        return;
    }

    if (!data.journalEntries) data.journalEntries = [];
    data.journalEntries.push({
        id: uid(),
        date: new Date().toISOString(),
        text: textarea.value.trim()
    });

    textarea.value = '';
    data.journal = '';
    updateStreak();
    Achievements.checkAndNotify();
    save();
    render();
    toast('تم حفظ الإدخال اليومي 📌', 'success');
}

function editJournalEntry(index) {
    const entry = data.journalEntries[index];
    if (!entry) return;

    openModal('✏️ تعديل اليومية', `
        <textarea id="edit-journal-text" class="journal-textarea" style="min-height:200px">${entry.text}</textarea>
        <div style="display:flex;gap:0.5rem;margin-top:1rem">
            <button class="btn btn-primary" onclick="saveEditedJournalEntry(${index})">حفظ</button>
            <button class="btn btn-ghost" onclick="closeModal()">إلغاء</button>
        </div>
    `);
}

function saveEditedJournalEntry(index) {
    const textarea = document.getElementById('edit-journal-text');
    if (!textarea || !textarea.value.trim()) return;
    data.journalEntries[index].text = textarea.value.trim();
    save();
    closeModal();
    render();
    toast('تم التعديل ✅', 'success');
}

function deleteJournalEntry(index) {
    if (!confirm('حذف هذا الإدخال؟')) return;
    data.journalEntries.splice(index, 1);
    save();
    render();
}

// =============================================================
//  SEARCH - ENHANCED WITH DROPDOWN
// =============================================================
function handleSearch(query) {
    // إزالة dropdown قديم
    document.getElementById('search-dropdown')?.remove();

    if (!query || query.trim().length < 2) {
        if (!query || query.trim().length === 0) render();
        return;
    }

    const q = query.toLowerCase().trim();
    const results = [];

    // بحث في الخطط
    data.plans.forEach(plan => {
        if (plan.name.toLowerCase().includes(q)) {
            results.push({ icon: plan.icon, text: plan.name, type: 'خطة', action: `navigateToPlan('${plan.id}')` });
        }
        plan.groups.forEach(group => {
            if (group.name.toLowerCase().includes(q)) {
                results.push({ icon: '📂', text: group.name, type: plan.name, action: `navigateToPlan('${plan.id}')` });
            }
            group.tasks.forEach(task => {
                if (task.name.toLowerCase().includes(q)) {
                    results.push({ icon: '📌', text: task.name, type: `${plan.icon} ${plan.name}`, action: `navigateToPlan('${plan.id}')` });
                }
                (task.subs || []).forEach(sub => {
                    if (sub.name.toLowerCase().includes(q)) {
                        results.push({ icon: '📝', text: sub.name, type: task.name, action: `navigateToPlan('${plan.id}')` });
                    }
                });
            });
        });
    });

    // بحث في المشاريع
    data.projects.forEach(proj => {
        if (proj.name.toLowerCase().includes(q)) {
            results.push({ icon: proj.icon, text: proj.name, type: 'مشروع', action: `navigateToProject('${proj.id}')` });
        }
        proj.phases.forEach(ph => {
            if (ph.name.toLowerCase().includes(q)) {
                results.push({ icon: '⚙️', text: ph.name, type: proj.name, action: `navigateToProject('${proj.id}')` });
            }
        });
    });

    // بحث في المصادر
    data.resources.forEach(group => {
        group.items.forEach(item => {
            if (item.text.toLowerCase().includes(q)) {
                results.push({ icon: '🔗', text: item.text, type: group.name, action: `navigate('resources')` });
            }
        });
    });

    // بحث في اليوميات
    (data.journalEntries || []).forEach(entry => {
        if (entry.text.toLowerCase().includes(q)) {
            const preview = entry.text.substring(0, 60) + (entry.text.length > 60 ? '...' : '');
            results.push({
                icon: '📝',
                text: preview,
                type: new Date(entry.date).toLocaleDateString('ar-EG', { month: 'short', day: 'numeric' }),
                action: `navigate('journal')`
            });
        }
    });

    showSearchDropdown(results, query);
}

function showSearchDropdown(results, query) {
    const container = document.querySelector('.topbar-search');
    if (!container) return;

    let dropdown = document.getElementById('search-dropdown');
    if (!dropdown) {
        dropdown = document.createElement('div');
        dropdown.id = 'search-dropdown';
        dropdown.className = 'search-dropdown';
        container.appendChild(dropdown);
    }

    if (results.length === 0) {
        dropdown.innerHTML = `<div class="search-empty">لا توجد نتائج لـ "${query}"</div>`;
        return;
    }

    dropdown.innerHTML = `
        <div class="search-count">${results.length} نتيجة</div>
        ${results.slice(0, 10).map(r => `
            <div class="search-item" onclick="${r.action};document.getElementById('search-dropdown')?.remove();document.getElementById('search-input').value='';">
                <span class="search-item-icon">${r.icon}</span>
                <div class="search-item-info">
                    <div class="search-item-text">${highlightMatch(r.text, query)}</div>
                    <div class="search-item-type">${r.type}</div>
                </div>
            </div>
        `).join('')}
        ${results.length > 10 ? `<div class="search-more">+ ${results.length - 10} نتيجة أخرى</div>` : ''}
    `;
}

function highlightMatch(text, query) {
    try {
        const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`(${escaped})`, 'gi');
        return text.replace(regex, '<mark>\$1</mark>');
    } catch {
        return text;
    }
}

// Close search dropdown on click outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.topbar-search')) {
        document.getElementById('search-dropdown')?.remove();
    }
});

// =============================================================
//  MODAL
// =============================================================
function openModal(title, bodyHtml) {
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-body').innerHTML = bodyHtml;
    document.getElementById('modal-backdrop').classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    document.getElementById('modal-backdrop').classList.remove('open');
    document.body.style.overflow = '';
}

// =============================================================
//  TOAST NOTIFICATIONS
// =============================================================
function toast(msg, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const el = document.createElement('div');
    el.className = `toast toast-${type}`;
    el.textContent = msg;
    container.appendChild(el);

    // إزالة بعد 3.5 ثانية
    setTimeout(() => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(-10px)';
        setTimeout(() => el.remove(), 300);
    }, 3200);
}

// =============================================================
//  EXPORT / IMPORT (Enhanced)
// =============================================================
function exportData() {
    const exportObj = {
        ...data,
        _exportDate: new Date().toISOString(),
        _version: '3.0',
        _app: 'Learning Journey'
    };

    const blob = new Blob([JSON.stringify(exportObj, null, 2)], { type: 'application/json' });
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

                openModal('📥 استيراد البيانات', `
                    <p style="margin-bottom:1rem;color:var(--text-secondary)">
                        ملف: <strong>${file.name}</strong><br>
                        خطط: ${imported.plans?.length || 0} | مشاريع: ${imported.projects?.length || 0} | يوميات: ${imported.journalEntries?.length || 0}
                    </p>
                    <div style="display:flex;gap:0.5rem;flex-wrap:wrap">
                        <button class="btn btn-primary" onclick="doImport('replace')">
                            🔄 استبدال الكل
                        </button>
                        <button class="btn btn-success" onclick="doImport('merge')">
                            🔀 دمج مع الحالي
                        </button>
                        <button class="btn btn-ghost" onclick="closeModal()">إلغاء</button>
                    </div>
                `);

                // حفظ مؤقت للملف المستورد
                window._importedData = imported;

            } catch {
                toast('ملف غير صالح ❌', 'error');
            }
        };
        reader.readAsText(file);
    };
    input.click();
}

function doImport(mode) {
    const imported = window._importedData;
    if (!imported) return;

    if (mode === 'replace') {
        data = imported;
        ensureDataFields();
    } else if (mode === 'merge') {
        data = SyncEngine.mergeData(data, imported);
        ensureDataFields();
    }

    save();
    closeModal();
    render();
    toast(`تم الاستيراد (${mode === 'replace' ? 'استبدال' : 'دمج'}) ✅`, 'success');
    delete window._importedData;
}

// =============================================================
//  WEEKLY GOALS
// =============================================================
function renderWeeklyGoals() {
    const goals = data.weeklyGoals || getDefaultWeeklyGoals();
    const progress = calculateWeeklyProgress();

    return `
        <div class="card weekly-goals">
            <div class="card-title" style="cursor:pointer" onclick="editWeeklyGoals()">
                🎯 أهداف الأسبوع
                <span style="font-size:0.75rem;color:var(--primary);margin-right:0.5rem">✏️ تعديل</span>
            </div>
            ${goals.map((goal, i) => {
                const current = progress[i] || 0;
                const pct = Math.min(100, Math.round((current / goal.target) * 100));
                const isDone = current >= goal.target;
                return `
                    <div style="margin-bottom:0.6rem">
                        <div style="display:flex;justify-content:space-between;font-size:0.82rem;margin-bottom:0.2rem">
                            <span>${goal.icon} ${goal.name} ${isDone ? '✅' : ''}</span>
                            <span style="color:${isDone ? 'var(--success)' : 'var(--text-secondary)'}">${current}/${goal.target}</span>
                        </div>
                        <div class="progress-track" style="height:6px">
                            <div class="progress-fill ${isDone ? 'fill-success' : 'fill-primary'}" style="width:${pct}%"></div>
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

function getDefaultWeeklyGoals() {
    return [
        { icon: '📖', name: 'مهام مكتملة', target: 5 },
        { icon: '🍅', name: 'جلسات بومودورو', target: 10 },
        { icon: '📝', name: 'يوميات', target: 5 },
        { icon: '⏱️', name: 'دقائق تعلم', target: 300 }
    ];
}

function calculateWeeklyProgress() {
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const weekStartStr = weekStart.toISOString().split('T')[0];

    // حساب المهام المكتملة هذا الأسبوع (تقريبي - بناءً على الحالة الحالية)
    let completedTasks = 0;
    data.plans.forEach(p => p.groups.forEach(g => g.tasks.forEach(t => {
        if (t.status === 'done') completedTasks++;
    })));

    // جلسات بومودورو هذا الأسبوع
    let weeklyMinutes = 0;
    Object.entries(data.pomodoroLog || {}).forEach(([date, mins]) => {
        if (date >= weekStartStr) weeklyMinutes += mins;
    });
    const sessions = Math.round(weeklyMinutes / 25);

    // يوميات هذا الأسبوع
    const weeklyJournals = (data.journalEntries || []).filter(e =>
        e.date >= weekStartStr
    ).length;

    return [completedTasks, sessions, weeklyJournals, Math.round(weeklyMinutes)];
}

function editWeeklyGoals() {
    const goals = data.weeklyGoals || getDefaultWeeklyGoals();

    openModal('🎯 تعديل أهداف الأسبوع', `
        ${goals.map((g, i) => `
            <div style="display:flex;gap:0.5rem;align-items:center;margin-bottom:0.5rem">
                <span style="font-size:1.1rem">${g.icon}</span>
                <input type="text" class="input-field" value="${g.name}" id="goal-name-${i}" style="flex:1">
                <input type="number" class="input-field" value="${g.target}" id="goal-target-${i}" style="width:80px" min="1">
            </div>
        `).join('')}
        <div style="display:flex;gap:0.5rem;margin-top:1rem">
            <button class="btn btn-primary" onclick="saveWeeklyGoals()">حفظ</button>
            <button class="btn btn-ghost" onclick="closeModal()">إلغاء</button>
        </div>
    `);
}

function saveWeeklyGoals() {
    const goals = (data.weeklyGoals || getDefaultWeeklyGoals()).map((g, i) => {
        const nameInput = document.getElementById(`goal-name-${i}`);
        const targetInput = document.getElementById(`goal-target-${i}`);
        return {
            icon: g.icon,
            name: nameInput?.value || g.name,
            target: parseInt(targetInput?.value) || g.target
        };
    });

    data.weeklyGoals = goals;
    save();
    closeModal();
    render();
    toast('تم حفظ الأهداف ✅', 'success');
}

// =============================================================
//  NOTIFICATION SYSTEM
// =============================================================
const NotificationSystem = {
    init() {
        if ('Notification' in window && Notification.permission === 'default') {
            // سنطلب الإذن عند أول تفاعل
            document.addEventListener('click', function askPermission() {
                Notification.requestPermission();
                document.removeEventListener('click', askPermission);
            }, { once: true });
        }

        // تذكير مسائي
        this.scheduleReminder();
    },

    scheduleReminder() {
        setInterval(() => {
            const hour = new Date().getHours();
            const today = new Date().toISOString().split('T')[0];

            // تذكير الساعة 8 مساءً إذا لم يتعلم اليوم
            if (hour === 20 && data.lastActive !== today) {
                this.send('🎯 رحلة التعلم', 'لم تسجل أي تقدم اليوم! هيا نتعلم شيئاً جديداً 💪');
            }

            // تذكير بالمهام المتأخرة
            if (hour === 9) {
                const overdue = getOverdueTasks();
                if (overdue.length > 0) {
                    this.send('⏰ مهام متأخرة', `لديك ${overdue.length} مهمة متأخرة!`);
                }
                            }
        }, 3600000); // كل ساعة
    },

    send(title, body) {
        if ('Notification' in window && Notification.permission === 'granted') {
            try {
                new Notification(title, {
                    body,
                    icon: '🎯',
                    badge: '🎯',
                    tag: 'learning-journey',
                    renotify: true
                });
            } catch (e) {
                console.warn('Notification failed:', e);
            }
        }
    }
};

// =============================================================
//  KEYBOARD SHORTCUTS (Enhanced)
// =============================================================
const KeyboardShortcuts = {
    init() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + S = حفظ
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                save();
                toast('تم الحفظ 💾', 'success');
                return;
            }

            // Ctrl/Cmd + K = بحث
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                const searchInput = document.getElementById('search-input');
                if (searchInput) {
                    searchInput.focus();
                    searchInput.select();
                }
                return;
            }

            // Escape = إغلاق modal أو dropdown
            if (e.key === 'Escape') {
                const dropdown = document.getElementById('search-dropdown');
                if (dropdown) {
                    dropdown.remove();
                    return;
                }
                if (document.getElementById('modal-backdrop').classList.contains('open')) {
                    closeModal();
                    return;
                }
                // إغلاق sidebar على الموبايل
                document.getElementById('sidebar').classList.remove('open');
                return;
            }

            // Alt + 1-9 = تنقل سريع
            if (e.altKey && e.key >= '1' && e.key <= '9') {
                e.preventDefault();
                const num = parseInt(e.key);
                this.quickNavigate(num);
                return;
            }

            // Alt + D = Dashboard
            if (e.altKey && e.key === 'd') {
                e.preventDefault();
                navigate('dashboard');
                return;
            }

            // Alt + P = بومودورو بدء/إيقاف
            if (e.altKey && e.key === 'p') {
                e.preventDefault();
                if (Pomodoro.running) {
                    Pomodoro.pause();
                } else {
                    Pomodoro.start();
                }
                return;
            }

            // Alt + J = اليوميات
            if (e.altKey && e.key === 'j') {
                e.preventDefault();
                navigate('journal');
                return;
            }

            // Alt + C = التقويم
            if (e.altKey && e.key === 'c') {
                e.preventDefault();
                navigate('calendar');
                return;
            }

            // Alt + N = خطة جديدة
            if (e.altKey && e.key === 'n') {
                e.preventDefault();
                addNewPlan();
                return;
            }

            // ? = عرض الاختصارات
            if (e.key === '?' && !e.target.matches('input, textarea')) {
                e.preventDefault();
                this.showHelp();
                return;
            }
        });
    },

    quickNavigate(num) {
        // 1 = Dashboard, 2-5 = خطط, 6-8 = مشاريع, 9 = إعدادات
        if (num === 1) {
            navigate('dashboard');
        } else if (num >= 2 && num <= 2 + data.plans.length - 1) {
            const plan = data.plans[num - 2];
            if (plan) navigateToPlan(plan.id);
        } else if (num === 9) {
            openSettings();
        }
    },

    showHelp() {
        openModal('⌨️ اختصارات لوحة المفاتيح', `
            <div class="shortcuts-list">
                <div class="shortcut-group">
                    <h4>عام</h4>
                    <div class="shortcut-item">
                        <kbd>Ctrl</kbd> + <kbd>S</kbd>
                        <span>حفظ</span>
                    </div>
                    <div class="shortcut-item">
                        <kbd>Ctrl</kbd> + <kbd>K</kbd>
                        <span>بحث</span>
                    </div>
                    <div class="shortcut-item">
                        <kbd>Esc</kbd>
                        <span>إغلاق النافذة/القائمة</span>
                    </div>
                    <div class="shortcut-item">
                        <kbd>?</kbd>
                        <span>عرض الاختصارات</span>
                    </div>
                </div>
                <div class="shortcut-group">
                    <h4>تنقل</h4>
                    <div class="shortcut-item">
                        <kbd>Alt</kbd> + <kbd>D</kbd>
                        <span>لوحة التحكم</span>
                    </div>
                    <div class="shortcut-item">
                        <kbd>Alt</kbd> + <kbd>J</kbd>
                        <span>اليوميات</span>
                    </div>
                    <div class="shortcut-item">
                        <kbd>Alt</kbd> + <kbd>C</kbd>
                        <span>التقويم</span>
                    </div>
                    <div class="shortcut-item">
                        <kbd>Alt</kbd> + <kbd>N</kbd>
                        <span>خطة جديدة</span>
                    </div>
                    <div class="shortcut-item">
                        <kbd>Alt</kbd> + <kbd>1-9</kbd>
                        <span>تنقل سريع بين الأقسام</span>
                    </div>
                </div>
                <div class="shortcut-group">
                    <h4>بومودورو</h4>
                    <div class="shortcut-item">
                        <kbd>Alt</kbd> + <kbd>P</kbd>
                        <span>بدء/إيقاف المؤقت</span>
                    </div>
                </div>
            </div>
        `);
    }
};

// =============================================================
//  INITIALIZATION
// =============================================================
async function initApp() {
    console.log('🎯 Learning Journey v3.0 - Initializing...');

    // تحميل البيانات
    await load();
    applyTheme();
    updateStreak();

    // تهيئة الأنظمة الفرعية
    OfflineQueue.init();
    NotificationSystem.init();
    KeyboardShortcuts.init();
    AutoBackup.run();

    // فحص الإعداد
    const config = SyncEngine.getConfig();

    if (!config) {
        document.getElementById('setup-screen').style.display = 'flex';
        document.getElementById('app').style.display = 'none';
    } else {
        startApp();
    }

    // تحديث حالة المزامنة
    if (!navigator.onLine) {
        SyncEngine.updateSyncStatus('offline');
    } else if (SyncEngine.isConfigured()) {
        SyncEngine.updateSyncStatus('synced');
    } else {
        SyncEngine.updateSyncStatus('local');
    }

    // حفظ تلقائي كل 30 ثانية
    setInterval(() => {
        if (data) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        }
    }, 30000);

    // مزامنة من GitHub كل 5 دقائق
    setInterval(async () => {
        if (SyncEngine.isConfigured() && navigator.onLine) {
            try {
                const remote = await SyncEngine.loadFromGitHub();
                if (remote && remote.lastSync && remote.lastSync !== data.lastSync) {
                    // بيانات جديدة من جهاز آخر
                    const merged = SyncEngine.mergeData(data, remote);
                    data = merged;
                    ensureDataFields();
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
                    render();
                    toast('تم تحديث البيانات من جهاز آخر 🔄', 'info');
                }
            } catch (e) {
                console.warn('Background sync failed:', e);
            }
        }
    }, 300000); // 5 دقائق

    // فحص الإنجازات عند التحميل
    setTimeout(() => {
        if (data && data.plans) {
            Achievements.checkAndNotify();
        }
    }, 2000);

    console.log('✅ App initialized successfully');
}

// =============================================================
//  START
// =============================================================
initApp();
