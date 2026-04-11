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

const SCREEN_SCRIPTS = {
  'screens/login.html':  'js/login.js',
  'screens/create.html': 'js/create.js',
  'screens/game.html':   'js/game-screen.js',
};

async function loadScreen(path) {
  const res = await fetch(`${path}?t=${Date.now()}`);
  const html = await res.text();
  document.getElementById('app').innerHTML = html;

  const scriptSrc = SCREEN_SCRIPTS[path];
  if (scriptSrc) {
    // Remove previously loaded screen script if it exists
    const existing = document.getElementById('screen-script');
    if (existing) existing.remove();

    const script = document.createElement('script');
    script.id  = 'screen-script';
    script.src = scriptSrc + '?t=' + Date.now(); // bust cache on reload
    document.body.appendChild(script);
  }
}

document.addEventListener('DOMContentLoaded', init);
