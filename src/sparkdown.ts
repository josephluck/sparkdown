#! /usr/bin/env node

import * as fs from 'fs-extra'
import * as path from 'path'
import * as dirToJson from 'dir-to-json'
import parser from './parser'
import theme, { defaultTheme } from './theme'
import { capitalizeString, spacifyString, dashifyString, treeToNav } from './utils';
import { Options, DirToJson, Css } from './types';

// "some-long-title.md" -> "Some Long Title" 
// "shorter-title.md" -> "Shorter Title" 
// "title.md" -> "Title"
function directoryNameToTitle(dirName: string): string | null {
  const fileName = dirName.split('.')[0]
  const withoutAlphanumeric = spacifyString(fileName).split(' ')
  return withoutAlphanumeric.length
    ? withoutAlphanumeric.map(capitalizeString).join(' ')
    : capitalizeString(fileName[0])
}

function parseDirectory(options: Options, tree: DirToJson) {
  const outputBaseDir = path.resolve(process.cwd(), options.output)
  return function parse(directory: DirToJson) {
    const isDirectory = directory.type === 'directory' && directory.children
    const isMarkdown = directory.name.includes('.md')
    if (isDirectory) {
      directory.children.map(parse)
    } else if (isMarkdown) {
      const inputPath = path.resolve(process.cwd(), options.source, directory.path)
      const outputFileDir = directory.path.split('.')[0]
      const outputFilePath = path.resolve(outputBaseDir, `${dashifyString(outputFileDir)}.html`)
      const sourceMarkdownFile = fs.readFileSync(inputPath).toString()
      const htmlContent = parser(
        sourceMarkdownFile,
        theme.renderer,
        '/' + directory.parent,
      )
      const html = theme.run({ pageTitle: directoryNameToTitle(directory.name), content: htmlContent, options, tree: treeToNav(options, tree) })
      fs.outputFileSync(outputFilePath, html)
      console.log(`Written HTML to ${outputFilePath}`)
      return html
    }
  }
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
  const tree: DirToJson = await dirToJson(path.resolve(process.cwd(), options.source))
  if (theme.css) {
    writeCss(theme.css, options)
  }
  return tree.children
    ? tree.children.map(parseDirectory(options, tree))
    : [tree].map(parseDirectory(options, tree))
}

run()
