// --- StudyFlow Mobile-First State Engine ---
const DEFAULT_TASKS = [
  { id: 't1', title: 'Finish chemistry lab report', subject: 'Chemistry', dueDate: new Date().toISOString().split('T')[0], priority: 'high', difficulty: 4, estimate: 90, recurrence: 'none', files: ['lab-data.xlsx'], status: 'in-progress', notes: 'Include reaction kinetics and error analysis.', assignee: 'Noor', completed: false, subtasks: ['Review lab observations', 'Write analysis', 'Add citations'] },
  { id: 't2', title: 'Read chapter 6 notes', subject: 'Psychology', dueDate: new Date().toISOString().split('T')[0], priority: 'medium', difficulty: 2, estimate: 45, recurrence: 'weekly', files: [], status: 'completed', notes: 'Focus on cognitive development theories.', assignee: 'Noor', completed: true, subtasks: ['Highlight core theories', 'Make 5 flashcards'] },
  { id: 't3', title: 'Practice calculus problems', subject: 'Mathematics', dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0], priority: 'medium', difficulty: 3, estimate: 75, recurrence: 'daily', files: [], status: 'pending', notes: 'Integration by parts exercises 1-15.', assignee: 'Noor', completed: false, subtasks: ['Solve odd problems', 'Check answers', 'Redo mistakes'] },
  { id: 't4', title: 'Research project sources', subject: 'History', dueDate: new Date(Date.now() + 172800000).toISOString().split('T')[0], priority: 'low', difficulty: 2, estimate: 60, recurrence: 'none', files: ['source-list.docx'], status: 'pending', notes: 'Find 3 peer-reviewed articles on Industrial Revolution.', assignee: 'Aarav', completed: false, subtasks: ['Search library database', 'Save citations'] },
  { id: 't5', title: 'Complete DBMS Project', subject: 'Computer Science', dueDate: new Date(Date.now() + 259200000).toISOString().split('T')[0], priority: 'high', difficulty: 5, estimate: 180, recurrence: 'none', files: ['project-brief.pdf'], status: 'in-progress', notes: 'Group project with schema, code, testing, docs, and presentation.', assignee: 'Team Alpha', completed: false, subtasks: ['Research', 'ER Diagram', 'Database Design', 'Coding', 'Testing', 'Documentation', 'Presentation'] }
];

const DEFAULT_USER = {
  name: 'Noor Anami',
  email: 'noor@studyflow.edu',
  avatar: 'N',
  dailyGoal: 4,
  streak: 7,
  isLoggedIn: true,
  preferences: {
    reminders: true,
    sounds: true,
    theme: 'light',
    accent: 'royalblue'
  }
};

const DEFAULT_STUDY_HISTORY = [
  { id: 's1', taskTitle: 'Calculus Practice', subject: 'Mathematics', duration: 25, timestamp: 'Today, 2:15 PM' },
  { id: 's2', taskTitle: 'Psychology Reading', subject: 'Psychology', duration: 25, timestamp: 'Yesterday, 4:30 PM' }
];

const DEFAULT_TEAMS = [
  {
    id: 'g1',
    name: 'DBMS Project Team',
    leader: 'Noor Anami',
    members: ['Noor', 'Aarav', 'Meera', 'Kabir'],
    files: ['ERD-draft.pdf', 'schema-notes.docx'],
    chat: [
      { author: 'Meera', message: 'Uploaded the ER diagram draft.' },
      { author: 'Noor', message: 'I will connect the schema to the task board.' }
    ]
  }
];

const DEFAULT_EXAMS = [
  { id: 'e1', title: 'Chemistry Unit Test', subject: 'Chemistry', date: new Date(Date.now() + 432000000).toISOString().split('T')[0], syllabus: 'Equilibrium, kinetics, and lab calculations', readiness: 55 },
  { id: 'e2', title: 'DBMS Viva', subject: 'Computer Science', date: new Date(Date.now() + 604800000).toISOString().split('T')[0], syllabus: 'ER modeling, normalization, SQL queries', readiness: 40 }
];

const DEFAULT_NOTES = [
  { id: 'n1', subject: 'Chemistry', title: 'Reaction Kinetics', body: 'Revise rate laws, catalysts, and error analysis before final report.' },
  { id: 'n2', subject: 'Computer Science', title: 'DBMS Checklist', body: 'Confirm ER diagram, schema constraints, sample data, and test queries.' }
];

// App State
let state = {
  user: JSON.parse(localStorage.getItem('sf_user')) || DEFAULT_USER,
  tasks: JSON.parse(localStorage.getItem('sf_tasks')) || DEFAULT_TASKS,
  teams: JSON.parse(localStorage.getItem('sf_teams')) || DEFAULT_TEAMS,
  exams: JSON.parse(localStorage.getItem('sf_exams')) || DEFAULT_EXAMS,
  notes: JSON.parse(localStorage.getItem('sf_notes')) || DEFAULT_NOTES,
  studyHistory: JSON.parse(localStorage.getItem('sf_history')) || DEFAULT_STUDY_HISTORY,
  taskFilter: { subject: 'all', priority: 'all', status: 'all', search: '' },
  timer: { minutes: 25, seconds: 0, initialMinutes: 25, isRunning: false, mode: 'focus', intervalId: null },
  calendarDate: new Date()
};

state.tasks = state.tasks.map(task => ({
  difficulty: 3,
  estimate: 60,
  recurrence: 'none',
  files: [],
  subtasksDone: [],
  status: task.completed ? 'completed' : 'pending',
  assignee: state.user.name.split(' ')[0] || 'Noor',
  subtasks: createTaskBreakdown(task.title, task.subject, task.notes || ''),
  ...task
}));
state.user = {
  ...DEFAULT_USER,
  ...state.user,
  preferences: {
    ...DEFAULT_USER.preferences,
    ...(state.user?.preferences || {})
  }
};
if (!Array.isArray(state.teams) || !state.teams.length) state.teams = DEFAULT_TEAMS;
if (!Array.isArray(state.exams) || !state.exams.length) state.exams = DEFAULT_EXAMS;
if (!Array.isArray(state.notes) || !state.notes.length) state.notes = DEFAULT_NOTES;

function saveState() {
  localStorage.setItem('sf_user', JSON.stringify(state.user));
  localStorage.setItem('sf_tasks', JSON.stringify(state.tasks));
  localStorage.setItem('sf_teams', JSON.stringify(state.teams));
  localStorage.setItem('sf_exams', JSON.stringify(state.exams));
  localStorage.setItem('sf_notes', JSON.stringify(state.notes));
  localStorage.setItem('sf_history', JSON.stringify(state.studyHistory));
}

