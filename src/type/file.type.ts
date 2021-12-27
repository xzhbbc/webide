export type FileType = {
  fileName: string
  modelName: string
  path: string
  parent: string
}

export type ProjectType = {
  name: string
  user: string
  createTime: number
  updateTime: number
  scaffold: Scaffold
}

export type Scaffold = {
  fileModelName: string
  id: string
  modelName: string
  scaffoldName: string
}

export type ScaffoldList = {
  id: string
  modelName: string
  scaffoldName: string
  fileModelName: string
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
