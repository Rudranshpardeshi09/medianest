import { Link, NavLink } from 'react-router-dom'
import { site } from '@/data/site'
import { navItems } from '@/data/nav'
import { MobileMenu } from '@/components/layout/MobileMenu'
import './Navbar.css'

export function Navbar({ menuOpen, onToggleMenu, onCloseMenu }) {
  return (
    <header className="navbar">
      <div className="navbar__inner">
        <Link className="navbar__logo" to="/" onClick={onCloseMenu}>
          {site.name}
        </Link>
        <nav className="navbar__desktop" aria-label="Primary">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                isActive ? 'navbar__link is-active' : 'navbar__link'
              }
              end={item.path === '/'}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <button
          className="navbar__toggle"
          type="button"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={onToggleMenu}
        >
          {menuOpen ? 'Close' : 'Menu'}
        </button>
      </div>
      <MobileMenu open={menuOpen} onClose={onCloseMenu} />
    </header>
  )
}
