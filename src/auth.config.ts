import type { NextAuthConfig } from "next-auth";

/**
 * Edge-safe slice of the Auth.js config — used by `middleware.ts`. The full
 * config (with the Google provider) lives in `auth.ts` and is imported by
 * the route handler / server components, which run on the Node runtime.
 *
 * Splitting the config in two is the recommended Auth.js v5 pattern when
 * you also want to gate routes via `middleware.ts`. See
 * https://authjs.dev/getting-started/migrating-to-v5#edge-compatibility
 */

// Hard-coded admin email allowlist. Adding more admins = edit this list.
// Kept here (and not in env) on purpose so the allowlist is always in
// version control and reviewable in a diff.
export const ADMIN_EMAILS = new Set<string>([
  "ikonkim2027@gmail.com",
]);

export const authConfig = {
  // We don't do any DB writes — JWT sessions only. Edge-friendly.
  session: { strategy: "jwt" },

  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },

  callbacks: {
    // Block the OAuth callback for anyone outside the allowlist.
    async signIn({ account, profile }) {
      if (account?.provider !== "google") return false;
      const email = profile?.email?.toLowerCase();
      if (!email) return false;
      if (!profile?.email_verified) return false;
      return ADMIN_EMAILS.has(email);
    },

    // Carry the email forward into the JWT, so middleware (which only sees
    // the JWT, not the DB) can re-check the allowlist on every /admin hit.
    async jwt({ token, profile }) {
      if (profile?.email) token.email = profile.email.toLowerCase();
      return token;
    },

    async session({ session, token }) {
      if (token.email && session.user) {
        session.user.email = token.email as string;
      }
      return session;
    },

    // Gate every /admin/* route. Login page is public.
    authorized({ auth, request: { nextUrl } }) {
      const isAdminArea = nextUrl.pathname.startsWith("/admin");
      const isLoginPage = nextUrl.pathname.startsWith("/admin/login");
      if (!isAdminArea || isLoginPage) return true;

      const email = auth?.user?.email?.toLowerCase();
      if (email && ADMIN_EMAILS.has(email)) return true;

      // Redirect unauthenticated users to the login page.
      const loginUrl = new URL("/admin/login", nextUrl);
      loginUrl.searchParams.set("from", nextUrl.pathname);
      return Response.redirect(loginUrl);
    },
  },

  providers: [],
} satisfies NextAuthConfig;
