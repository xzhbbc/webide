import { Catalog } from '@/type/file.type'

export default class EditorHelper {
  static highlightPath(
    pathList: Catalog[],
    path: string,
    keyArr: string[] = []
  ):
    | {
        file: Catalog
        key: string[]
      }
    | undefined {
    if (!pathList || pathList.length == 0) return
    for (let i = 0; i < pathList.length; i++) {
      const filePath = pathList[i].path
      const checkPath = path.split(filePath)
      if (checkPath.length > 1) {
        if (checkPath[0] == checkPath[1]) {
          return {
            file: pathList[i],
            key: keyArr
          }
        } else {
          if (pathList[i].children) {
            return this.highlightPath(pathList[i].children as Catalog[], path, [
              ...keyArr,
              pathList[i].key
            ])
          } else {
            return {
              file: pathList[i],
              key: keyArr
            }
          }
        }
      }
    }
    return
  }
}
