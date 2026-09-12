import { motion } from 'framer-motion'
import MaskText from './primitives/MaskText'
import RevealImage from './primitives/RevealImage'
import EdgeTitle from './primitives/EdgeTitle'
import { EASE, VIEWPORT } from '@/lib/motion'
import '../styles/portfolio.css'

/**
 * Tile spans are paired with each source image's real pixel size so nothing
 * is upscaled into mush (the mistake caught in the services section):
 *   photography 1300x1300 · cinematography 684x342 · interview 900x900
 *   live-stream 650x650 · event 1300x1300 · graphic 342x684
 *   video-edit 650x650 · digital 650x650
 */
const TILES = [
  { id: 'photography', name: 'Photography', meta: 'Stills', img: '/media/photography.webp', span: '6x2' },
  { id: 'cinematography', name: 'Cinematography', meta: 'Motion', img: '/media/cinematography_main.webp', span: '6x1' },
  { id: 'interview', name: 'Interview', meta: 'Voice', img: '/media/INTERVIEW.webp', span: '3x1' },
  { id: 'live-stream', name: 'Live Stream', meta: 'Broadcast', img: '/media/LIVE-STREAM.webp', span: '3x1' },
  { id: 'event', name: 'Event', meta: 'Coverage', img: '/media/EVENT.webp', span: '5x2' },
  { id: 'graphic-design', name: 'Graphic Design', meta: 'Identity', img: '/media/graphic-1.webp', span: '3x2' },
  { id: 'video-edit', name: 'Video Edit', meta: 'Post', img: '/media/video-edit.webp', span: '4x1' },
  { id: 'digital-marketing', name: 'Digital Marketing', meta: 'Reach', img: '/media/new_DIGITAL-MARKETING.webp', span: '4x1' },
]

export default function Portfolio() {
  return (
    <section id="projects" className="mn-work">
      <EdgeTitle side="right">Portfolio</EdgeTitle>

      <div className="mn-work__inner">
        <div className="mn-work__head">
          <div>
            <motion.p
              className="mn-eyebrow"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEWPORT}
              transition={{ duration: 0.7, ease: EASE }}
            >
              Selected work
            </motion.p>

            <h2 className="mn-work__title">
              <MaskText>Frames that carry a</MaskText>{' '}
              <MaskText as="em" delay={0.1}>
                brand
              </MaskText>
              <MaskText delay={0.14}>.</MaskText>
            </h2>
          </div>

          <motion.p
            className="mn-work__note"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.85, ease: EASE, delay: 0.12 }}
          >
            Nine disciplines, one visual language — shot, directed and finished in-house.
          </motion.p>
        </div>

        <motion.div
          className="mn-work__grid"
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
        >
          {TILES.map((t) => (
            <motion.article
              key={t.id}
              className={`mn-tile mn-tile--${t.span}`}
              variants={{
                hidden: { opacity: 0 },
                show: { opacity: 1, transition: { duration: 0.6, ease: EASE } },
              }}
            >
              <RevealImage src={t.img} alt={`${t.name} — Media Nest`} />

              <span className="mn-tile__tint" aria-hidden />
              <span className="mn-tile__panel" aria-hidden />

              <p className="mn-tile__resting" aria-hidden>
                {t.name}
              </p>

              <div className="mn-tile__cap">
                <span className="mn-tile__meta">{t.meta}</span>
                <h3 className="mn-tile__name">{t.name}</h3>
              </div>

              {/* The whole tile is the control, so hover state is also
                  reachable by keyboard via :focus-within. */}
              <a className="mn-tile__link" href="#contact" aria-label={`${t.name} — enquire`} />
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
