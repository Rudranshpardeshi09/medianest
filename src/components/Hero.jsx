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

/* The collage. Four frames, overlapping and deliberately unaligned, so the
   right half reads as a spread of work rather than a gallery grid.

   EVENT.webp is deliberately absent: it carries burned-in Republic Day
   text across the top of the frame, and slot A crops horizontally, so no
   object-position can push the text out of a tall box.

   Every source clears its box at 1x. The tall slot draws on a 370x500
   original and runs ~1.2x on 2x displays — acceptable here because that
   frame is a shallow-depth-of-field shot with almost no fine detail. */
const SHEET = [
  {
    id: 'gear',
    slot: 'a',
    img: '/media/PHOTOGRAPHY-AND-BRAND-1.webp',
    alt: 'A Media Nest cinema camera rigged courtside',
  },
  {
    id: 'interview',
    slot: 'b',
    img: '/media/INTERVIEW.webp',
    alt: 'A lit interview set built by the Media Nest crew',
  },
  {
    id: 'strategy',
    slot: 'c',
    img: '/media/cinematography_main.webp',
    alt: 'A brand strategy session in progress at Media Nest',
  },
  {
    id: 'post',
    slot: 'd',
    img: '/media/video-edit.webp',
    alt: 'Post-production still from a Media Nest sports edit',
  },
]

/* Micro-type pinned around the collage. "Ideas into Impact" is the hero's
   own line, moved up here from the band. */
const NOTES = [
  { id: 'create', lines: ['Create', 'Capture', 'Connect'] },
  { id: 'scope', lines: ['Brands', 'Events', 'People', 'Stories'] },
  { id: 'impact', lines: ['Ideas into', 'Impact'] },
  { id: 'more', lines: ['More', 'than', 'content'] },
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
        {/* Chapter rail — marks the hero as section 01 of the page */}
        <div className="mn-hero__index" aria-hidden>
          <i className="mn-hero__index-bar" />
          <span>01</span>
          <i className="mn-hero__index-rule" />
        </div>

        <div className="mn-hero__copy">
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
                {/* Two arrows in one clipped disc: on hover the first exits
                    right and the second arrives from the left, so the mark is
                    replaced rather than nudged. */}
                <span className="mn-cta__disc" aria-hidden>
                  <span className="mn-cta__swap">
                    <svg viewBox="0 0 24 24" focusable="false">
                      <path d="M4 12h15M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <svg viewBox="0 0 24 24" focusable="false">
                      <path d="M4 12h15M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
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

        {/* ── Right column: the collage ──────────────────────── */}
        <div className="mn-hsheet">
          {/* Lens arcs, sweeping behind the frames */}
          <svg className="mn-hsheet__arcs" viewBox="0 0 720 540" aria-hidden focusable="false">
            <circle cx="560" cy="286" r="252" />
            <circle cx="560" cy="286" r="292" className="mn-hsheet__arc--faint" />
          </svg>

          {/* The firm's own figure, not an invented one: About records 5+
              years of practice across nine in-house disciplines. */}
          <span className="mn-hsheet__stat" aria-hidden>
            5+
          </span>
          <p className="mn-hsheet__lead" aria-hidden>
            Years of
            <br />
            practice
            <br />
            Nine disciplines
          </p>

          {SHEET.map((f, i) => (
            <motion.figure
              key={f.id}
              className={`mn-hsheet__frame mn-hsheet__frame--${f.slot}`}
              initial={
                reduced ? { opacity: 0 } : { opacity: 0, y: 24, clipPath: 'inset(100% 0 0 0)' }
              }
              animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0, clipPath: 'inset(0% 0 0 0)' }}
              transition={{ duration: 1.1, ease: EASE, delay: 0.5 + i * 0.12 }}
            >
              <img src={f.img} alt={f.alt} loading="lazy" decoding="async" />
            </motion.figure>
          ))}

          <motion.span
            className="mn-hsheet__badge"
            aria-hidden
            initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.4 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: EASE, delay: 1.05 }}
          >
            01
          </motion.span>

          {NOTES.map((n, i) => (
            <motion.p
              key={n.id}
              className={`mn-hsheet__note mn-hsheet__note--${n.id}`}
              aria-hidden
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1 + i * 0.1 }}
            >
              {n.lines.map((l, li) => (
                <Fragment key={l}>
                  {li ? <br /> : null}
                  {l}
                </Fragment>
              ))}
            </motion.p>
          ))}

          <span className="mn-hsheet__scroll" aria-hidden>
            <i />
            Scroll
          </span>
        </div>
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
          <p className="mn-hero__bandmark" aria-hidden>
            Creative People
            <br />
            Bolder Brands
          </p>
          <p className="mn-hero__bandnote" aria-hidden>
            Stories
            <br />
            that live
            <br />
            longer
          </p>
        </div>
      </motion.div>
    </section>
  )
}
