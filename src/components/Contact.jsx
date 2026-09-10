import { useState, useEffect, useRef } from 'react'

export default function Contact() {
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

  const [form, setForm] = useState({ name: '', city: '', country: '', phone: '', email: '', message: '' })

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = (e) => {
    e.preventDefault()
    alert('Thank you for your message! We will get back to you soon.')
    setForm({ name: '', city: '', country: '', phone: '', email: '', message: '' })
  }

  return (
    <section id="contact" className="section section-contact" ref={ref}>
      <div className="rotate-title">HELLO</div>
      <div className="section-inner">
        <div className="contact-grid">
          <div className="contact-info animate-on-scroll fade-in" style={{ animationDelay: '0.4s' }}>
            <p>&nbsp;</p>
            <p><strong>EMAIL: </strong><a href="mailto:connect@medianest.co.in">connect@medianest.co.in</a></p>
            <p><strong>PHONE NUMBER: </strong>+91-8448112770</p>

            <div className="contact-social animate-on-scroll fade-in-up" style={{ animationDelay: '0.4s' }}>
              <a href="https://www.facebook.com/medianest2024" target="_blank" rel="noreferrer">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="https://www.instagram.com/medianest.official/" target="_blank" rel="noreferrer">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" rel="noreferrer">
                <i className="fab fa-x-twitter"></i>
              </a>
              <a href="https://youtube.com/@medianesttv?feature=shared" target="_blank" rel="noreferrer">
                <i className="fab fa-youtube"></i>
              </a>
              <a href="https://www.linkedin.com/company/104838310/" target="_blank" rel="noreferrer">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </div>

          <div className="contact-form animate-on-scroll fade-in-up">
            <form onSubmit={handleSubmit}>
              <input type="text" name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
              <input type="text" name="city" placeholder="City" value={form.city} onChange={handleChange} required />
              <input type="text" name="country" placeholder="Country" value={form.country} onChange={handleChange} required />
              <input type="text" name="phone" placeholder="Mobile Number" value={form.phone} onChange={handleChange} required />
              <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
              <textarea name="message" placeholder="Message" value={form.message} onChange={handleChange} required rows="5"></textarea>
              <button type="submit">Submit</button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
