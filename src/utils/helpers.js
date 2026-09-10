export function classNames(...values) {
  return values.filter(Boolean).join(' ')
}

export function formatPhone(value) {
  return value?.replace(/\s+/g, '') ?? ''
}
