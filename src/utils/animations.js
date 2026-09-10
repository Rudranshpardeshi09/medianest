export const animationNames = [
  'fade-up',
  'fade-in',
  'image-reveal',
  'text-reveal',
  'scale-in',
  'slide-in',
  'hover-image',
  'hover-arrow',
  'page-transition',
]

export function getAnimationClass(name) {
  return animationNames.includes(name) ? `anim-${name}` : ''
}
