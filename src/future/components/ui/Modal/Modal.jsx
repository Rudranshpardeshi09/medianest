import { useEffect } from 'react'
import './Modal.css'

export function Modal({ open, onClose, title, children }) {
  useEffect(() => {
    if (!open) return undefined
    const onKey = (event) => {
      if (event.key === 'Escape') onClose?.()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="modal" role="dialog" aria-modal="true" aria-label={title}>
      <button className="modal__backdrop" aria-label="Close" onClick={onClose} />
      <div className="modal__panel">
        <button className="modal__close" type="button" onClick={onClose}>
          Close
        </button>
        {children}
      </div>
    </div>
  )
}
