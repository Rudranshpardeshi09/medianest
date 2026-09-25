/**
 * How each platform is drawn and named.
 *
 * The CMS stores only the platform key -- `instagram` -- because the icon is a
 * CSS class belonging to the font that draws it, and a class typed into a text
 * field is a broken icon waiting to happen. The mapping lives here, in one
 * place, because two things need it: a partner's own accounts in the team
 * section and the firm's own in the footer.
 */
export const PLATFORM = {
  instagram: { icon: 'fab fa-instagram', name: 'Instagram' },
  youtube: { icon: 'fab fa-youtube', name: 'YouTube' },
  linkedin: { icon: 'fab fa-linkedin-in', name: 'LinkedIn' },
  facebook: { icon: 'fab fa-facebook-f', name: 'Facebook' },
  whatsapp: { icon: 'fab fa-whatsapp', name: 'WhatsApp' },
}
