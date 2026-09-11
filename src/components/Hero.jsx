import { Fragment } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import Magnetic from './Magnetic'
import '../styles/hero.css'

/* House easing — decisive start, long settle. */
const EASE = [0.16, 1, 0.3, 1]

/* Headline split by line and word so each word can unmask on its own.
   `accent` marks the single word set in slab italic orange. */
const LINES = [
  [{ t: 'Brand' }, { t: 'Image' }],
  [{ t: 'Management', accent: true }, { t: '&' }],
  [{ t: 'Consultancy' }],
]

export default function Hero() {
  const reduced = useReducedMotion()

  const goTo = (id) => {
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  // Words reveal in reading order across all three lines.
  let wordIndex = -1

  return (
    <section id="home" className="mn-hero">
      <div className="mn-hero__inner">
        <motion.p
          className="mn-hero__eyebrow"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
        >
          Visual Stories
          <span className="mn-hero__x" aria-hidden>
            ✕
          </span>
          Stronger Brands
        </motion.p>

        <h1 className="mn-hero__title">
          {LINES.map((line, li) => (
            <span className="mn-hero__line" key={li}>
              {line.map((word, wi) => {
                wordIndex += 1
                return (
                  <Fragment key={word.t}>
                    <span className="mn-hero__mask">
                      <motion.span
                        className={
                          'mn-hero__word' + (word.accent ? ' mn-hero__word--accent' : '')
                        }
                        initial={{ y: '110%' }}
                        animate={{ y: '0%' }}
                        transition={{
                          duration: 1.1,
                          ease: EASE,
                          delay: 0.22 + wordIndex * 0.075,
                        }}
                      >
                        {word.t}
                      </motion.span>
                    </span>
                    {/* Real space between the clipped boxes: a trailing space
                        inside an inline-block is trimmed by CSS and the words
                        would run together. */}
                    {wi < line.length - 1 ? ' ' : null}
                  </Fragment>
                )
              })}
            </span>
          ))}
        </h1>

        <motion.p
          className="mn-hero__desc"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.62 }}
        >
          Media Nest is a premier Brand Image Management and Consultancy firm specializing in
          creating and curating impactful visual content that amplifies brand presence and
          identity.
        </motion.p>

        <motion.div
          className="mn-hero__actions"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.76 }}
        >
          <Magnetic strength={0.26}>
            <button
              type="button"
              className="mn-cta mn-cta--solid"
              onClick={() => goTo('#projects')}
            >
              <span className="mn-cta__disc" aria-hidden>
                <svg viewBox="0 0 24 24" focusable="false">
                  <path d="M4 12h15M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <span>Explore Our Work</span>
            </button>
          </Magnetic>

          <Magnetic strength={0.26}>
            <button
              type="button"
              className="mn-cta mn-cta--outline"
              onClick={() => goTo('#video')}
            >
              <span className="mn-cta__disc" aria-hidden>
                <svg viewBox="0 0 20 20" focusable="false">
                  <path d="M5 3.2 16 10 5 16.8Z" />
                </svg>
              </span>
              <span>Watch Showreel</span>
            </button>
          </Magnetic>
        </motion.div>
      </div>

      {/* Full-bleed image band closing the hero */}
      <motion.div
        className="mn-hero__band"
        initial={reduced ? { opacity: 0 } : { clipPath: 'inset(100% 0 0 0)' }}
        animate={reduced ? { opacity: 1 } : { clipPath: 'inset(0% 0 0 0)' }}
        transition={{ duration: 1.2, ease: [0.83, 0, 0.17, 1], delay: 0.5 }}
      >
        <motion.img
          src="/media/photography.webp"
          alt="Media Nest on assignment — a match captured from the boundary"
          width="1300"
          height="1300"
          fetchPriority="high"
          decoding="async"
          initial={reduced ? undefined : { scale: 1.16 }}
          animate={reduced ? undefined : { scale: 1 }}
          transition={{ duration: 1.6, ease: EASE, delay: 0.5 }}
        />

        <div className="mn-hero__bandbar">
          <span>
            Ideas into
            <br />
            Impact
          </span>

          <span className="mn-hero__scroll" aria-hidden>
            Scroll
            <i />
          </span>

          <span>
            Creative People,
            <br />
            Bolder Brands
          </span>
        </div>
      </motion.div>
    </section>
  )
}
