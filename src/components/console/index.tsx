import { DownSquareTwoTone, UpSquareTwoTone } from '@ant-design/icons'
import React, { useState, useRef, useEffect, useCallback } from 'react'
import './index.scss'

const speed = 0.6
let isMove = false
let startY = 0
const Console = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [consoleHeight, setConsoleHeight] = useState(500)
  // const startY = useRef(0)

  const moveTab = useCallback(
    (e: MouseEvent) => {
      if (!isOpen || !isMove) return
      console.log(e.pageY, 'move', startY)
      const disY = e.pageY - startY
      const move = -disY * speed + consoleHeight
      setConsoleHeight(move)
    },
    [isOpen, consoleHeight]
  )

  const downTab = (e: React.MouseEvent<HTMLDivElement>) => {
    isMove = true
    console.log('down', e.pageY)
    startY = e.pageY
  }

  const upTab = useCallback(() => {
    isMove = false
  }, [isOpen])

  useEffect(() => {
    window.addEventListener('mouseup', upTab)
    window.addEventListener('mousemove', moveTab)
    return () => {
      window.removeEventListener('mouseup', upTab)
      window.removeEventListener('mousemove', moveTab)
    }
  }, [])

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
        </div>
      )}
    </div>
  )
}

export default React.memo(Console)
