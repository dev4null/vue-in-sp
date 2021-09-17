/* Polyfill for Object.forEntries() */
export function ObjectFromEntries(entries) {
  const o = {}
  if (Array.isArray(entries)) {
    entries.forEach(entry => {
      if (Array.isArray(entry) && entry.length === 2) o[entry[0]] = entry[1]
    })
  }
  return o
}
