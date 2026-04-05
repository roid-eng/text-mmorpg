# Game Design Document — Mytharion

> Text MMORPG | Global Release (EN / KO) | Turn-based / Asynchronous

---

## 1. Overview

| Item | Detail |
|---|---|
| Title | Mytharion |
| Genre | Text MMORPG |
| Platform | Web / Mobile (text-based interface) |
| Target Audience | Global — English and Korean language support |
| Play Style | Non-realtime (asynchronous, turn-based interactions) |
| Business Model | Free-to-play with optional cosmetic/convenience purchases |

---

## 2. World & Lore

### 2.1 Setting — Mytharion

A single continent shaped by the aftermath of a war among ancient gods. The gods have either been sealed away or destroyed, but their essence and influence linger throughout the land — embedded in ruins, landscapes, creatures, and the memories of its people.

The world feels ancient and layered. Every region carries the weight of a forgotten age.

### 2.2 Core Themes

- **Remnants of divinity**: The gods are gone, but their power bleeds through the earth, sky, and sea.
- **Mystery over spectacle**: The world reveals itself through exploration and dialogue, not cutscenes.
- **Human resilience**: Players begin as ordinary people — greatness is earned, not given.

### 2.3 Geography

- **Single continent** divided into distinct biomes and zones based on natural terrain (forests, mountains, coastlines, wastelands, etc.)
- Each zone houses one or more **factions** — civilizations, cults, orders, or remnants shaped by the god whose influence once touched that land.
- Zones are discovered sequentially; entering a new region triggers a descriptive passage establishing its atmosphere and history.

---

## 3. Characters

### 3.1 Player Character

Players begin as an ordinary human with no special origin. Class is selected at character creation and determines starting stats, skill access, and narrative framing.

### 3.2 Classes

| Class | Role | Primary Stats |
|---|---|---|
| Warrior | Frontline melee, high durability | STR, CON |
| Mage | Ranged magic, high burst damage | INT, WIZ |
| Archer | Ranged physical, balanced offense | DEX, STR |
| Cleric | Support and healing, moderate combat | WIZ, CON |

### 3.3 Stats

| Stat | Full Name | Description |
|---|---|---|
| STR | Strength | Physical attack power |
| CON | Constitution | Max HP and physical defense |
| DEX | Dexterity | Attack speed, dodge chance, ranged accuracy |
| INT | Intelligence | Magic attack power and spell capacity |
| WIZ | Wisdom | Healing power, magic defense, and MP regeneration |

- Each class has a **fixed stat distribution** that scales automatically on level-up.
- Players do not manually allocate stats — growth is handled by the system based on class archetype.

### 3.4 Progression

- Characters advance through **level-up**, gained by accumulating experience from combat and quests.
- On each level-up, all stats increase by class-determined amounts automatically.
- New skills unlock at specific level thresholds.

---

## 4. Combat

### 4.1 System

Combat is **semi-automated with skill intervention**:

- The base combat loop resolves automatically (auto-attack exchanges between player and enemy).
- Players may **interrupt at any point** to activate skills, which consume resources (MP / cooldown) and alter the combat outcome.
- This design keeps pace comfortable for asynchronous play while preserving meaningful decisions.

### 4.2 Enemy Behavior

| Type | Behavior |
|---|---|
| Passive (비선공) | Will not initiate combat; only fight back if attacked |
| Aggressive (선공) | Initiates combat on proximity or zone entry |

- Each monster has its own **lore description** displayed on first encounter.
- Enemy difficulty is tied to zone level, not player level scaling.

### 4.3 Combat Flow

1. Player enters zone or initiates encounter
2. Enemy type and description displayed
3. Auto-combat begins, resolving in rounds
4. Player may activate skills between rounds
5. Combat ends in victory, retreat, or defeat

---

## 5. Quests & Story

### 5.1 Quest Types

| Type | Description |
|---|---|
| Main Quest | The central narrative — uncovering the truth behind the gods' war and its aftermath |
| Regional Quest | Zone-specific stories tied to local factions, history, and the god's remnant influence |
| Repeatable Quest | Daily/recurring tasks for resource gathering, faction standing, or grinding |

### 5.2 Narrative Principles

- **Zone entry descriptions**: Every region has a unique introductory text passage setting tone and history.
- **Monster lore**: Each enemy type has a distinct description connecting it to the world's mythology.
- **NPC dialogue**: All NPCs reflect the worldview and knowledge of their faction — no NPC speaks outside their narrative context.
- Exposition is delivered through exploration and conversation, never through walls of system text.

### 5.3 Story Structure (High-level)

```
Act 0 — The Ordinary World
  └─ Character creation, starting village, tutorial quests

Act 1 — The First Seal
  └─ Discovery of a god's ruin; introduction to the world's conflict

Act 2 — Factions & Power
  └─ Navigating competing factions, each with claims to divine relics

Act 3 — The Sealed Truth
  └─ Player uncovers the full history of the gods' war

Act 4 — Reckoning
  └─ Final confrontation; player choices shape the world's future
```

---

## 6. Monetization

- **Model**: Free-to-play with optional purchases (부분 유료화)
- **Principle**: No pay-to-win. Purchasable items must not affect game balance.
- **Planned categories** (details TBD):
  - Cosmetic items (appearance, titles, profile customization)
  - Convenience items (e.g., additional quest slots, storage expansion)
  - Premium story content or cosmetic region packs
- Specific item list and pricing will be determined in a later design phase.

---

## 7. Localization

- **Supported languages at launch**: English (EN), Korean (KO)
- Language selection available at account creation and in settings.
- All quest text, NPC dialogue, item descriptions, and UI strings will be fully localized.
- Lore tone in Korean will preserve a classical/literary register consistent with the world's atmosphere.

---

## 8. Open Questions / TBD

- [ ] Skill list per class (names, effects, unlock levels)
- [ ] Full zone list and zone order
- [ ] Faction list and faction relationship system
- [ ] Economy design (currency, trading, crafting)
- [ ] Social features (guilds, party play in async context)
- [ ] Specific monetization item list and pricing
- [ ] Platform and tech stack decision

---

*Last updated: 2026-04-05*
