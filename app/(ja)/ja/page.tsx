import { LocaleProvider } from "@/lib/i18n/LocaleProvider";
import { PortfolioShell } from "@/sections/portfolio/PortfolioShell";

export default function JaHomePage() {
  return (
    <div data-route="portfolio">
      <LocaleProvider locale="ja">
        <PortfolioShell />
      </LocaleProvider>
    </div>
  );
}
