import { useState, useEffect } from 'react'
import { MotionConfig } from 'framer-motion'
import Header from './components/Header'
import Hero from './components/Hero'
import About from './components/About'
import WhatWeOffer from './components/WhatWeOffer'
import Services from './components/Services'
import Portfolio from './components/Portfolio'
import WhyChoose from './components/WhyChoose'
import Team from './components/Team'
import Testimonials from './components/Testimonials'
import Clients from './components/Clients'
import Contact from './components/Contact'
import Footer from './components/Footer'
import SiteIntro from './components/SiteIntro'

export function App() {
  /* The intro decides when it is done: it ends on the video ending, a hard
     timeout, an error or a blocked autoplay — whichever comes first. The
     loader it replaces was a flat 800ms timer with the logo, which had
     nothing to do with whether anything was actually ready. */
  const [intro, setIntro] = useState(true)

  /* Nothing scrolls behind the intro. */
  useEffect(() => {
    if (!intro) return undefined
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [intro])

  return (
    // reducedMotion="user" se Framer OS ki "reduce motion" setting ka
    // khud khayal rakhta hai: transform/slide band, opacity chalu.
    // Framer ka default "never" hai — yani preference ignore hoti hai —
    // isliye ise yahan root par ek baar set karna zaroori hai.
    <MotionConfig reducedMotion="user">
      {intro && <SiteIntro onDone={() => setIntro(false)} />}

      <div className="site-wrapper">
        <Header />
        <div id="content" className="site-content">
          <Hero />
          <About />
          <WhatWeOffer />
          <Services />
          <Portfolio />
          <WhyChoose />
          <Team />
          <Testimonials />
          <Clients />
          <Contact />
        </div>
        <Footer />
      </div>
    </MotionConfig>
  )
}
