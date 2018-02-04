import * as marked from 'marked'
import * as path from 'path'

function stripQuotesFromString(str: string): string {
  const split = str.split('&#39;')
  return split.length > 1 ? split[1] : split[0]
}

// If the href beings with a '/' such as '/foo/bar/baz'
function isRelativePath(href: string): boolean {
  return !href.includes('http://') && !href.includes('https://')
}

// Takes a href and returns a path based on whether the link is external or internal
function transformHref(cwd: string, href: string): string {
  const ref = stripQuotesFromString(href)
  return isRelativePath(ref) ? `${path.resolve(cwd, ref)}.html` : ref
}

export default function parser(
  input: string,
  theme: () => marked.Renderer,
  cwd: string,
  options?: marked.MarkedOptions,
) {
  const thm = theme()
  const renderer: marked.Renderer = {
    ...thm,
    link(href, title, text) {
      return thm.link(transformHref(cwd, href), title, text)
    },
  } as marked.Renderer
  marked.setOptions({ renderer })
  return marked(input)
}
