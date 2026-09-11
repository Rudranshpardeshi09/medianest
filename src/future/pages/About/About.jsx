import { PageHeader } from '@/future/components/layout/PageHeader'
import { About } from '@/future/components/sections/About'
import { AboutHighlights } from '@/future/components/sections/AboutHighlights'
import { site } from '@/future/data/site'

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
