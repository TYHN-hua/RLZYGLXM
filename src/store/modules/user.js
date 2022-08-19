import { login, getUserInfo, getUserDetailById } from '@/api/user'
import { setToken, getToken, removeToken } from '@/utils/auth'

export default {
  namespaced: true,
  state: {
    token: getToken(),
    userInfo: {}, // null
    hrsaasTime: ''
  },
  mutations: {
    setToken(state, token) {
      state.token = token
      setToken(token)
    },
    removeToken(state) {
      state.token = null
      removeToken()
    },
    setUserInfo(state, userInfo) {
      // state.userInfo = { ...userInfo } //   浅拷贝
      state.userInfo = JSON.parse(JSON.stringify(userInfo))
    },
    removeUserInfo(state) {
      state.userInfo = {}
    },
    setHrsaasTime(state, time) {
      state.hrsaasTime = time
    }
  },
  actions: {
    // 通过接口获取token
    // commit setToken
    async login({ commit }, data) {
      const res = await login(data)
      console.log(res) // token
      commit('setHrsaasTime', Date.now())
      commit('setToken', res)
    },
    // 通过接口获取用户信息
    // token 到底 验证
    async getUserInfo({ commit }) {
      const res = await getUserInfo()
      // res 对象 引用数据类型
      // res 传递  userInfo 地址
      // getUserDetailById
      const baseInfo = await getUserDetailById(res.userId)
      // baseInfo 包含用户图片的数据
      const baseResult = { ...res, ...baseInfo }
      commit('setUserInfo', baseResult)
      return baseResult // 后面 不推荐 直接返回res
      // 重点 要意识到这个 这个数据传递过程 带来的问题
      // 说明两个问题
      // userInfo 可以设置成null
      // return res 在这一块 需要把 res 返回出去 会带来什么问题
    },
    logout({ commit }) {
      commit('removeToken')
      commit('removeUserInfo')
    }
  }
}
