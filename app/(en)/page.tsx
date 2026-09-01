import { LocaleProvider } from "@/lib/i18n/LocaleProvider";
import { PortfolioShell } from "@/sections/portfolio/PortfolioShell";

export default function HomePage() {
  return (
    <div data-route="portfolio">
      <LocaleProvider locale="en">
        <PortfolioShell />
      </LocaleProvider>
    </div>
  );
}
