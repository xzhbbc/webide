import React, { useEffect, useState } from 'react'
import MonacoEditor from 'react-monaco-editor'
import './index.scss'

type IProps = {
  width: number
  height: number
  language: 'javascript' | 'css' | 'html' | 'typescript'
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

  const editorWillMount = (monaco: any) => {
    if (language == 'typescript') {
      monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
        target: monaco.languages.typescript.ScriptTarget.Latest,
        allowNonTsExtensions: true,
        moduleResolution:
          monaco.languages.typescript.ModuleResolutionKind.NodeJs,
        module: monaco.languages.typescript.ModuleKind.CommonJS,
        noEmit: true,
        esModuleInterop: true,
        jsx: monaco.languages.typescript.JsxEmit.React,
        reactNamespace: 'React',
        allowJs: true,
        typeRoots: ['node_modules/@types']
      })
    }
  }

  return (
    <div className="editorWrap">
      <div className="editorWrap-tip">{language}</div>
      <MonacoEditor
        language={language}
        theme={isDark ? 'vs-dark' : 'vs-light'}
        editorWillMount={editorWillMount}
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
