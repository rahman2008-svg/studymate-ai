import './style.css';
import { createNeedle, tool } from 'cactus-needle/browser';

const app = document.querySelector('#app');
const tasks = JSON.parse(localStorage.getItem('sm-tasks') || '[]');

let needle = null;
let loadingPromise = null;

app.innerHTML = `
  <header class="top">
    <div class="brand">📚 StudyMate <span>AI</span></div>
    <div class="sub">Your personal study planner</div>
  </header>
  <main>
    <section class="welcome">
      <p class="eyebrow">YOUR LEARNING SPACE</p>
      <h1>পড়াশোনা হোক <span>সহজ!</span></h1>
      <p>তোমার পড়ার কাজ লেখো। AI দিয়ে সেগুলো গুছিয়ে নাও।</p>
    </section>
    <section class="panel">
      <h2>✨ AI Study Assistant</h2>
      <label for="studyInput">আজ কী কী পড়তে হবে?</label>
      <textarea id="studyInput" placeholder="যেমন: আজ গণিত ৩০ মিনিট, ইংরেজি ২০ মিনিট পড়ব।"></textarea>
      <button id="aiBtn">✨ AI দিয়ে সাজাও</button>
      <p id="status" role="status">প্রথমবার মডেল ডাউনলোড হতে পারে।</p>
    </section>
    <section class="panel">
      <div class="section-title">
        <h2>📋 আমার পড়ার তালিকা</h2>
        <span id="count">0 tasks</span>
      </div>
      <div id="taskList"></div>
      <p id="empty">এখনো কোনো পড়ার কাজ যোগ করা হয়নি।</p>
    </section>
  </main>
  <footer>StudyMate AI · Learn a little every day 💙</footer>
`;

const input = document.querySelector('#studyInput');
const status = document.querySelector('#status');
const aiBtn = document.querySelector('#aiBtn');

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;',
    '"': '&quot;', "'": '&#39;'
  })[char]);
}

function renderTasks() {
  const list = document.querySelector('#taskList');
  document.querySelector('#count').textContent = `${tasks.length} tasks`;
  document.querySelector('#empty').hidden = tasks.length > 0;

  list.innerHTML = tasks.map((task, i) => `
    <article class="task ${task.done ? 'done' : ''}">
      <input type="checkbox" data-done="${i}" ${task.done ? 'checked' : ''} aria-label="কাজ সম্পন্ন">
      <div class="task-info">
        <strong>${escapeHtml(task.subject)}</strong>
        <p>${escapeHtml(task.title)}</p>
        <small>⏱ ${task.minutes} মিনিট</small>
      </div>
      <button class="delete" data-delete="${i}" aria-label="কাজ মুছুন">×</button>
    </article>
  `).join('');

  list.querySelectorAll('[data-done]').forEach(el => {
    el.addEventListener('change', () => {
      tasks[Number(el.dataset.done)].done = el.checked;
      save();
    });
  });

  list.querySelectorAll('[data-delete]').forEach(el => {
    el.addEventListener('click', () => {
      tasks.splice(Number(el.dataset.delete), 1);
      save();
    });
  });
}

function save() {
  localStorage.setItem('sm-tasks', JSON.stringify(tasks));
  renderTasks();
}

function addTask(subject, title, minutes = 25) {
  tasks.push({
    subject: String(subject || 'সাধারণ'),
    title: String(title || 'পড়াশোনা'),
    minutes: Math.max(5, Math.min(180, Number(minutes) || 25)),
    done: false
  });
}

async function getNeedle() {
  if (needle) return needle;
  if (loadingPromise) return loadingPromise;

  loadingPromise = createNeedle({
    cache: true,
    tools: {
      extract_study_tasks: tool({
        description: 'Extract study tasks explicitly mentioned by the student. Preserve the original language.',
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
        const mb = (loaded / (1024 * 1024)).toFixed(1);
        const totalMb = total ? ` / ${(total / (1024 * 1024)).toFixed(1)} MB` : '';
        status.textContent = `LLM মডেল ডাউনলোড হচ্ছে: ${mb}${totalMb}`;
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

function fallbackTasks(text) {
  const result = [];
  const lines = text.split(/[\n,;।]+/).map(line => line.trim()).filter(Boolean);

  const subjects = [
    ['গণিত', /গণিত|ম্যাথ|math(?:ematics)?/i],
    ['ইংরেজি', /ইংরেজি|english/i],
    ['বিজ্ঞান', /বিজ্ঞান|science/i],
    ['পদার্থবিজ্ঞান', /পদার্থবিজ্ঞান|physics/i],
    ['রসায়ন', /রসায়ন|chemistry/i],
    ['জীববিজ্ঞান', /জীববিজ্ঞান|biology/i],
    ['ইতিহাস', /ইতিহাস|history/i],
    ['ভূগোল', /ভূগোল|geography/i],
    ['আইসিটি', /আইসিটি|\bICT\b|computer/i]
  ];

  for (const line of lines) {
    const match = line.match(/(\d+)\s*(মিনিট|মিনিটের|ঘণ্টা|ঘন্টা|minutes?|mins?|hours?|hrs?)/i);
    const subject = subjects.find(([, pattern]) => pattern.test(line));
    if (!subject) continue;

    let minutes = 25;
    if (match) {
      minutes = Number(match[1]);
      if (/ঘণ্টা|ঘন্টা|hours?|hrs?/i.test(match[2])) minutes *= 60;
    }

    result.push({ subject: subject[0], title: line, minutes });
  }

  return result;
}

aiBtn.addEventListener('click', async () => {
  const text = input.value.trim();

  if (!text) {
    status.textContent = 'প্রথমে কী পড়বে তা লিখো।';
    return;
  }

  aiBtn.disabled = true;

  try {
    status.textContent = 'LLM মডেল প্রস্তুত করা হচ্ছে…';
    const model = await getNeedle();

    status.textContent = 'AI তোমার পড়ার কাজ বিশ্লেষণ করছে…';

    const result = await model.generate({
      prompt: `Extract study tasks from the student's text. Keep the original language. Do not invent subjects or durations. If duration is not stated, use 25 minutes. Call extract_study_tasks with the results. Student text: ${text}`
    });

    console.log('Needle result:', result);

    const call = result.toolCalls?.find(
      item => item.toolName === 'extract_study_tasks'
    );

    let extracted = call?.input?.tasks;

    if (!Array.isArray(extracted) || extracted.length === 0) {
      extracted = fallbackTasks(text);
    }

    if (!Array.isArray(extracted) || extracted.length === 0) {
      status.textContent = 'কাজ শনাক্ত হয়নি। বিষয় ও সময় লিখে আবার চেষ্টা করো।';
      return;
    }

    extracted.forEach(task => addTask(task.subject, task.title, task.minutes));
    save();
    input.value = '';
    status.textContent = `সফল! ${extracted.length}টি পড়ার কাজ যোগ হয়েছে।`;
  } catch (error) {
    console.error('Needle error:', error);
    status.textContent = `LLM চালু করা যায়নি: ${error?.message || error}. ইন্টারনেট পরীক্ষা করে আবার চেষ্টা করো।`;
  } finally {
    aiBtn.disabled = false;
  }
});

renderTasks();
