import { Modal } from '@/future/components/ui/Modal'
import { ImageReveal } from '@/future/components/common/ImageReveal'
import './PortfolioModal.css'

export function PortfolioModal({ project, onClose }) {
  return (
    <Modal open={Boolean(project)} onClose={onClose} title={project?.title}>
      {project ? (
        <div className="portfolio-modal">
          <ImageReveal src={project.image} alt={project.title} label={project.title} />
          <p className="eyebrow">{project.category}</p>
          <h2>{project.title}</h2>
          <p>{project.description}</p>
          <dl>
            <div>
              <dt>Client</dt>
              <dd>{project.client}</dd>
            </div>
            <div>
              <dt>Year</dt>
              <dd>{project.year}</dd>
            </div>
          </dl>
        </div>
      ) : null}
    </Modal>
  )
}
