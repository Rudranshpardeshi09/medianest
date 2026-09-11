import { Container } from '@/future/components/ui/Container'
import { aboutHighlights } from '@/future/data/aboutHighlights'
import { HighlightCard } from './HighlightCard'
import './AboutHighlights.css'

export function AboutHighlights() {
  return (
    <section className="about-highlights">
      <Container className="about-highlights__grid">
        {aboutHighlights.map((item) => (
          <HighlightCard key={item.id} item={item} />
        ))}
      </Container>
    </section>
  )
}
