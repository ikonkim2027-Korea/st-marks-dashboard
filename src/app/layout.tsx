import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "SM Hub | St. Mark's School Student Dashboard",
  description:
    "All-in-one student dashboard for St. Mark's School, Southborough, MA. Lunch menus, athletics, news, calendar, and more.",
  // Icons are auto-detected from `app/icon.svg` (all modern browsers),
  // `app/favicon.ico` (legacy fallback), and `app/apple-icon.tsx` (iOS).
  // See node_modules/next/dist/docs/.../metadata/app-icons.md.
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${montserrat.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
