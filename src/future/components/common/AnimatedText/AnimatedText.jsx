import './AnimatedText.css'

export function AnimatedText({ as: Tag = 'span', children, className = '' }) {
  return <Tag className={`animated-text ${className}`.trim()}>{children}</Tag>
}
