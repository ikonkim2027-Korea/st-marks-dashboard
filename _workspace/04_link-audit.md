# Link Audit — 2026-04-19

Validated all 24 unique external URLs across `src/components/{widgets,dashboard}/` and `src/app/page.tsx` (dashboard shell moved footer in — checked there too).

## Verdict

- **23 working** (200 or intentional auth redirect)
- **1 stale redirect** — fixed inline:
  - `https://www.stmarksschool.org/news` → `https://www.stmarksschool.org/about/news-and-stories`
  - 4 occurrences in `src/components/widgets/news.tsx` updated

## Social URLs confirmed against school official site

Fetched `https://www.stmarksschool.org` footer; social handles match ours:

| Platform | URL | Curl HEAD | Notes |
|---|---|---|---|
| Facebook | `facebook.com/smlionsMA/` | 400 | Facebook blocks all HEAD requests (even `/zuck`). School's official site links to this exact URL → keep |
| Instagram | `instagram.com/smlions/` | 200 | ✓ |
| X/Twitter | `x.com/SMLions` | 403 HEAD, 200 GET | X blocks HEAD; works in browser → keep |
| LinkedIn | `linkedin.com/school/smlions/` | 999 | LinkedIn anti-scrape response; works in browser → keep |
| YouTube | `youtube.com/@SMLions` | 200 | Resolves to St. Mark's School channel → keep |

## Auth-gated 200s (expected)

- `stmarksschool.instructure.com` → Google SSO
- `mail.google.com/a/stmarksschool.org` → Google SSO
- `www.stmarksschool.org/login` → login page

## Files modified

- `src/components/widgets/news.tsx` (4 href replacements)

No FIXME markers left.
