/**
 * The site's one navigation list.
 *
 * It lived in two files, written out identically in each: the header used it
 * for the bar, the scroll-spy and the mobile menu, and the footer for its own
 * column. Two copies of the same seven items is one copy that eventually
 * disagrees.
 *
 * **Not editable from the CMS, deliberately.** Each `id` has to match a
 * section's id in the markup or the link scrolls nowhere and the scroll-spy
 * stops marking anything, and those ids are set in the components. An admin
 * given this list could rename a label harmlessly and break every link with
 * the next field along. The labels are the only safe half, and they are not
 * worth the risk of the other one.
 */
export const NAV = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About Us' },
  { id: 'services', label: 'Services' },
  { id: 'projects', label: 'Projects' },
  { id: 'team', label: 'Team' },
  { id: 'clients', label: 'Clients' },
  { id: 'contact', label: 'Contact' },
]
