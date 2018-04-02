import { DirToJson, Nav, Options } from "./types";
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

function makeNav(options: Options, tree: DirToJson): Nav {
  console.log(tree)
  const isDirectory = tree.type === 'directory' && tree.children && tree.children.length
  const htmlLink = tree.path.split('.md')[0]
  return {
    name: tree.name,
    inputPath: path.resolve(process.cwd(), options.source, tree.path),
    htmlLink: isDirectory ? null : `/${htmlLink}`,
    children: isDirectory ? tree.children.map(d => makeNav(options, d)) : [],
    type: isDirectory ? 'directory' : 'page',
  }
}

export function treeToNav(options: Options, tree: DirToJson): Nav[] {
  const menus = tree.children
    ? tree.children.map(dir => makeNav(options, dir))
    : [tree].map(dir => makeNav(options, dir))
  return menus
}
