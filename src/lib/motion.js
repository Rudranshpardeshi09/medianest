/**
 * Shared motion vocabulary.
 *
 * Every section pulls easing and timing from here so the whole page moves
 * with one hand — the single biggest tell of a considered site.
 */

/** House easing: decisive start, long settle. */
export const EASE = [0.16, 1, 0.3, 1]

/** Symmetrical quint — for things that travel out and back (curtains, wipes). */
export const EASE_IN_OUT = [0.83, 0, 0.17, 1]

/** Standard viewport trigger: fire once, before the element reaches the fold.
 *
 *  The bottom margin is POSITIVE on purpose. rootMargin semantics are
 *  top/right/bottom/left, and a positive value grows the observer root past
 *  the viewport edge, so this fires while the element is still 14% of a
 *  screen below the fold. It used to be -12%, which shrank the root and made
 *  the trigger late: a heading sat dead centre of the viewport for a full
 *  second with its words still sliding up inside their clip boxes, which
 *  reads as text cut in half rather than as a reveal. Measured before the
 *  change: visible at 600ms, all words settled only at 1600ms. */
export const VIEWPORT = { once: true, margin: '-8% 0px 14% 0px' }

/** Later trigger, for elements that should land after their heading. */
export const VIEWPORT_LATE = { once: true, margin: '0px 0px -22% 0px' }

/** Parent that releases children one after another. */
export const stagger = (staggerChildren = 0.08, delayChildren = 0) => ({
  hidden: {},
  show: { transition: { staggerChildren, delayChildren } },
})

/** Rise + settle. The default entrance for text and cards. */
export const riseIn = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.85, ease: EASE } },
}
