import { useCallback, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { EASE } from '@/lib/motion'
import '../styles/lightbox.css'

/**
 * Shows what sits behind a portfolio tile: a film, or a set of stills.
 *
 * Both came from the old site. Each tile there carried either an Elementor
 * lightbox video (stored as JSON in a `data-elementor-lightbox` attribute,
 * which is why searching the markup for iframes finds nothing) or a small
 * slideshow of images. Five tiles had a film, three had stills.
 *
 * Nothing is fetched until someone opens it -- the iframe is mounted on
 * demand and only the current still is in the DOM -- so a page that is never
 * clicked costs nothing.
 *
 * It renders through a portal to <body>. The portfolio section sets
 * `isolation: isolate` and `overflow: clip`, so a modal left inside it is
 * trapped in that section's stacking context and the fixed nav draws straight
 * over the backdrop, whatever z-index this uses.
 */
export default function MediaLightbox({ open, items, index, onIndex, onClose, label }) {
  const reduced = useReducedMotion()
  const closeRef = useRef(null)
  const panelRef = useRef(null)

  const count = items ? items.length : 0
  const current = count ? items[Math.min(index, count - 1)] : null

  const step = useCallback(
    (d) => {
      if (count < 2) return
      onIndex((index + d + count) % count)
    },
    [count, index, onIndex],
  )

  /* Escape closes, arrows page. Bound to the document rather than the panel
     so it works before focus has settled. */
  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowLeft') step(-1)
      else if (e.key === 'ArrowRight') step(1)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose, step])

  /* Nothing scrolls behind it. */
  useEffect(() => {
    if (!open) return undefined
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  /* Focus the close button on open. Portfolio takes focus back to the tile. */
  useEffect(() => {
    if (open) closeRef.current?.focus()
  }, [open])

  /* Fetch the next still while this one is being looked at, so paging through
     a gallery does not flash an empty frame. Images only -- a video iframe is
     far too expensive to speculatively mount. */
  useEffect(() => {
    if (!open || count < 2) return
    const next = items[(index + 1) % count]
    if (next?.type === 'image') {
      const img = new Image()
      img.src = next.src
    }
  }, [open, items, index, count])

  /* A minimal focus trap: Tab cycles inside the panel while it is open. */
  const onKeyDownTrap = (e) => {
    if (e.key !== 'Tab' || !panelRef.current) return
    const focusables = panelRef.current.querySelectorAll('button')
    if (!focusables.length) return
    const first = focusables[0]
    const last = focusables[focusables.length - 1]
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }

  const isVideo = current?.type === 'video'
  /* A film has its own name, worth showing. A still does not -- giving each
     one the tile's name just printed it twice in the header. */
  const heading = current ? current.title || 'Selected stills' : ''

  const tree = (
    <AnimatePresence>
      {open && current && (
        <motion.div
          className="mn-lb"
          role="dialog"
          aria-modal="true"
          aria-label={label ? `${label} - ${isVideo ? 'film' : 'stills'}` : 'Media'}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.32, ease: EASE }}
          onMouseDown={(e) => {
            // Only a click on the backdrop closes, not a drag off the panel
            if (e.target === e.currentTarget) onClose()
          }}
          onKeyDown={onKeyDownTrap}
        >
          <motion.div
            ref={panelRef}
            className="mn-lb__panel"
            initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 14 }}
            animate={reduced ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.97, y: 8 }}
            transition={{ duration: 0.42, ease: EASE }}
          >
            <div className="mn-lb__head">
              <p className="mn-lb__title">
                <span className="mn-lb__eyebrow">{label}</span>
                {heading}
              </p>

              <button
                ref={closeRef}
                type="button"
                className="mn-lb__close"
                onClick={onClose}
                aria-label={`Close ${isVideo ? 'video' : 'gallery'}`}
              >
                <svg viewBox="0 0 24 24" aria-hidden focusable="false">
                  <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <div className={`mn-lb__frame${isVideo ? '' : ' mn-lb__frame--still'}`}>
              {isVideo ? (
                /* keyed on the id so paging swaps the player rather than
                   reusing one that is already mid-playback */
                <iframe
                  key={current.id}
                  src={`https://www.youtube-nocookie.com/embed/${current.id}?autoplay=1&rel=0&modestbranding=1`}
                  title={current.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <motion.img
                  key={current.src}
                  src={current.src}
                  alt={current.alt || current.title}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, ease: EASE }}
                />
              )}
            </div>

            {count > 1 && (
              <div className="mn-lb__pager">
                <button type="button" onClick={() => step(-1)} aria-label="Previous">
                  <svg viewBox="0 0 24 24" aria-hidden focusable="false">
                    <path d="M15 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <span aria-live="polite">
                  {index + 1} / {count}
                </span>
                <button type="button" onClick={() => step(1)} aria-label="Next">
                  <svg viewBox="0 0 24 24" aria-hidden focusable="false">
                    <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  return typeof document === 'undefined' ? null : createPortal(tree, document.body)
}
