import { Button } from '@/components/common/Button'
import { AnimatedText } from '@/components/common/AnimatedText'
import { heroContent } from '@/data/site'
import './Hero.css'

function HeroMedia() {
  return (
    <div className="hero__media" aria-hidden="true">
      <div className="media-placeholder">Hero visual</div>
    </div>
  )
}

function HeroOverlay() {
  return <div className="hero__overlay" />
}

function HeroContent() {
  return (
    <div className="hero__content">
      <p className="eyebrow">{heroContent.eyebrow}</p>
      <AnimatedText as="h1">{heroContent.heading}</AnimatedText>
      <p className="hero__description">{heroContent.description}</p>
      <Button to={heroContent.cta.href}>{heroContent.cta.label}</Button>
    </div>
  )
}

function ScrollIndicator() {
  return (
    <a className="hero__scroll" href="#about">
      Scroll
    </a>
  )
}

export function Hero() {
  return (
    <section className="hero" aria-label="Introduction">
      <HeroMedia />
      <HeroOverlay />
      <HeroContent />
      <ScrollIndicator />
    </section>
  )
}
