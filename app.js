/* ============================================================= */
/*                         DATA                                  */
/* ============================================================= */
const STORAGE_KEY = 'journey_app_v3';
const DEFAULT = {
    plans:[
        {id:'p1',name:'علم البيانات - مبتدئ إلى متوسط',icon:'📊',groups:[
            {id:'g1',name:'الشهر 1: تقوية الأساسيات',collapsed:false,tasks:[
                {id:'t1',name:'Python المتقدم - OOP',status:'pending',date:'',subs:[]},
                {id:'t2',name:'Decorators & Generators',status:'pending',date:'',subs:[]},
                {id:'t3',name:'File I/O - PyMuPDF, pandas',status:'pending',date:'',subs:[]},
                {id:'t4',name:'SQL المتقدم - Window Functions',status:'pending',date:'',subs:[]},
                {id:'t5',name:'Statistics & Hypothesis Testing',status:'pending',date:'',subs:[]},
            ]},
            {id:'g2',name:'الشهر 2: Machine Learning',collapsed:true,tasks:[
                {id:'t6',name:'Scikit-learn أساسيات',status:'pending',date:'',subs:[]},
                {id:'t7',name:'Regression & Trees & SVM',status:'pending',date:'',subs:[]},
                {id:'t8',name:'Cross Validation & Tuning',status:'pending',date:'',subs:[]},
                {id:'t9',name:'Feature Engineering',status:'pending',date:'',subs:[]},
            ]},
            {id:'g3',name:'الشهر 3: Git + Docker + مشروع',collapsed:true,tasks:[
                {id:'t10',name:'Git & GitHub',status:'pending',date:'',subs:[]},
                {id:'t11',name:'Docker & Compose',status:'pending',date:'',subs:[]},
                {id:'t12',name:'Flask API',status:'pending',date:'',subs:[]},
                {id:'t13',name:'🎯 مشروع ML كامل',status:'pending',date:'',subs:[]},
            ]},
        ]},
        {id:'p2',name:'Deep Learning + NLP + RAG',icon:'🤖',groups:[
            {id:'g4',name:'الشهر 4: Deep Learning',collapsed:true,tasks:[
                {id:'t14',name:'PyTorch أساسيات',status:'pending',date:'',subs:[]},
                {id:'t15',name:'CNNs & Transfer Learning',status:'pending',date:'',subs:[]},
                {id:'t16',name:'RNN & LSTM',status:'pending',date:'',subs:[]},
                {id:'t17',name:'NLP & Transformers & HuggingFace',status:'pending',date:'',subs:[]},
            ]},
            {id:'g5',name:'الشهر 5: مشروع Mini RAG 🎯',collapsed:true,tasks:[
                {id:'t18',name:'RAG Architecture + Embeddings',status:'pending',date:'',subs:[]},
                {id:'t19',name:'Vector DB + LangChain + Ollama',status:'pending',date:'',subs:[]},
                {id:'t20',name:'OCR + Streamlit + Docker',status:'pending',date:'',subs:[]},
            ]},
        ]},
        {id:'p3',name:'هندسة البيانات',icon:'🔧',groups:[
            {id:'g6',name:'الشهر 6: PySpark + ETL',collapsed:true,tasks:[
                {id:'t21',name:'PySpark DataFrames & SQL',status:'pending',date:'',subs:[]},
                {id:'t22',name:'ETL + Airflow + PostgreSQL',status:'pending',date:'',subs:[]},
            ]},
            {id:'g7',name:'Kafka Streaming',collapsed:true,tasks:[
                {id:'t23',name:'Kafka Architecture',status:'pending',date:'',subs:[]},
                {id:'t24',name:'Spark Streaming',status:'pending',date:'',subs:[]},
            ]},
        ]},
        {id:'p4',name:'رحلة الماستر - Data Drift',icon:'🎓',groups:[
            {id:'g8',name:'الأساسيات البحثية',collapsed:true,tasks:[
                {id:'t25',name:'Research Methodology + LaTeX',status:'pending',date:'',subs:[]},
                {id:'t26',name:'قراءة: Survey on Concept Drift',status:'pending',date:'',subs:[]},
                {id:'t27',name:'River Library - ADWIN, DDM',status:'pending',date:'',subs:[]},
            ]},
            {id:'g9',name:'التعمق + المشروع',collapsed:true,tasks:[
                {id:'t28',name:'الأوراق البحثية الأساسية',status:'pending',date:'',subs:[]},
                {id:'t29',name:'Online Learning Algorithms',status:'pending',date:'',subs:[]},
                {id:'t30',name:'🎯 مشروع Data Drift System',status:'pending',date:'',subs:[]},
            ]},
            {id:'g10',name:'البحث والكتابة',collapsed:true,tasks:[
                {id:'t31',name:'Literature Review',status:'pending',date:'',subs:[]},
                {id:'t32',name:'Research Proposal',status:'pending',date:'',subs:[]},
                {id:'t33',name:'تقديم رسمي للماستر',status:'pending',date:'',subs:[]},
            ]},
        ]},
    ],
    projects:[
        {id:'pr1',name:'ML Pipeline',icon:'🔬',phases:[
            {id:'ph1',name:'جمع وتنظيف البيانات',status:'pending'},
            {id:'ph2',name:'EDA + Feature Engineering',status:'pending'},
            {id:'ph3',name:'بناء النموذج + Flask API',status:'pending'},
            {id:'ph4',name:'Docker + GitHub',status:'pending'},
        ]},
        {id:'pr2',name:'Mini RAG System',icon:'🤖',phases:[
            {id:'ph5',name:'Document Loader + Chunking',status:'pending'},
            {id:'ph6',name:'Embedding + Vector Store',status:'pending'},
            {id:'ph7',name:'OCR + Streamlit',status:'pending'},
            {id:'ph8',name:'Docker + Docs',status:'pending'},
        ]},
        {id:'pr3',name:'Data Drift Detection',icon:'📊',phases:[
            {id:'ph9',name:'Architecture Design',status:'pending'},
            {id:'ph10',name:'Drift Detection Module',status:'pending'},
            {id:'ph11',name:'Dashboard + API',status:'pending'},
            {id:'ph12',name:'Docker Deploy',status:'pending'},
        ]},
    ],
    resources:[
        {id:'rs1',name:'Stanford LLM Lectures',items:[
            {id:'r1',text:'Lecture 1 - Transformer',url:'https://lnkd.in/dGnQW39t',done:false},
            {id:'r2',text:'Lecture 2 - Models',url:'https://lnkd.in/dT_VEpVH',done:false},
            {id:'r3',text:'Lecture 3 - LLMs',url:'https://lnkd.in/dwjjpjaP',done:false},
            {id:'r4',text:'Lecture 4 - Training',url:'https://lnkd.in/dSi_xCEN',done:false},
            {id:'r5',text:'Lecture 5 - Tuning',url:'https://lnkd.in/dUK5djpB',done:false},
            {id:'r6',text:'Lecture 6 - Reasoning',url:'https://lnkd.in/dAGQTNAM',done:false},
            {id:'r7',text:'Lecture 7 - Agentic',url:'https://lnkd.in/dWD4j7vm',done:false},
            {id:'r8',text:'Lecture 8 - Evaluation',url:'https://lnkd.in/ddxE5zvb',done:false},
            {id:'r9',text:'Lecture 9 - Trends',url:'https://lnkd.in/dGsTd8jN',done:false},
        ]},
        {id:'rs2',name:'أوراق بحثية',items:[
            {id:'r10',text:'Survey on Concept Drift (Gama 2014)',url:'',done:false},
            {id:'r11',text:'ADWIN Algorithm (Bifet 2007)',url:'',done:false},
            {id:'r12',text:'Learning under Concept Drift',url:'',done:false},
        ]},
    ],
    journal:'',journalEntries:[],streak:0,lastActive:null,theme:'dark'
};

