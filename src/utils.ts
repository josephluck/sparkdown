import * as path from 'path'

export function hasLength<A extends any[] | string>(str: A): boolean {
  return str.length > 0
}

export function capitalizeString(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function dashifyString(str: string): string {
  return str.toLowerCase().replace(/\s/g, '-')
}

export function stripSpecialChars(str: string): string {
  return str.replace(/[^\w\s]/gi, '')
}

export function stripWhiteSpace(str: string): string {
  return str.replace(/\s/g, '')
}

export function spacifyString(str: string): string {
  return str
    .split(/^([a-zA-Z0-9]+ )$/)
    .filter(hasLength)
    .join(' ')
}

export function hashLinkString(str: string): string {
  return stripSpecialChars(stripWhiteSpace(str)).toLowerCase()
}

export function stripQuotesFromString(str: string): string {
  const split = str.split('&#39;')
  return split.length > 1 ? split[1] : split[0]
}

export function isRelativePath(href: string): boolean {
  return !href.includes('http://') && !href.includes('https://')
}

export interface TransformedHref {
  href: string
  isExternal: boolean
}

// Takes a href and returns a path based on whether the link is external or internal
export function transformHref(root: string, originalHref: string): TransformedHref {
  const href = stripQuotesFromString(originalHref)
  const isExternal = !isRelativePath(href)
  const isHashbang = href.startsWith('#')
  const containsHashbang = href.includes('#')
  if (isHashbang) {
    return { href: `#${hashLinkString(href)}`, isExternal: false }
  } else if (isExternal) {
    return { href, isExternal }
  } else if (containsHashbang) {
    const hashbangSplit = href.split('#')
    const htmlFilePath = `${path.resolve(root, hashbangSplit[0])}`
    const hashbang = `#${hashLinkString(hashbangSplit[1])}`
    const transformedHref = `${htmlFilePath}.html${hashbang}`
    return { href: transformedHref, isExternal }
  } else {
    return { href: `${path.resolve(root, href)}.html`, isExternal }
  }
}

// "some-long-title.md" -> "Some Long Title"
// "shorter-title.md" -> "Shorter Title"
// "title.md" -> "Title"
export function directoryNameToTitle(dirName: string): string | null {
  const fileName = dirName.split('.')[0]
  const withoutAlphanumeric = spacifyString(fileName).split(' ')
  const name = withoutAlphanumeric.length ? withoutAlphanumeric.map(capitalizeString).join(' ') : capitalizeString(fileName[0])
  return name === 'Index' ? 'Home' : name
}
