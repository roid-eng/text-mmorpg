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

## 10. Story

### 10.1 핵심 테마

봉인된 신의 흔적을 쫓는 여정.  
평범한 인간이지만 고대 신의 기운을 감지하는 능력을 가진 플레이어가  
세계 곳곳에 남겨진 신의 흔적을 따라 진실을 향해 나아간다.

### 10.2 메인 스토리 구조 (5막 단일 엔딩)

#### 1막 — 균열의 시작 (아르단 마을 / 아르단 평야)
- **배경**: 아르단 마을에 이상 징후 발생. 평야의 몬스터가 갑자기 흉포해짐.
- **NPC**: 마을 장로 에르난 — 고대 신의 전쟁 이야기 전달, 첫 임무 부여
- **보스**: 광폭화된 평야의 군주 (아르단 평야)
- **클리어 조건**: 보스 처치 퀘스트 완료
- **스토리**: 보스 처치 후 신의 봉인이 약해지고 있다는 단서 발견

#### 2막 — 타락한 숲 (실바란 고목숲)
- **배경**: 고목숲에서 봉인의 균열 발견. 고대 신 실바란의 흔적.
- **NPC**: 숲 정령 실바 — 봉인 균열 위치 안내, 단서 제공
- **보스**: 타락한 숲의 수호자 (실바란 고목숲)
- **클리어 조건**: 보스 처치 퀘스트 완료
- **스토리**: 균열의 근원이 동쪽 불의 신 이그나르 봉인지임을 알게 됨

#### 3막 — 불의 봉인 (이그나르의 균열)
- **배경**: 불의 신 이그나르의 봉인이 약해지면서 균열이 넓어지고 있음.
- **NPC**: 균열의 수호자 카엔 — 봉인 약화 경고, 고성으로 향하라는 지시
- **보스**: 이그나르의 파편 (이그나르의 균열)
- **클리어 조건**: 보스 처치 퀘스트 완료
- **스토리**: 봉인을 강화하려면 고성의 기록이 필요함을 알게 됨

#### 4막 — 전쟁의 기록 (아르카넨 고성)
- **배경**: 고성에서 신들의 전쟁 기록 발견. 신들을 봉인한 것은 인간 영웅들.
- **NPC**: 망자의 기록관 — 신들의 전쟁 진실 공개, 플레이어 정체 암시
- **보스**: 고성의 군주 (아르카넨 고성)
- **클리어 조건**: 보스 처치 퀘스트 완료
- **스토리**: 플레이어가 봉인을 만든 영웅의 후손임을 알게 됨. 제단으로 향하라.

#### 5막 — 망각의 끝 (망각의 제단)
- **배경**: 봉인된 신의 힘이 가장 강하게 남아있는 제단. 현실이 일그러지기 시작.
- **NPC**: 봉인의 마지막 수호자 — 최종 진실 공개, 결전 준비
- **보스**: 봉인된 신의 화신 (망각의 제단) — 최종 보스
- **클리어 조건**: 최종 보스 처치 퀘스트 완료
- **스토리**: 봉인 강화 완료. 세계가 안정을 되찾음. 그러나 새로운 위협의 씨앗이 남음.

### 10.3 보스 시스템

- 각 막마다 보스 1종 (총 5보스)
- 일반 몬스터보다 HP/ATK 3배
- HP 30% 이하 시 분노 페이즈 → ATK 1.5배 증가
- 보스 처치 시 희귀 장비 드롭 보장
- 보스는 스토리 퀘스트로만 접근 가능

### 10.4 NPC 목록

| NPC | 위치 | 역할 |
|-----|------|------|
| 장로 에르난 | 아르단 마을 | 1막 퀘스트 부여, 세계관 안내 |
| 숲 정령 실바 | 실바란 고목숲 | 2막 단서 제공 |
| 균열의 수호자 카엔 | 이그나르의 균열 | 3막 경고 및 안내 |
| 망자의 기록관 | 아르카넨 고성 | 4막 진실 공개 |
| 봉인의 마지막 수호자 | 망각의 제단 | 5막 최종 NPC |

