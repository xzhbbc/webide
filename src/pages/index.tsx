import './index.scss'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import Editor from '@/components/editor'
import { initHtmlTmp, initJsTmp } from '@/constant'
import Menu from '@/components/menu'
import { useLocation } from 'umi'
import { get } from '@/api/request'
import { CodeType } from '@/type/file.type'
import Loading from '@/utils/Loading'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { MicroAppWithMemoHistory } from 'umi'

enum ActiveMove {
  LEFT,
  RIGHT,
  MID
}

let startX = 0
let startY = 0
let isMove = false
const speed = 0.6
let activeType = -1
export default function IndexPage() {
  const [htmlCode, setHtmlCode] = useState('')
  const [jsCode, setJsCode] = useState('')
  const [cssCode, setCssCode] = useState('')
  const [leftWidth, setLeftWidth] = useState(132)
  const [rightWidth, setRightWidth] = useState(400)
  const [midMove, setMidMove] = useState(300)
  const [midScale, setMidScale] = useState({
    width: 0,
    height: 0
  })
  const [upScale, setUpScale] = useState({
    width: 0,
    height: 0
  })
  const [rightScale, setRightScale] = useState({
    width: 0,
    height: 0
  })
  const [isDark, setIsDark] = useState(true)
  const midDomRef = useRef<HTMLDivElement>(null)
  const midUpDomRef = useRef<HTMLDivElement>(null)
  const rightDomRef = useRef<HTMLDivElement>(null)
  // const [leftMove, setLeftMove] = useState(0)
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const { query } = useLocation()
  const handlerMove = useCallback((e: MouseEvent) => {
    if (!isMove) return
    const disX = e.pageX - startX
    const disY = e.pageY - startY
    console.log(activeType)
    if (activeType === ActiveMove.LEFT) {
      const move = disX * speed + leftWidth
      console.log(e, 'onMouseMoveLeft', disX, leftWidth)
      // setLeftMove(move)
      setLeftWidth(move)
    } else if (activeType === ActiveMove.RIGHT) {
      const move = -(disX * speed) + rightWidth
      setRightWidth(move)
    } else if (activeType === ActiveMove.MID) {
      const move = disY * speed + midMove
      setMidMove(move)
    }
  }, [])

  const handlerUp = useCallback((e: MouseEvent) => {
    // console.log('鼠标抬起了')
    isMove = false
  }, [])

  useEffect(() => {
    window.addEventListener('mouseup', handlerUp)
    window.addEventListener('mousemove', handlerMove)
    return () => {
      window.removeEventListener('mouseup', handlerUp)
      window.removeEventListener('mousemove', handlerMove)
    }
  }, [])

  const onMouseDownLeft = (e: React.MouseEvent<HTMLDivElement>) => {
    // console.log(e, 'onMouseDown')
    activeType = ActiveMove.LEFT
    startX = e.pageX
    isMove = true
  }

  const onMouseDownRight = (e: React.MouseEvent<HTMLDivElement>) => {
    activeType = ActiveMove.RIGHT
    startX = e.pageX
    isMove = true
  }

  const onMouseDownMid = (e: React.MouseEvent<HTMLDivElement>) => {
    activeType = ActiveMove.MID
    startY = e.pageY
    isMove = true
  }

  useEffect(() => {
    if (midDomRef && midDomRef.current) {
      console.log(midDomRef.current.offsetWidth, midDomRef.current.offsetHeight)
      setMidScale({
        width: midDomRef.current.offsetWidth,
        height: midDomRef.current.offsetHeight
      })
    }
  }, [midDomRef, leftWidth, rightWidth, midMove])

  useEffect(() => {
    if (midUpDomRef && midUpDomRef.current) {
      // console.log(midUpDomRef.current.offsetWidth, midUpDomRef.current.offsetHeight)
      setUpScale({
        width: midUpDomRef.current.offsetWidth,
        height: midUpDomRef.current.offsetHeight
      })
    }
  }, [midUpDomRef, leftWidth, rightWidth, midMove])

  useEffect(() => {
    if (rightDomRef && rightDomRef.current) {
      // console.log(midUpDomRef.current.offsetWidth, midUpDomRef.current.offsetHeight)
      setRightScale({
        width: rightDomRef.current.offsetWidth,
        height: rightDomRef.current.offsetHeight
      })
    }
  }, [rightDomRef, leftWidth, rightWidth, midMove])

  const changeTheme = useCallback(() => {
    setIsDark(!isDark)
  }, [isDark])

  const handlerKeyDown = (e: KeyboardEvent) => {
    if (
      (e.key == 's' || e.key == 'S') &&
      (navigator.userAgent.match('Mac') ? e.metaKey : e.ctrlKey)
    ) {
      e.preventDefault()
      console.log('保存中。。。')
      // alert('监听到ctrl+s')
    }
  }

  useEffect(() => {
    document.addEventListener('keydown', handlerKeyDown)
    return () => {
      document.removeEventListener('keydown', handlerKeyDown)
    }
  })

  const getCode = async (name: string) => {
    Loading.showLoading()
    const data = await get<CodeType>('/file/getCode', {
      name
    })
    if (data.code === 0) {
      const template = data.data.template
      const js = data.data.script
      setHtmlCode(
        initHtmlTmp(
          template.replaceAll(
            '\n',
            `
`
          )
        )
      )
      setJsCode(
        js.replaceAll(
          '\n',
          `
`
        )
      )
      setCssCode('')
    }
    console.log(data)
    Loading.closeLoading()
  }

  useEffect(() => {
    if (query?.name) {
      getCode(query.name)
    }
  }, [query])

  return (
    <div className="container">
      <div
        className="container-left"
        style={{
          width: leftWidth
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
      {/*<div*/}
      {/*  onMouseMove={onMouseMove}*/}
      {/*  onMouseDown={onMouseDown}*/}
      {/*  onMouseOut={onMouseOut}*/}
      {/*  className='container-split'>*/}
      {/*  <div/>*/}
      {/*</div>*/}
      <div
        className="container-mid"
        style={{
          left: leftWidth,
          right: rightWidth
        }}>
        <div
          style={{
            height: midMove
          }}
          className="container-mid-up"
          ref={midUpDomRef}>
          <Editor
            language="html"
            initCode={htmlCode}
            width={upScale.width}
            height={rightScale.height}
            isDark={isDark}
          />
          <div
            onMouseDown={onMouseDownMid}
            className="container-mid-up-split"
          />
        </div>
        <div ref={midDomRef} className="container-mid-down">
          <Editor
            language="javascript"
            initCode={jsCode}
            width={midScale.width}
            height={midScale.height}
            isDark={isDark}
          />
        </div>
      </div>
      {/*<div className='container-split'>*/}
      {/*  <div/>*/}
      {/*</div>*/}
      <div
        style={{
          width: rightWidth
        }}
        className="container-right">
        <div
          style={{
            height: midMove
          }}
          ref={rightDomRef}
          className="container-mid-up">
          <Editor
            language="css"
            width={rightScale.width}
            height={rightScale.height}
            isDark={isDark}
            initCode={cssCode}
          />
          <div
            onMouseDown={onMouseDownMid}
            className="container-right-up-split-mid"
          />
        </div>
        <div className="container-mid-down">
          <iframe
            scrolling="no"
            frameBorder="0"
            src={`//localhost:3000/${query?.name}.html`}
            className="iframe"
          />
        </div>
        <div onMouseDown={onMouseDownRight} className="container-right-split" />
      </div>
    </div>
  )
}
