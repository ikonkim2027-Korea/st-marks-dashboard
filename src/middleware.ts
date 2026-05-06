import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

// Use the edge-safe slice of the config so the middleware itself runs on
// the edge runtime — the Google provider only spins up inside the route
// handler / server components which run on Node.
export const { auth: middleware } = NextAuth(authConfig);

export default middleware;

export const config = {
  // Run middleware only on /admin/*. Everything else (the public dashboard,
  // API routes for news/lunch/etc.) bypasses auth entirely.
  matcher: ["/admin/:path*"],
};
