import { useId, useRef, useState } from 'react'
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'
import MaskText from './primitives/MaskText'
import { EASE, VIEWPORT } from '@/lib/motion'
import '../styles/whychoose.css'

/* Every `stat` here is one the site already states in About — 5+ years,
   nine disciplines, a 24/7 window, global coverage. None is invented for
   the layout's benefit. */
const REASONS = [
  {
    n: '01',
    label: 'Proven Expertise',
    body:
      'A team of experts with over 5+ years of hands-on experience in brand image management.',
    stat: '5+',
    statLabel: 'Years of\npractice',
    icon: 'M12 2.6 14.9 8l6 .9-4.4 4.2 1.1 6-5.6-2.9-5.6 2.9 1.1-6L3.1 8.9 9.1 8Z',
  },
  {
    n: '02',
    label: 'Comprehensive Services',
    body:
      'From strategy to execution, we provide a full suite of services designed to enhance your brand visibility.',
    stat: '9',
    statLabel: 'Disciplines\nin-house',
    icon: 'M4 5h7v7H4Zm9 0h7v7h-7ZM4 14h7v5H4Zm9 0h7v5h-7Z',
  },
  {
    n: '03',
    label: 'Industry Networking',
    body:
      'With our robust network of industry contacts, we offer unique opportunities for collaboration and growth.',
    stat: 'Global',
    statLabel: 'Coverage',
    icon: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm0 0c3 3 3 15 0 18m0-18c-3 3-3 15 0 18M3.4 9h17.2M3.4 15h17.2',
  },
  {
    n: '04',
    label: 'Client-Centric Approach',
    body:
      'We tailor our services to the specific needs of each client, ensuring every project is personalized and effective.',
    stat: '24/7',
    statLabel: 'Operational\nwindow',
    icon: 'M12 21s-7.5-4.7-7.5-10A4.5 4.5 0 0 1 12 8a4.5 4.5 0 0 1 7.5 3c0 5.3-7.5 10-7.5 10Z',
  },
]

/* One row of the accordion. It lives in its own component because its
   entrance is driven off the section's scroll progress, and hooks cannot be
   called from inside a map. */
function Reason({ r, i, isOpen, onToggle, uid, progress, reduced }) {
  /* Each row claims its own slice of the section's travel, so the four
     arrive one after another as you scroll rather than all at once. */
  const from = 0.06 + i * 0.07
  const to = from + 0.14
  const opacity = useTransform(progress, [from, to], [0, 1])
  const x = useTransform(progress, [from, to], [64, 0])
  const btnId = `${uid}-b${i}`
  const panelId = `${uid}-p${i}`

  return (
    <motion.li
      className="mn-why__item"
      data-open={isOpen || undefined}
      style={reduced ? undefined : { opacity, x }}
    >
      <button
        type="button"
        id={btnId}
        className="mn-why__btn"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={onToggle}
      >
        <span className="mn-why__num" aria-hidden>
          {r.n}
        </span>
        <span className="mn-why__label">{r.label}</span>
        <span className="mn-why__sign" aria-hidden />
      </button>

      {/* Opened by CSS (grid-template-rows 0fr -> 1fr). Animating height to
          'auto' forces a Framer Motion measurement pass that suspends and
          then restores window.scrollY, killing any smooth scroll in flight.
          Keeping the panel mounted also means aria-controls points at an
          element that exists while the row is shut. */}
      <div
        id={panelId}
        role="region"
        aria-labelledby={btnId}
        className="mn-why__panel"
        data-open={isOpen || undefined}
      >
        <div className="mn-why__panelin">
          <span className="mn-why__icon" aria-hidden>
            <svg viewBox="0 0 24 24" focusable="false">
              <path
                d={r.icon}
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>

          <p className="mn-why__body">{r.body}</p>

          <span className="mn-why__stat">
            <b>{r.stat}</b>
            <i>{r.statLabel}</i>
          </span>
        </div>
      </div>
    </motion.li>
  )
}

