import { classNames } from '@/utils/helpers'
import './Container.css'

export function Container({ children, className, as: Tag = 'div' }) {
  return <Tag className={classNames('container', className)}>{children}</Tag>
}
