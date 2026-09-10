import { useState, useEffect } from 'react'
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

export function App() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div className="doc-loader">
        <img src="/images/cropped-logo_square.png" alt="Media Nest" />
      </div>
    )
  }

  return (
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
  )
}
