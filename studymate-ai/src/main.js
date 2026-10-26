import './style.css';

const STORAGE_KEY = 'studymate-ai-v1';

const translations = {
  bn: {
    brand: 'StudyMate', subtitle: 'তোমার স্মার্ট স্টাডি প্ল্যানার',
    dashboard: 'ড্যাশবোর্ড', addExam: 'পরীক্ষা যোগ করো', subjects: 'বিষয় ও কাজ',
    schedule: 'স্টাডি রুটিন', progress: 'অগ্রগতি', welcome: 'আজ থেকেই প্রস্তুতি শুরু হোক',
    intro: 'পরীক্ষার তারিখ ও পড়ার কাজ যোগ করো। StudyMate তোমার জন্য একটি বাস্তবসম্মত রুটিন সাজাবে।',
    exams: 'পরীক্ষা', tasks: 'মোট কাজ', completed: 'সম্পন্ন', days: 'দিন বাকি',
    addTitle: 'পরীক্ষা ও বিষয় যোগ করো', examName: 'পরীক্ষার নাম', subject: 'বিষয়',
    examDate: 'পরীক্ষার তারিখ', chapters: 'অধ্যায় / পড়ার কাজ',
    chaptersHint: 'প্রতি লাইনে একটি অধ্যায় বা কাজ লিখবে', dailyMinutes: 'প্রতিদিন কত মিনিট পড়বে?',
    add: 'পরীক্ষা যোগ করো', generate: 'রুটিন তৈরি করো', aiGenerate: 'Needle AI দিয়ে কাজ সাজাও',
    routineTitle: 'তোমার স্টাডি রুটিন', noRoutine: 'এখনও কোনো রুটিন নেই। প্রথমে একটি পরীক্ষা যোগ করো।',
    markDone: 'সম্পন্ন', undo: 'আবার করব', delete: 'মুছে ফেলো', empty: 'কোনো পরীক্ষা যোগ করা হয়নি',
    language: 'ভাষা', aiReady: 'AI প্রস্তুত নয়', aiLoading: 'Needle মডেল লোড হচ্ছে… প্রথমবার সময় লাগতে পারে।',
    aiSuccess: 'Needle AI কাজের তালিকা তৈরি করেছে।', aiError: 'AI চালানো যায়নি। সাধারণ রুটিন জেনারেটর ব্যবহার করা হয়েছে।',
    aiHelp: 'AI ফিচার প্রথমবার চালালে মডেল ডাউনলোড হতে পারে। HTTPS বা localhost-এ চালাও।',
    noTasks: 'এই বিষয়ের জন্য কোনো কাজ নেই।', saved: 'তোমার তথ্য এই ব্রাউজারে সেভ হয়েছে।',
    minutes: 'মিনিট', today: 'আজ', upcoming: 'আসন্ন পরীক্ষা', allTasks: 'সব কাজ',
    deleteConfirm: 'এই পরীক্ষা ও এর কাজগুলো মুছে ফেলবে?', footer: 'তোমার পড়াশোনা, তোমার গতিতে।',
    examLabel: 'পরীক্ষা', taskLabel: 'কাজ', dateInvalid: 'পরীক্ষার তারিখ আজকের আগে হতে পারবে না।',
    addTask: 'কাজ যোগ করো', taskPlaceholder: 'নতুন অধ্যায় বা কাজের নাম', addTaskPrompt: 'কাজের নাম লিখো',
    noUpcoming: 'আসন্ন পরীক্ষা নেই', routineNote: 'রুটিনটি পরামর্শ হিসেবে দেওয়া হয়েছে। নিজের সময় অনুযায়ী পরিবর্তন করো।',
    aiInput: 'কী কী পড়তে হবে লিখো', aiPlaceholder: 'যেমন: গণিত পরীক্ষায় ৫টি অধ্যায় আছে, পরীক্ষা ১০ দিন পর…',
    close: 'বন্ধ', reset: 'সব তথ্য মুছুন', resetConfirm: 'সব পরীক্ষা ও কাজ মুছে ফেলবে?',
    todayPlan: 'আজকের পরিকল্পনা', perDay: 'দৈনিক পড়ার সময়', totalProgress: 'সামগ্রিক অগ্রগতি',
    defaultExam: 'নতুন পরীক্ষা', defaultSubject: 'নতুন বিষয়', study: 'পড়াশোনা'
  },
  en: {
    brand: 'StudyMate', subtitle: 'Your smart study planner',
    dashboard: 'Dashboard', addExam: 'Add exam', subjects: 'Subjects & tasks',
    schedule: 'Study routine', progress: 'Progress', welcome: 'Start preparing today',
    intro: 'Add your exam dates and study tasks. StudyMate will arrange a realistic study routine for you.',
    exams: 'Exams', tasks: 'Total tasks', completed: 'Completed', days: 'Days left',
    addTitle: 'Add an exam and subject', examName: 'Exam name', subject: 'Subject',
    examDate: 'Exam date', chapters: 'Chapters / study tasks',
    chaptersHint: 'Write one chapter or task per line', dailyMinutes: 'How many minutes can you study daily?',
    add: 'Add exam', generate: 'Generate routine', aiGenerate: 'Organize tasks with Needle AI',
    routineTitle: 'Your study routine', noRoutine: 'No routine yet. Add an exam first.',
    markDone: 'Complete', undo: 'Undo', delete: 'Delete', empty: 'No exams added yet',
    language: 'Language', aiReady: 'AI not loaded', aiLoading: 'Loading Needle model… first load may take a while.',
    aiSuccess: 'Needle AI created a task list.', aiError: 'AI could not run. The regular planner was used.',
    aiHelp: 'The first AI request may download the model. Use HTTPS or localhost.',
    noTasks: 'No tasks for this subject.', saved: 'Your data is saved in this browser.',
    minutes: 'minutes', today: 'Today', upcoming: 'Upcoming exams', allTasks: 'All tasks',
    deleteConfirm: 'Delete this exam and its tasks?', footer: 'Your learning, at your pace.',
    examLabel: 'Exam', taskLabel: 'Task', dateInvalid: 'Exam date cannot be in the past.',
    addTask: 'Add task', taskPlaceholder: 'New chapter or task name', addTaskPrompt: 'Enter a task name',
    noUpcoming: 'No upcoming exams', routineNote: 'This routine is a suggestion. Adjust it to your own schedule.',
    aiInput: 'Describe what you need to study', aiPlaceholder: 'Example: My math exam is in 10 days and has 5 chapters…',
    close: 'Close', reset: 'Clear all data', resetConfirm: 'Delete all exams and tasks?',
    todayPlan: "Today's plan", perDay: 'Daily study time', totalProgress: 'Overall progress',
    defaultExam: 'New exam', defaultSubject: 'New subject', study: 'Study'
  }
};

