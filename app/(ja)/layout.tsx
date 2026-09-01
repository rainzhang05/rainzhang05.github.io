import type { Metadata, Viewport } from "next";
import { BASE_FONT_CLASSES, notoSansJP } from "@/app/fonts";
import { RootHtml } from "@/app/RootHtml";
import { HTML_LANG } from "@/lib/i18n/config";
import { buildMetadata, SHARED_VIEWPORT } from "@/lib/i18n/metadata";

export const metadata: Metadata = buildMetadata("ja");
export const viewport: Viewport = SHARED_VIEWPORT;

export default function JaLayout({ children }: { children: React.ReactNode }) {
  return (
    <RootHtml
      lang={HTML_LANG.ja}
      fontClassName={`${BASE_FONT_CLASSES} ${notoSansJP.variable}`}
    >
      {children}
    </RootHtml>
  );
}
