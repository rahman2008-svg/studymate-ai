
import './style.css';
import { createNeedle, tool } from 'cactus-needle/browser';

const app = document.querySelector('#app');

function readJSON(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

const tasks = readJSON('sm-tasks', []).map(task => ({
  ...task,
  done: Boolean(task.done)
}));

const today = () => new Date().toLocaleDateString('en-CA');
let selectedDate = today();
let needle = null;
let loadingPromise = null;
let timerSeconds = 25 * 60;
let timerRunning = false;
let timerHandle = null;
let goalMinutes = Number(localStorage.getItem('sm-goal') || 120);
let activeView = 'all';

const savedTheme = localStorage.getItem('sm-theme') || 'dark';
document.documentElement.dataset.theme = savedTheme;

app.innerHTML = `
  <header class="top">
    <a class="brand" href="#" aria-label="StudyMate AI home">📚 StudyMate <span>AI</span></a>
    <div class="top-actions">
      <span class="online-label"><i></i> YOUR LEARNING SPACE</span>
      <button id="themeBtn" class="icon-btn" aria-label="Change theme">☀️</button>
    </div>
  </header>

  <main class="dashboard">
    <section class="welcome">
      <div class="welcome-copy">
        <p class="eyebrow">YOUR PERSONAL LEARNING SPACE</p>
        <h1>পড়াশোনা হোক<br><span>আরও সহজ।</span></h1>
        <p>ছোট ছোট পদক্ষেপ, প্রতিদিন একটু অগ্রগতি। আজকের পড়াশোনা পরিকল্পনা করো, সময় ট্র্যাক করো এবং নিজের লক্ষ্যে এগিয়ে যাও।</p>
      </div>
      <div class="welcome-art" aria-hidden="true">
        <div class="orb">✦</div>
        <div class="art-book">📚</div>
        <div class="art-star star-one">✧</div>
        <div class="art-star star-two">✦</div>
      </div>
    </section>

    <section class="stats-grid" aria-label="Study statistics">
      <article class="stat-card">
        <div class="stat-icon purple">◷</div>
        <p>আজকের পড়ার লক্ষ্য</p>
        <strong id="goalStat">2 ঘণ্টা</strong>
        <small>তোমার দৈনিক লক্ষ্য</small>
      </article>
      <article class="stat-card">
        <div class="stat-icon blue">✓</div>
        <p>সম্পন্ন কাজ</p>
        <strong id="doneStat">0/0</strong>
        <small>আজকের অগ্রগতি</small>
      </article>
      <article class="stat-card">
        <div class="stat-icon cyan">▤</div>
        <p>মোট পড়ার সময়</p>
        <strong id="minutesStat">0 মিনিট</strong>
        <small>তালিকাভুক্ত সময়</small>
      </article>
    </section>

    <section class="panel progress-panel">
      <div class="section-title">
        <div>
          <p class="eyebrow">KEEP MOVING FORWARD</p>
          <h2>আজকের অগ্রগতি</h2>
        </div>
        <strong id="progressPercent">0%</strong>
      </div>
      <div class="progress-track"><div id="progressBar" class="progress-fill"></div></div>
      <p id="progressText" class="muted">শুরু করার জন্য একটি কাজ বেছে নাও।</p>
      <label class="goal-control" for="goalInput">দৈনিক লক্ষ্য (মিনিট)</label>
      <div class="goal-row">
        <input id="goalInput" type="number" min="15" max="720" step="15">
        <button id="saveGoal" class="secondary-btn">লক্ষ্য সংরক্ষণ</button>
      </div>
    </section>

    <div class="content-grid">
      <section class="panel ai-panel">
        <div class="panel-heading">
          <div class="heading-icon">✦</div>
          <div><h2>AI Study Assistant</h2><p class="muted">তোমার পড়ার পরিকল্পনাকে সাজিয়ে নাও</p></div>
        </div>
        <label for="studyInput">আজ কী কী পড়তে হবে?</label>
        <textarea id="studyInput" placeholder="যেমন: আজ গণিত ৩০ মিনিট, ইংরেজি ২০ মিনিট এবং বিজ্ঞান ৪০ মিনিট পড়ব।"></textarea>
        <button id="aiBtn" class="primary-btn">✦ AI দিয়ে সাজাও</button>
        <p id="status" class="status" role="status" aria-live="polite">প্রথমবার মডেল ডাউনলোড হতে পারে।</p>
        <p class="tiny-note">Browser-based AI · কোনো external LLM API নেই</p>
      </section>

      <section class="panel timer-panel">
        <div class="panel-heading">
          <div class="heading-icon">◷</div>
          <div><h2>Study Timer</h2><p class="muted">মনোযোগ দিয়ে পড়ো</p></div>
        </div>
        <div class="timer-ring"><div class="timer-inner"><strong id="timerDisplay">25:00</strong><span>FOCUS SESSION</span></div></div>
        <div class="timer-presets">
          <button data-minutes="15">15 মিনিট</button>
          <button data-minutes="25" class="selected">25 মিনিট</button>
          <button data-minutes="45">45 মিনিট</button>
        </div>
        <div class="timer-actions">
          <button id="timerStart" class="primary-btn">▶ শুরু</button>
          <button id="timerReset" class="secondary-btn">↻ Reset</button>
        </div>
        <p id="timerStatus" class="muted timer-status">প্রস্তুত হলে টাইমার শুরু করো।</p>
      </section>
    </div>

    <section class="panel planner-panel">
      <div class="section-title planner-heading">
        <div><p class="eyebrow">PLAN YOUR DAY</p><h2>📅 Daily Study Planner</h2></div>
        <input id="planDate" type="date" aria-label="পরিকল্পনার তারিখ">
      </div>
      <div class="filter-row">
        <button class="filter-btn selected" data-view="all">সব কাজ</button>
        <button class="filter-btn" data-view="pending">বাকি কাজ</button>
        <button class="filter-btn" data-view="done">সম্পন্ন</button>
      </div>
      <div id="taskList"></div>
      <p id="empty" class="empty-state">এই তারিখে কোনো কাজ নেই। AI Assistant দিয়ে কাজ যোগ করতে পারো।</p>
    </section>

    <section class="panel about-panel">
      <p class="eyebrow">THE CREATOR BEHIND THE PROJECT</p>
      <h2>About Developer</h2>
      <div class="developer-card">
        <div class="developer-avatar">AR</div>
        <div class="developer-info">
          <h3>Prince AR Abdur Rahman</h3>
          <p class="developer-role">Independent App Developer · Creator · Dreamer</p>
          <p>আধুনিক Android অ্যাপ্লিকেশন, productivity tools, AI-powered experiences এবং শিক্ষামূলক ডিজিটাল পণ্য তৈরিতে আগ্রহী একজন স্বাধীন ডেভেলপার।</p>
          <div class="company-chip">🚀 Founder of NexVora Labs</div>
        </div>
      </div>
      <p class="tiny-note">StudyMate AI — Learn a little every day.</p>
    </section>
  </main>

  <footer>Made for curious minds · StudyMate AI <span>💙</span></footer>
`;

const $ = selector => document.querySelector(selector);
const input = $('#studyInput');
const status = $('#status');
const aiBtn = $('#aiBtn');

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;',
    '"': '&quot;', "'": '&#39;'
  })[char]);
}

