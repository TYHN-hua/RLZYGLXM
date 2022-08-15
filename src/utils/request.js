// eslint-disable
import axios from 'axios'

import {Message} from 'element-ui'
// create an axios instance
const service = axios.create({
  baseURL: '/api',
  timeout: 5000
})
// 创建一个axios的实列
// request interceptor
service.interceptors.request.use()
// 请求拦截器
// response interceptor
// 响应拦截器
service.interceptors.response.use(response => {
    // axios默认加了一层data
    const { success, message, data } = response.data
    //   要根据success的成功与否决定下面的操作
    if (success) {
      return data
      
    } else {
      // 业务已经错误了 还能进then ? 不能 ！ 应该进catch
      Message.error(message) // 提示错误消息
      return Promise.reject(new Error(message))
    }
  }, error => {
    Message.error(error.message) // 提示错误信息
    return Promise.reject(error) // 返回执行错误 让当前的执行链跳出成功 直接进入 catch
  })

export default service
