import { ReasonItem } from './ReasonItem'

export function ReasonList({ reasons }) {
  return (
    <ol className="reason-list">
      {reasons.map((reason) => (
        <ReasonItem key={reason.number} reason={reason} />
      ))}
    </ol>
  )
}
