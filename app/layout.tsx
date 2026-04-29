import "./globals.css";
import { Inter, Instrument_Serif, JetBrains_Mono } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--f-sans-next", display: "swap" });
const serif = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--f-serif-next", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--f-mono-next", display: "swap" });

export const metadata = {
  title: "Rain Zhang — Full-Stack Developer",
  description:
    "Computer Science student at Simon Fraser University. Full-stack developer turning ideas into shipped products with React, TypeScript, Python, and Rust.",
  metadataBase: new URL("https://rainzhang.me"),
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    apple: "/favicon.svg",
  },
  themeColor: "#f5f3ee",
  openGraph: {
    title: "Rain Zhang — Full-Stack Developer",
    description: "Full-stack developer building shipped products end to end.",
    url: "https://rainzhang.me/",
    siteName: "Rain Zhang",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${serif.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
