import React, { useCallback, useEffect, useState } from 'react'
import { history } from 'umi'
import './index.scss'
import FileItem from '@/components/fileItem'
import Loading from '@/utils/Loading'
import { get } from '@/api/request'
import { ProjectType } from '@/type/file.type'

export default function FilePage() {
  const [isCreate, setIsCreate] = useState(false)
  const [fileList, setFileList] = useState<ProjectType[]>([])

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
    const data = await get<ProjectType[]>('/project/getProject', {})
    if (data.code == 0) {
      setFileList(data.data)
    }
    Loading.closeLoading()
  }

  const goCode = useCallback((name: string, modelName: string) => {
    if (modelName.indexOf('vue') > -1) {
      history.push(`/vue?name=${name}`)
    } else if (modelName.indexOf('react') > -1) {
      history.push(`/jsx?name=${name}`)
    }
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
      {isCreate && <FileItem modelName="" createCallback={createFile} />}
      {fileList.map(item => (
        <FileItem
          key={item.name}
          fileName={item.name}
          modelName={''}
          callback={goCode}
          // path={item.path}
        />
      ))}
    </div>
  )
}
