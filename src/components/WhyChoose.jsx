import { useId, useState } from 'react'
import { motion } from 'framer-motion'
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

export default function WhyChoose() {
  const [open, setOpen] = useState(0)
  const uid = useId()

  const goTo = (id) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  return (
    <section className="mn-why" aria-labelledby={`${uid}-heading`}>
      {/* Field: a soft sphere top-left, an orange sweep, and a camera
          bleeding off the bottom corner. All decorative. */}
      <span className="mn-why__orb" aria-hidden />
      <svg className="mn-why__sweep" viewBox="0 0 1440 900" aria-hidden focusable="false">
        <path d="M560,905 C820,745 1140,705 1500,772" />
      </svg>
      <span className="mn-why__bleed" aria-hidden>
        <img src="/media/PHOTOGRAPHY-AND-BRAND-1.webp" alt="" loading="lazy" decoding="async" />
      </span>

      {/* Edge micro-type */}
      <p className="mn-why__edge mn-why__edge--tr" aria-hidden>
        Ideas
        <br />
        into
        <br />
        impact
      </p>
      <p className="mn-why__edge mn-why__edge--br" aria-hidden>
        Creative people
        <br />
        Lasting brands
      </p>
      <p className="mn-why__edge mn-why__edge--l" aria-hidden>
        <i>01</i>
        <span>Stronger brands</span>
      </p>

      <div className="mn-why__inner">
        <div className="mn-why__head">
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

          {/* Brand geometry — lens rings and the MN arch, the same
              vocabulary the nav and hero already use. */}
          <div className="mn-why__art" aria-hidden>
            <motion.svg
              viewBox="0 0 440 300"
              fill="none"
              initial="hidden"
              whileInView="show"
              viewport={VIEWPORT}
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12 } } }}
            >
              {[132, 104, 78, 54].map((r, i) => (
                <motion.circle
                  key={r}
                  cx="150"
                  cy="150"
                  r={r}
                  stroke={i === 3 ? 'var(--mn-orange, #e95523)' : 'rgba(255,255,255,0.18)'}
                  strokeWidth={i === 3 ? 1.4 : 1}
                  variants={{
                    hidden: { pathLength: 0, opacity: 0 },
                    show: { pathLength: 1, opacity: 1, transition: { duration: 1.3, ease: EASE } },
                  }}
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
                  style={{ transformOrigin: '150px 150px', rotate: a }}
                  variants={{
                    hidden: { pathLength: 0 },
                    show: { pathLength: 1, transition: { duration: 1, ease: EASE } },
                  }}
                />
              ))}

              {[0, 1, 2].map((i) => (
                <motion.path
                  key={i}
                  d={`M${292 + i * 46} 236V148a23 23 0 0 1 46 0v88`}
                  stroke="rgba(255,255,255,0.16)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  variants={{
                    hidden: { pathLength: 0, opacity: 0 },
                    show: { pathLength: 1, opacity: 1, transition: { duration: 1.1, ease: EASE } },
                  }}
                />
              ))}
            </motion.svg>

            <p className="mn-why__artlabel">
              People
              <br />
              Ideas
              <br />
              Impact
            </p>
          </div>
        </div>

        {/* ── Accordion ─────────────────────────────────────── */}
        <ul className="mn-why__list">
          {REASONS.map((r, i) => {
            const isOpen = i === open
            const btnId = `${uid}-b${i}`
            const panelId = `${uid}-p${i}`
            return (
              <motion.li
                key={r.n}
                className="mn-why__item"
                data-open={isOpen || undefined}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={VIEWPORT}
                transition={{ duration: 0.7, ease: EASE, delay: i * 0.08 }}
              >
                <button
                  type="button"
                  id={btnId}
                  className="mn-why__btn"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpen(isOpen ? -1 : i)}
                >
                  <span className="mn-why__num" aria-hidden>
                    {r.n}
                  </span>
                  <span className="mn-why__label">{r.label}</span>
                  <span className="mn-why__sign" aria-hidden />
                </button>

                {/* Opened by CSS (grid-template-rows 0fr -> 1fr). Animating
                    height to 'auto' forces a Framer Motion measurement pass
                    that suspends and then restores window.scrollY, which
                    kills any smooth scroll in flight. Keeping the panel
                    mounted also means aria-controls points at an element
                    that exists while the row is shut. */}
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
          })}
        </ul>
      </div>
    </section>
  )
}
