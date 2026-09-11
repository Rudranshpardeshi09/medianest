import { NavLink } from 'react-router-dom'
import { navItems } from '@/future/data/nav'
import './MobileMenu.css'

export function MobileMenu({ open, onClose }) {
  return (
    <div
      id="mobile-menu"
      className={open ? 'mobile-menu is-open' : 'mobile-menu'}
      hidden={!open}
    >
      <nav className="mobile-menu__nav" aria-label="Mobile">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              isActive ? 'mobile-menu__link is-active' : 'mobile-menu__link'
            }
            end={item.path === '/'}
            onClick={onClose}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
