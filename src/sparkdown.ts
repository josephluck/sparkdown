#! /usr/bin/env node

import * as fs from 'fs-extra'
import * as path from 'path'
import * as dirToJson from 'dir-to-json'
import parser from './parser'
import theme from './theme'

interface Options {
  source: string
  output: string
  bodyFont?: string
  monospaceFont?: string
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
  const themeOptions = {
    bodyFont: options.bodyFont,
    monospaceFont: options.monospaceFont,
  }
  return function parse(directory: DirToJson) {
    const isDirectory = directory.type === 'directory' && directory.children
    const isMarkdown = directory.name.includes('.md')
    if (isDirectory) {
      directory.children.map(parse)
    } else if (isMarkdown) {
      const inputPath = path.resolve(process.cwd(), options.source, directory.path)
      const outputFileDir = directory.path.split('.')[0]
      const outputFileName = `${outputFileDir}.html`
      const outputFilePath = path.resolve(outputBaseDir, outputFileName)
      const sourceMarkdownFile = fs.readFileSync(inputPath).toString()
      const htmlContent = parser(
        sourceMarkdownFile,
        theme.renderer,
        path.resolve(outputBaseDir, outputFileDir),
      )
      const html = theme.layout(htmlContent, themeOptions)
      console.log(outputFileDir)
      fs.outputFileSync(outputFilePath, html)
      console.log(`Written to ${outputFilePath}`)
    }
  }
}

const defaultConfig = {
  source: './src',
  output: './dist',
  bodyFont: 'EB Garamond',
  monospaceFont: 'Inconsolata',
}

async function run() {
  const configFilePath = path.resolve(process.cwd(), './sparkdown.json')
  const options = fs.existsSync(configFilePath)
    ? { ...defaultConfig, ...JSON.parse(fs.readFileSync(configFilePath).toString()) }
    : defaultConfig
  const source = await dirToJson(path.resolve(process.cwd(), options.source))
  source.children
    ? source.children.map(parseDirectory(options))
    : [source].map(parseDirectory(options))
}

run()