let D; // app data
let VIEW = 'dashboard';
let calOff = 0;

/* ============================================================= */
/*                      PERSISTENCE                              */
/* ============================================================= */
async function loadData(){
    try{ D = JSON.parse(localStorage.getItem(STORAGE_KEY)); }catch{ D=null; }
    if(SyncEngine.isConfigured()){
        try{
            const r = await SyncEngine.loadRemote();
            if(r && r.plans){
                if(!D || (r.lastActive||'') >= (D.lastActive||'')){ D=r; localStorage.setItem(STORAGE_KEY,JSON.stringify(D)); }
            }
        }catch(e){ console.warn('Remote load fail:',e); }
    }
    if(!D||!D.plans) D=JSON.parse(JSON.stringify(DEFAULT));
    if(!D.journalEntries) D.journalEntries=[];
    if(!D.resources) D.resources=[];
}

function save(){
    localStorage.setItem(STORAGE_KEY,JSON.stringify(D));
    SyncEngine.debouncedSave(D);
}

function uid(){ return '_'+Math.random().toString(36).substr(2,9); }

/* ============================================================= */
/*                      SETUP                                    */
/* ============================================================= */
async function saveSetup(){
    const u=document.getElementById('setup-username').value.trim();
    const r=document.getElementById('setup-repo').value.trim();
    const t=document.getElementById('setup-token').value.trim();
    if(!u||!r||!t){ toast('أكمل جميع الحقول','error'); return; }
    toast('جاري التحقق...','info');
    const v = await SyncEngine.validate(u,r,t);
    if(!v.ok){ toast(v.msg,'error'); return; }
    SyncEngine.saveConfig({username:u,repo:r,token:t});
    const remote = await SyncEngine.loadRemote();
    if(remote&&remote.plans){ D=remote; localStorage.setItem(STORAGE_KEY,JSON.stringify(D)); toast('تم تحميل البيانات ✅','success'); }
    else{ await SyncEngine.saveRemote(D); toast('تم الإعداد ✅','success'); }
    startApp();
}
function skipSetup(){ SyncEngine.saveConfig({username:'',repo:'',token:''}); startApp(); }
function startApp(){
    document.getElementById('setup-screen').style.display='none';
    document.getElementById('app').style.display='flex';
    renderAll();
}

async function forceSyncNow(){
    if(!SyncEngine.isConfigured()){ toast('المزامنة غير مُعدة','error'); return; }
    toast('جاري المزامنة...','info');
    if(await SyncEngine.saveRemote(D)) toast('تمت المزامنة ✅','success');
    else toast('فشلت المزامنة ❌','error');
}

function openSettings(){
    const c=SyncEngine.getConfig()||{};
    openModal('⚙️ الإعدادات',`
        <div class="setup-form">
            <label>GitHub Username</label><input type="text" id="s-u" value="${c.username||''}">
            <label>Repository</label><input type="text" id="s-r" value="${c.repo||''}">
            <label>Token</label><input type="password" id="s-t" value="${c.token||''}">
            <div style="display:flex;gap:.4rem;margin-top:1rem">
                <button class="btn btn-primary" onclick="doUpdateSettings()">حفظ</button>
                <button class="btn btn-ghost" onclick="closeModal()">إلغاء</button>
                <button class="btn btn-danger" onclick="resetAll()" style="margin-right:auto">حذف الكل</button>
            </div>
            <p style="margin-top:.8rem;font-size:.75rem;color:var(--text-secondary)">
                الحالة: ${c.token?'🟢 متصل':'🔴 محلي فقط'} | آخر نشاط: ${D.lastActive||'لا يوجد'}
            </p>
        </div>
    `);
}
async function doUpdateSettings(){
    const u=document.getElementById('s-u').value.trim(),r=document.getElementById('s-r').value.trim(),t=document.getElementById('s-t').value.trim();
    if(t&&u&&r){ const v=await SyncEngine.validate(u,r,t); if(!v.ok){toast(v.msg,'error');return;} }
    SyncEngine.saveConfig({username:u,repo:r,token:t});
    closeModal();
    if(t){SyncEngine.setStatus('synced');forceSyncNow();}else{SyncEngine.setStatus('local');}
    toast('تم حفظ الإعدادات ✅','success');
}
function resetAll(){
    if(!confirm('حذف كل البيانات؟'))return;
    localStorage.removeItem(STORAGE_KEY);
    D=JSON.parse(JSON.stringify(DEFAULT));save();closeModal();renderAll();
}

