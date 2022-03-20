import { DownSquareTwoTone, UpSquareTwoTone } from '@ant-design/icons'
import React, { useState, useRef, useEffect, useCallback } from 'react'
import './index.scss'
import _ from 'lodash'

const speed = 0.7
let isMove = false
let startY = 0
const Console = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [consoleHeight, setConsoleHeight] = useState(500)
  // const startY = useRef(0)

  const throttleMove = _.throttle(
    (e: MouseEvent) => {
      if (!isOpen || !isMove) return
      // console.log(e.pageY, 'move', startY, isOpen, isMove)
      const disY = e.pageY - startY
      const move = -disY * speed + consoleHeight
      setConsoleHeight(move)
    },
    200,
    {
      leading: true,
      trailing: false
    }
  )

  const moveTab = useCallback(throttleMove, [isOpen, consoleHeight])

  const downTab = (e: React.MouseEvent<HTMLDivElement>) => {
    isMove = true
    console.log('down', e.pageY)
    startY = e.pageY
  }

  const upTab = useCallback(() => {
    console.log('isUp')
    isMove = false
  }, [isOpen])

  useEffect(() => {
    window.addEventListener('mouseup', upTab)
    window.addEventListener('mousemove', moveTab)
    return () => {
      window.removeEventListener('mouseup', upTab)
      window.removeEventListener('mousemove', moveTab)
    }
  }, [isOpen])

  return (
    <div className="console">
      <div onMouseDown={downTab} className="titleBar">
        <div className="tab">Console</div>
        <div
          onClick={() => {
            setIsOpen(!isOpen)
          }}
          className="icon">
          {isOpen ? <UpSquareTwoTone /> : <DownSquareTwoTone />}
        </div>
      </div>
      {isOpen && (
        <div style={{ height: consoleHeight }} className="content">
          <div className="item">1234</div>
          <div className="item">1234</div>
          <div className="item">1234</div>
          <div className="item">1234</div>
          <div className="item">1234</div>
          <div className="item">1234</div>
          <div className="item">1234</div>
          <div className="item">1234</div>
          <div className="item">1234</div>
          <div className="item">1234</div>
          <div className="item">1234</div>
          <div className="item">1234</div>
          <div className="item">1234</div>
          <div className="item">1234</div>
          <div className="item">1234</div>
          <div className="item">1234</div>
          <div className="item">1234</div>
          <div className="item">1234</div>
          <div className="item">1234</div>
          <div className="item">1234</div>
          <div className="item">1234</div>
        </div>
      )}
    </div>
  )
}

export default React.memo(Console)
