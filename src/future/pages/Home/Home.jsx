import { Hero } from '@/future/components/sections/Hero'
import { About } from '@/future/components/sections/About'
import { AboutHighlights } from '@/future/components/sections/AboutHighlights'
import { Services } from '@/future/components/sections/Services'
import { Portfolio } from '@/future/components/sections/Portfolio'
import { WhyChooseUs } from '@/future/components/sections/WhyChooseUs'
import { Founders } from '@/future/components/sections/Founders'
import { Testimonials } from '@/future/components/sections/Testimonials'
import { Clients } from '@/future/components/sections/Clients'
import { Contact } from '@/future/components/sections/Contact'

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
