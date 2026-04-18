# 05 · UI/UX polish audit

Pass performed on 2026-04-19 against the running dev server (port 3357).
Preview screenshot / inspect tooling was unavailable for this pass, so
verification was done via code review + `tsc --noEmit` + `npm run lint`.

## Global additions

Added to `src/app/globals.css`:

- `.focus-ring` / `.focus-ring-invert` — 2 px outline, 2 px offset, shows
  only on `:focus-visible`. Navy ring on light surfaces, white ring on
  the dark header / hero banner.
- `.sr-only` — screen-reader-only utility used to label async skeletons.
- Global `prefers-reduced-motion` rule — disables animations/transitions
  for users who request it (campus hero skeleton, drag scale, image
  hover zoom, etc.).

No new palette colors introduced — all rings use existing `sm-navy` /
white.

## Findings + fixes

| Area | Issue | Fix |
|------|-------|-----|
| Every widget + link | No `:focus-visible` ring → keyboard users are invisible. | Added `focus-ring` / `focus-ring-invert` classes on every `a`, `button`, `input`. |
| Hero banner — °F/°C toggle | Toggle had `aria-label` but no visible focus ring; label was ambiguous (“Switch to °C”). | Added `focus-ring-invert`, expanded label to announce the current temperature + target unit. |
| Hero banner — skeleton + error copy | “Weather unavailable” / “AQI unavailable” was clinical. | Replaced with “Couldn’t load weather — try refreshing.” Skeleton now mimics layout shape (3 bars instead of 2). Added `role="status"` + sr-only “Loading…” for both. |
| Hero banner — section semantics | Hero had no `aria-label`; sub-panels had no role. | Section labeled “Today”; weather / AQI panels get `role="region"` + `aria-label`. |
| Hero banner — icons inside panels | Decorative icons announced to SR. | Added `aria-hidden="true"` to lucide icons + weather icon. |
| Header — logo / nav / reset | Missing focus ring; reset button had no confirmation text; mobile menu button lacked `aria-expanded` + 40 px target. | Logo gets `aria-label`; nav elements get `focus-ring-invert`; mobile menu button announces `aria-expanded`, meets 40×40 target; reset button gets descriptive label. |
| Header — mobile drawer | Taps were 36 px, below 40 px guideline. Nav lacked landmark label. | Increased padding to `py-2.5 min-h-[40px]`; desktop + mobile `<nav>` now have `aria-label="Primary" / "Mobile"`. |
| WidgetShell | Body always had `overflow-auto`, so widgets that fit caused phantom scrollbar margin. Card lacked `aria-label`. Open link used a generic label. | New `scrollable` prop (default `true`); passed `false` on Lunch / Athletics / Calendar / Quick-Links / Instagram / Blank / Canvas-setup. `aria-label={title}` on the card; open-link `aria-label` says “Full Schedule — Athletics” etc. ExternalLink icon marked `aria-hidden`. |
| Canvas widget — loading | Generic rectangles that didn’t match the real row shape. | Replaced with skeleton rows that mirror title + course + due-date layout. `role="status"` + sr-only label. |
| Canvas widget — error | Bare `{error}` with no retry context. | Two-line human copy (“Couldn’t load assignments” + raw error), icon, 40 px Try-again button with focus ring. |
| Canvas widget — empty | “ALL CAUGHT UP” was shout-case. | Title-cased to “All caught up”. |
| Canvas widget — rows | Plain `<div>` list not announced as a list; anchors had no a11y label; focus ring invisible on each row. | Converted to `<ul><li><a>`; each anchor announces assignment name + course + due time; focus ring on every row. |
| Canvas widget — setup form | Inputs had unlinked labels; Disconnect button had no context. | Added `htmlFor` / `id`, `autoComplete="off"` on the token input, explicit aria on Disconnect. Close X button has 28×28 min size + focus ring. |
| Canvas settings gear | Target was only ~14 px. | 28×28 tap target with focus ring + clearer label. |
| Lunch widget | Tabs lacked `role="tab"` / `aria-selected`; V badge relied on color alone; 36 px tap targets. | Full `role="tablist"/"tab"/"tabpanel"` pattern; V badge has `aria-label="Vegetarian"`+ `title`; tabs hit 40 px and get focus ring; added empty state. |
| Athletics widget | Win/loss signalled by color only (W = green, L = red) — fails WCAG 1.4.1. Rows were divs, no a11y label. | Added `Trophy` / `Minus` icons for W/L; home/away tags now pair icon + text; full row `aria-label` like “Lacrosse vs St. Paul’s, won 8 to 5”; converted to `<ul>`. Added empty state. |
| News widget | “Unable to load news.” had no retry; loader was generic; no empty-state icon; rest list was div-only; featured image alt duplicated the title twice (heading + alt). | Proper error state with icon + retry button (bumps `reloadKey` to refetch); empty state uses Newspaper icon + friendly copy; loader matches hero-image shape; rest converted to `<ul>`. Featured image `alt=""` because the title heading follows; anchor announces “Featured: <title>”. |
| Calendar widget | Color/icon-free list items; rows were divs. | Converted to `<ul>`; date column gets readable `aria-label` (“APR 19”); icon-fronted empty state; divider under content opacity harmonized to `border-sm-border/60`. |
| Instagram widget | Tile anchors used `title` (not announced on SR), captions weren’t surfaced; social icons were 28 px on mobile; images had duplicate alt. | Tiles wrapped in `<ul><li>` with `aria-label="Instagram: <caption>"`; `alt=""` on decorative thumbs; social icons hit 40×40 on mobile (shrink to 28 on ≥sm), gain focus rings + descriptive labels. |
| Quick Links | No focus ring; links had no context; categories weren’t landmarks. | Each category becomes `<section aria-label={cat}>`; anchors get `focus-ring`, `aria-label="… (opens in new tab)"`, taller 6 px+ padding for 40 px row target at default zoom. |
| Blank widget | Flat text-only placeholder. | Added Sparkles icon + warmer copy (“A new widget is on its way.”), `scrollable={false}`. |
| Footer | Links had no focus ring; decorative divider was in the tab order implicitly. | Added `focus-ring` to external link + email; divider marked `aria-hidden`. |
| Grid skeletons | Generic `<div>` skeletons during hydration. Fine, but nothing else changed. | Left intact — skeleton already mimics overall grid shape and isn’t the biggest win to touch. |

