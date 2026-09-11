# Media Nest — Design & Engineering Plan

Status: **plan only, nothing implemented from this document yet.**
Audited against the working tree on 2026-09-11 (after commit `ba9db0a`).

---

## 1. Audit of the existing frontend

### What actually runs

`main.jsx → src/App.jsx` renders a single page, in this order:

| # | Section | id | State | Lines | Motion |
|---|---------|----|-------|-------|--------|
| — | Header | — | **Redesigned** | 325 | framer-motion |
| 1 | Hero | `home` | **Redesigned** | 616 | framer-motion |
| 2 | About | `about` | Original | 50 | none |
| 3 | WhatWeOffer | — | Original | 39 | none |
| 4 | Services | `services` | Original | 54 | none |
| 5 | Portfolio | `projects` | Original | 46 | none |
| 6 | WhyChoose | — | Original | 58 | none |
| 7 | Team | `team` | Original | 68 | none |
| 8 | Testimonials | `video` | Original | 50 | none |
| 9 | Clients | `clients` | Original | 66 | none |
| 10 | Contact | `contact` | Original | 74 | none |
| 11 | Footer | — | Original | 7 | none |

CSS: `globals.css` (379) + `hero.css` (694) + `nav.css` (649) = 1,722 live lines.
Bundle today: **402 KB JS / 127 KB gzip**, 33.7 KB CSS.

### Problems discovered

**P1 — The page is split in half, visually.**
Two of twelve sections carry the camera/lens design language. The other ten are
the original 2019-era WordPress reconstruction: flat cards, centred text, no
motion. A visitor meets a cinematic hero and then falls off a cliff at `#about`.
This is the single biggest quality problem and everything else is secondary.

**P2 — 91% of tracked source is dead code.**
206 tracked files under `src/`, **18 reachable** from `main.jsx`. Two complete
parallel scaffolds are committed but unreachable:

```
src/app          4      src/components/common       20
src/pages       24      src/components/layout       20
src/data        11      src/components/sections     56
src/utils        3      src/components/portfolio    16
src/assets      14      src/components/ui           16
src/styles       7  (variables/typography/animations.css imported by nothing)
```

Consequences: `react-router-dom` stays in `dependencies` only because dead files
import it; search and refactoring are noisy; new contributors cannot tell which
`Services.jsx` is real (there are two).

**P3 — 7.6 MB of images shipped; the optimised set is unused.**
`public/images` (7.6 MB) is referenced 29 times. `public/media` (848 KB, WebP,
already generated) is referenced **zero** times. `CSI-Logo-Round-1.png` alone is
**4.7 MB** — a client logo. This is the largest, cheapest performance win available.

**P4 — Heading hierarchy is broken.**
Exactly one `<h1>` (hero) and **zero `<h2>`** in the whole page. Section titles
are `<div class="rotate-title">`, `<div class="clients-title">`,
`<div class="section-heading">`. Screen-reader users get no document outline and
search engines see a page with no subject structure.

**P5 — SEO head is bare.**
`og:` 0, `twitter:` 0, `canonical` 0, JSON-LD 0. Only `<title>` + `description`.

**P6 — Dead dependencies.**
`tailwindcss` + `@tailwindcss/vite` (0 active imports), `lenis` (0 active
imports — installed for smooth scroll, never wired), `react-router-dom` (dead
code only). `puppeteer` + `website-scraper` sit in `dependencies` rather than
`devDependencies`, so they are declared as production deps.

**P7 — `Hero.jsx` is 616 lines** holding six independent concerns (lens stack,
iris, focus, flare, aberration, exposure readout) plus the info banner.

### What is already good — do not break

- Camera/lens design language across nav + hero is genuinely distinctive and
  brand-rooted. **This is the through-line for everything else.**
- Accessibility discipline in the new components: 121 `aria-*`, `focus-visible`
  rings, `sr-only`, `MotionConfig reducedMotion="user"` at the root, and every
  cursor-driven effect gated behind reduced-motion + pointer checks.
- The theme tokens (`--dark-blue #1a1369`, `--orange #e95523`, Roboto +
  Roboto Slab) are consistent and must be preserved.
- CSS namespacing (`.mn-hero`, `.mn-nav`) means new work never collides with the
  legacy `globals.css` rules.

---

## 2. Visual direction

**One idea, expressed everywhere: the interface is a camera.**

The nav and hero already establish it. Rather than invent a second language, the
remaining ten sections extend the same optical vocabulary:

