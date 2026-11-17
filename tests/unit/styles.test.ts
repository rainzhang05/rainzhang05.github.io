import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import config from '@/tailwind.config';

const css = readFileSync(resolve(__dirname, '../../app/globals.css'), 'utf8');
const HOVER = '@media (hover: hover) and (pointer: fine)';

/** The text of the at-rule block that opens at `from`, braces balanced. */
function blockAt(from: number): string {
  const open = css.indexOf('{', from);
  let depth = 0;
  for (let i = open; i < css.length; i += 1) {
    if (css[i] === '{') depth += 1;
    else if (css[i] === '}' && (depth -= 1) === 0) return css.slice(open + 1, i);
  }
  throw new Error('unbalanced block');
}

/** Every block in the stylesheet that opens with this at-rule. */
function blocks(atRule: string): string[] {
  const found: string[] = [];
  for (let at = css.indexOf(atRule); at > -1; at = css.indexOf(atRule, at + 1)) {
    found.push(blockAt(at));
  }
  return found;
}

/**
 * A touchscreen has no hover but it does have :hover — it stays on the last
 * thing tapped. So every hover on the site sits behind the same query, the
 * utility classes through Tailwind and the hand-written rules by hand. These
 * keep the two from parting: with one gated and not the other, a class like
 * `hover:no-underline` would stop answering the rule it exists to answer.
 */
describe('hover, only where there is something to hover with', () => {
  it('gates every Tailwind hover: class', () => {
    expect(config.future).toMatchObject({ hoverOnlyWhenSupported: true });
  });

  it('gates every hover rule written by hand', () => {
    const gated = blocks(HOVER).join('\n');
    const ungated = blocks(HOVER).reduce((rest, block) => rest.replace(block, ''), css);

    expect(gated).toContain('a:hover');
    expect(gated).toContain('.theme-option:hover');
    expect(gated).toContain('.dock-item:hover');
    // Comments mention :hover; rules are what must not be left outside.
    expect(ungated.replace(/\/\*[\s\S]*?\*\//g, '')).not.toMatch(/:hover/);
  });
});

describe('a control small on purpose still takes a finger', () => {
  it('stretches the target to --hit-min, and only for a coarse pointer', () => {
    expect(css).toMatch(/--hit-min:\s*44px;/);

    const coarse = blocks('@media (pointer: coarse)').join('\n');
    expect(coarse).toContain('.hit-y::after');
    expect(coarse).toContain('height: var(--hit-min)');
    // Sideways growth would lay one option of a switch over the next.
    expect(coarse).not.toMatch(/width:\s*var\(--hit-min\)/);
  });
});

describe('forced colours', () => {
  const forced = blocks('@media (forced-colors: active)').join('\n');

  it('redraws the three pieces of state a forced palette would erase', () => {
    expect(forced).toContain('.locale-pill');
    expect(forced).toContain('.theme-pill');
    expect(forced).toContain(".dock-item[data-active='true'] .dock-dot");
    expect(forced).toContain('.toast');
  });

  it('uses system colours only, which are the ones that survive', () => {
    expect(forced.replace(/\/\*[\s\S]*?\*\//g, '')).not.toMatch(/var\(--|#[0-9a-f]{3,8}\b/i);
  });
});

describe('print', () => {
  it('leaves the viewport-fixed pieces off the paper', () => {
    const print = blocks('@media print').join('\n');

    for (const selector of ['.section-dock', '.toast-region', '#boot']) {
      expect(print).toContain(selector);
    }
    expect(print).toMatch(/display:\s*none\s*!important/);
  });
});
