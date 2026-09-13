import { useId, useRef, useState } from 'react'
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion'
import MaskText from './primitives/MaskText'
import { EASE, VIEWPORT } from '@/lib/motion'
import '../styles/whychoose.css'

/* Every `stat` is one the site already states in About — 5+ years, nine
   disciplines, a 24/7 window, global coverage. None is invented, and neither
   is the framing sentence: the section's own h2 is the line that holds still
   while the reason beneath it rewrites. */
const REASONS = [
  {
    n: '01',
    label: 'Proven Expertise',
    body:
      'A team of experts with over 5+ years of hands-on experience in brand image management.',
    stat: '5+',
    statLabel: 'Years of practice',
  },
  {
    n: '02',
    label: 'Comprehensive Services',
    body:
      'From strategy to execution, we provide a full suite of services designed to enhance your brand visibility.',
    stat: '9',
    statLabel: 'Disciplines in-house',
  },
  {
    n: '03',
    label: 'Industry Networking',
    body:
      'With our robust network of industry contacts, we offer unique opportunities for collaboration and growth.',
    stat: 'Global',
    statLabel: 'Coverage',
  },
  {
    n: '04',
    label: 'Client-Centric Approach',
    body:
      'We tailor our services to the specific needs of each client, ensuring every project is personalized and effective.',
    stat: '24/7',
    statLabel: 'Operational window',
  },
]

/* Framer Motion hands scroll-linked transforms to a native ScrollTimeline via
   element.animate(), and the useTransform input stops become WAAPI keyframe
   offsets. Those must sit inside [0, 1] and never decrease. Ranges of -0.2 and
   1.3 — used to hold the first panel open before the section starts and the
   last one open past its end — threw "Offsets must be null or in the range
   [0,1]" on mount and took the whole app down with them. Every window is now
   built inside the range, and the holding is done with the VALUES instead. */
const clampStops = (stops) => {
  const out = []
  let prev = 0
  for (const s of stops) {
    const v = Math.min(1, Math.max(prev, Math.max(0, s)))
    out.push(v)
    prev = v
  }
  return out
}

/* One word of the display line. It owns its own hooks so the stagger can be
   per-word without calling hooks from inside a map.

   Nothing is clipped: the word fades as it travels, so it is invisible long
   before it could show as half a glyph. That was the fault in the old masked
   reveal and it is not worth reintroducing for a swap this large. */
function Word({ p, stops, op, ys, blurs, reduced, children }) {
  const opacity = useTransform(p, stops, op)
  const y = useTransform(p, stops, ys)
  const b = useTransform(p, stops, blurs)
  const filter = useMotionTemplate`blur(${b}px)`

  return (
    <span className="mn-why__wordbox">
      <motion.span className="mn-why__word" style={reduced ? undefined : { opacity, y, filter }}>
        {children}
      </motion.span>
    </span>
  )
}

/* One reason. All four are stacked in the same box and all four stay in the
   DOM, so a screen reader still reads four headings in order. */
function Panel({ r, i, n, p, reduced }) {
  const w0 = i / n
  const w1 = (i + 1) / n
  const span = 1 / n
  const first = i === 0
  const last = i === n - 1

  /* Four stops, all inside [0, 1]: arrive, hold, leave. The first panel is
     already open when the section starts and the last one never closes, so
     those two are expressed in the values, not by pushing the stops out of
     range. */
  const base = clampStops([w0, w0 + span * 0.34, w1 - span * 0.26, w1])
  const op = first ? [1, 1, 1, 0] : last ? [0, 1, 1, 1] : [0, 1, 1, 0]
  const ys = first
    ? ['0%', '0%', '0%', '-48%']
    : last
      ? ['64%', '0%', '0%', '0%']
      : ['64%', '0%', '0%', '-48%']
  const blurs = first ? [0, 0, 0, 9] : last ? [9, 0, 0, 0] : [9, 0, 0, 9]

  const sup = clampStops([w0, w0 + span * 0.44, w1 - span * 0.32, w1])
  const supO = first ? [1, 1, 1, 0] : last ? [0, 1, 1, 1] : [0, 1, 1, 0]
  const supportO = useTransform(p, sup, supO)
  const supportY = useTransform(
    p,
    sup,
    first ? [0, 0, 0, -24] : last ? [30, 0, 0, 0] : [30, 0, 0, -24],
  )
  const ordO = useTransform(
    p,
    base,
    first ? [0.075, 0.075, 0.075, 0] : last ? [0, 0.075, 0.075, 0.075] : [0, 0.075, 0.075, 0],
  )

  const words = r.label.split(' ')
  const m = (style) => (reduced ? undefined : style)

  return (
    <div className="mn-why__panel">
      <motion.span className="mn-why__ord" aria-hidden style={m({ opacity: ordO })}>
        {r.n}
      </motion.span>

      <h3 className="mn-why__line">
        {words.map((w, j) => (
          <Word
            key={w}
            p={p}
            reduced={reduced}
            /* a hair of stagger per word, so the line turns over rather than
               swapping as one block. Re-clamped after the shift, because the
               offsets still have to land inside [0, 1]. */
            stops={clampStops(base.map((v) => v + j * 0.008))}
            op={op}
            ys={ys}
            blurs={blurs}
          >
            {w}
          </Word>
        ))}
      </h3>

      <motion.p className="mn-why__support" style={m({ opacity: supportO, y: supportY })}>
        {r.body}
      </motion.p>

      <motion.span className="mn-why__stat" style={m({ opacity: supportO, y: supportY })}>
        <b>{r.stat}</b>
        <i>{r.statLabel}</i>
      </motion.span>
    </div>
  )
}