- **Viewfinder brackets** mark whatever is active or focused.
- **Rack focus** — hovering one item defocuses its siblings.
- **Aperture / iris** for reveals and transitions.
- **Frame counters, f-stops, exposure readouts** as technical micro-type.
- **Monochrome imagery**, with orange as the only colour.
- **Lens rings, edge ticks, the MN arch motif** as recurring geometry.

**Surface decision: navy throughout.** The original alternated navy with
`#f5f5f5` full-bleed sections. That alternation is dropped — the paper tone
survives only as an *accent* (a hairline, a small panel, a stat tile), never as
a section background. Reasons: a dark continuous field is what lets the
monochrome imagery and the orange accent carry the page, the lens/aperture
geometry reads only on dark, and alternating light bands would repeatedly reset
the cinematic mood the hero establishes. Contrast is managed with three navy
depths (`#1a1369` / `#120d4f` / `#232a6b`-class tints) instead of switching to
white.

This is defensible because the client *is* a photography and cinematography firm.
It is not decoration borrowed from a trend.

### Anti-patterns (explicitly rejected)

Three-column feature card rows · centred hero + 3 cards · repeated rounded cards ·
purple/blue tech gradients · glassmorphism everywhere · letter-scramble hover
(now a cliché) · curved/arc nav · full-screen desktop menu · decorative motion
with no meaning.

---

## 3. Design system

### 3.1 Tokens (extend, do not replace)

```
Surfaces   navy      #1a1369   (primary)
           deep      #120d4f   (depth, shutter)
           paper     #f5f5f5   (light sections — already used)
Accent     orange    #e95523   (single accent)
           coral     #ec7e69   (gradient partner only)
Ink        white     #ffffff / rgba(255,255,255,.78) body / .38 micro
Motion     ease      cubic-bezier(0.16, 1, 0.3, 1)     "house" slow-out
           easeInOut cubic-bezier(0.83, 0, 0.17, 1)    curtains, wipes
           spring    stiffness 60 / damping 18         cursor-followers
```

Currently these live per-file. **Promote to one `src/styles/tokens.css`**, imported
once — replacing the three dead stylesheets.

### 3.2 Typography system

Two families only (both already loaded, no new network cost):

| Role | Face | Treatment |
|---|---|---|
| Display | Roboto 700 | `clamp(2.35rem, 5.3vw, 4.9rem)`, tracking `-0.022em` |
| Section title | Roboto 700 | `clamp(2rem, 4vw, 3.4rem)` |
| Edge title | Roboto 700 | vertical, outlined (`-webkit-text-stroke`), fills on scroll |
| Body | Roboto 300 | 15px / 1.85 |
| Label | Roboto 500 | 11px, uppercase, `letter-spacing: 2.6px` |
| Technical | **Roboto Slab** | italic + `tabular-nums` — counters, f-stops, indices |

The **contrast rule**: every section pairs an oversized display element with
technical micro-type. Nothing sits in the middle. Roboto Slab italic is reserved
exclusively for numerals and technical readouts — that reservation is what makes
it read as a system rather than a font choice.

### 3.3 Component system

Extract from the two finished sections into shared primitives:

```
src/components/primitives/
  Magnetic.jsx        exists — reuse as-is
  Corners.jsx         viewfinder brackets (from Header)
  MaskText.jsx        word/line unmask (parent owns the observer — see §7)
  RevealImage.jsx     clip-path curtain + counter-scale
  EdgeTitle.jsx       vertical outlined title that fills on scroll
  Readout.jsx         ISO/f-stop/frame-counter micro-type
  Marquee.jsx         velocity-reactive ticker
```

Then split `Hero.jsx` (616 lines) into `Hero/` with `LensStack`, `Iris`,
`Flare`, `InfoBanner` as siblings.

---

## 4. Section architecture

| Section | Composition | Primary device |
|---|---|---|
| **About** | Asymmetric bento; tall monochrome panel spanning 2 rows; unequal pillar cards; stats strip | EdgeTitle "ABOUT" fills on scroll |
| **What We Offer** | Velocity-reactive marquee of the 9 disciplines, between hairlines | Marquee + organic divider |
| **Services** | Sticky left rail (oversized "SERVICES" + active numeral + tags) / scrolling right image cards | Sticky scroll + live index |
| **Portfolio** | Gapless masonry, hairline separators, unequal tiles | Image shrinks inside tile; dark panel rises with tracked-out name |
| **Why Choose Us** | Disclosure list; oversized outlined numerals that fill when open | Accessible accordion, hover as shortcut |
| **Founders** | Editorial spread; surname set enormous overlapping the portrait; alternating sides | Grain overlay + offset frame |
| **Testimonials** | Minimal slider behind a glowing orange quote mark | Direction-aware slide |
| **Clients** | Gapless logo wall, monochrome silhouettes | Illuminate to full colour + spring pop |
| **Contact** | Bottom-border-only inputs; circular submit morphing to a check | Spark burst on success |
| **Footer** | Oversized outlined wordmark, horizon glow | Unmask on scroll |

