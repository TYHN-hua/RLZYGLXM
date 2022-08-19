import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import router from '@/router'
const timeout = 10 // 10*60*60 == 36000 s
// 定义超时时间
// 封装判断时间否是超时的函数
function isCheckOut() {
  // 现在的时间 - 获取token的时间 > 定义超时时间  注意单位是秒
  return (Date.now() - store.getters.hrsaasTime) / 1000 > timeout
}

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  timeout: 5000 // request timeout
})
// 请求拦截器里添加Authorization 字段
service.interceptors.request.use(config => {
  console.log(config)
  // config.headers 加一个验证的字段
  // Authorization = Bearer+空格+token
  if (store.getters.token) { // token存在
    // 只有在有token的情况下 才有必要去检查时间戳是否超时
    // console.log(isCheckOut())
    if (isCheckOut()) { // 超时
      store.dispatch('user/logout')
      router.push('/login')
      // Message.error('token接口超时')
      return Promise.reject(new Error('token接口超时'))
    }
    // 超时 调用logout
    // 跳往 登录页
    // Promise 爆出错误

    // 没有超时 继续发出请求
    config.headers['Authorization'] = `Bearer ${store.getters.token}`
  }
  return config
}, error => {
  return Promise.reject(error)
})

service.interceptors.response.use((response) => {
  const { success, message, data } = response.data
  if (success) {
    return data
  } else {
    Message.error(message)
    return Promise.reject(new Error(message))
  }
}, (err) => {
  Message.error(err.message || '')
  return Promise.reject(err)
})

export default service

