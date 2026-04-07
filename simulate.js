/**
 * simulate.js — 직업별 전투 시뮬레이터
 * 실행: node simulate.js
 *
 * 직업 4개 × 아르단 평야 몬스터 3종 × 1000회 시뮬레이션
 */

// ── 직업별 기본 스탯 (character.js CLASS_BASE 동일) ──────────────────────
const CLASS_BASE = {
  warrior: { stat_str: 12, stat_con: 10, stat_dex: 6,  stat_int: 3,  stat_wiz: 4  },
  mage:    { stat_str: 4,  stat_con: 5,  stat_dex: 6,  stat_int: 12, stat_wiz: 10 },
  archer:  { stat_str: 8,  stat_con: 6,  stat_dex: 12, stat_int: 4,  stat_wiz: 5  },
  cleric:  { stat_str: 5,  stat_con: 8,  stat_dex: 5,  stat_int: 6,  stat_wiz: 12 },
};

function makeCharacter(cls) {
  const s = CLASS_BASE[cls];
  return {
    class:    cls,
    atk:      0,           // 장비 없음 기준
    def:      0,
    stat_str: s.stat_str,
    stat_con: s.stat_con,
    stat_dex: s.stat_dex,
    stat_int: s.stat_int,
    stat_wiz: s.stat_wiz,
    hp_max:   s.stat_con * 10,
    hp:       s.stat_con * 10,
  };
}

// ── 아르단 평야 몬스터 3종 ───────────────────────────────────────────────
const MONSTERS = [
  { name: '들쥐',    hp: 18, atk: 4,  def: 1, stat_con: 3 },
  { name: '늑대',    hp: 32, atk: 7,  def: 2, stat_con: 5 },
  { name: '오크 척후병', hp: 55, atk: 11, def: 5, stat_con: 8 },
];

// ── 전투 공식 (combat.js와 동일 로직) ────────────────────────────────────
function calcPlayerDmg(char, monsterDef, monsterCon) {
  const atk = char.atk;
  const cls = char.class;

  if (cls === 'mage' || cls === 'cleric') {
    const stat_int = cls === 'mage' ? char.stat_int : char.stat_wiz;
    return Math.max(1,
      Math.floor((atk + stat_int * 0.5) * (0.85 + Math.random() * 0.3))
    );
  } else {
    const atk_stat = cls === 'warrior' ? char.stat_str : char.stat_dex;
    return Math.max(1,
      Math.floor((atk + atk_stat * 0.5) * (0.85 + Math.random() * 0.3))
      - Math.floor(monsterDef + monsterCon * 0.3)
    );
  }
}

function calcMonsterDmg(monster, char) {
  const dodge_chance = Math.min(0.3, char.stat_dex * 0.005);
  if (Math.random() < dodge_chance) return 0;
  return Math.max(1, Math.floor(monster.atk * (0.85 + Math.random() * 0.3)));
}

// ── 단일 전투 시뮬레이션 (최대 200라운드) ────────────────────────────────
function simulate(cls, monster) {
  const char = makeCharacter(cls);
  const mob  = { ...monster };

  for (let round = 1; round <= 200; round++) {
    // 플레이어 공격
    mob.hp -= calcPlayerDmg(char, mob.def, mob.stat_con);
    if (mob.hp <= 0) return { outcome: 'victory', rounds: round, remainHp: char.hp };

    // 몬스터 공격
    char.hp -= calcMonsterDmg(mob, char);
    if (char.hp <= 0) return { outcome: 'defeat', rounds: round, remainHp: 0 };
  }
  return { outcome: 'timeout', rounds: 200, remainHp: char.hp };
}

// ── 메인: 1000회 반복 통계 ────────────────────────────────────────────────
const TRIALS = 1000;
const CLASSES = ['warrior', 'mage', 'archer', 'cleric'];

const CLASS_KO = { warrior: '전사', mage: '마법사', archer: '궁수', cleric: '성직자' };

console.log(`\n${'='.repeat(66)}`);
console.log(` 전투 시뮬레이터 — ${TRIALS}회 × 직업 4종 × 몬스터 3종`);
console.log(`${'='.repeat(66)}\n`);

for (const monster of MONSTERS) {
  console.log(`[ ${monster.name} ]  HP:${monster.hp} ATK:${monster.atk} DEF:${monster.def}`);
  console.log(`${'─'.repeat(56)}`);
  console.log(` ${'직업'.padEnd(8)} ${'승률'.padStart(6)}  ${'평균라운드'.padStart(8)}  ${'평균잔여HP'.padStart(10)}`);
  console.log(`${'─'.repeat(56)}`);

  for (const cls of CLASSES) {
    let wins = 0, totalRounds = 0, totalHp = 0;

    for (let i = 0; i < TRIALS; i++) {
      const r = simulate(cls, monster);
      if (r.outcome === 'victory') wins++;
      totalRounds += r.rounds;
      totalHp     += r.remainHp;
    }

    const winRate   = (wins / TRIALS * 100).toFixed(1) + '%';
    const avgRounds = (totalRounds / TRIALS).toFixed(1);
    const avgHp     = (totalHp / TRIALS).toFixed(1);

    console.log(` ${CLASS_KO[cls].padEnd(8)} ${winRate.padStart(6)}  ${avgRounds.padStart(8)}  ${avgHp.padStart(10)}`);
  }
  console.log();
}
