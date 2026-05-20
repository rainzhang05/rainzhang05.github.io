import type { Metadata } from "next";
import { PortfolioShell } from "@/sections/portfolio/PortfolioShell";

export const metadata: Metadata = {
  title: "Rain Zhang — Portfolio",
  description:
    "Computer Science student at Simon Fraser University. Full-stack engineer building production systems across Python, React, and TypeScript.",
};

export default function HomePage() {
  return (
    <div data-route="portfolio">
      <PortfolioShell />
    </div>
  );
}