Content is already inventoried and verified (services, founders, clients,
testimonials, contact details) — no invention required.

---

## 5. Animation system

### Library decision — **stay on Framer Motion; do not add GSAP.**

Framer Motion is already used in 24 files and handles everything in this plan:
`useScroll` progress, `useTransform`, springs, `layoutId`, `AnimatePresence`,
variant propagation, and `MotionConfig reducedMotion`. Adding GSAP + ScrollTrigger
would mean **two motion runtimes** (~+60 KB gzip) and two easing vocabularies for
capability we already have. GSAP would only be justified for complex timeline
scrubbing that we do not need.

### Lenis — **removed (decided).**

`lenis` was installed with zero imports and has been uninstalled. The bundle did
not change, confirming it was fully dead.

Consequence: all scroll-driven work runs on **native scroll** via Framer's
`useScroll`. This is not a downgrade — it avoids a scroll-hijack layer, keeps
keyboard/spacebar/find-in-page scrolling untouched, and removes a class of
mobile bugs. The only thing lost is interpolated "buttery" scroll easing; the
progress-mapped animations themselves are unaffected because they read scroll
*position*, not scroll velocity.

### Duration & easing scale

```
120ms   instant feedback (colour, focus ring)
350ms   small state change (icon, tag)
550ms   hover choreography (roll-up swap, liquid fill)
900ms   entrance (fade/rise)
1150ms  display text unmask
1200ms  curtain / clip-path reveal
Stagger 60–90ms between siblings; never more than 8 in one chain
```

### Per-animation specification

| Animation | Trigger | Initial → Final | Dur / Easing | Mobile | Reduced motion |
|---|---|---|---|---|---|
| Section title unmask | in-view, once | `y:115%` → `0` per word | 1150ms / house | same | opacity only |
| EdgeTitle fill | scroll progress | `inset(0 0 100% 0)` → `inset(0)` | scrub | hidden <1024px | static outline |
| Image curtain | in-view, once | clip `inset(0 0 100% 0)` + `scale 1.22` → `inset(0)` + `1` | 1200ms / easeInOut | same | opacity only |
| Masonry tile hover | pointer | image `scale 1` → `.94`; panel `y:100%` → `0` | 850ms / house | tap = navigate, no hover | no transform |
| Services sticky rail | scroll | rail pinned; index swaps on viewport centre | scrub | un-pins, cards stack | un-pinned |
| Accordion open | click / hover / focus | `height 0` → `auto` | 600ms / house | click only | instant |
| Logo illuminate | pointer | `brightness(0) invert` → none, `scale 1.08` | 600ms spring | static colour | colour, no pop |
| Submit morph | form submit | circle → check + 12-spark burst | 550ms / house | same | check, no burst |
| Marquee | rAF + scroll velocity | continuous x, direction flips on scroll-up | — | slower, no velocity | static row |
| Founder name parallax | scroll | `y 22%` → `-22%` | scrub | reduced to 8% | none |

**Rule:** every animation above either reveals structure, signals state, or
expresses the camera metaphor. Anything that does none of the three is cut.

---

## 6. Scroll storytelling architecture

Three pinned moments only — more than three and pinning becomes tiring:

1. **Services sticky rail** — left pinned while right column travels.
2. **Portfolio reveal ladder** — staggered curtain reveals, not pinned.
3. **Founders parallax spread** — name and portrait drift in opposition.

Deliberately **not** included: horizontal scroll sections (they fight touch
scrolling and break keyboard navigation), and full-page scroll-jacking.

**Exposure thread.** The nav's frame counter (`03/08`) and the hero's f-stop
readout continue through the page: the f-number stops down as you scroll
(f/1.8 → f/16). This is the connective tissue that makes ten sections read as
one roll of film rather than ten blocks.

### The camera-explode intro (deferred, not in this plan's scope)

