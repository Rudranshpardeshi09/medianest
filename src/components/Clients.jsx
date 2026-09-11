import { useEffect, useRef } from 'react'

export default function Clients() {
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

  const row1 = [
    { img: '/media/IBSF-Logo.webp', link: 'https://www.instagram.com/ibsf.media/', alt: 'IBSF' },
    { img: '/media/ACBS-LOGO.webp', link: 'https://www.instagram.com/acbsmedia/', alt: 'ACBS' },
    { img: '/media/PABSA-LOGO.webp', link: 'https://www.instagram.com/pabsaofficial/', alt: 'PABSA' },
    { img: '/media/OGQ_logo_dark.webp', link: 'https://www.ogq.org', alt: 'OGQ' },
  ]

  const row2 = [
    { img: '/media/indianoil.webp', link: 'https://iocl.com', alt: 'Indian Oil' },
    { img: '/media/OIL.webp', link: 'https://www.oil-india.com', alt: 'OIL' },
    { img: '/media/PSPB-Logo-White-Background.webp', link: 'https://www.instagram.com/pspblive/', alt: 'PSPB' },
    { img: '/media/CSI-Logo-Round-1.webp', link: 'https://www.instagram.com/cuesportsindia/', alt: 'CSI' },
  ]

  return (
    <section id="clients" className="section section-clients" ref={ref}>
      <div className="section-inner center-text">
        <div className="clients-icon">
          <i className="fas fa-cog"></i> <i className="fas fa-star" style={{ fontSize: '10px' }}></i>
        </div>
        <div className="clients-title">CLIENTS</div>
      </div>

      <div style={{ maxWidth: '900px', margin: '40px auto 0', padding: '0 40px' }}>
        <div className="clients-grid animate-on-scroll fade-in-up">
          {row1.map((client, i) => (
            <div className="client-logo" key={i}>
              <a href={client.link} target="_blank" rel="noreferrer">
                <img src={client.img} alt={client.alt} />
              </a>
            </div>
          ))}
        </div>

        <div className="clients-grid animate-on-scroll fade-in-up" style={{ marginTop: '30px' }}>
          {row2.map((client, i) => (
            <div className="client-logo" key={i}>
              <a href={client.link} target="_blank" rel="noreferrer">
                <img src={client.img} alt={client.alt} />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
