export type FileType = {
  fileName: string
  modelName: string
  path: string
  parent: string
}

export type ProjectType = {
  projectName: string
  modelName: string
}

export type CodeType = {
  css: string
  script: string
  template: string
  justRead: boolean
}

export type Catalog = {
  name: string
  type: string
  title: string
  key: string
  path: string
  children?: Catalog[]
}