let state = loadState();
let currentLanguage = state.language || 'bn';
let activeTab = 'dashboard';
let needleInstance = null;
let needleReady = false;

function loadState() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (parsed && Array.isArray(parsed.exams)) return parsed;
  } catch {}
  return { language: 'bn', exams: [] };
}
function saveState() {
  state.language = currentLanguage;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
function t(key) { return translations[currentLanguage][key] || translations.en[key] || key; }
function escapeHtml(value = '') {
  return String(value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
}
function dateOnly(date) {
  const d = new Date(date);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}
function daysUntil(date) {
  return Math.ceil((dateOnly(date) - dateOnly(new Date())) / 86400000);
}
function formatDate(date) {
  return new Intl.DateTimeFormat(currentLanguage === 'bn' ? 'bn-BD' : 'en-GB', { day:'numeric', month:'short', year:'numeric' }).format(new Date(date + 'T00:00:00'));
}
function allTasks() { return state.exams.flatMap(exam => exam.tasks.map(task => ({...task, examId: exam.id, examName: exam.name, subject: exam.subject, examDate: exam.date, dailyMinutes: exam.dailyMinutes}))); }
function progressPercent() {
  const tasks = allTasks();
  return tasks.length ? Math.round(tasks.filter(x => x.done).length / tasks.length * 100) : 0;
}
function render() {
  const tasks = allTasks();
  const done = tasks.filter(x => x.done).length;
  const nearest = [...state.exams].sort((a,b) => a.date.localeCompare(b.date))[0];
  document.documentElement.lang = currentLanguage;
  document.getElementById('app').innerHTML = `
    <div class="app-shell">
      <aside class="sidebar">
        <div class="brand-mark">✦</div>
        <div class="brand-copy"><strong>${t('brand')}<span> AI</span></strong><small>${t('subtitle')}</small></div>
        <nav class="nav-list">
          ${navButton('dashboard','▦',t('dashboard'))}
          ${navButton('subjects','▤',t('subjects'))}
          ${navButton('schedule','◷',t('schedule'))}
          ${navButton('progress','↗',t('progress'))}
        </nav>
        <div class="sidebar-bottom">
          <div class="local-note"><span class="online-dot"></span><span>${t('saved')}</span></div>
          <button class="reset-link" id="reset-data">${t('reset')}</button>
        </div>
      </aside>
      <main class="main-content">
        <header class="topbar">
          <div class="mobile-brand"><span class="brand-mark small">✦</span><strong>StudyMate <em>AI</em></strong></div>
          <div class="topbar-spacer"></div>
          <label class="language-picker"><span>文</span><select id="language-select" aria-label="${t('language')}">
            <option value="bn" ${currentLanguage==='bn'?'selected':''}>বাংলা</option>
            <option value="en" ${currentLanguage==='en'?'selected':''}>English</option>
          </select></label>
          <div class="avatar">S</div>
        </header>
        <section class="page-intro">
          <div><div class="eyebrow">${t('dashboard')} <span> / </span> STUDYMATE AI</div><h1>${t(activeTab==='dashboard'?'welcome':activeTab==='subjects'?'subjects':activeTab==='schedule'?'routineTitle':'progress')}</h1><p>${t('intro')}</p></div>
          <div class="date-chip"><span>◷</span> ${new Intl.DateTimeFormat(currentLanguage==='bn'?'bn-BD':'en-GB',{weekday:'short',day:'numeric',month:'short'}).format(new Date())}</div>
        </section>
        ${activeTab==='dashboard' ? dashboard(tasks,done,nearest) : activeTab==='subjects' ? subjectsView() : activeTab==='schedule' ? scheduleView() : progressView(tasks,done)}
        <footer>${t('footer')} <span>✦</span></footer>
      </main>
    </div>`;
  bindGlobal();
}
function navButton(id, icon, label) {
  return `<button class="nav-item ${activeTab===id?'active':''}" data-tab="${id}"><span class="nav-icon">${icon}</span><span>${label}</span>${activeTab===id?'<i></i>':''}</button>`;
}
function dashboard(tasks,done,nearest) {
  const todayTasks = tasks.filter(x => !x.done).slice(0,4);
  return `
    <section class="stats-grid">
      ${statCard('▣',t('exams'),state.exams.length,'violet')}
      ${statCard('☷',t('tasks'),tasks.length,'blue')}
      ${statCard('✓',t('completed'),done,'green')}
      ${statCard('◷',t('days'),nearest && daysUntil(nearest.date)>=0?daysUntil(nearest.date):'—','orange')}
    </section>
    <section class="dashboard-grid">
      <div class="panel add-panel">
        <div class="panel-heading"><div><span class="section-kicker">01 / PLAN</span><h2>${t('addTitle')}</h2></div><span class="heading-icon">＋</span></div>
        ${examForm()}
      </div>
      <div class="panel progress-panel">
        <div class="panel-heading"><div><span class="section-kicker">02 / OVERVIEW</span><h2>${t('totalProgress')}</h2></div><span class="heading-icon">↗</span></div>
        <div class="progress-circle" style="--progress:${progressPercent()*3.6}deg"><div><strong>${progressPercent()}%</strong><small>${t('completed')}</small></div></div>
        <div class="progress-meta"><span>${done} ${t('completed').toLowerCase()}</span><span>${tasks.length-done} ${t('tasks').toLowerCase()}</span></div>
        <div class="progress-track"><span style="width:${progressPercent()}%"></span></div>
        <div class="next-exam"><div class="next-icon">⌁</div><div><small>${t('upcoming')}</small><strong>${nearest?escapeHtml(nearest.name):t('noUpcoming')}</strong><span>${nearest?formatDate(nearest.date):''}</span></div><b>${nearest && daysUntil(nearest.date)>=0?daysUntil(nearest.date)+'d':''}</b></div>
      </div>
    </section>
    <section class="panel task-panel">
      <div class="panel-heading"><div><span class="section-kicker">03 / FOCUS</span><h2>${t('todayPlan')}</h2></div><button class="text-button" data-tab="schedule">${t('schedule')} ↗</button></div>
      ${todayTasks.length ? `<div class="task-list">${todayTasks.map(taskRow).join('')}</div>` : `<div class="empty-state"><span>✧</span><strong>${t('noRoutine')}</strong><p>${t('intro')}</p></div>`}
    </section>`;
}
function statCard(icon,label,value,color) {
  return `<div class="stat-card"><div class="stat-top"><span>${label}</span><i class="${color}">${icon}</i></div><strong>${value}</strong><small>${color==='green'?'✦ ':''}${label}</small></div>`;
}
function examForm() {
  const today = new Date(); const minDate = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
  return `<form id="exam-form" class="form-stack">
    <label>${t('examName')}<input name="name" required maxlength="80" placeholder="${t('examName')}" /></label>
    <label>${t('subject')}<input name="subject" required maxlength="80" placeholder="${t('subject')}" /></label>
    <div class="form-row">
      <label>${t('examDate')}<input type="date" name="date" min="${minDate}" required /></label>
      <label>${t('perDay')} (${t('minutes')})<select name="dailyMinutes"><option value="30">30</option><option value="60" selected>60</option><option value="90">90</option><option value="120">120</option><option value="180">180</option></select></label>
    </div>
    <label>${t('chapters')}<textarea name="chapters" rows="4" required placeholder="${t('chaptersHint')}"></textarea><small class="field-hint">${t('chaptersHint')}</small></label>
    <button class="primary-button" type="submit"><span>＋</span> ${t('add')}</button>
    <div class="ai-divider"><span>OPTIONAL AI</span></div>
    <label>${t('aiInput')}<textarea id="ai-text" rows="2" placeholder="${t('aiPlaceholder')}"></textarea></label>
    <button class="secondary-button" type="button" id="ai-organize"><span>✦</span> ${t('aiGenerate')}</button>
    <p class="ai-help" id="ai-status">${t('aiHelp')}</p>
  </form>`;
}
function taskRow(task) {
  return `<div class="task-row ${task.done?'is-done':''}">
    <button class="task-check" data-toggle="${task.id}" aria-label="${task.done?t('undo'):t('markDone')}">${task.done?'✓':''}</button>
    <div class="task-details"><strong>${escapeHtml(task.title)}</strong><span>${escapeHtml(task.subject)} · ${escapeHtml(task.examName)}</span></div>
    <div class="task-time"><span>◷</span> ${task.minutes || 25} ${t('minutes')}</div>
  </div>`;
}
function subjectsView() {
  if (!state.exams.length) return `<div class="panel empty-state"><span>✧</span><strong>${t('empty')}</strong><p>${t('intro')}</p><button class="primary-button" data-tab="dashboard">${t('addExam')}</button></div>`;
  return `<section class="subject-grid">${state.exams.map(exam=>`<article class="panel subject-card">
    <div class="subject-card-top"><div class="subject-symbol">${escapeHtml((exam.subject||'S').slice(0,1).toUpperCase())}</div><button class="icon-button" data-delete="${exam.id}" aria-label="${t('delete')}">⋯</button></div>
    <span class="section-kicker">${t('examLabel').toUpperCase()}</span><h2>${escapeHtml(exam.subject)}</h2><p>${escapeHtml(exam.name)}</p>
    <div class="subject-date">◷ ${formatDate(exam.date)} <b>${Math.max(0,daysUntil(exam.date))}d</b></div>
    <div class="subject-progress"><span>${exam.tasks.filter(x=>x.done).length}/${exam.tasks.length} ${t('tasks').toLowerCase()}</span><div class="progress-track"><span style="width:${exam.tasks.length?exam.tasks.filter(x=>x.done).length/exam.tasks.length*100:0}%"></span></div></div>
    <div class="mini-task-list">${exam.tasks.slice(0,3).map(task=>`<div><span class="${task.done?'mini-check done':'mini-check'}">${task.done?'✓':'·'}</span>${escapeHtml(task.title)}</div>`).join('')}${exam.tasks.length>3?`<small>+${exam.tasks.length-3} more</small>`:''}</div>
    <button class="outline-button full-width" data-show-schedule="${exam.id}">${t('schedule')} ↗</button>
  </article>`).join('')}</section>`;
}
function scheduleView() {
  const tasks = allTasks().sort((a,b)=>a.examDate.localeCompare(b.examDate));
  if (!tasks.length) return `<div class="panel empty-state"><span>◷</span><strong>${t('noRoutine')}</strong><p>${t('routineNote')}</p><button class="primary-button" data-tab="dashboard">${t('addExam')}</button></div>`;
  const grouped = {};
  tasks.forEach(task=>{ (grouped[task.examDate] ||= []).push(task); });
  return `<section class="panel schedule-panel"><div class="panel-heading"><div><span class="section-kicker">WEEKLY PLAN</span><h2>${t('routineTitle')}</h2></div><span class="heading-icon">◷</span></div>
    <p class="muted">${t('routineNote')}</p>
    ${Object.entries(grouped).map(([date,items])=>`<div class="schedule-day"><div class="schedule-date"><span>${formatDate(date)}</span><small>${items.length} ${t('tasks').toLowerCase()}</small></div><div class="task-list">${items.map(taskRow).join('')}</div></div>`).join('')}
  </section>`;
}
function progressView(tasks,done) {
  return `<section class="panel progress-detail"><div class="panel-heading"><div><span class="section-kicker">YOUR CONSISTENCY</span><h2>${t('totalProgress')}</h2></div><span class="heading-icon">↗</span></div>
    <div class="big-progress"><strong>${progressPercent()}%</strong><div class="progress-track"><span style="width:${progressPercent()}%"></span></div><p>${done} ${t('completed').toLowerCase()} / ${tasks.length} ${t('tasks').toLowerCase()}</p></div>
    <div class="progress-subjects">${state.exams.map(exam=>{const p=exam.tasks.length?Math.round(exam.tasks.filter(x=>x.done).length/exam.tasks.length*100):0;return `<div class="progress-subject"><div><strong>${escapeHtml(exam.subject)}</strong><span>${p}%</span></div><div class="progress-track"><span style="width:${p}%"></span></div></div>`}).join('')||`<p>${t('empty')}</p>`}</div>
  </section>`;
}
function bindGlobal() {
  document.querySelectorAll('[data-tab]').forEach(el=>el.addEventListener('click',()=>{activeTab=el.dataset.tab;render();}));
  document.getElementById('language-select')?.addEventListener('change',e=>{currentLanguage=e.target.value;saveState();render();});
  document.getElementById('exam-form')?.addEventListener('submit',onAddExam);
  document.querySelectorAll('[data-toggle]').forEach(el=>el.addEventListener('click',()=>toggleTask(el.dataset.toggle)));
  document.querySelectorAll('[data-delete]').forEach(el=>el.addEventListener('click',()=>deleteExam(el.dataset.delete)));
  document.querySelectorAll('[data-show-schedule]').forEach(el=>el.addEventListener('click',()=>{activeTab='schedule';render();}));
  document.getElementById('ai-organize')?.addEventListener('click',onAIOrganize);
  document.getElementById('reset-data')?.addEventListener('click',()=>{
    if(confirm(t('resetConfirm'))){state.exams=[];saveState();render();}
  });
}
function makeTasks(chapters, examDate, dailyMinutes) {
  const unique = [...new Set(chapters.map(s=>s.trim()).filter(Boolean))];
  return unique.map((title,i)=>({id:crypto.randomUUID(),title,done:false,minutes:Math.max(15,Math.min(60,Math.floor(dailyMinutes/Math.max(1,Math.min(unique.length,3))))),order:i}));
}
function onAddExam(event) {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const name = String(form.get('name')).trim();
  const subject = String(form.get('subject')).trim();
  const date = String(form.get('date'));
  const dailyMinutes = Number(form.get('dailyMinutes')) || 60;
  if(daysUntil(date)<0){alert(t('dateInvalid'));return;}
  const tasks = makeTasks(String(form.get('chapters')).split(/\n/),date,dailyMinutes);
  state.exams.push({id:crypto.randomUUID(),name,subject,date,dailyMinutes,tasks});
  saveState();activeTab='dashboard';render();
}
function toggleTask(id) {
  for(const exam of state.exams){const task=exam.tasks.find(x=>x.id===id);if(task){task.done=!task.done;break;}}
  saveState();render();
}
function deleteExam(id) {
  if(!confirm(t('deleteConfirm')))return;
  state.exams=state.exams.filter(x=>x.id!==id);saveState();render();
}
async function onAIOrganize() {
  const input = document.getElementById('ai-text');
  const status = document.getElementById('ai-status');
  const text = input?.value.trim();
  if(!text){alert(t('addTaskPrompt'));return;}
  status.textContent=t('aiLoading');
  const button=document.getElementById('ai-organize');button.disabled=true;
  try {
    if(!needleInstance) {
      const mod = await import('cactus-needle/browser');
      const { Needle, tool } = mod;
      needleInstance = new Needle({
        tools: {
          extract_study_tasks: tool({
            description: 'Extract study tasks from the student note. Return only tasks explicitly mentioned or directly implied. Do not invent exam dates. Split a list of chapters into individual tasks.',
            inputSchema: {
              type: 'object',
              properties: {
                examName: {type:'string', description:'Exam name if mentioned, otherwise empty string'},
                subject: {type:'string', description:'Subject name if mentioned, otherwise empty string'},
                chapters: {type:'array', items:{type:'string'}, description:'A list of distinct study chapters or tasks'},
                dailyMinutes: {type:'integer', description:'Daily study minutes if mentioned; otherwise 60'}
              },
              required: ['examName','subject','chapters','dailyMinutes']
            }
          })
        }
      });
    }
    const result = await needleInstance.complete(text);
    const call = (result.function_calls || []).find(x=>x.name==='extract_study_tasks');
    if(!call || !Array.isArray(call.arguments?.chapters) || !call.arguments.chapters.length) throw new Error('No structured study tasks returned');
    const args=call.arguments;
    const form=document.getElementById('exam-form');
    form.elements.name.value=args.examName || '';
    form.elements.subject.value=args.subject || '';
    form.elements.chapters.value=args.chapters.join('\n');
    if([30,60,90,120,180].includes(Number(args.dailyMinutes)))form.elements.dailyMinutes.value=String(args.dailyMinutes);
    status.textContent=t('aiSuccess');
  } catch(error) {
    console.error('Needle AI error:',error);
    status.textContent=t('aiError')+' '+t('aiHelp');
    // Fallback: split the student's note into a useful task list without claiming AI ran.
    const chapters=text.split(/[,;\n।]+/).map(s=>s.trim()).filter(s=>s.length>1).slice(0,12);
    const form=document.getElementById('exam-form');
    form.elements.chapters.value=chapters.join('\n');
  } finally {
    button.disabled=false;
  }
}

render();
