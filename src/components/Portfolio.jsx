import { useEffect, useRef } from 'react'

export default function Portfolio() {
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

  const items = [
    { img: '/images/photography.jpg', title: 'Photography', classes: 'p-half p-full-height' },
    { img: '/images/cinematography_main.jpg', title: 'CINEMATOGRAPHY', classes: 'p-half' },
    { img: '/images/INTERVIEW.jpeg', title: 'INTERVIEW', classes: '' },
    { img: '/images/LIVE-STREAM.jpg', title: 'LIVE STREAM', classes: '' },
    { img: '/images/video-edit.jpg', title: 'VIDEO EDIT', classes: '' },
    { img: '/images/graphic-1.jpg', title: 'GRAPHIC DESIGN', classes: 'p-full-height' },
    { img: '/images/EVENT.jpg', title: 'EVENT', classes: 'p-half p-full-height' },
    { img: '/images/new_DIGITAL-MARKETING.jpg', title: 'DIGITAL MARKETING', classes: '' },
  ]

  return (
    <section id="projects" className="section section-portfolio" ref={ref}>
      <div className="rotate-title" style={{ color: 'rgba(255,255,255,0.08)' }}>PORTFOLIO</div>
      <div className="portfolio-grid animate-on-scroll fade-in">
        {items.map((item, i) => (
          <div className={`portfolio-item ${item.classes}`} key={i}>
            <img src={item.img} alt={item.title} />
            <div className="portfolio-overlay">
              <p>{item.title}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
