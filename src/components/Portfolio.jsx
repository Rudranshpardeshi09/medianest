import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import MaskText from './primitives/MaskText'
import RevealImage from './primitives/RevealImage'
import EdgeTitle from './primitives/EdgeTitle'
import MediaLightbox from './MediaLightbox'
import { WORK } from '@/lib/work'
import { SETTINGS, focal } from '@/lib/content'
import { EASE, VIEWPORT } from '@/lib/motion'
import '../styles/portfolio.css'

/**
 * Tiles come from the CMS; the spans do not. See `lib/work.js` for why the
 * grid keeps its own eight-slot layout, and the admin's own crop preview for
 * the pixel size each slot needs to stay sharp.
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
            {SETTINGS.discipline_count_word} disciplines, one visual language — shot, directed and
            finished in-house.
          </motion.p>
        </div>

        <motion.div
          className="mn-work__grid"
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
        >
          {WORK.map((t) => {
            /* A tile can now be created in the admin before anything is put
               behind it. That used to be impossible, so `media[0]` was read
               directly; with the content editable it would take the whole page
               down at build time. An empty tile still shows -- cover, name and
               all -- it just is not a control. */
            const film = t.media[0]?.type === 'video'
            const opens = t.media.length > 0

            return (
              <motion.article
                key={t.id}
                className={`mn-tile mn-tile--${t.span}`}
                variants={{
                  hidden: { opacity: 0 },
                  show: { opacity: 1, transition: { duration: 0.6, ease: EASE } },
                }}
              >
                <RevealImage
                  src={t.img}
                  alt={`${t.name} — Media Nest`}
                  objectPosition={focal(t)}
                />

                <span className="mn-tile__tint" aria-hidden />

                {/* Without this nothing signals that a tile opens anything at
                    all. A film gets a play mark; a gallery gets its frame count,
                    so the two are told apart before anyone clicks. */}
                {opens ? (
                  <span className="mn-tile__play" aria-hidden>
                    {film ? (
                      <svg viewBox="0 0 20 20" focusable="false">
                        <path d="M6.5 3.8 16 10l-9.5 6.2Z" />
                      </svg>
                    ) : (
                      <b className="mn-tile__count">{t.media.length}</b>
                    )}
                  </span>
                ) : null}
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
                {opens ? (
                  <button
                    type="button"
                    className="mn-tile__link"
                    aria-label={`${t.name} — ${film ? 'play film' : 'view stills'}`}
                    onClick={(e) => openMedia(t, e.currentTarget)}
                  />
                ) : null}
              </motion.article>
            )
          })}
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
