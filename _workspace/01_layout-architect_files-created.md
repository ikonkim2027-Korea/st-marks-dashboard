# Stage 1 — Layout Architect: Files Created

All paths are relative to the repo root `st-marks-dashboard/`.

## Library helpers

| Path | Exports |
|------|---------|
| `src/lib/utils.ts` | `cn(...inputs)`, `formatTime(date, opts?)`, `formatDate(date, opts?)` |
| `src/lib/storage.ts` | `useLocalStorage<T>(key, initial)` — SSR-safe, cross-tab sync via `storage` event |
| `src/lib/temperature.ts` | `TempUnit` (type), `TEMP_UNIT_STORAGE_KEY`, `convertTemp(value, from, to)`, `useTemperatureUnit()` |

## Dashboard shell

| Path | Exports |
|------|---------|
| `src/components/dashboard/shell.tsx` | `DashboardShell` (default composition: header + hero + grid + footer) |
| `src/components/dashboard/header.tsx` | `DashboardHeader` — logo + nav + °F/°C toggle + Reset Layout button |
| `src/components/dashboard/hero-banner.tsx` | `HeroBanner` — campus photo + weekday headline (no weather) |
| `src/components/dashboard/grid.tsx` | `DashboardGrid`, `WidgetKey` (type) |

## Widget primitive

| Path | Exports |
|------|---------|
| `src/components/widgets/widget-shell.tsx` | `WidgetShell`, `WidgetShellProps` (type), `WidgetAccent` (type) |

## Modified files

| Path | Change |
|------|--------|
| `src/app/globals.css` | Added `.drag-handle { cursor: grab; touch-action: none }` + `:active { cursor: grabbing }` |

## Legacy files — NOT touched (per spec)

- `src/components/Header.tsx`
- `src/components/TodayOverview.tsx`
- `src/components/HeroWeather.tsx`
- `src/components/Athletics.tsx`
- `src/components/BlankPanel.tsx`
- `src/components/CalendarWidget.tsx`
- `src/components/CanvasAssignments.tsx`
- `src/components/InstagramPanel.tsx`
- `src/components/LunchMenu.tsx`
- `src/components/QuickLinks.tsx`
- `src/components/SchoolNews.tsx`
- `src/app/page.tsx`

Stage 2 widget-migrators will use these as references; Stage 3 integrator will retire them after `page.tsx` is swapped to `<DashboardShell />`.

## Build note for Stage 3

`grid.tsx` statically imports 9 widget components from `@/components/widgets/{key}`. These files do NOT exist yet — they are produced by Stage 2. Running `next build` before Stage 2 completes will fail with missing-module errors. The Stage 3 integrator should not run the build until both widget-migrator agents have finished and `src/components/widgets/{weather,canvas,lunch,athletics,news,calendar,instagram,quick-links,blank}.tsx` all exist.
