import { ClientLogo } from './ClientLogo'

export function ClientLogoGrid({ items }) {
  return (
    <ul className="client-logo-grid">
      {items.map((client) => (
        <ClientLogo key={client.id} client={client} />
      ))}
    </ul>
  )
}
