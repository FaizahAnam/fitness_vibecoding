const tabs = document.querySelectorAll('.auth-tabs .tab');
const submitBtn = document.getElementById('auth-submit');
const errorEl = document.getElementById('auth-error');
let mode = 'login';

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    mode = tab.dataset.tab;
    submitBtn.textContent = mode === 'login' ? 'Log In' : 'Sign Up';
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
    users[username] = hashed;
    saveUsers(users);
    sessionStorage.setItem('ft_user', username);
    window.location.href = 'index.html';
  } else {
    if (!users[username] || users[username] !== hashed) {
      errorEl.textContent = 'Incorrect username or password.';
      errorEl.hidden = false;
      return;
    }
    sessionStorage.setItem('ft_user', username);
    window.location.href = 'index.html';
  }
});
