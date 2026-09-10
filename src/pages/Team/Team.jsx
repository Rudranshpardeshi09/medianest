import { PageHeader } from '@/components/layout/PageHeader'
import { Founders } from '@/components/sections/Founders'

export function TeamPage() {
  return (
    <>
      <PageHeader
        eyebrow="Team"
        title="Founders"
        description="The partners behind MediaNest, with room for the wider team to be added later."
      />
      <Founders />
    </>
  )
}
