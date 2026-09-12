/*
 * Prints resume.<locale>.html to public/rain-zhang-resume[-ja].pdf.
 *
 * The two PDFs in public/ were originally print-to-PDF'd from a browser and
 * their source was lost; resume.css and the two HTML fragments here are that
 * source, reconstructed from the shipped files' own measured geometry. The page
 * is authored at print scale, so this prints at scale 1 with no page margin and
 * the output lands where the originals do.
 *
 *   node resume/build.mjs            # both locales, into public/
 *   node resume/build.mjs en         # one locale
 *   node resume/build.mjs en --out /tmp/check.pdf
 *
 * Albert Sans is inlined from app/fonts as a data URI, so the print needs no
 * server and no network. Japanese falls to Hiragino Sans, which is a macOS
 * system font: regenerate on a Mac, the way the originals were made.
 */
import { chromium } from 'playwright';
import { readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');

const LOCALES = {
  en: { lang: 'en', out: 'public/rain-zhang-resume.pdf' },
  ja: { lang: 'ja', out: 'public/rain-zhang-resume-ja.pdf' },
};

const FONTS = [
  {
    file: 'app/fonts/AlbertSans-Upright-latin.woff2',
    range:
      'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD',
  },
  {
    file: 'app/fonts/AlbertSans-Upright-latin-ext.woff2',
    range:
      'U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF',
  },
];

async function fontFaces() {
  const faces = [];
  for (const { file, range } of FONTS) {
    const b64 = (await readFile(resolve(root, file))).toString('base64');
    faces.push(
      `@font-face{font-family:'Albert Sans';src:url(data:font/woff2;base64,${b64}) format('woff2');` +
        `font-weight:300 600;font-style:normal;font-display:block;unicode-range:${range};}`
    );
  }
  return faces.join('\n');
}

async function build(locale, outPath) {
  const { lang, out } = LOCALES[locale];
  const [css, body, faces] = await Promise.all([
    readFile(resolve(here, 'resume.css'), 'utf8'),
    readFile(resolve(here, `resume.${locale}.html`), 'utf8'),
    fontFaces(),
  ]);

  const html = `<!doctype html><html lang="${lang}"><head><meta charset="utf-8">
<title>Rain Zhang — Resume</title>
<style>${faces}</style>
<style>${css}</style>
</head><body>${body}</body></html>`;

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 816, height: 1056 } });
  await page.setContent(html, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  const pdf = await page.pdf({
    width: '8.5in',
    height: '11in',
    margin: { top: '0', right: '0', bottom: '0', left: '0' },
    printBackground: true,
    preferCSSPageSize: true,
    scale: 1,
    displayHeaderFooter: false,
    outline: false,
    tagged: false, // the originals report Tagged: no
  });
  await browser.close();

  const target = resolve(root, outPath ?? out);
  await writeFile(target, pdf);
  console.log(`${locale} -> ${target} (${pdf.length} bytes)`);
}

const args = process.argv.slice(2);
const outFlag = args.indexOf('--out');
const outPath = outFlag === -1 ? undefined : args[outFlag + 1];
const locales = args.filter((a) => a in LOCALES);

for (const locale of locales.length ? locales : Object.keys(LOCALES)) {
  await build(locale, locales.length === 1 ? outPath : undefined);
}
