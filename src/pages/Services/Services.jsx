import { PageHeader } from '@/components/layout/PageHeader'
import { Services } from '@/components/sections/Services'

export function ServicesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Services"
        title="What we offer."
        description="A full suite from strategy to execution across photography, film, design, events, and digital."
      />
      <Services />
    </>
  )
}
