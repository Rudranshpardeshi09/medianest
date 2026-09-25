import { motion } from 'framer-motion'
import MaskText from './primitives/MaskText'
import RevealImage from './primitives/RevealImage'
import EdgeTitle from './primitives/EdgeTitle'
import { ABOUT, SETTINGS, focal, pad2, splitAccent } from '@/lib/content'
import { EASE, VIEWPORT, stagger, riseIn } from '@/lib/motion'
import '../styles/about.css'

const PILLARS = ABOUT.pillars
/* Values from the CMS, labels are copy and stay here. The hero states two of
   the same figures and reads the same settings, so they cannot disagree. */
const STATS = [
  { value: SETTINGS.years_of_practice, label: 'Years of practice' },
  { value: SETTINGS.discipline_count, label: 'Disciplines in-house' },
  { value: SETTINGS.hours_compact, label: 'Operational window' },
  { value: SETTINGS.coverage, label: 'Coverage', accent: true },
]

export default function About() {
  return (
    <section id="about" className="mn-about">
      <EdgeTitle side="left">About</EdgeTitle>

      <div className="mn-about__inner">
        {/* ── Head ─────────────────────────────────────── */}
        <div className="mn-about__head">
          <div>
            <motion.p
              className="mn-eyebrow"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEWPORT}
              transition={{ duration: 0.7, ease: EASE }}
            >
              Who we are
            </motion.p>

            {/* Real <h2> — the page previously had none at all, so the
                document outline stopped at the hero's <h1>. */}
            {/* Three masked segments, same as before — the parts now come
                from the CMS heading, split on its *accented* span. */}
            <h2 className="mn-about__title">
              {splitAccent(ABOUT.heading).map((part, i) => (
                <MaskText
                  key={i}
                  as={part.accent ? 'em' : undefined}
                  delay={i * 0.05 + (i ? 0.05 : 0)}
                >
                  {part.text}
                </MaskText>
              ))}
            </h2>
          </div>

          <motion.p
            className="mn-about__lede"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.85, ease: EASE, delay: 0.15 }}
          >
            {ABOUT.description}
          </motion.p>
        </div>

        {/* ── Bento ────────────────────────────────────── */}
        <motion.div
          className="mn-about__grid"
          variants={stagger(0.09)}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
        >
          <motion.figure className="mn-about__figure" variants={riseIn}>
            <RevealImage
              src={ABOUT.figure}
              alt={ABOUT.figure_alt}
              width="900"
              height="900"
              parallax={4}
              style={{ objectPosition: focal(ABOUT) }}
            />
            <figcaption className="mn-about__figcap">
              <strong>Visual Excellence, Tangible Results</strong>
              <span>The practice at work</span>
            </figcaption>
          </motion.figure>

          {PILLARS.map((p, i) => (
            <motion.article
              key={p.title}
              className={`mn-pillar${p.is_wide ? ' mn-pillar--wide' : ''}`}
              variants={riseIn}
            >
              <span className="mn-pillar__num">{pad2(i + 1)}</span>
              <h3 className="mn-pillar__title">{p.title}</h3>
              <p className="mn-pillar__body">{p.body}</p>
            </motion.article>
          ))}
        </motion.div>

        {/* ── Stats ────────────────────────────────────── */}
        <motion.dl
          className="mn-stats"
          variants={stagger(0.07, 0.05)}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
        >
          {STATS.map((s) => (
            <motion.div key={s.label} variants={riseIn}>
              <dt className="sr-only">{s.label}</dt>
              <dd>
                <span className="mn-stats__value">
                  {s.accent ? <em>{s.value}</em> : s.value}
                </span>
                <span className="mn-stats__label">{s.label}</span>
              </dd>
            </motion.div>
          ))}
        </motion.dl>
      </div>
    </section>
  )
}
