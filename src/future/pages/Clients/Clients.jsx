import { PageHeader } from '@/future/components/layout/PageHeader'
import { Clients } from '@/future/components/sections/Clients'

export function ClientsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Clients"
        title="The companies we work with."
        description="A dedicated client showcase. Logos will replace placeholders in a later content pass."
      />
      <Clients />
    </>
  )
}
