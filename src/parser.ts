import * as marked from 'marked'

export default function parser(
  input: string,
  theme: () => marked.Renderer,
  options?: marked.MarkedOptions,
) {
  marked.setOptions({
    renderer: theme(),
  })
  return marked(input)
}