function taskDate(task) {
  return task.date || today();
}

function persistTasks() {
  localStorage.setItem('sm-tasks', JSON.stringify(tasks));
}

function renderDashboard() {
  const dayTasks = tasks.filter(task => taskDate(task) === today());
  const completed = dayTasks.filter(task => task.done).length;
  const plannedMinutes = dayTasks.reduce((sum, task) => sum + (Number(task.minutes) || 0), 0);
  const percent = dayTasks.length ? Math.round(completed / dayTasks.length * 100) : 0;

  $('#goalStat').textContent = goalMinutes >= 60
    ? `${Math.floor(goalMinutes / 60)} ঘণ্টা${goalMinutes % 60 ? ` ${goalMinutes % 60} মি.` : ''}`
    : `${goalMinutes} মিনিট`;
  $('#doneStat').textContent = `${completed}/${dayTasks.length}`;
  $('#minutesStat').textContent = `${plannedMinutes} মিনিট`;
  $('#progressPercent').textContent = `${percent}%`;
  $('#progressBar').style.width = `${percent}%`;
  $('#progressText').textContent = dayTasks.length
    ? `${completed}টি কাজ সম্পন্ন, ${dayTasks.length - completed}টি বাকি।`
    : 'আজকের তালিকায় কাজ যোগ করে শুরু করো।';
}

