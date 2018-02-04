import * as yargs from 'yargs'
import * as fs from 'fs'
import * as path from 'path'
import * as dirToJson from 'dir-to-json'
import { Result, Ok, Err } from 'space-lift'
import parser from './parser'
import theme from './theme'

interface Args {
  source: string
  output: string
}

function validateArguments(): Result<string, Args> {
  const args = yargs
    .option('source', {
      alias: 's',
      description: 'Source directory containing markdown files',
    })
    .option('output', {
      alias: 'o',
      description: 'Output directory to save website',
    }).argv

  if (args.source && args.output) {
    return Ok(args as any) as Ok<string, Args>
  } else {
    return Err('invalid arguments')
  }
}

interface DirToJson {
  parent: string
  path: string
  type: 'directory' | 'file'
  name: string
  children?: DirToJson[]
}

function parseDirectory(args: Args) {
  return function parse(directory: DirToJson) {
    const isDirectory = directory.type === 'directory' && directory.children
    const isMarkdown = directory.name.includes('.md')
    if (isDirectory) {
      directory.children.map(parse)
    } else if (isMarkdown) {
      const inputPath = path.resolve(process.cwd(), args.source, directory.name)
      const outputFileName = `${directory.name.split('.')[0]}.html`
      const outputPath = path.resolve(process.cwd(), args.output, outputFileName)
      const file = fs.readFileSync(inputPath).toString()
      const content = parser(file, theme.renderer)
      const html = theme.layout(content, {
        font: 'EB Garamond',
      })
      fs.writeFileSync(outputPath, html)
    }
  }
}

function run() {
  validateArguments().fold(console.error, async args => {
    const source = await dirToJson(path.resolve(process.cwd(), args.source))
    if (source.children) {
      source.children.map(parseDirectory(args))
    } else {
      ;[source].map(parseDirectory(args))
    }
    console.log('All done')
  })
}

run()
