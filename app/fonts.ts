import { JetBrains_Mono, Manrope, Noto_Sans_JP } from "next/font/google";

export const manrope = Manrope({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-sans",
  display: "swap",
});

export const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
  display: "swap",
});

/**
 * Japanese face, loaded only by the `/ja` root layout. `preload` is off
 * because Google slices CJK into ~100 unicode-range files — preloading them
 * all would be far more costly than letting the browser fetch the few it
 * actually needs.
 */
export const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-jp-loaded",
  display: "swap",
  preload: false,
});

/** Font variable classes shared by every locale. */
export const BASE_FONT_CLASSES = `${manrope.variable} ${jetbrainsMono.variable}`;
