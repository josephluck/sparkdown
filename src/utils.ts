export function dashifyString(str: string): string {
  return str.replace(/\s/g, '-')
}

export function hasLength<A extends any[] | string>(str: A): boolean {
  return str.length > 0
}

export function capitalizeString(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function spacifyString(str: string): string {
  return str.split(/^([a-zA-Z0-9]+ )$/).filter(hasLength).join(' ')
}

export function stripQuotesFromString(str: string): string {
  const split = str.split('&#39;')
  return split.length > 1 ? split[1] : split[0]
}