/**
 * The eight disciplines shown in the portfolio grid, and what sits behind
 * each one.
 *
 * All of it was recovered from the old site. Five tiles carried a film and
 * three carried stills. The films were never really missing: on
 * medianest.co.in each one lived inside an Elementor `data-elementor-lightbox`
 * JSON attribute rather than an anchor or an iframe, which is why looking at
 * the markup for videos finds nothing. All six were checked against YouTube's
 * oembed endpoint and are live on the Media NEST TV channel. The stills came
 * from the old uploads folder, re-encoded to WebP at 1800px, which took them
 * from 3.8MB to 905KB.
 *
 * This lives outside the component because two places need it -- the grid
 * itself and the hero's showreel button -- and a YouTube id copied into two
 * files is a YouTube id that will eventually disagree with itself. It is also
 * the seam the backend will replace: see BACKEND-PLAN.md, where this becomes
 * Discipline + DisciplineVideo + DisciplineImage.
 *
 * `span` is not editorial. It is paired with each cover image's real pixel
 * size so nothing is upscaled into mush, so it has to be recomputed if a
 * cover is ever swapped.
 */

const stills = (files, alt) =>
  files.map((src) => ({ type: 'image', src: `/media/${src}`, alt }))

export const WORK = [
  {
    id: 'photography',
    name: 'Photography',
    meta: 'Stills',
    img: '/media/photography.webp',
    span: '6x2',
    media: stills(
      ['gal-photography-1.webp', 'gal-photography-2.webp', 'gal-photography-3.webp'],
      'Sports photography by Media Nest',
    ),
  },
  {
    id: 'cinematography',
    name: 'Cinematography',
    meta: 'Motion',
    img: '/media/cinematography_main.webp',
    span: '6x1',
    media: [{ type: 'video', id: 'Cldlv3d36Jc', title: 'Cinematography' }],
  },
  {
    id: 'interview',
    name: 'Interview',
    meta: 'Voice',
    img: '/media/INTERVIEW.webp',
    span: '3x1',
    media: [{ type: 'video', id: 'tz4CPFl_YfU', title: 'Interviews' }],
  },
  {
    id: 'live-stream',
    name: 'Live Stream',
    meta: 'Broadcast',
    img: '/media/LIVE-STREAM.webp',
    span: '3x1',
    media: [{ type: 'video', id: 'EDtsbsAljU8', title: 'Live Stream' }],
  },
  {
    id: 'event',
    name: 'Event',
    meta: 'Coverage',
    img: '/media/EVENT.webp',
    span: '5x2',
    media: [{ type: 'video', id: 'fU1PKUO0FyI', title: 'Event' }],
  },
  {
    id: 'graphic-design',
    name: 'Graphic Design',
    meta: 'Identity',
    img: '/media/graphic-1.webp',
    span: '3x2',
    media: stills(
      ['gal-graphic-1.webp', 'gal-graphic-2.webp'],
      'Graphic design work by Media Nest',
    ),
  },
  {
    id: 'video-edit',
    name: 'Video Edit',
    meta: 'Post',
    img: '/media/video-edit.webp',
    span: '4x1',
    media: [
      { type: 'video', id: 'wGwSSFfbcEs', title: 'Football Teaser' },
      { type: 'video', id: 'kvHo80ZIUxU', title: 'Hockey Teaser' },
    ],
  },
  {
    id: 'digital-marketing',
    name: 'Digital Marketing',
    meta: 'Reach',
    img: '/media/new_DIGITAL-MARKETING.webp',
    span: '4x1',
    media: stills(
      ['gal-digital-1.webp', 'gal-digital-2.webp'],
      'Digital marketing work by Media Nest',
    ),
  },
]

/**
 * What the hero's "Watch Showreel" button plays.
 *
 * The button used to scroll to `#video`, which is the id the Testimonials
 * section happens to carry -- a leftover from the Video nav item that was
 * removed. It pointed at a carousel of written quotes. Cinematography is the
 * closest thing the firm has to a reel: it is the one film that is about the
 * work in general rather than a single job.
 *
 * Derived rather than restated, so it cannot drift from the grid.
 */
export const SHOWREEL = WORK.find((w) => w.id === 'cinematography')