/* ============================================================= */
/*                 THEME & STREAK                                */
/* ============================================================= */
function applyTheme(){ document.documentElement.setAttribute('data-theme',D.theme||'dark'); }
function toggleTheme(){ D.theme=D.theme==='dark'?'light':'dark'; applyTheme(); save(); }
function updateStreak(){
    const td=new Date().toISOString().split('T')[0];
    if(D.lastActive===td) return;
    const yd=new Date(Date.now()-864e5).toISOString().split('T')[0];
    D.streak=D.lastActive===yd?D.streak+1:1;
    D.lastActive=td; save();
}

/* ============================================================= */
/*                   NAVIGATION                                  */
/* ============================================================= */
function navigate(v,btn){
    VIEW=v;
    document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active'));
    if(btn) btn.classList.add('active');
    renderAll();
    document.getElementById('sidebar').classList.remove('open');
}
function navPlan(id){ VIEW='plan:'+id; renderAll(); document.getElementById('sidebar').classList.remove('open'); }
function navProj(id){ VIEW='proj:'+id; renderAll(); document.getElementById('sidebar').classList.remove('open'); }
function toggleSidebar(){ document.getElementById('sidebar').classList.toggle('open'); }

/* ============================================================= */
/*                     STATS                                     */
/* ============================================================= */
function stats(){
    let tT=0,dT=0,tS=0,dS=0;
    D.plans.forEach(p=>p.groups.forEach(g=>g.tasks.forEach(t=>{
        tT++;if(t.status==='done')dT++;
        (t.subs||[]).forEach(s=>{tS++;if(s.status==='done')dS++;});
    })));
    let tP=0,dP=0;
    D.projects.forEach(p=>p.phases.forEach(ph=>{tP++;if(ph.status==='done')dP++;}));
    return{tT,dT,tS,dS,tP,dP};
}

/* ============================================================= */
/*                     RENDER                                    */
/* ============================================================= */
function renderAll(){
    buildNav(); updateTopbar();
    const c=document.getElementById('content');
    if(VIEW==='dashboard') renderDash(c);
    else if(VIEW==='calendar') renderCal(c);
    else if(VIEW==='resources') renderRes(c);
    else if(VIEW==='journal') renderJournal(c);
    else if(VIEW.startsWith('plan:')) renderPlan(c,VIEW.split(':')[1]);
    else if(VIEW.startsWith('proj:')) renderProj(c,VIEW.split(':')[1]);
    else renderDash(c);
}

function buildNav(){
    document.getElementById('plans-nav').innerHTML=D.plans.map(p=>`
        <button class="nav-item ${VIEW==='plan:'+p.id?'active':''}" onclick="navPlan('${p.id}')">
            <span class="nav-icon">${p.icon||'📚'}</span><span>${p.name}</span>
        </button>`).join('');
    document.getElementById('projects-nav').innerHTML=D.projects.map(p=>`
        <button class="nav-item ${VIEW==='proj:'+p.id?'active':''}" onclick="navProj('${p.id}')">
            <span class="nav-icon">${p.icon||'🛠️'}</span><span>${p.name}</span>
        </button>`).join('');
}

function updateTopbar(){
    document.getElementById('current-date').textContent=new Date().toLocaleDateString('ar-EG',{weekday:'long',year:'numeric',month:'long',day:'numeric'});
    document.getElementById('streak-badge').textContent='🔥 '+D.streak+' يوم';
}

/* ---- Dashboard ---- */
function renderDash(c){
    const s=stats();
    const pctT=s.tT?Math.round(s.dT/s.tT*100):0;
    const pctP=s.tP?Math.round(s.dP/s.tP*100):0;
    c.innerHTML=`
        <div class="section-header"><h2>📊 لوحة التحكم</h2></div>
        <div class="stats-grid">
            <div class="stat-card"><div class="stat-label">التقدم العام</div><div class="stat-value" style="color:var(--primary)">${pctT}%</div><div class="stat-sub">${s.dT}/${s.tT} موضوع</div><div class="progress-track"><div class="progress-fill fill-primary" style="width:${pctT}%"></div></div></div>
            <div class="stat-card"><div class="stat-label">المشاريع</div><div class="stat-value" style="color:var(--success)">${pctP}%</div><div class="stat-sub">${s.dP}/${s.tP} مرحلة</div><div class="progress-track"><div class="progress-fill fill-success" style="width:${pctP}%"></div></div></div>
            <div class="stat-card"><div class="stat-label">الدروس</div><div class="stat-value" style="color:var(--warning)">${s.dS}</div><div class="stat-sub">من ${s.tS} درس</div><div class="progress-track"><div class="progress-fill fill-warning" style="width:${s.tS?Math.round(s.dS/s.tS*100):0}%"></div></div></div>
            <div class="stat-card"><div class="stat-label">سلسلة الإنجاز</div><div class="stat-value" style="color:var(--warning)">${D.streak}</div><div class="stat-sub">${D.streak>=7?'🔥':'🌱'} يوم متواصل</div></div>
        </div>
        <div class="two-col">
            <div class="card"><div class="card-title">📋 الخطط</div>${D.plans.map(p=>{let t=0,d=0;p.groups.forEach(g=>g.tasks.forEach(tk=>{t++;if(tk.status==='done')d++;}));return`<div class="task" onclick="navPlan('${p.id}')" style="cursor:pointer"><span>${p.icon}</span><span class="task-name">${p.name}</span><span class="badge badge-count">${t?Math.round(d/t*100):0}%</span></div>`;}).join('')}</div>
            <div class="card"><div class="card-title">🛠️ المشاريع</div>${D.projects.map(p=>{const t=p.phases.length,d=p.phases.filter(x=>x.status==='done').length;return`<div class="task" onclick="navProj('${p.id}')" style="cursor:pointer"><span>${p.icon}</span><span class="task-name">${p.name}</span><span class="badge badge-count">${t?Math.round(d/t*100):0}%</span></div>`;}).join('')}</div>
        </div>`;
}

