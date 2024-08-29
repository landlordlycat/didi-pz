import axios from 'axios'

import { ElMessage } from 'element-plus'
import { State } from '@/content/state'
import { getItem, removeItem } from '@/utils/localStorage'
import router from '@/router'
const instance = axios.create({
  baseURL: '/v3pz',
  timeout: 10000
})
const whitelist = ['/get/code', '/login', '/user/authentication']
instance.interceptors.request.use(
  (config) => {
    const { token } = getItem(State.UserInfo)
    //whitelist
    if (token && !whitelist.includes(config.url!)) {
      config.headers['x-token'] = `${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

instance.interceptors.response.use(
  (response) => {
    if (response.data.code === -1) {
      if (typeof response.data.message === 'object') {
        ElMessage.warning(response.data.message.msg)
      } else {
        ElMessage.warning(response.data.message)
      }
    }
    if (response.data.code === -2) {
      removeItem(State.UserInfo)
      removeItem(State.Menu)
      router.replace('/login')
    }
    return response.data
  },
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          //token过期
          break
        case 403:
          //没有权限
          break
        case 404:
          //接口不存在
          break
        case 500:
          //服务器错误
          break
        default:
          break
      }
      return Promise.reject(error)
    }
  }
)

export default instance
