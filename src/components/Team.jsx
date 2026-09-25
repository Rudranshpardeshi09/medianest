import { motion } from 'framer-motion'
import MaskText from './primitives/MaskText'
import RevealImage from './primitives/RevealImage'
import EdgeTitle from './primitives/EdgeTitle'
import { TEAM, focal, splitAccent } from '@/lib/content'
import { PLATFORM } from '@/lib/social'
import { EASE, VIEWPORT } from '@/lib/motion'
import '../styles/founders.css'

/* The partners come from the CMS, and there can be any number of them: the
   list is a flex column and the left/right flip is decided by row position, so
   a third simply adds a row mirrored the other way. The heading spells the
   count itself — the API fills {count} before sending it — so it cannot end up
   claiming two while three are on screen. */
const FOUNDERS = TEAM.people


export default function Team() {
  return (
    <section id="team" className="mn-fnd">
      <EdgeTitle side="left">Founders</EdgeTitle>

      <div className="mn-fnd__inner">
        <div className="mn-fnd__head">
          <motion.p
            className="mn-eyebrow"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.7, ease: EASE }}
          >
            The partners
          </motion.p>

          {/* No separator between segments: the split keeps the space inside
              the text and MaskText emits real spaces between words. Same as
              About and Why Choose Us. */}
          <h2 className="mn-fnd__title">
            {splitAccent(TEAM.heading).map((part, i) => (
              <MaskText key={i} as={part.accent ? 'em' : undefined} delay={i * 0.05 + (i ? 0.05 : 0)}>
                {part.text}
              </MaskText>
            ))}
          </h2>
        </div>

        <div className="mn-fnd__list">
          {FOUNDERS.map((p, i) => (
            <article
              key={`${i}-${p.first_name}-${p.last_name}`}
              className={`mn-fnd__person${i % 2 === 1 ? ' mn-fnd__person--flip' : ''}`}
            >
              {/* Decorative layer: a ghosted ordinal, an aperture ring and a
                  dot field, mirrored for the flipped row. z-index 0, behind
                  everything, and aria-hidden — it carries nothing the copy
                  does not already say. */}
              <span className="mn-fnd__decor" aria-hidden>
                <motion.span
                  className="mn-fnd__ord"
                  initial={{ opacity: 0, y: 26 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={VIEWPORT}
                  transition={{ duration: 1.1, ease: EASE }}
                >
                  {String(i + 1).padStart(2, '0')}
                </motion.span>

                <motion.span
                  className="mn-fnd__ring"
                  initial={{ opacity: 0, scale: 0.72 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={VIEWPORT}
                  transition={{ duration: 1.3, ease: EASE, delay: 0.18 }}
                />

                <motion.span
                  className="mn-fnd__dots"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={VIEWPORT}
                  transition={{ duration: 1, delay: 0.34 }}
                />

                <motion.span
                  className="mn-fnd__chip"
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={VIEWPORT}
                  transition={{ duration: 0.7, ease: EASE, delay: 0.5 }}
                />

                <motion.span
                  className="mn-fnd__stem"
                  initial={{ scaleY: 0 }}
                  whileInView={{ scaleY: 1 }}
                  viewport={VIEWPORT}
                  transition={{ duration: 0.9, ease: EASE, delay: 0.42 }}
                />
              </span>

              <figure className="mn-fnd__figure">
                <div className="mn-fnd__frame">
                  {/* A person can be added in the admin before a portrait is
                      uploaded. Rendering the image anyway gave a broken-image
                      box with the alt text spilling out past the frame, so the
                      frame is simply left empty — it keeps its 3:4 box either
                      way, and the row's other column is unaffected. */}
                  {p.photo ? (
                    <RevealImage
                      src={p.photo}
                      alt={`${p.first_name} ${p.last_name}, ${p.role} at Media Nest`}
                      direction={i % 2 === 0 ? 'left' : 'right'}
                      objectPosition={focal(p)}
                    />
                  ) : null}
                  <span className="mn-fnd__grain" aria-hidden />
                </div>
              </figure>

              <div className="mn-fnd__body">
                <motion.h3
                  className="mn-fnd__name"
                  initial="hidden"
                  whileInView="show"
                  viewport={VIEWPORT}
                  variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
                >
                  {/* Each line clips its own box; the observer sits on the
                      unclipped h3 so the lines can actually fire. */}
                  <span className="mn-mask">
                    <motion.span
                      className="mn-mask__word"
                      variants={{
                        hidden: { y: '110%' },
                        show: { y: '0%', transition: { duration: 1.05, ease: EASE } },
                      }}
                    >
                      {p.first_name}
                    </motion.span>
                  </span>
                  <em className="mn-mask">
                    <motion.span
                      className="mn-mask__word"
                      variants={{
                        hidden: { y: '110%' },
                        show: { y: '0%', transition: { duration: 1.05, ease: EASE } },
                      }}
                    >
                      {p.last_name}
                    </motion.span>
                  </em>
                </motion.h3>

                <motion.div
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={VIEWPORT}
                  transition={{ duration: 0.8, ease: EASE, delay: 0.2 }}
                >
                  <p className="mn-fnd__role">{p.role}</p>

                  <ul className="mn-fnd__lines">
                    {p.lines.map((l, j) => (
                      <li key={`${j}-${l}`}>{l}</li>
                    ))}
                  </ul>

                  <ul className="mn-fnd__social">
                    {p.social.map((s, j) => {
                      /* An unknown platform would otherwise render an empty
                         icon box with no label — a link nobody can see or
                         hear. The CMS only offers these five, but the data
                         outlives any one version of this map. */
                      const meta = PLATFORM[s.platform]
                      if (!meta) return null
                      return (
                        <li key={`${j}-${s.platform}`}>
                          <a
                            href={s.url}
                            target="_blank"
                            rel="noreferrer noopener"
                            aria-label={`${meta.name} of ${p.first_name} ${p.last_name}`}
                          >
                            <i className={meta.icon} aria-hidden />
                          </a>
                        </li>
                      )
                    })}
                  </ul>
                </motion.div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
