/**
 * The disciplines shown in the portfolio grid, and what sits behind each one.
 *
 * The content now comes from the CMS -- name, meta word, cover and the films
 * or stills behind the tile are all editable. What stays here is the grid.
 *
 * All of it was originally recovered from the old site. Five tiles carried a
 * film and three carried stills. The films were never really missing: on
 * medianest.co.in each one lived inside an Elementor `data-elementor-lightbox`
 * JSON attribute rather than an anchor or an iframe, which is why looking at
 * the markup for videos finds nothing. All six were checked against YouTube's
 * oembed endpoint and are live on the Media NEST TV channel. The stills came
 * from the old uploads folder, re-encoded to WebP at 1800px, which took them
 * from 3.8MB to 905KB. They are all seeded into the database now.
 *
 * This lives outside the component because two places need it -- the grid
 * itself and the hero's showreel button.
 */

import { DISCIPLINES } from './content'

/**
 * The eight spans, in grid order.
 *
 * **Deliberately not editable, and deliberately not stored per discipline.**
 * A span belongs to a grid position, not to a discipline: the first slot is
 * 6x2 whoever occupies it. These eight tessellate the 12-column grid exactly
 * across four rows -- 6+6, then 6+3+3, then 5+3+4, with the two tall tiles
 * carrying into the fourth row. Change one and the grid grows a hole.
 *
 * It also caps the section at eight tiles. The API already sends only the
 * first eight published disciplines; this is the same limit stated where the
 * layout can be seen, so the two cannot quietly disagree.
 */
const SPANS = ['6x2', '6x1', '3x1', '3x1', '5x2', '3x2', '4x1', '4x1']

export const WORK = DISCIPLINES.slice(0, SPANS.length).map((tile, i) => ({
  ...tile,
  span: SPANS[i],
}))

/**
 * What the hero's "Watch Showreel" button plays.
 *
 * The button used to scroll to `#video`, which is the id the Testimonials
 * section happens to carry -- a leftover from the Video nav item that was
 * removed. It pointed at a carousel of written quotes. Cinematography is the
 * closest thing the firm has to a reel: it is the one film that is about the
 * work in general rather than a single job.
 *
 * Derived rather than restated, so it cannot drift from the grid. The fallback
 * matters now that the grid is editable -- rename or unpublish Cinematography
 * and a hardcoded lookup would hand the hero `undefined`, so it falls back to
 * whatever tile does carry a film rather than breaking the button.
 */
const hasFilm = (w) => w.media.some((m) => m.type === 'video')

export const SHOWREEL =
  WORK.find((w) => w.id === 'cinematography' && hasFilm(w)) ?? WORK.find(hasFilm) ?? null
