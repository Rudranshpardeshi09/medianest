import { Testimonial } from './Testimonial'
import { SliderControls } from './SliderControls'

export function TestimonialSlider({ items, index, onPrev, onNext }) {
  const current = items[index]

  return (
    <div className="testimonial-slider">
      {current ? <Testimonial item={current} /> : null}
      {items.length > 1 ? (
        <SliderControls
          onPrev={onPrev}
          onNext={onNext}
          index={index}
          total={items.length}
        />
      ) : null}
    </div>
  )
}
