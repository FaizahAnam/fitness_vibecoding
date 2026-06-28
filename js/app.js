const currentUser = sessionStorage.getItem('ft_user');
if (!currentUser) {
  window.location.href = 'login.html';
}

const STORAGE_KEY = `ft_workouts_${currentUser}`;
const PERIOD_KEY = `ft_periods_${currentUser}`;
const CALORIE_KEY = `ft_calories_${currentUser}`;
const isFemale = sessionStorage.getItem('ft_gender') === 'female';

document.getElementById('username-display').textContent = currentUser;
document.getElementById('logout-btn').addEventListener('click', () => {
  sessionStorage.removeItem('ft_user');
  window.location.href = 'login.html';
});

// --- Tab switching ---

const mainTabs = document.querySelectorAll('.main-tab');
const tabLog = document.getElementById('tab-log');
const tabHeatmap = document.getElementById('tab-heatmap');
const tabCalories = document.getElementById('tab-calories');

mainTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    mainTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const target = tab.dataset.tab;
    tabLog.hidden = target !== 'log';
    tabHeatmap.hidden = target !== 'heatmap';
    tabCalories.hidden = target !== 'calories';
    if (target === 'heatmap') {
      if (isFemale) {
        renderPhaseBanner();
        renderPeriodHistory();
      }
      renderHeatmap();
    }
    if (target === 'calories') renderCalorieLog();
  });
});

if (!isFemale) {
  document.getElementById('phase-banner').hidden = true;
  document.querySelector('.period-section').hidden = true;
  document.getElementById('period-prompt').hidden = true;
  document.getElementById('phase-legend').hidden = true;
}

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

// --- Period & cycle phase ---

const PHASES = {
  menstrual:  { label: 'Menstrual Phase',  tip: 'Low energy — rest, yoga, or gentle walks',          emoji: '🌑', insight: "You're in your menstrual phase — rest, gentle yoga, or short walks tend to feel best right now." },
  follicular: { label: 'Follicular Phase', tip: 'Rising energy — great for cardio & strength',        emoji: '🌒', insight: "You're in your follicular phase — rising energy makes this a great time for cardio and strength." },
  ovulation:  { label: 'Ovulation',        tip: 'Peak performance — ideal for HIIT & heavy lifting',  emoji: '🌕', insight: "You're in your ovulation phase — peak energy means HIIT and heavy lifting are ideal right now." },
  luteal:     { label: 'Luteal Phase',     tip: 'Winding down — moderate exercise, avoid overtraining', emoji: '🌖', insight: "You're in your luteal phase — lighter movement like walks or yoga tends to feel best right now." },
};

function loadPeriods() {
  return JSON.parse(localStorage.getItem(PERIOD_KEY) || '[]');
}

function savePeriods(periods) {
  localStorage.setItem(PERIOD_KEY, JSON.stringify(periods));
}

function getPhaseForCycleDay(cycleDay, cycleLength, periodLength) {
  const pl = periodLength || 5;
  const cl = cycleLength || 28;
  const ovulationDay = cl - 14;

  if (cycleDay <= pl)               return 'menstrual';
  if (cycleDay < ovulationDay)      return 'follicular';
  if (cycleDay <= ovulationDay + 1) return 'ovulation';
  return 'luteal';
}

// Returns { phase, cycleDay } for a "YYYY-MM-DD" string, or null if no period data.
function getPhaseForDate(dateStr, periods) {
  if (!periods.length) return null;

  const target = new Date(dateStr + 'T00:00:00');
  // Use the most recent period that started on or before the target date
  const sorted = periods.slice().sort((a, b) => a.startDate.localeCompare(b.startDate));

  for (let i = sorted.length - 1; i >= 0; i--) {
    const entry = sorted[i];
    const start = new Date(entry.startDate + 'T00:00:00');
    if (start > target) continue;

    const cl = entry.cycleLength || 28;
    const pl = entry.periodLength || 5;
    const dayDiff = Math.round((target - start) / 86400000);
    const cycleDay = (dayDiff % cl) + 1;

    return { phase: getPhaseForCycleDay(cycleDay, cl, pl), cycleDay };
  }

  return null;
}

