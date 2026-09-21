import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import MaskText from './primitives/MaskText'
import RevealImage from './primitives/RevealImage'
import EdgeTitle from './primitives/EdgeTitle'
import MediaLightbox from './MediaLightbox'
import { WORK } from '@/lib/work'
import { EASE, VIEWPORT } from '@/lib/motion'
import '../styles/portfolio.css'

/**
 * Tile spans are paired with each source image's real pixel size so nothing
 * is upscaled into mush (the mistake caught in the services section):
 *   photography 1300x1300 · cinematography 684x342 · interview 900x900
 *   live-stream 650x650 · event 1300x1300 · graphic 342x684
 *   video-edit 650x650 · digital 650x650
 */

export default function Portfolio() {
  /* Which tile's media is showing, and which item of it. `null` is closed. */
  const [playing, setPlaying] = useState(null)
  /* The tile that opened the lightbox, so focus can go back to it on close
     instead of being dumped at the top of the document. */
  const triggerRef = useRef(null)

  const openMedia = (tile, el) => {
    triggerRef.current = el
    setPlaying({ tile, index: 0 })
  }
  const closeMedia = () => {
    setPlaying(null)
    triggerRef.current?.focus()
  }

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
          {WORK.map((t) => (
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

              {/* Without this nothing signals that a tile opens anything at
                  all. A film gets a play mark; a gallery gets its frame count,
                  so the two are told apart before anyone clicks. */}
              <span className="mn-tile__play" aria-hidden>
                {t.media[0].type === 'video' ? (
                  <svg viewBox="0 0 20 20" focusable="false">
                    <path d="M6.5 3.8 16 10l-9.5 6.2Z" />
                  </svg>
                ) : (
                  <b className="mn-tile__count">{t.media.length}</b>
                )}
              </span>
              <span className="mn-tile__panel" aria-hidden />

              <p className="mn-tile__resting" aria-hidden>
                {t.name}
              </p>

              <div className="mn-tile__cap">
                <span className="mn-tile__meta">{t.meta}</span>
                <h3 className="mn-tile__name">{t.name}</h3>
              </div>

              {/* The whole tile is the control, so hover state is also
                  reachable by keyboard via :focus-within. Every tile now
                  opens what is behind it rather than the enquiry form. */}
              <button
                type="button"
                className="mn-tile__link"
                aria-label={`${t.name} — ${
                  t.media[0].type === 'video' ? 'play film' : 'view stills'
                }`}
                onClick={(e) => openMedia(t, e.currentTarget)}
              />
            </motion.article>
          ))}
        </motion.div>
      </div>

      <MediaLightbox
        open={!!playing}
        items={playing ? playing.tile.media : null}
        index={playing ? playing.index : 0}
        label={playing ? playing.tile.name : ''}
        onIndex={(i) => setPlaying((p) => (p ? { ...p, index: i } : p))}
        onClose={closeMedia}
      />
    </section>
  )
}
