import React, { useCallback, useEffect, useRef, useState } from 'react'
import '../index.scss'
import Editor from '@/components/editor'
import Menu from '@/components/menu'
import useCodeMove from '@/hook/useCodeMove'

const Index = () => {
  const [menuWidth, viewWidth, midWidth, leftMoveFn, rightMoveFn, midMove] =
    useCodeMove()
  const [midViewScale, setMidViewScale] = useState({
    width: 0,
    height: 0
  })
  const midDomEditor = useRef<HTMLDivElement>(null)
  const [code, setCode] = useState('')
  const [editorCode, setEditorCode] = useState('')
  const [isDark, setIsDark] = useState(true)

  const onMouseDownLeft = (e: React.MouseEvent<HTMLDivElement>) => leftMoveFn(e)

  const onMouseRight = (e: React.MouseEvent<HTMLDivElement>) => rightMoveFn(e)

  useEffect(() => {
    if (midDomEditor && midDomEditor.current) {
      // console.log(midUpDomRef.current.offsetWidth, midUpDomRef.current.offsetHeight)
      setMidViewScale({
        width: midDomEditor.current.offsetWidth,
        height: midDomEditor.current.offsetHeight
      })
    }
  }, [midDomEditor, menuWidth, viewWidth])

  const setCodeCall = useCallback(
    (code: string) => {
      // console.log('changeHtml', code, editorCode)
      setEditorCode(code)
    },
    [editorCode]
  )

  const changeTheme = useCallback(() => {
    setIsDark(!isDark)
  }, [isDark])

  const watchWindowSize = () => {
    if (midDomEditor && midDomEditor.current) {
      // console.log(midUpDomRef.current.offsetWidth, midUpDomRef.current.offsetHeight)
      setMidViewScale({
        width: midDomEditor.current.offsetWidth,
        height: midDomEditor.current.offsetHeight
      })
    }
  }

  useEffect(() => {
    window.addEventListener('resize', watchWindowSize)
    return () => {
      window.removeEventListener('resize', watchWindowSize)
    }
  }, [])

  return (
    <div className="container">
      <div
        className="container-left"
        style={{
          width: menuWidth
        }}>
        <Menu changeTheme={changeTheme} />
        <div
          // onMouseMove={onMouseMove}
          onMouseDown={onMouseDownLeft}
          // onMouseLeave={onMouseUp}
          className="container-left-split"
          style={{
            right: 0
          }}
        />
      </div>
      <div
        className="container-mid"
        ref={midDomEditor}
        style={{
          left: menuWidth,
          right: viewWidth
        }}>
        <Editor
          language="typescript"
          initCode={code}
          callback={setCodeCall}
          width={midViewScale.width}
          height={midViewScale.height}
          isDark={isDark}
        />
      </div>
      <div
        style={{
          width: viewWidth
        }}
        className="container-right">
        <div onMouseDown={onMouseRight} className="container-right-split" />
      </div>
    </div>
  )
}

export default Index
