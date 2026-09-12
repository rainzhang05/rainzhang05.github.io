/*
 * Solves the vertical offsets in resume.css against the baselines of the
 * shipped PDFs.
 *
 * The originals' every baseline sits on a whole pixel, and Chrome paints a
 * baseline at floor(layout position), so a block is right when its laid-out
 * baseline falls inside [target, target + 1). The solver aims for the middle of
 * that pixel, measures in the browser rather than by printing, and relaxes each
 * offset in document order until nothing moves — each offset carries every
 * block below it, so a few passes converge.
 *
 *   node resume/solve.mjs en        # prints the solved offsets and rewrites them
 *   node resume/solve.mjs en --dry  # report only
 *
 * Targets live in resume/targets.<locale>.json, extracted from the shipped PDF.
 */
import { chromium } from 'playwright';
import { readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');

const locale = process.argv.find((a) => a === 'en' || a === 'ja') ?? 'en';
const dry = process.argv.includes('--dry');
const PASSES = 8;
/* Where in the target pixel to aim the laid-out baseline. Solved empirically:
   Chrome's painted baseline is the pixel this position falls in, and aiming at
   the middle of the pixel landed everything one pixel low. */
const AIM = -0.25;

const fonts = [
  'app/fonts/AlbertSans-Upright-latin.woff2',
  'app/fonts/AlbertSans-Upright-latin-ext.woff2',
];

async function fontCss() {
  const out = [];
  for (const f of fonts) {
    const b64 = (await readFile(resolve(root, f))).toString('base64');
    out.push(
      `@font-face{font-family:'Albert Sans';src:url(data:font/woff2;base64,${b64}) format('woff2');font-weight:300 600;font-style:normal;font-display:block;}`
    );
  }
  return out.join('\n');
}

/** Each knob, the element whose first baseline it places, and that target. */
const KNOBS = [
  ['--o-contact', '.contact p', 'contact1'],
  ['--o-identity', '.identity h1', 'name'],
  ['--o-tagline', '.tagline', 'tagline'],
  ['--o-rule', '.col-main .block:first-of-type .rule', 'rule1'],
  ['--o-entry', '.col-main .block:first-of-type .entry:first-of-type h3', 'entry1title'],
  ['--o-meta', '.col-main .block:first-of-type .entry:first-of-type .org', 'entry1meta'],
  ['--o-bullets', '.col-main .block:first-of-type .entry:first-of-type .bullets li', 'entry1b1'],
  [
    '--o-bullet-gap',
    '.col-main .block:first-of-type .entry:first-of-type .bullets li:nth-child(2)',
    'entry1b2',
  ],
  ['--o-entry-gap', '.col-main .block:first-of-type .entry:nth-of-type(2) h3', 'entry2title'],
  ['--o-block-main', '.col-main .block:nth-of-type(2) h2', 'projheading'],
  ['--o-rule-proj', '.col-main .block:nth-of-type(2) .rule', 'ruleProj'],
  ['--o-entry-proj', '.col-main .block:nth-of-type(2) .entry:first-of-type h3', 'proj1title'],
  ['--o-stack-meta', '.col-main .block:nth-of-type(2) .entry:first-of-type .stack', 'proj1meta'],
  ['--o-bullets-proj', '.col-main .block:nth-of-type(2) .entry:first-of-type .bullets li', 'proj1b1'],
  ['--o-entry-gap-proj', '.col-main .block:nth-of-type(2) .entry:nth-of-type(2) h3', 'proj2title'],
  ['--o-skill', '.skill:first-of-type dt', 'skill1label'],
  ['--o-skill-items', '.skill:first-of-type dd', 'skill1items'],
  ['--o-skill-gap', '.skill:nth-of-type(2) dt', 'skill2label'],
  ['--o-skill-gap-3', '.skill:nth-of-type(3) dt', 'skill3label'],
  ['--o-skill-gap-4', '.skill:nth-of-type(4) dt', 'skill4label'],
  ['--o-skill-gap-5', '.skill:nth-of-type(5) dt', 'skill5label'],
  ['--o-block-aside', '.col-aside .block:nth-of-type(2) h2', 'eduheading'],
  ['--o-rule-edu', '.col-aside .block:nth-of-type(2) .rule', 'ruleEdu'],
  ['--o-school', '.school', 'school'],
  ['--o-school-lines', '.school-lines p', 'schoolline1'],
  ['--o-school-notes', '.school-notes p', 'schoolnote1'],
];

/* English offsets live in :root, Japanese ones in the html[lang='ja'] block, so
   a knob is read and written inside the block for the locale being solved. */
const BLOCK = locale === 'ja' ? "html[lang='ja'] {" : ':root {';
const blockAt = (css) => {
  const start = css.indexOf(BLOCK);
  if (start === -1) throw new Error(`block ${BLOCK} not found`);
  const end = css.indexOf('\n}', start);
  return [start, end];
};
const read = (css, knob) => {
  const [start, end] = blockAt(css);
  const m = css.slice(start, end).match(new RegExp(`(${knob}:\\s*)(-?[\\d.]+)px`));
  if (!m) throw new Error(`knob ${knob} not found in ${BLOCK}`);
  return Number(m[2]);
};
const write = (css, knob, value) => {
  const [start, end] = blockAt(css);
  const head = css.slice(0, start);
  const body = css
    .slice(start, end)
    .replace(new RegExp(`(${knob}:\\s*)(-?[\\d.]+)px`), `$1${value.toFixed(4)}px`);
  return head + body + css.slice(end);
};

const targets = JSON.parse(await readFile(resolve(here, `targets.${locale}.json`), 'utf8'));
const body = await readFile(resolve(here, `resume.${locale}.html`), 'utf8');
const faces = await fontCss();
let css = await readFile(resolve(here, 'resume.css'), 'utf8');

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 816, height: 1056 } });
await page.emulateMedia({ media: 'print' });

