import { ThemeOptions, Theme, SiteTree } from './types'
import * as hljs from 'highlight.js'

function gf(f: string): string {
  return f.split(' ').join('+')
}

export const defaultTheme: ThemeOptions = {
  bodyFont: 'EB Garamond',
  monospaceFont: 'Inconsolata',
  author: '',
  description: '',
  title: 'My Site',
}

function renderNavItem(navItem: SiteTree): string {
  const components = theme.renderer()
  return `
    <div class="mb1 ml3">
      ${
        navItem.htmlLink
          ? `
          <div class="mb1 truncate">
            ${components.link(navItem.htmlLink, navItem.name, navItem.name)}
          </div>
        `
          : components.text(navItem.name)
      }
      ${navItem.children
        .filter(isntIndexFile)
        .map(renderNavItem)
        .join('')}
    </div>
  `
}

function isntIndexFile(navItem: SiteTree): boolean {
  return navItem.type === 'directory' || navItem.name.toLowerCase() !== 'home'
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
          min-height: 100%;
          height: 100%;
        }
        * { box-sizing: border-box; } 
        .mono { font-family: "${options.monospaceFont}", monospace; }
        .ph10vw { padding-left: 10vw; padding-right: 10vw; }
        .mhn10vw { margin-left: -10vw; margin-right: -10vw; }
        h1, h2, h3, h4, h5, h6, p, ul { margin: 0rem; }
        ul, li { list-style-type: none; }
        h1 a, h2 a, h3 a, h4 a { text-decoration: none; border-bottom: none; }
        .df { display: flex; }
        .flex-0 { flex: 0; }
        .flex-1 { flex: 1; }
        .material-icons { font-size: inherit; line-height: inherit; }
        a {
          color: #0086b3;
          text-decoration: none;
        }
        a:hover, a:focus {
          text-decoration: underline;
        }
        nav a {
          color: inherit;
        }
        .transition {
          transition: all 0.3s ease-in-out;
        }
        .w-0 { width: 0px; }

        nav { transform: translateX(0%); }
        main { opacity: 1; }
        .fade-out { opacity: 0.3; }
        .slide-out { transform: translateX(-100%); }
        
        @media screen and (min-width: 50em) {
          html, body { font-size: 24px; }
          main { opacity: 1 !important; }
          nav { transform: translateX(0%) !important; }
          #nav-toggle { display: none; }
          .m0-ns { margin-left: 0; margin-right: 0; }
        }

        @media screen and (max-width: 50em) {
          nav {
            position: fixed;
            display: block;
            left: 0px;
            top: 0px;
            height: 100%;
            z-index: 10;
            max-width: none;
          }
        }
        
      `,
    }
  },
  run({ pageTitle, content, tree, options }) {
    const components = theme.renderer()
    return `
      <html>
        <head>
          <title>${options.title}${pageTitle ? ` - ${pageTitle}` : ''}</title>
          <meta name="description" content="${options.description}">
          <meta name="author" content="${options.author}">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <link href="https://fonts.googleapis.com/css?family=${gf(options.bodyFont)}" rel="stylesheet">
          <link href="https://fonts.googleapis.com/css?family=${gf(options.monospaceFont)}" rel="stylesheet">
          <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/highlight.js/9.13.1/styles/github.min.css">
          <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
          <link rel="stylesheet" href="https://unpkg.com/tachyons@4.9.0/css/tachyons.min.css" />
          <link rel="stylesheet" href="/style.css" />
          <!--[if lt IE 9]>
          <script src="https://cdnjs.cloudflare.com/ajax/libs/html5shiv/3.7.3/html5shiv.js"></script>
          <![endif]-->
          <script src="https://cdnjs.cloudflare.com/ajax/libs/turbolinks/5.1.1/turbolinks.js"></script>
          <script>
            function openNav() {
              var nav = document.querySelector('nav')
              var main = document.querySelector('main')
              if (nav && main) {
                nav.classList.remove('slide-out')
                main.classList.add('fade-out')
              }
            }

            function closeNav() {
              var nav = document.querySelector('nav')
              var main = document.querySelector('main')
              if (nav && main) {
                nav.classList.add('slide-out')
                main.classList.remove('fade-out')
              }
            }

            function closeNavIfClickOutside(e) {
              var nav = document.querySelector('nav')
              var navOpenElm = document.getElementById('nav-toggle')
              if (nav && navOpenElm && !nav.contains(e.target) && !navOpenElm.contains(e.target)) {
                closeNav()
              }
            }

            function bindEventListeners() {
              var navOpenElm = document.getElementById('nav-toggle')
              var main = document.querySelector('main')
              var nav = document.querySelector('nav')
              if (navOpenElm) {
                navOpenElm.addEventListener('click', openNav)
              }
              if (nav && main) {
                document.body.addEventListener('click', closeNavIfClickOutside)
              }
            }

            document.addEventListener("turbolinks:load", bindEventListeners);
          </script>
        </head>
        <body class="df">
          <nav class="bg-near-white pv4 overflow-auto lh-copy mw5 transition slide-out">
            <div class="pv3 pl3 pr4 w-100">
              <div class="mb1 ml3 overflow-hidden truncate">
                ${components.link('/', 'Home', 'Home')}
              </div>
              ${tree
                .filter(isntIndexFile)
                .map(renderNavItem)
                .join('')}
            </div>
          </nav>
          <main class="flex-1 h-100 overflow-auto transition">
            <div class="ph10vw pv4">
              <div class="df pointer mv3" id="nav-toggle">
                <i class="material-icons mr1 gray">menu</i>
                <span class="gray b">Menu</span>
              </div>
              ${content}
            </div>
          </main>
        </body>
      </html>
    `
  },
  renderer() {
    return {
      blockquote(text) {
        return `<div class="bl bw2 b--light-gray pl2 lh-copy gray i" data-type="blockquote">${text}</div>`
      },
      br() {
        return `<div class="mv3" data-type="br"></div>`
      },
      code(text, lang) {
        const validLang = !!(lang && hljs.getLanguage(lang))
        return `<pre class="mono bg-near-white br2-ns pv1 ph10vw ph2-ns lh-copy mv3 mhn10vw mh0-ns f7 overflow-auto" data-type="code" data-lang="${lang}">${validLang ? hljs.highlight(lang, text).value : hljs.highlightAuto(text).value}</pre>`
      },
      codespan(text) {
        return `<code class="mono bg-near-white dib br2 ph1 f7" data-type="codespan">${text}</code>`
      },
      del(text) {
        return `<del data-type="del">${text}</del>`
      },
      em(text) {
        return `<span class="i" data-type="em">${text}</span>`
      },
      heading(text, level) {
        if (level === 1) {
          return `<h1 class="f1 lh-solid mv3" data-type="heading-1">${text}</h1>`
        } else if (level === 2) {
          return `<h2 class="normal f3 lh-copy mv3" data-type="heading-2">${text}</h2>`
        } else if (level === 3) {
          return `<h3 class="normal f4 lh-copy mv2 gray" data-type="heading-3">${text}</h3>`
        } else if (level === 4) {
          return `<h4 class="normal f5 lh-copy mv1 gray" data-type="heading-4">${text}</h5>`
        } else {
          return `<h5 class="normal f6 lh-copy gray" data-type="heading-5">${text}</h5>`
        }
      },
      hr() {
        return `<div class="mv4 bb b--black-10" data-type="hr"></div>`
      },
      html(text: string) {
        return text
      },
      image(href, title, text) {
        return `<img src="${href}" title="${title || text}" data-type="img" />`
      },
      link(href, title, text) {
        return `<a href="${href}" title="${title || text}" data-type="link">${text}</a>`
      },
      list(body) {
        return `<div class="mv3" data-type="list">${body}</div>`
      },
      listitem(text) {
        return `<div class="lh-copy mv1 df" data-type="list-item"><i class="material-icons light-silver mr1">radio_button_unchecked</i><span class="flex-1">${text}</span></div>`
      },
      paragraph(text) {
        return `<p class="lh-copy mv3" data-type="paragraph">${text}</p>`
      },
      strong(text) {
        return `<span class="b" data-type="strong">${text}</span>`
      },
      table(header, body) {
        return `<div class="mv3" data-type="table">${header} ${body}</div>`
      },
      tablecell(content, { header, align }) {
        const className = `flex-1 lh-copy${align === 'center' ? 'tc' : align === 'right' ? 'tr' : ''}${header ? 'b' : 'normal'}`
        return `<div class="${className}" data-type="tablecell">${content}</div>`
      },
      tablerow(content) {
        return `<div class="df" data-type="tablerow">${content}</div>`
      },
      text(text: string) {
        return text
      },
    }
  },
}

export default theme
