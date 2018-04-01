#! /usr/bin/env node

import * as fs from 'fs-extra'
import * as path from 'path'
import * as dirToJson from 'dir-to-json'
import parser from './parser'
import theme, { ThemeOptions, defaultTheme } from './theme'

interface Options extends Partial<ThemeOptions> {
  source: string
  output: string
}

interface DirToJson {
  parent: string
  path: string
  type: 'directory' | 'file'
  name: string
  children?: DirToJson[]
}

function parseDirectory(options: Options) {
  const outputBaseDir = path.resolve(process.cwd(), options.output)
  return function parse(directory: DirToJson) {
    const isDirectory = directory.type === 'directory' && directory.children
    const isMarkdown = directory.name.includes('.md')
    if (isDirectory) {
      directory.children.map(parse)
    } else if (isMarkdown) {
      const inputPath = path.resolve(process.cwd(), options.source, directory.path)
      const outputFileDir = directory.path.split('.')[0]
      const outputFilePath = path.resolve(outputBaseDir, `${outputFileDir}.html`)
      const sourceMarkdownFile = fs.readFileSync(inputPath).toString()
      const htmlContent = parser(
        sourceMarkdownFile,
        theme.renderer,
        '/' + directory.parent,
      )
      const html = theme.layout(htmlContent, options)
      fs.outputFileSync(outputFilePath, html)
      console.log(`Written to ${outputFilePath}`)
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

async function run() {
  const options = getConfig()
  const source: DirToJson = await dirToJson(path.resolve(process.cwd(), options.source))
  return source.children
    ? source.children.map(parseDirectory(options))
    : [source].map(parseDirectory(options))
}

run()
