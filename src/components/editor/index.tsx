import React, { useEffect, useState } from 'react'
import MonacoEditor from 'react-monaco-editor'
import './index.scss'

type IProps = {
  width: number
  height: number
  language: 'javascript' | 'css' | 'html'
  initCode?: string
  isDark?: boolean
  callback: (code: string) => void
}
const Editor: React.FC<IProps> = ({
  width,
  height,
  language,
  initCode,
  isDark = true,
  callback
}) => {
  const [code, setCode] = useState('')

  const changeCode = (newVal: string, e: any) => {
    console.log(newVal, e, 'changeCode', e.isUndoing)
    callback(newVal)
    setCode(newVal)
  }

  const options = {
    selectOnLineNumbers: true,
    roundedSelection: false,
    readOnly: false,
    automaticLayout: false
  }

  useEffect(() => {
    if (initCode != code) {
      setCode(initCode || '')
    }
  }, [initCode])

  return (
    <div className="editorWrap">
      <div className="editorWrap-tip">{language}</div>
      <MonacoEditor
        language={language}
        theme={isDark ? 'vs-dark' : 'vs-light'}
        value={code}
        width={width}
        height={height}
        options={options}
        onChange={changeCode}
      />
    </div>
  )
}

export default React.memo(Editor)
