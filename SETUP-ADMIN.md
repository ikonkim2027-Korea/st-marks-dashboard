# Admin Setup — Vercel Production

The dashboard ships with an admin area at
[https://st-marks-dashboard.vercel.app/admin](https://st-marks-dashboard.vercel.app/admin)
that lets you edit the lunch menu, countdown, and quick links from a UI
instead of hand-editing JSON. Sign-in is restricted to the email
allowlist in [`src/auth.config.ts`](./src/auth.config.ts) (currently
`ikonkim2027@gmail.com`).

This guide gets the admin working **on the live Vercel site**. You only do
it once, takes ~10 min.

> **How saves work on Vercel.** Vercel filesystem is read-only at runtime,
> so the admin commits each save to GitHub via the Contents API. That
> commit triggers a Vercel auto-deploy and the public widgets pick up the
> new JSON in ~30s. The admin editor itself reads through the GitHub API
> too, so you see your save right away — no waiting for the deploy.

---

## Step 1 · Create the Google OAuth client

1. Open https://console.cloud.google.com/ signed in as `ikonkim2027@gmail.com`.
2. Top bar project selector → **NEW PROJECT** → name `sm-hub-admin` → **CREATE**.
3. Left ☰ → **APIs & Services** → **OAuth consent screen** → **Get started**.
   - App name: `SM Hub Admin`
   - User support email: your Gmail
   - Audience: **External**
   - Contact: your Gmail → **Continue** → agree → **Create**.
4. Left ☰ → **OAuth consent screen** → **Audience** tab → **Test users**
   → **+ ADD USERS** → add your Gmail → **SAVE**.
   ⚠ This step is required — Testing-mode apps reject everyone except
   listed test users.
5. Left ☰ → **Clients** (or **Credentials**) → **+ CREATE CLIENT**.
   - Application type: **Web application**
   - Name: `SM Hub Vercel`
   - Authorized redirect URIs → **+ ADD URI** (paste each one exactly,
     no trailing slash):
     ```
     https://st-marks-dashboard.vercel.app/api/auth/callback/google
     http://localhost:3000/api/auth/callback/google
     ```
     (Localhost is optional but lets you also test admin during `npm run dev`.)
   - **CREATE**

The modal that pops up shows **Client ID** and **Client secret**. Keep that
tab open — you'll paste both into Vercel in Step 3.

## Step 2 · Create a fine-grained GitHub PAT

The admin needs write access to `.data/*.json` in your repo.

1. https://github.com/settings/personal-access-tokens/new
2. **Token name**: `sm-hub-admin`
3. **Expiration**: 1 year (renew when it expires)
4. **Repository access**: **Only select repositories** →
   pick `ikonkim2027-Korea/st-marks-dashboard`.
5. **Repository permissions**:
   - **Contents**: **Read and write** ← this is the only one that matters
   - Everything else: leave at "No access"
6. **Generate token** → copy the token starting with `github_pat_…`. You
   won't see it again.

## Step 3 · Add env vars to Vercel

1. Go to your project at https://vercel.com/ → **Settings** → **Environment
   Variables**.
2. Add these five (Production scope is enough; tick all envs if you want
   them in Preview/Dev too):

   | Name | Value |
   |---|---|
   | `AUTH_SECRET` | Run `openssl rand -base64 32` locally, paste output |
   | `AUTH_GOOGLE_ID` | Client ID from Step 1.5 |
   | `AUTH_GOOGLE_SECRET` | Client secret from Step 1.5 |
   | `GITHUB_TOKEN` | PAT from Step 2 |
   | `GITHUB_REPO` | `ikonkim2027-Korea/st-marks-dashboard` |

   `GITHUB_BRANCH` defaults to `main`; only set it if you want to write to
   a different branch.

3. **Deployments** tab → on the latest production deploy → ⋯ menu →
   **Redeploy** so the new env vars take effect.

## Step 4 · Sign in

1. Open https://st-marks-dashboard.vercel.app/admin/login
2. Click **Continue with Google** → pick your allowlisted Gmail
3. Google warns "Google hasn't verified this app" because the OAuth client
   is in Testing mode → **Advanced** → **Go to SM Hub Admin (unsafe)** →
   allow.
4. You land on `/admin` with three tiles. Done.

## Step 5 · Try a save

1. **Quick Links** → add a new link → **Save**.
2. Admin editor refresh: the new link is there immediately (admin reads
   from GitHub).
3. Open https://st-marks-dashboard.vercel.app/ in a new tab. Wait ~30s
   then refresh — the new link shows up in the public Quick Links widget.

Each save also lands as a commit on `main` you can see in the GitHub
history with author name "SM Hub Admin".

---

## Local development (optional)

If you also want admin to work via `npm run dev` on your laptop:

1. `cp .env.example .env.local` and fill in `AUTH_SECRET`, `AUTH_GOOGLE_ID`,
   `AUTH_GOOGLE_SECRET`. **Leave `GITHUB_TOKEN` unset** — without it the
   admin falls back to writing the local `.data/*.json` file directly,
   which is what you usually want for a dev loop.
2. `npm run dev` → http://localhost:3000/admin/login.

The admin sidebar shows a small badge — **"Local mode"** when writing to
disk, **"GitHub mode"** when committing.

## Adding more admins

Edit `ADMIN_EMAILS` in [`src/auth.config.ts`](./src/auth.config.ts):

```ts
export const ADMIN_EMAILS = new Set<string>([
  "ikonkim2027@gmail.com",
  "another-admin@gmail.com",
]);
```

Then add the same Gmail to **OAuth consent screen → Test users** in Google
Cloud (Step 1.4). Commit + push and the new admin can sign in.

## Troubleshooting

- **"redirect_uri_mismatch"** on Google sign-in: the URI you pasted into
  the OAuth client doesn't exactly match. Production URI must be
  `https://st-marks-dashboard.vercel.app/api/auth/callback/google` —
  no trailing slash, exact case.
- **"This app isn't verified" / "Access blocked"**: your Gmail isn't in
  the OAuth client's **Test users** list. Add it (Step 1.4) and retry.
- **Admin Save returns 500**: GitHub PAT is missing/expired or doesn't
  have `Contents: write` on this repo. Re-issue and update Vercel env vars.
- **Saved but public site doesn't update**: confirm the commit landed on
  `main` (check the repo's commit log) and that Vercel did a redeploy
  (project's Deployments tab).
- **Locked out**: sign out at https://accounts.google.com and retry.

## What if I leave Vercel later?

Storage is isolated to [`src/lib/data-store.ts`](./src/lib/data-store.ts).
Two ways to swap it:

- **Vercel KV / Upstash Redis**: replace `ghRead`/`ghWrite` with the KV
  client. Removes the redeploy lag.
- **Self-host on a VPS**: just unset `GITHUB_TOKEN` and the admin will
  write to the local filesystem like local dev.
