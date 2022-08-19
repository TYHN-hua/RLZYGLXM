// 1. 权限拦截处理逻辑需要放在路由的前置守卫里处理
// 2. 首先判断有无token
// 2.1 token 存在 说明 处于登录状态
// 2.1.1 判断是否处于登录页面，是的话 跳首页 否则 直接留在当前页（直接放行 next()）
// 2.2 token 不存在 说明 不处于登录状态
// 2.2.1 判断一下 是否处于白名单 是的话 直接留在 当前页 否则 跳转到登录页
import router from './router'
import store from './store'

// 白名单
const whiteList = ['/login', '/404']

router.beforeEach((to, from, next) => {
  //  首先判断有无token
  //   如果有token 继续判断是不是去登录页
  if (store.getters.token) {
    if (to.path === '/login') {
      // 有，跳到主页
      next('/')
    } else { // 直接放行
      next()
    }
  } else {
    if (whiteList.includes(to.path)) {
      // 如果找到了 表示在在名单里面
      next()
    } else {
      next('/login') // 去登录页
    }
  }
})
