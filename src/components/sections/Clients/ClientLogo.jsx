export function ClientLogo({ client }) {
  return (
    <li className="client-logo">
      {client.website ? (
        <a href={client.website} target="_blank" rel="noreferrer">
          {client.name}
        </a>
      ) : (
        <span>{client.name}</span>
      )}
    </li>
  )
}
