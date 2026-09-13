import { useCallback, useEffect, useRef, useState } from 'react'
import '../styles/mn-intro.css'

/**
 * MEDIA NEST — cinematic opening sequence.
 *
 * A camera takes itself apart and puts itself back together while five
 * editorial beats are told alongside it. Everything — the camera, the type,
 * the marginalia, the construction lines, the closing iris — is driven by a
 * single scroll progress value. Nothing runs on a timer, so the sequence
 * stops the instant the reader stops and reverses when they scroll back.
 *
 * This section sits ABOVE the existing homepage and touches nothing in it.
 * Remove <MediaNestIntro /> from App.jsx and the site is exactly what it was.
 */

/* ── The sequence ─────────────────────────────────────────────────────
   public/sequence/ezgif-frame-001.jpg … -240.jpg, extracted from the
   supplied archive. All 240 are 640x360 and ~5KB each (1.2MB for the set),
   which is why they are served as individual files rather than packed into
   an atlas: over HTTP/2 the requests are multiplexed, and serving them
   separately is what makes it possible to prioritise the opening run. */
const FRAME_COUNT = 240
const frameSrc = (n) => `/sequence/ezgif-frame-${String(n).padStart(3, '0')}.jpg`

/* The frames' own background, sampled from their corners: rgb(242,239,231).
   The section is painted the same colour, so the canvas has no visible edge
   at any size. It is 1% off the hero's #f5f2ec — below the point anyone can
   see a step — and the two never share an edge. */
const FIELD_RGB = '242, 239, 231'

/* ── Framing ──────────────────────────────────────────────────────────
   Measured across all 240 frames (luma < 165): the camera never leaves
   x 112-505 or y 0-349 of the 640x360 render. Over a third of the frame's
   width is field it never uses, and drawing that empty width would leave
   the exploded camera about a third of the pane.

   This window keeps ~36px of clear air on each side of the widest frame —
   it is centred on the content, not on the frame — and the full height.
   Nothing of the camera is cropped at any point in the sequence; what is
   trimmed is background the same colour as the page. */
const SAFE = { x: 76, y: 0, w: 464, h: 360 }

/* The source is 640x360. Past roughly 1.8x it stops reading as a render and
   starts reading as an upscale, so the drawn box is capped there and very
   large displays simply keep more air around it. */
const MAX_SCALE = 1.8

/* The lens hood leaves the top of the render on the way out and returns the
   same way: row 0 of frames 42-85 and 156-199 carries 23-75px of it, so the
   source itself clips it. Those pixels were never rendered and nothing can
   bring them back — but the field is flat, so feathering the drawn frame's
   top edge, only while it is actually cut, turns a hard slice into the hood
   drifting out of the light. Every other frame has clear air above the
   camera and is left alone. */
const TOP_CLIPPED = [
  [42, 85],
  [156, 199],
]
const FEATHER_RAMP = 5

/* ── The five beats ───────────────────────────────────────────────────
   `at` is the master-progress range each beat owns. They are tuned to the
   supplied sequence rather than spaced evenly: the camera reaches full
   explosion at frames 110-131, which is progress 0.45-0.55, so beat 03 is
   the one centred on the climax. */
const STAGES = [
  {
    n: '01',
    at: [0.0, 0.17],
    eyebrow: 'Media Nest / Visual Stories',
    lines: [[{ t: 'Every brand' }], [{ t: 'has a ' }, { t: 'story.', a: true }]],
    sub: 'We make it impossible to ignore.',
    desc: 'Strategy, imagery and motion come together to shape how your brand is seen, remembered and felt.',
    note: ['A bigger', 'story', 'ahead'],
  },
  {
    n: '02',
    at: [0.17, 0.4],
    eyebrow: 'The Craft',
    lines: [
      [{ t: 'We don’t ' }, { t: 'just', a: true }],
      [{ t: 'capture the moment.' }],
      [{ t: 'We shape it.', a: true }],
    ],
    desc: 'From the first frame to the final impression, every visual decision has a purpose.',
    note: ['Ideas', 'People', 'Places', 'Brands'],
  },
  {
    n: '03',
    at: [0.4, 0.61],
    eyebrow: 'Beyond the Frame',
    lines: [
      [{ t: 'One vision.' }],
      [{ t: 'Countless ways', a: true }],
      [{ t: 'to make it seen.', a: true }],
    ],
    desc: 'Photography, cinematography, strategy and digital storytelling — built around the identity of your brand.',
    note: ['Details', 'create', 'bigger', 'stories'],
  },
  {
    n: '04',
    at: [0.61, 0.84],
    eyebrow: 'Bringing it Together',
    lines: [
      [{ t: 'Different pieces.' }],
      [{ t: 'One unmistakable', a: true }],
      [{ t: 'identity.', a: true }],
    ],
    desc: 'We connect strategy, storytelling and execution into a visual language that feels distinctly yours.',
    note: ['From ideas', 'to impact'],
  },
  {
    n: '05',
    at: [0.84, 1.0],
    eyebrow: 'Media Nest',
    lines: [[{ t: 'Make your brand' }], [{ t: 'impossible', a: true }], [{ t: 'to forget.' }]],
    desc: 'Let’s build the visual world your brand deserves.',
    cta: 'Explore Media Nest',
    note: ['Visuals', 'that', 'move', 'people'],
  },
]

