import { Link } from 'react-router-dom'
import { Container } from '@/components/ui/Container'
import { site } from '@/data/site'
import { navItems } from '@/data/nav'
import './Footer.css'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <Container className="footer__grid">
        <div>
          <p className="footer__brand">{site.name}</p>
          <p className="footer__tagline">{site.tagline}</p>
        </div>
        <nav className="footer__nav" aria-label="Footer">
          {navItems.map((item) => (
            <Link key={item.path} to={item.path}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="footer__contact">
          <a href={site.contact.emailHref}>{site.contact.email}</a>
          <a href={site.contact.phoneHref}>{site.contact.phone}</a>
        </div>
        <ul className="footer__social">
          {site.socialLinks.map((link) => (
            <li key={link.label}>
              <a href={link.href}>{link.label}</a>
            </li>
          ))}
        </ul>
      </Container>
      <Container>
        <p className="footer__copy">© {year} {site.name}. All rights reserved.</p>
      </Container>
    </footer>
  )
}
