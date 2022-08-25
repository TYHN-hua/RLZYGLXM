// import PageTools from './PageTools'

// export default (Vue) => {
//   Vue.component('page-tools', PageTools)
// }

// main.js Vue.use  批量注册组件

// export default {
//   install(Vue) {
//     Vue.component('page-tools', PageTools)
//   }
// }

// 自动批量注册组件
const requireComponent = require.context('./', true, /\.vue$/)
const res = requireComponent.keys().map(requireComponent)
export default (Vue) => {
  res.forEach(ele => {
    Vue.component(ele.default.name, ele.default)
  })
}
