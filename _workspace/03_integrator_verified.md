# Stage 3 — Integrator: Verified

## Reconciliation edits

### `src/app/page.tsx` — rewritten
Replaced the 12-col bento grid + inline footer with a single `<DashboardShell />` render. Footer is now owned by `DashboardShell` (Stage 1 contract).

```tsx
import { DashboardShell } from "@/components/dashboard/shell";
export default function Home() {
  return <DashboardShell />;
}
```

### `src/components/dashboard/grid.tsx` — anchor restoration + lint fix
1. **Nav anchors restored.** Migrator-a dropped `id="athletics"` / `id="calendar"` from the legacy cards. `header.tsx` still links to `#athletics`, `#calendar`, `#links`. Added an `ANCHOR_IDS` map (`athletics`, `calendar`, `quick-links`→`links`) applied to the widget cell wrapper. This keeps the contract clean: widgets don't know about ids; the grid owns layout.
2. **Dropped redundant `mounted` state.** `useLocalStorage` already returns a `hydrated` flag, so the extra `useEffect(() => setMounted(true), [])` was both noise and a lint violation (`react-hooks/set-state-in-effect`). Gate on `hydrated` alone.

### `src/components/dashboard/hero-banner.tsx` — clock rewritten to `useSyncExternalStore`
The original `useEffect(() => setNow(new Date()))` tripped the `set-state-in-effect` rule. Replaced with `useSyncExternalStore(subscribeMinute, getNowMs, getServerNowMs)`. Server snapshot returns 0 (sentinel) so the loading placeholder renders on SSR; first client snapshot is `Date.now()` rounded to the minute. No hydration mismatch, no redundant renders.

### `src/components/widgets/{athletics,calendar,lunch}.tsx` — lazy state init
All three had `const [x, setX] = useState([])` + `useEffect(() => setX(getMockX()), [])`. Collapsed to `const [x] = useState(() => getMockX())` — same result, one render, and no `set-state-in-effect` warning. Dropped the now-unused `useEffect` import.

### `src/components/dashboard/header.tsx`, `src/components/dashboard/shell.tsx`, `src/components/widgets/widget-shell.tsx`, `src/app/globals.css`
No edits needed. Verified:
- Stage 1's `.drag-handle` cursor utilities exist in globals.css.
- All legacy utilities preserved (`.widget-card`, `.display-number`, `.label-micro`, `.divider-gold`, `.hero-gradient`, `.tabular`, `.pulse-dot`).
- Header nav hrefs (`#athletics`, `#calendar`, `#links`) resolve via the grid's new `id` map.

## Deletions

All 11 legacy components removed from `src/components/`:
- `Athletics.tsx`
- `BlankPanel.tsx`
- `CalendarWidget.tsx`
- `CanvasAssignments.tsx`
- `Header.tsx`
- `HeroWeather.tsx`
- `InstagramPanel.tsx`
- `LunchMenu.tsx`
- `QuickLinks.tsx`
- `SchoolNews.tsx`
- `TodayOverview.tsx`

Nothing in the new `src/components/dashboard/**` or `src/components/widgets/**` tree references any of these — verified by grep before delete and by `tsc --noEmit` passing cleanly after.

## Export/import reconciliation — no changes needed

`grid.tsx` imports `{ WeatherWidget, CanvasWidget, LunchWidget, AthleticsWidget, NewsWidget, CalendarWidget, InstagramWidget, QuickLinksWidget, BlankWidget }` from `@/components/widgets/{key}`. All 9 widget files export the matching named symbol. Migrators honored the contract — no rename needed.

## Verification

| Check | Command | Result |
|-------|---------|--------|
| Install | `npm install` | 360 packages added, 0 vulnerabilities |
| TypeScript | `npx tsc --noEmit` | Zero errors |
| ESLint | `npm run lint` | Zero errors, zero warnings |

Initial lint run produced 9 `react-hooks/set-state-in-effect` errors (4 in soon-to-be-deleted legacy files, 5 in new files). All 5 in new files resolved via the rewrites above; the other 4 evaporated on legacy delete.

## Unresolved issues

None. Dev server not started per spec — user owns that pass. No `package.json` edits; no new deps introduced.

## Note on preview

A generic preview server is running in the parent working directory, but there is no st-marks-dashboard preview among the registered servers (`yiss-trackpoint:3333`, `sfs-crusaders:8801`). Browser-level verification is therefore out of scope; the build-level verification above stands.
