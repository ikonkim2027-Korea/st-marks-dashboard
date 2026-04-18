# Stage 2 Widget API — Contract for widget-migrators

This is the contract the two Stage 2 widget-migrator agents MUST honor. Deviating breaks the grid.

## 1. Widget key → file path → export name

`grid.tsx` statically imports each widget by name. One file per widget, one named export per file. No default exports. No barrel files.

| Widget key | File path | Named export | Legacy source |
|------------|-----------|--------------|---------------|
| `weather`      | `src/components/widgets/weather.tsx`      | `WeatherWidget`     | `HeroWeather.tsx` (+ any weather logic from `TodayOverview.tsx`) |
| `canvas`       | `src/components/widgets/canvas.tsx`       | `CanvasWidget`      | `CanvasAssignments.tsx` |
| `lunch`        | `src/components/widgets/lunch.tsx`        | `LunchWidget`       | `LunchMenu.tsx` |
| `athletics`    | `src/components/widgets/athletics.tsx`    | `AthleticsWidget`   | `Athletics.tsx` |
| `news`         | `src/components/widgets/news.tsx`         | `NewsWidget`        | `SchoolNews.tsx` |
| `calendar`     | `src/components/widgets/calendar.tsx`     | `CalendarWidget`    | `CalendarWidget.tsx` |
| `instagram`    | `src/components/widgets/instagram.tsx`    | `InstagramWidget`   | `InstagramPanel.tsx` |
| `quick-links`  | `src/components/widgets/quick-links.tsx`  | `QuickLinksWidget`  | `QuickLinks.tsx` |
| `blank`        | `src/components/widgets/blank.tsx`        | `BlankWidget`       | `BlankPanel.tsx` |

Default order (rendered top-left to bottom-right in a responsive 1/2/3-column grid, `auto-rows-[380px]`):

```ts
["weather", "canvas", "lunch", "athletics", "news", "calendar", "instagram", "quick-links", "blank"]
```

Users reorder via pointer drag; the order is persisted in `localStorage["stmarks-order-v1"]` and reset via the "Reset" button in the header.

## 2. Every widget wraps its body in `<WidgetShell>`

```tsx
// src/components/widgets/widget-shell.tsx
export type WidgetShellProps = {
  title: string;             // e.g. "Canvas" (required, shown in header)
  eyebrow?: string;          // small caps label above title, e.g. "ASSIGNMENTS"
  accent?: "navy" | "gold" | "orange"; // left accent bar color (default "navy")
  href?: string;             // optional "open in new tab" link in header
  hrefLabel?: string;        // text for that link (default "Open")
  children: React.ReactNode; // the widget body
  bodyClassName?: string;    // extra classes applied to the scrollable body
  headerExtra?: React.ReactNode; // slot between title row and href link (e.g. a C/F toggle)
};
```

### Drag handle rule

`WidgetShell`'s `<header>` carries the `drag-handle` class. The grid attaches `pointerdown` listeners to every `.drag-handle` inside a cell. Widget bodies must NOT put `.drag-handle` on any child. Interactive controls inside `headerExtra` should stop propagation themselves when needed — the shell already calls `e.stopPropagation()` on the `headerExtra + href` container.

### Visual

- Card: `rounded-[10px]`, white surface, `border-sm-navy/10` (hover `border-sm-navy/25`).
- Left accent bar: 3px wide, full header height, colored by `accent` prop.
- Grip icon appears at 70% opacity on card hover.

### Minimal example

```tsx
"use client";
import { WidgetShell } from "./widget-shell";

export function LunchWidget() {
  return (
    <WidgetShell
      title="Lunch"
      eyebrow="FLIK DINING"
      accent="gold"
      href="https://www.stmarksschool.org/dining"
      hrefLabel="Menu"
    >
      {/* body */}
    </WidgetShell>
  );
}
```

## 3. Temperature unit — `WeatherWidget` ONLY

The `/api/weather` route returns Fahrenheit. The default unit is `"F"`. The header has a global °F/°C toggle; `WeatherWidget` should respect it and may also render its own toggle.

```tsx
"use client";
import { useTemperatureUnit, convertTemp } from "@/lib/temperature";

export function WeatherWidget() {
  const [unit] = useTemperatureUnit();      // "C" | "F"

  // The API gives us °F. Convert only when displaying.
  const apiTempF = 72;
  const displayed = unit === "F" ? apiTempF : convertTemp(apiTempF, "F", "C");

  return (
    <WidgetShell
      title="Weather"
      eyebrow="SOUTHBOROUGH"
      accent="navy"
      headerExtra={<LocalUnitToggle />}    // optional in-widget C/F pair
    >
      <span>{Math.round(displayed)}°{unit}</span>
    </WidgetShell>
  );
}
```

- `useTemperatureUnit()` returns `[unit, setUnit, hydrated]` (same shape as `useLocalStorage`).
- If the widget exposes its own toggle, the header toggle will update it immediately via the cross-tab `storage` event. Both must write through `setUnit` — do NOT call `localStorage.setItem` directly.
- Use `convertTemp(value, from, to)` for any conversion. All API values that arrive as °F should be stored as °F internally; convert at render time only.

## 4. Accent convention

Use these accents unless the designer specifies otherwise:

| Widget | `accent` |
|--------|----------|
| weather     | `"navy"`   |
| canvas      | `"orange"` |
| lunch       | `"gold"`   |
| athletics   | `"navy"`   |
| news        | `"navy"`   |
| calendar    | `"gold"`   |
| instagram   | `"orange"` |
| quick-links | `"navy"`   |
| blank       | `"gold"`   |

## 5. Sizing and overflow

- The grid enforces `auto-rows-[380px]`. Widgets should assume a fixed 380px height per cell. `WidgetShell` already handles internal `overflow-auto`.
- Do NOT set `h-*`, `min-h-*`, or absolute positioning on the outer `WidgetShell` — it fills the cell via `h-full w-full`.
- If a widget has heavy inner scrolling (e.g., news list), use the default body overflow; pass `bodyClassName` only for padding tweaks.

## 6. `"use client"` directive

Every widget file must start with `"use client";` — they all use hooks, effects, or interactive handlers.

## 7. What widgets must NOT do

- Do NOT import from `src/components/widgets/widget-shell.tsx` under a relative alias; always import via `./widget-shell`.
- Do NOT mutate `localStorage["stmarks-order-v1"]` — that's the grid's state.
- Do NOT read `window.__stmarksReset` — that's the header's contract.
- Do NOT add a top-level `drag-handle` class inside the widget body.
- Do NOT call `useSWR` or similar libraries unless they already exist in `package.json`. Fetch via `useEffect` + `fetch`, matching the pattern in the legacy components.
