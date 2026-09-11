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
    { img: '/media/photography.webp', title: 'Photography', classes: 'p-half p-full-height' },
    { img: '/media/cinematography_main.webp', title: 'CINEMATOGRAPHY', classes: 'p-half' },
    { img: '/media/INTERVIEW.webp', title: 'INTERVIEW', classes: '' },
    { img: '/media/LIVE-STREAM.webp', title: 'LIVE STREAM', classes: '' },
    { img: '/media/video-edit.webp', title: 'VIDEO EDIT', classes: '' },
    { img: '/media/graphic-1.webp', title: 'GRAPHIC DESIGN', classes: 'p-full-height' },
    { img: '/media/EVENT.webp', title: 'EVENT', classes: 'p-half p-full-height' },
    { img: '/media/new_DIGITAL-MARKETING.webp', title: 'DIGITAL MARKETING', classes: '' },
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
