import { motion } from 'framer-motion'
import { FOOTER, REACH, SETTINGS, SOCIAL } from '@/lib/content'
import { NAV } from '@/lib/nav'
import { PLATFORM } from '@/lib/social'
import { EASE, VIEWPORT } from '@/lib/motion'
import '../styles/contact.css'

export default function Footer() {
  const year = new Date().getFullYear()

  /* WhatsApp carries no stored URL: it is built from the phone number, the
     same place the tap-to-call link comes from, so a changed number cannot
     leave a chat link pointing at the old one. */
  const href = (s) => (s.platform === 'whatsapp' ? REACH.whatsappHref : s.url)

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
              alt={REACH.firm}
              width="74"
              height="70"
              style={{ width: 74, height: 'auto', filter: 'brightness(0) invert(1)' }}
            />
            <p className="mn-foot__blurb">{FOOTER.blurb}</p>
            {/* Operational + hours, carried over from the hero banner. From
                the CMS, for the reason given beside the same two figures in
                Contact: About prints them too, and hardcoded they drift. */}
            <p className="mn-foot__live">
              {SETTINGS.coverage} · {SETTINGS.hours_spaced}
            </p>
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
            <a className="mn-foot__mail" href={REACH.emailHref}>
              {REACH.email}
            </a>
            <a className="mn-foot__tel" href={REACH.phoneHref}>
              {REACH.phone}
            </a>

            <ul className="mn-foot__social">
              {SOCIAL.map((s, i) => {
                const meta = PLATFORM[s.platform]
                const to = href(s)
                // A platform this build does not know, or one left without a
                // link, would draw an empty box that goes nowhere.
                if (!meta || !to) return null
                return (
                  <li key={`${i}-${s.platform}`}>
                    <a href={to} target="_blank" rel="noreferrer noopener" aria-label={meta.name}>
                      <i className={meta.icon} aria-hidden />
                    </a>
                  </li>
                )
              })}
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
            {REACH.firm.toUpperCase()}
          </motion.p>
        </div>

        <div className="mn-foot__base">
          {/* The year comes from the clock and the name from the CMS, so
              only the note itself is editable — a copyright line that can go
              stale is worse than one nobody can reword. */}
          <p style={{ margin: 0 }}>
            © {year} {REACH.firm}. {FOOTER.legal_note}
          </p>
          <button type="button" className="mn-foot__top" onClick={() => go('home')}>
            Back to top
          </button>
        </div>
      </div>
    </footer>
  )
}
