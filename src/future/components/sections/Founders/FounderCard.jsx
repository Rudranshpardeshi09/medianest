import { ImageReveal } from '@/future/components/common/ImageReveal'
import './Founders.css'

export function FounderCard({ person }) {
  return (
    <article className="founder-card">
      <ImageReveal src={person.image} alt={person.name} label={person.name} />
      <h3>{person.name}</h3>
      <p className="founder-card__role">{person.role}</p>
      <ul>
        {person.specialties.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </article>
  )
}
