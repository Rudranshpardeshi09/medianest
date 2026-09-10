import { PageHeader } from '@/components/layout/PageHeader'
import { About } from '@/components/sections/About'
import { AboutHighlights } from '@/components/sections/AboutHighlights'
import { site } from '@/data/site'

export function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About Us"
        title="Brand image, considered."
        description={site.description}
      />
      <About />
      <AboutHighlights />
    </>
  )
}
