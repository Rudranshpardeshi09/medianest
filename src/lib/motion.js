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

/** Standard viewport trigger: fire once, slightly before fully in view. */
export const VIEWPORT = { once: true, margin: '-12% 0px -12% 0px' }

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
