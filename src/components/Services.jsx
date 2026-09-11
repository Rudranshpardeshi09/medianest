import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import MaskText from './primitives/MaskText'
import RevealImage from './primitives/RevealImage'
import { EASE, VIEWPORT } from '@/lib/motion'
import '../styles/services.css'

const SERVICES = [
  {
    n: '01',
    id: 'svc-photography',
    title: 'Photography & Brand Visual Presence',
    short: 'Photography',
    body:
      'Professional photography that highlights the unique aspects of your brand — considered, lit and directed to carry a visual identity.',
    image: '/media/PHOTOGRAPHY-AND-BRAND-1.webp',
    tags: ['Editorial', 'Product', 'Sports', 'Profiling'],
  },
  {
    n: '02',
    id: 'svc-cinematography',
    title: 'Cinematography & Quality Production',
    short: 'Cinematography',
    body:
      'Creative storytelling through high-quality, engaging film content — from concept and shoot through to the finished cut.',
    image: '/media/CINEMATOGRAPHY-PRODUCTION-1.webp',
    tags: ['Brand films', 'Documentary', 'Live stream', 'Post'],
  },
  {
    n: '03',
    id: 'svc-strategy',
    title: 'Brand Image Strategy & Consultation',
    short: 'Brand Strategy',
    body:
      'Tailored guidance to refine and align your brand image with its business goals, across every surface it appears on.',
    image: '/media/BRAND-IMAGE-STRATEGY-1.webp',
    tags: ['Positioning', 'Art direction', 'Content strategy', 'Rollout'],
  },
]

const MORE = [
  'Interviews',
  'Live Streaming',
  'Video Editing',
  'Graphic Design',
  'Events',
  'Digital Marketing',
]

export default function Services() {
  const [active, setActive] = useState(0)

  const jumpTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  return (
    <section id="services" className="mn-svc">
      <div className="mn-svc__inner">
        {/* The column stretches to the grid row's full height; the rail
            inside it is what sticks. Making the rail itself the grid item
            was the bug — with the cell collapsed to the rail's own height
            sticky had no range to travel and scrolled away by mid-section. */}
        <div className="mn-svc__railcol">
          <div className="mn-svc__rail">
            <p className="mn-eyebrow">What we do</p>

            <h2 className="mn-svc__word">
              <MaskText>Services</MaskText>
            </h2>

            {/* All three stay listed, so wherever you are in the scroll you
                can see what you are looking at and what is still coming. */}
            <ol className="mn-svc__list">
              {SERVICES.map((s, i) => {
                const on = i === active
                return (
                  <li key={s.n} className="mn-svc__listitem" data-on={on}>
                    <button
                      type="button"
                      className="mn-svc__listbtn"
                      aria-current={on ? 'true' : undefined}
                      onClick={() => jumpTo(s.id)}
                    >
                      <span className="mn-svc__listnum">{s.n}</span>
                      <span className="mn-svc__listtitle">{s.short}</span>
                    </button>

                    <AnimatePresence initial={false}>
                      {on && (
                        <motion.div
                          className="mn-svc__detail"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.5, ease: EASE }}
                        >
                          <p className="mn-svc__desc">{s.body}</p>
                          <ul className="mn-svc__tags">
                            {s.tags.map((t) => (
                              <li key={t}>{t}</li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </li>
                )
              })}
            </ol>
          </div>
        </div>

        {/* ── Scrolling cards ──────────────────────────── */}
        <div className="mn-svc__cards">
          {SERVICES.map((s, i) => (
            <motion.article
              key={s.n}
              id={s.id}
              className="mn-svc__card"
              /* Claim the rail when this card owns the middle band of the
                 viewport, so the list always matches what is on screen. */
              onViewportEnter={() => setActive(i)}
              viewport={{ margin: '-45% 0px -45% 0px', amount: 'some' }}
            >
              <div className="mn-svc__frame">
                <RevealImage
                  src={s.image}
                  alt={s.title}
                  width="370"
                  height="500"
                  direction={i % 2 === 0 ? 'up' : 'right'}
                />
                <div className="mn-svc__cardhead">
                  <div>
                    <span className="mn-svc__cardnum">{s.n}</span>
                    <h3 className="mn-svc__cardtitle">{s.title}</h3>
                  </div>
                  <span className="mn-svc__go" aria-hidden>
                    <svg viewBox="0 0 24 24" focusable="false">
                      <path
                        d="M7.5 16.5 16.5 7.5M9 7.5h7.5V15"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </div>
              </div>

              {/* Shown below 1100px, where the rail un-pins */}
              <ul className="mn-svc__cardtags mn-svc__tags">
                {s.tags.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </motion.article>
          ))}
        </div>
      </div>

      {/* ── Secondary disciplines ──────────────────────── */}
      <motion.div
        className="mn-svc__more"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={VIEWPORT}
        transition={{ duration: 0.85, ease: EASE }}
      >
        <ul className="mn-svc__morelist">
          {MORE.map((m, i) => (
            <li key={m}>
              <i aria-hidden>0{i + 4}</i>
              {m}
            </li>
          ))}
        </ul>
      </motion.div>
    </section>
  )
}
