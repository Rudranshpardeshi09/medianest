import { classNames } from '@/future/utils/helpers'
import './Divider.css'

export function Divider({ className }) {
  return <hr className={classNames('divider', className)} />
}
