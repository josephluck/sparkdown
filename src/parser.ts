import * as marked from 'marked'
import * as path from 'path'

function stripQuotesFromString(str: string): string {
  const split = str.split('&#39;')
  return split.length > 1 ? split[1] : split[0]
}

export function dashifyString(str: string): string {
  return str.replace(/\s/g, '-')
}

function isRelativePath(href: string): boolean {
  return !href.includes('http://') && !href.includes('https://')
}

// Takes a href and returns a path based on whether the link is external or internal
function transformHref(root: string, href: string): string {
  const ref = stripQuotesFromString(href)
  return isRelativePath(ref) ? `${path.resolve(root, ref)}.html` : ref
}

export default function parser(
  input: string,
  theme: () => marked.Renderer,
  root: string,
) {
  const thm = theme()
  const renderer: marked.Renderer = {
    ...thm,
    link: (href, title, text) => thm.link(transformHref(root, href), title, text),
  } as marked.Renderer
  marked.setOptions({ renderer, pedantic: true, gfm: false })
  return marked(input)
}
