export default function Hero() {
  return (
    <section id="home" className="section-hero">
      <div className="hero-content">
        <h1 className="hero-title">Brand Image<br />Management &amp; Consultancy</h1>
        <p className="hero-desc">
          Media Nest is a premier Brand Image Management and Consultancy firm specializing in creating and curating impactful visual content that amplifies brand presence and identity. With over 5+ years of expertise, our team of seasoned professionals brings a wealth of industry knowledge and a deep understanding of how visual storytelling can elevate brands across industries.
        </p>
        <a href="#services" className="hero-btn" onClick={(e) => { e.preventDefault(); document.querySelector('#services')?.scrollIntoView({ behavior: 'smooth' }) }}>
          <img src="/images/orange_arrow.png" alt="" className="arrow-icon" />
          <span>READ MORE</span>
        </a>
      </div>

      {/* Info Banner */}
      <div className="info-banner">
        <div className="info-banner-inner">
          <div className="info-col">
            <p><b>Firm</b></p>
            <p>Media Nest</p>
            <p><strong>Operational</strong></p>
            <p>Global</p>
          </div>
          <div className="info-col">
            <p><strong>Mobile</strong></p>
            <p>+91-8448112770</p>
            <p><strong>Connect</strong></p>
            <div className="social-icons-banner">
              <a href="http://www.facebook.com" target="_blank" rel="noreferrer"><i className="fab fa-facebook-f"></i></a>
              <a href="https://www.instagram.com/medianest.official" target="_blank" rel="noreferrer"><i className="fab fa-instagram"></i></a>
              <a href="https://wa.me/918448112770?text=Hi%2C%20I%20visited%20your%20website%20and%20want%20to%20know%20more." target="_blank" rel="noreferrer"><i className="fab fa-whatsapp"></i></a>
            </div>
          </div>
          <div className="info-col">
            <p><strong>Email</strong></p>
            <p><a href="mailto:connect@medianest.co.in">connect@medianest.co.in</a></p>
            <p><b>Working Hours</b></p>
            <p>24 x 7</p>
          </div>
        </div>
      </div>
    </section>
  )
}