export default function WhyChoose() {
  const uid = useId()
  const ref = useRef(null)
  const reduced = useReducedMotion()
  const [active, setActive] = useState(0)
  const n = REASONS.length

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  })

  /* scrollYProgress is mirrored into a plain motion value rather than read
     directly, and every transform below hangs off the mirror.
  
     Reading it directly let Framer Motion hardware-accelerate the result: it
     attached each transform to a native ViewTimeline whose subject is the
     ANIMATED ELEMENT, not this section. The keyframes were right and the
     driver was wrong — the first panel's words faded out on cue and then
     climbed back to 0.93 as the sticky stage went on sitting in view. A plain
     motion value has no timeline to attach, so the JS path runs and the
     windows mean what they say.
  
     No spring on the mirror: a spring carries on after the reader stops, and
     the brief is that the line turns over only while they scroll. */
  const p = useMotionValue(0)
  const railScale = useTransform(p, [0, 1], [0, 1])

  /* The rules drift a little against the type. Window stays inside [0,1] —
     see the note above clampStops for why that is not optional. */
  const gridY = useTransform(p, [0, 1], ['0%', '-14%'])

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    p.set(v)
    setActive(Math.min(n - 1, Math.max(0, Math.floor(v * n + 0.0001))))
  })

  const goTo = (id) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  const m = (style) => (reduced ? undefined : style)

  return (
    <section ref={ref} className="mn-why" aria-labelledby={`${uid}-heading`}>
      <div className="mn-why__stage">
        {/* Field: column rules and crop marks. Printed-page furniture, not
            atmosphere — the section is set apart by its structure, not by a
            different colour to its neighbours. */}
        <span className="mn-why__cols" aria-hidden />
        <span className="mn-why__crop mn-why__crop--tl" aria-hidden />
        <span className="mn-why__crop mn-why__crop--br" aria-hidden />

        <div className="mn-why__inner">
          {/* Left margin: the whole set, with the one on show marked. The
              reader can see what is coming instead of trusting the scroll. */}
          <div className="mn-why__side">
            <motion.p
              className="mn-eyebrow"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.7, ease: EASE }}
          >
              Why choose us
            </motion.p>

            <ol className="mn-why__index" aria-hidden>
              {REASONS.map((r, i) => (
                <li key={r.n} data-on={i === active || undefined}>
                  <i>{r.n}</i>
                  <span>{r.label}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="mn-why__main">
          {/* The line that holds still. */}
          <h2 className="mn-why__frame" id={`${uid}-heading`}>
            <MaskText>Four reasons brands</MaskText>{' '}
            <MaskText as="em" delay={0.1}>
              stay
            </MaskText>
            <MaskText delay={0.14}>.</MaskText>
          </h2>

          {/* The part that rewrites, between two rules. */}
          <div className="mn-why__display">
            {REASONS.map((r, i) => (
              <Panel key={r.n} r={r} i={i} n={n} p={p} reduced={reduced} />
            ))}
          </div>

          <div className="mn-why__foot">
            <span className="mn-why__count" aria-hidden>
              <b>{REASONS[active].n}</b>
              <s>/ {String(n).padStart(2, '0')}</s>
            </span>

            <div className="mn-why__rail" aria-hidden>
              <motion.i style={reduced ? { scaleX: 1 } : { scaleX: railScale }} />
            </div>

            <button type="button" className="mn-why__cta" onClick={() => goTo('about')}>
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
            </button>
          </div>
          </div>
        </div>

        <p className="mn-why__edge" aria-hidden>
          Creative people
          <br />
          Lasting brands
        </p>
      </div>
    </section>
  )
}
