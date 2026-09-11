import { ImageReveal } from '@/future/components/common/ImageReveal'
import './ServiceCard.css'

export function ServiceCard({ service }) {
  return (
    <article className="service-card">
      <p className="service-card__number">{service.number}</p>
      <div className="service-card__media">
        <ImageReveal src={service.image} alt={service.title} label={service.title} />
      </div>
      <h3>{service.title}</h3>
      <p>{service.description}</p>
    </article>
  )
}