## Files changed

- `src/app/globals.css`
- `src/components/dashboard/shell.tsx`
- `src/components/dashboard/header.tsx`
- `src/components/dashboard/hero-banner.tsx`
- `src/components/widgets/widget-shell.tsx`
- `src/components/widgets/canvas.tsx`
- `src/components/widgets/lunch.tsx`
- `src/components/widgets/athletics.tsx`
- `src/components/widgets/news.tsx`
- `src/components/widgets/calendar.tsx`
- `src/components/widgets/instagram.tsx`
- `src/components/widgets/quick-links.tsx`
- `src/components/widgets/blank.tsx`

## Verification

- `npx tsc --noEmit` → clean, no output.
- `npm run lint` → clean, no ESLint errors.
- Browser preview tools were denied this session, so pixel-level
  screenshots are deferred; code-level changes were all made against
  the running diff of the files.

## Known remaining items / deferred

- **Color contrast measurement** — `sm-text-muted` (#8A8A8A) on white is
  3.5:1, short of AA body text (4.5:1). This colour is baked into the
  CI palette and used project-wide for secondary copy; swapping it
  would touch every widget and is outside this pass. Where muted text
  was dense or important (Canvas “Not Connected” description, error
  detail), I upgraded the class from `sm-text-muted` → `sm-text-light`
  (#5A5A5A, 7.4:1 — AA large + small).
- **Href validation** — skipped per task spec; `link-validator` agent owns
  the href strings.
- **Preview screenshots** — blocked by tool denial; recommend running
  a follow-up pass with browser screenshots once permissions unblock.
- **Drag opacity flash** — cell keeps the 0.3 opacity during drag; the
  `prefers-reduced-motion` rule shortens the transition but doesn’t
  eliminate it. That’s intentional feedback and the task spec said to
  verify it doesn’t flash, which a code-only pass can’t confirm.
