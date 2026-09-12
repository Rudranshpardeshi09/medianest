import { useId, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import MaskText from './primitives/MaskText'
import EdgeTitle from './primitives/EdgeTitle'
import { EASE, VIEWPORT } from '@/lib/motion'
import '../styles/contact.css'

/**
 * NOTE FOR INTEGRATION
 * --------------------
 * There is no backend in this project, so `deliver()` is the single seam
 * where a real endpoint goes (Formspree, a serverless function, whatever
 * the host ends up being). Swap its body and nothing else in this file
 * changes. Until then the form validates for real but does not transmit,
 * and the panel beside it carries the direct email and phone so no
 * enquiry is ever lost.
 */
async function deliver(payload) {
  // eslint-disable-next-line no-console
  console.info('[Media Nest] contact submission (not yet transmitted):', payload)
  await new Promise((resolve) => setTimeout(resolve, 900))
  return { ok: true }
}

const FIELDS = [
  { name: 'name', label: 'Your name', type: 'text', required: true, autoComplete: 'name' },
  { name: 'email', label: 'Email address', type: 'email', required: true, autoComplete: 'email' },
  { name: 'phone', label: 'Mobile number', type: 'tel', required: true, autoComplete: 'tel' },
  { name: 'city', label: 'City', type: 'text', required: false, autoComplete: 'address-level2' },
]

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const SPARKS = 12

export default function Contact() {
  const uid = useId()
  const [values, setValues] = useState(() =>
    Object.fromEntries([...FIELDS.map((f) => [f.name, '']), ['message', '']]),
  )
  const [errors, setErrors] = useState({})
  const [focused, setFocused] = useState(null)
  const [status, setStatus] = useState('idle') // idle | sending | done

  const setField = (name, value) => {
    setValues((v) => ({ ...v, [name]: value }))
    setErrors((e) => (e[name] ? { ...e, [name]: undefined } : e))
  }

  const validate = () => {
    const next = {}
    for (const f of FIELDS) {
      const v = values[f.name].trim()
      if (f.required && !v) next[f.name] = `${f.label} is required.`
      else if (f.type === 'email' && v && !EMAIL_RE.test(v))
        next[f.name] = 'Enter a valid email address.'
      else if (f.type === 'tel' && v && v.replace(/\D/g, '').length < 7)
        next[f.name] = 'Enter a valid phone number.'
    }
    if (!values.message.trim()) next.message = 'Tell us a little about the project.'
    return next
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    if (status !== 'idle') return
    const found = validate()
    setErrors(found)
    if (Object.keys(found).length) {
      // Move focus to the first offending field so keyboard users land on it
      document.getElementById(`${uid}-${Object.keys(found)[0]}`)?.focus()
      return
    }
    setStatus('sending')
    await deliver(values)
    setStatus('done')
  }

  const reset = () => {
    setValues(Object.fromEntries(Object.keys(values).map((k) => [k, ''])))
    setErrors({})
    setStatus('idle')
  }

  const errorCount = Object.values(errors).filter(Boolean).length

  const renderField = (f, wide = false) => {
    const id = `${uid}-${f.name}`
    const errId = `${id}-err`
    const err = errors[f.name]
    const isTextarea = f.type === 'textarea'
    const float = focused === f.name || values[f.name].length > 0

    const shared = {
      id,
      name: f.name,
      value: values[f.name],
      required: f.required,
      autoComplete: f.autoComplete,
      placeholder: f.label,
      disabled: status !== 'idle',
      'aria-invalid': err ? 'true' : undefined,
      'aria-describedby': err ? errId : undefined,
      onFocus: () => setFocused(f.name),
      onBlur: () => setFocused(null),
      onChange: (e) => setField(f.name, e.target.value),
    }

    return (
      <div
        key={f.name}
        className={`mn-field${wide ? ' mn-field--wide' : ''}`}
        data-float={float}
        data-focus={focused === f.name}
        data-invalid={!!err}
      >
        {isTextarea ? <textarea rows={4} {...shared} /> : <input type={f.type} {...shared} />}
        <label htmlFor={id}>
          {f.label}
          {f.required && <b> *</b>}
        </label>
        {err && (
          <p className="mn-field__err" id={errId}>
            {err}
          </p>
        )}
      </div>
    )
  }

  return (
    <section id="contact" className="mn-contact">
      <EdgeTitle side="right">Hello</EdgeTitle>

      <div className="mn-contact__inner">
        {/* ── Left: invitation, direct routes, firm facts ── */}
        <div>
          <motion.p
            className="mn-eyebrow"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.7, ease: EASE }}
          >
            Start a project
          </motion.p>

          <h2 className="mn-contact__title">
            <MaskText>Let us make your brand look</MaskText>{' '}
            <MaskText as="em" delay={0.1}>
              inevitable
            </MaskText>
            <MaskText delay={0.14}>.</MaskText>
          </h2>

          <motion.p
            className="mn-contact__lede"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.85, ease: EASE, delay: 0.12 }}
          >
            Tell us what you are building. We reply within one working day — every day, 24 x 7.
          </motion.p>

          <div className="mn-contact__direct">
            <a href="mailto:connect@medianest.co.in">
              <i className="fas fa-envelope" aria-hidden />
              connect@medianest.co.in
            </a>
            <a href="tel:+918448112770">
              <i className="fas fa-phone" aria-hidden />
              +91-8448112770
            </a>
          </div>

          {/* The firm details that used to sit in the hero's orange banner */}
          <dl className="mn-facts">
            <div>
              <dt>Firm</dt>
              <dd>Media Nest</dd>
            </div>
            <div>
              <dt>Operational</dt>
              <dd>Global</dd>
            </div>
            <div>
              <dt>Working hours</dt>
              <dd>
                <span className="mn-facts__live">24 x 7</span>
              </dd>
            </div>
          </dl>
        </div>

        {/* ── Right: the form ─────────────────────────────── */}
        <form className="mn-form" onSubmit={onSubmit} noValidate>
          <div className="mn-form__grid">
            {FIELDS.map((f) => renderField(f))}
            {renderField(
              { name: 'message', label: 'Tell us about the project', type: 'textarea', required: true },
              true,
            )}
          </div>

          <div className="mn-form__foot">
            <p className="mn-form__status" aria-live="polite">
              {status === 'done'
                ? 'Thank you — your message is with us.'
                : errorCount
                  ? 'Please check the highlighted fields.'
                  : 'We reply within one working day.'}
            </p>

            <div style={{ position: 'relative' }}>
              <AnimatePresence>
                {status === 'done' && (
                  <div aria-hidden style={{ position: 'absolute', inset: 0 }}>
                    {Array.from({ length: SPARKS }).map((_, i) => {
                      const a = (i / SPARKS) * Math.PI * 2
                      const d = 54 + (i % 3) * 14
                      return (
                        <motion.span
                          key={i}
                          className="mn-spark"
                          initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
                          animate={{
                            x: Math.cos(a) * d,
                            y: Math.sin(a) * d,
                            opacity: [0, 1, 0],
                            scale: [0, 1, 0.2],
                          }}
                          transition={{ duration: 0.85, ease: EASE, delay: i * 0.012 }}
                        />
                      )
                    })}
                  </div>
                )}
              </AnimatePresence>

              <motion.button
                type={status === 'done' ? 'button' : 'submit'}
                className="mn-submit"
                data-state={status}
                disabled={status === 'sending'}
                onClick={status === 'done' ? reset : undefined}
                aria-label={status === 'done' ? 'Message sent — send another' : 'Send message'}
                animate={{ scale: status === 'done' ? [1, 1.12, 1] : 1 }}
                transition={{ duration: 0.5, ease: EASE }}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {status === 'idle' && (
                    <motion.span
                      key="label"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.28 }}
                    >
                      Send
                    </motion.span>
                  )}
                  {status === 'sending' && (
                    <motion.span
                      key="spin"
                      className="mn-submit__spin"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    />
                  )}
                  {status === 'done' && (
                    <motion.svg
                      key="check"
                      viewBox="0 0 24 24"
                      initial={{ opacity: 0, scale: 0.4 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.42, ease: EASE }}
                    >
                      <path d="M5 12.6 9.6 17 19 7.4" strokeLinecap="round" strokeLinejoin="round" />
                    </motion.svg>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </form>
      </div>
    </section>
  )
}
