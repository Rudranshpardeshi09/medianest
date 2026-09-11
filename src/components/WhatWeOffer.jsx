import { useRef } from 'react'
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from 'framer-motion'
import { EASE, VIEWPORT } from '@/lib/motion'

const DISCIPLINES = [
  'Photography',
  'Cinematography',
  'Brand Strategy',
  'Interviews',
  'Live Streaming',
  'Video Editing',
  'Graphic Design',
  'Events',
  'Digital Marketing',
]

/**
 * A ticker that drifts on its own and is *pushed* by scrolling: scroll down
 * and it speeds up, scroll up and it reverses. The velocity is spring-damped
 * so flicks read as momentum rather than jitter.
 *
 * The row is duplicated and translated modulo one copy's width, giving a
 * seamless loop with only a transform animating.
 */
export default function WhatWeOffer() {
  const baseX = useMotionValue(0)
  const reduced = useReducedMotion()
  const directionRef = useRef(1)

  const { scrollY } = useScroll()
  const scrollVelocity = useVelocity(scrollY)
  const smooth = useSpring(scrollVelocity, { damping: 50, stiffness: 400 })
  /* Clamped on purpose. Unclamped, a fast flick multiplied the drift by 4x
     or more and the words became unreadable smears. */
  const factor = useTransform(smooth, [-1800, 0, 1800], [-1, 0, 1], { clamp: true })

  /* Percent of the track per second. One copy is 25% of the row, so 3
     means a discipline takes roughly eight seconds to cross — slow enough
     to actually read. The first pass used 18, which crossed a full copy in
     1.4s and was a blur. */
  const BASE_VELOCITY = 3
  const MAX_BOOST = 1.6

  useAnimationFrame((_, delta) => {
    if (reduced) return
    const f = factor.get()
    if (f < -0.02) directionRef.current = -1
    else if (f > 0.02) directionRef.current = 1

    const boost = 1 + Math.min(Math.abs(f), 1) * MAX_BOOST
    const moveBy = directionRef.current * BASE_VELOCITY * boost * (delta / 1000)

    // Each copy is 25% of the track (four copies), so wrap on that interval.
    baseX.set(((baseX.get() + moveBy) % 25) - 25)
  })

  const x = useTransform(baseX, (v) => `${v}%`)

  return (
    <section className="mn-offer" aria-labelledby="offer-heading">
      <div className="mn-offer__label">
        <motion.h2
          id="offer-heading"
          className="mn-eyebrow"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.7, ease: EASE }}
        >
          What we offer
        </motion.h2>
      </div>

      <div className="mn-offer__track">
        <motion.div className="mn-offer__row" style={reduced ? undefined : { x }}>
          {/* Four copies so the loop never runs dry on ultrawide screens.
              Only the first is exposed to assistive tech. */}
          {[0, 1, 2, 3].map((copy) => (
            <div
              key={copy}
              className="mn-offer__item"
              aria-hidden={copy > 0 ? true : undefined}
            >
              {DISCIPLINES.map((d) => (
                <span key={d} className="mn-offer__item">
                  <span>{d}</span>
                  <i className="mn-offer__dot" aria-hidden />
                </span>
              ))}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
