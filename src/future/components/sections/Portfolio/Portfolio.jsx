import { useMemo, useState } from 'react'
import { Container } from '@/future/components/ui/Container'
import { SectionHeading } from '@/future/components/common/SectionHeading'
import { Button } from '@/future/components/common/Button'
import { PortfolioFilter } from '@/future/components/portfolio/PortfolioFilter'
import { PortfolioGrid } from '@/future/components/portfolio/PortfolioGrid'
import { PortfolioModal } from '@/future/components/portfolio/PortfolioModal'
import { portfolioCategories, projects } from '@/future/data/projects'
import './Portfolio.css'

const PAGE_SIZE = 6

export function Portfolio() {
  const [active, setActive] = useState('All')
  const [visible, setVisible] = useState(PAGE_SIZE)
  const [selected, setSelected] = useState(null)

  const filtered = useMemo(() => {
    if (active === 'All') return projects
    return projects.filter((project) => project.category === active)
  }, [active])

  const shown = filtered.slice(0, visible)

  return (
    <section className="portfolio" id="portfolio">
      <Container>
        <SectionHeading
          eyebrow="Portfolio"
          title="Check our super awesome portfolio"
          description="A growing archive of photography, film, events, and brand work."
        />
        <PortfolioFilter
          categories={portfolioCategories}
          active={active}
          onChange={(category) => {
            setActive(category)
            setVisible(PAGE_SIZE)
          }}
        />
        <PortfolioGrid projects={shown} onSelect={setSelected} />
        {visible < filtered.length ? (
          <div className="portfolio__more">
            <Button variant="ghost" onClick={() => setVisible((count) => count + PAGE_SIZE)}>
              Load more
            </Button>
          </div>
        ) : null}
      </Container>
      <PortfolioModal project={selected} onClose={() => setSelected(null)} />
    </section>
  )
}
