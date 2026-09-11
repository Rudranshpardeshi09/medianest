import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

/**
 * The giant rotated section title running down a section's edge.
 *
 * Two identical copies are stacked: the base is stroke-only (hollow), the
 * top copy is solid and clipped by a scroll-driven inset — so the letters
 * appear to pour full of colour as the section passes through the viewport.
 *
 * It duplicates the section's real heading, so it is hidden from assistive
 * technology entirely.
 */
export default function EdgeTitle({ children, side = 'left', className = '' }) {
  const ref = useRef(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.9', 'end 0.15'],
  })

  const clip = useTransform(
    scrollYProgress,
    [0, 1],
    ['inset(0% 0% 100% 0%)', 'inset(0% 0% 0% 0%)'],
  )

  return (
    <div
      ref={ref}
      aria-hidden
      className={`mn-edge mn-edge--${side} ${className}`}
    >
      {/* No upward half-translate here: with the wrapper pinned to the
          section's full height, shifting a very tall title up by half its
          height pushes it past the section's top edge and it bleeds into
          whatever sits above. Offsetting from the viewport top keeps it in. */}
      <div className="mn-edge__sticky">
        <div className="mn-edge__stack">
          <span className="mn-edge__base">{children}</span>
          <motion.span className="mn-edge__fill" style={{ clipPath: clip }}>
            {children}
          </motion.span>
        </div>
      </div>
    </div>
  )
}