/** The bottom of a zero-height inline-block sits exactly on its line's baseline. */
const MEASURE = (sel) => {
  const el = document.querySelector(sel);
  if (!el) return null;
  if (el.classList.contains('rule')) return el.getBoundingClientRect().top;
  const m = document.createElement('span');
  m.style.cssText = 'display:inline-block;width:0;height:0;vertical-align:baseline';
  el.insertBefore(m, el.firstChild);
  const y = m.getBoundingClientRect().bottom;
  m.remove();
  return y;
};

async function measureAll() {
  const html = `<!doctype html><html lang="${locale}"><head><meta charset="utf-8">
<style>${faces}</style><style>${css}</style></head><body>${body}</body></html>`;
  await page.setContent(html, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  const out = {};
  for (const [, sel, name] of KNOBS) {
    out[name] = await page.evaluate(MEASURE, sel);
  }
  return out;
}

async function measureOne(sel) {
  const html = `<!doctype html><html lang="${locale}"><head><meta charset="utf-8">
<style>${faces}</style><style>${css}</style></head><body>${body}</body></html>`;
  await page.setContent(html, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  return page.evaluate(MEASURE, sel);
}

for (let pass = 1; pass <= PASSES; pass++) {
  let worst = 0;
  // Document order, one knob at a time: each offset carries every block below
  // it, so a correction must be measured after the one above it has landed.
  for (const [knob, sel, name] of KNOBS) {
    const target = targets[name];
    if (target == null) continue;
    const got = await measureOne(sel);
    if (got == null) continue;
    const delta = target + AIM - got;
    worst = Math.max(worst, Math.abs(delta));
    if (Math.abs(delta) > 0.02) css = write(css, knob, read(css, knob) + delta);
  }
  console.log(`pass ${pass}: worst delta ${worst.toFixed(3)}px`);
  if (worst <= 0.02) break;
}

const final = await measureAll();
console.log('\nknob                 value      baseline  target');
for (const [knob, , name] of KNOBS) {
  console.log(
    `  ${knob.padEnd(18)} ${String(read(css, knob).toFixed(4)).padStart(9)}  ` +
      `${final[name]?.toFixed(2).padStart(8)}  ${String(targets[name]).padStart(6)}`
  );
}
await browser.close();

if (!dry) {
  await writeFile(resolve(here, 'resume.css'), css);
  console.log('\nresume.css updated');
}
