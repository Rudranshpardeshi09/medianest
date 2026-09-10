import { PageHeader } from '@/components/layout/PageHeader'
import { Portfolio } from '@/components/sections/Portfolio'

export function ProjectsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Projects"
        title="Portfolio"
        description="Editorial, cinematic, and brand work — structured so the archive can grow without rewriting the layout."
      />
      <Portfolio />
    </>
  )
}
