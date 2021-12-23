import axios from 'axios'

type ResponseData<T> = {
  code: number
  data: T
  msg: string
}

axios.defaults.baseURL = '//localhost:4500'
axios.defaults.timeout = 50000

axios.interceptors.request.use(config => {
  const token = window.localStorage.getItem('token') || ''
  token && config.headers && (config.headers.Authorization = token)
  return config
})

export function get<T>(
  url: string,
  params: Record<string, any>
): Promise<ResponseData<T>> {
  return new Promise((resolve, reject) => {
    axios
      .get(url, { params })
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        reject(err.data)
      })
  })
}

export function post<T>(
  url: string,
  params: Record<string, any>
): Promise<ResponseData<T>> {
  return new Promise((resolve, reject) => {
    axios
      .post(url, params)
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        reject(err.data)
      })
  })
}
