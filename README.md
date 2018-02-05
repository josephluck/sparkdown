# :zap: Sparkdown :point_down: 

Yet another static site generator based on markdown files

## What?

Takes a source directory of markdown files and spits out a website.

## How?

### Install

With yarn: 

```bash
yarn global add sparkdown
```

With npm

```bash
npm install -g sparkdown
```

### Configuration (optional)

To control the look and feel of the website, make a configuration file:

```bash
touch sparkdown.json
```

Write these options to your `sparkdown.json` file. If you omit this step, sparkdown will default to:

```json
{
  "source": "./src",
  "output": "./dist",
  "bodyFont": "EB Garamond",
  "monospaceFont": "Inconsolata"
}
```

- `source`: Source directory of markdown files
- `output`: Directory where sparkdown will generate HTML files
- `bodyFont`: Any valid google webfont
- `monospaceFont`: Any valid google webfont (used when rendering `code` snippets)

### Run

Run the following from the root directory of your project (where your source directory is):

```bash
sparkdown
```

Sparkdown will read all `.md` files and convert them into `.html` files in your output directory. You can also use `sparkdown` in your npm scripts inside package.json:

```json
{
  "name": "super-cool-project",
  "dependencies": {
    "sparkdown": "*"
  },
  "scripts": {
    "build-docs": "sparkdown",
    "deploy-docs": "sparkdown && surge ./docs"
  }
}
```

### Serve

You can serve the output directory to any hosting provider that can deal with basic HTML files.

## Example

Take a look at the [example project](./example) for an details on how to use markdown (particular attention goes to how you can do relative links between pages).
