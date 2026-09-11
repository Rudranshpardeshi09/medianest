import { classNames } from '@/future/utils/helpers'
import './SectionHeading.css'

export function SectionHeading({ eyebrow, title, description, align = 'left' }) {
  return (
    <header className={classNames('section-heading', `section-heading--${align}`)}>
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      {title ? <h2>{title}</h2> : null}
      {description ? <p className="section-heading__description">{description}</p> : null}
    </header>
  )
}
