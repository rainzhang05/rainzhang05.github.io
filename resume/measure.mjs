/*
 * Reports how many lines every block of the resume sets to, and how much room
 * is left on its last line.
 *
 * Both PDFs are full to the bottom edge — the English column ends 35pt from the
 * foot of the page, the Japanese one 22pt — so one extra wrapped line anywhere
 * spills the resume onto a second page. Run this after rewording anything, and
 * before printing: it answers the only question that matters (did the line
 * count change?) in about a second, without a print.
 *
 *   node resume/measure.mjs en
 *   node resume/measure.mjs en --json     # machine-readable, for the tests
 */
import { chromium } from 'playwright';
import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
const locale = process.argv.find((a) => a === 'en' || a === 'ja') ?? 'en';
const asJson = process.argv.includes('--json');

const fonts = [
  'app/fonts/AlbertSans-Upright-latin.woff2',
  'app/fonts/AlbertSans-Upright-latin-ext.woff2',
];
const faces = (
  await Promise.all(
    fonts.map(async (f) => {
      const b64 = (await readFile(resolve(root, f))).toString('base64');
      return `@font-face{font-family:'Albert Sans';src:url(data:font/woff2;base64,${b64}) format('woff2');font-weight:300 600;font-style:normal;font-display:block;}`;
    })
  )
).join('\n');

const css = await readFile(resolve(here, 'resume.css'), 'utf8');
const body = await readFile(resolve(here, `resume.${locale}.html`), 'utf8');

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 816, height: 1056 } });
await page.emulateMedia({ media: 'print' });
await page.setContent(
  `<!doctype html><html lang="${locale}"><head><meta charset="utf-8">
<style>${faces}</style><style>${css}</style></head><body>${body}</body></html>`,
  { waitUntil: 'load' }
);
await page.evaluate(() => document.fonts.ready);

const rows = await page.$$eval(
  '.bullets li, .tagline, .skill dd, .school-lines p, .school-notes p, .entry-meta .stack',
  (els) =>
    els.map((el) => {
      const range = document.createRange();
      range.selectNodeContents(el);
      // One rect per inline box, not per line: a line holding a link yields
      // several. Group them by their top edge to get real line boxes.
      const rects = [...range.getClientRects()].filter((r) => r.width > 0.01);
      const tops = [...new Set(rects.map((r) => Math.round(r.top)))].sort((a, b) => a - b);
      const lastTop = tops[tops.length - 1];
      const lastRight = Math.max(
        ...rects.filter((r) => Math.round(r.top) === lastTop).map((r) => r.right)
      );
      return {
        kind: el.className || el.tagName.toLowerCase(),
        lines: tops.length,
        slack: Math.round((el.getBoundingClientRect().right - lastRight) * 100) / 100,
        text: (el.textContent ?? '').trim(),
      };
    })
);
const height = await page.evaluate(() => document.querySelector('.page').getBoundingClientRect().height);
await browser.close();

if (asJson) {
  console.log(JSON.stringify({ locale, height, rows }, null, 2));
} else {
  console.log(`${locale}: page content ${height.toFixed(1)}px of 1056px\n`);
  console.log('lines  slack  text');
  for (const r of rows) {
    console.log(`  ${String(r.lines).padStart(2)}  ${String(r.slack).padStart(6)}  ${r.text.slice(0, 68)}`);
  }
}
