import * as marked from 'marked'

function renderContent(content: string) {
  return content
}

function renderElm() {
  return '~'
}

export interface Theme {
  layout: (content: string, options?: ThemeOptions) => string
  renderer: () => marked.Renderer
}

export interface ThemeOptions {
  font?: string
  title?: string
  description?: string
  author?: string
}

const theme: Theme = {
  layout(content: string, options: ThemeOptions = {}) {
    const {
      font = 'Source Sans Pro',
      title = 'Welcome',
      description = 'mrkdn - a static site generator',
      author = 'mrkdn',
    } = options
    const fontForGoogle = font.split(' ').join('+')
    return `
      <html>
        <head>
          <title>${title}</title>
          <meta name="description" content="${description}">
          <meta name="author" content="${author}">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <link rel="stylesheet" href="https://unpkg.com/tachyons@4.9.0/css/tachyons.min.css" />
          <link href="https://fonts.googleapis.com/css?family=${fontForGoogle}" rel="stylesheet">
          <!--[if lt IE 9]>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/html5shiv/3.7.3/html5shiv.js"></script>
          <![endif]-->
        </head>
        <style>
          html, body {
            margin: 0px;
            padding: 0px;
            font-size: 20px;
            font-family: ${font};
            background-color: rgb(253, 253, 253);
            color: rgb(20, 20, 20);
            display: flex;
            align-items: center;
            min-height: 100%;
          }
          main { padding: 2rem 10vw; }
          h1, h2, h3, p { margin: 0rem; }
          ul, li { list-style-type: none; }
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
      blockquote: renderContent,
      br: renderElm,
      code: renderContent,
      codespan: renderContent,
      del: renderContent,
      em: renderContent,
      heading(text, level) {
        if (level === 1) {
          return `<h1 class="f1 lh-solid mb4">${text}</h1>`
        } else if (level === 2) {
          return `<h2 class="normal f3 lh-copy mb3">${text}</h2>`
        } else {
          return `<h3 class="normal f4 lh-copy mb2 gray">${text}</h3>`
        }
      },
      hr: renderElm,
      html: renderContent,
      image: renderContent,
      link(href, title, text) {
        return `<a href="${href}" title="${title || text}">${text}</a>`
      },
      list: renderContent,
      listitem: renderContent,
      paragraph(text) {
        return `<p class="lh-copy mb2">${text}</p>`
      },
      strong(text) {
        return `<b>${text}</b>`
      },
      table: renderContent,
      tablecell: renderContent,
      tablerow: renderContent,
      text: renderContent,
    }
  },
}

export default theme
