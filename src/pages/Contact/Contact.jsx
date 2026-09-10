import { PageHeader } from '@/components/layout/PageHeader'
import { Contact } from '@/components/sections/Contact'

export function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Start a conversation."
        description="Enquiry form and studio details. Backend integration will follow later."
      />
      <Contact />
    </>
  )
}
