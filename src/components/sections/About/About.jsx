import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/common/SectionHeading'
import { ImageReveal } from '@/components/common/ImageReveal'
import { Button } from '@/components/common/Button'
import { aboutContent, aboutFacts } from '@/data/site'
import './About.css'

export function About() {
  return (
    <section className="about" id="about">
      <Container className="about__grid">
        <div className="about__copy">
          <SectionHeading eyebrow={aboutContent.eyebrow} title={aboutContent.heading} />
          <p className="about__statement">{aboutContent.statement}</p>
          <p className="about__description">{aboutContent.description}</p>
          <dl className="about__facts">
            {aboutFacts.map((fact) => (
              <div key={fact.label}>
                <dt>{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>
          <Button to={aboutContent.cta.href} variant="ghost">
            {aboutContent.cta.label}
          </Button>
        </div>
        <div className="about__image">
          <ImageReveal alt="MediaNest studio" label="About" />
        </div>
      </Container>
    </section>
  )
}