function todayStr() {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mm}-${dd}`;
}

function renderPhaseBanner() {
  const periods = loadPeriods();
  const banner = document.getElementById('phase-banner');

  if (!periods.length) {
    banner.hidden = true;
    renderCycleInsight();
    return;
  }

  const result = getPhaseForDate(todayStr(), periods);
  if (!result) {
    banner.hidden = true;
    renderCycleInsight();
    return;
  }

  const { phase, cycleDay } = result;
  const info = PHASES[phase];
  const inner = document.getElementById('phase-banner-inner');

  inner.dataset.phase = phase;
  document.getElementById('phase-banner-label').textContent = info.label;
  document.getElementById('phase-banner-day').textContent = `Day ${cycleDay} of your cycle`;
  document.getElementById('phase-banner-tip').textContent = info.tip;
  document.getElementById('phase-banner-badge').textContent = info.emoji;

  banner.hidden = false;
  renderCycleInsight();
}

function renderCycleInsight() {
  const insightBox = document.getElementById('cycle-insight');
  if (!isFemale) {
    insightBox.hidden = true;
    return;
  }

  const periods = loadPeriods();
  if (!periods.length) {
    insightBox.hidden = true;
    return;
  }

  const result = getPhaseForDate(todayStr(), periods);
  if (!result) {
    insightBox.hidden = true;
    return;
  }

  const info = PHASES[result.phase];
  document.getElementById('cycle-insight-text').textContent = info.insight;
  insightBox.hidden = false;
}

// --- Period form ---

document.getElementById('period-start').valueAsDate = new Date();

document.getElementById('period-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const periods = loadPeriods();
  const startDate = document.getElementById('period-start').value;

  // Avoid duplicate entries for the same start date
  const existing = periods.findIndex(p => p.startDate === startDate);
  const entry = {
    startDate,
    cycleLength: parseInt(document.getElementById('cycle-length').value, 10) || 28,
    periodLength: parseInt(document.getElementById('period-length').value, 10) || 5,
  };

  if (existing >= 0) {
    periods[existing] = entry;
  } else {
    periods.push(entry);
  }

  savePeriods(periods);
  renderPhaseBanner();
  renderPeriodHistory();
  renderHeatmap();
  document.getElementById('period-details').open = false;
});

function renderPeriodHistory() {
  const periods = loadPeriods();
  const countEl = document.getElementById('period-entry-count');
  countEl.textContent = periods.length ? `${periods.length} entr${periods.length > 1 ? 'ies' : 'y'}` : '';

  const histEl = document.getElementById('period-history');
  histEl.innerHTML = '';

  if (!periods.length) return;

  periods.slice().sort((a, b) => b.startDate.localeCompare(a.startDate)).forEach((entry) => {
    const li = document.createElement('li');
    li.className = 'period-history-item';
    li.innerHTML = `
      <span class="period-history-dot"></span>
      <span class="period-history-info">
        <strong>${formatDate(entry.startDate)}</strong>
        <span>${entry.cycleLength}-day cycle · ${entry.periodLength}-day period</span>
      </span>
      <button class="delete" aria-label="Delete entry" data-start="${entry.startDate}">&times;</button>
    `;
    histEl.appendChild(li);
  });
}

document.getElementById('period-history').addEventListener('click', (e) => {
  const btn = e.target.closest('.delete');
  if (!btn) return;
  const periods = loadPeriods().filter(p => p.startDate !== btn.dataset.start);
  savePeriods(periods);
  renderPhaseBanner();
  renderPeriodHistory();
  renderHeatmap();
});

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
  const periods = loadPeriods();
  const today = todayStr();

  // Count workouts per date for this month
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
  const firstDayRaw = new Date(heatmapYear, heatmapMonth, 1).getDay();
  const startOffset = (firstDayRaw + 6) % 7;

  const cells = document.getElementById('heatmap-cells');
  cells.innerHTML = '';

  for (let i = 0; i < startOffset; i++) {
    const empty = document.createElement('div');
    empty.className = 'heatmap-cell empty';
    cells.appendChild(empty);
  }

  let activeDays = 0;
  let totalWorkouts = 0;
  const hasPeriodData = periods.length > 0;

  document.getElementById('period-prompt').hidden = hasPeriodData;

  for (let day = 1; day <= daysInMonth; day++) {
    const mm = String(heatmapMonth + 1).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    const dateStr = `${heatmapYear}-${mm}-${dd}`;
    const count = countByDay[dateStr] || 0;

    if (count > 0) activeDays++;
    totalWorkouts += count;

    const phaseResult = isFemale ? getPhaseForDate(dateStr, periods) : null;

    const cell = document.createElement('div');
    cell.className = 'heatmap-cell' + (dateStr === today ? ' today' : '');
    if (phaseResult) cell.dataset.phase = phaseResult.phase;

    const phaseLabel = phaseResult ? PHASES[phaseResult.phase].label : '';
    const workoutLabel = count === 0 ? 'no workout' : `${count} workout${count > 1 ? 's' : ''}`;
    cell.title = `${formatDate(dateStr)}${phaseLabel ? ' · ' + phaseLabel : ''} · ${workoutLabel}`;

    cell.innerHTML = `
      <span class="cell-day-num">${day}</span>
      ${count > 0 ? '<span class="cell-workout-dot"></span>' : ''}
    `;

    cells.appendChild(cell);
  }

  document.getElementById('heatmap-summary').textContent =
    `${activeDays} active day${activeDays !== 1 ? 's' : ''} · ${totalWorkouts} workout${totalWorkouts !== 1 ? 's' : ''} this month`;

  if (isFemale) renderCycleInsight();
}

// --- Calories ---

const MEAL_ORDER = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];

function loadCalories() {
  return JSON.parse(localStorage.getItem(CALORIE_KEY) || '[]');
}

function saveCalories(entries) {
  localStorage.setItem(CALORIE_KEY, JSON.stringify(entries));
}

let calViewDate = todayStr();

document.getElementById('food-date').value = todayStr();

document.getElementById('cal-prev-day').addEventListener('click', () => {
  const d = new Date(calViewDate + 'T00:00:00');
  d.setDate(d.getDate() - 1);
  calViewDate = d.toISOString().slice(0, 10);
  renderCalorieLog();
});

document.getElementById('cal-next-day').addEventListener('click', () => {
  const d = new Date(calViewDate + 'T00:00:00');
  d.setDate(d.getDate() + 1);
  calViewDate = d.toISOString().slice(0, 10);
  renderCalorieLog();
});

document.getElementById('calorie-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const entries = loadCalories();
  entries.push({
    id: Date.now(),
    date: document.getElementById('food-date').value,
    food: document.getElementById('food-name').value.trim(),
    calories: parseInt(document.getElementById('food-calories').value, 10),
    meal: document.getElementById('meal-type').value,
  });
  saveCalories(entries);
  calViewDate = document.getElementById('food-date').value;
  document.getElementById('food-name').value = '';
  document.getElementById('food-calories').value = '';
  document.getElementById('food-description').value = '';
  hideBreakdown();
  renderCalorieLog();
});

document.getElementById('calorie-list').addEventListener('click', (e) => {
  const btn = e.target.closest('.delete');
  if (!btn) return;
  const id = parseInt(btn.dataset.id, 10);
  saveCalories(loadCalories().filter(e => e.id !== id));
  renderCalorieLog();
});

function renderCalorieLog() {
  const all = loadCalories();
  const dayEntries = all.filter(e => e.date === calViewDate);

  document.getElementById('calorie-date-title').textContent = formatDate(calViewDate);

  const total = dayEntries.reduce((sum, e) => sum + e.calories, 0);
  document.getElementById('calorie-total').textContent = `${total.toLocaleString()} kcal`;

  const listEl = document.getElementById('calorie-list');
  listEl.innerHTML = '';

  const emptyEl = document.getElementById('calorie-empty');
  if (!dayEntries.length) {
    emptyEl.hidden = false;
    return;
  }
  emptyEl.hidden = true;

  const grouped = {};
  dayEntries.forEach(e => {
    if (!grouped[e.meal]) grouped[e.meal] = [];
    grouped[e.meal].push(e);
  });

  MEAL_ORDER.forEach(meal => {
    if (!grouped[meal]) return;

    const mealHeader = document.createElement('li');
    mealHeader.className = 'calorie-meal-header';
    mealHeader.textContent = meal;
    listEl.appendChild(mealHeader);

    grouped[meal].forEach(entry => {
      const li = document.createElement('li');
      li.className = 'calorie-item';
      li.innerHTML = `
        <span class="calorie-food">${entry.food}</span>
        <span class="calorie-kcal">${entry.calories.toLocaleString()} kcal</span>
        <button class="delete" aria-label="Delete" data-id="${entry.id}">&times;</button>
      `;
      listEl.appendChild(li);
    });
  });
}

// --- Calorie estimation (local food database) ---

function hideBreakdown() {
  document.getElementById('estimate-breakdown').hidden = true;
  document.getElementById('breakdown-list').innerHTML = '';
  document.getElementById('breakdown-note').textContent = '';
  document.getElementById('estimate-status').textContent = '';
}

function showBreakdown(items, total) {
  const bList = document.getElementById('breakdown-list');
  const bTotal = document.getElementById('breakdown-total-val');
  const bNote = document.getElementById('breakdown-note');

  bList.innerHTML = '';
  items.forEach(item => {
    const li = document.createElement('li');
    const label = item.size ? `${item.size} ${item.displayName}` : item.displayName;
    const qty = item.qty !== 1 ? `×${item.qty}` : '';
    const unit = item.unit ? item.unit : '';
    const detail = [qty, unit].filter(Boolean).join(' ');
    li.innerHTML = `
      <span>${label}${detail ? ' <small>(' + detail + ')</small>' : ''}</span>
      <span>${item.calories !== null ? item.calories + ' kcal' : '?'}</span>
    `;
    if (!item.matched) li.classList.add('unmatched');
    bList.appendChild(li);
  });

  bTotal.textContent = `~${total} kcal`;
  const unmatched = items.filter(i => !i.matched).map(i => i.raw);
  bNote.textContent = unmatched.length
    ? `Could not find: ${unmatched.join(', ')}. Enter calories manually.`
    : '';

  document.getElementById('estimate-breakdown').hidden = false;
}

// Live hint below food-name input
const foodNameInput = document.getElementById('food-name');
const liveHint = document.createElement('span');
liveHint.className = 'live-calorie-hint';
foodNameInput.parentNode.appendChild(liveHint);

foodNameInput.addEventListener('input', () => {
  const result = quickLookup(foodNameInput.value.trim());
  liveHint.textContent = result ? `≈ ${result.calories} kcal` : '';
});

document.getElementById('estimate-btn').addEventListener('click', () => {
  const foodName = document.getElementById('food-name').value.trim();
  const description = document.getElementById('food-description').value.trim();
  const source = description || foodName;

  if (!source) {
    document.getElementById('estimate-status').textContent = 'Enter a food item or ingredients first.';
    return;
  }

  document.getElementById('estimate-status').textContent = '';
  hideBreakdown();

  const items = parseIngredientList(source);
  const total = items.reduce((sum, i) => sum + (i.calories || 0), 0);
  showBreakdown(items, total);
  document.getElementById('food-calories').value = total;
});

document.getElementById('use-estimate-btn').addEventListener('click', () => {
  hideBreakdown();
});

document.getElementById('dismiss-estimate-btn').addEventListener('click', () => {
  document.getElementById('food-calories').value = '';
  hideBreakdown();
});
