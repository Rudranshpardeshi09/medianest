import { Container } from '@/future/components/ui/Container'
import { SectionHeading } from '@/future/components/common/SectionHeading'
import { team } from '@/future/data/team'
import { FounderCard } from './FounderCard'
import './Founders.css'

export function Founders({ people = team }) {
  return (
    <section className="founders" id="team">
      <Container>
        <SectionHeading eyebrow="Founders" title="The partners behind MediaNest." />
        <div className="founders__grid">
          {people.map((person) => (
            <FounderCard key={person.id} person={person} />
          ))}
        </div>
      </Container>
    </section>
  )
}
