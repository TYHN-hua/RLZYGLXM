import {login} from '@/api/user'
import {setToken,getToken,removeToken} from '@/utils/auth'
export default {
  namespaced: true,
  state: {
    token: getToken()
  },
  mutations: {
    setToken(state,token) {
      state.token = token
      setToken(token)
    },
    removeToken(state) {
      state.token = null
      removeToken()
    }
  },
  actions: {
    async login({commit},data) {
      const res = await login(data)
      console.log(res)  // token
      commit('setToken',res)
    }
  }
}