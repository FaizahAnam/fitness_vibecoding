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

const form = document.getElementById('workout-form');
const list = document.getElementById('workouts');
const emptyState = document.getElementById('empty-state');

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
