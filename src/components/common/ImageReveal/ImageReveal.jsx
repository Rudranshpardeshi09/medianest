import { useState } from 'react'
import './ImageReveal.css'

export function ImageReveal({ src, alt = '', label }) {
  const [failed, setFailed] = useState(!src)
  const caption = label || alt || 'Image'

  if (failed) {
    return (
      <div className="image-reveal media-placeholder" role="img" aria-label={caption}>
        {caption}
      </div>
    )
  }

  return (
    <figure className="image-reveal">
      <img src={src} alt={alt} onError={() => setFailed(true)} />
    </figure>
  )
}
