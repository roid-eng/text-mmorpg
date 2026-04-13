/**
 * login.js — Login / signup screen handlers
 */

let isSignup = false;

function toggleForm() {
  isSignup = !isSignup;
  document.getElementById('login-form').style.display  = isSignup ? 'none'  : 'block';
  document.getElementById('signup-form').style.display = isSignup ? 'block' : 'none';
  document.getElementById('toggle-form').textContent   = isSignup
    ? 'Already have an account? Log in'
    : 'No account? Sign up';
}

async function handleLogin() {
  const email    = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;
  try {
    await Auth.signIn(email, password);
    location.reload();
  } catch (e) {
    document.getElementById('login-error').textContent = e.message;
  }
}

window.startAsGuest = async function() {
  const btn = document.querySelector('[onclick="startAsGuest()"]');
  if (btn) { btn.disabled = true; btn.textContent = '[ 접속 중... ]'; }

  const { data, error } = await Auth.signInAsGuest();
  if (error) {
    const errEl = document.getElementById('login-error');
    if (errEl) errEl.textContent = '게스트 접속에 실패했습니다.';
    if (btn) { btn.disabled = false; btn.textContent = '[ 게스트로 시작 ]'; }
    return;
  }
  location.reload();
};

async function handleSignup() {
  const username = document.getElementById('signup-username').value.trim();
  const email    = document.getElementById('signup-email').value.trim();
  const password = document.getElementById('signup-password').value;
  const language = document.getElementById('signup-lang').value;
  try {
    await Auth.signUp(email, password, username, language);
    location.reload();
  } catch (e) {
    document.getElementById('signup-error').textContent = e.message;
  }
}
