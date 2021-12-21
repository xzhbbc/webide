import { warpCss, warpJs } from '@/constant'
import Loading from '@/utils/Loading'
import { post } from '@/api/request'
import { useEffect } from 'react'
import { useLocation } from 'umi'

function useSaveFile(
  path: string,
  editorJsCode: string,
  callback: (path: string) => void
): void

function useSaveFile(
  path: string,
  editorJsCode: string,
  callback: (path: string) => void,
  editorHtmlCode: string,
  editorCssCode: string
): void

function useSaveFile(
  path: string,
  editorJsCode: string,
  callback: (path: string) => void,
  editorHtmlCode?: string,
  editorCssCode?: string
) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const { query } = useLocation()
  const handlerKeyDown = async (e: KeyboardEvent) => {
    if (
      (e.key == 's' || e.key == 'S') &&
      (navigator.userAgent.match('Mac') ? e.metaKey : e.ctrlKey)
    ) {
      e.preventDefault()
      console.log('保存中。。。')
      // console.log(editorHtmlCode)
      // console.log(warpJs(editorJsCode))
      // console.log(editorCssCode)
      if (!path) alert('获取不到文件')
      Loading.showLoading()

      const params = {
        name: query.name + path
      }

      if (path.indexOf('.vue') > -1) {
        Object.assign(params, {
          html: editorHtmlCode,
          script: warpJs(editorJsCode),
          css: warpCss(editorCssCode || editorJsCode)
        })
      } else if (
        path.indexOf('scss') > -1 ||
        path.indexOf('.css') > -1 ||
        path.indexOf('.less') > -1
      ) {
        Object.assign(params, {
          html: '',
          script: '',
          css: editorCssCode
        })
      } else {
        Object.assign(params, {
          html: '',
          script: editorJsCode,
          css: ''
        })
      }

      const setCode = await post('/file/setCode', params)
      console.log(setCode)
      Loading.closeLoading()
      // iframeRef?.current?.contentWindow?.location.reload()
      // getCode(path)
      callback(path)
      // reloadIframe()
      // alert('监听到ctrl+s')
    }
  }

  useEffect(() => {
    document.addEventListener('keydown', handlerKeyDown)
    return () => {
      document.removeEventListener('keydown', handlerKeyDown)
    }
  }, [editorHtmlCode, editorJsCode, editorCssCode])
}

export default useSaveFile
