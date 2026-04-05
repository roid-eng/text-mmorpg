/**
 * app.js — Application entry point
 * Initializes the app and routes to the correct screen.
 */

async function init() {
  const session = await Auth.getSession();
  if (!session) {
    loadScreen('screens/login.html');
    return;
  }

  const character = await Character.getActive(session.user.id);
  if (!character) {
    loadScreen('screens/create.html');
    return;
  }

  loadScreen('screens/game.html');
}

async function loadScreen(path) {
  const res = await fetch(path);
  const html = await res.text();
  document.getElementById('app').innerHTML = html;
}

document.addEventListener('DOMContentLoaded', init);
