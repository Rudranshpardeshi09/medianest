import { useState, useEffect } from 'react'

export default function Header() {
  const [sticky, setSticky] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setSticky(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { label: 'Home', href: '#home' },
    { label: 'About Us', href: '#about' },
    { label: 'Services', href: '#services' },
    { label: 'Projects', href: '#projects' },
    { label: 'Team', href: '#team' },
    { label: 'Clients', href: '#clients' },
    { label: 'Video', href: '#video' },
    { label: 'Contact', href: '#contact' },
  ]

  const handleNavClick = (e, href) => {
    e.preventDefault()
    setMenuOpen(false)
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <header className={`header-holder${sticky ? ' is-sticky' : ''}`}>
      <div className="menu-wrapper">
        <div className="header-logo">
          <a href="#home" onClick={(e) => handleNavClick(e, '#home')}>
            <img src="/images/cropped-logo_square.png" alt="Media Nest" />
          </a>
        </div>

        <div className="toggle-holder" onClick={() => setMenuOpen(!menuOpen)}>
          <div className="menu-line"></div>
          <div className="menu-line"></div>
          <div className="menu-line"></div>
        </div>

        <div className={`menu-holder${menuOpen ? ' open' : ''}`}>
          <nav>
            <ul className="main-menu">
              {navItems.map((item) => (
                <li key={item.href}>
                  <a href={item.href} onClick={(e) => handleNavClick(e, item.href)}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  )
}
