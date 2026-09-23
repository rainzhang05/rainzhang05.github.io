import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { site } from '@/lib/site';

/**
 * globals.css is the only file with raw values. site.themeColor has to carry
 * one anyway, because a meta tag cannot read a custom property — so this keeps
 * the copy honest instead.
 */
describe('site.themeColor', () => {
  const css = readFileSync(resolve(__dirname, '../../app/globals.css'), 'utf8');
  const papers = [...css.matchAll(/--paper:\s*(#[0-9a-f]{3,8});/gi)].map((m) => m[1]);

  it('is the light --paper token from app/globals.css', () => {
    expect(papers[0]).toBeDefined();
    expect(site.themeColor.light).toBe(papers[0]);
  });

  it('is the dark --paper token from app/globals.css', () => {
    expect(papers[1]).toBeDefined();
    expect(site.themeColor.dark).toBe(papers[1]);
  });
});

describe('site.ogImage', () => {
  it('points at a file that is actually served', () => {
    const path = resolve(__dirname, '../../public', site.ogImage.replace(/^\//, ''));
    expect(() => readFileSync(path)).not.toThrow();
  });
});
