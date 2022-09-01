import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
import user from './modules/user'
import createPersistedState from 'vuex-persistedstate'
import permisson from './modules/permisson'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    settings,
    user,
    permisson
  },
  getters,
  plugins: [createPersistedState({
    reducer(state) {
      return {
        user: {
          hrsaasTime: state.user.hrsaasTime
        }
      }
    }
  })]
})

export default store
