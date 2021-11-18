import './index.scss'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Editor from '@/components/editor'
import { initHtmlTmp, initJsTmp, warpCss, warpJs } from '@/constant'
import Menu from '@/components/menu'
import { useLocation } from 'umi'
import { get, post } from '@/api/request'
import { Catalog, CodeType } from '@/type/file.type'
import Loading from '@/utils/Loading'
import { Tree } from 'antd'
import { DownOutlined } from '@ant-design/icons'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { MicroAppWithMemoHistory } from 'umi'
import { DataNode, EventDataNode } from 'rc-tree/lib/interface'

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
  const [editorHtmlCode, setEditorHtmlCode] = useState('')
  const [editorJsCode, setEditorJsCode] = useState('')
  const [editorCssCode, setEditorCssCode] = useState('')
  const [leftWidth, setLeftWidth] = useState(200)
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
  const [treeData, setTreeData] = useState<Catalog[]>([])
  const [openKey, setOpenKey] = useState<string[]>([])
  const [selectKey, setSelectKey] = useState('')
  const [path, setPath] = useState('')
  const [iframeView, setIframeView] = useState('')
  const midDomRef = useRef<HTMLDivElement>(null)
  const midUpDomRef = useRef<HTMLDivElement>(null)
  const rightDomRef = useRef<HTMLDivElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)
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

  const watchWindowSize = useCallback(() => {
    if (midDomRef && midDomRef.current) {
      console.log(midDomRef.current.offsetWidth, midDomRef.current.offsetHeight)
      setMidScale({
        width: midDomRef.current.offsetWidth,
        height: midDomRef.current.offsetHeight
      })
    }
    if (midUpDomRef && midUpDomRef.current) {
      // console.log(midUpDomRef.current.offsetWidth, midUpDomRef.current.offsetHeight)
      setUpScale({
        width: midUpDomRef.current.offsetWidth,
        height: midUpDomRef.current.offsetHeight
      })
    }
    if (rightDomRef && rightDomRef.current) {
      // console.log(midUpDomRef.current.offsetWidth, midUpDomRef.current.offsetHeight)
      setRightScale({
        width: rightDomRef.current.offsetWidth,
        height: rightDomRef.current.offsetHeight
      })
    }
  }, [])

  useEffect(() => {
    window.addEventListener('mouseup', handlerUp)
    window.addEventListener('mousemove', handlerMove)
    window.addEventListener('resize', watchWindowSize)
    return () => {
      window.removeEventListener('mouseup', handlerUp)
      window.removeEventListener('mousemove', handlerMove)
      window.addEventListener('resize', watchWindowSize)
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

  const reloadIframe = () => {
    window.open(iframeRef.current?.src, 'refresh_name', '')
  }

  const handlerKeyDown = async (e: KeyboardEvent) => {
    if (
      (e.key == 's' || e.key == 'S') &&
      (navigator.userAgent.match('Mac') ? e.metaKey : e.ctrlKey)
    ) {
      e.preventDefault()
      console.log('保存中。。。')
      console.log(editorHtmlCode)
      console.log(warpJs(editorJsCode))
      console.log(editorCssCode)
      if (!query?.path) alert('获取不到文件')
      Loading.showLoading()
      const setCode = await post('/file/setCode', {
        html: editorHtmlCode,
        script: warpJs(editorJsCode),
        css: warpCss(editorCssCode),
        name: query.path
      })
      console.log(setCode)
      Loading.closeLoading()
      // iframeRef?.current?.contentWindow?.location.reload()
      getCode(query.path)
      reloadIframe()
      // alert('监听到ctrl+s')
    }
  }

  useEffect(() => {
    document.addEventListener('keydown', handlerKeyDown)
    return () => {
      document.removeEventListener('keydown', handlerKeyDown)
    }
  }, [editorHtmlCode, editorJsCode, editorCssCode])

  const getCode = async (name: string) => {
    Loading.showLoading()
    const data = await get<CodeType>('/file/getCode', {
      name
    })
    if (data.code === 0) {
      // eslint-disable-next-line prefer-const
      let { template, script, css } = data.data
      setHtmlCode(
        initHtmlTmp(
          template.replaceAll(
            '\n',
            `
`
          )
        )
      )
      // console.log()
      if (script.indexOf('\n') === 0) {
        script = script.replace('\n', '')
      }
      setJsCode(
        script.replaceAll(
          '\n',
          `
`
        )
      )
      if (css.indexOf('\n') === 0) {
        css = css.replace('\n', '')
      }
      setCssCode(
        css.replaceAll(
          '\n',
          `
`
        )
      )
      setEditorHtmlCode(initHtmlTmp(template))
      setEditorJsCode(script)
      setEditorCssCode(css)
    }
    console.log(data)
    Loading.closeLoading()
  }

  const getFileCatalog = async () => {
    const data = await get<Catalog[]>('/file/getCatalog', {})
    console.log(data)
    if (data.code == 0) {
      // data.data.map(item => {
      //
      // })
      const findItemFile = data.data.find(item => item.name == 'src')
      const findItemView = findItemFile?.children?.find(
        item => item.name == 'views'
      )
      const findFile = findItemView?.children?.find(
        item => item.name == query?.name
      )
      if (findFile) {
        if (findFile?.children) {
          setSelectKey(`${findFile.children[0].key}`)
        }
        setOpenKey([findFile.key])
      }
      setTreeData(data.data)
    }
  }

  useEffect(() => {
    if (query?.path) {
      getCode(query.path)
      getFileCatalog()
    }
    if (query?.name) {
      setIframeView(query.name)
    }
  }, [query])

  const setHtml = useCallback(
    (code: string) => {
      // console.log('changeHtml', code, editorCode)
      setEditorHtmlCode(code)
    },
    [editorHtmlCode]
  )

  const setScript = useCallback(
    (code: string) => {
      setEditorJsCode(code)
    },
    [editorJsCode]
  )

  const setCss = useCallback(
    (code: string) => {
      setEditorCssCode(code)
    },
    [editorCssCode]
  )

  const getPath = (key: string, cate: Catalog[]) => {
    let treePath = ''
    cate.forEach((item, i) => {
      const secKey = item.key
      if (key.indexOf(secKey) > -1) {
        if (item.children) {
          getPath(key, item.children)
        } else {
          console.log(item.name, key, item.key)
          treePath = item.name
        }
      }
    })
    return treePath
    // treeData
  }

  const selectFile = (
    keys: any,
    info: {
      event: 'select'
      selected: boolean
      node: EventDataNode
      selectedNodes: DataNode[]
      nativeEvent: MouseEvent
    }
  ) => {
    console.log('selected', keys, info, treeData)
    const getFileKey = info.node.key
    setSelectKey(`${getFileKey}`)
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const getPathInfo = info.node as {
      type: string
      path: string
      parent: string
    }
    if (getPathInfo.type === 'file') {
      const getParentFileList = getPathInfo.parent.split('/')
      const viewName = getParentFileList[getParentFileList.length - 1]
      setIframeView(viewName)
      history.replaceState(
        {},
        '',
        `/code?name=${viewName}&path=${getPathInfo.path}`
      )
      getCode(getPathInfo.path)
      reloadIframe()
    }
  }

  console.log(query, 'query')
  return (
    <div className="container">
      <div
        className="container-left"
        style={{
          width: leftWidth
        }}>
        <Menu changeTheme={changeTheme} />
        {treeData && treeData.length > 0 && (
          <Tree
            className="container-left-tree"
            showLine
            switcherIcon={<DownOutlined />}
            checkStrictly
            defaultExpandedKeys={openKey}
            selectedKeys={[selectKey]}
            // expandedKeys={openKey}
            // expandedKeys={['0-10']}
            // autoExpandParent
            onSelect={selectFile}
            treeData={treeData}
          />
        )}
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
            callback={setHtml}
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
            callback={setScript}
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
            callback={setCss}
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
          {iframeView && (
            <iframe
              allowFullScreen={true}
              frameBorder="0"
              sandbox="allow-scripts allow-pointer-lock allow-same-origin allow-popups allow-modals allow-forms allow-top-navigation allow-presentation"
              src={`//localhost:3000/${iframeView}.html`}
              className="iframe"
              ref={iframeRef}
              name="refresh_name"
            />
          )}
        </div>
        <div onMouseDown={onMouseDownRight} className="container-right-split" />
      </div>
    </div>
  )
}
