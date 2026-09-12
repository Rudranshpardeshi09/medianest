import { motion } from 'framer-motion'
import MaskText from './primitives/MaskText'
import RevealImage from './primitives/RevealImage'
import EdgeTitle from './primitives/EdgeTitle'
import { EASE, VIEWPORT } from '@/lib/motion'
import '../styles/founders.css'

const FOUNDERS = [
  {
    id: 'aditi',
    first: 'Aditi',
    last: 'Singh',
    role: 'Managing Partner',
    lines: ['Still Life & Sports Photographer', 'Artist & Poet'],
    image: '/media/ADITI-MAM-1.webp',
    social: [
      {
        icon: 'fab fa-instagram',
        label: 'Instagram of Aditi Singh',
        href: 'https://www.instagram.com/aditisinghphotography',
      },
      {
        icon: 'fab fa-youtube',
        label: 'YouTube of Aditi Singh',
        href: 'https://youtube.com/@aditisinghphotography',
      },
    ],
  },
  {
    id: 'vivek',
    first: 'Vivek',
    last: 'Pathak',
    role: 'Managing Partner',
    lines: ['Former Athlete', 'Sports Administrator', 'Sports & Profiling Photographer'],
    image: '/media/VIVEK-SIR-2.webp',
    social: [
      {
        icon: 'fab fa-instagram',
        label: 'Instagram of Vivek Pathak',
        href: 'https://www.instagram.com/pafcoms',
      },
      {
        icon: 'fab fa-linkedin-in',
        label: 'LinkedIn of Vivek Pathak',
        href: 'https://www.linkedin.com/in/vivek-pathak-5257312a',
      },
    ],
  },
]

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

          <h2 className="mn-fnd__title">
            <MaskText>Two photographers running a</MaskText>{' '}
            <MaskText as="em" delay={0.24}>
              practice
            </MaskText>
            <MaskText delay={0.3}>.</MaskText>
          </h2>
        </div>

        <div className="mn-fnd__list">
          {FOUNDERS.map((p, i) => (
            <article
              key={p.id}
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
                  <RevealImage
                    src={p.image}
                    alt={`${p.first} ${p.last}, ${p.role} at Media Nest`}
                    width="375"
                    height="560"
                    direction={i % 2 === 0 ? 'left' : 'right'}
                  />
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
                      {p.first}
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
                      {p.last}
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
                    {p.lines.map((l) => (
                      <li key={l}>{l}</li>
                    ))}
                  </ul>

                  <ul className="mn-fnd__social">
                    {p.social.map((s) => (
                      <li key={s.href}>
                        <a
                          href={s.href}
                          target="_blank"
                          rel="noreferrer noopener"
                          aria-label={s.label}
                        >
                          <i className={s.icon} aria-hidden />
                        </a>
                      </li>
                    ))}
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
