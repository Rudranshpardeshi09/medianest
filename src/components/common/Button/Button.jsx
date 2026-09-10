import { Link } from 'react-router-dom'
import { classNames } from '@/utils/helpers'
import './Button.css'

export function Button({
  children,
  href,
  to,
  type = 'button',
  variant = 'primary',
  onClick,
}) {
  const className = classNames('btn', `btn--${variant}`)

  if (to) {
    return (
      <Link className={className} to={to}>
        {children}
      </Link>
    )
  }

  if (href) {
    return (
      <a className={className} href={href}>
        {children}
      </a>
    )
  }

  return (
    <button className={className} type={type} onClick={onClick}>
      {children}
    </button>
  )
}
