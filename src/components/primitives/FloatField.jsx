/**
 * A band of drifting geometry, for the dead space where one section's
 * bottom padding meets the next one's top padding.
 *
 * Measured on this page: 207px between the last testimonial control and the
 * Clients heading, and 205px between the Clients count and the Contact
 * eyebrow. Both read as the page having run out of things to say.
 *
 * Purely decorative — aria-hidden, pointer-events: none, and it carries no
 * information that isn't already in the copy. `place` picks which edge of
 * the host section it pins to.
 */
export default function FloatField({ place = 'top', variant = 'a', className = '' }) {
  return (
    <span
      className={`mn-float mn-float--${place} mn-float--${variant} ${className}`}
      aria-hidden
    >
      <i className="mn-float__ring mn-float__ring--a" />
      <i className="mn-float__ring mn-float__ring--b" />
      <i className="mn-float__dots" />
      <i className="mn-float__sq" />
      <i className="mn-float__rule" />
      <i className="mn-float__dot mn-float__dot--1" />
      <i className="mn-float__dot mn-float__dot--2" />
      <i className="mn-float__dot mn-float__dot--3" />
    </span>
  )
}