Previously discussed: a scroll-driven exploded-camera sequence before the hero.
**Blocked on assets**, not code. It needs 60–120 consistent frames (Blender
render preferred — AI-generated frames flicker frame-to-frame, which is exactly
the artefact to avoid). Revisit when frames exist; the scroll mechanism itself is
a solved problem (sticky stage + progress-mapped frame index).

---

## 7. Text animation strategy

Word-level unmask for display type; whole-block fade-rise for body copy.
Character-level splitting is rejected — it multiplies DOM nodes for a gain
invisible at body sizes.

**Two hard-won rules, already learned in this codebase — do not regress:**

1. **The viewport trigger must live on the unclipped parent, never on the moving
   child.** A child that starts translated outside its own `overflow:hidden` box
   is 100% clipped, IntersectionObserver reports zero intersection, and
   `whileInView` can never fire — it is hidden because it hasn't animated and
   can't animate because it's hidden. Parent owns the observer; children animate
   via variant propagation.
2. **The space between words must be a real text node *between* the clipped
   boxes.** A trailing space inside an `inline-block` is trimmed by the CSS
   white-space algorithm and words run together ("Framesthatcarryabrand").
   Margins would fix it visually but break copy-paste and screen-reader word
   boundaries.

Also: descenders need `padding-bottom` + equal negative `margin-bottom` on the
clipping box, or `g`/`y` get sliced.

---

## 8. Parallax, graphics and 3D

**Parallax** — three depths maximum per section (plate / motif / content), driven
by one pointer listener per section feeding normalised `-0.5…0.5` motion values,
so depth is resolution-independent. Scroll parallax uses `useScroll` progress.
Transform and opacity only.

**Graphics** — all procedural, zero network cost: inline-SVG turbulence grain,
lens rings, MN arch motif, orange edge ticks, organic SVG dividers.

**3D — recommendation: no WebGL.**

CSS 3D (`perspective` + `preserve-3d` + `rotateX/rotateY`) already delivers real
perspective depth in the hero at zero bundle cost. Three.js + R3F would add
~150 KB gzip plus GPU load. More decisively: **every image in this project is now
low-resolution monochrome** (370×500 to 1300×1300, recovered from a baked-in blue
duotone). A photoreal WebGL glass object next to that imagery would look pasted
on, not integrated. If real 3D is ever wanted, depth-map 2.5D displacement of an
actual photograph is the better fit for a photography brand — but it needs a
depth map and a real high-resolution photo first.

---

## 9. Responsive strategy

| Breakpoint | Behaviour |
|---|---|
| ≥1440 | Full experience; nav tagline visible |
| 1080–1439 | Tagline hidden; nav links + CTA remain |
| <1080 | Nav collapses to iris sheet; edge titles hidden; sticky rails un-pin |
| <768 | Single column; masonry → stacked; banner 4→1 column |
| <400 | Type scale steps down |

Mobile is designed, not shrunk. Specifically disabled below 1080px: cursor-driven
effects (no cursor), focus-pull blur, magnetic hover, edge ticks (they cut through
text — already fixed once), scroll cue, and sticky pinning.

---

## 10. Accessibility strategy

Non-negotiable, and mostly already in place:

- `MotionConfig reducedMotion="user"` at the root. Framer's default is `"never"`,
  i.e. it **ignores** the OS setting — this must stay explicit.
- Every decorative layer `aria-hidden`; duplicated hover text `aria-hidden` so
  labels are not announced twice.
- Disclosure widgets are real `<button aria-expanded aria-controls>` with hover
  as a *shortcut*, never the only way in.
- Carousel: arrow-key support, `aria-live` slide announcements, visible focus.
- Form: `aria-invalid`, `aria-describedby`, focus moved to first error, real
  labels (not placeholders).
- Focus-pull blur is applied to *siblings on hover only* — never a resting blur
  on all labels, which would be a legibility failure.
- **Fixes needed:** heading hierarchy (P4) — one `<h1>`, an `<h2>` per section,
  edge titles remain decorative `aria-hidden` duplicates.

---

## 11. SEO strategy

Restore and extend the head (P5): `og:*`, `twitter:card`, `canonical`,
`ProfessionalService` JSON-LD (name, description, email, telephone, areaServed,
openingHours), and a `preload` for the hero image.

Structural work: real `h1`/`h2` hierarchy; descriptive `alt` on all imagery
(currently 26 `alt=` attributes but several are empty on meaningful images);
crawlable text — **no content may exist only inside an animation's final state**,
so all copy renders in the DOM at initial paint and animation only transforms it.

