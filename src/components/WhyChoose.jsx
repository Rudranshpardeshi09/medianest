import { useId, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import MaskText from './primitives/MaskText'
import { EASE, VIEWPORT } from '@/lib/motion'
import '../styles/whychoose.css'

const REASONS = [
  {
    n: '01',
    label: 'Proven Expertise',
    body:
      'A team of experts with over 5+ years of hands-on experience in brand image management.',
  },
  {
    n: '02',
    label: 'Comprehensive Services',
    body:
      'From strategy to execution, we provide a full suite of services designed to enhance your brand visibility.',
  },
  {
    n: '03',
    label: 'Industry Networking',
    body:
      'With our robust network of industry contacts, we offer unique opportunities for collaboration and growth.',
  },
  {
    n: '04',
    label: 'Client-Centric Approach',
    body:
      'We tailor our services to the specific needs of each client, ensuring every project is personalized and effective.',
  },
]

export default function WhyChoose() {
  const [open, setOpen] = useState(0)
  const uid = useId()

  return (
    <section className="mn-why" aria-labelledby={`${uid}-heading`}>
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
            <MaskText as="em" delay={0.2}>
              stay
            </MaskText>
            <MaskText delay={0.26}>.</MaskText>
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

          {/* Brand geometry — lens rings and the MN arch, the same
              vocabulary the nav and hero already use. It fills the column
              rather than decorating it. */}
          <div className="mn-why__art" aria-hidden>
            <motion.svg
              viewBox="0 0 440 300"
              fill="none"
              initial="hidden"
              whileInView="show"
              viewport={VIEWPORT}
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12 } } }}
            >
              {/* Concentric lens elements */}
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
                    show: {
                      pathLength: 1,
                      opacity: 1,
                      transition: { duration: 1.3, ease: EASE },
                    },
                  }}
                />
              ))}

              {/* Aperture blades across the innermost element */}
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

              {/* MN arch motif, right */}
              {[0, 1, 2].map((i) => (
                <motion.path
                  key={i}
                  d={`M${292 + i * 46} 236V148a23 23 0 0 1 46 0v88`}
                  stroke="rgba(255,255,255,0.16)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  variants={{
                    hidden: { pathLength: 0, opacity: 0 },
                    show: {
                      pathLength: 1,
                      opacity: 1,
                      transition: { duration: 1.1, ease: EASE },
                    },
                  }}
                />
              ))}
            </motion.svg>
          </div>
        </div>

        <ul className="mn-why__list">
          {REASONS.map((r, i) => {
            const isOpen = open === i
            const panelId = `${uid}-panel-${i}`
            const btnId = `${uid}-btn-${i}`

            return (
              <li key={r.n} className="mn-why__item" data-open={isOpen}>
                {/* A real disclosure button: keyboard-operable and announced
                    properly. Hover is a shortcut on top of that, never the
                    only way in. */}
                <button
                  type="button"
                  id={btnId}
                  className="mn-why__btn"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  onMouseEnter={() => setOpen(i)}
                  onFocus={() => setOpen(i)}
                >
                  <span className="mn-why__num" aria-hidden>
                    {r.n}
                  </span>
                  <span className="mn-why__label">{r.label}</span>
                  <span className="mn-why__sign" aria-hidden />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={panelId}
                      role="region"
                      aria-labelledby={btnId}
                      className="mn-why__panel"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.55, ease: EASE }}
                    >
                      <p className="mn-why__body">{r.body}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
