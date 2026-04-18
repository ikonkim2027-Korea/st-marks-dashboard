# Stage 2A — Widget Migrator A: Done

## Files created

| Path | Named export | Widget key | Accent | Legacy source |
|------|--------------|------------|--------|---------------|
| `src/components/widgets/canvas.tsx`    | `CanvasWidget`    | `canvas`    | `orange` | `src/components/CanvasAssignments.tsx` |
| `src/components/widgets/lunch.tsx`     | `LunchWidget`     | `lunch`     | `gold`   | `src/components/LunchMenu.tsx` |
| `src/components/widgets/athletics.tsx` | `AthleticsWidget` | `athletics` | `navy`   | `src/components/Athletics.tsx` |
| `src/components/widgets/news.tsx`      | `NewsWidget`      | `news`      | `navy`   | `src/components/SchoolNews.tsx` |
| `src/components/widgets/calendar.tsx`  | `CalendarWidget`  | `calendar`  | `gold`   | `src/components/CalendarWidget.tsx` |

All 5 files:
- Start with `"use client";`
- Use named exports only (no `export default`), per `_workspace/01_layout-architect_widget-api.md` §1
- Import `WidgetShell` via the relative `./widget-shell` path
- Replace the legacy top-level `<div className="widget-card">` (+ `divider-gold` + `label-micro` header block + external-link anchor) with `<WidgetShell title eyebrow accent href hrefLabel headerExtra>`
- Preserve legacy colors (`sm-navy`, `sm-gold`, `sm-text`, `sm-border`, `sm-danger`, `sm-success`, `sm-cream`, `sm-text-muted`, `sm-text-light`, `sm-navy-light`). No new tokens introduced.
- Keep all original data/logic intact (Canvas token storage + `/api/canvas` fetch, Lunch tab state + mock menu, Athletics mock events, News `/api/news` fetch + featured/rest split, Calendar mock events).
- Use the shell's built-in `h-full w-full` fill; no external sizing applied.

## Deviations from the task brief (contract takes precedence)

The contract in `_workspace/01_layout-architect_widget-api.md` and the brief handed to this agent disagree in two places. In both cases, I followed the contract because section 1 ("No default exports") and section 4 (the accent table) are unambiguous and the grid statically imports by named export.

1. **Canvas accent.** Brief says `navy`; contract §4 says `orange`. Used `orange`.
2. **Export style.** The `widget-migrator-a.md` agent file says "`export default` 유지"; contract §1 says "one named export per file. No default exports." Used named exports.

If the integrator actually needs defaults, swap `export function XWidget()` → `export default function XWidget()` in each file and the internal logic is unaffected.

## Drag-safety notes

- `WidgetShell` already wraps the `headerExtra + href` container with `onPointerDown` stopPropagation, so the Canvas settings/close buttons placed in `headerExtra` are safe. I additionally attached `onMouseDown={(e) => e.stopPropagation()}` on those two buttons as a belt-and-suspenders guard (the contract explicitly calls out this pattern in the brief's rule 3).
- No widget body places `.drag-handle` on a child.
- Lunch tabs, Calendar rows, News anchors, Athletics rows, and Canvas assignment links are all inside the body (not the header), so they are already drag-safe without extra handlers.

## Preserved behaviors (worth calling out for the integrator)

- **Canvas** still reads/writes `localStorage["sm-hub-canvas-config"]` directly — legacy key, distinct from the grid/temperature keys, safe to keep.
- **Canvas** now surfaces the pending count in the eyebrow (`ASSIGNMENTS · 03`) instead of the legacy gold pill chip, because the shell's eyebrow slot replaces the old header row. Pure visual adjustment; the count logic is identical.
- **Canvas** eyebrow switches to `CANVAS SETUP` while the setup form is open.
- **Lunch** exposes the FLIK link via `href/hrefLabel="Full Menu"` (was a custom ArrowUpRight link in-body). Rendered by the shell.
- **Athletics** exposes `Full Schedule` via `href`. `id="athletics"` hash-anchor from the legacy card was dropped — the grid owns cell layout now; restore it on the shell `<article>` later if nav linking is still needed.
- **Calendar** same pattern: `Full Calendar` href; `id="calendar"` dropped.
- **News** loading/empty/error states still render inside a fully-formed `WidgetShell` (previously only the populated state had a link). Consistent header across all 4 branches.

## Known open items / potential issues

1. `id="athletics"` and `id="calendar"` anchors no longer exist on the card itself. If the legacy `Header.tsx` (or any in-app nav) links to `#athletics` / `#calendar`, integrator should add the `id` back via a wrapper or extend `WidgetShell` with an optional `id` prop.
2. If the integrator wants defaults (see deviation #2), it is a 5-line trivial change; call me if that's desired.
3. Icons still imported from `lucide-react` and `next/image` is used in `news.tsx` — both already in the dep tree per the legacy components, so no `package.json` change expected.

## Not touched (per spec)

- Legacy files at `src/components/{CanvasAssignments,LunchMenu,Athletics,SchoolNews,CalendarWidget}.tsx` — integrator will retire in Stage 3.
- `src/app/page.tsx`, `src/app/globals.css`, Stage 1 outputs — untouched.
- No `npm` / dev server invocations.
