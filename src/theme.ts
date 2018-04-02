import * as marked from 'marked'

function gf(f: string): string {
  return f.split(' ').join('+')
}

export interface LayoutOptions {
  content: string
  options: ThemeOptions
}

export interface Theme {
  css?: Css
  layout: (options: LayoutOptions) => string
  renderer: () => marked.Renderer
}

export interface ThemeOptions {
  bodyFont?: string
  monospaceFont?: string
  author?: string
  description?: string
  title?: string
}

export interface WriteCss {
  filename: string
  content: string
}

export type Css = (options: ThemeOptions) => WriteCss

export const defaultTheme: ThemeOptions = {
  bodyFont: 'EB Garamond',
  monospaceFont: 'Inconsolata',
  author: '',
  description: '',
  title: 'My Site',
}

const theme: Theme = {
  css(options: ThemeOptions) {
    return {
      filename: 'style.css',
      content: `
        html, body {
          margin: 0px;
          padding: 0px;
          font-size: 20px;
          font-family: "${options.bodyFont}", sans-serif;
          background-color: white;
          color: rgb(20, 20, 20);
          display: flex;
          align-items: center;
          min-height: 100%;
        }
        .mono { font-family: "${options.monospaceFont}", monospace; }
        main { padding: 2rem 10vw; }
        h1, h2, h3, h4, h5, h6, p, ul { margin: 0rem; }
        ul, li { list-style-type: none; }
        h1 a, h2 a, h3 a, h4 a { text-decoration: none; border-bottom: none; }
        .df { display: flex; }
        .flex-1 { flex: 1; }
        .material-icons { font-size: inherit; line-height: inherit; }
        a {
          color: #0086b3;
        }
        @media screen and (min-width: 50em) {
          html, body { font-size: 24px; }
        }
      `
    }
  },
  layout({ content, options }) {
    return `
      <html>
        <head>
          <title>${options.title}</title>
          <meta name="description" content="${options.description}">
          <meta name="author" content="${options.author}">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <link href="https://fonts.googleapis.com/css?family=${gf(options.bodyFont)}" rel="stylesheet">
          <link href="https://fonts.googleapis.com/css?family=${gf(options.monospaceFont)}" rel="stylesheet">
          <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
          <!--[if lt IE 9]>
          <script src="https://cdnjs.cloudflare.com/ajax/libs/html5shiv/3.7.3/html5shiv.js"></script>
          <![endif]-->
          <link rel="stylesheet" href="https://unpkg.com/tachyons@4.9.0/css/tachyons.min.css" />
          <link rel="stylesheet" href="/style.css" />
        </head>
        <body>
          <main>
            ${content}
          </main>
        </body>
      </html>
    `
  },
  renderer() {
    return {
      blockquote(text) {
        return `<div class="bl bw2 b--light-gray pl2 lh-copy gray i">${text}</div>`
      },
      br() {
        return `<div class="mv3"></div>`
      },
      code(text, lang) {
        return `<p class="mono bg-near-white br2 pv1 ph2 lh-copy mv3">${text}</p>`
      },
      codespan(text) {
        return `<span class="mono bg-near-white dib br2 ph1">${text}</span>`
      },
      del(text) {
        return `<del>${text}</del>`
      },
      em(text) {
        return `<span class="i">${text}</span>`
      },
      heading(text, level) {
        if (level === 1) {
          return `<h1 class="f1 lh-solid mv3">${text}</h1>`
        } else if (level === 2) {
          return `<h2 class="normal f3 lh-copy mv3">${text}</h2>`
        } else if (level === 3) {
          return `<h3 class="normal f4 lh-copy mv2 gray">${text}</h3>`
        } else if (level === 4) {
          return `<h4 class="normal f5 lh-copy mv1 gray">${text}</h5>`
        } else {
          return `<h5 class="normal f6 lh-copy gray">${text}</h5>`
        }
      },
      hr() {
        return `<div class="mv4 bb b--black-10"></div>`
      },
      html(text: string) { return text },
      image(href, title, text) {
        return `<img src="${href}" title="${title || text}" />`
      },
      link(href, title, text) {
        return `<a href="${href}" title="${title || text}">${text}</a>`
      },
      list(body) {
        return `<div class="mv3">${body}</div>`
      },
      listitem(text) {
        return `<div class="lh-copy mv1 df"><i class="material-icons light-silver mr1">radio_button_unchecked</i><span class="flex-1">${text}</span></div>`
      },
      paragraph(text) {
        return `<p class="lh-copy mv3">${text}</p>`
      },
      strong(text) {
        return `<span class="b">${text}</span>`
      },
      table(header, body) {
        return `<div class="mv3">${header} ${body}</div>`
      },
      tablecell(content, { header, align }) {
        return `
          <div class="
            flex-1 lh-copy
            ${align === 'center' ? 'tc' : align === 'right' ? 'tr' : ''}
            ${header ? 'b' : 'normal'}
          ">${content}</div>`
      },
      tablerow(content) {
        return `<div class="df">${content}</div>`
      },
      text(text: string) { return text },
    }
  },
}

export default theme