---

## 12. Performance strategy

Ordered by value:

1. **Switch to `/media` WebP and delete the 4.7 MB logo from the served path.**
   7.6 MB → ~0.85 MB. Single highest-value change in the project. (P3)
2. **Dead files: keep, but quarantine.** The `src/app` + `src/pages` router
   scaffold is retained for a future multi-page version (decided). It is
   unreachable from `main.jsx`, so it costs **zero** runtime bytes — Vite
   tree-shakes from the entry graph. The cost is developer confusion, so it gets
   moved under `src/future/` with a README explaining that it is a parked
   multi-page scaffold, and the duplicate nested component library
   (`src/components/{common,layout,sections,portfolio,ui}`, 128 files) is
   deleted — it duplicates the live flat components and is the actual source of
   "which `Services.jsx` is real?". (P2)
3. **Drop dead deps** — `tailwindcss`, `@tailwindcss/vite`; move
   `puppeteer`/`website-scraper` to `devDependencies`. `react-router-dom`
   **stays**, since the parked multi-page scaffold needs it. `lenis` already
   removed. (P6)
4. `width`/`height` on every `<img>` to eliminate layout shift; `loading="lazy"`
   + `decoding="async"` below the fold; `fetchpriority="high"` on the hero plate.
5. Keep animations to `transform`/`opacity`. The two exceptions — the hero focus
   mask and the iris mask — animate `mask-image`, which repaints. Both are
   short-lived or gated to fine pointers; **measure them on a low-end device
   before shipping** and drop the focus mask if it costs frames.
6. Code-split: `manualChunks` for `framer-motion` so it caches separately.
7. Budget: **< 150 KB gzip JS, < 1 MB images, LCP < 2.5 s.** Today: 127 KB JS
   (passing) and 7.6 MB images (failing badly).

---

## 13. Implementation sequence

Each step ships independently and leaves the site working.

| Phase | Work | Why here |
|---|---|---|
| **0** | Swap to `/media` images; delete dead files + deps; extract `tokens.css` | Cheap, high value, de-risks everything after |
| **1** | Extract primitives from Hero/Header; split `Hero.jsx` | Every later section consumes these |
| **2** | Fix heading hierarchy + SEO head | Small, and blocks nothing later |
| **3** | **About + What We Offer** | First section after the hero — the cliff in P1 |
| **4** | **Services** (sticky rail) | Most complex layout; do it while fresh |
| **5** | **Portfolio** (masonry) | Highest visual payoff |
| **6** | **Why Choose Us + Founders** | Editorial pair, shared devices |
| **7** | **Testimonials + Clients** | Light sections |
| **8** | **Contact + Footer** | Closing moment |
| **9** | Wire Lenis; exposure thread across sections | Needs all sections present to tune |
| **10** | Audit pass: Accessibility Auditor + Performance Benchmarker + UI Finish-Gate Reviewer | Verify against the budgets above |

Phase 0 and 3 are the two that change how the site feels most. Phase 0 is a few
hours; P1 is the reason the site currently reads as unfinished.

---

## 14. Decisions — resolved 2026-09-11

1. **Lenis** — ✅ removed. Native scroll + Framer `useScroll`. (§5)
2. **Dead code** — ✅ keep the `src/app`/`src/pages` router scaffold for a future
   multi-page build; move it to `src/future/` and delete only the duplicate
   nested component library. `react-router-dom` stays. (§12)
3. **Surfaces** — ✅ navy throughout; paper tone as accent only, never a section
   background. Contrast via three navy depths. (§2)
4. **Camera-explode intro** — ⏳ blocked on assets. Requirements specified in
   §15 below; needs a source decision before any code.

---

## 15. Camera-explode intro — requirements

A scroll-driven sequence where an upward-facing camera disassembles, fully
explodes, reassembles, then transitions into the lens and out to the hero.
Reversible on scroll-up, position-locked (not time-based).

**The scroll mechanism is not the hard part.** A sticky stage + progress-mapped
frame index is well-understood and already proven in this codebase (the hero's
`useScroll` → `useTransform` chain does the same thing). The blocker is entirely
the frames.

### 15.1 What must exist before any code

**60–120 frames**, visually identical except for part positions. Below ~60 the
motion steps visibly; above ~120 the weight stops being worth it.

