import React from 'react'
import './index.scss'

type IProps = {
  changeTheme: () => void
}

const Menu: React.FC<IProps> = ({ changeTheme }) => {
  return (
    <div className="menu">
      <div onClick={changeTheme} className="menu-top">
        更改主题
      </div>
    </div>
  )
}

export default React.memo(Menu)
