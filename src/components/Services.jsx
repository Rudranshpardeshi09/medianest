import { useEffect, useRef } from 'react'

export default function Services() {
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

  const services = [
    {
      img: '/media/PHOTOGRAPHY-AND-BRAND-1.webp',
      title: "Photography & Brand's Visual Presence",
      desc: 'Professional photography that highlights the unique aspects of your brand.',
    },
    {
      img: '/media/CINEMATOGRAPHY-PRODUCTION-1.webp',
      title: 'Cinematography & Quality Production',
      desc: 'Creative storytelling through high-quality, engaging film content.',
    },
    {
      img: '/media/BRAND-IMAGE-STRATEGY-1.webp',
      title: "Brand Image Strategy & Consultation",
      desc: "Tailored guidance to refine and align your brand's image with its business goals.",
    },
  ]

  return (
    <section id="services" className="section section-services" ref={ref}>
      <div className="rotate-title">SERVICES</div>
      <div className="section-inner">
        <div className="services-grid animate-on-scroll fade-in">
          {services.map((service, i) => (
            <div className="service-card" key={i}>
              <img src={service.img} alt={service.title} />
              <h4>{service.title}</h4>
              <p>{service.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
