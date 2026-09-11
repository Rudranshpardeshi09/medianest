import { ArrowLink } from '@/future/components/common/ArrowLink'
import { ImageReveal } from '@/future/components/common/ImageReveal'
import './AboutHighlights.css'

export function HighlightCard({ item }) {
  return (
    <article className="highlight-card">
      <ImageReveal src={item.image} alt={item.title} label={item.title} />
      <p className="highlight-card__number">{item.number}</p>
      <h3>{item.title}</h3>
      <p>{item.description}</p>
      {item.cta ? <ArrowLink to={item.cta.href}>{item.cta.label}</ArrowLink> : null}
    </article>
  )
}
