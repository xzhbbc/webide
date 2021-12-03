import React, { useCallback, useEffect, useState } from 'react'
import { history } from 'umi'
import './index.scss'
import FileItem from '@/components/fileItem'
import Loading from '@/utils/Loading'
import { get } from '@/api/request'
import { FileType } from '@/type/file.type'
import * as path from 'path'

export default function FilePage() {
  const [isCreate, setIsCreate] = useState(false)
  const [fileList, setFileList] = useState<FileType[]>([])

  const createFile = useCallback((name: string) => {
    if (name) {
      console.log('我要创建', name)
      Loading.showLoading()
    }
    setIsCreate(false)
    setTimeout(() => {
      Loading.closeLoading()
    }, 5000)
  }, [])

  useEffect(() => {
    getData()
  }, [])

  const getData = async () => {
    Loading.showLoading()
    const data = await get<{
      fileList: FileType[]
    }>('/file/getFileList', {})
    if (data.code == 0) {
      setFileList(data.data.fileList.reverse())
    }
    Loading.closeLoading()
  }

  const goCode = useCallback((name: string, path: string) => {
    history.push(`/vue?name=${name}&path=${path}`)
  }, [])

  return (
    <div className="fileContainer">
      <div className="fileContainer-titleContainer">
        <div className="fileContainer-titleContainer-title">Project</div>
        <div
          onClick={() => {
            setIsCreate(true)
          }}
          className="fileContainer-titleContainer-btn">
          创建
        </div>
      </div>
      {isCreate && (
        <FileItem path="" createCallback={createFile} modelName="" />
      )}
      {fileList.map(item => (
        <FileItem
          key={item.fileName}
          fileName={item.fileName}
          modelName={item.modelName}
          callback={goCode}
          path={item.path}
        />
      ))}
    </div>
  )
}
