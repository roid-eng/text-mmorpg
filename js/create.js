/**
 * create.js — Character creation screen handlers
 */

const CLASS_DESC = {
  warrior: 'A seasoned fighter who endures through brute force and iron will.',
  mage:    'A scholar of arcane power, fragile in body but devastating in spell.',
  archer:  'A precise hunter who strikes from distance before the enemy can react.',
  cleric:  'A servant of forgotten gods, wielding healing and sacred force alike.',
};

function updateClassPreview() {
  const cls  = document.getElementById('char-class').value;
  const base = Character.CLASS_BASE[cls];
  const desc = CLASS_DESC[cls];
  document.getElementById('class-preview').innerHTML = `
    <p class="muted" style="margin-bottom:10px;">${desc}</p>
    <div style="display:grid; grid-template-columns: repeat(5,1fr); gap:8px; text-align:center;">
      ${Object.entries(base).map(([k, v]) => `
        <div>
          <div class="amber" style="font-size:0.75rem;">${k.replace('stat_', '').toUpperCase()}</div>
          <div>${v}</div>
        </div>`).join('')}
    </div>
  `;
}

async function handleCreate() {
  const name = document.getElementById('char-name').value.trim();
  const cls  = document.getElementById('char-class').value;
  if (!name) {
    document.getElementById('create-error').textContent = 'Name is required.';
    return;
  }
  try {
    const session = await Auth.getSession();
    await Character.create(session.user.id, name, cls);
    location.reload();
  } catch (e) {
    document.getElementById('create-error').textContent = e.message;
  }
}

updateClassPreview();
