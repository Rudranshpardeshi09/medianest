import { useState } from 'react'
import { Container } from '@/future/components/ui/Container'
import { Button } from '@/future/components/common/Button'
import { contactFormFields, site } from '@/future/data/site'
import './Contact.css'

const emptyForm = Object.fromEntries(contactFormFields.map((field) => [field.name, '']))

function ContactDetails() {
  return (
    <div className="contact__details">
      <div>
        <p className="eyebrow">Email</p>
        <a href={site.contact.emailHref}>{site.contact.email}</a>
      </div>
      <div>
        <p className="eyebrow">Phone number</p>
        <a href={site.contact.phoneHref}>{site.contact.phone}</a>
      </div>
    </div>
  )
}

function ContactForm() {
  const [values, setValues] = useState(emptyForm)
  const [status, setStatus] = useState('idle')

  function handleSubmit(event) {
    event.preventDefault()
    setStatus('success')
  }

  return (
    <form className="contact__form" onSubmit={handleSubmit}>
      {contactFormFields.map((field) => (
        <label key={field.name} className="contact__field">
          <span>{field.label}</span>
          <input
            name={field.name}
            type={field.type}
            required={field.required}
            value={values[field.name]}
            onChange={(event) =>
              setValues((current) => ({ ...current, [field.name]: event.target.value }))
            }
          />
        </label>
      ))}
      <Button type="submit">Send enquiry</Button>
      {status === 'success' ? (
        <p className="contact__status">Thank you. Form handling will be connected later.</p>
      ) : null}
    </form>
  )
}

export function Contact() {
  return (
    <section className="contact" id="contact">
      <Container className="contact__grid">
        <div>
          <p className="eyebrow">Enquiry</p>
          <h2 className="contact__heading">Hello</h2>
          <ContactDetails />
        </div>
        <ContactForm />
      </Container>
    </section>
  )
}
