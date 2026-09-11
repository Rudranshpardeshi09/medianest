import { Container } from '@/future/components/ui/Container'
import { SectionHeading } from '@/future/components/common/SectionHeading'
import { whyChooseUs } from '@/future/data/whyChooseUs'
import { ReasonList } from './ReasonList'
import './WhyChooseUs.css'

export function WhyChooseUs() {
  return (
    <section className="why-choose">
      <Container>
        <SectionHeading
          eyebrow="Why Choose MediaNest?"
          title="Experience, range, and a client-first practice."
        />
        <ReasonList reasons={whyChooseUs} />
      </Container>
    </section>
  )
}
