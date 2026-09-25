import { useState } from 'react'
import { motion } from 'framer-motion'
import MaskText from './primitives/MaskText'
import RevealImage from './primitives/RevealImage'
import { SERVICES, SERVICE_STRIP, focal, pad2 } from '@/lib/content'
import { EASE, VIEWPORT } from '@/lib/motion'
import '../styles/services.css'


/* The rail scrolls to its card by id. That id used to be stored alongside
   the copy; deriving it from the title keeps the two from drifting apart. */
const slug = (title) =>
  'svc-' + title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

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
                  <li key={s.title} className="mn-svc__listitem" data-on={on}>
                    <button
                      type="button"
                      className="mn-svc__listbtn"
                      aria-current={on ? 'true' : undefined}
                      onClick={() => jumpTo(slug(s.title))}
                    >
                      <span className="mn-svc__listnum">{pad2(i + 1)}</span>
                      <span className="mn-svc__listtitle">{s.label}</span>
                    </button>

                    {/* Opened by CSS (grid-template-rows 0fr -> 1fr), not by animating
                        height to 'auto'. Framer Motion cannot know an auto
                        height without measuring, and its measurement path
                        saves window.scrollY, jumps the page to 0, reads the
                        box, then calls window.scrollTo(0, saved). That restore
                        cancels any smooth scroll in flight — which is why a
                        nav click from the hero to Contact died here the moment
                        a card's onViewportEnter switched the active service. */}
                    <div className="mn-svc__detail" data-open={on || undefined}>
                      <div className="mn-svc__detailin">
                        <p className="mn-svc__desc">{s.body}</p>
                        <ul className="mn-svc__tags">
                          {s.tags.map((t) => (
                            <li key={t}>{t}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
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
              key={s.title}
              id={slug(s.title)}
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
                  style={{ objectPosition: focal(s) }}
                />
                <div className="mn-svc__cardhead">
                  <div>
                    <span className="mn-svc__cardnum">{pad2(i + 1)}</span>
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
          {/* The numbering continues from the cards. It used to be written as
              `0{i + 4}`, which renders "010" on a seventh entry and assumed
              there were exactly three cards; both now follow the real counts. */}
          {SERVICE_STRIP.map((m, i) => (
            <li key={m.title}>
              <i aria-hidden>{pad2(SERVICES.length + i + 1)}</i>
              {m.title}
            </li>
          ))}
        </ul>
      </motion.div>
    </section>
  )
}
