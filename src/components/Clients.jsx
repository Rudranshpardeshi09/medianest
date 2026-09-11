import { motion } from 'framer-motion'
import MaskText from './primitives/MaskText'
import { EASE, VIEWPORT } from '@/lib/motion'
import '../styles/voices.css'

const CLIENTS = [
  { id: 'ibsf', name: 'IBSF', logo: '/media/IBSF-Logo.webp', href: 'https://www.instagram.com/ibsf.media/' },
  { id: 'acbs', name: 'ACBS', logo: '/media/ACBS-LOGO.webp', href: 'https://www.instagram.com/acbsmedia/' },
  { id: 'pabsa', name: 'PABSA', logo: '/media/PABSA-LOGO.webp', href: 'https://www.instagram.com/pabsaofficial/' },
  { id: 'ogq', name: 'Olympic Gold Quest', logo: '/media/OGQ_logo_dark.webp', href: 'https://www.ogq.org' },
  { id: 'iocl', name: 'Indian Oil', logo: '/media/indianoil.webp', href: 'https://iocl.com' },
  { id: 'oil', name: 'Oil India', logo: '/media/OIL.webp', href: 'https://www.oil-india.com' },
  { id: 'pspb', name: 'PSPB', logo: '/media/PSPB-Logo-White-Background.webp', href: 'https://www.instagram.com/pspblive/' },
  { id: 'csi', name: 'Cue Sports India', logo: '/media/CSI-Logo-Round-1.webp', href: 'https://www.instagram.com/cuesportsindia/' },
]

export default function Clients() {
  return (
    <section id="clients" className="mn-clients">
      <div className="mn-clients__inner">
        <div className="mn-clients__head">
          <div>
            <motion.p
              className="mn-eyebrow"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEWPORT}
              transition={{ duration: 0.7, ease: EASE }}
            >
              Trusted by
            </motion.p>

            <h2 className="mn-clients__title">
              <MaskText>Federations, institutions and</MaskText>{' '}
              <MaskText as="em" delay={0.24}>
                enterprises
              </MaskText>
              <MaskText delay={0.3}>.</MaskText>
            </h2>
          </div>

          <motion.p
            className="mn-clients__note"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.85, ease: EASE, delay: 0.12 }}
          >
            The organisations we produce for, across sport, energy and public enterprise.
          </motion.p>
        </div>

        <motion.ul
          className="mn-clients__grid"
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}
        >
          {CLIENTS.map((c) => (
            <motion.li
              key={c.id}
              variants={{
                hidden: { opacity: 0, y: 16 },
                show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
              }}
            >
              <a
                className="mn-clients__cell"
                href={c.href}
                target="_blank"
                rel="noreferrer noopener"
              >
                <img
                  src={c.logo}
                  alt={c.name}
                  loading="lazy"
                  decoding="async"
                />
              </a>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  )
}
