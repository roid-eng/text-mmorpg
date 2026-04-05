# Game Design Document — Mytharion

> Text MMORPG | Global Release (EN / KO) | Asynchronous Multiplayer

---

## 1. Overview

| Item | Detail |
|---|---|
| Title | Mytharion |
| Genre | Text MMORPG (classic MUD sensibility) |
| Platform | Android (launch) → PC / Web expansion |
| Target Audience | Global — English and Korean language support |
| Play Style | Non-realtime asynchronous multiplayer |
| Business Model | Free-to-play, no pay-to-win |

---

## 2. Tech Stack

| Layer | Choice |
|---|---|
| Frontend | Vanilla HTML / CSS / JS |
| Mobile Build | Capacitor (Android — primary launch target) |
| Backend / DB | Supabase free tier (existing project, table prefix: `text_mmorpg_`) |
| PC Hosting | GitHub Pages |
| Version Control | GitHub |

---

## 3. World & Lore

### 3.1 Setting — Mytharion

A single continent shaped by the aftermath of a war among ancient gods. The gods have either been sealed away or destroyed, but their essence and influence linger throughout the land — embedded in ruins, landscapes, creatures, and the memories of its people.

The world feels ancient and layered. Every region carries the weight of a forgotten age.

### 3.2 Core Themes

- **Remnants of divinity**: The gods are gone, but their power bleeds through the earth, sky, and sea.
- **Mystery over spectacle**: The world reveals itself through exploration and dialogue, not cutscenes.
- **Human resilience**: Players begin as ordinary people — greatness is earned, not given.

### 3.3 Geography

- **Single continent** divided into distinct biomes and zones based on natural terrain (forests, mountains, coastlines, wastelands, etc.)
- Zone progression: early zones (low level) → mid zones (world lore unfolds) → late zones (core divine remnants)
- Each zone houses one or more **factions** — civilizations, cults, orders, or remnants shaped by the god whose influence once touched that land.
- Entering a new region triggers a descriptive passage establishing its atmosphere and history.

---

## 4. Characters

### 4.1 Player Character

Players begin as an ordinary human with no special origin. Class is selected at character creation and determines starting stats, skill access, and narrative framing.

### 4.2 Classes

| Class | Role | Primary Stats |
|---|---|---|
| Warrior | Frontline melee, high durability | STR, CON |
| Mage | Ranged magic, high burst damage | INT, WIZ |
| Archer | Ranged physical, balanced offense | DEX, STR |
| Cleric | Support and healing, moderate combat | WIZ, CON |

### 4.3 Stats

| Stat | Full Name | Effect |
|---|---|---|
| STR | Strength | Physical attack power |
| CON | Constitution | Max HP |
| DEX | Dexterity | Hit chance, dodge chance |
| INT | Intelligence | Magic damage |
| WIZ | Wisdom | Max MP, MP regeneration |

- Each class has a **fixed stat distribution** that scales automatically on level-up.
- Players do not manually allocate stats — growth is fully automatic and class-driven.

### 4.4 Progression

- Experience from combat and quests → level-up → all stats increase by class-determined amounts.
- New skills unlock automatically at specific level thresholds.

---

## 5. Skills

- **Structure**: Each class has a fixed skill set — no cross-class skills.
- **Unlock**: Skills unlock automatically on level-up (no manual selection required).
- **Design intent**: Clear class identity and simplified balance management.

---

## 6. Combat

### 6.1 System

Combat is **semi-automated with skill intervention**:

- The base combat loop resolves automatically (auto-attack exchanges between player and enemy).
- Players may activate skills between rounds, consuming MP / triggering cooldowns.
- Designed for comfortable asynchronous play with meaningful moment-to-moment decisions.

### 6.2 Enemy Behavior

| Type | Behavior |
|---|---|
| Passive (비선공) | Will not initiate combat; only fight back if attacked by the player |
| Aggressive (선공) | Initiates combat automatically on proximity or zone entry |

- Each monster type has its own **lore description** displayed on encounter.
- Enemy difficulty is tied to zone level range.

### 6.3 Combat Flow

1. Player enters zone or selects a target
2. Enemy type and lore description displayed
3. Auto-combat begins, resolving round by round
4. Player may activate skills between rounds
5. Combat ends in victory, retreat, or defeat

---

## 7. Equipment & Items

### Phase 1
- **Equipment system**: Weapons and armor obtainable via monster drops and shop purchases.
- Stats on equipment affect combat numbers directly.

### Phase 2
- **Consumables**: Potions and other use-items added after core loop is stable.

---

## 8. Zones & World Structure

- Zones are gated by level range — players progress through them sequentially.
- **Early zones**: Low-level content, onboarding, world introduction.
- **Mid zones**: Story escalation, faction conflicts, world lore deepens.
- **Late zones**: Ruins and remnants tied directly to the gods' war — the narrative core.
- Each zone has its own natural environment, faction presence, and distinct monster roster.

---

## 9. Quests & Storytelling

### 9.1 Quest Types

| Type | Description |
|---|---|
| Main Quest | Central narrative — uncovering the truth behind the gods' war |
| Regional Quest | Zone-specific stories tied to local factions and divine remnants |
| Repeatable Quest | Daily/recurring tasks for XP, resources, and faction standing |

### 9.2 Narrative Principles

- **Zone entry descriptions**: Every region has a unique introductory text passage setting tone and history.
- **Monster lore**: Each enemy type has a distinct description connecting it to the world's mythology.
- **NPC dialogue**: All NPCs reflect the worldview and knowledge of their faction.
- Exposition is delivered through exploration and conversation, not system text walls.

### 9.3 Story Structure (High-level)

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

## 10. Onboarding

- Short tutorial quest on first login — introduces core systems through NPC-guided play.
- Skippable for returning or experienced players.
- NPC delivers the world's first impression and sets narrative tone.

---

## 11. Multiplayer Features

### Phase 1
- **Global chat**: Asynchronous text chat visible to all players.
- **Ranking system**: Leaderboards by level and combat power.

### Phase 2
- Trading post (player-to-player item exchange)
- Party system
- Guild system

---

## 12. Monetization

- **Model**: Free-to-play with optional purchases — no pay-to-win.
- **Principle**: Purchasable items must not affect game balance or progression speed.

| Phase | Items |
|---|---|
| Phase 1 | Costumes, inventory expansion slots, additional character slots |
| Phase 2 (review) | XP / drop rate boosters (balance review required before adding) |

---

## 13. Localization

- **Supported languages at launch**: English (EN), Korean (KO)
- Language selection available at account creation and in settings.
- All quest text, NPC dialogue, item descriptions, and UI strings fully localized.
- Korean lore text will maintain a classical/literary register consistent with the world's atmosphere.

---

## 14. Next Steps

- [x] Tech stack confirmed
- [x] GDD open questions resolved
- [ ] Core system prototype development — begin

---

*Last updated: 2026-04-05*