/* ---- Plan View ---- */
function renderPlan(c,id){
    const P=D.plans.find(p=>p.id===id);
    if(!P){renderDash(c);return;}
    let tT=0,dT=0;P.groups.forEach(g=>g.tasks.forEach(t=>{tT++;if(t.status==='done')dT++;}));
    const pct=tT?Math.round(dT/tT*100):0;
    c.innerHTML=`
        <div class="section-header">
            <h2><span>${P.icon}</span> <span onclick="editText('plan-name','${P.id}')" style="cursor:pointer;border-bottom:1px dashed transparent" onmouseover="this.style.borderColor='var(--primary)'" onmouseout="this.style.borderColor='transparent'">${P.name}</span> <span style="font-size:.85rem;color:var(--text-secondary);font-weight:400">${pct}%</span></h2>
            <div style="display:flex;gap:.4rem;flex-wrap:wrap">
                <button class="btn btn-primary btn-sm" onclick="addGroup('${P.id}')">+ مجموعة</button>
                <button class="btn btn-ghost btn-sm" onclick="editIcon('plan','${P.id}')">أيقونة</button>
                <button class="btn btn-ghost btn-sm" style="color:var(--danger)" onclick="delPlan('${P.id}')">حذف</button>
            </div>
        </div>
        <div class="progress-track" style="height:6px;margin-bottom:1.4rem"><div class="progress-fill fill-primary" style="width:${pct}%"></div></div>
        ${P.groups.map(g=>renderGroup(P.id,g)).join('')}`;
}

function renderGroup(pid,G){
    const d=G.tasks.filter(t=>t.status==='done').length,total=G.tasks.length,open=!G.collapsed;
    return`<div class="card">
        <div class="list-header" onclick="toggleGrp('${pid}','${G.id}')">
            <h3><span class="arrow ${open?'open':''}">▶</span> <span onclick="event.stopPropagation();editText('group-name','${pid}','${G.id}')" style="cursor:pointer">${G.name}</span></h3>
            <div class="list-meta"><span>${d}/${total}</span>
                <div class="progress-track" style="width:55px"><div class="progress-fill fill-success" style="width:${total?Math.round(d/total*100):0}%"></div></div>
                <button class="task-btn delete" onclick="event.stopPropagation();delGroup('${pid}','${G.id}')">🗑</button>
            </div>
        </div>
        <div class="list-items ${open?'open':''}">
            ${G.tasks.map(t=>renderTask(pid,G.id,t)).join('')}
            <div class="add-form"><input placeholder="موضوع جديد..." id="in-${G.id}" onkeydown="if(event.key==='Enter')addTask('${pid}','${G.id}')"><button class="btn btn-primary btn-sm" onclick="addTask('${pid}','${G.id}')">+</button></div>
        </div></div>`;
}

function renderTask(pid,gid,T){
    const done=T.status==='done',post=T.status==='postponed';
    const sc=(T.subs||[]).length,sd=(T.subs||[]).filter(s=>s.status==='done').length;
    const overdue=T.date&&new Date(T.date)<new Date()&&!done;
    return`<div class="task">
        <div class="task-check ${done?'done':post?'postponed':''}" onclick="cycleTask('${pid}','${gid}','${T.id}')">${done?'✓':post?'⏸':''}</div>
        <span class="task-name ${done?'done':''}" onclick="editText('task-name','${pid}','${gid}','${T.id}')">${T.name}</span>
        <div class="task-badges">
            ${sc?`<span class="badge badge-count">📝${sd}/${sc}</span>`:''}
            ${T.date?`<span class="badge ${overdue?'badge-overdue':'badge-date'}">${fmtDate(T.date)}</span>`:''}
        </div>
        <div class="task-actions">
            <button class="task-btn" onclick="openSubs('${pid}','${gid}','${T.id}')" title="دروس">📝</button>
            <button class="task-btn" onclick="setDate('${pid}','${gid}','${T.id}')" title="تاريخ">📅</button>
            <button class="task-btn" onclick="postpone('${pid}','${gid}','${T.id}')" title="تأجيل">⏸</button>
            <button class="task-btn delete" onclick="delTask('${pid}','${gid}','${T.id}')">🗑</button>
        </div></div>`;
}

function fmtDate(d){ return d?new Date(d).toLocaleDateString('ar-EG',{month:'short',day:'numeric'}):''; }

/* ---- Task Actions ---- */
function findTask(pid,gid,tid){
    const p=D.plans.find(x=>x.id===pid); if(!p)return{};
    const g=p.groups.find(x=>x.id===gid); if(!g)return{p};
    const t=g.tasks.find(x=>x.id===tid); return{p,g,t};
}

function cycleTask(pid,gid,tid){
    const{t}=findTask(pid,gid,tid); if(!t)return;
        t.status=t.status==='done'?'pending':t.status==='postponed'?'done':'done';
    if(t.status==='done') updateStreak();
    save(); renderAll();
}

function postpone(pid,gid,tid){
    const{t}=findTask(pid,gid,tid); if(!t)return;
    t.status=t.status==='postponed'?'pending':'postponed';
    if(t.date&&t.status==='postponed'){const d=new Date(t.date);d.setDate(d.getDate()+1);t.date=d.toISOString().split('T')[0];}
    save(); renderAll();
}

function setDate(pid,gid,tid){
    const{t}=findTask(pid,gid,tid); if(!t)return;
    openModal('📅 تحديد التاريخ',`
        <p style="margin-bottom:.8rem;color:var(--text-secondary)">${t.name}</p>
        <input type="date" id="date-val" class="input-field" value="${t.date||new Date().toISOString().split('T')[0]}" style="width:100%;padding:.55rem">
        <div style="display:flex;gap:.4rem;margin-top:.8rem">
            <button class="btn btn-primary" onclick="doSetDate('${pid}','${gid}','${tid}')">حفظ</button>
            <button class="btn btn-ghost" onclick="doClearDate('${pid}','${gid}','${tid}')">إزالة</button>
            <button class="btn btn-ghost" onclick="closeModal()">إلغاء</button>
        </div>`);
}
function doSetDate(pid,gid,tid){const{t}=findTask(pid,gid,tid);if(t){t.date=document.getElementById('date-val').value;save();closeModal();renderAll();}}
function doClearDate(pid,gid,tid){const{t}=findTask(pid,gid,tid);if(t){t.date='';save();closeModal();renderAll();}}

