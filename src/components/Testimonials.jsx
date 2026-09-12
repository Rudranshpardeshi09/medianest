import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import MaskText from './primitives/MaskText'
import { EASE, VIEWPORT } from '@/lib/motion'
import '../styles/voices.css'
import FloatField from './primitives/FloatField'

const QUOTES = [
  {
    id: 'ajeya',
    quote:
      'MediaNest helps power PABSA, bringing billiards and snooker to the forefront in the Americas. We extend best wishes for their continued growth and success.',
    name: 'Ajeya Prabhakar',
    role: 'President, Pan American Billiards & Snooker Association',
    image: '/media/ajeya-1.webp',
  },
  {
    id: 'kalra',
    quote:
      'I extend my best wishes to the Media Nest team for continued success and creative excellence. As you lead the way in brand image management, may your innovative ideas keep inspiring brilliance and leaving a lasting impact on the brands you collaborate with.',
    name: 'SPS Kalra',
    role: 'Fashion & Cinematic Photographer',
    image: '/media/spskalra.webp',
  },
]

export default function Testimonials() {
  const [[index, dir], setState] = useState([0, 0])
  const [paused, setPaused] = useState(false)
  const count = QUOTES.length
  const item = QUOTES[index]

  const go = useCallback(
    (step) => setState(([i]) => [(i + step + count) % count, step]),
    [count],
  )

  // Gentle auto-advance, paused on hover/focus
  useEffect(() => {
    if (paused || count < 2) return
    const t = setInterval(() => go(1), 9000)
    return () => clearInterval(t)
  }, [paused, go, count])

  const onKeyDown = (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      go(-1)
    }
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      go(1)
    }
  }

  // Direction-aware: paging back genuinely feels like going back
  const variants = {
    enter: (d) => ({ opacity: 0, x: d > 0 ? 48 : -48 }),
    center: { opacity: 1, x: 0 },
    exit: (d) => ({ opacity: 0, x: d > 0 ? -48 : 48 }),
  }

  return (
    <section
      id="video"
      className="mn-quote"
      aria-labelledby="quote-heading"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <FloatField place="bottom" variant="b" />

      <span className="mn-quote__mark" aria-hidden>
        &ldquo;
      </span>

      <div className="mn-quote__inner">
        <motion.p
          className="mn-eyebrow"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.7, ease: EASE }}
        >
          In their words
        </motion.p>

        <h2 className="sr-only" id="quote-heading">
          Testimonials
        </h2>

        <div
          className="mn-quote__stage"
          tabIndex={0}
          role="group"
          aria-roledescription="carousel"
          aria-label="Client testimonials"
          onKeyDown={onKeyDown}
        >
          <AnimatePresence mode="wait" custom={dir}>
            <motion.figure
              key={item.id}
              className="mn-quote__fig"
              custom={dir}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.6, ease: EASE }}
            >
              <blockquote className="mn-quote__text">{item.quote}</blockquote>

              <figcaption className="mn-quote__cap">
                <span className="mn-quote__avatar">
                  <img
                    src={item.image}
                    alt=""
                    width="62"
                    height="62"
                    loading="lazy"
                    decoding="async"
                  />
                </span>
                <span>
                  <span className="mn-quote__name">{item.name}</span>
                  <span className="mn-quote__role">{item.role}</span>
                </span>
              </figcaption>
            </motion.figure>
          </AnimatePresence>
        </div>

        <div className="mn-quote__controls">
          <button
            type="button"
            className="mn-quote__arrow"
            onClick={() => go(-1)}
            aria-label="Previous testimonial"
          >
            <svg viewBox="0 0 24 24" aria-hidden focusable="false">
              <path d="M19.5 12h-15M10.5 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <ul className="mn-quote__dots">
            {QUOTES.map((q, i) => (
              <li key={q.id}>
                <button
                  type="button"
                  onClick={() => setState([i, i > index ? 1 : -1])}
                  aria-current={i === index ? 'true' : undefined}
                  aria-label={`Show testimonial ${i + 1} of ${count}`}
                />
              </li>
            ))}
          </ul>

          <button
            type="button"
            className="mn-quote__arrow"
            onClick={() => go(1)}
            aria-label="Next testimonial"
          >
            <svg viewBox="0 0 24 24" aria-hidden focusable="false">
              <path d="M4.5 12h15M13.5 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* Announce slide changes without moving focus */}
        <p aria-live="polite" className="sr-only">
          Testimonial {index + 1} of {count}: {item.name}
        </p>
      </div>
    </section>
  )
}
