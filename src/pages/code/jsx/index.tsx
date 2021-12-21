import React, { useCallback, useEffect, useRef, useState } from 'react'
import '../index.scss'
import Editor from '@/components/editor'
import Menu from '@/components/menu'
import useCodeMove from '@/hook/useCodeMove'
import useWatchWindow from '@/hook/useWatchWindow'
import { get } from '@/api/request'
import { useLocation } from 'umi'
import { Catalog, CodeType } from '@/type/file.type'
import { Tree } from 'antd'
import { DownOutlined } from '@ant-design/icons'
import { DataNode, EventDataNode } from 'rc-tree/lib/interface'
import Loading from '@/utils/Loading'
import EditorHelper from '@/utils/editor.helper'
import useSaveFile from '@/hook/useSaveFile'

let path = ''
const Index = () => {
  const [menuWidth, viewWidth, leftMoveFn, rightMoveFn] = useCodeMove()
  const [midViewScale, setMidViewScale] = useState({
    width: 0,
    height: 0
  })
  const midDomEditor = useRef<HTMLDivElement>(null)
  const [code, setCode] = useState('')
  const [editorCode, setEditorCode] = useState('')
  const [isDark, setIsDark] = useState(true)
  const [showIframe, setShowIframe] = useState(false)
  const [iframePort, setIframePort] = useState(80)
  const [treeData, setTreeData] = useState<Catalog[]>([])
  const [canRenderTree, setCanRenderTree] = useState(false)
  const [openKey, setOpenKey] = useState<string[]>([])
  const [selectKey, setSelectKey] = useState('')
  const iframeRef = useRef<HTMLIFrameElement>(null)
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const { query } = useLocation()

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

  useWatchWindow([midDomEditor], [setMidViewScale])

  useEffect(() => {
    getCode(query.path)
    // runProject()
    // return () => {
    //   killProject()
    // }
  }, [query])

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
        const { template, script, css, justRead } = data.data
        if (script) {
          setCode(script)
        }
      }
    }
    Loading.closeLoading()
  }

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

  useEffect(() => {
    runProject()
  }, [])

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
    history.replaceState({}, '', `/jsx?name=${query.name}&path=${path}`)
  }

  useSaveFile(path, editorCode, getCode)

  return (
    <div className="container">
      <div
        className="container-left"
        style={{
          width: menuWidth
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
        <div onMouseDown={onMouseRight} className="container-right-split" />
      </div>
    </div>
  )
}

export default Index
