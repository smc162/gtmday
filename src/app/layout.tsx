import type { Metadata } from "next";
import Link from "next/link";
import { Playfair_Display, Inter, Orbitron } from "next/font/google";
import "./globals.css";

const serif = Playfair_Display({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-serif",
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
});

export const metadata: Metadata = {
  title: "GTM Day",
  description: "GTM Day tools: randomizer, timer, and social feed.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${serif.variable} ${sans.variable} ${orbitron.variable}`}>
        <div className="frame">
          <header className="site-header">
            <div className="site-title">
              <span className="site-title-main">GTM Day</span>
              <span className="site-title-sub">Tools</span>
            </div>
          </header>
          <main className="site-main">{children}</main>
          <nav className="bottom-menu">
            <Link href="/" className="bottom-menu-link">
              Home
            </Link>
            <Link href="/random" className="bottom-menu-link">
              Numbers
            </Link>
            <Link href="/timer" className="bottom-menu-link">
              Timer
            </Link>
            <Link href="/feed" className="bottom-menu-link">
              Feed
            </Link>
          </nav>
        </div>
      </body>
    </html>
  );
}
