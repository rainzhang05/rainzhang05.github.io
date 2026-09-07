'use client';

import { useEffect, useState } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

/**
 * Safari 13 and older, and the iOS versions that shipped with them, only have
 * the deprecated addListener/removeListener pair on a MediaQueryList. Calling
 * addEventListener there throws, which would surface as a React error rather
 * than as a browser that simply keeps its animations.
 */
function subscribe(mq: MediaQueryList, onChange: () => void): () => void {
  if (typeof mq.addEventListener === 'function') {
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }

  mq.addListener(onChange);
  return () => mq.removeListener(onChange);
}

/** True when the visitor has asked for reduced motion. */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(QUERY);
    const update = () => setReduced(mq.matches);
    update();
    return subscribe(mq, update);
  }, []);

  return reduced;
}

/** Same question, outside React (used by the scroll helpers). */
export function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia(QUERY).matches;
}