function addTask(pid,gid){
    const inp=document.getElementById('in-'+gid); if(!inp||!inp.value.trim())return;
    const p=D.plans.find(x=>x.id===pid),g=p?.groups.find(x=>x.id===gid); if(!g)return;
    g.tasks.push({id:uid(),name:inp.value.trim(),status:'pending',date:'',subs:[]});
    inp.value=''; save(); renderAll();
}

function delTask(pid,gid,tid){
    if(!confirm('حذف هذا الموضوع؟'))return;
    const p=D.plans.find(x=>x.id===pid),g=p?.groups.find(x=>x.id===gid); if(!g)return;
    g.tasks=g.tasks.filter(t=>t.id!==tid); save(); renderAll();
}

/* ---- Sub-tasks (Lessons) ---- */
let curSub=null; // {pid,gid,tid}

function openSubs(pid,gid,tid){
    curSub={pid,gid,tid};
    const{t}=findTask(pid,gid,tid); if(!t)return;
    if(!t.subs) t.subs=[];
    renderSubModal(t);
}

function renderSubModal(t){
    const list=t.subs.length===0
        ?'<p style="color:var(--text-secondary);text-align:center;padding:1.5rem">لا توجد دروس. أضف أول درس!</p>'
        :t.subs.map((s,i)=>`
            <div class="task" style="padding:.4rem .55rem">
                <div class="task-check ${s.status==='done'?'done':''}" onclick="toggleSub(${i})">${s.status==='done'?'✓':''}</div>
                <span class="task-name ${s.status==='done'?'done':''}" onclick="editSub(${i})">${s.name}</span>
                <div class="task-actions" style="opacity:1">
                    <button class="task-btn delete" onclick="delSub(${i})">✕</button>
                </div>
            </div>`).join('');

    openModal('📝 دروس: '+t.name,`
        <div class="add-form">
            <input id="sub-inp" class="input-field" placeholder="أضف درس جديد..." onkeydown="if(event.key==='Enter')addSub()">
            <button class="btn btn-primary btn-sm" onclick="addSub()">+</button>
        </div>
        <div id="subs-list">${list}</div>`);
    setTimeout(()=>document.getElementById('sub-inp')?.focus(),100);
}

function addSub(){
    const inp=document.getElementById('sub-inp'); if(!inp||!inp.value.trim()||!curSub)return;
    const{t}=findTask(curSub.pid,curSub.gid,curSub.tid); if(!t)return;
    if(!t.subs)t.subs=[];
    t.subs.push({name:inp.value.trim(),status:'pending'});
    inp.value=''; save(); renderSubModal(t); renderAll();
}

function toggleSub(i){
    if(!curSub)return;
    const{t}=findTask(curSub.pid,curSub.gid,curSub.tid); if(!t||!t.subs[i])return;
    t.subs[i].status=t.subs[i].status==='done'?'pending':'done';
    if(t.subs[i].status==='done') updateStreak();
    save(); renderSubModal(t); renderAll();
}

function editSub(i){
    if(!curSub)return;
    const{t}=findTask(curSub.pid,curSub.gid,curSub.tid); if(!t||!t.subs[i])return;
    const n=prompt('تعديل:',t.subs[i].name);
    if(n&&n.trim()){t.subs[i].name=n.trim();save();renderSubModal(t);}
}

function delSub(i){
    if(!curSub)return;
    const{t}=findTask(curSub.pid,curSub.gid,curSub.tid); if(!t)return;
    t.subs.splice(i,1); save(); renderSubModal(t); renderAll();
}

/* ---- Group Actions ---- */
function toggleGrp(pid,gid){
    const p=D.plans.find(x=>x.id===pid),g=p?.groups.find(x=>x.id===gid); if(!g)return;
    g.collapsed=!g.collapsed; save(); renderAll();
}

function addGroup(pid){
    const n=prompt('اسم المجموعة الجديدة:'); if(!n||!n.trim())return;
    const p=D.plans.find(x=>x.id===pid); if(!p)return;
    p.groups.push({id:uid(),name:n.trim(),collapsed:false,tasks:[]});
    save(); renderAll();
}

function delGroup(pid,gid){
    if(!confirm('حذف المجموعة وكل محتوياتها؟'))return;
    const p=D.plans.find(x=>x.id===pid); if(!p)return;
    p.groups=p.groups.filter(g=>g.id!==gid); save(); renderAll();
}

/* ---- Plan Actions ---- */
function addNewPlan(){
    const n=prompt('اسم الخطة:'); if(!n||!n.trim())return;
    const ic=prompt('أيقونة (emoji):','📚')||'📚';
    D.plans.push({id:uid(),name:n.trim(),icon:ic,groups:[]});
    save(); navPlan(D.plans[D.plans.length-1].id);
}

function delPlan(id){
    if(!confirm('حذف الخطة بالكامل؟'))return;
    D.plans=D.plans.filter(p=>p.id!==id); save(); VIEW='dashboard'; renderAll();
}

/* ---- Edit Names & Icons ---- */
function editText(type,...args){
    if(type==='plan-name'){
        const p=D.plans.find(x=>x.id===args[0]); if(!p)return;
        const n=prompt('تعديل اسم الخطة:',p.name);
        if(n&&n.trim()){p.name=n.trim();save();renderAll();}
    } else if(type==='group-name'){
        const p=D.plans.find(x=>x.id===args[0]),g=p?.groups.find(x=>x.id===args[1]); if(!g)return;
        const n=prompt('تعديل اسم المجموعة:',g.name);
        if(n&&n.trim()){g.name=n.trim();save();renderAll();}
    } else if(type==='task-name'){
        const{t}=findTask(args[0],args[1],args[2]); if(!t)return;
        const n=prompt('تعديل:',t.name);
        if(n&&n.trim()){t.name=n.trim();save();renderAll();}
    } else if(type==='proj-name'){
        const p=D.projects.find(x=>x.id===args[0]); if(!p)return;
        const n=prompt('تعديل اسم المشروع:',p.name);
        if(n&&n.trim()){p.name=n.trim();save();renderAll();}
    } else if(type==='phase-name'){
        const p=D.projects.find(x=>x.id===args[0]); if(!p||!p.phases[args[1]])return;
        const n=prompt('تعديل:',p.phases[args[1]].name);
        if(n&&n.trim()){p.phases[args[1]].name=n.trim();save();renderAll();}
    } else if(type==='res-group'){
        const n=prompt('تعديل:',D.resources[args[0]].name);
        if(n&&n.trim()){D.resources[args[0]].name=n.trim();save();renderAll();}
    } else if(type==='res-item'){
        const item=D.resources[args[0]].items[args[1]];
        const n=prompt('تعديل:',item.text);
        if(n&&n.trim()){item.text=n.trim(); const u=prompt('رابط:',item.url); if(u!==null)item.url=u.trim(); save();renderAll();}
    }
}

