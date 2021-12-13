import React, { useEffect, useState } from 'react'
import './index.scss'

type IProps = {
  fileName?: string
  modelName: string
  createCallback?: (value: string) => void
  callback?: (name: string, path: string) => void
  // path: string
}

let dom: HTMLElement | null
const FileItem: React.FC<IProps> = ({
  fileName,
  modelName,
  createCallback,
  callback
  // path
}) => {
  const [value, setValue] = useState('')
  const handler = (e: KeyboardEvent) => {
    if (e.key == 'Enter') {
      // console.log('确认', value)
      createCallback?.(value)
    }
  }

  useEffect(() => {
    if (!dom) {
      dom = document.getElementById('input')
    }
    dom && dom.addEventListener('keydown', handler)
    return () => {
      dom && dom.removeEventListener('keydown', handler)
    }
  }, [value])

  useEffect(() => {
    return () => {
      dom = null
    }
  }, [])

  return (
    <div
      onClick={() => {
        if (fileName) callback?.(fileName, modelName)
      }}
      className="fileContainer-item">
      <div className="fileContainer-item-text">
        项目：
        {fileName ? (
          fileName
        ) : (
          <input
            id="input"
            autoFocus={true}
            onChange={e => {
              setValue(e.target.value)
            }}
            onBlur={() => {
              createCallback?.('')
            }}
            type="text"
            value={value}
          />
        )}
      </div>
      <div className="fileContainer-item-text">使用的脚手架：{modelName}</div>
    </div>
  )
}

export default React.memo(FileItem)
