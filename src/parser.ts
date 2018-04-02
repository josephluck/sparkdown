import * as marked from 'marked'
import { transformHref } from './utils';

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
