# Sparkdown

Yet another static site generator based on markdown files

## What?

Takes a source directory of markdown files and spits out a website.

## How?

### Install

```bash
yarn add sparkdown
```

### Configuration

Make a configuration file (optional)

```bash
touch sparkdown.json
```

Write these options to your `sparkdown.json` file (optional)

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

Run the following from the root directory of your project (where your `sparkdown.json` is):

```bash
sparkdown
```

### Serve

You can obviously serve the output directory to any hosting, but give it a go with [surge](surge.sh)

# Markdown

Write markdown files to your source directory ready to be converted in to HTML files.

Take a look at the [example project](./example) for an example project.
