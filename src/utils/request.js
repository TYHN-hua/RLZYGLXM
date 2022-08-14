// eslint-disable
import axios from 'axios'
// create an axios instance
const service = axios.create()
// 创建一个axios的实列
// request interceptor
service.interceptors.request.use()
// 请求拦截器
// response interceptor
service.interceptors.response.use()
// 响应拦截器
export default service