function renderTasks() {
  const list = $('#taskList');
  const dayTasks = tasks
    .map((task, index) => ({ ...task, _index: index }))
    .filter(task => taskDate(task) === selectedDate)
    .filter(task => activeView === 'all' ||
      (activeView === 'done' ? task.done : !task.done));

  $('#empty').hidden = dayTasks.length > 0;

  list.innerHTML = dayTasks.map(task => `
    <article class="task ${task.done ? 'done' : ''}">
      <input type="checkbox" data-done="${task._index}" ${task.done ? 'checked' : ''} aria-label="কাজ সম্পন্ন">
      <div class="task-info">
        <strong>${escapeHtml(task.subject || 'সাধারণ')}</strong>
        <p>${escapeHtml(task.title || 'পড়াশোনা')}</p>
        <small>⏱ ${Number(task.minutes) || 25} মিনিট</small>
      </div>
      <button class="delete" data-delete="${task._index}" aria-label="কাজ মুছুন">×</button>
    </article>
  `).join('');

  list.querySelectorAll('[data-done]').forEach(el => {
    el.addEventListener('change', () => {
      tasks[Number(el.dataset.done)].done = el.checked;
      persistTasks();
      renderTasks();
      renderDashboard();
    });
  });

  list.querySelectorAll('[data-delete]').forEach(el => {
    el.addEventListener('click', () => {
      tasks.splice(Number(el.dataset.delete), 1);
      persistTasks();
      renderTasks();
      renderDashboard();
    });
  });
}

function renderAll() {
  renderTasks();
  renderDashboard();
}

function addTask(subject, title, minutes = 25) {
  tasks.push({
    subject: String(subject || 'সাধারণ'),
    title: String(title || 'পড়াশোনা'),
    minutes: Math.max(5, Math.min(180, Number(minutes) || 25)),
    date: selectedDate,
    done: false
  });
}

function fallbackTasks(text) {
  const lines = text.split(/[\n,;।]+/).map(line => line.trim()).filter(Boolean);
  const subjects = [
    ['গণিত', /গণিত|ম্যাথ|math(?:ematics)?/i],
    ['ইংরেজি', /ইংরেজি|english/i],
    ['বিজ্ঞান', /বিজ্ঞান|science/i],
    ['পদার্থবিজ্ঞান', /পদার্থবিজ্ঞান|physics/i],
    ['রসায়ন', /রসায়ন|রসায়ন|chemistry/i],
    ['জীববিজ্ঞান', /জীববিজ্ঞান|biology/i],
    ['ইতিহাস', /ইতিহাস|history/i],
    ['ভূগোল', /ভূগোল|geography/i],
    ['আইসিটি', /আইসিটি|\bICT\b|computer/i]
  ];
  const result = [];

  for (const line of lines) {
    const subject = subjects.find(([, pattern]) => pattern.test(line));
    if (!subject) continue;

    const match = line.match(/(\d+)\s*(মিনিট|মিনিটের|ঘণ্টা|ঘন্টা|minutes?|mins?|hours?|hrs?)/i);
    let minutes = match ? Number(match[1]) : 25;
    if (match && /ঘণ্টা|ঘন্টা|hours?|hrs?/i.test(match[2])) minutes *= 60;

    result.push({ subject: subject[0], title: line, minutes });
  }
  return result;
}

async function getNeedle() {
  if (needle) return needle;
  if (loadingPromise) return loadingPromise;

  loadingPromise = createNeedle({
    cache: true,
    tools: {
      extract_study_tasks: tool({
        description: 'Extract study tasks from the student text. Preserve Bengali or English. Use the stated subject and duration.',
        inputSchema: {
          type: 'object',
          properties: {
            tasks: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  subject: { type: 'string' },
                  title: { type: 'string' },
                  minutes: { type: 'integer' }
                },
                required: ['subject', 'title', 'minutes']
              }
            }
          },
          required: ['tasks']
        }
      })
    },
    onDownloadProgress({ loaded, total, percentage }) {
      if (Number.isFinite(percentage)) {
        status.textContent = `LLM মডেল ডাউনলোড হচ্ছে: ${Math.round(percentage)}%`;
      } else {
        status.textContent = `মডেল ডাউনলোড হচ্ছে: ${(loaded / 1048576).toFixed(1)} MB${total ? ` / ${(total / 1048576).toFixed(1)} MB` : ''}`;
      }
    }
  }).then(instance => {
    needle = instance;
    return instance;
  }).catch(error => {
    loadingPromise = null;
    throw error;
  });

  return loadingPromise;
}

