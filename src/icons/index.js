import Vue from 'vue'
import SvgIcon from '@/components/SvgIcon'// svg component

// register globally
Vue.component('svg-icon', SvgIcon)

const req = require.context('./svg', false, /\.svg$/)
console.log(req.keys()) // 导出所有的路径
console.log(req('./dashboard.svg'))// 根据路径 找到对应的模块

// function fn(val) {
//   console.log(val)
//   return val
// }

// [1, 2, 3, 4, 5].map(fn)
// [1,2,3,4,5].map(ele => fn(ele))

// ['./dashboard.svg', './example.svg', './eye-open.svg', './eye.svg', './form.svg', './link.svg', './nested.svg', './password.svg', './table.svg', './tree.svg', './user.svg']

const requireAll = requireContext => requireContext.keys().map(requireContext)

console.log(requireAll(req))
