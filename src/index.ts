import * as yargs from 'yargs'
import * as fs from 'fs'
import * as path from 'path'
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

function run() {
  validateArguments().fold(console.error, args => {
    const file = fs.readFileSync(path.resolve(process.cwd(), args.source)).toString()
    const content = parser(file, theme.renderer)
    const html = theme.layout(content, {
      font: 'EB Garamond',
    })
    fs.writeFileSync(path.resolve(process.cwd(), args.output), html)
    console.log('All done')
  })
}

run()