### 10.5 엔드게임 콘텐츠 (5막 클리어 후)

- 장비 강화 시스템
- 랭킹 경쟁
- **PvP 결투장** (비동기 방식)
  - 포인트 기반 티어 (초기 1,000점 / 승리 +25 / 패배 -15)
  - 티어: 브론즈 (0–999) / 실버 (1,000–1,499) / 골드 (1,500–1,999) / 챔피언 (2,000+)
  - 같은 상대 1일 3회 제한 (어뷰징 방지)
- **본토 확장** (신규 지역, 레벨 31–50) — 추후 업데이트

---

## 11. Onboarding

- Short tutorial quest on first login — introduces core systems through NPC-guided play.
- Skippable for returning or experienced players.
- NPC delivers the world's first impression and sets narrative tone.

---

## 12. Multiplayer Features

### Phase 1
- **Global chat**: Asynchronous text chat visible to all players.
- **Ranking system**: Leaderboards by level and combat power.

### Phase 2
- Trading post (player-to-player item exchange)
- Party system
- Guild system

---

## 13. Monetization

- **Model**: Free-to-play with optional purchases — no pay-to-win.
- **Principle**: Purchasable items must not affect game balance or progression speed.

| Phase | Items |
|---|---|
| Phase 1 | Costumes, inventory expansion slots, additional character slots |
| Phase 2 (review) | XP / drop rate boosters (balance review required before adding) |

---

## 14. Localization

- **Supported languages at launch**: English (EN), Korean (KO)
- Language selection available at account creation and in settings.
- All quest text, NPC dialogue, item descriptions, and UI strings fully localized.
- Korean lore text will maintain a classical/literary register consistent with the world's atmosphere.

---

