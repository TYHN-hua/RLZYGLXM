// 1. 权限拦截处理逻辑需要放在路由的前置守卫里处理
// 2. 首先判断有无token
// 2.1 token 存在 说明 处于登录状态
// 2.1.1 判断是否处于登录页面，是的话 跳首页 否则 直接留在当前页（直接放行 next()）
// 2.2 token 不存在 说明 不处于登录状态
// 2.2.1 判断一下 是否处于白名单 是的话 直接留在 当前页 否则 跳转到登录页

import router from '@/router'
import store from '@/store'

const whiteList = ['/login', '/404']

router.beforeEach(async(to, from, next) => {
  // console.log('to', to)
  // console.log('from', from)
  // 首先判断有无token store.getters.token
  // this.$store
  if (store.getters.token) { // 存在 说明 处于登录状态
    // token 存在的时候 调用 获取用户资料
    // 先看一下 用户资料 是否拿到
    // userinfo userId
    // !store.state.user.userInfo.userId
    if (!store.getters.userId) {
      await store.dispatch('user/getUserInfo')
    }
    // 当去往页面是不是 登录页  去首页  否则 直接放行
    if (to.path === '/login') {
      next('/')
    } else { // 直接放行
      next()
    }
  } else { //  不处于登录状态
    if (whiteList.includes(to.path)) { // 是否处于白名单
      next() // 是
    } else {
      next('/login') // 去登录页
    }
  }
})
