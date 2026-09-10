export function SliderControls({ onPrev, onNext, index, total }) {
  return (
    <div className="slider-controls">
      <button type="button" onClick={onPrev} aria-label="Previous testimonial">
        Prev
      </button>
      <span>
        {index + 1} / {total}
      </span>
      <button type="button" onClick={onNext} aria-label="Next testimonial">
        Next
      </button>
    </div>
  )
}