// Toast Notifications
function showToast(message) {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = 'toast-pill';
  toast.innerHTML = `<span>✦</span> ${message}`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Render User Info across Pages
function renderUserUI() {
  document.querySelectorAll('.user-name-display').forEach(el => el.textContent = state.user.name);
  document.querySelectorAll('.user-avatar-display').forEach(el => el.textContent = state.user.avatar);
  updateThemeToggleUI();
}

window.toggleTheme = function() {
  const current = state.user.preferences?.theme || 'light';
  const next = current === 'dark' ? 'light' : 'dark';
  state.user.preferences = { ...(state.user.preferences || {}), theme: next };
  saveState();
  applyPreferences();
  showToast(`Switched to ${next === 'dark' ? 'Dark' : 'Light'} mode 🌗`);
};

function updateThemeToggleUI() {
  const isDark = (state.user.preferences?.theme || 'light') === 'dark';
  document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
    btn.innerHTML = isDark ? '☀️' : '🌙';
    btn.setAttribute('title', isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode');
    btn.setAttribute('aria-label', isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode');
  });
  const themeSelect = document.getElementById('setting-theme');
  if (themeSelect) themeSelect.value = isDark ? 'dark' : 'light';
}

function applyPreferences() {
  const prefs = state.user.preferences || DEFAULT_USER.preferences;
  document.documentElement.dataset.theme = prefs.theme || 'light';
  document.documentElement.style.setProperty('--blue', prefs.accent || 'royalblue');
  updateThemeToggleUI();
}

function getDaysUntil(dateStr) {
  const date = new Date(`${dateStr}T00:00:00`);
  const today = new Date();
  const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  return Math.round((date - todayOnly) / 86400000);
}

function getUrgentTasks() {
  return state.tasks
    .filter(task => !task.completed && getDaysUntil(task.dueDate) <= 2)
    .sort((a, b) => getDaysUntil(a.dueDate) - getDaysUntil(b.dueDate));
}

function renderDeadlineReminders() {
  const urgent = getUrgentTasks();
  const greeting = document.querySelector('.greeting-card');
  if (greeting) {
    const text = greeting.querySelector('.greeting-text p');
    if (text) {
      text.textContent = urgent.length
        ? `You have ${urgent.length} task${urgent.length === 1 ? '' : 's'} due soon. Let's make today count!`
        : 'No urgent deadlines today. Use the calm space to get ahead.';
    }
  }

  const appContent = document.querySelector('.app-content');
  if (!appContent) return;
  const existing = document.getElementById('deadline-reminders');
  if (!urgent.length || state.user.preferences?.reminders === false) {
    existing?.remove();
    return;
  }

  const reminder = existing || document.createElement('section');
  reminder.className = 'deadline-reminders';
  reminder.id = 'deadline-reminders';
  reminder.innerHTML = `
    <div>
      <span class="eyebrow">Deadline reminders</span>
      <h3>${urgent.length} task${urgent.length === 1 ? '' : 's'} need attention</h3>
    </div>
    <div class="reminder-list">
      ${urgent.slice(0, 3).map(task => `<button type="button" onclick="openTaskModal('${task.id}')">${escapeHtml(task.title)} <span>${formatDateLabel(task.dueDate)}</span></button>`).join('')}
    </div>
  `;
  if (!existing) appContent.prepend(reminder);
}

// Highlight Active Sidebar Link & Ensure Text Labels Show
function highlightActiveSidebar() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.sidebar-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === path || (path === '' && href === 'dashboard.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

// Dashboard Page Renderer
function renderDashboard() {
  const pendingCountEl = document.getElementById('dash-pending-count');
  if (!pendingCountEl) return;

  const completed = state.tasks.filter(t => t.completed).length;
  const pending = state.tasks.filter(t => !t.completed).length;
  const totalMinutes = state.tasks.filter(t => !t.completed).reduce((sum, task) => sum + Number(task.estimate || 0), 0);
  const total = state.tasks.length;
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
  const recommended = getRecommendedTask();

  pendingCountEl.textContent = pending;
  document.getElementById('dash-completed-count').textContent = completed;
  document.getElementById('dash-streak-count').textContent = `${state.user.streak} days`;
  const focusTime = document.getElementById('dash-focus-time');
  if (focusTime) focusTime.textContent = `${Math.round(totalMinutes / 60 * 10) / 10} hrs`;

  const progressRing = document.getElementById('dash-progress-ring');
  if (progressRing) {
    progressRing.style.background = `conic-gradient(var(--blue) 0 ${percent}%, var(--line) ${percent}%)`;
  }
  const percentText = document.getElementById('dash-progress-percent');
  if (percentText) percentText.textContent = `${percent}%`;

  const dashTasksContainer = document.getElementById('dash-tasks-list');
  if (dashTasksContainer) {
    const todayTasks = state.tasks.slice(0, 4);
    if (todayTasks.length === 0) {
      dashTasksContainer.innerHTML = `<div class="empty-state" style="padding: 20px;"><p>No tasks yet! Add one above.</p></div>`;
    } else {
      dashTasksContainer.innerHTML = todayTasks.map(task => `
        <article class="task-row">
          <span class="checkbox ${task.completed ? 'checked' : ''}" onclick="toggleTask('${task.id}')">${task.completed ? '✓' : ''}</span>
          <div style="flex:1;">
            <strong style="${task.completed ? 'text-decoration: line-through; opacity: 0.7;' : ''}">${escapeHtml(task.title)}</strong>
            <small><b class="dot ${getSubjectDotClass(task.subject)}"></b> ${escapeHtml(task.subject)} · ${formatStatus(task.status)} · Due ${formatDateLabel(task.dueDate)}</small>
          </div>
          <span class="priority ${task.completed ? 'done' : task.priority}">${task.completed ? 'Done' : task.priority}</span>
        </article>
      `).join('');
    }
  }

  const deadlineCard = document.querySelector('.deadline-card div');
  if (deadlineCard && recommended) {
    deadlineCard.innerHTML = `
      <small>AI RECOMMENDS</small>
      <strong>${escapeHtml(recommended.title)}</strong>
      <span>${escapeHtml(recommended.subject)} · ${formatDateLabel(recommended.dueDate)}</span>
    `;
  }

  const insightGrid = document.getElementById('dash-insights-grid');
  if (insightGrid) {
    const atRisk = state.tasks.filter(task => !task.completed && getRiskLevel(task).key === 'risk').length;
    const nextExam = state.exams.slice().sort((a, b) => new Date(a.date) - new Date(b.date))[0];
    insightGrid.innerHTML = `
      <div class="insight-card"><small>Deadline Risk</small><strong>${atRisk}</strong><span>tasks need attention</span></div>
      <div class="insight-card"><small>Study Load</small><strong>${totalMinutes} min</strong><span>estimated pending work</span></div>
      <div class="insight-card"><small>Next Exam</small><strong>${escapeHtml(nextExam?.subject || 'None')}</strong><span>${nextExam ? formatDateLabel(nextExam.date) : 'no exam scheduled'}</span></div>
    `;
  }
}

// Tasks Page Renderer & CRUD
function renderTasks() {
  const container = document.getElementById('tasks-container');
  if (!container) return;

  let filtered = state.tasks.filter(task => {
    if (state.taskFilter.subject !== 'all' && task.subject !== state.taskFilter.subject) return false;
    if (state.taskFilter.priority !== 'all' && task.priority !== state.taskFilter.priority) return false;
    if (state.taskFilter.status !== 'all' && normalizeStatus(task) !== state.taskFilter.status) return false;
    if (state.taskFilter.search && !taskMatchesSearch(task, state.taskFilter.search)) return false;
    return true;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <span class="empty-state-icon">✦</span>
        <h3>All caught up!</h3>
        <p>You have no tasks matching your filters. Take a break or create a new task to keep your momentum going!</p>
        <button class="button button-primary button-small" onclick="openTaskModal()">+ Add New Task</button>
      </div>
    `;
    return;
  }

  const statuses = [
    { key: 'pending', label: 'Pending' },
    { key: 'in-progress', label: 'In Progress' },
    { key: 'completed', label: 'Completed' }
  ];
  const recommendation = getRecommendedTask();

  container.innerHTML = `
    <section class="smart-recommendation">
      <div>
        <span class="eyebrow">Smart next step</span>
        <h3>${escapeHtml(recommendation?.title || 'No pending tasks')}</h3>
        <p>${escapeHtml(getRecommendationReason(recommendation))}</p>
      </div>
      <button class="button button-secondary button-small" onclick="sendBreakdownForRecommended()">Break into steps</button>
    </section>
    <div class="kanban-board">
      ${statuses.map(status => {
        const statusTasks = filtered.filter(t => normalizeStatus(t) === status.key);
        return `
          <section class="kanban-column" data-status="${status.key}" ondragover="allowTaskDrop(event)" ondrop="dropTaskOnStatus(event, '${status.key}')">
            <div class="kanban-heading">
              <strong>${status.label}</strong>
              <span class="count">${statusTasks.length}</span>
            </div>
            <div class="task-list-container">
              ${statusTasks.map(task => renderTaskCard(task)).join('') || '<div class="mini-empty">Drop tasks here</div>'}
            </div>
          </section>
        `;
      }).join('')}
    </div>
  `;
}

function renderTaskCard(task) {
  const subtasks = normalizeSubtasks(task);
  const risk = getRiskLevel(task);
  const files = Array.isArray(task.files) ? task.files : [];
  const doneCount = subtasks.filter(item => item.done).length;
  const subtaskPct = subtasks.length ? Math.round((doneCount / subtasks.length) * 100) : 0;
  return `
    <div class="task-item-card subject-${getSubjectDotClass(task.subject)}" draggable="true" ondragstart="startTaskDrag(event, '${task.id}')">
      <div class="task-left">
        <span class="checkbox ${task.completed ? 'checked' : ''}" onclick="toggleTask('${task.id}')">${task.completed ? '✓' : ''}</span>
        <div class="task-details">
          <strong style="${task.completed ? 'text-decoration: line-through; opacity: 0.6;' : ''}">${escapeHtml(task.title)}</strong>
          ${task.notes ? `<p>${escapeHtml(task.notes)}</p>` : ''}
          <div class="task-meta">
            <span><b class="dot ${getSubjectDotClass(task.subject)}"></b> ${escapeHtml(task.subject)}</span>
            <span>Due ${formatDateLabel(task.dueDate)}</span>
            <span>${task.estimate || 60} min</span>
            <span>Difficulty ${task.difficulty || 3}/5</span>
            <span>${formatStatus(task.recurrence || 'none')}</span>
            <span>${escapeHtml(task.assignee || 'Noor')}</span>
          </div>
          ${subtasks.length ? `
            <div class="subtask-progress">
              <div><span>${doneCount}/${subtasks.length} steps</span><strong>${subtaskPct}%</strong></div>
              <div class="progress-bar-track"><div class="progress-bar-fill" style="width:${subtaskPct}%;"></div></div>
            </div>
            <div class="subtask-list">${subtasks.map((item, index) => `
              <button type="button" class="${item.done ? 'done' : ''}" onclick="toggleSubtask(event, '${task.id}', ${index})">
                <span>${item.done ? '✓' : ''}</span>${escapeHtml(item.title)}
              </button>
            `).join('')}</div>
          ` : ''}
          ${files.length ? `<div class="file-chip-list">${files.map(file => `<span>${escapeHtml(file)}</span>`).join('')}</div>` : ''}
        </div>
      </div>
      <div class="task-actions">
        <span class="risk-chip ${risk.key}">${risk.label}</span>
        <span class="priority ${task.completed ? 'done' : task.priority}">${task.completed ? 'Done' : task.priority}</span>
        <button class="icon-btn" onclick="openTaskModal('${task.id}')" title="Edit task">Edit</button>
        <button class="icon-btn icon-btn-danger" onclick="deleteTask('${task.id}')" title="Delete task">Del</button>
      </div>
    </div>
  `;
}

function normalizeSubtasks(task) {
  const doneMap = Array.isArray(task.subtasksDone) ? task.subtasksDone : [];
  const list = Array.isArray(task.subtasks) ? task.subtasks : [];
  return list.map((item, index) => {
    if (typeof item === 'object' && item !== null) {
      return { title: item.title || `Step ${index + 1}`, done: Boolean(item.done) };
    }
    return { title: String(item), done: Boolean(doneMap[index]) };
  });
}

function toggleSubtask(event, taskId, index) {
  event.stopPropagation();
  state.tasks = state.tasks.map(task => {
    if (task.id !== taskId) return task;
    const subtasks = normalizeSubtasks(task);
    subtasks[index].done = !subtasks[index].done;
    const completed = subtasks.length > 0 && subtasks.every(item => item.done);
    return {
      ...task,
      subtasks: subtasks.map(item => item.title),
      subtasksDone: subtasks.map(item => item.done),
      completed,
      status: completed ? 'completed' : task.status === 'completed' ? 'in-progress' : task.status
    };
  });
  saveState();
  renderDashboard();
  renderTasks();
  renderCalendar();
  renderProgress();
  renderTeam();
  renderDeadlineReminders();
  showToast('Step progress updated.');
}

function getRiskLevel(task) {
  if (task.completed) return { key: 'safe', label: 'Done' };
  const priorityScore = { high: 3, medium: 2, low: 1 }[task.priority] || 1;
  const due = new Date(`${task.dueDate}T00:00:00`);
  const today = new Date();
  const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const daysLeft = Math.ceil((due - todayOnly) / 86400000);
  const workload = Number(task.estimate || 60) / 60;
  const score = priorityScore + Number(task.difficulty || 3) + workload - daysLeft;
  if (daysLeft < 0 || score >= 7) return { key: 'risk', label: 'At risk' };
  if (score >= 4) return { key: 'watch', label: 'Watch' };
  return { key: 'safe', label: 'Safe' };
}

function getSubjectDotClass(subject) {
  switch (subject) {
    case 'Chemistry': return 'red';
    case 'Psychology': return 'purple';
    case 'Mathematics': return 'blue';
    case 'History': return 'orange';
    default: return 'green';
  }
}

function normalizeStatus(task) {
  if (task.completed) return 'completed';
  return task.status || 'pending';
}

function formatStatus(status) {
  return (status || 'pending').replace('-', ' ');
}

function formatDateLabel(dateStr) {
  const date = new Date(`${dateStr}T00:00:00`);
  const diff = getDaysUntil(dateStr);
  if (diff === 0) return 'today';
  if (diff === 1) return 'tomorrow';
  if (diff === -1) return 'yesterday';
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function startTaskDrag(event, taskId) {
  event.dataTransfer.setData('text/plain', taskId);
}

function allowTaskDrop(event) {
  event.preventDefault();
}

function dropTaskOnStatus(event, status) {
  event.preventDefault();
  const taskId = event.dataTransfer.getData('text/plain');
  state.tasks = state.tasks.map(task => task.id === taskId ? {
    ...task,
    status,
    completed: status === 'completed'
  } : task);
  saveState();
  renderTasks();
  renderDashboard();
  renderProgress();
  renderTeam();
  renderCalendar();
  renderDeadlineReminders();
  showToast(`Task moved to ${formatStatus(status)}.`);
}

function getRecommendedTask() {
  const priorityScore = { high: 3, medium: 2, low: 1 };
  return state.tasks
    .filter(task => !task.completed)
    .sort((a, b) => {
      const deadlineA = new Date(a.dueDate).getTime();
      const deadlineB = new Date(b.dueDate).getTime();
      const scoreA = (priorityScore[a.priority] || 1) * 10 + Number(a.difficulty || 3);
      const scoreB = (priorityScore[b.priority] || 1) * 10 + Number(b.difficulty || 3);
      return deadlineA - deadlineB || scoreB - scoreA;
    })[0];
}

function getRecommendationReason(task) {
  if (!task) return 'Everything is completed. Enjoy the clean slate.';
  return `${task.subject} is ${task.priority} priority, difficulty ${task.difficulty || 3}/5, and due ${formatDateLabel(task.dueDate)}.`;
}

function sendBreakdownForRecommended() {
  const task = getRecommendedTask();
  if (!task) return showToast('No pending task to break down.');
  window.location.href = `ai.html?prompt=${encodeURIComponent(`Break down ${task.title}`)}`;
}

function toggleTask(id) {
  state.tasks = state.tasks.map(t => {
    if (t.id === id) {
      const nextState = !t.completed;
      showToast(nextState ? 'Task completed! Great job! 🎉' : 'Task marked pending.');
      return { ...t, completed: nextState, status: nextState ? 'completed' : 'pending' };
    }
    return t;
  });
  saveState();
  renderDashboard();
  renderTasks();
  renderCalendar();
  renderProgress();
  renderTeam();
  renderDeadlineReminders();
}

function deleteTask(id) {
  state.tasks = state.tasks.filter(t => t.id !== id);
  saveState();
  renderDashboard();
  renderTasks();
  renderCalendar();
  renderProgress();
  renderTeam();
  renderDeadlineReminders();
  showToast('Task removed.', 'info');
}

function taskMatchesSearch(task, query) {
  const text = [
    task.title,
    task.subject,
    task.notes,
    task.assignee,
    task.priority,
    task.status,
    ...(task.files || []),
    ...(task.subtasks || [])
  ].join(' ').toLowerCase();
  return text.includes(query.toLowerCase());
}

// Modal Handlers
function openTaskModal(taskId = null) {
  const modal = document.getElementById('task-modal');
  if (!modal) return;

  const titleInput = document.getElementById('modal-task-title');
  const subjectInput = document.getElementById('modal-task-subject');
  const dueDateInput = document.getElementById('modal-task-date');
  const priorityInput = document.getElementById('modal-task-priority');
  const statusInput = document.getElementById('modal-task-status');
  const difficultyInput = document.getElementById('modal-task-difficulty');
  const estimateInput = document.getElementById('modal-task-estimate');
  const recurrenceInput = document.getElementById('modal-task-recurrence');
  const filesInput = document.getElementById('modal-task-files');
  const assigneeInput = document.getElementById('modal-task-assignee');
  const notesInput = document.getElementById('modal-task-notes');
  const idInput = document.getElementById('modal-task-id');
  const modalHeading = document.getElementById('modal-heading');

  if (taskId) {
    const task = state.tasks.find(t => t.id === taskId);
    if (task) {
      modalHeading.textContent = 'Edit Task';
      idInput.value = task.id;
      titleInput.value = task.title;
      subjectInput.value = task.subject;
      dueDateInput.value = task.dueDate;
      priorityInput.value = task.priority;
      if (statusInput) statusInput.value = normalizeStatus(task);
      if (difficultyInput) difficultyInput.value = task.difficulty || 3;
      if (estimateInput) estimateInput.value = task.estimate || 60;
      if (recurrenceInput) recurrenceInput.value = task.recurrence || 'none';
      if (filesInput) filesInput.value = (task.files || []).join(', ');
      if (assigneeInput) assigneeInput.value = task.assignee || '';
      notesInput.value = task.notes || '';
    }
  } else {
    modalHeading.textContent = 'Create New Task';
    idInput.value = '';
    titleInput.value = '';
    subjectInput.value = 'Chemistry';
    dueDateInput.value = new Date().toISOString().split('T')[0];
    priorityInput.value = 'medium';
    if (statusInput) statusInput.value = 'pending';
    if (difficultyInput) difficultyInput.value = 3;
    if (estimateInput) estimateInput.value = 60;
    if (recurrenceInput) recurrenceInput.value = 'none';
    if (filesInput) filesInput.value = '';
    if (assigneeInput) assigneeInput.value = state.user.name.split(' ')[0] || '';
    notesInput.value = '';
  }

  modal.classList.add('open');
}

function closeTaskModal() {
  document.getElementById('task-modal')?.classList.remove('open');
}

function handleTaskFormSubmit(e) {
  e.preventDefault();
  const id = document.getElementById('modal-task-id').value;
  const title = document.getElementById('modal-task-title').value.trim();
  const subject = document.getElementById('modal-task-subject').value;
  const dueDate = document.getElementById('modal-task-date').value;
  const priority = document.getElementById('modal-task-priority').value;
  const status = document.getElementById('modal-task-status')?.value || 'pending';
  const difficulty = Number(document.getElementById('modal-task-difficulty')?.value || 3);
  const estimate = Number(document.getElementById('modal-task-estimate')?.value || 60);
  const recurrence = document.getElementById('modal-task-recurrence')?.value || 'none';
  const files = (document.getElementById('modal-task-files')?.value || '').split(',').map(file => file.trim()).filter(Boolean);
  const assignee = document.getElementById('modal-task-assignee')?.value.trim() || state.user.name.split(' ')[0];
  const notes = document.getElementById('modal-task-notes').value.trim();
  const subtasks = createTaskBreakdown(title, subject, notes);
  const subtasksDone = subtasks.map(() => false);

  if (!title) {
    showToast('Please enter a task title');
    return;
  }

  if (id) {
    state.tasks = state.tasks.map(t => t.id === id ? {
      ...t,
      title,
      subject,
      dueDate,
      priority,
      status,
      difficulty,
      estimate,
      recurrence,
      files,
      assignee,
      notes,
      completed: status === 'completed',
      subtasks,
      subtasksDone: status === 'completed' ? subtasks.map(() => true) : subtasks.map((_, index) => Boolean(t.subtasksDone?.[index]))
    } : t);
    showToast('Task updated successfully! ✨');
  } else {
    const newTask = {
      id: 't_' + Date.now(),
      title,
      subject,
      dueDate,
      priority,
      status,
      difficulty,
      estimate,
      recurrence,
      files,
      assignee,
      notes,
      completed: status === 'completed',
      subtasks,
      subtasksDone: status === 'completed' ? subtasks.map(() => true) : subtasksDone
    };
    state.tasks.unshift(newTask);
    showToast('New task created! 🚀');
  }

  saveState();
  closeTaskModal();
  renderDashboard();
  renderTasks();
  renderCalendar();
  renderProgress();
  renderTeam();
  renderDeadlineReminders();
}

function createTaskBreakdown(title, subject, notes = '') {
  const text = `${title} ${subject} ${notes}`.toLowerCase();
  if (text.includes('dbms') || text.includes('project')) {
    return ['Research', 'ER Diagram', 'Database Design', 'Coding', 'Testing', 'Documentation', 'Presentation'];
  }
  if (text.includes('report') || text.includes('lab')) {
    return ['Collect observations', 'Draft method', 'Analyze results', 'Write conclusion', 'Proofread'];
  }
  if (text.includes('presentation')) {
    return ['Outline slides', 'Add visuals', 'Practice delivery', 'Final review'];
  }
  if (text.includes('read') || text.includes('chapter')) {
    return ['Skim headings', 'Read key sections', 'Summarize notes', 'Make flashcards'];
  }
  return ['Clarify requirements', 'Gather resources', 'Complete main work', 'Review and submit'];
}

// Calendar View
function renderCalendar() {
  const grid = document.getElementById('calendar-grid');
  if (!grid) return;

  ensureCalendarControls();
  const view = document.querySelector('.tab-btn.active')?.dataset.view || 'month';
  const monthTitle = document.getElementById('calendar-month-title');
  const today = state.calendarDate || new Date();
  const realToday = new Date();
  if (monthTitle) {
    monthTitle.textContent = today.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
  }

  if (view === 'week') {
    renderWeeklyPlanner(grid, today);
    return;
  }

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  let html = days.map(d => `<div class="calendar-day-header">${d}</div>`).join('');

  const currentDay = realToday.getDate();
  const year = today.getFullYear();
  const month = today.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let i = 0; i < firstDay; i++) {
    html += '<div class="calendar-day-cell muted-cell"></div>';
  }

  for (let i = 1; i <= daysInMonth; i++) {
    const dateStr = toISODate(new Date(year, month, i));
    const dayTasks = state.tasks.filter(t => t.dueDate === dateStr || (i === currentDay && !t.dueDate));
    const dayExams = state.exams.filter(exam => exam.date === dateStr);

    html += `
      <div class="calendar-day-cell ${year === realToday.getFullYear() && month === realToday.getMonth() && i === currentDay ? 'today' : ''}" onclick="openTaskModalForDate('${dateStr}')">
        <span class="day-number">${i}</span>
        ${dayTasks.map(t => `
          <div class="event-chip ${t.priority}">${escapeHtml(t.title)}</div>
        `).join('')}
        ${dayExams.map(exam => `<div class="event-chip exam">${escapeHtml(exam.subject)} exam</div>`).join('')}
      </div>
    `;
  }

  grid.innerHTML = html;
}

function ensureCalendarControls() {
  const controls = document.querySelector('.calendar-controls');
  if (!controls || document.getElementById('calendar-nav-controls')) return;
  const nav = document.createElement('div');
  nav.className = 'calendar-nav-controls';
  nav.id = 'calendar-nav-controls';
  nav.innerHTML = `
    <button class="icon-btn" type="button" onclick="moveCalendar(-1)" title="Previous period">‹</button>
    <button class="button button-secondary button-small" type="button" onclick="jumpCalendarToday()">Today</button>
    <button class="icon-btn" type="button" onclick="moveCalendar(1)" title="Next period">›</button>
  `;
  controls.insertBefore(nav, controls.querySelector('.view-tabs'));
}

function moveCalendar(direction) {
  const view = document.querySelector('.tab-btn.active')?.dataset.view || 'month';
  const next = new Date(state.calendarDate || new Date());
  if (view === 'week') next.setDate(next.getDate() + direction * 7);
  else next.setMonth(next.getMonth() + direction);
  state.calendarDate = next;
  renderCalendar();
}

function jumpCalendarToday() {
  state.calendarDate = new Date();
  renderCalendar();
}

function renderWeeklyPlanner(grid, today) {
  const start = new Date(today);
  start.setDate(today.getDate() - today.getDay());
  grid.innerHTML = Array.from({ length: 7 }).map((_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    const dateStr = toISODate(date);
    const dayTasks = state.tasks.filter(task => task.dueDate === dateStr);
    const dayExams = state.exams.filter(exam => exam.date === dateStr);
    return `
      <section class="week-day-panel" onclick="openTaskModalForDate('${dateStr}')">
        <strong>${date.toLocaleDateString(undefined, { weekday: 'short' })}</strong>
        <span>${date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
        ${dayTasks.map(task => `<div class="event-chip ${task.priority}">${escapeHtml(task.title)}</div>`).join('')}
        ${dayExams.map(exam => `<div class="event-chip exam">${escapeHtml(exam.title)}</div>`).join('')}
        ${!dayTasks.length && !dayExams.length ? '<small>No tasks planned</small>' : ''}
      </section>
    `;
  }).join('');
}

function toISODate(date) {
  return date.toISOString().split('T')[0];
}

function openTaskModalForDate(dateStr) {
  openTaskModal();
  const dateInput = document.getElementById('modal-task-date');
  if (dateInput) dateInput.value = dateStr;
}

function renderGlobalSearchResults(query) {
  let box = document.getElementById('global-search-results');
  const searchWrap = document.querySelector('.search-bar-wrap');
  if (!searchWrap) return;
  if (!box) {
    box = document.createElement('div');
    box.id = 'global-search-results';
    box.className = 'global-search-results';
    searchWrap.appendChild(box);
  }

  const value = query.trim().toLowerCase();
  if (!value) {
    box.classList.remove('open');
    box.innerHTML = '';
    return;
  }

  const taskResults = state.tasks.filter(task => taskMatchesSearch(task, value)).slice(0, 5);
  const examResults = state.exams.filter(exam => [exam.title, exam.subject, exam.syllabus].join(' ').toLowerCase().includes(value)).slice(0, 3);
  const noteResults = state.notes.filter(note => [note.title, note.subject, note.body].join(' ').toLowerCase().includes(value)).slice(0, 3);
  const rows = [
    ...taskResults.map(task => ({ label: task.title, meta: `Task · ${task.subject} · ${formatDateLabel(task.dueDate)}`, href: 'tasks.html' })),
    ...examResults.map(exam => ({ label: exam.title, meta: `Exam · ${exam.subject} · ${formatDateLabel(exam.date)}`, href: 'academics.html' })),
    ...noteResults.map(note => ({ label: note.title, meta: `Note · ${note.subject}`, href: 'academics.html' }))
  ];

  box.innerHTML = rows.length
    ? rows.map(row => `<a href="${row.href}"><strong>${escapeHtml(row.label)}</strong><span>${escapeHtml(row.meta)}</span></a>`).join('')
    : '<div class="search-empty">No matching study items</div>';
  box.classList.add('open');
}

// Pomodoro Timer Logic
function selectTimerMode(mode) {
  state.timer.mode = mode;
  document.querySelectorAll('.mode-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.mode === mode);
  });

  if (mode === 'focus') state.timer.initialMinutes = 25;
  else if (mode === 'short') state.timer.initialMinutes = 5;
  else if (mode === 'long') state.timer.initialMinutes = 15;

  state.timer.minutes = state.timer.initialMinutes;
  state.timer.seconds = 0;
  pauseTimer();
  updateTimerDisplay();
}

function toggleTimer() {
  if (state.timer.isRunning) {
    pauseTimer();
  } else {
    startTimer();
  }
}

function startTimer() {
  state.timer.isRunning = true;
  const startBtn = document.getElementById('timer-start-btn');
  if (startBtn) startBtn.textContent = '⏸ Pause';
  showToast('Focus timer started! Stay in the flow 🎯');

  state.timer.intervalId = setInterval(() => {
    if (state.timer.seconds === 0) {
      if (state.timer.minutes === 0) {
        completeTimerSession();
        return;
      }
      state.timer.minutes--;
      state.timer.seconds = 59;
    } else {
      state.timer.seconds--;
    }
    updateTimerDisplay();
  }, 1000);
}

function pauseTimer() {
  state.timer.isRunning = false;
  clearInterval(state.timer.intervalId);
  const btn = document.getElementById('timer-start-btn');
  if (btn) btn.textContent = '▶ Start';
}

function resetTimer() {
  pauseTimer();
  state.timer.minutes = state.timer.initialMinutes;
  state.timer.seconds = 0;
  updateTimerDisplay();
}

function updateTimerDisplay() {
  const m = String(state.timer.minutes).padStart(2, '0');
  const s = String(state.timer.seconds).padStart(2, '0');
  const timeEl = document.getElementById('timer-display-time');
  if (timeEl) timeEl.textContent = `${m}:${s}`;

  const totalSecs = state.timer.initialMinutes * 60;
  const currSecs = state.timer.minutes * 60 + state.timer.seconds;
  const progressPath = document.getElementById('timer-progress-circle');
  if (progressPath) {
    const offset = 690 - (690 * (currSecs / totalSecs));
    progressPath.style.strokeDashoffset = offset;
  }
}

function completeTimerSession() {
  pauseTimer();
  showToast('Pomodoro Session Complete! Take a well-deserved break! 🎉');
  const focusTask = state.tasks.find(task => task.id === state.timer.focusTaskId);
  const newSession = {
    id: 's_' + Date.now(),
    taskTitle: focusTask ? focusTask.title : state.timer.mode === 'focus' ? 'Focus Session' : 'Break Time',
    subject: focusTask ? focusTask.subject : 'General Study',
    duration: state.timer.initialMinutes,
    timestamp: 'Just now'
  };
  state.studyHistory.unshift(newSession);
  saveState();
  renderStudyPlan();
  resetTimer();
}

function renderStudyPlan() {
  const plan = document.getElementById('study-plan-list');
  if (!plan) return;
  const pending = state.tasks.filter(task => !task.completed).sort((a, b) => {
    const riskA = { risk: 3, watch: 2, safe: 1 }[getRiskLevel(a).key];
    const riskB = { risk: 3, watch: 2, safe: 1 }[getRiskLevel(b).key];
    return riskB - riskA || new Date(a.dueDate) - new Date(b.dueDate);
  }).slice(0, 4);

  plan.innerHTML = pending.map((task, index) => `
    <div class="plan-row">
      <span>${String(index + 1).padStart(2, '0')}</span>
      <div>
        <strong>${escapeHtml(task.title)}</strong>
        <small>${escapeHtml(task.subject)} · ${task.estimate || 60} min · ${getRiskLevel(task).label}</small>
      </div>
      <button class="icon-btn" onclick="selectFocusTask('${task.id}')">Use</button>
    </div>
  `).join('') || '<div class="mini-empty">No pending study blocks.</div>';
}

function selectFocusTask(taskId) {
  const task = state.tasks.find(item => item.id === taskId);
  if (!task) return;
  state.timer.focusTaskId = taskId;
  const label = document.getElementById('timer-focus-label');
  if (label) label.textContent = task.title;
  showToast(`Timer linked to ${task.title}.`);
}

// Progress & Analytics View
function renderProgress() {
  const barChart = document.getElementById('analytics-bar-chart');
  if (barChart) {
    const heights = [60, 85, 45, 90, 75, 30, 50];
    const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
    barChart.innerHTML = days.map((d, idx) => `
      <div class="chart-column">
        <div class="bar-fill" style="height: ${heights[idx]}%;"></div>
        <span class="chart-label">${d}</span>
      </div>
    `).join('');
  }

  const subjProgress = document.getElementById('subject-progress-list');
  if (subjProgress) {
    const subjects = ['Chemistry', 'Psychology', 'Mathematics', 'History', 'Computer Science'];
    subjProgress.innerHTML = subjects.map(subj => {
      const subjTasks = state.tasks.filter(t => t.subject === subj);
      const done = subjTasks.filter(t => t.completed).length;
      const pct = subjTasks.length > 0 ? Math.round((done / subjTasks.length) * 100) : 0;
      return `
        <div class="subject-progress-item">
          <div class="subject-progress-header">
            <span>${subj}</span>
            <span>${pct}%</span>
          </div>
          <div class="progress-bar-track">
            <div class="progress-bar-fill" style="width: ${pct}%;"></div>
          </div>
        </div>
      `;
    }).join('');
  }
}

// Academics: exams and notes
function renderAcademics() {
  const examList = document.getElementById('exam-list');
  if (examList) {
    examList.innerHTML = state.exams
      .slice()
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .map(exam => `
        <article class="academic-item">
          <div>
            <strong>${escapeHtml(exam.title)}</strong>
            <small>${escapeHtml(exam.subject)} · ${formatDateLabel(exam.date)}</small>
            <p>${escapeHtml(exam.syllabus || 'No syllabus added yet.')}</p>
          </div>
          <div class="readiness-meter">
            <span>${Number(exam.readiness || 0)}%</span>
            <div class="progress-bar-track"><div class="progress-bar-fill" style="width:${Number(exam.readiness || 0)}%;"></div></div>
          </div>
          <button class="icon-btn icon-btn-danger" type="button" onclick="deleteExam('${exam.id}')">Del</button>
        </article>
      `).join('') || '<div class="mini-empty">Add your next test or viva.</div>';
  }

  const notesList = document.getElementById('notes-list');
  if (notesList) {
    notesList.innerHTML = state.notes.map(note => `
      <article class="note-item">
        <div>
          <strong>${escapeHtml(note.title)}</strong>
          <small>${escapeHtml(note.subject)}</small>
        </div>
        <p>${escapeHtml(note.body)}</p>
        <button class="icon-btn icon-btn-danger" type="button" onclick="deleteNote('${note.id}')">Del</button>
      </article>
    `).join('') || '<div class="mini-empty">Save quick revision notes here.</div>';
  }
}

function handleExamSubmit(e) {
  e.preventDefault();
  const title = document.getElementById('exam-title')?.value.trim();
  if (!title) return;
  state.exams.push({
    id: 'e_' + Date.now(),
    title,
    subject: document.getElementById('exam-subject')?.value || 'General',
    date: document.getElementById('exam-date')?.value || toISODate(new Date()),
    readiness: Math.max(0, Math.min(100, Number(document.getElementById('exam-readiness')?.value || 0))),
    syllabus: document.getElementById('exam-syllabus')?.value.trim() || ''
  });
  e.target.reset();
  saveState();
  renderAcademics();
  renderCalendar();
  renderDashboard();
  showToast('Exam added to your academic tracker.');
}

function handleNoteSubmit(e) {
  e.preventDefault();
  const title = document.getElementById('note-title')?.value.trim();
  const body = document.getElementById('note-body')?.value.trim();
  if (!title || !body) return;
  state.notes.unshift({
    id: 'n_' + Date.now(),
    title,
    subject: document.getElementById('note-subject')?.value || 'General',
    body
  });
  e.target.reset();
  saveState();
  renderAcademics();
  showToast('Note saved for revision.');
}

function deleteExam(id) {
  state.exams = state.exams.filter(exam => exam.id !== id);
  saveState();
  renderAcademics();
  renderCalendar();
  renderDashboard();
}

function deleteNote(id) {
  state.notes = state.notes.filter(note => note.id !== id);
  saveState();
  renderAcademics();
}

// Team Assignment Management
function renderTeam() {
  const summary = document.getElementById('team-summary');
  if (!summary) return;

  const team = state.teams[0] || DEFAULT_TEAMS[0];
  const projectTasks = state.tasks.filter(task => (task.assignee || '').toLowerCase().includes('team') || task.title.toLowerCase().includes('project'));
  const completed = projectTasks.filter(task => task.completed).length;
  const progress = projectTasks.length ? Math.round((completed / projectTasks.length) * 100) : 0;
  const progressCount = document.getElementById('team-progress-count');
  if (progressCount) progressCount.textContent = `${progress}%`;

  summary.innerHTML = `
    <div class="team-hero">
      <div>
        <span class="eyebrow">${escapeHtml(team.name)}</span>
        <h3>${progress}% complete</h3>
        <p>Leader: ${escapeHtml(team.leader)} · ${team.members.length} members · ${projectTasks.length} project tasks</p>
      </div>
      <div class="progress-bar-track"><div class="progress-bar-fill" style="width:${progress}%;"></div></div>
    </div>
    <div class="team-task-list">
      ${projectTasks.map(task => renderTaskCard(task)).join('') || '<div class="mini-empty">Assign a project task from the Tasks page.</div>'}
    </div>
  `;

  const memberWrap = document.getElementById('team-members');
  if (memberWrap) {
    memberWrap.innerHTML = team.members.map(member => {
      const count = state.tasks.filter(task => (task.assignee || '').toLowerCase().includes(member.toLowerCase())).length;
      return `
        <div class="member-row">
          <span class="avatar">${escapeHtml(member[0])}</span>
          <strong>${escapeHtml(member)}</strong>
          <small>${count} assigned</small>
        </div>
      `;
    }).join('');
  }

  const chat = document.getElementById('team-chat');
  if (chat) {
    chat.innerHTML = team.chat.map(item => `
      <div class="team-message">
        <strong>${escapeHtml(item.author)}</strong>
        <span>${escapeHtml(item.message)}</span>
      </div>
    `).join('');
    chat.scrollTop = chat.scrollHeight;
  }

  const files = document.getElementById('team-files');
  if (files) {
    files.innerHTML = team.files.map(file => `<div class="file-row"><span>File</span><strong>${escapeHtml(file)}</strong></div>`).join('');
  }
}

function handleTeamChat(e) {
  e.preventDefault();
  const input = document.getElementById('team-chat-input');
  const message = input?.value.trim();
  if (!message) return;
  state.teams[0].chat.push({ author: state.user.name.split(' ')[0] || 'You', message });
  input.value = '';
  saveState();
  renderTeam();
}

function handleTeamFileUpload(e) {
  const file = e.target.files?.[0];
  if (!file) return;
  state.teams[0].files.unshift(file.name);
  saveState();
  renderTeam();
  showToast('File added to team workspace.');
}

function createDemoGroup() {
  showToast('Team workspace is ready. Add members by editing the group data in this demo.');
}

// AI Assistant Chat Logic
function handleAIChat(e) {
  e.preventDefault();
  const input = document.getElementById('ai-chat-input');
  const text = input.value.trim();
  if (!text) return;

  appendAIChatMessage(text, 'user');
  input.value = '';

  setTimeout(() => {
    appendAIChatMessage(generateAIResponse(text), 'assistant');
  }, 600);
}

function generateAIResponse(text) {
  const query = text.toLowerCase();
  const pending = state.tasks.filter(task => !task.completed);
  const tomorrow = toISODate(new Date(Date.now() + 86400000));
  const tomorrowTasks = pending.filter(task => task.dueDate === tomorrow);
  const recommended = getRecommendedTask();

  if (query.includes('due tomorrow')) {
    if (!tomorrowTasks.length) return 'No assignments are due tomorrow. You can use that space to get ahead.';
    return `Due tomorrow:\n${tomorrowTasks.map(task => `- ${task.title} (${task.subject}, ${task.priority})`).join('\n')}`;
  }

  if (query.includes('highest priority') || query.includes('complete first') || query.includes('work on next')) {
    if (!recommended) return 'Everything is complete. No priority task is waiting right now.';
    return `Start with ${recommended.title}.\nReason: ${getRecommendationReason(recommended)}`;
  }

  if (query.includes('how many') && query.includes('pending')) {
    return `You have ${pending.length} pending task${pending.length === 1 ? '' : 's'} across ${new Set(pending.map(task => task.subject)).size} subject${pending.length === 1 ? '' : 's'}.`;
  }

  if (query.includes('schedule') || query.includes('planner') || query.includes('plan')) {
    const topTasks = pending.slice().sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate)).slice(0, 3);
    if (!topTasks.length) return 'Your schedule is clear. A review block or practice quiz would be a smart light session.';
    return `Study schedule for today:\n${topTasks.map((task, index) => `${index + 1}. 35 min - ${task.title}\n   5 min break, then update status`).join('\n')}\nFinish with a 10 min recap and mark progress.`;
  }

  if (query.includes('remind')) {
    const chemistry = pending.find(task => query.includes(task.subject.toLowerCase()) || query.includes(task.title.toLowerCase().split(' ')[0]));
    const reminderTask = chemistry || recommended;
    if (!reminderTask) return 'No pending task found to remind you about.';
    showToast(`Reminder set: ${reminderTask.title} today.`);
    return `Reminder set for today: ${reminderTask.title}. I will keep it in your top focus list.`;
  }

  if (query.includes('break down') || query.includes('breakdown') || query.includes('steps')) {
    const matchedTask = pending.find(task => query.includes(task.title.toLowerCase())) || recommended;
    if (!matchedTask) return 'Add a task first, then I can split it into smaller steps.';
    const steps = createTaskBreakdown(matchedTask.title, matchedTask.subject, matchedTask.notes);
    state.tasks = state.tasks.map(task => task.id === matchedTask.id ? { ...task, subtasks: steps, subtasksDone: steps.map(() => false) } : task);
    saveState();
    renderTasks();
    return `${matchedTask.title} can be broken into:\n${steps.map(step => `- ${step}`).join('\n')}`;
  }

  return recommended
    ? `Based on your deadlines, I recommend ${recommended.title}. ${getRecommendationReason(recommended)}`
    : 'You are fully caught up. Add a new assignment or start a study session.';
}

function appendAIChatMessage(text, role) {
  const chatMessages = document.getElementById('ai-chat-messages');
  if (!chatMessages) return;
  const bubble = document.createElement('div');
  bubble.className = `chat-bubble ${role}`;
  bubble.innerHTML = formatChatText(text);
  chatMessages.appendChild(bubble);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function formatChatText(text) {
  return escapeHtml(text).replace(/\n/g, '<br>');
}

function sendPresetPrompt(promptText) {
  const input = document.getElementById('ai-chat-input');
  if (input) {
    input.value = promptText;
    document.getElementById('ai-chat-form')?.dispatchEvent(new Event('submit'));
  }
}

// Settings Handlers
function renderSettings() {
  const nameInput = document.getElementById('setting-name');
  const emailInput = document.getElementById('setting-email');
  const dailyGoalInput = document.getElementById('setting-daily-goal');
  const themeInput = document.getElementById('setting-theme');
  const accentInput = document.getElementById('setting-accent');
  if (nameInput) nameInput.value = state.user.name;
  if (emailInput) emailInput.value = state.user.email;
  if (dailyGoalInput) dailyGoalInput.value = state.user.dailyGoal || 4;
  if (themeInput) themeInput.value = state.user.preferences?.theme || 'light';
  if (accentInput) accentInput.value = state.user.preferences?.accent || 'royalblue';
  document.querySelector('[data-setting-toggle="reminders"]')?.classList.toggle('active', state.user.preferences?.reminders !== false);
  document.querySelector('[data-setting-toggle="sounds"]')?.classList.toggle('active', state.user.preferences?.sounds !== false);
}

function handleSettingsSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('setting-name').value.trim();
  const email = document.getElementById('setting-email').value.trim();
  const dailyGoal = Number(document.getElementById('setting-daily-goal')?.value || state.user.dailyGoal || 4);
  const theme = document.getElementById('setting-theme')?.value || 'light';
  const accent = document.getElementById('setting-accent')?.value || 'royalblue';
  if (name) state.user.name = name;
  if (email) state.user.email = email;
  state.user.dailyGoal = Math.max(1, Math.min(12, dailyGoal));
  state.user.avatar = name ? name[0].toUpperCase() : 'U';
  state.user.preferences = { ...state.user.preferences, theme, accent };
  saveState();
  renderUserUI();
  applyPreferences();
  showToast('Settings saved successfully! ⚙');
}

function togglePreference(key) {
  state.user.preferences = { ...state.user.preferences, [key]: !state.user.preferences?.[key] };
  saveState();
  renderSettings();
  showToast(`${formatStatus(key)} ${state.user.preferences[key] ? 'enabled' : 'disabled'}.`);
}

function exportStudyData() {
  const payload = JSON.stringify({
    exportedAt: new Date().toISOString(),
    user: state.user,
    tasks: state.tasks,
    exams: state.exams,
    notes: state.notes,
    teams: state.teams,
    studyHistory: state.studyHistory
  }, null, 2);
  const blob = new Blob([payload], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'studyflow-data.json';
  link.click();
  URL.revokeObjectURL(link.href);
  showToast('Study data exported.');
}

function resetDemoData() {
  if (!confirm('Reset StudyFlow demo data? This clears your local tasks, exams, notes, and settings.')) return;
  localStorage.removeItem('sf_user');
  localStorage.removeItem('sf_tasks');
  localStorage.removeItem('sf_teams');
  localStorage.removeItem('sf_exams');
  localStorage.removeItem('sf_notes');
  localStorage.removeItem('sf_history');
  window.location.reload();
}

// Global Auth Handlers
window.handleLogout = function(e) {
  if (e) e.preventDefault();
  state.user.isLoggedIn = false;
  saveState();
  window.location.href = 'index.html';
};

function handleLogin(e) {
  e.preventDefault();
  state.user.isLoggedIn = true;
  saveState();
  window.location.href = 'dashboard.html';
}

function handleSignup(e) {
  e.preventDefault();
  const name = document.getElementById('signup-name')?.value.trim();
  const email = document.getElementById('signup-email')?.value.trim();
  if (name) state.user.name = name;
  if (email) state.user.email = email;
  state.user.avatar = name ? name[0].toUpperCase() : 'S';
  state.user.isLoggedIn = true;
  saveState();
  window.location.href = 'dashboard.html';
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// --- Page Initialization ---
document.addEventListener('DOMContentLoaded', () => {
  applyPreferences();
  renderUserUI();
  highlightActiveSidebar();

  // Mobile menu button event
  const menuBtn = document.querySelector('.menu-button');
  const navLinks = document.querySelector('.nav-links');
  menuBtn?.addEventListener('click', () => {
    navLinks?.classList.toggle('open');
  });

  // Task Filter chips
  document.querySelectorAll('.filter-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const type = chip.dataset.filterType;
      const val = chip.dataset.filterVal;
      document.querySelectorAll(`[data-filter-type="${type}"]`).forEach(c => c.classList.remove('active'));
      chip.classList.add('active');

      if (type === 'subject') state.taskFilter.subject = val;
      if (type === 'priority') state.taskFilter.priority = val;
      if (type === 'status') state.taskFilter.status = val;
      renderTasks();
    });
  });

  // Global Task Search
  document.getElementById('task-search-input')?.addEventListener('input', (e) => {
    state.taskFilter.search = e.target.value;
    renderGlobalSearchResults(e.target.value);
    renderTasks();
  });

  document.querySelectorAll('.tab-btn[data-view]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn[data-view]').forEach(tab => tab.classList.remove('active'));
      btn.classList.add('active');
      renderCalendar();
    });
  });

  // Page Specific Renders
  renderDashboard();
  renderTasks();
  renderCalendar();
  renderProgress();
  renderTeam();
  renderAcademics();
  renderSettings();
  renderStudyPlan();
  renderDeadlineReminders();

  const prompt = new URLSearchParams(window.location.search).get('prompt');
  if (prompt && document.getElementById('ai-chat-input')) {
    sendPresetPrompt(prompt);
  }

  // Attach Form Submit Handlers
  document.getElementById('task-form')?.addEventListener('submit', handleTaskFormSubmit);
  document.getElementById('login-form')?.addEventListener('submit', handleLogin);
  document.getElementById('signup-form')?.addEventListener('submit', handleSignup);
  document.getElementById('ai-chat-form')?.addEventListener('submit', handleAIChat);
  document.getElementById('settings-form')?.addEventListener('submit', handleSettingsSubmit);
  document.getElementById('team-chat-form')?.addEventListener('submit', handleTeamChat);
  document.getElementById('team-file-input')?.addEventListener('change', handleTeamFileUpload);
  document.getElementById('exam-form')?.addEventListener('submit', handleExamSubmit);
  document.getElementById('note-form')?.addEventListener('submit', handleNoteSubmit);

  // Hide loader smoothly
  setTimeout(() => {
    document.getElementById('loader-overlay')?.classList.add('hidden');
  }, 400);
});