## 15. Next Steps

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
- [x] 전투 시스템 (턴제 + 자동 진행)
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
- [x] 스킬 시스템 구현 (직업별 고정 스킬셋, 레벨업 해금)
- [x] 스킬 버튼 전투 패널 연동
- [x] 자동 전투 + 스킬 선택 개입 방식
- [x] 전투 로그 중복 제거
- [x] REST CON/WIZ 기반 서서히 회복 구현
- [x] 실바란 고목숲 몬스터 4종 추가
- [x] 레벨 16~30 지역 3개 추가 (이그나르의 균열 / 아르카넨 고성 / 망각의 제단)
- [x] 레벨 16~30 몬스터 9종 추가
- [x] 레벨 16~30 고급 장비 9종 추가
- [x] 장비 ATK/DEF 보너스 전투 미반영 버그 수정
- [x] GitHub Pages 배포 완료 (PC 웹 / 모바일 브라우저)
- [x] 회원가입 중복 INSERT 버그 수정 (upsert)
- [x] 몬스터 선택 모달 UI 분리
- [x] 골드 시스템 추가 (몬스터 처치 시 ±30% 랜덤 획득)
- [x] 상점 시스템 구현 (구매/매입 탭)
- [x] 소비 아이템 3종 추가 (체력 회복제/고급/귀환 주문서)
- [x] 장착 중 아이템 매입 불가 처리
- [x] 이메일 인증 OFF 확정 (소프트 런치 단계)
- [x] ASCII 비주얼 (전투 패널 몬스터 아트, 지역 헤더)
- [x] 전투 패널 모달 방식으로 변경
- [x] PC 3컬럼 레이아웃 (스탯/메인/맵)
- [x] 노드 맵 추가 (클릭 이동 포함)
- [x] EXP 바 추가 (스탯 패널)
- [x] 사이드 채팅 상시 표시 (PC)
- [x] 채팅 모달 (모바일)
- [x] 모바일 버튼 1열 개선
- [x] 발신자명 캐릭터명으로 변경
- [x] ASCII 아트 순수 ASCII 버전으로 교체
- [x] Supabase ranking 뷰 보안 경고 수정 (SECURITY INVOKER)
- [x] 아르단 마을 지역 추가 (zone_id=6)
- [x] 마을 UI 구현 (EXPLORE 비활성화, 마을 시설 패널, REST 2배)
- [x] 상점 마을 전용으로 변경 (SHOP 버튼 마을에서만 활성화)
- [x] 상점 모달 타이틀 동적 표시 (마을별 상점명)
- [x] 몬스터 레벨 시스템 추가 (level 컬럼)
- [x] EXP 레벨차 보정 로직 (±3/5 레벨 기준 배율 적용)
- [x] 신규 몬스터 9종 추가 (슬라임, 오크, 오크 궁수, 독버섯 포자, 오크 전사, 좀비, 해골)
- [x] ASCII 아트 신규 몬스터 7종 추가
- [x] 캐릭터 시작 지역 아르단 마을로 변경
- [x] 패배 시 부활 지역 아르단 마을로 변경 (동적 마을명 표시)
- [x] 퀘스트 시스템 구현 (일일 퀘스트 게시판, 몬스터/탐험 퀘스트 11종)
- [x] 퀘스트 진행 추적 (전투 승리/지역 진입 시 자동 업데이트)
- [x] 퀘스트 보상 수령 (EXP/Gold 지급)
- [x] 퀘스트 중복 수령 방지 (RLS DELETE 정책 추가)
- [x] 지역 묘사 중복 출력 방지 (같은 지역 재진입 시 생략)
- [x] 스토리라인 기획 (5막 구조, NPC, 보스, 엔드게임)
- [x] NPC 시스템 DB 구축 (npcs, npc_dialogues 테이블)
- [x] NPC 대화창 UI 구현 (타이핑 효과, 하단 고정)
- [x] 장로 에르난 대사 추가 (1막 스토리 시작)
- [x] 마을 시설 모달 분리
- [x] 상점 마을 시설로 이전
- [x] 보스 몬스터 5종 추가 (is_boss 컬럼, 분노 페이즈 HP 30%)
- [x] 보스 도전 버튼 (지역별 보스 표시)
- [x] 스토리 퀘스트 시스템 구현 (1막 퀘스트 3개)
- [x] NPC 퀘스트 수락/거절 UI
- [x] NPC 재대화 진행 상태별 대사 (DB 관리)
- [x] dialogue_type 컬럼 추가 (NPC 대사 분류 체계)
- [x] NPC 대사 DB 관리 원칙 확정 (CLAUDE.md 반영)
- [x] 퀘스트 모달 스크롤 처리
- [x] 모바일 스탯 표시 바 형태로 개선 (HP/MP/EXP 바, ATK/DEF/Gold)
- [x] 게스트 모드 추가 (익명 로그인, 레벨 5 이메일 연동 유도)
- [x] PC 모드 로그아웃 버튼 추가
- [x] 몬스터 SVG 실루엣 시스템 구현 (25종 전체)
- [x] 전투 모달 ASCII 아트 → SVG 실루엣으로 교체
- [x] 보스 SVG 빨간 눈 + 오러 이펙트

## 다음 세션 작업 목록 (우선순위 순)
- [ ] 게스트 인게임 이메일 연동 UI
- [ ] 퀘스트 목표 표시 개선 (대상 몬스터명 표시)
- [ ] 2~3막 스토리 콘텐츠 추가 (NPC, 대사, 퀘스트)
- [ ] 월드 확장 (지역 15~20개 목표)
- [ ] 스토리 볼륨 확장 플랜 (막당 퀘스트 3개 × 5막)
- [ ] 장비 강화 시스템
- [ ] PvP 결투장
- [ ] 동족 시스템
- [ ] Capacitor Android 빌드

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

*Last updated: 2026-04-13 (13차 세션)*
