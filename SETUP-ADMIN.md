# Admin Setup — Step by Step

The dashboard ships with an admin area at `/admin` that lets you edit the
lunch menu, countdown milestones, and quick links from a UI instead of
hand-editing JSON. Sign-in is gated to the email allowlist in
[`src/auth.config.ts`](./src/auth.config.ts) (currently `ikonkim2027@gmail.com`).

This guide gets you signed in for local development. You only do it once.

---

## 1. Make a Google OAuth client (5 min)

1. Open https://console.cloud.google.com/ and sign in with your admin Google
   account (the one in the allowlist).
2. Top bar → project selector → **New Project**. Name it
   `sm-hub-admin` (anything works). Click **Create**.
3. Left nav → **APIs & Services** → **OAuth consent screen**.
   - User type: **External**. Click **Create**.
   - App name: `SM Hub Admin`. Support email: your Gmail.
   - Developer contact: your Gmail. Click **Save and continue**.
   - Scopes screen → **Save and continue** (no scopes to add).
   - Test users → **+ Add users** → add your Gmail. **Save and continue**.
   - Summary → **Back to dashboard**.
4. Left nav → **APIs & Services** → **Credentials** →
   **+ Create credentials** → **OAuth client ID**.
   - Application type: **Web application**.
   - Name: `SM Hub Localhost`.
   - Authorized redirect URIs → **+ Add URI**:
     ```
     http://localhost:3000/api/auth/callback/google
     ```
   - Click **Create**. A modal pops up with **Client ID** and **Client
     secret**. Keep this tab open.

## 2. Drop secrets into `.env.local`

In the project root:

```bash
cp .env.example .env.local
```

Open `.env.local` and fill in three values:

```
AUTH_SECRET=<paste output of: npx auth secret>
AUTH_GOOGLE_ID=<Client ID from step 1.4>
AUTH_GOOGLE_SECRET=<Client secret from step 1.4>
```

`npx auth secret` will write `AUTH_SECRET` for you automatically — just run
it once and accept. If it doesn't, generate one with:

```bash
openssl rand -base64 32
```

`.env.local` is already gitignored so secrets won't end up on GitHub.

## 3. Sign in

```bash
npm run dev
```

Open http://localhost:3000/admin/login and click **Continue with Google**.
Pick the allowlisted account. You'll land on the admin home with three
tiles: Lunch, Countdown, Quick Links.

If you see "isn't on the admin allowlist", you're signed in with the wrong
Google account. Sign out and use the right one.

## 4. Edit something

Try **Quick Links** → add a category → add a link → **Save**. Refresh the
public dashboard at http://localhost:3000/ — the new link appears
immediately. Behind the scenes the admin writes to
[`.data/links.json`](./.data/links.json), and the widget re-reads on each
request (`dynamic = "force-dynamic"`).

## 5. Publish your edits

Local edits live in `.data/*.json`. To get them onto the live site (or just
into version control), commit the files:

```bash
git add .data/
git commit -m "chore: update lunch menu / links / milestones"
git push
```

If you've connected the repo to Vercel or another host with auto-deploy,
the change goes live on push.

---

## Adding more admins

Edit `ADMIN_EMAILS` in [`src/auth.config.ts`](./src/auth.config.ts):

```ts
export const ADMIN_EMAILS = new Set<string>([
  "ikonkim2027@gmail.com",
  "another-admin@gmail.com",
]);
```

Commit + redeploy. They sign in with their Google account.

## Hosting on Vercel / serverless

The current admin writes to the local filesystem. Vercel's filesystem is
read-only at runtime, so save buttons would fail there. Two paths forward
when you're ready to deploy:

1. **Switch the data store to Vercel KV / Upstash Redis**: rewrite
   `src/lib/data-store.ts` to read/write via the KV client. Everything
   else stays the same.
2. **Commit-via-GitHub-API**: have the save handlers PUT a new
   `.data/*.json` blob through the GitHub Contents API, which retriggers
   the Vercel deploy. Needs a fine-scoped GitHub PAT in env.

Either path is a focused refactor of one file (`src/lib/data-store.ts`)
plus a setup step. Until then, run the admin locally and commit the JSON.

## Troubleshooting

- **`AUTH_SECRET environment variable missing`**: make sure
  `.env.local` exists and `npm run dev` was restarted after editing it.
- **"redirect_uri_mismatch"**: the URI you pasted into Google Cloud
  doesn't exactly match `http://localhost:3000/api/auth/callback/google`.
  Match it character-for-character (no trailing slash).
- **Stuck signed in as the wrong Google account**: sign out at
  `https://accounts.google.com`, then retry.
