import { MotionConfig } from 'framer-motion'
import Header from './components/Header'
import MediaNestIntro from './components/MediaNestIntro'
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

export function App() {
  return (
    // reducedMotion="user" se Framer OS ki "reduce motion" setting ka
    // khud khayal rakhta hai: transform/slide band, opacity chalu.
    // Framer ka default "never" hai — yani preference ignore hoti hai —
    // isliye ise yahan root par ek baar set karna zaroori hai.
    <MotionConfig reducedMotion="user">
      <div className="site-wrapper">
        <Header />
        {/* The opening sequence. It sits above the homepage and owns nothing
            below it — every section from Hero down is exactly what it was.
            Delete this line and the site is back to what it was before. */}
        <MediaNestIntro />
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
