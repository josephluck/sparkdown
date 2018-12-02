import * as marked from 'marked'
import { transformHref } from './utils'
import * as hljs from 'highlight.js'

export default function parser(input: string, theme: () => marked.Renderer, root: string) {
  const thm = theme()
  const renderer: marked.Renderer = {
    ...thm,
    link: (href, title, text) => thm.link(transformHref(root, href), title, text),
  } as marked.Renderer

  marked.setOptions({
    renderer,
    breaks: false,
    gfm: true,
    headerPrefix: '',
    highlight: (code, lang) => {
      return !!hljs.getLanguage(lang) ? hljs.highlight(lang, code).value : hljs.highlightAuto(code).value
    },
    mangle: true,
    pedantic: false,
    sanitize: false,
    sanitizer: null,
    silent: false,
    smartLists: false,
    smartypants: false,
    tables: true,
    xhtml: false,
  })
  return marked(input)
}
