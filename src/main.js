import './style.css';
import { Needle, tool } from 'cactus-needle/browser';

const app = document.querySelector('#app');
const tasks = JSON.parse(localStorage.getItem('sm-tasks') || '[]');
let needle;

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
      <p id="status" role="status">মডেল প্রথমবার লোড হতে কিছু সময় লাগতে পারে।</p>
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

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;',
    '"': '&quot;', "'": '&#39;'
  })[char]);
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

aiBtn.addEventListener('click', async () => {
  const text = input.value.trim();

  if (!text) {
    status.textContent = 'প্রথমে কী পড়বে তা লিখো।';
    return;
  }

  aiBtn.disabled = true;
  status.textContent = 'AI মডেল লোড হচ্ছে… প্রথমবার একটু সময় লাগতে পারে।';

  try {
    if (!needle) {
      needle = new Needle({
        tools: {
          extract_study_tasks: tool({
            description: 'Extract study tasks explicitly mentioned by the student.',
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
        }
      });
    }

    status.textContent = 'AI তোমার পড়ার কাজ বিশ্লেষণ করছে…';
    const result = await needle.complete(
      'Extract the study tasks from this student text. Keep the original language. Do not invent tasks or durations. If a duration is not stated, use 25 minutes. Text: ' + text
    );

    console.log('Needle result:', JSON.stringify(result, null, 2));

    const call = result.function_calls?.find(
      item => item.name === 'extract_study_tasks'
    );

    let extracted = call?.arguments?.tasks;

    // Fallback: recognize simple English study tasks if the model
    // does not return a usable tool call.
    if (!Array.isArray(extracted) || extracted.length === 0) {
      const fallback = [];
      const lines = text.split(/[\n,;]+/).map(line => line.trim()).filter(Boolean);

      for (const line of lines) {
        const duration = line.match(/(\d+)\s*(minutes?|mins?|hours?|hrs?)/i);
        const subjectMatch = line.match(/\b(math(?:ematics)?|english|science|physics|chemistry|biology|history|geography|ict|computer)\b/i);

        if (!subjectMatch) continue;

        let minutes = 25;
        if (duration) {
          minutes = Number(duration[1]);
          if (/hours?|hrs?/i.test(duration[2])) minutes *= 60;
        }

        fallback.push({
          subject: subjectMatch[1],
          title: line,
          minutes
        });
      }

      extracted = fallback;
    }

    if (!Array.isArray(extracted) || extracted.length === 0) {
      status.textContent = 'কাজ শনাক্ত হয়নি। লিখে দেখো: Study Math for 30 minutes.';
      return;
    }

    extracted.forEach(task => addTask(task.subject, task.title, task.minutes));
    save();
    status.textContent = `সফল! AI ${extracted.length}টি পড়ার কাজ যোগ করেছে।`;
    input.value = '';
  } catch (error) {
    console.error('Needle error:', error);
    status.textContent = 'মডেল চালু করা যায়নি। ইন্টারনেট সংযোগ পরীক্ষা করে আবার চেষ্টা করো।';
  } finally {
    aiBtn.disabled = false;
  }
});

renderTasks();