export default function WhyChoose() {
  const [open, setOpen] = useState(0)
  const uid = useId()
  const ref = useRef(null)
  const reduced = useReducedMotion()

  /* One progress value for the whole section, read from the moment its top
     reaches the bottom of the viewport to the moment its bottom leaves the
     top. Everything decorative hangs off it, so the section assembles itself
     as you travel through it instead of firing once and being finished. */
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  /* Softened, or every pixel of a trackpad flick shows up in the geometry. */
  const p = useSpring(scrollYProgress, { stiffness: 90, damping: 26, mass: 0.4 })

  const orbY = useTransform(p, [0, 1], ['-14%', '10%'])
  const orbScale = useTransform(p, [0, 0.5, 1], [0.86, 1.06, 0.94])
  const bleedY = useTransform(p, [0, 1], ['18%', '-12%'])
  const bleedOpacity = useTransform(p, [0, 0.25, 0.85, 1], [0, 0.46, 0.46, 0.12])
  const headY = useTransform(p, [0, 1], [42, -42])
  const artY = useTransform(p, [0, 1], [70, -56])
  const railY = useTransform(p, [0, 1], [26, -26])

  /* The sweep and the lens geometry draw themselves, staged so the eye has
     something to follow the whole way down. */
  const sweepDraw = useTransform(p, [0.02, 0.45], [0, 1])
  const ringsDraw = useTransform(p, [0.06, 0.44], [0, 1])
  const bladesDraw = useTransform(p, [0.16, 0.52], [0, 1])
  const archesDraw = useTransform(p, [0.24, 0.6], [0, 1])

  const goTo = (id) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  // Reduced motion gets the finished state, not a scrubbed one.
  const m = (style) => (reduced ? undefined : style)

  return (
    <section ref={ref} className="mn-why" aria-labelledby={`${uid}-heading`}>
      {/* Field: a soft sphere, an orange sweep that draws itself, and a
          camera bleeding off the bottom corner. All decorative. */}
      <motion.span className="mn-why__orb" aria-hidden style={m({ y: orbY, scale: orbScale })} />

      <svg className="mn-why__sweep" viewBox="0 0 1440 900" aria-hidden focusable="false">
        <motion.path
          d="M560,905 C820,745 1140,705 1500,772"
          style={m({ pathLength: sweepDraw })}
        />
      </svg>

      <motion.span
        className="mn-why__bleed"
        aria-hidden
        style={m({ y: bleedY, opacity: bleedOpacity })}
      >
        <img src="/media/PHOTOGRAPHY-AND-BRAND-1.webp" alt="" loading="lazy" decoding="async" />
      </motion.span>

      {/* Edge micro-type */}
      <motion.p className="mn-why__edge mn-why__edge--tr" aria-hidden style={m({ y: railY })}>
        Ideas
        <br />
        into
        <br />
        impact
      </motion.p>
      <motion.p className="mn-why__edge mn-why__edge--br" aria-hidden style={m({ y: railY })}>
        Creative people
        <br />
        Lasting brands
      </motion.p>
      <p className="mn-why__edge mn-why__edge--l" aria-hidden>
        <i>01</i>
        <span>Stronger brands</span>
      </p>

      <div className="mn-why__inner">
        <motion.div className="mn-why__head" style={m({ y: headY })}>
          <motion.p
            className="mn-eyebrow"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.7, ease: EASE }}
          >
            Why choose us
          </motion.p>

          <h2 className="mn-why__title" id={`${uid}-heading`}>
            <MaskText>Four reasons brands</MaskText>{' '}
            <MaskText as="em" delay={0.1}>
              stay
            </MaskText>
            <MaskText delay={0.14}>.</MaskText>
          </h2>

          <motion.p
            className="mn-why__lede"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.85, ease: EASE, delay: 0.15 }}
          >
            Five years of practice, nine disciplines under one roof, and a network that carries
            each engagement further than the work itself.
          </motion.p>

          <motion.button
            type="button"
            className="mn-why__cta"
            onClick={() => goTo('about')}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.8, ease: EASE, delay: 0.26 }}
          >
            <span className="mn-why__ctadisc" aria-hidden>
              <svg viewBox="0 0 24 24" focusable="false">
                <path
                  d="M4 12h15M13 6l6 6-6 6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            Discover our approach
          </motion.button>

          {/* Brand geometry — lens rings and the MN arch, the same vocabulary
              the nav and hero already use. Drawn by scroll rather than on a
              viewport trigger, so it keeps pace with the reader. */}
          <motion.div className="mn-why__art" aria-hidden style={m({ y: artY })}>
            <svg viewBox="0 0 440 300" fill="none">
              {[132, 104, 78, 54].map((r, i) => (
                <motion.circle
                  key={r}
                  cx="150"
                  cy="150"
                  r={r}
                  stroke={i === 3 ? 'var(--mn-orange, #e95523)' : 'rgba(255,255,255,0.18)'}
                  strokeWidth={i === 3 ? 1.4 : 1}
                  style={m({ pathLength: ringsDraw })}
                />
              ))}

              {[0, 60, 120].map((a) => (
                <motion.line
                  key={a}
                  x1="150"
                  y1="96"
                  x2="150"
                  y2="204"
                  stroke="rgba(255,255,255,0.14)"
                  strokeWidth="1"
                  style={m({ pathLength: bladesDraw, transformOrigin: '150px 150px', rotate: a })}
                />
              ))}

              {[0, 1, 2].map((i) => (
                <motion.path
                  key={i}
                  d={`M${292 + i * 46} 236V148a23 23 0 0 1 46 0v88`}
                  stroke="rgba(255,255,255,0.16)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  style={m({ pathLength: archesDraw })}
                />
              ))}
            </svg>

            <p className="mn-why__artlabel">
              People
              <br />
              Ideas
              <br />
              Impact
            </p>
          </motion.div>
        </motion.div>

        {/* ── Accordion ─────────────────────────────────────── */}
        <ul className="mn-why__list">
          {REASONS.map((r, i) => (
            <Reason
              key={r.n}
              r={r}
              i={i}
              uid={uid}
              progress={p}
              reduced={reduced}
              isOpen={i === open}
              onToggle={() => setOpen(i === open ? -1 : i)}
            />
          ))}
        </ul>
      </div>
    </section>
  )
}
