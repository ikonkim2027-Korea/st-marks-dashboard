---
name: widget-migrator-b
description: Migrates 4 existing widgets + creates new WeatherWidget with C/F toggle. Handles Instagram, Blank, QuickLinks, and the WeatherWidget split from HeroWeather.
model: opus
---

# Widget Migrator B

기존 4개 컴포넌트 + 새 WeatherWidget(분리+C/F토글) 작성.

## 담당 위젯

| 새 파일 | 기존 소스 | widget key | accent | 비고 |
|---|---|---|---|---|
| `src/components/widgets/weather.tsx` | `HeroWeather.tsx` | `weather` | navy | °F/°C 토글, `useTemperatureUnit` hook 사용. 배경은 밝은 카드(hero가 아님), 숫자는 `sm-navy` |
| `src/components/widgets/instagram.tsx` | `InstagramPanel.tsx` | `instagram` | gold | |
| `src/components/widgets/quick-links.tsx` | `QuickLinks.tsx` | `quick-links` | navy | |
| `src/components/widgets/blank.tsx` | `BlankPanel.tsx` | `blank` | navy | |

## 작업 원칙

### WeatherWidget (중요)
- 기존 `/api/weather` 응답 타입 유지 (`temp`, `feelsLike`, `high`, `low`, `windSpeed` — 현재 °F)
- `useTemperatureUnit()`으로 현재 유닛 읽기 (`"F"` 또는 `"C"`)
- `convertTemp(value, "F", currentUnit)` 헬퍼로 렌더링 시점에 변환. API는 건드리지 않는다.
- 유닛 토글 버튼은 WidgetShell `headerExtra`에 배치 — 네모 버튼 두 개("°C" | "°F"), 현재 유닛만 active 스타일
- 전역 `stmarks-temp-unit` localStorage 통해 Header의 전역 토글과도 동기화 (useLocalStorage가 storage event listen하면 자동)
- 기존 HeroWeather가 가지던 5-hour 예보는 API가 주면 사용, 아니면 생략 가능

### 기타 3개
- 내용·기능 그대로, 최상위 `<div class="widget-card">`를 `<WidgetShell>`로 교체
- `BlankPanel`은 "Coming Soon" 플레이스홀더 — 그대로 유지

### 공통
- **CI 색 유지**: `sm-navy`, `sm-gold` 등 기존만 사용
- 드래그 간섭 방지: 버튼/링크는 `onMouseDown={e => e.stopPropagation()}`

## 입력/출력 프로토콜

입력:
- `_workspace/01_layout-architect_widget-api.md` — WidgetShell props/widget key/useTemperatureUnit 규약
- 기존 `src/components/{HeroWeather,InstagramPanel,QuickLinks,BlankPanel}.tsx`

출력:
- `src/components/widgets/{weather,instagram,quick-links,blank}.tsx`
- `_workspace/02_migrator-b_done.md` — 생성 파일 목록 + 위젯 key 매핑

## 기존 파일 처리

기존 파일 삭제 금지. integrator가 최종 정리.

## 이전 산출물이 있을 때

해당 widgets/ 파일이 이미 존재하면 읽고 gap 보완. 전체 재작성 금지.
