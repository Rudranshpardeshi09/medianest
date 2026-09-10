import { useRef, useState, useEffect } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

/**
 * Magnetic hover — element cursor ki taraf lean karta hai, chhodne par
 * spring se wapas aa jata hai.
 *
 * `strength` cursor ke centre-offset ka wo hissa hai jitna element travel
 * karta hai. Jaan-boojh kar kam rakha gaya (0.2–0.35); isse zyada par ye
 * charm ki jagah bug jaisa lagta hai.
 *
 * Fine pointer + no reduced-motion ke bina ye kuch nahi karta — touch par
 * cursor hi nahi hota, aur reduced-motion wale users ko ye chahiye hi nahi.
 */
export default function Magnetic({ children, strength = 0.28, padding = 20, className = '' }) {
  const ref = useRef(null)
  const [enabled, setEnabled] = useState(false)

  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 150, damping: 18, mass: 0.4 })
  const sy = useSpring(y, { stiffness: 150, damping: 18, mass: 0.4 })

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)')
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setEnabled(fine.matches && !reduced.matches)
    update()
    fine.addEventListener('change', update)
    reduced.addEventListener('change', update)
    return () => {
      fine.removeEventListener('change', update)
      reduced.removeEventListener('change', update)
    }
  }, [])

  const onMove = (e) => {
    if (!enabled || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    const dx = e.clientX - (r.left + r.width / 2)
    const dy = e.clientY - (r.top + r.height / 2)
    // Padded radius ke bahar ignore karo taaki spring rest kar sake.
    if (Math.abs(dx) > r.width / 2 + padding) return
    if (Math.abs(dy) > r.height / 2 + padding) return
    x.set(dx * strength)
    y.set(dy * strength)
  }

  const reset = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={enabled ? { x: sx, y: sy, display: 'inline-flex' } : { display: 'inline-flex' }}
      onPointerMove={onMove}
      onPointerLeave={reset}
      onBlur={reset}
    >
      {children}
    </motion.div>
  )
}