/* Where the story ends and the handoff begins.

   The two used to share one progress value, which meant the closing iris
   got whatever was left of the scroll — about 20vh, two notches of a wheel,
   and it was over before it read as anything. They are split here so the
   handoff can be given its own room without re-timing a single beat: the
   ranges in STAGES stay story-relative, and the stretch past this point is
   the iris alone, with the camera assembled and beat 05 held.

   At 480vh the story keeps the ~320vh it always had and the iris gets ~61vh
   instead of ~20 — three times the distance for the same move. */
const STORY_END = 0.84

const Arrow = () => (
  <i aria-hidden>
    <svg viewBox="0 0 24 24" focusable="false">
      <path d="M4 12h15M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </i>
)

/* ── Small maths ──────────────────────────────────────────────────── */
const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v)
/* where `v` sits across [a, b], clamped */
const at01 = (v, a, b) => clamp01((v - a) / (b - a))
/* house slow-out, close enough to --mn-ease for scrubbed motion */
const ease = (t) => 1 - Math.pow(1 - t, 3)
const smooth = (t) => t * t * (3 - 2 * t)

export default function MediaNestIntro() {
  const sectionRef = useRef(null)
  const contentRef = useRef(null)
  const canvasRef = useRef(null)
  const ringRef = useRef(null)
  const orbitRef = useRef(null)
  const arcRef = useRef(null)
  const railRef = useRef(null)
  const beatRefs = useRef([])
  const noteRefs = useRef([])

  /* Refs, not state: these change on every scrolled frame and must never
     put React to work. */
  const ctxRef = useRef(null)
  const sizeRef = useRef({ w: 0, h: 0 })
  const framesRef = useRef({ numbers: [], imgs: [], loaded: [] })
  const drawnRef = useRef(-1)
  const targetRef = useRef(0)
  const rafRef = useRef(null)
  const lastPRef = useRef(-1)
  const animRef = useRef([])

  const [ready, setReady] = useState(false)
  const [pct, setPct] = useState(0)
  const [stage, setStage] = useState(0)
  /* Read in the initialiser rather than an effect: an effect runs after the
     preload below has already fired, so the first pass would fetch the whole
     sequence before finding out it only ever needs one frame. */
  const [reduced] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  const goHome = useCallback((instant) => {
    document
      .getElementById('home')
      ?.scrollIntoView({ behavior: instant ? 'instant' : 'smooth', block: 'start' })
  }, [])

  /* ── Preload ────────────────────────────────────────────────────────
     Two waves. The first is a scrubbable skeleton — the opening run plus
     every sixth frame after it, about 55 requests — and the loading state
     clears the moment it lands. The rest arrive behind it and slot in as
     they go; until one does, the nearest loaded frame is drawn, so the
     canvas is never blank and the reader is never held.

     Reduced motion fetches exactly one frame. Under 768px every second
     frame is fetched: the sequence still runs start to finish, at half the
     bytes and half the decode. */
  useEffect(() => {
    let cancelled = false

    const numbers = []
    if (reduced) {
      numbers.push(1)
    } else {
      const step = window.innerWidth < 768 ? 2 : 1
      for (let n = 1; n <= FRAME_COUNT; n += step) numbers.push(n)
    }

    const imgs = new Array(numbers.length)
    const loaded = new Array(numbers.length).fill(false)
    framesRef.current = { numbers, imgs, loaded }

    const priority = new Set()
    for (let i = 0; i < numbers.length; i += 1) {
      if (i < 18 || i % 6 === 0 || i === numbers.length - 1) priority.add(i)
    }

    const fetchOne = (i, high) =>
      new Promise((resolve) => {
        const img = new Image()
        img.decoding = 'async'
        if (high) img.fetchPriority = 'high'
        const settle = () => {
          loaded[i] = img.naturalWidth > 0
          /* A frame that lands next to where the reader already is has to be
             painted now: the index has not moved, so nothing else would ask
             for it, and the canvas would go on showing a coarser neighbour. */
          if (loaded[i] && Math.abs(i - targetRef.current) <= 6) drawnRef.current = -1
          resolve()
        }
        img.onload = settle
        /* A failed frame counts as settled. One 404 should leave a gap in the
           sequence, not hang the loading state for ever. */
        img.onerror = settle
        img.src = frameSrc(numbers[i])
        imgs[i] = img
      })

    const wave = (list, high) => {
      let settled = 0
      return Promise.all(
        list.map((i) =>
          fetchOne(i, high).then(() => {
            settled += 1
            if (!cancelled && high) setPct(Math.round((settled / list.length) * 100))
          }),
        ),
      )
    }

    const first = [...priority]
    const rest = []
    for (let i = 0; i < numbers.length; i += 1) if (!priority.has(i)) rest.push(i)

    wave(first, true).then(() => {
      if (cancelled) return
      setReady(true)
      wave(rest, false)
    })

    return () => {
      cancelled = true
    }
  }, [reduced])

  /* ── Canvas ─────────────────────────────────────────────────────────
     Backing store scaled by DPR, capped at 2, and the context pre-scaled so
     everything below works in CSS pixels. */
  const sizeCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const w = canvas.clientWidth
    const h = canvas.clientHeight
    if (!w || !h) return
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = Math.round(w * dpr)
    canvas.height = Math.round(h * dpr)
    const ctx = canvas.getContext('2d')
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'
    ctxRef.current = ctx
    sizeRef.current = { w, h }
    drawnRef.current = -1
  }, [])

  /* Nearest frame that has actually decoded. With the priority wave in hand
     the worst case is three steps, so this never walks far. */
  const nearest = useCallback((i) => {
    const { imgs, loaded } = framesRef.current
    if (loaded[i]) return imgs[i]
    for (let d = 1; d < loaded.length; d += 1) {
      if (loaded[i - d]) return imgs[i - d]
      if (loaded[i + d]) return imgs[i + d]
    }
    return null
  }, [])

  const draw = useCallback(
    (i) => {
      const ctx = ctxRef.current
      const img = nearest(i)
      if (!ctx || !img) return
      const { w, h } = sizeRef.current

      /* Contain, never cover: at full explosion the parts reach within 36px
         of the safe window's edge, and cover would take them off it. */
      const s = Math.min(w / SAFE.w, h / SAFE.h, MAX_SCALE)
      const dw = SAFE.w * s
      const dh = SAFE.h * s
      const dx = (w - dw) / 2
      const dy = (h - dh) / 2

      ctx.clearRect(0, 0, w, h)
      ctx.drawImage(img, SAFE.x, SAFE.y, SAFE.w, SAFE.h, dx, dy, dw, dh)

      const n = framesRef.current.numbers[i]
      let feather = 0
      for (const [a, b] of TOP_CLIPPED) {
        if (n >= a - FEATHER_RAMP && n <= b + FEATHER_RAMP) {
          feather = Math.max(
            feather,
            Math.min(
              1,
              (n - (a - FEATHER_RAMP)) / FEATHER_RAMP,
              (b + FEATHER_RAMP - n) / FEATHER_RAMP,
            ),
          )
        }
      }
      if (feather > 0.01) {
        const band = dh * 0.09
        const g = ctx.createLinearGradient(0, dy, 0, dy + band)
        g.addColorStop(0, `rgba(${FIELD_RGB}, ${feather})`)
        g.addColorStop(0.55, `rgba(${FIELD_RGB}, ${feather * 0.42})`)
        g.addColorStop(1, `rgba(${FIELD_RGB}, 0)`)
        ctx.fillStyle = g
        ctx.fillRect(dx, dy, dw, band)
      }
    },
    [nearest],
  )

  /* ── Cache the animated nodes ───────────────────────────────────────
     Collected once so the scroll loop never queries the DOM. Each node
     carries the kind of move it makes and its rank in the stagger. */
  useEffect(() => {
    animRef.current = beatRefs.current.map((el) => {
      if (!el) return { el: null, items: [], parked: false }
      const items = [...el.querySelectorAll('[data-a]')].map((node) => ({
        el: node,
        kind: node.dataset.a,
        d: Number(node.dataset.d || 0) * 0.085,
      }))
      return { el, items, parked: false }
    })
  }, [])

  /* ── One progress value, everything downstream ────────────────────── */
  const update = useCallback(() => {
    const el = sectionRef.current
    if (!el) return

    const rect = el.getBoundingClientRect()
    const travel = el.offsetHeight - window.innerHeight
    const p = travel <= 0 ? 0 : clamp01(-rect.top / travel)
    if (p === lastPRef.current) return
    lastPRef.current = p

    /* Story progress. Everything the sequence tells runs off this and is
       finished at STORY_END; `p` itself carries on to 1 through the handoff. */
    const sp = clamp01(p / STORY_END)

    /* 1 — the camera. Linear across the whole sequence: the supplied frames
       already hold, spread and settle at their own pace, and re-timing them
       would be inventing camera movement that is not in the source. */
    const { numbers } = framesRef.current
    const i = Math.round(sp * (numbers.length - 1))
    targetRef.current = i
    if (i !== drawnRef.current) {
      drawnRef.current = i
      draw(i)
    }

    /* 2 — the type. Two beats are live at most; the rest are parked with a
       single visibility write and cost nothing after that. */
    let current = 0
    for (let s = 0; s < STAGES.length; s += 1) {
      const [a, b] = STAGES[s].at
      if (sp >= a) current = s

      /* A beat starts arriving just before it owns the progress and is gone
         by the time the next one is established, so the two always overlap
         rather than cut. The last beat never exits — the iris takes it. */
      /* The opening beat is a rest state, not an entrance. Its range starts at
         progress 0, so an entrance keyed off `a - 0.035` can never finish —
         the reader would arrive to a headline permanently a quarter of the
         way through its own reveal. Every other beat is approached from
         somewhere, and enters. */
      const tin = s === 0 ? 1 : smooth(at01(sp, a - 0.035, a + 0.075))
      const tout = s === STAGES.length - 1 ? 0 : smooth(at01(sp, b - 0.055, b + 0.01))

      const rec = animRef.current[s]
      const note = noteRefs.current[s]
      if (!rec || !rec.el) continue

      if (tin <= 0 || tout >= 1) {
        if (!rec.parked) {
          rec.parked = true
          rec.el.style.visibility = 'hidden'
          if (note) note.style.opacity = '0'
        }
        continue
      }
      if (rec.parked) {
        rec.parked = false
        rec.el.style.visibility = 'visible'
      }

      /* The beat taken as a whole, with no per-item stagger. The rack focus
         and the marginalia both move with the beat rather than within it. */
      const bx = smooth(clamp01(tout / 0.78))

      for (const it of rec.items) {
        const e = ease(clamp01((tin - it.d) / 0.62))
        const x = smooth(clamp01((tout - it.d * 0.4) / 0.78))

        if (it.kind === 'line') {
          /* Masked line: rises into its box on the way in, leaves through the
             top on the way out. The box clips both ends. */
          it.el.style.transform = `translate3d(0, ${(1 - e) * 135 - x * 135}%, 0)`
        } else if (it.kind === 'rule') {
          it.el.style.transform = `scaleX(${e * (1 - x)})`
        } else {
          it.el.style.opacity = `${e * (1 - x)}`
          it.el.style.transform = `translate3d(0, ${(1 - e) * 20 - x * 12}px, 0)`
        }
      }

      /* A rack focus as a beat hands over — the only blur on the page, and
         off entirely except during the ~5% of progress it is leaving. */
      rec.el.style.filter = bx > 0.004 ? `blur(${(bx * 4.5).toFixed(2)}px)` : ''

      if (note) {
        const e = ease(clamp01(tin / 0.62))
        note.style.opacity = `${e * (1 - bx)}`
        note.style.transform = `translate3d(0, ${(1 - e) * 14}px, 0)`
      }
    }
    setStage((v) => (v === current ? v : current))

    /* 3 — the construction lines, off the same value. */
    if (orbitRef.current) orbitRef.current.style.transform = `rotate(${sp * 42}deg)`
    if (arcRef.current) arcRef.current.style.strokeDashoffset = `${(1 - sp) * 620}`
    /* `p`, not `sp`: the rail reads the section, so it should still be
       travelling while the handoff plays rather than sitting full. */
    if (railRef.current) railRef.current.style.transform = `scaleY(${p})`

    /* 4 — the handoff. The composition contracts to a point behind a closing
       ring and leaves the reader on the field the homepage is already
       painted in, so the two sections meet on the same colour. */
    const iris = at01(p, STORY_END, 1)
    const content = contentRef.current
    const ring = ringRef.current
    if (content) {
      if (iris <= 0) {
        content.style.clipPath = ''
        content.style.opacity = ''
      } else {
        content.style.clipPath = `circle(${((1 - smooth(iris)) * 96).toFixed(2)}% at 50% 50%)`
        content.style.opacity = `${1 - iris * 0.35}`
      }
    }
    if (ring) {
      ring.style.opacity = iris > 0 && iris < 0.97 ? `${Math.min(1, iris * 3) * 0.5}` : '0'
      ring.style.transform = `translate(-50%, -50%) scale(${(1 - smooth(iris)) * 2.1 + 0.02})`
    }
  }, [draw])

  /* ── Wiring ─────────────────────────────────────────────────────────
     The scroll listener never draws. It schedules one frame, and only if one
     is not already pending, so a burst of scroll events collapses into a
     single pass. Inside that pass nothing is written unless the value it
     depends on has actually moved. */
  useEffect(() => {
    if (!ready) return undefined
    sizeCanvas()

    if (reduced) {
      draw(0)
      const onResizeOnly = () => {
        sizeCanvas()
        draw(0)
      }
      window.addEventListener('resize', onResizeOnly)
      return () => window.removeEventListener('resize', onResizeOnly)
    }

    lastPRef.current = -1
    update()

    const onScroll = () => {
      if (rafRef.current !== null) return
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null
        update()
      })
    }
    /* Resize forces a pass even though progress has not moved: the backing
       store was just reallocated, so the canvas is blank. */
    const onResize = () => {
      sizeCanvas()
      lastPRef.current = -1
      update()
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
  }, [ready, reduced, sizeCanvas, draw, update])

  const active = STAGES[stage]

  return (
    <section
      ref={sectionRef}
      className="mn-mi"
      data-reduced={reduced ? 'true' : 'false'}
      /* ── THE SPEED KNOB ──────────────────────────────────────────────
         The sticky stage is 100vh, so the distance the sequence is actually
         scrubbed across is (this - 100)vh. At 480 that is 380vh: STORY_END
         gives 319vh of it to the five beats and 240 frames — about 1.3vh per
         frame, roughly 64vh per beat — and the remaining 61vh to the closing
         iris. Raise it for a slower, more deliberate read; drop it towards
         360 if it starts to feel like work. To change only how long the
         handoff takes, move STORY_END instead. Nothing else needs touching:
         every value downstream is normalised to 0-1. */
      style={reduced ? undefined : { height: '480vh' }}
      aria-label="Media Nest opening sequence"
    >
      <div className="mn-mi__stage">
        <div className="mn-mi__content" ref={contentRef}>
          {/* Progress rail — the same value as everything else */}
          <div className="mn-mi__rail" aria-hidden>
            <i ref={railRef} />
          </div>

          <div className="mn-mi__grid">
            {/* ── Left: the story ──────────────────────────────────── */}
            <div className="mn-mi__story">
              <p className="mn-mi__count" aria-hidden>
                <span className="mn-mi__count-n">{active.n}</span>
                <span className="mn-mi__count-of">/ 05</span>
              </p>

              <div className="mn-mi__beats">
                {STAGES.map((s, si) => (
                  <article
                    key={s.n}
                    className="mn-mi__beat"
                    ref={(el) => {
                      beatRefs.current[si] = el
                    }}
                    aria-hidden={si === stage ? undefined : true}
                  >
                    <p className="mn-mi__eyebrow">
                      <i data-a="rule" data-d="0" aria-hidden />
                      <span data-a="fade" data-d="0">
                        {s.eyebrow}
                      </span>
                    </p>

                    <h2 className="mn-mi__head">
                      {s.lines.map((line, li) => (
                        <span className="mn-mi__mask" key={li}>
                          <span className="mn-mi__line" data-a="line" data-d={li + 1}>
                            {line.map((tok, ti) => (
                              <span key={ti} className={tok.a ? 'mn-mi__accent' : undefined}>
                                {tok.t}
                              </span>
                            ))}
                          </span>
                        </span>
                      ))}
                    </h2>

                    {s.sub && (
                      <p className="mn-mi__sub" data-a="fade" data-d={s.lines.length + 1}>
                        {s.sub}
                      </p>
                    )}

                    <p className="mn-mi__desc" data-a="fade" data-d={s.lines.length + 2}>
                      {s.desc}
                    </p>

                    {s.cta && (
                      <p className="mn-mi__ctarow" data-a="fade" data-d={s.lines.length + 3}>
                        <button type="button" className="mn-mi__cta" onClick={() => goHome(false)}>
                          <span>{s.cta}</span>
                          <Arrow />
                        </button>
                      </p>
                    )}
                  </article>
                ))}
              </div>

              {/* Reduced motion shows the opening beat and stops there, and that
                  beat carries no CTA of its own — so the way in is put here
                  rather than left to a scroll that is deliberately not being
                  asked for. */}
              {reduced && (
                <p className="mn-mi__ctarow">
                  <button type="button" className="mn-mi__cta" onClick={() => goHome(false)}>
                    <span>{STAGES[STAGES.length - 1].cta}</span>
                    <Arrow />
                  </button>
                </p>
              )}

              <p className="mn-mi__hint" aria-hidden>
                <span>{stage === STAGES.length - 1 ? 'Scroll to enter' : 'Scroll'}</span>
                <i />
              </p>
            </div>

            {/* ── Right: the camera ────────────────────────────────── */}
            <div className="mn-mi__camera">
              <canvas ref={canvasRef} className="mn-mi__canvas" aria-hidden />

              {/* Construction lines. Thin enough to read as registration marks
                  on a contact sheet rather than as an interface. */}
              <svg className="mn-mi__marks" viewBox="0 0 600 600" aria-hidden focusable="false">
                <g ref={orbitRef} className="mn-mi__orbit">
                  <circle cx="300" cy="300" r="236" />
                  <circle cx="300" cy="300" r="196" className="mn-mi__dash" />
                </g>
                <circle
                  ref={arcRef}
                  className="mn-mi__arc"
                  cx="300"
                  cy="300"
                  r="256"
                  pathLength="620"
                  strokeDasharray="620"
                  strokeDashoffset="620"
                />
                <path className="mn-mi__cross" d="M300 44v24M300 532v24M44 300h24M532 300h24" />
              </svg>

              {/* Marginalia — one note per beat, stacked in the same cell */}
              <div className="mn-mi__notes" aria-hidden>
                {STAGES.map((s, si) => (
                  <p
                    key={s.n}
                    className="mn-mi__note"
                    ref={(el) => {
                      noteRefs.current[si] = el
                    }}
                  >
                    {s.note.map((l) => (
                      <span key={l}>{l}</span>
                    ))}
                  </p>
                ))}
              </div>
            </div>
          </div>

          <i className="mn-mi__ring" ref={ringRef} aria-hidden />
        </div>

        {/* ── Loading ──────────────────────────────────────────────── */}
        {!ready && (
          <div className="mn-mi__load" role="status" aria-live="polite">
            <p className="mn-mi__load-mark">Media Nest</p>
            <span className="mn-mi__load-bar" aria-hidden>
              <i style={{ transform: `scaleX(${pct / 100})` }} />
            </span>
            <p className="mn-mi__load-label">Loading visual story</p>
          </div>
        )}

        {/* A 480vh opening needs a way past it. Instant, not smooth: a smooth
            scroll over this distance is not a skip. */}
        {!reduced && (
          <button type="button" className="mn-mi__skip" onClick={() => goHome(true)}>
            Skip intro
          </button>
        )}
      </div>
    </section>
  )
}