aiBtn.addEventListener('click', async () => {
  const text = input.value.trim();
  if (!text) {
    status.textContent = 'প্রথমে কী পড়বে তা লিখো।';
    return;
  }

  aiBtn.disabled = true;
  try {
    status.textContent = 'LLM মডেল প্রস্তুত হচ্ছে…';
    const model = await getNeedle();
    status.textContent = 'AI তোমার পড়ার কাজ বিশ্লেষণ করছে…';

    const result = await model.generate({
      prompt: `Extract study tasks from this student text. Keep Bengali or English as written. Do not invent subjects or durations. If duration is missing, use 25 minutes. Call extract_study_tasks with the extracted tasks. Student text: ${text}`
    });

    console.log('Needle result:', result);
    const call = result.toolCalls?.find(item => item.toolName === 'extract_study_tasks');
    let extracted = call?.input?.tasks;

    if (!Array.isArray(extracted) || !extracted.length) {
      extracted = fallbackTasks(text);
    }

    if (!extracted.length) {
      status.textContent = 'কোনো পড়ার কাজ শনাক্ত হয়নি। বিষয় ও সময়সহ লিখে আবার চেষ্টা করো।';
      return;
    }

    extracted.forEach(task => addTask(task.subject, task.title, task.minutes));
    persistTasks();
    input.value = '';
    renderAll();
    status.textContent = `${extracted.length}টি পড়ার কাজ যোগ হয়েছে।`;
  } catch (error) {
    console.error('Needle error:', error);
    status.textContent = `LLM চালু করা যায়নি: ${error?.message || error}`;
  } finally {
    aiBtn.disabled = false;
  }
});

// Theme switch
$('#themeBtn').addEventListener('click', () => {
  const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = next;
  localStorage.setItem('sm-theme', next);
  $('#themeBtn').textContent = next === 'dark' ? '☀️' : '🌙';
});
$('#themeBtn').textContent = savedTheme === 'dark' ? '☀️' : '🌙';

// Date planner and task filters
$('#planDate').value = selectedDate;
$('#planDate').addEventListener('change', event => {
  selectedDate = event.target.value || today();
  renderTasks();
});

document.querySelectorAll('[data-view]').forEach(button => {
  button.addEventListener('click', () => {
    activeView = button.dataset.view;
    document.querySelectorAll('[data-view]').forEach(item => item.classList.toggle('selected', item === button));
    renderTasks();
  });
});

// Daily goal
$('#goalInput').value = goalMinutes;
$('#saveGoal').addEventListener('click', () => {
  const value = Number($('#goalInput').value);
  if (!Number.isFinite(value) || value < 15 || value > 720) {
    $('#progressText').textContent = 'লক্ষ্য ১৫ থেকে ৭২০ মিনিটের মধ্যে দাও।';
    return;
  }
  goalMinutes = value;
  localStorage.setItem('sm-goal', String(goalMinutes));
  renderDashboard();
});

// Study timer
function renderTimer() {
  const minutes = Math.floor(timerSeconds / 60);
  const seconds = timerSeconds % 60;
  $('#timerDisplay').textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function stopTimer() {
  timerRunning = false;
  clearInterval(timerHandle);
  timerHandle = null;
  $('#timerStart').textContent = '▶ আবার শুরু';
}

function startTimer() {
  if (timerRunning) return;
  timerRunning = true;
  $('#timerStart').textContent = 'Ⅱ Pause';
  $('#timerStatus').textContent = 'মনোযোগ দিয়ে পড়তে থাকো!';
  timerHandle = setInterval(() => {
    timerSeconds -= 1;
    renderTimer();
    if (timerSeconds <= 0) {
      timerSeconds = 0;
      renderTimer();
      stopTimer();
      $('#timerStatus').textContent = 'সেশন শেষ! একটু বিরতি নাও।';
    }
  }, 1000);
}

$('#timerStart').addEventListener('click', () => {
  if (timerRunning) {
    stopTimer();
    $('#timerStatus').textContent = 'টাইমার বিরতিতে আছে।';
  } else if (timerSeconds > 0) {
    startTimer();
  }
});

$('#timerReset').addEventListener('click', () => {
  stopTimer();
  timerSeconds = 25 * 60;
  renderTimer();
  $('#timerStatus').textContent = 'টাইমার রিসেট হয়েছে।';
  document.querySelectorAll('[data-minutes]').forEach(btn => btn.classList.toggle('selected', btn.dataset.minutes === '25'));
});

document.querySelectorAll('[data-minutes]').forEach(button => {
  button.addEventListener('click', () => {
    stopTimer();
    timerSeconds = Number(button.dataset.minutes) * 60;
    renderTimer();
    $('#timerStatus').textContent = `${button.dataset.minutes} মিনিটের সেশন প্রস্তুত।`;
    document.querySelectorAll('[data-minutes]').forEach(btn => btn.classList.toggle('selected', btn === button));
  });
});

renderTimer();
renderAll();

