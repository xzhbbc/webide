import React, { useCallback, useEffect, useState } from 'react'
import _ from 'lodash'

enum ActiveMove {
  LEFT,
  RIGHT,
  MID
}

let isMove = false
const speed = 0.6
let activeType = -1
let startX = 0
let startY = 0

function useCodeMove(): [
  number,
  number,
  (e: React.MouseEvent<HTMLDivElement>) => void,
  (e: React.MouseEvent<HTMLDivElement>) => void
]

function useCodeMove(
  midNeed: boolean
): [
  number,
  number,
  number,
  (e: React.MouseEvent<HTMLDivElement>) => void,
  (e: React.MouseEvent<HTMLDivElement>) => void,
  (e: React.MouseEvent<HTMLDivElement>) => void
]

function useCodeMove(midNeed?: boolean) {
  const [leftWidth, setLeftWidth] = useState(200)
  const [rightWidth, setRightWidth] = useState(400)
  const [midMove, setMidMove] = useState(300)

  const throttleMove = _.throttle(
    (e: MouseEvent) => {
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
    },
    200,
    {
      leading: true,
      trailing: false
    }
  )

  const handlerMove = useCallback(throttleMove, [])

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

  if (midNeed) {
    return [leftWidth, rightWidth, midMove, leftMoveFn, rightMoveFn, midMoveFn]
  } else {
    return [leftWidth, rightWidth, leftMoveFn, rightMoveFn]
  }
}

export default useCodeMove
