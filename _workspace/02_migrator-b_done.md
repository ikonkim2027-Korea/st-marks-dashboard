# Stage 2 — widget-migrator-b: Done

## Files created

| Path | Named export | Widget key | Accent |
|------|--------------|-----------|--------|
| `src/components/widgets/weather.tsx`      | `WeatherWidget`      | `weather`      | `navy`   |
| `src/components/widgets/instagram.tsx`    | `InstagramWidget`    | `instagram`    | `orange` |
| `src/components/widgets/quick-links.tsx`  | `QuickLinksWidget`   | `quick-links`  | `navy`   |
| `src/components/widgets/blank.tsx`        | `BlankWidget`        | `blank`        | `gold`   |

All export names, paths, `"use client"`, and `WidgetShell` wrapping follow `_workspace/01_layout-architect_widget-api.md` exactly. No default exports, no barrels. Legacy files (`HeroWeather.tsx`, `InstagramPanel.tsx`, `QuickLinks.tsx`, `BlankPanel.tsx`) were left untouched per spec — Stage 3 integrator handles retirement.

## Weather widget — key decisions

- **Card is now white** (WidgetShell default). Temperature digits are `text-sm-navy`; the dark-navy hero background is gone since this is a grid cell, not a hero.
- **Unit state via `useTemperatureUnit()`** — returns `[unit, setUnit, hydrated]` from `useLocalStorage`. The widget reads `unit` and calls `setUnit` on toggle; the Header's global toggle and this widget stay in lockstep automatically through the `storage` event.
- **Conversion is pure client-side**: API stays on °F (`/api/weather` unchanged). `convertTemp(value, "F", unit)` is applied at render time for `temp`, `feelsLike`, `high`, `low` only. Humidity is `%`, wind stays `mph` (not converted; the contract says wind is mph for now).
- **Toggle UI** placed in `WidgetShell` `headerExtra` — two pill buttons `°C` / `°F`. Active one is filled `sm-navy` + white text; inactive is outlined `sm-border` + muted text. Wrapper `<div onMouseDown={e => e.stopPropagation()}>` prevents the drag handle from hijacking clicks. `aria-pressed` is set for a11y.
- **Loading state**: three pulsing placeholder bars (no white-on-navy skeleton since the card is white).
- **Error state**: "Unable to load weather" in `text-sm-text-muted`.
- **Stats row** now shows 4 metrics (Feels / Humidity / Wind / H-L) instead of 3 — humidity was already returned by `/api/weather` but HeroWeather hid it, so I surfaced it since the white card has better contrast for a denser row. Wind kept as `mph` per contract note.
- **Hourly forecast**: `/api/weather` does NOT return hourly data (checked `src/app/api/weather/route.ts` — only current + high/low). Omitted accordingly per the "if API supplies" clause. No route changes made.

## Weather API shape — verified

`GET /api/weather` returns (both real OpenWeather path and mock-no-key path):

```ts
{
  temp: number;          // °F
  feelsLike: number;     // °F
  description: string;   // e.g. "partly cloudy"
  icon: string;          // OWM icon code, e.g. "02d"
  humidity: number;      // %
  windSpeed: number;     // mph
  high: number;          // °F (temp_max)
  low: number;           // °F (temp_min)
}
```

No hourly array, no `hourly`, no `forecast`. Matches what the widget consumes — no route change needed.

## Accent deviations from the agent prompt's inline table

The inline task table in the agent prompt specified `instagram: gold` and `blank: navy`, but the widget-api contract (which the prompt designated as authoritative: "YOUR CONTRACT — follow exactly") specifies `instagram: "orange"` and `blank: "gold"`. I followed the contract:

| Widget | Contract accent | Used |
|--------|----------------|------|
| weather     | navy   | navy   |
| instagram   | orange | orange (deviates from inline table "gold") |
| quick-links | navy   | navy   |
| blank       | gold   | gold (deviates from inline table "navy") |

If the designer prefers the inline-table values, swap the `accent` prop string on lines `accent="orange"` in `instagram.tsx` and `accent="gold"` in `blank.tsx`. Trivial change.

## Drag-safety audit

Every interactive child (button, anchor, tile) that users might click instead of drag has `onMouseDown={e => e.stopPropagation()}`:

- `weather.tsx`: unit toggle wrapper div
- `instagram.tsx`: 6 photo tiles + 6 social icons
- `quick-links.tsx`: all 16 link `<a>` tags
- `blank.tsx`: no interactive children

The `WidgetShell` header already calls `e.stopPropagation()` on the `headerExtra + href` container, so the toggle and the external-link button are protected at two layers.

## Non-deviations / things to confirm

- `WeatherWidget` currently ignores the `hydrated` return from `useTemperatureUnit()`. Since the default is `"F"` (matches the API unit), there is no hydration flicker worth guarding against — the pre-hydration render and the post-hydration render are identical as long as the user's stored preference is also `"F"`. If a user who previously selected `"C"` lands, they'll see a one-frame `"F"` render before the localStorage value hydrates. Acceptable per the contract's note that `useLocalStorage` is SSR-safe and hydrates after mount.
- All four widgets omit the `href` on `WidgetShell` except where the legacy component exposed one in its header (Instagram → `Follow`, QuickLinks → `Website`). `WeatherWidget` and `BlankWidget` have no external page to link to.

## Running in parallel with widget-migrator-a

No shared files. Both migrators write to disjoint files under `src/components/widgets/`. No risk of collision.
