import { Fragment, useRef } from 'react'
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion'
import Magnetic from './Magnetic'
import '../styles/hero.css'

/* House easing — decisive start, long luxurious settle. */
const EASE = [0.16, 1, 0.3, 1]

/* Headline split into lines/words so each word can unmask on its own. */
const LINES = [
  [{ t: 'Brand' }, { t: 'Image', brush: true }],
  [{ t: 'Management' }, { t: '&' }, { t: 'Consultancy' }],
]

const SOCIAL = [
  { icon: 'fab fa-facebook-f', label: 'Facebook', href: 'https://www.facebook.com/medianest2024' },
  { icon: 'fab fa-instagram', label: 'Instagram', href: 'https://www.instagram.com/medianest.official/' },
  {
    icon: 'fab fa-whatsapp',
    label: 'WhatsApp',
    href: 'https://wa.me/918448112770?text=Hi%2C%20I%20visited%20your%20website%20and%20want%20to%20know%20more.',
  },
  { icon: 'fab fa-youtube', label: 'YouTube', href: 'https://youtube.com/@medianesttv?feature=shared' },
  { icon: 'fab fa-linkedin-in', label: 'LinkedIn', href: 'https://www.linkedin.com/company/104838310/' },
]

export default function Hero() {
  const heroRef = useRef(null)
  const reduced = useReducedMotion()

  /* ── Scroll parallax ───────────────────────────────────────
     Plate drifts slower than the page and dims as it leaves; the
     copy lifts and fades. Together they read as a camera move. */
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })
  const plateY = useTransform(scrollYProgress, [0, 1], ['0%', '18%'])
  const plateScale = useTransform(scrollYProgress, [0, 1], [1, 1.14])
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '-22%'])
  const contentFade = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  /* ── Cursor parallax + orbs ────────────────────────────────
     One listener on the hero drives everything. Values are
     normalised to -0.5..0.5 so depth is resolution-independent. */
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const rawX = useMotionValue(-600)
  const rawY = useMotionValue(-600)

  const shapeX = useSpring(useTransform(mx, (v) => v * -46), { stiffness: 46, damping: 18 })
  const shapeY = useSpring(useTransform(my, (v) => v * -34), { stiffness: 46, damping: 18 })
  const copyX = useSpring(useTransform(mx, (v) => v * 14), { stiffness: 60, damping: 20 })

  // Mismatched springs: the warm orb drags well behind the cool one.
  const warmX = useSpring(rawX, { stiffness: 24, damping: 22, mass: 1.1 })
  const warmY = useSpring(rawY, { stiffness: 24, damping: 22, mass: 1.1 })
  const coolX = useSpring(rawX, { stiffness: 58, damping: 20, mass: 0.7 })
  const coolY = useSpring(rawY, { stiffness: 58, damping: 20, mass: 0.7 })

  const onPointerMove = (e) => {
    if (reduced || !heroRef.current) return
    const r = heroRef.current.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width - 0.5)
    my.set((e.clientY - r.top) / r.height - 0.5)
    rawX.set(e.clientX - r.left)
    rawY.set(e.clientY - r.top)
  }

  const onPointerLeave = () => {
    mx.set(0)
    my.set(0)
  }

  const goTo = (id) => {
    const el = document.querySelector(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  // Words reveal in reading order across both lines.
  let wordIndex = -1

  return (
    <>
      <section
        id="home"
        ref={heroRef}
        className="mn-hero"
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
      >
        {/* Theme's arch/circle plate, on a slow parallax */}
        <motion.div
          className="mn-hero__plate"
          aria-hidden
          style={reduced ? undefined : { y: plateY, scale: plateScale }}
        />
        <div className="mn-hero__veil" aria-hidden />

        {/* Motion graphics */}
        <motion.div
          className="mn-hero__shapes"
          aria-hidden
          style={reduced ? undefined : { x: shapeX, y: shapeY }}
        >
          <HeroShapes reduced={reduced} />
        </motion.div>

        {/* Cursor-following orbs */}
        {!reduced && (
          <div className="mn-hero__shapes" aria-hidden>
            <motion.div
              className="mn-hero__orb mn-hero__orb--warm"
              style={{ x: warmX, y: warmY, translateX: '-50%', translateY: '-50%' }}
            />
            <motion.div
              className="mn-hero__orb mn-hero__orb--cool"
              style={{ x: coolX, y: coolY, translateX: '-50%', translateY: '-50%' }}
            />
          </div>
        )}

        <div className="mn-hero__grain" aria-hidden />

        {/* ── Copy ───────────────────────────────────────── */}
        <motion.div
          className="mn-hero__inner"
          style={reduced ? undefined : { y: contentY, opacity: contentFade, x: copyX }}
        >
          <motion.p
            className="mn-hero__eyebrow"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.08 }}
          >
            <span className="mn-hero__pulse" aria-hidden />
            Visual Excellence, Tangible Results
            <span className="mn-hero__rule" aria-hidden />
          </motion.p>

          <h1 className="mn-hero__title">
            {LINES.map((line, li) => (
              <span className="mn-hero__line" key={li}>
                {line.map((word, wi) => {
                  wordIndex += 1
                  const delay = 0.18 + wordIndex * 0.07
                  return (
                    <Fragment key={word.t}>
                      <span className="mn-hero__mask">
                        <motion.span
                          className="mn-hero__word"
                          initial={{ y: '112%' }}
                          animate={{ y: '0%' }}
                          transition={{ duration: 1.15, ease: EASE, delay }}
                        >
                          {word.brush ? (
                            <span className="mn-hero__brushwrap">
                              {word.t}
                              <BrushUnderline delay={delay + 0.75} reduced={reduced} />
                            </span>
                          ) : (
                            word.t
                          )}
                        </motion.span>
                      </span>
                      {/* Real space between clipped boxes: a trailing space
                          inside an inline-block gets trimmed by CSS. */}
                      {wi < line.length - 1 ? ' ' : null}
                    </Fragment>
                  )
                })}
              </span>
            ))}
            {!reduced && <span className="mn-hero__glint" aria-hidden />}
          </h1>

          <motion.p
            className="mn-hero__desc"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE, delay: 0.58 }}
          >
            Media Nest is a premier Brand Image Management and Consultancy firm specializing in
            creating and curating impactful visual content that amplifies brand presence and
            identity. With over 5+ years of expertise, our team of seasoned professionals brings a
            wealth of industry knowledge and a deep understanding of how visual storytelling can
            elevate brands across industries.
          </motion.p>

          <motion.div
            className="mn-hero__actions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE, delay: 0.72 }}
          >
            <Magnetic strength={0.3}>
              <button type="button" className="mn-btn" onClick={() => goTo('#services')}>
                <PlayArrow />
                <span>Read More</span>
              </button>
            </Magnetic>

            <Magnetic strength={0.3}>
              <button
                type="button"
                className="mn-btn mn-btn--ghost"
                onClick={() => goTo('#contact')}
              >
                <span>Start a Project</span>
              </button>
            </Magnetic>
          </motion.div>
        </motion.div>

        <motion.div
          className="mn-hero__scroll"
          aria-hidden
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.05 }}
          style={reduced ? undefined : { opacity: contentFade }}
        >
          <span>Scroll</span>
          <i />
        </motion.div>
      </section>

      <InfoBanner />
    </>
  )
}

