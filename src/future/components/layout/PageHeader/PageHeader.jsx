import { Container } from '@/future/components/ui/Container'
import './PageHeader.css'

export function PageHeader({ eyebrow, title, description }) {
  return (
    <section className="page-header">
      <Container>
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h1>{title}</h1>
        {description ? <p>{description}</p> : null}
      </Container>
    </section>
  )
}
