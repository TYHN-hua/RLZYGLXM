import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'//
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n
import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control

import * as directives from '@/directives'
import * as fiflters from '@/filters'

import Print from 'vue-print-nb'
Vue.use(Print)
import myMixin from '@/mixin/checkPermission'
import i18n from '@/lang/index'
// 全局自定义指令
Object.keys(directives).forEach(ele => {
  Vue.directive(ele, directives[ele])
})
// 全局注册组件
import components from '@/components'
Vue.use(components)
Vue.use(ElementUI)
Vue.mixin(myMixin)
Vue.use(ElementUI, {
  i18n: (key, value) => i18n.t(key, value)
})
Object.keys(fiflters).forEach(key => {
  Vue.filter(key, fiflters[key])
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
