import React, { Dispatch, SetStateAction, useEffect } from 'react'

function useWatchWindow(
  refList: Array<React.RefObject<HTMLDivElement>>,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  fnList: Array<Dispatch<SetStateAction<{ width: number; height: number }>>>
) {
  const watchWindowSize = () => {
    refList.forEach((ref, index) => {
      if (ref && ref.current) {
        fnList[index]({
          width: ref.current.offsetWidth,
          height: ref.current.offsetHeight
        })
      }
    })
  }

  useEffect(() => {
    window.addEventListener('resize', watchWindowSize)
    return () => {
      window.removeEventListener('resize', watchWindowSize)
    }
  }, [])
}

export default useWatchWindow
