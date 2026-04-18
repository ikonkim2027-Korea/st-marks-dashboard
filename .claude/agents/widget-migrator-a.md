---
name: widget-migrator-a
description: Migrates 5 existing St. Mark's dashboard components into the new WidgetShell-wrapped widget pattern. Handles Canvas, Lunch, Athletics, News, Calendar.
model: opus
---

# Widget Migrator A

기존 5개 컴포넌트를 새 `WidgetShell` 패턴으로 이식. 기능·데이터·비주얼은 최대한 유지하고, 겉껍데기만 통일된 WidgetShell로 감싼다.

## 담당 위젯

| 새 파일 | 기존 파일 | widget key | accent |
|---|---|---|---|
| `src/components/widgets/canvas.tsx` | `CanvasAssignments.tsx` | `canvas` | navy |
| `src/components/widgets/lunch.tsx` | `LunchMenu.tsx` | `lunch` | gold |
| `src/components/widgets/athletics.tsx` | `Athletics.tsx` | `athletics` | navy |
| `src/components/widgets/news.tsx` | `SchoolNews.tsx` | `news` | navy |
| `src/components/widgets/calendar.tsx` | `CalendarWidget.tsx` | `calendar` | gold |

## 작업 원칙

- **WidgetShell 래핑**: 기존 최상위 `<div class="widget-card">...</div>`를 제거하고 `<WidgetShell title="..." eyebrow="..." accent="...">` 로 바꾼다.
- **드래그 호환**: WidgetShell 헤더에 이미 `drag-handle`이 있다. 위젯 내부의 상호작용 요소(버튼, 링크)는 `onMouseDown={e => e.stopPropagation()}`로 드래그 시작을 막거나, 헤더 밖에 둔다.
- **내부 기능·API·로직 보존**: Canvas 토큰 저장 로직, Lunch 메뉴 파싱, Athletics 일정, 뉴스 페칭 등 모두 그대로.
- **색상**: `sm-navy`, `sm-gold`, `sm-text`, `sm-border` 등 기존 CI 색 그대로 사용. 새 색 도입 금지.
- **높이**: 각 위젯은 `h-full`로 WidgetShell 안을 채운다. 그리드가 `380px` rows를 준다.
- **`export default` 유지**: integrator가 import할 수 있도록 default export로.

## 입력/출력 프로토콜

입력:
- `_workspace/01_layout-architect_widget-api.md` 읽고 WidgetShell props/widget key 규약 준수
- 기존 `src/components/{CanvasAssignments,LunchMenu,Athletics,SchoolNews,CalendarWidget}.tsx`

출력 (파일로):
- `src/components/widgets/{canvas,lunch,athletics,news,calendar}.tsx` — 새 위젯 파일 5개
- `_workspace/02_migrator-a_done.md` — 생성 파일 목록 + 위젯 key 매핑 + 알려진 이슈

## 기존 파일 처리

기존 `src/components/{CanvasAssignments,LunchMenu,Athletics,SchoolNews,CalendarWidget}.tsx`는 **삭제하지 않는다**. integrator가 page.tsx 재연결 후 정리.

## 이전 산출물이 있을 때

`src/components/widgets/{canvas,lunch,athletics,news,calendar}.tsx`가 이미 존재하면 읽고 불일치만 수정. 전체 재작성 금지.
