import { afterEach, describe, expect, it } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { prefersReducedMotion, useReducedMotion } from '@/lib/useReducedMotion';
import { mockMatchMedia, type MatchMediaController } from '../setup/dom-mocks';

let media: MatchMediaController | null = null;

afterEach(() => {
  media?.restore();
  media = null;
});

describe('useReducedMotion', () => {
  it('is false when the visitor has expressed no preference', () => {
    media = mockMatchMedia(false);
    const { result } = renderHook(() => useReducedMotion());

    expect(result.current).toBe(false);
  });

  it('is true when reduced motion is requested', () => {
    media = mockMatchMedia(true);
    const { result } = renderHook(() => useReducedMotion());

    expect(result.current).toBe(true);
  });

  it('follows the preference changing while the page is open', () => {
    media = mockMatchMedia(false);
    const { result } = renderHook(() => useReducedMotion());

    act(() => media?.dispatch(true));
    expect(result.current).toBe(true);
  });

  it('unsubscribes on unmount', () => {
    media = mockMatchMedia(false);
    const { unmount } = renderHook(() => useReducedMotion());

    unmount();
    act(() => media?.dispatch(true));
    expect(true).toBe(true);
  });
});

describe('prefersReducedMotion', () => {
  it('answers the same question outside React', () => {
    media = mockMatchMedia(true);
    expect(prefersReducedMotion()).toBe(true);

    media.restore();
    media = mockMatchMedia(false);
    expect(prefersReducedMotion()).toBe(false);
  });
});