| Source | Consistency | Cost | Verdict |
|---|---|---|---|
| **Blender render** | Perfect — one model, one light rig, one camera; only part transforms change | 3D model + setup time | **Recommended** |
| AI image generation | Poor — each frame is generated independently, so body, scratches and sky drift frame-to-frame and read as **flicker** | Cheapest | Rejected: flicker is precisely the artefact to avoid |
| Real photography | Perfect, but needs a disassembled camera, copy stand and compositing per frame | Highest | Not proportionate |

### 15.2 Blender route — concrete requirements

1. **A DSLR/mirrorless 3D model** with separable parts (body, lens barrel,
   individual glass elements, mount ring, grip, dials, sensor board). Sketchfab
   and BlenderKit both have suitable models, free and paid. *A single welded
   mesh is useless* — the parts must be separate objects.
2. **An HDRI** for the sky/environment lighting (the reference frames show an
   upward view against cloud). Poly Haven has free ones.
3. **Blender installed.** I can write the Python script that positions parts
   along their explode vectors, keyframes the disassemble → explode → reassemble
   arc, and batch-renders the sequence — so the manual work is limited to
   importing the model and pointing the script at the part names.
4. **Render budget**: 100 frames at 1600×1000, EEVEE, is minutes on a modern
   GPU; Cycles would be hours. EEVEE is sufficient here.

### 15.3 Frame delivery spec

```
Format      WebP, quality ~0.80
Size        1600×1000 desktop  (mobile set at 800×500, or reuse every 3rd frame)
Naming      frame_000.webp … frame_119.webp   (zero-padded, sequential)
Location    public/sequence/
Weight      ~60–90 KB per frame → 6–9 MB for 100 frames
```

That weight is 7–10× the entire current image budget target (§12: <1 MB), so it
must be a deliberate exception with its own loading strategy, not folded into the
normal budget.

### 15.4 What gets built (once frames exist)

- **Sticky stage** — a ~500–700vh tall section containing a `position: sticky`,
  viewport-height `<canvas>`.
- **Canvas draw, not `<img>` swapping.** Swapping `src` causes decode jank and
  layout work per frame; decoding all frames once into an array and drawing to
  canvas is the only approach that holds 60fps.
- **Preload gate with progress** — the sequence cannot start until a threshold
  of frames is decoded. This is where a brand-consistent loading counter goes
  (the aperture/iris language already exists for it).
- **Scroll progress → frame index**, clamped, so scroll-up runs it backwards for
  free.
- **Copy overlays** keyed to scroll ranges ("EVERY BRAND HAS A STORY" → "IDEAS
  CAPTURED IN LAYERS" → …), unmasking with the existing text system.
- **Lens-to-hero handoff** — the final frames push into the lens barrel and the
  iris opens onto the hero, reusing the hero's existing aperture reveal.

### 15.5 Non-negotiable constraints

- **SEO**: the `<h1>` and hero copy must exist in the DOM at initial paint. The
  intro may sit visually before the hero, but must not gate content behind
  scroll for crawlers. (§11)
- **Reduced motion**: static first frame + the copy, sequence skipped entirely.
- **Mobile**: a 6-screen scroll-jack before any content is a known drop-off
  pattern. Either a reduced frame set or a single poster frame + straight to
  hero. Decide explicitly; do not ship the desktop experience shrunk.
- **Skip control**: a visible, keyboard-reachable "Skip intro" that jumps to
  `#home`.
- **Cost of placement**: putting this before the hero pushes the actual content
  5–6 screens down for every returning visitor. Consider showing it once
  (session-flagged) rather than on every visit.

### 15.6 Cheaper alternative — layered 2.5D

If the frame sequence is not worth the asset investment: take **one** high-quality
camera render/photo, cut it into 8–12 transparent PNG layers (lens rings, barrel,
body, dials, mount), and drive each layer's transform from scroll inside the
existing CSS-3D `perspective` stage.

- ~400–600 KB total instead of 6–9 MB
- No preload gate, no canvas
- Reversible and scroll-locked exactly the same way
- Limitation: convincing only within a modest rotation range — it cannot truly
  orbit the camera, and a full explode/reassemble arc is out of reach

This delivers roughly 70% of the impact for roughly 10% of the asset cost, and
reuses machinery that already exists in the hero.

### 15.7 Decision needed

1. Blender frame sequence (§15.2), or layered 2.5D (§15.6)?
2. If Blender: can a model + HDRI be sourced, and is Blender installable? I write
   the explode/render script either way.
3. Desktop-only, or a reduced mobile variant?
4. Play once per session, or on every visit?
