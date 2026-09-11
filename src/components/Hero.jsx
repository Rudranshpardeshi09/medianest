import { Fragment, useEffect, useRef, useState } from 'react'
import {
  animate,
  motion,
  useMotionTemplate,
  useMotionValue,
  useMotionValueEvent,
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

/* Lens elements: same optical axis, alag depth. Perspective inhe apne
   aap chhota-bada dikhati hai, isliye size me halka hi farak hai. */
const RINGS = [
  { z: -620, size: 78, cls: '' },
  { z: -480, size: 66, cls: 'mn-hero__ring--glass' },
  { z: -350, size: 55, cls: '' },
  { z: -235, size: 44, cls: 'mn-hero__ring--glass' },
  { z: -130, size: 33, cls: 'mn-hero__ring--coated' },
]

/* Flare ghosts — optical centre ki taraf badhti hui line par */
const GHOSTS = [
  { d: 95, s: 26, c: 'rgba(236,126,105,0.22)' },
  { d: 205, s: 13, c: 'rgba(255,205,170,0.30)' },
  { d: 335, s: 42, c: 'rgba(120,140,255,0.13)' },
  { d: 470, s: 19, c: 'rgba(233,85,35,0.20)' },
]

const F_STOPS = ['1.8', '2.8', '4', '5.6', '8', '11', '16']

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
  const [shutterOpen, setShutterOpen] = useState(false)
  const [fStop, setFStop] = useState(F_STOPS[0])

  /* ── Scroll ────────────────────────────────────────────────
     Plate dheere drift karta hai, aur camera lens stack ke
     *andar se* guzarti hai (deck ka translateZ badhta hai). */
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })
  const plateY = useTransform(scrollYProgress, [0, 1], ['0%', '16%'])
  const plateScale = useTransform(scrollYProgress, [0, 1], [1, 1.12])
  const deckZ = useTransform(scrollYProgress, [0, 1], [0, 430])
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '-22%'])
  const contentFade = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  /* 6. Exposure readout: scroll ke saath aperture "stop down" hoti hai */
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const i = Math.min(F_STOPS.length - 1, Math.max(0, Math.floor(v * F_STOPS.length)))
    setFStop((prev) => (prev === F_STOPS[i] ? prev : F_STOPS[i]))
  })

  /* ── Cursor ────────────────────────────────────────────────
     Ek hi listener sab kuch chalata hai. mx/my -0.5..0.5 me
     normalised hain taaki depth resolution-independent rahe. */
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const focusX = useMotionValue(50)
  const focusY = useMotionValue(50)
  const flareX = useMotionValue(-500)
  const flareY = useMotionValue(-500)
  const flareA = useMotionValue(0)

  const soft = { stiffness: 60, damping: 18 }

  /* 1. Deck tilt — asli rotateX/rotateY, sirf translate nahi */
  const rotY = useSpring(useTransform(mx, (v) => v * 13), soft)
  const rotX = useSpring(useTransform(my, (v) => v * -9), soft)
  const copyX = useSpring(useTransform(mx, (v) => v * 14), { stiffness: 60, damping: 20 })

  /* 3. Focus point — mask cursor ke peeche halka lag ke chalta hai */
  const fx = useSpring(focusX, { stiffness: 110, damping: 20 })
  const fy = useSpring(focusY, { stiffness: 110, damping: 20 })
  const focusMask = useMotionTemplate`radial-gradient(circle 250px at ${fx}% ${fy}%, #000 26%, rgba(0,0,0,0.45) 55%, transparent 78%)`

  /* 4. Flare — cursor ke ulti taraf, optical centre se hoke */
  const flx = useSpring(flareX, { stiffness: 45, damping: 20, mass: 0.9 })
  const fly = useSpring(flareY, { stiffness: 45, damping: 20, mass: 0.9 })

  /* 5. Chromatic aberration — kinaron par halke red/cyan fringes.
     Ek hi element par text-shadow: text duplicate nahi hota, isliye
     screen reader ko headline do baar nahi milti. */
  const abR = useTransform(mx, (v) => (v * 4.5).toFixed(2))
  const abC = useTransform(mx, (v) => (-v * 4.5).toFixed(2))
  const titleShadow = useMotionTemplate`${abR}px 0 0 rgba(255,58,96,0.26), ${abC}px 0 0 rgba(0,224,255,0.20)`

  const onPointerMove = (e) => {
    if (reduced || !heroRef.current) return
    const r = heroRef.current.getBoundingClientRect()
    const px = e.clientX - r.left
    const py = e.clientY - r.top

    mx.set(px / r.width - 0.5)
    my.set(py / r.height - 0.5)
    focusX.set((px / r.width) * 100)
    focusY.set((py / r.height) * 100)

    // Flare optical centre ke aar-paar mirror hota hai
    const gx = r.width - px
    const gy = r.height - py
    flareX.set(gx)
    flareY.set(gy)
    // Angle ko spring NAHI karte: ±180 par wrap hote waqt spring
    // poora chakkar ghuma deti hai.
    flareA.set((Math.atan2(r.height / 2 - gy, r.width / 2 - gx) * 180) / Math.PI)
  }

  const onPointerLeave = () => {
    mx.set(0)
    my.set(0)
  }

  /* ── 2. Aperture reveal ────────────────────────────────────
     Pehle ye ek <mask> ke andar <polygon> tha jo scale hota tha —
     par <defs> ke elements render nahi hote aur Chrome un par
     animation skip kar deta hai, to scale 0 par hi atka reh gaya
     (yaani poora navy block, phir achanak gayab). Ab overlay ek
     saadi div hai jiska radial mask ek motion value se chalta hai:
     ye render hota hai, isliye bharose se animate hota hai. */
  const irisR = useMotionValue(0)
  const irisMask = useMotionTemplate`radial-gradient(circle ${irisR}px at 50% 50%, transparent 99%, #000 100%)`
  const irisRing = useMotionTemplate`radial-gradient(circle ${irisR}px at 50% 50%, transparent 97.5%, rgba(233,85,35,0.55) 99%, transparent 100.5%)`

  useEffect(() => {
    if (reduced) {
      setShutterOpen(true)
      return
    }
    // Viewport ke kone tak pahunchna zaroori hai, warna kinare dhake reh jayenge.
    const target = Math.hypot(window.innerWidth, window.innerHeight) * 1.05
    const controls = animate(irisR, target, {
      duration: 1,
      ease: [0.7, 0, 0.2, 1],
      onComplete: () => setShutterOpen(true),
    })
    return () => controls.stop()
  }, [reduced, irisR])

  const goTo = (id) => {
    const el = document.querySelector(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

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
        {/* ── 1 + 3: lens stack + focus ─────────────────── */}
        <div className="mn-hero__stage" aria-hidden>
          <motion.div
            className="mn-hero__deck"
            style={reduced ? undefined : { rotateX: rotX, rotateY: rotY, z: deckZ }}
          >
            {/* Soft base copy */}
            <motion.div
              className="mn-hero__plate mn-hero__plate--soft"
              style={reduced ? undefined : { y: plateY, scale: plateScale }}
            />
            {/* Sharp copy, cursor ke around hi dikhti hai */}
            {!reduced && (
              <motion.div
                className="mn-hero__plate mn-hero__plate--sharp"
                style={{
                  y: plateY,
                  scale: plateScale,
                  WebkitMaskImage: focusMask,
                  maskImage: focusMask,
                }}
              />
            )}

            {RINGS.map((r) => (
              <div
                key={r.z}
                className={`mn-hero__ring ${r.cls}`}
                style={{
                  width: `${r.size}vmax`,
                  height: `${r.size}vmax`,
                  transform: `translate(-50%, -50%) translateZ(${r.z}px)`,
                }}
              />
            ))}
          </motion.div>
        </div>

        <div className="mn-hero__veil" aria-hidden />

        {/* ── 4: anamorphic flare ───────────────────────── */}
        {!reduced && (
          <>
            <motion.div className="mn-hero__flare" style={{ x: flx, y: fly }} aria-hidden>
              <div className="mn-hero__flare-inner">
                <span className="mn-hero__streak" />
                <span className="mn-hero__flare-core" />
              </div>
            </motion.div>

            <motion.div
              className="mn-hero__ghosts"
              style={{ x: flx, y: fly, rotate: flareA }}
              aria-hidden
            >
              {GHOSTS.map((g) => (
                <span
                  key={g.d}
                  className="mn-hero__ghost"
                  style={{
                    left: `${g.d}px`,
                    width: `${g.s}px`,
                    height: `${g.s}px`,
                    background: g.c,
                  }}
                />
              ))}
            </motion.div>
          </>
        )}

        {/* Theme ke apne motion graphics */}
        <motion.div
          className="mn-hero__shapes"
          aria-hidden
          style={reduced ? undefined : { x: copyX }}
        >
          <HeroShapes reduced={reduced} />
        </motion.div>

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
            transition={{ duration: 0.9, ease: EASE, delay: 0.42 }}
          >
            <span className="mn-hero__pulse" aria-hidden />
            Visual Excellence, Tangible Results
            <span className="mn-hero__rule" aria-hidden />
          </motion.p>

          <motion.h1
            className="mn-hero__title"
            style={reduced ? undefined : { textShadow: titleShadow }}
          >
            {LINES.map((line, li) => (
              <span className="mn-hero__line" key={li}>
                {line.map((word, wi) => {
                  wordIndex += 1
                  const delay = 0.52 + wordIndex * 0.07
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
          </motion.h1>

          <motion.p
            className="mn-hero__desc"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE, delay: 0.92 }}
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
            transition={{ duration: 1, ease: EASE, delay: 1.06 }}
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

        {/* ── 6: exposure readout ───────────────────────── */}
        <motion.div
          className="mn-hero__exif"
          aria-hidden
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 1.3 }}
          style={reduced ? undefined : { opacity: contentFade }}
        >
          ISO 400
          <span />
          <b>f/{fStop}</b>
          <span />
          1/250
        </motion.div>

        <motion.div
          className="mn-hero__scroll"
          aria-hidden
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.3 }}
          style={reduced ? undefined : { opacity: contentFade }}
        >
          <span>Scroll</span>
          <i />
        </motion.div>

        {/* ── 2: aperture reveal ────────────────────────── */}
        {!reduced && !shutterOpen && (
          <>
            <motion.div
              className="mn-hero__aperture"
              aria-hidden
              style={{ WebkitMaskImage: irisMask, maskImage: irisMask }}
            />
            {/* Khulte hue kinare par ember rim — isse ye lens iris
                lagta hai, sirf ek circle wipe nahi. */}
            <motion.div
              className="mn-hero__aperture mn-hero__aperture--rim"
              aria-hidden
              style={{ backgroundImage: irisRing }}
            />
          </>
        )}
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
 * Theme's own motion graphics: orange edge ticks + the MN arch motif.
 * (The soft circles were dropped — the lens rings now carry that job,
 * and two sets of circles read as clutter.)
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
              transition={{ duration: 0.8, ease: EASE, delay: 0.72 + i * 0.12 }}
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
              transition={{ duration: 0.5, ease: EASE, delay: 1.02 + i * 0.12 }}
              style={{ transformOrigin: `64px ${y}px` }}
            />
          </g>
        ))}
      </svg>

      {/* Arch cluster — echoes the MN monogram */}
      <motion.svg
        style={{ right: '6%', bottom: '26%' }}
        width="360"
        height="230"
        viewBox="0 0 360 230"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, ease: EASE, delay: 0.8 }}
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
            transition={{ duration: 1.5, ease: EASE, delay: 0.85 + i * 0.15 }}
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
        /* Shutter ~1s par khulta hai; banner uske baad aata hai warna
           wo aperture ke bahar, uske khulne se pehle dikh jata. */
        transition={{ duration: 1.15, ease: EASE, delay: 1.12 }}
      >
        <motion.dl
          className="mn-banner__grid"
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 1.3 } } }}
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
