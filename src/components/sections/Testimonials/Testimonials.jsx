import { useState } from 'react'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/common/SectionHeading'
import { testimonials } from '@/data/testimonials'
import { TestimonialSlider } from './TestimonialSlider'
import './Testimonials.css'

export function Testimonials() {
  const [index, setIndex] = useState(0)
  const total = testimonials.length

  return (
    <section className="testimonials">
      <Container>
        <SectionHeading
          eyebrow="Testimonials"
          title="Client voices."
          description="Appreciation for MediaNest’s work in brand and visual positioning."
        />
        <TestimonialSlider
          items={testimonials}
          index={index}
          onPrev={() => setIndex((value) => (value - 1 + total) % total)}
          onNext={() => setIndex((value) => (value + 1) % total)}
        />
      </Container>
    </section>
  )
}
