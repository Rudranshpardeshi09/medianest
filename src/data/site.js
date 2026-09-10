export const site = {
  name: 'MediaNest',
  legalName: 'Media Nest',
  tagline: 'Brand Image Management & Consultancy',
  description:
    'MediaNest specializes in creating and curating impactful visual content to strengthen brand presence and identity.',
  contact: {
    email: 'connect@medianest.co.in',
    phone: '+91-8448112770',
    phoneHref: 'tel:+918448112770',
    emailHref: 'mailto:connect@medianest.co.in',
  },
  workingHours: '24 x 7',
  operational: 'Global',
  socialLinks: [
    { label: 'Instagram', href: '#' },
    { label: 'LinkedIn', href: '#' },
    { label: 'YouTube', href: '#' },
  ],
}

export const aboutFacts = [
  { label: 'Firm', value: site.legalName },
  { label: 'Operational', value: site.operational },
  { label: 'Mobile', value: site.contact.phone },
  { label: 'Email', value: site.contact.email },
  { label: 'Working Hours', value: site.workingHours },
]

export const aboutContent = {
  eyebrow: 'About',
  heading: 'A holistic approach to brand image.',
  statement:
    'MediaNest is a brand image management and consultancy focused on visual communication and brand presentation.',
  description:
    'We create and curate visual and tangible content that drives engagement, trust, and a lasting presence. From photography and cinematography to strategy, events, and digital marketing, every engagement is designed to position brands with clarity and craft.',
  cta: { label: 'Know more', href: '/about' },
}

export const heroContent = {
  eyebrow: 'MediaNest',
  heading: 'Brand Image Management & Consultancy',
  description:
    'Creating and curating impactful visual content to strengthen brand presence, identity, and story.',
  cta: { label: 'Explore our work', href: '/projects' },
}

export const contactFormFields = [
  { name: 'name', label: 'Name', type: 'text', required: true },
  { name: 'city', label: 'City', type: 'text', required: false },
  { name: 'country', label: 'Country', type: 'text', required: false },
  { name: 'mobile', label: 'Mobile Number', type: 'tel', required: true },
  { name: 'email', label: 'Email', type: 'email', required: true },
]
