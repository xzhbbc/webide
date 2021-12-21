import '../index.scss'
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
import useCodeMove from '@/hook/useCodeMove'
import useWatchWindow from '@/hook/useWatchWindow'
import EditorHelper from '@/utils/editor.helper'
import useSaveFile from '@/hook/useSaveFile'

let path = ''
export default function IndexPage() {
  const [leftWidth, rightWidth, midMove, leftMoveFn, rightMoveFn, midMoveFn] =
    useCodeMove(true)
  const [htmlCode, setHtmlCode] = useState('')
  const [jsCode, setJsCode] = useState('')
  const [cssCode, setCssCode] = useState('')
  const [editorHtmlCode, setEditorHtmlCode] = useState('')
  const [editorJsCode, setEditorJsCode] = useState('')
  const [editorCssCode, setEditorCssCode] = useState('')
  const [canRenderTree, setCanRenderTree] = useState(false)
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
  const [iframeView, setIframeView] = useState('')
  const [iframePort, setIframePort] = useState(80)
  const [showIframe, setShowIframe] = useState(false)
  const midDomRef = useRef<HTMLDivElement>(null)
  const midUpDomRef = useRef<HTMLDivElement>(null)
  const rightDomRef = useRef<HTMLDivElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  // const [leftMove, setLeftMove] = useState(0)
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const { query } = useLocation()

  const onMouseDownLeft = (e: React.MouseEvent<HTMLDivElement>) => leftMoveFn(e)

  const onMouseDownRight = (e: React.MouseEvent<HTMLDivElement>) =>
    rightMoveFn(e)

  const onMouseDownMid = (e: React.MouseEvent<HTMLDivElement>) => midMoveFn(e)

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

  const getCode = async (name: string) => {
    Loading.showLoading()
    const getFileList = await getFileCatalog()
    if (getFileList && getFileList.length > 0) {
      const lastFile = getFileList[getFileList.length - 1]
      if (!name) {
        resetUrlPath(lastFile.path)
        setSelectKey(`${lastFile.key}`)
      } else {
        if (query.path) {
          const getFileData = EditorHelper.highlightPath(
            getFileList,
            query.path
          )
          if (getFileData) {
            console.log(getFileData.key)
            setSelectKey(`${getFileData.file.key}`)
            setOpenKey(getFileData.key)
          }
        }
      }
      setCanRenderTree(true)
      const data = await get<CodeType>('/file/getCode', {
        name: `${query.name}/${name || lastFile.name}`
      })
      if (data.code === 0) {
        // eslint-disable-next-line prefer-const
        let { template, script, css, justRead } = data.data
        if (!justRead) {
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
        } else {
          setHtmlCode(template)
          setJsCode(script)
          setCssCode(css)
        }
      }
      console.log(data)
    }
    Loading.closeLoading()
  }

  useSaveFile(path, editorJsCode, getCode, editorHtmlCode, editorCssCode)

  const getFileCatalog: () => Promise<Catalog[]> = async () => {
    const data = await get<Catalog[]>('/file/getCatalog', {
      name: query.name
    })
    console.log(data)
    if (data.code == 0) {
      setTreeData(data.data)
    }
    return data?.data
  }

  useEffect(() => {
    getCode(query.path)
    // if (query?.name) {
    //   setIframeView(query.name)
    // }
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
    const getOpenKey = openKey
    setSelectKey(`${getFileKey}`)
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const getPathInfo = info.node as {
      type: string
      path: string
      parent: string
    }
    console.log(getOpenKey, 'keyList===')
    if (getPathInfo.type === 'file') {
      const getParentFileList = getPathInfo.parent.split('/')
      // const viewName = getParentFileList[getParentFileList.length - 1]
      // setIframeView(viewName)
      path = getPathInfo.path
      resetUrlPath(path)
      getCode(getPathInfo.path)
      // if (viewName) {
      //   reloadIframe()
      // }
    }
  }

  const resetUrlPath = (path: string) => {
    history.replaceState({}, '', `/vue?name=${query.name}&path=${path}`)
  }

  useEffect(() => {
    // runProject()
    // return () => {
    //   killProject()
    // }
  }, [query])

  const runProject = async () => {
    const run = await get<{
      port: number
    }>('/project/openService', {
      name: query.name
    })
    if (run.code == 0) {
      setShowIframe(true)
      setIframePort(run.data.port)
    } else {
      setShowIframe(false)
    }
  }

  const killProject = async () => {
    const run = await get('/file/killProject', {
      name: query.name
    })
  }

  useEffect(() => {
    runProject()
  }, [])

  useWatchWindow(
    [midDomRef, midUpDomRef, rightDomRef],
    [setMidScale, setUpScale, setRightScale]
  )

  return (
    <div className="container">
      <div
        className="container-left"
        style={{
          width: leftWidth
        }}>
        <Menu changeTheme={changeTheme} />
        {canRenderTree && treeData && treeData.length > 0 && (
          <Tree
            className="container-left-tree"
            showLine
            switcherIcon={<DownOutlined />}
            defaultExpandedKeys={openKey}
            defaultSelectedKeys={[selectKey]}
            // expandedKeys={openKey}
            // expandedKeys={['0-10']}
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
          {showIframe && (
            <iframe
              allowFullScreen={true}
              frameBorder="0"
              sandbox="allow-scripts allow-pointer-lock allow-same-origin allow-popups allow-modals allow-forms allow-top-navigation allow-presentation"
              src={`//localhost:${iframePort}`}
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