function editIcon(type,id){
    if(type==='plan'){
        const p=D.plans.find(x=>x.id===id); if(!p)return;
        const ic=prompt('أيقونة جديدة:',p.icon); if(ic){p.icon=ic;save();renderAll();}
    } else if(type==='proj'){
        const p=D.projects.find(x=>x.id===id); if(!p)return;
        const ic=prompt('أيقونة جديدة:',p.icon); if(ic){p.icon=ic;save();renderAll();}
    }
}

/* ============================================================= */
/*                   PROJECT VIEW                                */
/* ============================================================= */
function renderProj(c,id){
    const P=D.projects.find(p=>p.id===id);
    if(!P){renderDash(c);return;}
    const total=P.phases.length,done=P.phases.filter(x=>x.status==='done').length;
    const active=P.phases.filter(x=>x.status==='active').length;
    const pct=total?Math.round(done/total*100):0;
    c.innerHTML=`
        <div class="section-header">
            <h2><span>${P.icon}</span> <span onclick="editText('proj-name','${P.id}')" style="cursor:pointer;border-bottom:1px dashed transparent" onmouseover="this.style.borderColor='var(--primary)'" onmouseout="this.style.borderColor='transparent'">${P.name}</span> <span style="font-size:.85rem;color:var(--text-secondary);font-weight:400">${pct}%</span></h2>
            <div style="display:flex;gap:.4rem">
                <button class="btn btn-ghost btn-sm" onclick="editIcon('proj','${P.id}')">أيقونة</button>
                <button class="btn btn-ghost btn-sm" style="color:var(--danger)" onclick="delProj('${P.id}')">حذف</button>
            </div>
        </div>
        <div class="progress-track" style="height:6px;margin-bottom:.4rem"><div class="progress-fill fill-success" style="width:${pct}%"></div></div>
        <div style="color:var(--text-secondary);font-size:.8rem;margin-bottom:1.3rem">✅ ${done} مكتمل | 🔄 ${active} جاري | ⭕ ${total-done-active} متبقي</div>
        <div class="card">
            ${P.phases.map((ph,i)=>`
                <div class="phase-item ${ph.status==='done'?'done':ph.status==='active'?'active':''}">
                    <span>${ph.status==='done'?'✅':ph.status==='active'?'🔄':'⭕'}</span>
                    <span class="task-name ${ph.status==='done'?'done':''}" style="flex:1;cursor:pointer" onclick="editText('phase-name','${P.id}',${i})">${ph.name}</span>
                    <div style="display:flex;gap:.25rem">
                        ${ph.status!=='done'?`
                            <button class="btn btn-success btn-sm" onclick="setPhase('${P.id}',${i},'done')">✓</button>
                            ${ph.status!=='active'?`<button class="btn btn-primary btn-sm" onclick="setPhase('${P.id}',${i},'active')">▶</button>`:''}
                        `:`<button class="btn btn-ghost btn-sm" onclick="setPhase('${P.id}',${i},'pending')">↺</button>`}
                        <button class="task-btn delete" onclick="delPhase('${P.id}',${i})">🗑</button>
                    </div>
                </div>`).join('')}
            <div class="add-form" style="margin-top:.4rem">
                <input placeholder="مرحلة جديدة..." id="ph-in-${P.id}" onkeydown="if(event.key==='Enter')addPhase('${P.id}')">
                <button class="btn btn-primary btn-sm" onclick="addPhase('${P.id}')">+</button>
            </div>
        </div>`;
}

function addNewProject(){
    const n=prompt('اسم المشروع:'); if(!n||!n.trim())return;
    const ic=prompt('أيقونة:','🛠️')||'🛠️';
    D.projects.push({id:uid(),name:n.trim(),icon:ic,phases:[]});
    save(); navProj(D.projects[D.projects.length-1].id);
}
function delProj(id){
    if(!confirm('حذف المشروع؟'))return;
    D.projects=D.projects.filter(p=>p.id!==id); save(); VIEW='dashboard'; renderAll();
}
function setPhase(pid,i,s){
    const p=D.projects.find(x=>x.id===pid); if(!p||!p.phases[i])return;
    p.phases[i].status=s; if(s==='done')updateStreak(); save(); renderAll();
}
function addPhase(pid){
    const inp=document.getElementById('ph-in-'+pid);
    let n='';
    if(inp&&inp.value.trim()){n=inp.value.trim();inp.value='';}
    else{n=prompt('اسم المرحلة:'); if(!n||!n.trim())return; n=n.trim();}
    const p=D.projects.find(x=>x.id===pid); if(!p)return;
    p.phases.push({id:uid(),name:n,status:'pending'}); save(); renderAll();
}
function delPhase(pid,i){
    if(!confirm('حذف المرحلة؟'))return;
    const p=D.projects.find(x=>x.id===pid); if(!p)return;
    p.phases.splice(i,1); save(); renderAll();
}

