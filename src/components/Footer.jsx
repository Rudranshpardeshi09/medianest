import { motion } from 'framer-motion'
import { EASE, VIEWPORT } from '@/lib/motion'
import '../styles/contact.css'

const NAV = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About Us' },
  { id: 'services', label: 'Services' },
  { id: 'projects', label: 'Projects' },
  { id: 'team', label: 'Team' },
  { id: 'clients', label: 'Clients' },
  { id: 'contact', label: 'Contact' },
]

const SOCIAL = [
  { icon: 'fab fa-facebook-f', label: 'Facebook', href: 'https://www.facebook.com/medianest2024' },
  { icon: 'fab fa-instagram', label: 'Instagram', href: 'https://www.instagram.com/medianest.official/' },
  {
    icon: 'fab fa-whatsapp',
    label: 'WhatsApp',
    href: 'https://wa.me/918448112770?text=Hi%2C%20I%20visited%20your%20website%20and%20want%20to%20know%20more.',
  },
  { icon: 'fab fa-youtube', label: 'YouTube', href: 'https://youtube.com/@medianesttv?feature=shared' },
  { icon: 'fab fa-linkedin-in', label: 'LinkedIn', href: 'https://www.linkedin.com/company/104838310/' },
]

export default function Footer() {
  const year = new Date().getFullYear()

  const go = (id) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  return (
    <footer className="mn-foot">
      <span className="mn-foot__grain" aria-hidden />

      <div className="mn-foot__inner">
        <div className="mn-foot__cols">
          {/* Brand */}
          <div>
            <img
              src="/images/cropped-logo_square.png"
              alt="Media Nest"
              width="74"
              height="70"
              style={{ width: 74, height: 'auto', filter: 'brightness(0) invert(1)' }}
            />
            <p className="mn-foot__blurb">
              Brand Image Management &amp; Consultancy. Creating and curating impactful visual
              content that amplifies brand presence and identity.
            </p>
            {/* Operational + hours, carried over from the hero banner */}
            <p className="mn-foot__live">Global · 24 x 7</p>
          </div>

          {/* Navigate */}
          <nav aria-label="Footer">
            <h2 className="mn-foot__h">Navigate</h2>
            <ul className="mn-foot__nav">
              {NAV.map((n) => (
                <li key={n.id}>
                  <button type="button" onClick={() => go(n.id)}>
                    {n.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Get in touch */}
          <div>
            <h2 className="mn-foot__h">Get in touch</h2>
            <a className="mn-foot__mail" href="mailto:connect@medianest.co.in">
              connect@medianest.co.in
            </a>
            <a className="mn-foot__tel" href="tel:+918448112770">
              +91-8448112770
            </a>

            <ul className="mn-foot__social">
              {SOCIAL.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noreferrer noopener" aria-label={s.label}>
                    <i className={s.icon} aria-hidden />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Oversized outlined wordmark */}
        <div className="mn-foot__mark">
          <motion.p
            aria-hidden
            initial={{ y: '26%', opacity: 0 }}
            whileInView={{ y: '0%', opacity: 1 }}
            viewport={VIEWPORT}
            transition={{ duration: 1.1, ease: EASE }}
          >
            MEDIA NEST
          </motion.p>
        </div>

        <div className="mn-foot__base">
          <p style={{ margin: 0 }}>
            © {year} Media Nest. All rights reserved.
          </p>
          <button type="button" className="mn-foot__top" onClick={() => go('home')}>
            Back to top
          </button>
        </div>
      </div>
    </footer>
  )
}
