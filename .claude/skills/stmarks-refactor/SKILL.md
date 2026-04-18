---
name: stmarks-refactor
description: Orchestrates the St. Mark's Dashboard refactor from a static bento grid to a drag-reorderable widget dashboard (YISS TrackPoint pattern), including C/F temperature toggle and CI/BI preservation. Use this skill whenever the user asks to refactor, redesign, extend, or fix the st-marks-dashboard — including follow-up requests like "re-run", "update widgets", "fix the grid", "change the weather toggle", or "개편", "다시", "수정", "보완".
---

# St. Mark's Dashboard Refactor Orchestrator

## 목표

기존 static 12-col bento grid 대시보드를, YISS TrackPoint 스타일의 드래그-재배치 가능한 위젯 대시보드로 개편. St. Mark's 공식 CI/BI(navy #003057 + gold #C4A442) 유지. 날씨 위젯에 °C/°F 토글 추가.

## 실행 모드

**하이브리드**:
- Stage 1: 서브 에이전트 1명 (`layout-architect`, `run_in_background: false`) — 파이프라인 시작점, 결과물을 Stage 2가 기다림
- Stage 2: 서브 에이전트 2명 병렬 (`widget-migrator-a`, `widget-migrator-b`, `run_in_background: true`) — 팬아웃
- Stage 3: 서브 에이전트 1명 (`integrator`, `run_in_background: false`) — 팬인 + 검증

팀 오버헤드 대비 실시간 통신 수요가 낮아 서브 에이전트 패턴 채택. 모든 에이전트 호출에 `model: "opus"` 명시.

## Phase 0: 컨텍스트 확인

오케스트레이터 시작 시:
1. `_workspace/` 존재 여부 확인
2. `_workspace/01_*.md`, `02_*.md`, `03_*.md` 각각 존재 여부로 실행 모드 판별:
   - 모두 없음 → **초기 실행** (Phase 1부터)
   - 일부 존재 + 사용자가 특정 Stage 재실행 요청 → **부분 재실행** (해당 Stage만)
   - 모두 존재 + 사용자가 새 요구사항 제공 → `_workspace/`를 `_workspace_prev_{YYYYMMDD_HHMM}/`로 이동 후 초기 실행

## Phase 1: Stage 1 — Infrastructure (순차)

**호출**: `Agent(subagent_type: "general-purpose", model: "opus", prompt: <아래>)`

프롬프트는 `.claude/agents/layout-architect.md` 전체를 inline으로 전달하고, 추가로:
- 현재 디렉토리 절대경로
- 기존 파일 목록 (특히 `src/components/*`, `src/app/page.tsx`, `src/app/globals.css`)
- 참고 패턴: `/Users/kevinmacbookpro/Documents/yiss-trackpoint/src/components/dashboard/{grid,shell,header,hero-banner}.tsx`, `widgets/widget-shell.tsx`, `lib/{storage,utils}.ts`

**완료 조건**: `_workspace/01_layout-architect_widget-api.md` 파일 존재 + 나열된 파일 모두 생성됨.

## Phase 2: Stage 2 — Widgets (병렬 팬아웃)

Phase 1 완료 후 `widget-migrator-a`와 `widget-migrator-b`를 **같은 메시지에서 동시에** 호출 (단일 메시지 내 두 Agent 블록).

각 호출에 해당 에이전트 정의 파일 전문 + `_workspace/01_layout-architect_widget-api.md` 내용 + 담당 기존 컴포넌트 파일 경로 inline 전달.

**완료 조건**: `_workspace/02_migrator-a_done.md` + `_workspace/02_migrator-b_done.md` 둘 다 존재, 9개 widget 파일 모두 생성됨.

## Phase 3: Stage 3 — Integration & Verify (순차)

Phase 2 완료 후 `integrator` 호출. 

**완료 조건**: `_workspace/03_integrator_verified.md` 존재, 빌드/린트 성공.

## 데이터 전달 프로토콜

- **파일 기반** (주): `_workspace/` 하위에 각 Stage 산출물 저장
- **반환값 기반** (보조): 각 서브 에이전트가 메인에 완료 요약 반환

## 에러 핸들링

- Stage 1 실패 → 중단, 사용자에게 원인 보고
- Stage 2 한쪽만 실패 → 성공한 쪽은 유지, 실패 쪽만 1회 재호출. 그래도 실패 시 Stage 3는 실패한 위젯을 제외하고 진행, integrator가 `_workspace/03_integrator_verified.md`에 누락 명시
- Stage 3 빌드 실패 → integrator가 1회 자체 수정 시도. 실패 시 원문 에러 + 추정 원인 보고서로 마감

## 테스트 시나리오

**정상 흐름:**
1. 사용자: "st marks dashboard 개편"
2. 오케스트레이터: Stage 1 → Stage 2 병렬 → Stage 3 → 빌드 성공
3. 결과: 드래그 가능한 위젯 그리드, °C/°F 토글 작동, CI/BI 유지

**에러 흐름:**
1. 사용자: "다시 실행해"
2. Phase 0: `_workspace/`를 `_workspace_prev_20260419_0147/`로 이동
3. Phase 1부터 재실행
4. Stage 2에서 widget-migrator-b가 `useTemperatureUnit` import 경로 실수 → 타입 에러
5. Stage 3 integrator가 import 경로 수정 → 빌드 성공

## 테스트 프롬프트

- "st marks dashboard 개편해줘"
- "대시보드 위젯 드래그로 재배치되게 바꿔줘"
- "날씨에 섭씨 토글 추가"
- "st marks 다시 실행"
- "위젯 레이아웃만 다시"
