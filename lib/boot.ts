/**
 * The boot gate: the paper sheet that covers the page until every image and
 * font it needs has arrived, so nothing pops in or draws in half under the
 * reader. It shows once per session.
 *
 * Two mechanisms with deliberately opposite defaults, because they fail
 * differently:
 *
 *   the overlay        default ON in CSS   lifted by JS, by a CSS failsafe, or
 *                                          hidden outright by a <noscript> rule
 *   the entrance pause default OFF         only ever turned on by the inline
 *                                          script, which also owns clearing it
 *
 * CSS can lift the sheet on its own, but CSS cannot resume a paused animation
 * on another element. If the pause defaulted on and the bundle never arrived,
 * `.enter` would stay frozen at opacity 0 under a lifted sheet — a blank page.
 * The way round it is above, a dead bundle degrades to exactly the behaviour
 * this site had before the gate existed.
 */

/** Set once the sheet has been shown, so the rest of the session skips it. */
export const bootFlag = 'portfolio.booted';

/**
 * How long the inline script waits for React before lifting the sheet itself.
 * This is the "script ran, the bundle never did" case; BootGate stands the
 * timer down the moment it mounts.
 */
export const bootHandoffMs = 2500;

/**
 * BootGate's own limit, and the only cap on the wait. It is not a deadline for
 * a slow connection to beat — everything the page needs is well under a
 * megabyte — it is the answer to a socket that opens and then never delivers,
 * so the site can never be permanently hidden behind its own loading screen.
 */
export const bootDeadlineMs = 10000;

/**
 * A reader who asked for less motion has no entrance left to protect — the
 * reduced-motion block in globals.css already collapses it — so the sheet has
 * nothing to wait for on their behalf beyond the first images, and a blank
 * sheet is disorienting for exactly that reader. Cut it short.
 */
export const bootReducedMotionMs = 800;

/** Per image, for the stall that fires neither `load` nor `error`. */
export const bootImageMs = 6000;

/** Mirrors --duration-base in globals.css; the fade before the sheet is gone. */
export const bootFadeMs = 220;

/**
 * Runs as the first child of <body>, before any content has been parsed, so
 * the sheet is either up or never seen — there is no frame in between.
 *
 * A repeat visit within the session goes straight to `done`. Because this runs
 * before #boot exists, that state is part of the element's first computed
 * style rather than a change to it, so there is no before-change style to
 * transition from and no flash.
 */
export const bootScript = `(function(){var d=document.documentElement;try{if(sessionStorage.getItem(${JSON.stringify(
  bootFlag
)})==="1"){d.setAttribute("data-boot","done");return}}catch(e){}d.setAttribute("data-boot","pending");window.__bootLive=false;setTimeout(function(){if(window.__bootLive||d.getAttribute("data-boot")!=="pending")return;d.setAttribute("data-boot","leaving");setTimeout(function(){d.setAttribute("data-boot","done")},${bootFadeMs})},${bootHandoffMs})})();`;

declare global {
  interface Window {
    /** Set by BootGate on mount, so the inline script's timer stands down. */
    __bootLive?: boolean;
  }
}
