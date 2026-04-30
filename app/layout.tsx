import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Inter, Instrument_Serif, JetBrains_Mono } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--f-sans-next", display: "swap" });
const serif = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--f-serif-next", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--f-mono-next", display: "swap" });

export const metadata: Metadata = {
  title: "Rain Zhang — Computer Science Student & Full-Stack Developer",
  description:
    "Rain Zhang — Computer Science student at Simon Fraser University. Full-stack developer building scalable web systems with Python, React, and TypeScript. Open to internship opportunities.",
  metadataBase: new URL("https://rainzhang.me"),
  alternates: { canonical: "https://rainzhang.me/" },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    apple: "/favicon.svg",
  },
  openGraph: {
    title: "Rain Zhang — Full-Stack Developer & CS Student",
    description:
      "Computer Science student at SFU building scalable full-stack systems with Python, React, TypeScript, and Rust.",
    url: "https://rainzhang.me/",
    siteName: "Rain Zhang",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rain Zhang — Full-Stack Developer & CS Student",
    description:
      "Computer Science student at SFU building scalable full-stack systems with Python, React, TypeScript, and Rust.",
  },
};

export const viewport: Viewport = {
  themeColor: "#f5f3ee",
  width: "device-width",
  initialScale: 1,
  interactiveWidget: "resizes-content",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${serif.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
