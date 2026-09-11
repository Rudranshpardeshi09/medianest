export function ReasonItem({ reason }) {
  return (
    <li className="reason-item">
      <p className="reason-item__number">{reason.number}</p>
      <div>
        <h3>{reason.title}</h3>
        <p>{reason.description}</p>
      </div>
    </li>
  )
}
