import { PortfolioCard } from '@/future/components/portfolio/PortfolioCard'
import './PortfolioGrid.css'

export function PortfolioGrid({ projects, onSelect }) {
  return (
    <div className="portfolio-grid">
      {projects.map((project) => (
        <PortfolioCard key={project.id} project={project} onSelect={onSelect} />
      ))}
    </div>
  )
}
