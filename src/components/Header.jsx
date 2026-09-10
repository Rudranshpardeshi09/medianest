import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring } from 'framer-motion'
import Magnetic from './Magnetic'
import '../styles/nav.css'

const EASE = [0.16, 1, 0.3, 1]

/* Har item ka `id` page par maujood section se match karta hai,
   isliye scroll-spy sab par kaam karta hai. */
const NAV = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About Us' },
  { id: 'services', label: 'Services' },
  { id: 'projects', label: 'Projects' },
  { id: 'team', label: 'Team' },
  { id: 'clients', label: 'Clients' },
  { id: 'video', label: 'Video' },
  { id: 'contact', label: 'Contact' },
]

const SOCIAL = [
  { icon: 'fab fa-facebook-f', label: 'Facebook', href: 'https://www.facebook.com/medianest2024' },
  { icon: 'fab fa-instagram', label: 'Instagram', href: 'https://www.instagram.com/medianest.official/' },
  { icon: 'fab fa-youtube', label: 'YouTube', href: 'https://youtube.com/@medianesttv?feature=shared' },
  { icon: 'fab fa-linkedin-in', label: 'LinkedIn', href: 'https://www.linkedin.com/company/104838310/' },
]

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('home')
  const [open, setOpen] = useState(false)

  const { scrollY, scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 130, damping: 30, restDelta: 0.001 })

  useMotionValueEvent(scrollY, 'change', (v) => setScrolled(v > 60))

  /* Scroll-spy. Sabse upar wale intersecting section ko chunta hai,
     na ki pehle wale ko — isse do section ek saath dikhne par bhi
     indicator sthir rehta hai. */
  useEffect(() => {
    const nodes = NAV.map((n) => document.getElementById(n.id)).filter(Boolean)
    if (!nodes.length) return

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) =>
              Math.abs(a.boundingClientRect.top) - Math.abs(b.boundingClientRect.top),
          )
        if (visible[0]) setActive(visible[0].target.id)
      },
      { rootMargin: '-45% 0px -45% 0px' },
    )

    nodes.forEach((n) => io.observe(n))
    return () => io.disconnect()
  }, [])

  /* Sheet khula ho to page scroll band */
  useEffect(() => {
    document.documentElement.style.overflow = open ? 'hidden' : ''
    return () => {
      document.documentElement.style.overflow = ''
    }
  }, [open])

  /* Escape se sheet band */
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const go = (id) => {
    const wasOpen = open
    setOpen(false)
    // Sheet ko band hone ka waqt do, tab scroll shuru karo.
    setTimeout(
      () => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
      wasOpen ? 260 : 0,
    )
  }

  return (
    <>
      <motion.header
        className="mn-nav"
        data-state={scrolled ? 'scrolled' : 'top'}
        data-open={open ? 'true' : 'false'}
        initial={{ y: -70, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: EASE, delay: 0.1 }}
      >
        <div className="mn-nav__bar">
          {/* ── Brand ─────────────────────────────────── */}
          <button
            type="button"
            className="mn-nav__brand"
            onClick={() => go('home')}
            aria-label="Media Nest — top par jaayein"
          >
            <img
              className="mn-nav__logo"
              src="/images/cropped-logo_square.png"
              alt="Media Nest"
              width="84"
              height="80"
            />
            <span className="mn-nav__rule" aria-hidden />
            {/* Type-mixing: Roboto Slab italic + Roboto uppercase tracked */}
            <span className="mn-nav__tag">
              <span className="mn-nav__tag-a">Visual Excellence,</span>
              <span className="mn-nav__tag-b">Tangible Results</span>
            </span>
          </button>

          {/* ── Links ─────────────────────────────────── */}
          <ul className="mn-nav__links">
            {NAV.map((item, i) => {
              const isActive = active === item.id
              return (
                <li key={item.id}>
                  <Magnetic strength={0.2} padding={4}>
                    <button
                      type="button"
                      className="mn-nav__link"
                      aria-current={isActive ? 'true' : undefined}
                      onClick={() => go(item.id)}
                    >
                      {isActive && (
                        <motion.span
                          className="mn-nav__pill"
                          layoutId="mn-nav-pill"
                          transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                        />
                      )}
                      <span className="mn-nav__idx" aria-hidden>
                        0{i + 1}
                      </span>
                      {/* Roll-up swap: doosri copy aria-hidden hai taaki
                          screen reader label do baar na padhe. */}
                      <span className="mn-nav__swap">
                        <span className="mn-nav__swap-a">{item.label}</span>
                        <span className="mn-nav__swap-b" aria-hidden>
                          {item.label}
                        </span>
                      </span>
                    </button>
                  </Magnetic>
                </li>
              )
            })}
          </ul>

          {/* ── Right ─────────────────────────────────── */}
          <div className="mn-nav__right">
            <a className="mn-nav__phone" href="tel:+918448112770">
              <svg viewBox="0 0 24 24" aria-hidden focusable="false">
                <path
                  d="M6.2 3.5h3l1.5 3.8-2 1.4a11.4 11.4 0 0 0 5.6 5.6l1.4-2 3.8 1.5v3a2 2 0 0 1-2.2 2A16.6 16.6 0 0 1 4.2 5.7a2 2 0 0 1 2-2.2Z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              +91-8448112770
            </a>

            <Magnetic strength={0.28}>
              <button type="button" className="mn-nav__cta" onClick={() => go('contact')}>
                <span>Let’s Talk</span>
                <svg viewBox="0 0 24 24" aria-hidden focusable="false">
                  <path d="M7.5 16.5 16.5 7.5M9 7.5h7.5V15" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </Magnetic>
          </div>

          {/* ── Mobile toggle ─────────────────────────── */}
          <button
            type="button"
            className="mn-nav__toggle"
            aria-expanded={open}
            aria-controls="mn-sheet"
            onClick={() => setOpen((v) => !v)}
          >
            <span aria-hidden />
            <span aria-hidden />
            <span aria-hidden />
            <span className="sr-only">{open ? 'Menu band karein' : 'Menu kholein'}</span>
          </button>
        </div>

        {/* Scroll progress hairline */}
        <motion.div className="mn-nav__progress" style={{ scaleX: progress }} aria-hidden />
      </motion.header>

      {/* ── Mobile sheet ────────────────────────────────── */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mn-sheet"
            className="mn-sheet"
            initial={{ clipPath: 'inset(0% 0% 100% 0%)' }}
            animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
            exit={{ clipPath: 'inset(0% 0% 100% 0%)' }}
            transition={{ duration: 0.68, ease: [0.83, 0, 0.17, 1] }}
          >
            {/* MN arch motif — brand ki hi shakl, watermark ki tarah */}
            <svg
              className="mn-sheet__shape"
              viewBox="0 0 360 230"
              fill="none"
              aria-hidden
              focusable="false"
            >
              {[0, 1, 2].map((i) => (
                <path
                  key={i}
                  d={`M${20 + i * 104} 214V88a52 52 0 0 1 104 0v126`}
                  stroke="#fff"
                  strokeWidth="6"
                  strokeLinecap="round"
                />
              ))}
            </svg>

            <nav aria-label="Mobile">
              <ul className="mn-sheet__list">
                {NAV.map((item, i) => (
                  <li className="mn-sheet__item" key={item.id}>
                    <motion.button
                      type="button"
                      className="mn-sheet__link"
                      aria-current={active === item.id ? 'true' : undefined}
                      onClick={() => go(item.id)}
                      initial={{ y: '110%' }}
                      animate={{ y: '0%' }}
                      exit={{ y: '110%' }}
                      transition={{ duration: 0.62, ease: EASE, delay: 0.1 + i * 0.045 }}
                    >
                      <span className="mn-sheet__num" aria-hidden>
                        0{i + 1}
                      </span>
                      <span className="mn-sheet__label">{item.label}</span>
                    </motion.button>
                  </li>
                ))}
              </ul>
            </nav>

            <motion.div
              className="mn-sheet__foot"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.55, ease: EASE, delay: 0.48 }}
            >
              <a href="mailto:connect@medianest.co.in">connect@medianest.co.in</a>
              <a href="tel:+918448112770">+91-8448112770</a>
              <ul className="mn-sheet__social">
                {SOCIAL.map((s) => (
                  <li key={s.label}>
                    <a href={s.href} target="_blank" rel="noreferrer noopener" aria-label={s.label}>
                      <i className={s.icon} aria-hidden />
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
