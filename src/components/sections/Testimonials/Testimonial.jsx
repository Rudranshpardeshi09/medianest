export function Testimonial({ item }) {
  return (
    <blockquote className="testimonial">
      <p>“{item.quote}”</p>
      <footer>
        <cite>{item.name}</cite>
        <span>
          {[item.designation, item.company].filter(Boolean).join(', ')}
        </span>
      </footer>
    </blockquote>
  )
}
