import * as marked from 'marked'

function stripQuotesFromString(str: string): string {
  const split = str.split('&#39;')
  return split.length > 1 ? split[1] : split[0]
}

// Removes the leading '/' from a relative url
function relativeToPath(href: string) {
  return href.split('/')[1]
}

// If the href beings with a '/' such as '/foo/bar/baz'
function isRelativePath(href: string) {
  return href.split('/').length > 1
}

// Takes a href and returns a path based on whether the link is external or internal
function transformHref(href: string): string {
  const ref = stripQuotesFromString(href)
  return isRelativePath(ref) ? `${relativeToPath(ref)}.html` : ref
}

export default function parser(
  input: string,
  theme: () => marked.Renderer,
  options?: marked.MarkedOptions,
) {
  const thm = theme()
  const renderer: marked.Renderer = {
    ...thm,
    link(href, title, text) {
      return thm.link(transformHref(href), title, text)
    },
  } as marked.Renderer
  marked.setOptions({ renderer })
  return marked(input)
}
