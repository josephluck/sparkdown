import { DirToJson, Tree, Options } from "./types";
import * as path from 'path'

export function hasLength<A extends any[] | string>(str: A): boolean {
  return str.length > 0
}

export function capitalizeString(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function dashifyString(str: string): string {
  return str.replace(/\s/g, '-')
}

export function spacifyString(str: string): string {
  return str.split(/^([a-zA-Z0-9]+ )$/).filter(hasLength).join(' ')
}

export function stripQuotesFromString(str: string): string {
  const split = str.split('&#39;')
  return split.length > 1 ? split[1] : split[0]
}

export function isRelativePath(href: string): boolean {
  return !href.includes('http://') && !href.includes('https://')
}

// Takes a href and returns a path based on whether the link is external or internal
export function transformHref(root: string, href: string): string {
  const ref = stripQuotesFromString(href)
  return isRelativePath(ref) ? `${path.resolve(root, ref)}.html` : ref
}

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
  }
}

export function makeTree(options: Options, source: DirToJson): Tree[] {
  return source.children
    ? source.children.map(dir => mapTree(options, dir))
    : [source].map(dir => mapTree(options, dir))
}
