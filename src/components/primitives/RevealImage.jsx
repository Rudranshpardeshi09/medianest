import { useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { EASE, EASE_IN_OUT, VIEWPORT } from '@/lib/motion'

/**
 * Curtain reveal: a clip-path inset opens the frame while the image itself
 * counter-scales. Because mask and image travel in opposite directions the
 * picture appears to settle *into* its frame rather than simply appearing.
 *
 * The frame owns the single viewport trigger and drives the image through
 * variants — one IntersectionObserver per image instead of two, and the
 * two halves can never desynchronise.
 */
export default function RevealImage({
  src,
  alt,
  className = '',
  imgClassName = '',
  direction = 'up',
  delay = 0,
  parallax = 0,
  priority = false,
  width,
  height,
  sizes,
  objectPosition,
}) {
  const ref = useRef(null)
  const reduced = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], [`-${parallax}%`, `${parallax}%`])

  const closed = {
    up: 'inset(0% 0% 100% 0%)',
    down: 'inset(100% 0% 0% 0%)',
    left: 'inset(0% 100% 0% 0%)',
    right: 'inset(0% 0% 0% 100%)',
  }[direction]

  const restScale = parallax ? 1.14 : 1

  /* `objectPosition` is the crop's focal point, for images that come from the
     CMS and so have no fixed composition. It shares the style object with the
     parallax transform, which is why they are merged rather than one or the
     other -- a tile can want both. */
  const style =
    parallax && !reduced ? { y, objectPosition } : objectPosition ? { objectPosition } : undefined

  return (
    <motion.div
      ref={ref}
      className={`mn-reveal ${className}`}
      initial="hidden"
      whileInView="show"
      viewport={VIEWPORT}
      variants={{
        hidden: { clipPath: reduced ? 'inset(0%)' : closed, opacity: reduced ? 0 : 1 },
        show: {
          clipPath: 'inset(0% 0% 0% 0%)',
          opacity: 1,
          transition: { duration: 1.15, ease: EASE_IN_OUT, delay },
        },
      }}
    >
      <motion.img
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={priority ? 'high' : 'auto'}
        className={imgClassName}
        style={style}
        variants={{
          hidden: { scale: reduced ? 1 : 1.18 },
          show: { scale: restScale, transition: { duration: 1.45, ease: EASE, delay } },
        }}
      />
    </motion.div>
  )
}
