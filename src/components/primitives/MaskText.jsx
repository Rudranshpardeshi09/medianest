import { Fragment } from 'react'
import { motion } from 'framer-motion'
import { EASE, VIEWPORT } from '@/lib/motion'

/**
 * Text that unmasks upward from behind a clipped parent.
 *
 * Two rules are baked in here because both were learned the hard way in
 * this codebase — do not "simplify" them away:
 *
 * 1. The viewport trigger lives on the UNCLIPPED wrapper, never on the
 *    moving span. A span that starts translated fully below its own
 *    `overflow: hidden` box is 100% clipped, so IntersectionObserver
 *    reports zero intersection and `whileInView` can never fire: it is
 *    hidden because it hasn't animated, and can't animate because it's
 *    hidden. The wrapper owns the observer and drives the spans through
 *    variant propagation instead.
 *
 * 2. The separating space is a real text node BETWEEN the clipped boxes.
 *    A trailing space at the end of an inline-block is trimmed by the CSS
 *    white-space algorithm and the words run together. Keeping it a real
 *    space (rather than a margin) also preserves copy-paste and
 *    screen-reader word boundaries.
 */
export default function MaskText({
  children,
  as = 'span',
  className = '',
  delay = 0,
  stagger = 0.06,
  duration = 1.05,
  y = '110%',
}) {
  const words = String(children).split(' ')
  const Wrapper = motion[as] ?? motion.span

  return (
    <Wrapper
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={VIEWPORT}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: stagger, delayChildren: delay } },
      }}
    >
      {words.map((word, i) => (
        <Fragment key={`${word}-${i}`}>
          <span className="mn-mask">
            <motion.span
              className="mn-mask__word"
              variants={{
                hidden: { y },
                show: { y: '0%', transition: { duration, ease: EASE } },
              }}
            >
              {word}
            </motion.span>
          </span>
          {i < words.length - 1 ? ' ' : null}
        </Fragment>
      ))}
    </Wrapper>
  )
}
