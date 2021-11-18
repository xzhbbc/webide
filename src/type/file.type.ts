export type FileType = {
  fileName: string
  modelName: string
  path: string
  parent: string
}

export type CodeType = {
  css: string
  script: string
  template: string
}

export type Catalog = {
  name: string
  type: string
  title: string
  key: string
  children?: Catalog[]
}
