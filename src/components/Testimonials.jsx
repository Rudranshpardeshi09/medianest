import { useState } from 'react'

export default function Testimonials() {
  const [active, setActive] = useState(0)

  const testimonials = [
    {
      content: 'MediaNest helps power PABSA, bringing billiards and snooker to the forefront in the Americas. We extends best wishes for their continued growth and success.',
      img: '/media/ajeya-1.webp',
      name: 'AJEYA PRABHAKAR',
      position: 'President, Pan American Billiards & Snooker Association',
    },
    {
      content: 'I extend my best wishes to the Media Nest team for continued success and creative excellence. As you lead the way in brand image management, may your innovative ideas keep inspiring brilliance and leaving a lasting impact on the brands you collaborate with.',
      img: '/media/spskalra.webp',
      name: 'SPS KALRA',
      position: 'Fashion & Cinematic Photographer',
    },
  ]

  return (
    <section id="video" className="section section-testimonials">
      <div className="rotate-title">assertion</div>
      <div className="section-inner">
        <div className="testimonial-slider">
          <div className="testimonial-content">
            {testimonials[active].content}
          </div>
          <img
            src={testimonials[active].img}
            alt={testimonials[active].name}
            className="testimonial-img"
          />
          <div className="testimonial-name">{testimonials[active].name}</div>
          <div className="testimonial-position">{testimonials[active].position}</div>
          <div className="testimonial-dots">
            {testimonials.map((_, i) => (
              <button
                key={i}
                className={`testimonial-dot${i === active ? ' active' : ''}`}
                onClick={() => setActive(i)}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
