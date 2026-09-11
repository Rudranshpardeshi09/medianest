import { Container } from '@/future/components/ui/Container'
import { SectionHeading } from '@/future/components/common/SectionHeading'
import { services } from '@/future/data/services'
import { ServiceCard } from './ServiceCard'
import './Services.css'

export function Services({ items = services, limit }) {
  const list = typeof limit === 'number' ? items.slice(0, limit) : items

  return (
    <section className="services" id="services">
      <Container>
        <SectionHeading
          eyebrow="What We Offer"
          title="Services built around brand image."
          description="Photography, cinematography, strategy, and the supporting craft that holds a brand’s visual presence together."
        />
        <div className="services__grid">
          {list.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </Container>
    </section>
  )
}
