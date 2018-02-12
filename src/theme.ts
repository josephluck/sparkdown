import * as marked from 'marked'

function renderText(content: string) {
  return content
}

function gf(f: string): string {
  return f.split(' ').join('+')
}

export interface Theme {
  layout: (content: string, options?: ThemeOptions) => string
  renderer: () => marked.Renderer
}

export interface ThemeOptions {
  bodyFont?: string
  monospaceFont?: string
  title?: string
  description?: string
  author?: string
}

const theme: Theme = {
  layout(content: string, options: ThemeOptions = {}) {
    const {
      bodyFont = 'Source Sans Pro',
      monospaceFont = 'Source Code Pro',
      title = 'Sparkdown',
      description = 'Sparkdown - a static site generator',
      author = 'Sparkdown',
    } = options
    return `
      <html>
        <head>
          <title>${title}</title>
          <meta name="description" content="${description}">
          <meta name="author" content="${author}">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <link rel="stylesheet" href="https://unpkg.com/tachyons@4.9.0/css/tachyons.min.css" />
          <link href="https://fonts.googleapis.com/css?family=${gf(bodyFont)}" rel="stylesheet">
          <link href="https://fonts.googleapis.com/css?family=${gf(
            monospaceFont,
          )}" rel="stylesheet">
          <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
          <!--[if lt IE 9]>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/html5shiv/3.7.3/html5shiv.js"></script>
          <![endif]-->
        </head>
        <style>
          html, body {
            margin: 0px;
            padding: 0px;
            font-size: 20px;
            font-family: ${bodyFont};
            background-color: white;
            color: rgb(20, 20, 20);
            display: flex;
            align-items: center;
            min-height: 100%;
          }
          .mono { font-family: ${monospaceFont}; }
          main { padding: 2rem 10vw; }
          h1, h2, h3, h4, h5, h6, p, ul { margin: 0rem; }
          ul, li { list-style-type: none; }
          h1 a, h2 a, h3 a, h4 a { text-decoration: none; border-bottom: none; }
          .df { display: flex; }
          .flex-1 { flex: 1; }
          .material-icons { font-size: inherit; line-height: inherit; }
          a {
            color: #0086b3;
            text-decoration: none;
            border-bottom: solid 1px #0086b3;
          }
          @media screen and (min-width: 50em) {
            html, body { font-size: 24px; }
          }
        </style>
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
          return `<h1 class="f1 lh-solid mv4">${text}</h1>`
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
        return `<div class="mv3 bb bw2 b--light-gray"></div>`
      },
      html: renderText,
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
        return `<div class="lh-copy mv1 df"><i class="material-icons light-silver mr1">star</i><span class="flex-1">${text}</span></div>`
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
      text: renderText,
    }
  },
}

export default theme
