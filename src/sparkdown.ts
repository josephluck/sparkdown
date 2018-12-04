#! /usr/bin/env node

import * as fs from 'fs-extra'
import * as path from 'path'
import * as dirToJson from 'dir-to-json'
import parser from './parser'
import theme, { defaultTheme } from './theme'
import { Options, DirToJson, Css, SiteTree } from './types'
import { directoryNameToTitle, dashifyString } from './utils'

function mapTree(options: Options) {
  const outputBaseDir = path.resolve(process.cwd(), options.output)
  return function run(source: DirToJson): SiteTree {
    const isDirectory = source.type === 'directory' && source.children && source.children.length
    const htmlLinkPath = makeHtmlLink(source)
    return {
      type: isDirectory ? 'directory' : 'page',
      name: directoryNameToTitle(source.name),
      inputFilePath: path.resolve(process.cwd(), options.source, source.path),
      outputFilePath: path.resolve(outputBaseDir, htmlLinkPath),
      htmlLink: isDirectory ? linkToFirstPageInDirectory(source) : `/${htmlLinkPath}`,
      children: isDirectory ? source.children.map(run) : [],
      parent: source.parent,
    }
  }
}

function makeTree(options: Options, source: DirToJson): SiteTree[] {
  return source.children ? source.children.map(mapTree(options)) : [source].map(mapTree(options))
}

function processMarkdown(options: Options, tree: SiteTree[]) {
  function processTree(currentTree: SiteTree) {
    if (currentTree.type === 'directory') {
      currentTree.children.map(processTree)
    } else {
      const sourceMarkdownFile = fs.readFileSync(currentTree.inputFilePath).toString()
      const currentDir = `/${dashifyString(currentTree.parent)}`
      const htmlContent = parser(sourceMarkdownFile, theme.renderer, currentDir, currentTree.htmlLink)
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

function linkToFirstPageInDirectory(source: DirToJson): string | null {
  if (source.children) {
    const child = source.children.find(dir => dir.name.includes('index')) || source.children.find(dir => dir.type === 'file')
    return child ? `/${makeHtmlLink(child)}` : null
  } else {
    return null
  }
}

function makeHtmlLink(source: DirToJson): string {
  return `${dashifyString(source.path.split('.md')[0])}.html`
}

function writeCss(css: Css, options: Options) {
  const result = css(options)
  const outputFilePath = path.resolve(process.cwd(), options.output, result.filename)
  fs.outputFileSync(outputFilePath, result.content)
  console.log(`Written CSS to ${outputFilePath}`)
}

function writeJs(options: Options) {
  const result = fs.readFileSync(path.resolve(__dirname, './runtime.js')).toString()
  const outputFilePath = path.resolve(process.cwd(), options.output, './runtime.js')
  fs.outputFileSync(outputFilePath, result)
  console.log(`Written JS to ${outputFilePath}`)
}

async function run() {
  const options = getConfig()
  const source: DirToJson = await dirToJson(path.resolve(process.cwd(), options.source))
  if (theme.css) {
    writeCss(theme.css, options)
  }
  writeJs(options)
  const tree = makeTree(options, source)
  return processMarkdown(options, tree)
}

run()
