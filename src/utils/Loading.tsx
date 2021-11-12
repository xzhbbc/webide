import ReactDOM from 'react-dom'
import LoadingComponent from '@/components/loading'

export default class Loading {
  static showLoading = () => {
    const dom = document.createElement('div')
    dom.setAttribute('id', 'loading')
    document.body.appendChild(dom)
    // eslint-disable-next-line react/react-in-jsx-scope
    ReactDOM.render(<LoadingComponent />, dom)
  }
  static closeLoading = () => {
    const dom = document.getElementById('loading')
    dom && document.body.removeChild(dom)
  }
}
