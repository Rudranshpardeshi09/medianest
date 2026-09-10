import { Container } from '@/components/ui/Container'
import './PageContainer.css'

export function PageContainer({ children, className = '' }) {
  return (
    <div className={`page-container ${className}`.trim()}>
      <Container>{children}</Container>
    </div>
  )
}
