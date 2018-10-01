# :zap::point_down:

Yet another opinionated static site generator based on markdown files.

Here's a [live example](http://josephluck.co.uk) of a site made using Sparkdown.

## What do you mean?

Takes a source directory of markdown files and spits out a website.

## What's it good for?

Sparkdown will work for sites that are content-heavy. For example, portfolio websites, blogs and documentation websites. It's fairly easy to get a continuous-delivery pipeline set up using git-hooks or otherwise, making it a good solution for open-source project documentation.

Sparkdown is opinionated, and you don't get much control over how the generated site looks. If you want more control, use something like Jekyll or Hugo.

# Setup

### Install

Install `node` and `npm` or `yarn`

With yarn: 

```bash
mkdir website; cd website
yarn init
yarn global add sparkdown
```

With npm

```bash
mkdir website; cd website
npm init
npm install -g sparkdown
```

### Configuration (optional)

Make a configuration file:

```bash
touch sparkdown.json
```

Write to your `sparkdown.json` file. Sparkdown comes with some sensible defaults, but here's an example:

```json
{
  "source": "./src",
  "output": "./docs",
  "bodyFont": "EB Garamond",
  "monospaceFont": "Inconsolata",
  "author": "Sparkdown",
  "description": "Sparkdown is a static site generator",
  "title": "Sparkdown"
}
```

- `source`: Source directory of markdown files
- `output`: Directory where sparkdown will generate HTML files
- `bodyFont`: Any valid google webfont
- `monospaceFont`: Any valid google webfont (used when rendering `code` snippets)
- `author`: Populates the author meta tag
- `description`: Populates the description meta tag
- `title` - The base title for the site. Note this gets updated per-page automatically

Alternatively, you can add a `sparkdown` key to your `package.json` file and sparkdown will read from it instead of the config file:

```json
{
  "name": "super-cool-project",
  "dependencies": {
    "sparkdown": "*"
  },
  "scripts": {
    "build-docs": "sparkdown",
    "deploy-docs": "sparkdown && surge ./docs"
  },
  "sparkdown": {
    "source": "./src",
    "output": "./docs",
    "bodyFont": "EB Garamond",
    "monospaceFont": "Inconsolata",
    "author": "Sparkdown",
    "description": "Sparkdown is a static site generator",
    "title": "Sparkdown"
  }
}
```

# Write

Create markdown files in the directory you specified in the `source` key in your config. The following examples use `src`.

### Page titles

Sparkdown will automatically pretty-print the name of the file to the end of the title for you. Using the configuration shown above, a file with the path:

```bash
src/blog/my-first-post.md
``` 

Will generate a HTML file with the title:

```bash
Sparkdown - My First Post
```

### Directories & Menu

Sparkdown will create a menu for you. It's always visible on desktop screens, and tucks away behind a button on mobile.

Directories can be used as a makeshift category system to nest pages. Markdown files that are placed inside a directory will be placed inside a menu item who's title is the name of the directory. For example, consider the following directory structure:

```bash
src/index.md
src/contact.md
src/blog/index.md
src/blog/my-first-post.md
src/blog/my-second-post.md
src/projects/first-project.md
src/projects/second-project.md
```

This directory structure will result in the following menu:

```
Home
Contact
Blog
  My First Post
  My Second Post
Projects
  First Project
  Second Project
```

A subtlety thats worth noting is that directories that contain an `index.md` file will have the directory title in the menu link to the `index`. If there is no `index` in the directory, sparkdown will link the directory to the first file it can find inside the directory. You can see the difference displayed above between the `blog` and `projects` directories.

There isn't a limit to the level of directory nesting sparkdown can handle, though it starts looking a bit silly if you use more than 2 levels.

### Menu

Sparkdown pretty-prints directory and file names inside the menu. There isn't really any way to order the files other than alphabetically as per the file-system.

Sparkdown assumes that you have a `index.md` file at the root of your `src` directory. Sparkdown places a special `Home` link at the top of the menu that links back to the `index` page.

### Links

You can link to pages from within your site using relative paths. For example, if I'm writing the `My Second Post` page from the example above, and I want to link back to `My First Post`, I'll write the markdown as follows:

```markdown
# My Second Post

If you haven't done so already, check out the [first part](./my-first-post)
``` 

Note that I've left out the extension.

You can traverse directories too, for example, if I want to link to the contact page from the example above, I'll write the markdown as follows:

```markdown
# My Second Post

Feel free to [get in touch](../contact)
```

You'll need to link explicitly to index pages:

```markdown
# My Second Post

Feel free to [get in touch](../contact) or head back [home](../index)
```

Linking to external sites is pretty standard:


```markdown
# My Second Post

Proudly powered by [sparkdown](http://github.com/josephluck/sparkdown)
```

### Turbolinks

Sparkdown comes with [`turbolinks`](https://github.com/turbolinks/) preconfigured for :100: perf. 

# Build

Run the following from the root directory of your project (where your `package.json` is):

```bash
sparkdown
```

Sparkdown will recursively read all `.md` files from your `src` directory including any subdirectories and convert them into `.html` files in your output directory.

# Serve

You can serve the output directory to any hosting provider that can deal with basic HTML files. [Netlify](https://www.netlify.com/) and [Surge](https://surge.sh) are both solid options.

# Example

Take a look at the [example project](./example) for an details on how to use markdown (particular attention goes to how you can do relative links between pages).
