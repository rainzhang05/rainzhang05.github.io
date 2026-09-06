import { vi, type Mock } from "vitest";

// ---------------------------------------------------------------------------
// matchMedia
// ---------------------------------------------------------------------------

export interface MatchMediaController {
  /** Notify every active MediaQueryList subscriber of a new match state. */
  dispatch(matches: boolean): void;
  /** Restore the original `window.matchMedia` (or remove it if none existed). */
  restore(): void;
  /** The spy installed on `window.matchMedia`. */
  spy: Mock;
}

export interface MockMatchMediaOptions {
  /**
   * When true, the produced MediaQueryList omits `addEventListener`/
   * `removeEventListener` so consumers fall through to the legacy
   * `addListener`/`removeListener` API (Safari <14 code path).
   */
  legacy?: boolean;
}

type MatchesArg = boolean | ((query: string) => boolean);

export function mockMatchMedia(
  matches: MatchesArg = false,
  options: MockMatchMediaOptions = {}
): MatchMediaController {
  const hadOriginal = "matchMedia" in window;
  const original = hadOriginal ? window.matchMedia : undefined;
  const listeners = new Set<(event: MediaQueryListEvent) => void>();
  let currentMatches = typeof matches === "function" ? false : matches;

  const spy = vi.fn((query: string) => {
    const addListener = vi.fn((cb: (event: MediaQueryListEvent) => void) => {
      listeners.add(cb);
    });
    const removeListener = vi.fn((cb: (event: MediaQueryListEvent) => void) => {
      listeners.delete(cb);
    });
    const mql: Record<string, unknown> = {
      media: query,
      onchange: null,
      addListener,
      removeListener,
      dispatchEvent: vi.fn(() => true),
    };
    if (!options.legacy) {
      mql.addEventListener = vi.fn((event: string, cb: (event: MediaQueryListEvent) => void) => {
        if (event === "change") listeners.add(cb);
      });
      mql.removeEventListener = vi.fn((event: string, cb: (event: MediaQueryListEvent) => void) => {
        if (event === "change") listeners.delete(cb);
      });
    }
    // Live, like a real MediaQueryList: consumers that re-read `.matches`
    // after a change event must see the new value.
    Object.defineProperty(mql, "matches", {
      get: () => (typeof matches === "function" ? matches(query) : currentMatches),
      enumerable: true,
    });
    return mql as unknown as MediaQueryList;
  });

  Object.defineProperty(window, "matchMedia", {
    value: spy,
    configurable: true,
    writable: true,
  });

  return {
    dispatch(newMatches: boolean) {
      currentMatches = newMatches;
      const event = { matches: newMatches } as MediaQueryListEvent;
      listeners.forEach((cb) => cb(event));
    },
    restore() {
      if (hadOriginal) {
        Object.defineProperty(window, "matchMedia", {
          value: original,
          configurable: true,
          writable: true,
        });
      } else {
        delete (window as { matchMedia?: typeof window.matchMedia }).matchMedia;
      }
    },
    spy,
  };
}

// ---------------------------------------------------------------------------
// clipboard
// ---------------------------------------------------------------------------

export interface ClipboardController {
  writeText: Mock;
  restore(): void;
}

export interface MockClipboardOptions {
  /** When true, `writeText` returns a rejected promise. */
  shouldReject?: boolean;
  /** When true, removes `navigator.clipboard` entirely. */
  absent?: boolean;
}

type ClipboardTarget = { clipboard?: Clipboard };

export function mockClipboard(options: MockClipboardOptions = {}): ClipboardController {
  const hadOriginal = "clipboard" in navigator;
  const original = hadOriginal ? navigator.clipboard : undefined;

  if (options.absent) {
    Object.defineProperty(navigator, "clipboard", {
      value: undefined,
      configurable: true,
      writable: true,
    });
    const writeText = vi.fn(() => Promise.resolve());
    return {
      writeText,
      restore() {
        if (hadOriginal) {
          Object.defineProperty(navigator, "clipboard", {
            value: original,
            configurable: true,
            writable: true,
          });
        } else {
          delete (navigator as ClipboardTarget).clipboard;
        }
      },
    };
  }

  const writeText = vi.fn(() =>
    options.shouldReject ? Promise.reject(new Error("clipboard rejected")) : Promise.resolve()
  );

  Object.defineProperty(navigator, "clipboard", {
    value: { writeText },
    configurable: true,
    writable: true,
  });

  return {
    writeText,
    restore() {
      if (hadOriginal) {
        Object.defineProperty(navigator, "clipboard", {
          value: original,
          configurable: true,
          writable: true,
        });
      } else {
        delete (navigator as ClipboardTarget).clipboard;
      }
    },
  };
}

// ---------------------------------------------------------------------------
// requestAnimationFrame
// ---------------------------------------------------------------------------

export interface RafController {
  /** Run every queued RAF callback in FIFO order, clearing the queue. */
  flush(): void;
  restore(): void;
  raf: Mock;
  caf: Mock;
}

export function mockRaf(): RafController {
  const originalRaf = window.requestAnimationFrame;
  const originalCaf = window.cancelAnimationFrame;
  let nextId = 1;
  const callbacks = new Map<number, FrameRequestCallback>();

  const raf = vi.fn((cb: FrameRequestCallback) => {
    const id = nextId++;
    callbacks.set(id, cb);
    return id;
  });
  const caf = vi.fn((id: number) => {
    callbacks.delete(id);
  });

  window.requestAnimationFrame = raf as unknown as typeof window.requestAnimationFrame;
  window.cancelAnimationFrame = caf as unknown as typeof window.cancelAnimationFrame;

  return {
    flush() {
      const entries = Array.from(callbacks.entries());
      callbacks.clear();
      entries.forEach(([, cb]) => cb(performance.now()));
    },
    restore() {
      window.requestAnimationFrame = originalRaf;
      window.cancelAnimationFrame = originalCaf;
    },
    raf,
    caf,
  };
}

// ---------------------------------------------------------------------------
// scrollIntoView / window.scrollTo
// ---------------------------------------------------------------------------

export interface SpyController {
  spy: Mock;
  restore(): void;
}

export function mockScrollIntoView(): SpyController {
  const original = Element.prototype.scrollIntoView;
  const spy = vi.fn();
  Element.prototype.scrollIntoView = spy as unknown as typeof Element.prototype.scrollIntoView;
  return {
    spy,
    restore() {
      Element.prototype.scrollIntoView = original;
    },
  };
}

export function mockWindowScrollTo(): SpyController {
  const original = window.scrollTo;
  const spy = vi.fn();
  window.scrollTo = spy as unknown as typeof window.scrollTo;
  return {
    spy,
    restore() {
      window.scrollTo = original;
    },
  };
}

// ---------------------------------------------------------------------------
// window.location
// ---------------------------------------------------------------------------

export interface WindowLocationController {
  location: { href: string };
  restore(): void;
}

export function mockWindowLocation(initialHref = "http://localhost/"): WindowLocationController {
  const original = window.location;
  const location = { href: initialHref };
  Object.defineProperty(window, "location", {
    value: location,
    configurable: true,
    writable: true,
  });
  return {
    location,
    restore() {
      Object.defineProperty(window, "location", {
        value: original,
        configurable: true,
        writable: true,
      });
    },
  };
}
