import * as marked from 'marked'
import { transformHref } from './utils'
import * as hljs from 'highlight.js'

export default function parser(input: string, theme: () => marked.Renderer, currentDir: string, currentHtmlLink: string) {
  const thm = theme()
  const renderer: marked.Renderer = {
    ...thm,
    link: (originalHref, title, text) => {
      const { href, isExternal } = transformHref(currentDir, originalHref)
      return (thm.link as any)(href, title, text, isExternal)
    },
    heading: (text, level, raw) => {
      return (thm.heading as any)(text, level, raw, currentHtmlLink)
    },
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
