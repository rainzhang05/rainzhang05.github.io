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
  it('is the --paper token from app/globals.css', () => {
    const css = readFileSync(resolve(__dirname, '../../app/globals.css'), 'utf8');
    const paper = /--paper:\s*(#[0-9a-f]{3,8});/i.exec(css)?.[1];

    expect(paper).toBeDefined();
    expect(site.themeColor).toBe(paper);
  });
});

describe('site.ogImage', () => {
  it('points at a file that is actually served', () => {
    const path = resolve(__dirname, '../../public', site.ogImage.replace(/^\//, ''));
    expect(() => readFileSync(path)).not.toThrow();
  });
});
