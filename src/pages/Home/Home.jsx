import { Hero } from '@/components/sections/Hero'
import { About } from '@/components/sections/About'
import { AboutHighlights } from '@/components/sections/AboutHighlights'
import { Services } from '@/components/sections/Services'
import { Portfolio } from '@/components/sections/Portfolio'
import { WhyChooseUs } from '@/components/sections/WhyChooseUs'
import { Founders } from '@/components/sections/Founders'
import { Testimonials } from '@/components/sections/Testimonials'
import { Clients } from '@/components/sections/Clients'
import { Contact } from '@/components/sections/Contact'

export function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <AboutHighlights />
      <Services limit={3} />
      <Portfolio />
      <WhyChooseUs />
      <Founders />
      <Testimonials />
      <Clients />
      <Contact />
    </>
  )
}
