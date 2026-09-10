import { Link } from 'react-router-dom'
import './ArrowLink.css'

export function ArrowLink({ to, href, children }) {
  const content = (
    <>
      <span>{children}</span>
      <span className="arrow-link__arrow" aria-hidden="true">
        →
      </span>
    </>
  )

  if (to) {
    return (
      <Link className="arrow-link" to={to}>
        {content}
      </Link>
    )
  }

  return (
    <a className="arrow-link" href={href}>
      {content}
    </a>
  )
}
