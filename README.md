# MRKDN

Yet another static site generator based on markdown files

## What?

Takes a source directory of markdown files and spits out a website.

## How?

### Install

```bash
yarn add mrkdn
```

### Setup

```bash
touch mrkdn.json
```

### Options

```json
{
  "source": "./src",
  "output": "./dist",
  "bodyFont": "EB Garamond",
  "monospaceFont": "Inconsolata"
}
```

- `source`: Source directory of markdown files
- `output`: Directory the website will live
- `bodyFont`: Any valid google webfont
- `monospaceFont`: Any valid google webfont 

### Run

```bash
mrkdn
```

### Serve

You can obviously serve the directory to any hosting, but give it a go with [surge](surge.sh)

```bash
yarn add surge
surge
```

# Markdown

Write markdown files to your source directory ready to be converted in to HTML files.

Links should be made relative to the file you're editing. For example:

```markdown
Here's a [link](./foo.md) from `bar.md` to `foo.md`. Similarly here's [another link](./foo/bar/baz.md) traversing directories.
```
