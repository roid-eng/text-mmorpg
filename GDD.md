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

## 완료된 작업
- [x] GDD Open Questions 전체 확정
- [x] 기술 스택 확정
- [x] 프로젝트 구조 세팅
- [x] Supabase 테이블 생성 + RLS 적용
- [x] 로그인/회원가입 구현
- [x] 캐릭터 생성 구현
- [x] 게임 화면 진입
- [x] EXPLORE / REST / INVENTORY / CHAT 기본 동작
- [x] 글로벌 채팅 Realtime 구현
- [x] 노드 방식 지역 이동 구현
- [x] 몬스터 조우 시스템 (선공 30% 확률)
- [x] 전투 시스템 (공격별 딜레이, 버튼 비활성화)
- [x] EXP 획득 및 레벨업 + 스탯 증가
- [x] 장비 드롭 시스템 (40% 확률)
- [x] 인벤토리 장착/해제 시스템
- [x] 장비 중복 장착 버그 수정
- [x] 헤더 지역명 표시
- [x] 랭킹 시스템 (레벨/EXP 기준 상위 20명)
- [x] 직업별 전투 공식 적용 (STR/DEX/INT/WIZ 연동)
- [x] 궁수 선제 공격 구현
- [x] 회피 시스템 (DEX 기반)
- [x] 전투 시뮬레이터 작성 및 밸런스 확인
- [x] 기본 장비 직업별 자동 지급
- [x] pg_cron 채팅 24시간 자동 삭제
- [x] 이메일 인증 트리거 생성 (검증 완료)
- [x] 전투 UI 개선 (전투 전용 패널, 색상 구분, HP바)
- [x] 전투 템포 개선 (공격별 딜레이, 페이드 인/아웃)
- [x] 전투 결과 메인 로그 출력
- [x] 스킬 버튼 슬롯 추가 (스킬 구현 후 연결 예정)

## 다음 세션 작업 목록 (우선순위 순)
- [ ] 스킬 시스템 구현 (직업별 고정 스킬셋, 레벨업 해금)
- [ ] REST 시스템 개선 (HP/MP 회복량 밸런스)
- [ ] GitHub Pages 배포
- [ ] Capacitor Android 빌드
- [ ] PC/모바일 반응형 UI 개선 (Aardwolf 레퍼런스)
- [ ] 출시 전 이메일 인증 최종 검증

---

## 레퍼런스

### Aardwolf MUD
- 장르: 클래식 텍스트 MUD (1996~현재)
- 참고 요소:
  - 노드 맵: 현재 위치 + 연결 방향 시각화 → PC UI 개선 시 참고
  - 스탯 표기: HP/MP 바 + 수치 동시 표시 → 헤더 개선 참고
  - 퀘스트 패널: 태스크 체크리스트 형태 → 온보딩 튜토리얼 참고
  - 채팅 채널: 채널별 색상 구분 → 글로벌 채팅 개선 참고
- 적용 계획:
  - 단기: 스탯 표기 방식 개선 (HP/MP 바 + 수치)
  - 중기: 노드 맵 시각화, 채팅 채널 구분
  - 장기: 퀘스트 패널, 멀티 패널 레이아웃

### CyberCode Online
- 장르: 텍스트 MMORPG (모바일)
- 평점: 4.8 / 설치: 100만+
- 참고 요소:
  - 비실시간 멀티플레이 구조
  - 부분 유료화 (밸런스 영향 없는 항목)
  - UI/UX 및 온보딩 설계

---

*Last updated: 2026-04-08 (5차 세션)*
