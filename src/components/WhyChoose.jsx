import { useEffect, useRef } from 'react'

export default function WhyChoose() {
  const ref = useRef()

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('visible')
        })
      },
      { threshold: 0.1 }
    )
    const els = ref.current?.querySelectorAll('.animate-on-scroll')
    els?.forEach((el) => observer.observe(el))
    return () => els?.forEach((el) => observer.unobserve(el))
  }, [])

  const cards = [
    { title: 'Proven\nExpertise', desc: 'A team of experts with over 5+ years of hands-on experience in brand image management.' },
    { title: 'Comprehensive\nServices', desc: "From strategy to execution, we provide a full suite of services designed to enhance your brand's visibility." },
    { title: 'Industry\nNetworking', desc: 'With our robust network of industry contacts, we offer unique opportunities for collaboration and growth.' },
    { title: 'Client-Centric\nApproach', desc: 'We tailor our services to meet the specific needs of each client, ensuring that every project is personalized and effective.' },
  ]

  return (
    <section className="section section-whychoose" ref={ref}>
      <div className="whychoose-title animate-on-scroll fade-in" style={{ animationDelay: '0.1s' }}>
        Why Choose MEDIANEST ?
      </div>
      <div className="whychoose-grid animate-on-scroll fade-in" style={{ animationDelay: '0.1s' }}>
        {cards.map((card, i) => (
          <div className="whychoose-card" key={i}>
            <h3>{card.title.split('\n').map((line, j) => (
              <span key={j}>{line}{j === 0 && <br />}</span>
            ))}</h3>
            <p>{card.desc}</p>
          </div>
        ))}
      </div>

      {/* Tilted image overlay */}
      <div style={{ position: 'relative', maxWidth: '1100px', margin: '0 auto', paddingTop: '40px' }}>
        <img
          src="/images/20250510_115838-1024x1024.png"
          alt=""
          className="animate-on-scroll fade-in-up whychoose-image-overlay"
          style={{
            width: '300px', position: 'absolute', right: '-50px', bottom: '-80px',
            transform: 'rotate(15deg) translate(-146px, 100px)',
            zIndex: 2
          }}
        />
      </div>
    </section>
  )
}
