const currentUser = sessionStorage.getItem('ft_user');
if (!currentUser) {
  window.location.href = 'login.html';
}

const STORAGE_KEY = `ft_workouts_${currentUser}`;

document.getElementById('username-display').textContent = currentUser;
document.getElementById('logout-btn').addEventListener('click', () => {
  sessionStorage.removeItem('ft_user');
  window.location.href = 'login.html';
});

// --- Tab switching ---

const mainTabs = document.querySelectorAll('.main-tab');
const tabLog = document.getElementById('tab-log');
const tabHeatmap = document.getElementById('tab-heatmap');

mainTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    mainTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const target = tab.dataset.tab;
    tabLog.hidden = target !== 'log';
    tabHeatmap.hidden = target !== 'heatmap';
    if (target === 'heatmap') renderHeatmap();
  });
});

// --- Workout storage ---

function loadWorkouts() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
}

function saveWorkouts(workouts) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(workouts));
}

function formatDate(dateStr) {
  const [year, month, day] = dateStr.split('-');
  return new Date(year, month - 1, day).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  });
}

// --- Workout list ---

const form = document.getElementById('workout-form');
const list = document.getElementById('workouts');
const emptyState = document.getElementById('empty-state');

function renderWorkouts() {
  const workouts = loadWorkouts();
  list.innerHTML = '';

  if (workouts.length === 0) {
    emptyState.style.display = 'block';
    return;
  }

  emptyState.style.display = 'none';

  workouts.slice().reverse().forEach((workout, reversedIndex) => {
    const index = workouts.length - 1 - reversedIndex;
    const li = document.createElement('li');
    li.className = 'workout-item';
    li.innerHTML = `
      <div class="info">
        <strong>${workout.exercise}</strong>
        <span>${workout.duration} min &middot; ${formatDate(workout.date)}</span>
        ${workout.notes ? `<div class="notes">${workout.notes}</div>` : ''}
      </div>
      <button class="delete" aria-label="Delete workout" data-index="${index}">&times;</button>
    `;
    list.appendChild(li);
  });
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const workouts = loadWorkouts();
  workouts.push({
    exercise: document.getElementById('exercise').value.trim(),
    duration: parseInt(document.getElementById('duration').value, 10),
    date: document.getElementById('date').value,
    notes: document.getElementById('notes').value.trim(),
  });
  saveWorkouts(workouts);
  form.reset();
  document.getElementById('date').valueAsDate = new Date();
  renderWorkouts();
});

list.addEventListener('click', (e) => {
  const btn = e.target.closest('.delete');
  if (!btn) return;
  const workouts = loadWorkouts();
  workouts.splice(parseInt(btn.dataset.index, 10), 1);
  saveWorkouts(workouts);
  renderWorkouts();
});

document.getElementById('date').valueAsDate = new Date();
renderWorkouts();

// --- Heatmap ---

let heatmapYear;
let heatmapMonth;

(function initHeatmapDate() {
  const now = new Date();
  heatmapYear = now.getFullYear();
  heatmapMonth = now.getMonth();
})();

document.getElementById('prev-month').addEventListener('click', () => {
  heatmapMonth--;
  if (heatmapMonth < 0) { heatmapMonth = 11; heatmapYear--; }
  renderHeatmap();
});

document.getElementById('next-month').addEventListener('click', () => {
  heatmapMonth++;
  if (heatmapMonth > 11) { heatmapMonth = 0; heatmapYear++; }
  renderHeatmap();
});

function renderHeatmap() {
  const workouts = loadWorkouts();

  // Count workouts per date string "YYYY-MM-DD" for this month
  const countByDay = {};
  workouts.forEach(w => {
    const [y, m] = w.date.split('-').map(Number);
    if (y === heatmapYear && m - 1 === heatmapMonth) {
      countByDay[w.date] = (countByDay[w.date] || 0) + 1;
    }
  });

  const title = new Date(heatmapYear, heatmapMonth, 1)
    .toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  document.getElementById('heatmap-title').textContent = title;

  const daysInMonth = new Date(heatmapYear, heatmapMonth + 1, 0).getDate();
  // getDay() returns 0=Sun..6=Sat; we want 0=Mon..6=Sun
  const firstDayRaw = new Date(heatmapYear, heatmapMonth, 1).getDay();
  const startOffset = (firstDayRaw + 6) % 7; // shift so Monday = 0

  const cells = document.getElementById('heatmap-cells');
  cells.innerHTML = '';

  // Empty cells before day 1
  for (let i = 0; i < startOffset; i++) {
    const empty = document.createElement('div');
    empty.className = 'heatmap-cell empty';
    cells.appendChild(empty);
  }

  let activeDays = 0;
  let totalWorkouts = 0;

  for (let day = 1; day <= daysInMonth; day++) {
    const mm = String(heatmapMonth + 1).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    const dateStr = `${heatmapYear}-${mm}-${dd}`;
    const count = countByDay[dateStr] || 0;

    if (count > 0) activeDays++;
    totalWorkouts += count;

    const level = count === 0 ? 0 : count === 1 ? 1 : count === 2 ? 2 : 3;

    const cell = document.createElement('div');
    cell.className = 'heatmap-cell';
    cell.dataset.level = level;
    cell.title = count === 0
      ? `${formatDate(dateStr)}: no workout`
      : `${formatDate(dateStr)}: ${count} workout${count > 1 ? 's' : ''}`;

    const num = document.createElement('span');
    num.textContent = day;
    cell.appendChild(num);
    cells.appendChild(cell);
  }

  document.getElementById('heatmap-summary').textContent =
    `${activeDays} active day${activeDays !== 1 ? 's' : ''} · ${totalWorkouts} workout${totalWorkouts !== 1 ? 's' : ''} this month`;
}