/* ------------------------------------------------------------------ *
 * Play triangle — theme's signature arrow, drawn so it can change
 * colour when the liquid fill rises behind it (a flat orange PNG
 * would disappear into the orange fill).
 * ------------------------------------------------------------------ */

function PlayArrow() {
  return (
    <svg className="mn-btn__arrow" viewBox="0 0 20 23" aria-hidden focusable="false">
      <path d="M2 2.2 17.4 11.5 2 20.8Z" />
    </svg>
  )
}

/* ------------------------------------------------------------------ *
 * Brush underline that draws itself under "Image".
 * ------------------------------------------------------------------ */

function BrushUnderline({ delay, reduced }) {
  return (
    <svg
      className="mn-hero__brush"
      viewBox="0 0 300 12"
      preserveAspectRatio="none"
      aria-hidden
      focusable="false"
    >
      <motion.path
        d="M3 8.4C58 3.2 128 2.4 297 6.2"
        initial={reduced ? { pathLength: 1 } : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.95, ease: EASE, delay: reduced ? 0 : delay }}
      />
    </svg>
  )
}

/* ------------------------------------------------------------------ *
 * Motion graphics: arch motifs (the MN mark's language), soft circles
 * and the theme's orange edge ticks.
 * ------------------------------------------------------------------ */

