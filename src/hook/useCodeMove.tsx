import React, { useCallback, useEffect, useState } from 'react'
enum ActiveMove {
  LEFT,
  RIGHT,
  MID
}

type IProps = () => [
  number,
  number,
  number,
  (e: React.MouseEvent<HTMLDivElement>) => void,
  (e: React.MouseEvent<HTMLDivElement>) => void,
  (e: React.MouseEvent<HTMLDivElement>) => void
]

let isMove = false
const speed = 0.6
let activeType = -1
let startX = 0
let startY = 0
const useCodeMove: IProps = () => {
  const [leftWidth, setLeftWidth] = useState(200)
  const [rightWidth, setRightWidth] = useState(400)
  const [midMove, setMidMove] = useState(300)

  const handlerMove = useCallback((e: MouseEvent) => {
    if (!isMove) return
    const disX = e.pageX - startX
    const disY = e.pageY - startY
    // console.log(activeType)
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

  const leftMoveFn = (e: React.MouseEvent<HTMLDivElement>) => {
    activeType = ActiveMove.LEFT
    startX = e.pageX
    isMove = true
  }

  const rightMoveFn = (e: React.MouseEvent<HTMLDivElement>) => {
    activeType = ActiveMove.RIGHT
    startX = e.pageX
    isMove = true
  }

  const midMoveFn = (e: React.MouseEvent<HTMLDivElement>) => {
    activeType = ActiveMove.MID
    startY = e.pageY
    isMove = true
  }

  useEffect(() => {
    window.addEventListener('mouseup', handlerUp)
    window.addEventListener('mousemove', handlerMove)
    return () => {
      window.removeEventListener('mouseup', handlerUp)
      window.removeEventListener('mousemove', handlerMove)
    }
  }, [])

  return [leftWidth, rightWidth, midMove, leftMoveFn, rightMoveFn, midMoveFn]
}

export default useCodeMove