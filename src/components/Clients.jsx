import { motion } from 'framer-motion'
import MaskText from './primitives/MaskText'
import FloatField from './primitives/FloatField'
import { EASE, VIEWPORT } from '@/lib/motion'
import '../styles/clients.css'

/* `sector` is what the organisation is, not a claim about the work. Logos
   run in full colour here: several of these marks are filled badges whose
   detail is carried entirely by hue, and desaturating them collapsed each
   one into a solid disc. */
const CLIENTS = [
  {
    id: 'ibsf',
    name: 'IBSF',
    sector: 'International Federation',
    logo: '/media/IBSF-Logo.webp',
    href: 'https://www.instagram.com/ibsf.media/',
  },
  {
    id: 'acbs',
    name: 'ACBS',
    sector: 'Asian Confederation',
    logo: '/media/ACBS-LOGO.webp',
    href: 'https://www.instagram.com/acbsmedia/',
  },
  {
    id: 'pabsa',
    name: 'PABSA',
    sector: 'Pan American Association',
    logo: '/media/PABSA-LOGO.webp',
    href: 'https://www.instagram.com/pabsaofficial/',
  },
  {
    id: 'ogq',
    name: 'OGQ',
    sector: 'Olympic Gold Quest',
    logo: '/media/OGQ_logo_dark.webp',
    href: 'https://www.ogq.org',
  },
  {
    id: 'iocl',
    name: 'Indian Oil',
    sector: 'Energy',
    logo: '/media/indianoil.webp',
    href: 'https://iocl.com',
  },
  {
    id: 'oil',
    name: 'Oil India',
    sector: 'Energy',
    logo: '/media/OIL.webp',
    href: 'https://www.oil-india.com',
  },
  {
    id: 'pspb',
    name: 'PSPB',
    sector: 'Sports Promotion Board',
    logo: '/media/PSPB-Logo-White-Background.webp',
    href: 'https://www.instagram.com/pspblive/',
  },
  {
    id: 'csi',
    name: 'Cue Sports India',
    sector: 'National Federation',
    logo: '/media/CSI-Logo-Round-1.webp',
    href: 'https://www.instagram.com/cuesportsindia/',
  },
]

export default function Clients() {
  return (
    <section id="clients" className="mn-cl">
      {/* Field: a pair of hairline arcs. The two warm radial washes that used
          to sit here are gone — on a field this light they read as a stain
          in the corners rather than as depth. */}
      <svg className="mn-cl__arcs" viewBox="0 0 1440 900" aria-hidden focusable="false">
        <path d="M1440,150 C1200,240 1140,390 1190,560" />
        <path d="M-40,380 C80,490 80,660 -10,760" />
      </svg>

      <FloatField place="top" variant="a" />
      <FloatField place="bottom" variant="b" />

      <div className="mn-cl__inner">
        {/* ── Head ─────────────────────────────────────────── */}
        <div className="mn-cl__head">
          <div className="mn-cl__headline">
            <motion.p
              className="mn-eyebrow"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEWPORT}
              transition={{ duration: 0.7, ease: EASE }}
            >
              Trusted by
            </motion.p>

            <h2 className="mn-cl__title">
              <MaskText>Federations, institutions and</MaskText>{' '}
              <MaskText as="em" delay={0.1}>
                enterprises
              </MaskText>
              <MaskText delay={0.14}>.</MaskText>
            </h2>
          </div>

          <motion.p
            className="mn-cl__note"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.85, ease: EASE, delay: 0.12 }}
          >
            The organisations we produce for, across sport, energy and public enterprise.
            Together we create stories that move people and build lasting impact.
          </motion.p>

          {/* Target mark, echoing the aperture language used elsewhere */}
          <motion.div
            className="mn-cl__target"
            aria-hidden
            initial={{ opacity: 0, scale: 0.75 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={VIEWPORT}
            transition={{ duration: 1, ease: EASE, delay: 0.2 }}
          >
            <span className="mn-cl__rings">
              <i />
            </span>
            <p>
              Real
              <br />
              partnerships
              <br />
              Real impact
            </p>
          </motion.div>
        </div>

        {/* ── Cards ────────────────────────────────────────── */}
        <motion.ul
          className="mn-cl__grid"
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07 } } }}
        >
          {CLIENTS.map((c, i) => (
            <motion.li
              key={c.id}
              variants={{
                hidden: { opacity: 0, y: 22 },
                show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
              }}
            >
              <a
                className="mn-cl__card"
                href={c.href}
                target="_blank"
                rel="noreferrer noopener"
              >
                <span className="mn-cl__go" aria-hidden>
                  <svg viewBox="0 0 20 20" focusable="false">
                    <path
                      d="M6 14 14 6M7.4 6H14v6.6"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>

                <span className="mn-cl__mark">
                  <img src={c.logo} alt="" loading="lazy" decoding="async" />
                </span>

                <span className="mn-cl__name">{c.name}</span>
                <span className="mn-cl__sector">{c.sector}</span>

                <span className="mn-cl__foot" aria-hidden>
                  <i>{String(i + 1).padStart(2, '0')}</i>
                  <b />
                </span>
              </a>
            </motion.li>
          ))}
        </motion.ul>

        {/* ── Rails ────────────────────────────────────────── */}
        <p className="mn-cl__rail mn-cl__rail--left" aria-hidden>
          People
          <br />
          Brands
          <br />
          Communities
        </p>

        <motion.div
          className="mn-cl__count"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.8, ease: EASE }}
        >
          {/* Derived from the list, so it cannot drift out of date. */}
          <strong>{CLIENTS.length}</strong>
          <span>
            Organisations
            <br />
            on this page
          </span>
        </motion.div>
      </div>
    </section>
  )
}