/* ============================================================= */
/*                      CALENDAR                                 */
/* ============================================================= */
function renderCal(c){
    const today=new Date(), disp=new Date(today.getFullYear(),today.getMonth()+calOff,1);
    const yr=disp.getFullYear(),mo=disp.getMonth();
    const dim=new Date(yr,mo+1,0).getDate(), fd=new Date(yr,mo,1).getDay();
    const mNames=['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];
    const dNames=['أحد','إثنين','ثلاثاء','أربعاء','خميس','جمعة','سبت'];

    // Collect tasks with dates
    const byDate={};
    D.plans.forEach(p=>p.groups.forEach(g=>g.tasks.forEach(t=>{
        if(t.date&&t.status!=='done'){
            if(!byDate[t.date])byDate[t.date]=[];
            byDate[t.date].push(t.name);
        }
    })));

    const todayStr=today.toISOString().split('T')[0];
    let grid=dNames.map(d=>`<div class="cal-day-name">${d}</div>`).join('');
    for(let i=0;i<fd;i++) grid+='<div class="cal-day empty"></div>';
    for(let d=1;d<=dim;d++){
        const ds=`${yr}-${String(mo+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
        const isT=ds===todayStr, tasks=byDate[ds]||[], isOD=ds<todayStr;
        grid+=`<div class="cal-day ${isT?'today':''}">
            <div class="cal-day-num">${d}</div>
            ${tasks.slice(0,2).map(t=>`<div class="cal-event ${isOD?'overdue':''}" title="${t}">${t.substring(0,18)}</div>`).join('')}
            ${tasks.length>2?`<div style="font-size:.58rem;color:var(--text-secondary)">+${tasks.length-2}</div>`:''}
        </div>`;
    }

    // Overdue & upcoming
    const overdue=[],upcoming=[];
    const fut=new Date(today); fut.setDate(fut.getDate()+7); const futStr=fut.toISOString().split('T')[0];
    Object.entries(byDate).forEach(([date,tasks])=>{
        tasks.forEach(t=>{
            if(date<todayStr) overdue.push({name:t,date});
            else if(date<=futStr) upcoming.push({name:t,date});
        });
    });

    c.innerHTML=`
        <div class="section-header"><h2>📅 التقويم</h2></div>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem">
            <button class="btn btn-ghost" onclick="calOff--;renderAll()">◀ السابق</button>
            <h3 style="font-size:1.05rem">${mNames[mo]} ${yr}</h3>
            <button class="btn btn-ghost" onclick="calOff++;renderAll()">التالي ▶</button>
        </div>
        <div class="cal-grid">${grid}</div>
        ${overdue.length?`<div class="card" style="margin-top:1.3rem;border-color:var(--danger)">
            <div class="card-title" style="color:var(--danger)">⏰ متأخرة (${overdue.length})</div>
            ${overdue.map(t=>`<div class="task"><span>⚠️</span><span class="task-name">${t.name}</span><span class="badge badge-overdue">${fmtDate(t.date)}</span></div>`).join('')}
        </div>`:''}
        ${upcoming.length?`<div class="card" style="margin-top:.8rem;border-color:var(--primary)">
            <div class="card-title" style="color:var(--primary)">📋 قادم خلال 7 أيام (${upcoming.length})</div>
            ${upcoming.map(t=>`<div class="task"><span>📌</span><span class="task-name">${t.name}</span><span class="badge badge-date">${fmtDate(t.date)}</span></div>`).join('')}
        </div>`:''}`;
}

/* ============================================================= */
/*                     RESOURCES                                 */
/* ============================================================= */
function renderRes(c){
    c.innerHTML=`
        <div class="section-header"><h2>📖 المصادر</h2>
            <button class="btn btn-primary btn-sm" onclick="addResGroup()">+ مجموعة</button>
        </div>
        ${D.resources.map((g,gi)=>{
            const d=g.items.filter(x=>x.done).length,t=g.items.length;
            return`<div class="card">
                <div class="card-header">
                    <div class="card-title"><span onclick="editText('res-group',${gi})" style="cursor:pointer">${g.name}</span> <span class="badge badge-count">${d}/${t}</span></div>
                    <button class="task-btn delete" onclick="delResGroup(${gi})">🗑</button>
                </div>
                ${g.items.map((item,ii)=>`
                    <div class="resource-item">
                        <input type="checkbox" ${item.done?'checked':''} onchange="toggleRes(${gi},${ii})">
                        <span class="${item.done?'done-text':''}" onclick="editText('res-item',${gi},${ii})" style="cursor:pointer">
                            ${item.url?`<a href="${item.url}" target="_blank" onclick="event.stopPropagation()">${item.text}</a>`:item.text}
                        </span>
                    </div>`).join('')}
                <div class="add-form" style="margin-top:.3rem">
                    <input placeholder="مصدر جديد..." id="ri-${gi}" onkeydown="if(event.key==='Enter')addResItem(${gi})">
                    <input placeholder="رابط (اختياري)" id="ru-${gi}" style="max-width:180px" onkeydown="if(event.key==='Enter')addResItem(${gi})">
                    <button class="btn btn-primary btn-sm" onclick="addResItem(${gi})">+</button>
                </div>
            </div>`;
        }).join('')}
        ${D.resources.length===0?'<div class="empty-state"><div class="icon">📖</div><p>لا توجد مصادر</p></div>':''}`;
}

function addResGroup(){
    const n=prompt('اسم المجموعة:'); if(!n||!n.trim())return;
    D.resources.push({id:uid(),name:n.trim(),items:[]}); save(); renderAll();
}
function delResGroup(i){if(!confirm('حذف؟'))return; D.resources.splice(i,1); save(); renderAll();}
function addResItem(gi){
    const inp=document.getElementById('ri-'+gi),url=document.getElementById('ru-'+gi);
    if(!inp||!inp.value.trim())return;
    D.resources[gi].items.push({id:uid(),text:inp.value.trim(),url:url?.value.trim()||'',done:false});
    inp.value=''; if(url)url.value=''; save(); renderAll();
}
function toggleRes(gi,ii){ D.resources[gi].items[ii].done=!D.resources[gi].items[ii].done; save(); }

/* ============================================================= */
/*                      JOURNAL                                  */
/* ============================================================= */
function renderJournal(c){
    c.innerHTML=`
        <div class="section-header"><h2>📝 اليوميات</h2></div>
        <div class="card">
            <textarea class="journal-textarea" id="j-text" placeholder="اكتب ملاحظاتك...">${D.journal||''}</textarea>
            <div style="display:flex;gap:.4rem;margin-top:.7rem">
                <button class="btn btn-primary" onclick="saveJ()">💾 حفظ</button>
                <button class="btn btn-ghost" onclick="saveJEntry()">📌 حفظ كإدخال</button>
            </div>
        </div>
        <h3 style="margin:1.3rem 0 .6rem;font-size:.95rem">📅 الإدخالات السابقة</h3>
        ${(D.journalEntries||[]).slice().reverse().map((e,i)=>`
            <div class="journal-entry">
                <div class="journal-date">${new Date(e.date).toLocaleDateString('ar-EG',{weekday:'short',month:'long',day:'numeric'})}
                    <button class="task-btn delete" style="float:left" onclick="delJEntry(${D.journalEntries.length-1-i})">✕</button>
                </div>
                <div style="font-size:.86rem;white-space:pre-wrap">${e.text}</div>
            </div>`).join('')}
        ${(!D.journalEntries||!D.journalEntries.length)?'<div class="empty-state" style="padding:1.2rem"><p>لا توجد إدخالات</p></div>':''}`;
}
function saveJ(){const ta=document.getElementById('j-text');if(ta){D.journal=ta.value;save();toast('تم الحفظ ✅','success');}}
function saveJEntry(){
    const ta=document.getElementById('j-text'); if(!ta||!ta.value.trim())return;
    if(!D.journalEntries)D.journalEntries=[];
    D.journalEntries.push({date:new Date().toISOString(),text:ta.value.trim()});
    ta.value='';D.journal=''; save(); renderAll(); toast('تم حفظ الإدخال 📌','success');
}
function delJEntry(i){if(!confirm('حذف؟'))return; D.journalEntries.splice(i,1); save(); renderAll();}

/* ============================================================= */
/*                      SEARCH                                   */
/* ============================================================= */
function handleSearch(q){
    if(!q||!q.trim()){renderAll();return;}
    q=q.toLowerCase().trim();
    const res=[];
    D.plans.forEach(p=>{
        p.groups.forEach(g=>{
            g.tasks.forEach(t=>{
                if(t.name.toLowerCase().includes(q)) res.push({icon:'📚',name:t.name,loc:p.name+' > '+g.name,go:()=>navPlan(p.id)});
                (t.subs||[]).forEach(s=>{
                    if(s.name.toLowerCase().includes(q)) res.push({icon:'📝',name:s.name,loc:t.name,go:()=>navPlan(p.id)});
                });
            });
        });
    });
    D.projects.forEach(p=>p.phases.forEach(ph=>{
        if(ph.name.toLowerCase().includes(q)) res.push({icon:'🛠️',name:ph.name,loc:p.name,go:()=>navProj(p.id)});
    }));
    const c=document.getElementById('content');
    c.innerHTML=`
        <div class="section-header"><h2>🔍 "${q}" (${res.length})</h2>
            <button class="btn btn-ghost" onclick="document.getElementById('search-input').value='';renderAll()">إلغاء</button>
        </div>
        ${!res.length?'<div class="empty-state"><div class="icon">🔍</div><p>لا نتائج</p></div>':''}
        ${res.map(r=>`<div class="task" onclick="(${r.go})()" style="cursor:pointer"><span>${r.icon}</span><span class="task-name">${r.name}</span><span class="badge badge-date">${r.loc}</span></div>`).join('')}`;
}

/* ============================================================= */
/*                  MODAL & TOAST                                */
/* ============================================================= */
function openModal(title,html){
    document.getElementById('modal-title').textContent=title;
    document.getElementById('modal-body').innerHTML=html;
    document.getElementById('modal-backdrop').classList.add('open');
}
function closeModal(){document.getElementById('modal-backdrop').classList.remove('open');curSub=null;}
function toast(msg,type='info'){
    const el=document.createElement('div');
    el.className='toast toast-'+type; el.textContent=msg;
    document.getElementById('toast-container').appendChild(el);
    setTimeout(()=>el.remove(),3200);
}

/* ============================================================= */
/*                  EXPORT / IMPORT                              */
/* ============================================================= */
function exportData(){
    const b=new Blob([JSON.stringify(D,null,2)],{type:'application/json'});
    const a=document.createElement('a');
    a.href=URL.createObjectURL(b);
    a.download=`journey-${new Date().toISOString().split('T')[0]}.json`;
    a.click(); URL.revokeObjectURL(a.href); toast('تم التصدير ✅','success');
}
function importData(){
    const inp=document.createElement('input'); inp.type='file'; inp.accept='.json';
    inp.onchange=e=>{
        const f=e.target.files[0]; if(!f)return;
        const r=new FileReader();
        r.onload=ev=>{
            try{
                const d=JSON.parse(ev.target.result);
                if(!d.plans)throw 0;
                if(confirm('استبدال كل البيانات؟')){D=d;save();renderAll();toast('تم ✅','success');}
            }catch{toast('ملف غير صالح ❌','error');}
        };
        r.readAsText(f);
    };
    inp.click();
}

/* ============================================================= */
/*                      INIT                                     */
/* ============================================================= */
document.addEventListener('keydown',e=>{
    if((e.ctrlKey||e.metaKey)&&e.key==='s'){e.preventDefault();save();toast('💾 تم الحفظ','success');}
    if(e.key==='Escape')closeModal();
});

(async function init(){
    await loadData();
    applyTheme();
    updateStreak();

    const cfg=SyncEngine.getConfig();
    if(!cfg){
        document.getElementById('setup-screen').style.display='flex';
    } else {
        startApp();
    }

    if(SyncEngine.isConfigured()) SyncEngine.setStatus('synced');
    else SyncEngine.setStatus('local');

    // Auto-save every 30s
    setInterval(save,30000);

    // Sync from GitHub every 5min
    setInterval(async()=>{
        if(!SyncEngine.isConfigured())return;
        try{
            const r=await SyncEngine.loadRemote();
            if(r&&(r.lastActive||'')>(D.lastActive||'')){
                D=r; localStorage.setItem(STORAGE_KEY,JSON.stringify(D));
                renderAll(); toast('🔄 تحديث من جهاز آخر','info');
            }
        }catch{}
    },300000);
})();
