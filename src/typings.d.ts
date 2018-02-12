declare module 'dir-to-json' {
  const fn: any

  interface DirToJson {
    parent: string
    path: string
    type: 'directory' | 'file'
    name: string
    children?: DirToJson[]
  }

  export = fn
}
