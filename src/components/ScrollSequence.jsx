import { useCallback, useEffect, useRef, useState } from 'react'
import '../styles/sequence.css'

/**
 * Scroll-linked image sequence on a canvas.
 *
 * The section is `scrollLengthVh` tall and the canvas inside it is sticky and
 * full-screen, so the animation holds in place while the page scrolls past it.
 * Frames are drawn to a canvas rather than swapped as <img> tags: swapping
 * elements makes the browser lay out and composite on every step, where a
 * canvas is one element and one drawImage.
 */

const DEFAULT_FRAME_COUNT = 120

/* public/sequence/ezgif-frame-001.jpg … -120.jpg, all 640x360. */
const defaultSrc = (n) => `/sequence/ezgif-frame-${String(n).padStart(3, '0')}.jpg`

export default function ScrollSequence({
  frameCount = DEFAULT_FRAME_COUNT,
  src = defaultSrc,
  /* ── THE SPEED KNOB ──────────────────────────────────────────────
     How tall the scroll container is, in viewport heights. See the
     mapping note in frameFromScroll() below: this is the only value
     that changes how fast the sequence plays. */
  scrollLengthVh = 400,
  /* Under this width, every second frame is loaded instead of all of
     them — half the bytes, and at phone size the dropped frames are
     not perceptible. */
  mobileBreakpoint = 768,
  className = '',
}) {
  const sectionRef = useRef(null)
  const canvasRef = useRef(null)
  const ctxRef = useRef(null)

  /* Refs, not state: these change on every scroll frame and must never
     trigger a React render. */
  const imagesRef = useRef([])
  const drawnRef = useRef(-1) // last frame index actually painted
  const rafRef = useRef(null)
  const sizeRef = useRef({ w: 0, h: 0 })

  const [ready, setReady] = useState(false)
  const [pct, setPct] = useState(0)
  /* Read synchronously in the initialiser, not in an effect. An effect runs
     after the preload below has already started, so the first pass would fetch
     the whole sequence before learning it only needs one frame. */
  const [reduced, setReduced] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const apply = () => setReduced(mq.matches)
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])

  /* ── Preload ──────────────────────────────────────────────────────
     Every frame is fetched up front and the section shows a loading
     state until they are all in. Decoding mid-scroll is what makes one
     of these stutter, so nothing starts before the set is complete. */
  useEffect(() => {
    let cancelled = false

    const numbers = []
    if (reduced) {
      // One frame is all that will ever be shown, so one frame is all that
      // is fetched. The full set is ~750KB.
      numbers.push(Math.ceil(frameCount / 2))
    } else {
      // Mobile: every second frame. Decided once, on mount — see the note
      // in the resize handler about why this is not re-evaluated.
      const step = window.innerWidth < mobileBreakpoint ? 2 : 1
      for (let n = 1; n <= frameCount; n += step) numbers.push(n)
    }

    const imgs = new Array(numbers.length)
    let settled = 0

    const onSettle = () => {
      settled += 1
      if (cancelled) return
      setPct(Math.round((settled / numbers.length) * 100))
      if (settled === numbers.length) {
        imagesRef.current = imgs
        setReady(true)
      }
    }

    numbers.forEach((n, i) => {
      const img = new Image()
      img.decoding = 'async'
      /* A failed frame counts as settled. One 404 should leave a gap in
         the sequence, not hang the loading state for ever. */
      img.onload = onSettle
      img.onerror = onSettle
      img.src = src(n)
      imgs[i] = img
    })

    return () => {
      cancelled = true
    }
  }, [frameCount, src, mobileBreakpoint, reduced])

  /* ── Canvas sizing ────────────────────────────────────────────────
     Backing store is scaled by DPR (capped at 2 — beyond that the extra
     pixels cost more than they show) and the context is pre-scaled, so
     the draw code works in CSS pixels. */
  const sizeCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const w = canvas.clientWidth
    const h = canvas.clientHeight
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = Math.round(w * dpr)
    canvas.height = Math.round(h * dpr)
    const ctx = canvas.getContext('2d')
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctxRef.current = ctx
    sizeRef.current = { w, h }
  }, [])

  /* Aspect ratio is preserved, never stretched. Landscape viewports get
     cover (fills the pane, trims a little off the long edge); portrait
     gets contain, because covering a 16:9 frame on a phone held upright
     would show about a quarter of its width. */
  const draw = useCallback((index) => {
    const ctx = ctxRef.current
    const img = imagesRef.current[index]
    if (!ctx || !img || !img.naturalWidth) return

    const { w, h } = sizeRef.current
    const sx = w / img.naturalWidth
    const sy = h / img.naturalHeight
    const scale = w >= h ? Math.max(sx, sy) : Math.min(sx, sy)
    const dw = img.naturalWidth * scale
    const dh = img.naturalHeight * scale

    ctx.clearRect(0, 0, w, h)
    ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh)
  }, [])

  /* ── SCROLL-TO-FRAME MAPPING ──────────────────────────────────────
     The section is `scrollLengthVh` tall and the sticky pane inside it
     is 100vh, so the distance the page actually travels while the pane
     is pinned is:

         travel = sectionHeight - viewportHeight
                ≈ (scrollLengthVh - 100)vh

     progress = how far through that travel we are, clamped to 0…1.
     frame    = round(progress × (frameCount - 1))

     Scrolling down raises progress and steps forward; scrolling up
     lowers it and steps back — the mapping is positional, not a
     counter, so it is symmetrical for free.

     SPEED: at the defaults, 120 frames over (400 - 100) = 300vh means
     each frame holds for 300/120 = 2.5vh of scrolling. Change
     `scrollLengthVh` to change that; nothing in here needs touching. */
  const frameFromScroll = useCallback(() => {
    const el = sectionRef.current
    if (!el) return 0
    const rect = el.getBoundingClientRect()
    const travel = el.offsetHeight - window.innerHeight
    if (travel <= 0) return 0

    const progress = Math.min(1, Math.max(0, -rect.top / travel))
    const last = imagesRef.current.length - 1
    return Math.round(progress * last)
  }, [])

  /* ── The loop ─────────────────────────────────────────────────────
     The scroll listener never draws. It only schedules one rAF, and
     only if one is not already pending, so a burst of scroll events
     collapses into a single paint per frame. Inside that callback the
     index is compared with the last one painted and the canvas is left
     alone unless it has actually changed. */
  useEffect(() => {
    if (!ready) return undefined

    sizeCanvas()

    const paint = (force) => {
      const next = reduced ? Math.floor((imagesRef.current.length - 1) / 2) : frameFromScroll()
      if (next === drawnRef.current && !force) return
      drawnRef.current = next
      draw(next)
    }

    paint(true)
    if (reduced) {
      /* One static frame, and no scroll wiring at all. */
      const onResizeOnly = () => {
        sizeCanvas()
        paint(true)
      }
      window.addEventListener('resize', onResizeOnly)
      return () => window.removeEventListener('resize', onResizeOnly)
    }

    const onScroll = () => {
      if (rafRef.current !== null) return
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null
        paint(false)
      })
    }

    /* Resize forces a repaint even though the index has not moved: the
       backing store was just reallocated, so the canvas is blank. The
       loaded frame set is NOT rebuilt when crossing the mobile
       breakpoint — re-fetching half a sequence mid-session costs more
       than the frames it would add. */
    const onResize = () => {
      sizeCanvas()
      paint(true)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
  }, [ready, reduced, sizeCanvas, draw, frameFromScroll])

  return (
    <section
      ref={sectionRef}
      className={`mn-seq ${className}`}
      /* Reduced motion collapses the container: with a single static
         frame there is nothing to scroll through. */
      style={{ height: reduced ? '100vh' : `${scrollLengthVh}vh` }}
      aria-label="Scroll-linked product sequence"
    >
      <div className="mn-seq__stage">
        <canvas ref={canvasRef} className="mn-seq__canvas" aria-hidden />

        {!ready && (
          <div className="mn-seq__loading" role="status" aria-live="polite">
            <span className="mn-seq__pct">{pct}%</span>
            <span className="mn-seq__bar">
              <i style={{ transform: `scaleX(${pct / 100})` }} />
            </span>
            <span className="mn-seq__label">Loading sequence</span>
          </div>
        )}
      </div>
    </section>
  )
}
