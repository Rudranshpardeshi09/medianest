import { useEffect, useRef } from 'react'

export default function About() {
  const ref = useRef()

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('visible')
        })
      },
      { threshold: 0.2 }
    )
    const els = ref.current?.querySelectorAll('.animate-on-scroll')
    els?.forEach((el) => observer.observe(el))
    return () => els?.forEach((el) => observer.unobserve(el))
  }, [])

  return (
    <section id="about" className="section section-about" ref={ref}>
      <div className="rotate-title">ABOUT</div>
      <div className="section-inner">
        <div className="about-columns">
          <div className="about-col animate-on-scroll fade-in" style={{ animationDelay: '0.3s' }}>
            <h4>Holistic Approach</h4>
            <p>At Media Nest, we offer a holistic approach to brand image management by focusing on visual and tangible content that drives engagement and trust.</p>
          </div>
          <div className="about-col animate-on-scroll fade-in" style={{ animationDelay: '0.3s' }}>
            <h4>Tailored Services</h4>
            <p>Our services include high-quality film production, professional photography, and content strategy, tailored to position brands as industry leaders.</p>
          </div>
          <div className="about-col animate-on-scroll fade-in" style={{ animationDelay: '0.9s' }}>
            <h4>Extensive Networking</h4>
            <p>We leverage our extensive professional experience and deep-rooted networking opportunities to deliver results that make a lasting impact.</p>
          </div>
        </div>
      </div>

      {/* Mountain shape divider bottom */}
      <div className="shape-divider" style={{ marginTop: '60px' }}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 100" preserveAspectRatio="none">
          <path className="shape-fill" opacity="0.33" d="M473,67.3c-203.9,88.3-263.1-34-320.3,0C66,119.1,0,59.7,0,59.7V0h1000v59.7 c0,0-62.1,26.1-94.9,29.3c-32.8,3.3-62.8-12.3-75.8-22.1C806,49.6,745.3,8.7,694.9,4.7S492.4,59,473,67.3z" style={{ fill: '#f5f5f5' }}></path>
          <path className="shape-fill" opacity="0.66" d="M734,67.3c-45.5,0-77.2-23.2-129.1-39.1c-28.6-8.7-150.3-10.1-254,39.1 s-91.7-34.4-149.2,0C115.7,118.3,0,39.8,0,39.8V0h1000v36.5c0,0-28.2-18.5-92.1-18.5C810.2,18.1,775.7,67.3,734,67.3z" style={{ fill: '#f5f5f5' }}></path>
          <path className="shape-fill" d="M766.1,28.9c-200-57.5-266,65.5-395.1,19.5C242,1.8,242,5.4,184.8,20.6C128,35.8,132.3,44.9,89.9,52.5C28.6,63.7,0,0,0,0 h1000c0,0-9.9,40.9-83.6,48.1S829.6,47,766.1,28.9z" style={{ fill: '#f5f5f5' }}></path>
        </svg>
      </div>
    </section>
  )
}
