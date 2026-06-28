const tabs = document.querySelectorAll('.auth-tabs .tab');
const submitBtn = document.getElementById('auth-submit');
const errorEl = document.getElementById('auth-error');
const genderField = document.getElementById('gender-field');
let mode = 'login';

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    mode = tab.dataset.tab;
    submitBtn.textContent = mode === 'login' ? 'Log In' : 'Sign Up';
    genderField.hidden = mode !== 'signup';
    errorEl.hidden = true;
  });
});

function getUsers() {
  return JSON.parse(localStorage.getItem('ft_users') || '{}');
}

function saveUsers(users) {
  localStorage.setItem('ft_users', JSON.stringify(users));
}

function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (Math.imul(31, hash) + str.charCodeAt(i)) | 0;
  }
  return hash.toString(36);
}

// Supports legacy accounts stored as plain hash strings
function getUserData(users, username) {
  const entry = users[username];
  if (!entry) return null;
  if (typeof entry === 'string') return { password: entry, gender: null };
  return entry;
}

document.getElementById('auth-form').addEventListener('submit', (e) => {
  e.preventDefault();
  errorEl.hidden = true;

  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;
  const users = getUsers();
  const hashed = simpleHash(password);

  if (mode === 'signup') {
    if (users[username]) {
      errorEl.textContent = 'Username already taken. Try logging in.';
      errorEl.hidden = false;
      return;
    }
    const gender = document.querySelector('input[name="gender"]:checked')?.value;
    if (!gender) {
      errorEl.textContent = 'Please select Male or Female to continue.';
      errorEl.hidden = false;
      return;
    }
    users[username] = { password: hashed, gender };
    saveUsers(users);
    sessionStorage.setItem('ft_user', username);
    sessionStorage.setItem('ft_gender', gender);
    window.location.href = 'index.html';
  } else {
    const userData = getUserData(users, username);
    if (!userData || userData.password !== hashed) {
      errorEl.textContent = 'Incorrect username or password.';
      errorEl.hidden = false;
      return;
    }
    sessionStorage.setItem('ft_user', username);
    sessionStorage.setItem('ft_gender', userData.gender || '');
    window.location.href = 'index.html';
  }
});
