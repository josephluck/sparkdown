#! /usr/bin/env node

import * as fs from 'fs-extra'
import * as path from 'path'
import * as dirToJson from 'dir-to-json'
import parser from './parser'
import theme, { defaultTheme } from './theme'
import { Options, DirToJson, Css, Tree } from './types';
import { directoryNameToTitle, transformHref, dashifyString } from './utils';

function mapTree(options: Options, source: DirToJson): Tree {
  const outputBaseDir = path.resolve(process.cwd(), options.output)
  const isDirectory = source.type === 'directory' && source.children && source.children.length
  return {
    type: isDirectory ? 'directory' : 'page',
    name: directoryNameToTitle(source.name),
    inputFilePath: path.resolve(process.cwd(), options.source, source.path),
    outputFilePath: path.resolve(outputBaseDir, `${dashifyString(source.path.split('.')[0])}.html`),
    htmlLink: isDirectory ? null : transformHref('/' + source.parent, source.path.split('.md')[0]),
    children: isDirectory ? source.children.map(d => mapTree(options, d)) : [],
    parent: source.parent,
  }
}

function makeTree(options: Options, source: DirToJson): Tree[] {
  return source.children
    ? source.children.map(dir => mapTree(options, dir))
    : [source].map(dir => mapTree(options, dir))
}

function processMarkdown(options: Options, tree: Tree[]) {
  function processTree(currentTree: Tree) {
    if (currentTree.type === 'directory') {
      currentTree.children.map(processTree)
    } else {
      const sourceMarkdownFile = fs.readFileSync(currentTree.inputFilePath).toString()
      const htmlContent = parser(
        sourceMarkdownFile,
        theme.renderer,
        '/' + currentTree.parent,
      )
      const html = theme.run({ pageTitle: currentTree.name, content: htmlContent, options, tree })
      fs.outputFileSync(currentTree.outputFilePath, html)
      console.log(`Written HTML to ${currentTree.outputFilePath}`)
      return html
    }
  }
  return tree.map(processTree)
}

const defaultConfig: Options = {
  source: './src',
  output: './dist',
  ...defaultTheme,
}

function getConfig(): Options {
  const configFilePath = path.resolve(process.cwd(), './sparkdown.json')
  const packageJsonPath = path.resolve(process.cwd(), './package.json')
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath).toString())
  if (fs.existsSync(configFilePath)) {
    return { ...defaultConfig, ...JSON.parse(fs.readFileSync(configFilePath).toString()) }
  } else if (packageJson.sparkdown) {
    return { ...defaultConfig, ...packageJson.sparkdown }
  } else {
    return defaultConfig
  }
}

function writeCss(css: Css, options: Options) {
  const result = css(options)
  const outputFilePath = path.resolve(process.cwd(), options.output, result.filename)
  console.log(`Written CSS to ${outputFilePath}`)
  fs.outputFileSync(outputFilePath, result.content)
}

async function run() {
  const options = getConfig()
  const source: DirToJson = await dirToJson(path.resolve(process.cwd(), options.source))
  if (theme.css) {
    writeCss(theme.css, options)
  }
  const tree = makeTree(options, source)
  return processMarkdown(options, tree)
}

run()
