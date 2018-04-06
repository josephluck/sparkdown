import * as path from 'path'

export function hasLength<A extends any[] | string>(str: A): boolean {
  return str.length > 0
}

export function capitalizeString(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function dashifyString(str: string): string {
  return str.replace(/\s/g, '-')
}

export function spacifyString(str: string): string {
  return str.split(/^([a-zA-Z0-9]+ )$/).filter(hasLength).join(' ')
}

export function stripQuotesFromString(str: string): string {
  const split = str.split('&#39;')
  return split.length > 1 ? split[1] : split[0]
}

export function isRelativePath(href: string): boolean {
  return !href.includes('http://') && !href.includes('https://')
}

// Takes a href and returns a path based on whether the link is external or internal
export function transformHref(root: string, href: string): string {
  const ref = stripQuotesFromString(href)
  return isRelativePath(ref) ? `${path.resolve(root, ref)}.html` : ref
}

// "some-long-title.md" -> "Some Long Title" 
// "shorter-title.md" -> "Shorter Title" 
// "title.md" -> "Title"
export function directoryNameToTitle(dirName: string): string | null {
  const fileName = dirName.split('.')[0]
  const withoutAlphanumeric = spacifyString(fileName).split(' ')
  const name = withoutAlphanumeric.length
    ? withoutAlphanumeric.map(capitalizeString).join(' ')
    : capitalizeString(fileName[0])
  return name === 'Index' ? 'Home' : name
}
