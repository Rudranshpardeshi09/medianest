import { Fragment } from 'react'
import { motion } from 'framer-motion'
import { EASE, VIEWPORT } from '@/lib/motion'

/**
 * Text that fades up as it enters the viewport.
 *
 * The words are NOT slid out of a clipping box any more. A clip-box reveal
 * spends most of its run showing half a glyph, and on a section heading —
 * which is usually at a readable position well before the reveal ends — that
 * reads as text cut in half rather than as a reveal. The accent word suffered
 * worst: it carried the largest delay in each heading, so it was always the
 * last to land and therefore the one caught half-risen.
 *
 * The hero keeps the clipped slide (.mn-hero__mask). It plays on load, above
 * the fold, where the effect is the point and nothing is still in flight by
 * the time you are reading.
 *
 * Two rules are still baked in here — do not "simplify" them away:
 *
 * 1. The viewport trigger lives on the wrapper, never on the moving span, and
 *    the spans are driven through variant propagation. This mattered
 *    absolutely back when the span started fully clipped: it could never
 *    intersect, so it was hidden because it hadn't animated and couldn't
 *    animate because it was hidden. Keeping the arrangement means the whole
 *    line still staggers off one observer.
 *
 * 2. The separating space is a real text node BETWEEN the words. A trailing
 *    space at the end of an inline-block is trimmed by the CSS white-space
 *    algorithm and the words run together. Keeping it a real space (rather
 *    than a margin) also preserves copy-paste and screen-reader word
 *    boundaries.
 */
export default function MaskText({
  children,
  as = 'span',
  className = '',
  delay = 0,
  /* Tightened from 0.06 / 1.05s. At the old timing the last word of a
     three-line heading landed ~1.4s after the trigger, long after the
     heading was readable. */
  stagger = 0.045,
  duration = 0.78,
  /* A short rise, in percent of the word's own line box. It has to stay
     small: nothing is clipped now, so a large offset would have the word
     visibly overlapping the line beneath it on the way up. */
  y = '22%',
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
                hidden: { y, opacity: 0 },
                show: { y: '0%', opacity: 1, transition: { duration, ease: EASE } },
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
