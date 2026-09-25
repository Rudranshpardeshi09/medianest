/**
 * The CMS payload, as the components see it.
 *
 * `content.generated.json` is written by `scripts/fetch-content.mjs` during
 * the build and committed, so this import is resolved by Vite at bundle time.
 * Nothing here runs in the browser and nothing is fetched at runtime: the page
 * ships with its content already in it.
 *
 * That is the whole point. The site has 29 scroll-triggered reveals and a hero
 * that animates on mount; content arriving after first paint would animate
 * empty boxes and shift the layout above the fold. Baking it in removes the
 * problem rather than managing it.
 */
import data from './content.generated.json'

export const SETTINGS = data.settings
export const ABOUT = data.about
export const SERVICES = data.services
export const SERVICE_STRIP = data.service_strip
export const DISCIPLINES = data.disciplines
export const WHY_CHOOSE = data.why_choose
export const TEAM = data.team
export const TESTIMONIALS = data.testimonials
export const CLIENTS = data.clients
export const CONTACT = data.contact
export const FOOTER = data.footer

/**
 * The firm's own accounts. Not under `FOOTER`, because two places show them:
 * the footer's column and the header's mobile menu. The menu used to carry
 * its own list of four, so changing an account updated one and not the other.
 */
export const SOCIAL = data.social

/**
 * Where to reach the firm, in the forms the page needs.
 *
 * Three components print these -- the contact panel, the footer and the
 * header's mobile menu -- and the footer wraps the number in a WhatsApp link.
 * The number is stored twice in the CMS (as it reads, and as it dials) and the
 * WhatsApp URL is built here rather than stored, so a changed number cannot
 * leave a stale link behind.
 */
export const REACH = {
  firm: SETTINGS.firm_name,
  email: SETTINGS.email,
  emailHref: `mailto:${SETTINGS.email}`,
  phone: SETTINGS.phone_display,
  phoneHref: `tel:${SETTINGS.phone_e164}`,
  // wa.me wants the digits without the leading plus.
  whatsappHref:
    `https://wa.me/${SETTINGS.phone_e164.replace(/^\+/, '')}` +
    `?text=${encodeURIComponent(SETTINGS.whatsapp_message)}`,
}

/**
 * Splits a heading on its *accented* span.
 *
 * The CMS stores `We shape the way a brand is *seen*, frame by frame.` --
 * plain text with asterisks, not HTML, because an admin should not be writing
 * markup and a stray tag should not be able to reach the page.
 *
 * Returns the three parts in order. An unaccented heading yields just the one,
 * which is why the caller maps rather than destructures.
 */
export function splitAccent(text) {
  const m = /^(.*?)\*(.+?)\*(.*)$/s.exec(text || '')
  if (!m) return [{ text: text || '', accent: false }]
  return [
    { text: m[1], accent: false },
    { text: m[2], accent: true },
    { text: m[3], accent: false },
  ].filter((p) => p.text !== '')
}

/** `object-position` for a CMS image, from its stored focal point. */
export const focal = (o) => `${o?.focal_x ?? 50}% ${o?.focal_y ?? 50}%`

/** The number the page prints beside a list item: 1 -> "01". */
export const pad2 = (n) => String(n).padStart(2, '0')
