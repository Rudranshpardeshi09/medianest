import { ImageReveal } from '@/components/common/ImageReveal'
import './PortfolioCard.css'

export function PortfolioCard({ project, onSelect }) {
  return (
    <article className="portfolio-card">
      <button
        type="button"
        className="portfolio-card__trigger"
        onClick={() => onSelect?.(project)}
      >
        <ImageReveal src={project.image} alt={project.title} label={project.title} />
        <div className="portfolio-card__meta">
          <p className="eyebrow">{project.category}</p>
          <h3>{project.title}</h3>
          {project.year ? <p className="portfolio-card__year">{project.year}</p> : null}
          <span className="portfolio-card__arrow" aria-hidden="true">
            →
          </span>
        </div>
      </button>
    </article>
  )
}
