import { motion } from 'framer-motion'
import MaskText from './primitives/MaskText'
import RevealImage from './primitives/RevealImage'
import EdgeTitle from './primitives/EdgeTitle'
import { EASE, VIEWPORT, stagger, riseIn } from '@/lib/motion'
import '../styles/about.css'

const PILLARS = [
  {
    n: '01',
    title: 'Holistic Approach',
    body:
      'We treat brand image as one system, focusing on visual and tangible content that drives engagement and trust.',
  },
  {
    n: '02',
    title: 'Tailored Services',
    body:
      'High-quality film production, professional photography and content strategy, shaped to position brands as industry leaders.',
  },
  {
    n: '03',
    title: 'Extensive Networking',
    body:
      'Deep professional experience and rooted networking opportunities, so every engagement carries further than the work itself.',
    wide: true,
  },
]

const STATS = [
  { value: '5+', label: 'Years of practice' },
  { value: '9', label: 'Disciplines in-house' },
  { value: '24/7', label: 'Operational window' },
  { value: 'Global', label: 'Coverage', accent: true },
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
            <h2 className="mn-about__title">
              <MaskText>We shape the way a brand is</MaskText>{' '}
              <MaskText as="em" delay={0.1}>
                seen
              </MaskText>
              <MaskText delay={0.14}>, frame by frame.</MaskText>
            </h2>
          </div>

          <motion.p
            className="mn-about__lede"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.85, ease: EASE, delay: 0.15 }}
          >
            Media Nest is a brand image management and consultancy practice. We create and curate
            visual content that drives engagement, trust and lasting presence — from photography
            and cinematography through to strategy, events and digital.
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
              src="/media/INTERVIEW.webp"
              alt="A Media Nest studio set lit for an interview shoot"
              width="900"
              height="900"
              parallax={4}
            />
            <figcaption className="mn-about__figcap">
              <strong>Visual Excellence, Tangible Results</strong>
              <span>The practice at work</span>
            </figcaption>
          </motion.figure>

          {PILLARS.map((p) => (
            <motion.article
              key={p.n}
              className={`mn-pillar${p.wide ? ' mn-pillar--wide' : ''}`}
              variants={riseIn}
            >
              <span className="mn-pillar__num">{p.n}</span>
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
