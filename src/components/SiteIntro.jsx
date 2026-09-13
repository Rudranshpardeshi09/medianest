import { useCallback, useEffect, useRef, useState } from 'react'
import '../styles/intro.css'

/**
 * Opening animation — a camera assembling itself, played once on load,
 * then the site is revealed.
 *
 * The source is the H.264 mp4, not the 120 extracted frames and not the
 * animated WebP. All three are 640x360, so none of them is sharper than
 * the others; the mp4 is simply the smallest by a long way (438KB against
 * 1052KB of frames and 3573KB of WebP) and it is hardware decoded. A
 * preloader built from 120 separate requests would need a preloader of
 * its own.
 *
 * It is held at its native-ish size rather than stretched full-bleed:
 * 640x360 blown up to a 1400px pane is a 2.2x upscale and looks it. The
 * field behind it is #f3f0e7 — sampled from the frames' own corners — so
 * the video has no visible edge.
 *
 * Nothing here can trap the visitor. The intro ends on whichever comes
 * first: the video ending, a hard timeout, an error, or a blocked
 * autoplay.
 */

/* Measured end to end on a warm cache: React mounts and the intro appears at
   ~0.9s, the clip runs, then a 0.5s fade. At RATE 1.5 that totalled ~4.4s,
   which is a long time to hold someone on every reload. 1.8 brings the clip
   to ~2.2s and the whole thing to ~3.6s.
   MAX_MS is the backstop, not the plan: it only fires if the video never
   ends — stalled, unsupported, or silently refused. */
const MAX_MS = 4200
const RATE = 1.8

export default function SiteIntro({ onDone }) {
  const videoRef = useRef(null)
  const rafRef = useRef(null)
  const doneRef = useRef(false)
  const [leaving, setLeaving] = useState(false)
  const [progress, setProgress] = useState(0)

  const finish = useCallback(() => {
    if (doneRef.current) return
    doneRef.current = true
    setLeaving(true)
    // matches the fade in intro.css
    setTimeout(onDone, 520)
  }, [onDone])

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      // No animation at all — just a beat on the wordmark, then the site.
      const t = setTimeout(finish, 400)
      return () => clearTimeout(t)
    }

    const v = videoRef.current
    const cap = setTimeout(finish, MAX_MS)

    if (!v) {
      return () => clearTimeout(cap)
    }

    v.playbackRate = RATE

    /* currentTime is read on a rAF rather than from `timeupdate`, which
       only fires about four times a second and makes the rule jump. */
    const tick = () => {
      if (v.duration) setProgress(Math.min(1, v.currentTime / v.duration))
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)

    /* A blocked autoplay returns a rejected promise. That is not an error
       worth showing anyone — reveal the site and move on. */
    const started = v.play()
    if (started && typeof started.catch === 'function') started.catch(finish)

    return () => {
      clearTimeout(cap)
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [finish])

  return (
    <div className={`mn-intro${leaving ? ' is-leaving' : ''}`} role="status" aria-live="polite">
      <div className="mn-intro__stage">
        <video
          ref={videoRef}
          className="mn-intro__video"
          src="/camera-sequence.mp4"
          muted
          playsInline
          preload="auto"
          aria-hidden
          onEnded={finish}
          onError={finish}
        />

        <p className="mn-intro__mark">Media Nest</p>

        <span className="mn-intro__rail" aria-hidden>
          <i style={{ transform: `scaleX(${progress})` }} />
        </span>

        <span className="sr-only">Loading Media Nest</span>
      </div>
    </div>
  )
}