function HeroShapes({ reduced }) {
  const float = (distance, duration, delay = 0) =>
    reduced
      ? {}
      : {
          animate: { y: [0, -distance, 0] },
          transition: { duration, ease: 'easeInOut', repeat: Infinity, delay },
        }

  return (
    <>
      {/* Orange edge ticks, left — draw in on load */}
      <svg className="mn-hero__ticks" style={{ left: 0, top: '18%' }} width="86" height="300" viewBox="0 0 86 300">
        {[30, 148, 266].map((y, i) => (
          <g key={y}>
            <motion.line
              x1="0"
              y1={y}
              x2="58"
              y2={y}
              stroke="var(--orange, #e95523)"
              strokeWidth="3"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.3 + i * 0.12 }}
            />
            <motion.circle
              cx="64"
              cy={y}
              r="4"
              fill="none"
              stroke="var(--orange, #e95523)"
              strokeWidth="3"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: EASE, delay: 0.62 + i * 0.12 }}
              style={{ transformOrigin: `64px ${y}px` }}
            />
          </g>
        ))}
      </svg>

      {/* Soft circle, top right */}
      <motion.svg
        style={{ right: '-6%', top: '-14%' }}
        width="620"
        height="620"
        viewBox="0 0 620 620"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.6, ease: EASE, delay: 0.2 }}
        {...float(26, 13)}
      >
        <circle cx="310" cy="310" r="300" fill="rgba(255,255,255,0.035)" />
        <circle cx="310" cy="310" r="300" fill="none" stroke="rgba(255,255,255,0.07)" />
      </motion.svg>

      {/* Soft circle, bottom left */}
      <motion.svg
        style={{ left: '6%', bottom: '-20%' }}
        width="420"
        height="420"
        viewBox="0 0 420 420"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.6, ease: EASE, delay: 0.35 }}
        {...float(20, 16, 1.2)}
      >
        <circle cx="210" cy="210" r="204" fill="rgba(91,108,255,0.07)" />
      </motion.svg>

      {/* Arch cluster, right — echoes the MN monogram.
          Banner hero ke neeche 120px overlap karta hai, isliye ise
          upar rakha gaya hai warna wo dhak jaata. */}
      <motion.svg
        style={{ right: '6%', bottom: '26%' }}
        width="360"
        height="230"
        viewBox="0 0 360 230"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, ease: EASE, delay: 0.5 }}
        {...float(14, 11, 0.6)}
      >
        {[0, 1, 2].map((i) => (
          <motion.path
            key={i}
            d={`M${20 + i * 104} 214V88a52 52 0 0 1 104 0v126`}
            fill="none"
            stroke="rgba(255,255,255,0.19)"
            strokeWidth="6"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: EASE, delay: 0.3 + i * 0.15 }}
          />
        ))}
      </motion.svg>
    </>
  )
}

/* ------------------------------------------------------------------ *
 * Orange info banner overlapping the hero's lower edge.
 * ------------------------------------------------------------------ */

function InfoBanner() {
  const cols = [
    [
      { label: 'Firm', value: 'Media Nest' },
      { label: 'Operational', value: 'Global' },
    ],
    [
      { label: 'Mobile', value: '+91-8448112770', href: 'tel:+918448112770' },
      { label: 'Working Hours', value: '24 x 7', live: true },
    ],
    [{ label: 'Email', value: 'connect@medianest.co.in', href: 'mailto:connect@medianest.co.in' }],
  ]

  return (
    <div className="mn-banner">
      <motion.div
        className="mn-banner__card"
        initial={{ opacity: 0, y: 56 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.15, ease: EASE, delay: 0.8 }}
      >
        <motion.dl
          className="mn-banner__grid"
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 1.0 } } }}
        >
          {cols.map((col, i) => (
            <motion.div
              className="mn-banner__col"
              key={i}
              variants={{
                hidden: { opacity: 0, y: 18 },
                show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
              }}
            >
              {col.map((row) => (
                <Fragment key={row.label}>
                  <dt className="mn-banner__label">{row.label}</dt>
                  <dd className="mn-banner__value">
                    {row.href ? (
                      <a href={row.href}>{row.value}</a>
                    ) : row.live ? (
                      <span className="mn-banner__live">{row.value}</span>
                    ) : (
                      row.value
                    )}
                  </dd>
                </Fragment>
              ))}
            </motion.div>
          ))}

          <motion.div
            className="mn-banner__col"
            variants={{
              hidden: { opacity: 0, y: 18 },
              show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
            }}
          >
            <dt className="mn-banner__label">Connect</dt>
            <dd>
              <ul className="mn-banner__social">
                {SOCIAL.map((s) => (
                  <li key={s.label}>
                    <Magnetic strength={0.34} padding={8}>
                      <a
                        className="mn-social"
                        href={s.href}
                        target="_blank"
                        rel="noreferrer noopener"
                        aria-label={s.label}
                      >
                        <i className={s.icon} aria-hidden />
                      </a>
                    </Magnetic>
                  </li>
                ))}
              </ul>
            </dd>
          </motion.div>
        </motion.dl>
      </motion.div>
    </div>
  )
}
