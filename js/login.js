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
