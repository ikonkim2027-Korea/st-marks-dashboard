import Link from "next/link";
import { redirect } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { auth, signIn } from "@/auth";
import { ADMIN_EMAILS } from "@/auth.config";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; error?: string }>;
}) {
  const params = await searchParams;
  const from = params.from && params.from.startsWith("/admin") ? params.from : "/admin";

  // If a valid admin is already signed in, send them straight in.
  const session = await auth();
  const email = session?.user?.email?.toLowerCase();
  if (email && ADMIN_EMAILS.has(email)) redirect(from);

  // Auth.js sets ?error=AccessDenied when our signIn callback returns false.
  const denied =
    params.error === "AccessDenied" ||
    params.error === "OAuthAccountNotLinked" ||
    (!!email && !ADMIN_EMAILS.has(email));

  return (
    <div className="w-full max-w-md rounded-lg border border-sm-border bg-white p-8 shadow-sm">
      <div className="mb-6 flex flex-col items-center text-center">
        <ShieldCheck
          className="mb-3 h-10 w-10 text-sm-navy"
          aria-hidden="true"
        />
        <h1 className="text-lg font-bold text-sm-text">Admin Sign-In</h1>
        <p className="mt-1 text-[12px] text-sm-text-muted leading-relaxed">
          Sign in with the dashboard&apos;s authorized Google account to
          edit the lunch menu, countdown, and quick links.
        </p>
      </div>

      {denied && (
        <div
          role="alert"
          className="mb-4 rounded-md border border-sm-danger/30 bg-sm-danger/5 p-3 text-[12px] text-sm-danger"
        >
          {email
            ? `${email} isn't on the admin allowlist. Sign out of this Google account and try again with the authorized one.`
            : "That Google account isn't authorized for the admin area."}
        </div>
      )}

      <form
        action={async () => {
          "use server";
          await signIn("google", { redirectTo: from });
        }}
      >
        <button
          type="submit"
          className="focus-ring inline-flex w-full min-h-[44px] items-center justify-center gap-2.5 rounded-md bg-sm-navy px-4 py-2.5 text-[13px] font-semibold text-white hover:bg-sm-navy-light transition-colors"
        >
          <GoogleMark />
          Continue with Google
        </button>
      </form>

      <div className="mt-6 border-t border-sm-border pt-4 text-center">
        <Link
          href="/"
          className="text-[11px] font-medium uppercase tracking-[0.15em] text-sm-text-muted hover:text-sm-navy transition-colors"
        >
          ← Back to dashboard
        </Link>
      </div>
    </div>
  );
}

function GoogleMark() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 18 18"
      aria-hidden="true"
      className="shrink-0"
    >
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.49h4.84a4.14 4.14 0 0 1-1.79 2.71v2.26h2.9c1.7-1.56 2.69-3.86 2.69-6.62z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.46-.81 5.95-2.18l-2.9-2.26c-.8.54-1.83.86-3.05.86-2.34 0-4.32-1.58-5.03-3.71H.97v2.33A8.99 8.99 0 0 0 9 18z"
      />
      <path
        fill="#FBBC05"
        d="M3.97 10.71A5.41 5.41 0 0 1 3.68 9c0-.6.1-1.17.29-1.71V4.96H.97A8.99 8.99 0 0 0 0 9c0 1.45.35 2.82.97 4.04l3-2.33z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58A8.99 8.99 0 0 0 9 0 8.99 8.99 0 0 0 .97 4.96l3 2.33C4.68 5.16 6.66 3.58 9 3.58z"
      />
    </svg>
  );
}
