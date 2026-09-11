import { Container } from '@/future/components/ui/Container'
import { SectionHeading } from '@/future/components/common/SectionHeading'
import { clients } from '@/future/data/clients'
import { ClientLogoGrid } from './ClientLogoGrid'
import './Clients.css'

export function Clients() {
  return (
    <section className="clients" id="clients">
      <Container>
        <SectionHeading eyebrow="# Clients" title="Selected partners." />
        <ClientLogoGrid items={clients} />
      </Container>
    </section>
  )
}
