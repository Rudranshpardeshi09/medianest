import { useEffect, useRef } from 'react'

export default function Team() {
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

  return (
    <section id="team" className="section section-team" ref={ref}>
      <div className="rotate-title" style={{ color: 'rgba(255,255,255,0.08)' }}>FOUNDERS</div>

      {/* Aditi Singh */}
      <div className="team-member">
        <div className="team-photo animate-on-scroll fade-in-left">
          <img src="/media/ADITI-MAM-1.webp" alt="Aditi Singh" />
        </div>
        <div className="team-info animate-on-scroll fade-in">
          <h3>ADITI SINGH</h3>
          <p className="role">Managing Partner</p>
          <p className="desc">Still Life &amp; Sports Photographer</p>
          <p className="desc">Artist &amp; Poet</p>
          <div className="team-social">
            <a href="https://www.instagram.com/aditisinghphotography" target="_blank" rel="noreferrer">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="https://youtube.com/@aditisinghphotography" target="_blank" rel="noreferrer">
              <i className="fab fa-youtube"></i>
            </a>
          </div>
        </div>
      </div>

      {/* Vivek Pathak */}
      <div className="team-member reverse">
        <div className="team-info animate-on-scroll fade-in">
          <h3>VIVEK PATHAK</h3>
          <p className="role">Managing Partner</p>
          <p className="desc">Former Athlete</p>
          <p className="desc">Sports Administrator</p>
          <p className="desc">Sports &amp; Profiling Photographer</p>
          <div className="team-social">
            <a href="https://www.instagram.com/pafcoms" target="_blank" rel="noreferrer">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="https://www.linkedin.com/in/vivek-pathak-5257312a" target="_blank" rel="noreferrer">
              <i className="fab fa-linkedin-in"></i>
            </a>
          </div>
        </div>
        <div className="team-photo animate-on-scroll fade-in-right">
          <img src="/media/VIVEK-SIR-2.webp" alt="Vivek Pathak" />
        </div>
      </div>
    </section>
  )
}
