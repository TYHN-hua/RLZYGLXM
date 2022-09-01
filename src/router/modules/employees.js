// 导出员工的路由规则
import Layout from '@/layout'
export default {
  // 路由规则
  path: '/employees', // 路由地址
  component: Layout,
  meta: { id: 'employees' },
  children: [
    {
      name: 'employees', // 给模块的一级路由加一个name属性
      // 二级路由path什么都不用写的时候 此时它表示二级路由的默认路由
      path: '', // 这里不用写，不写的时候表示employees 不但有layout员工主页
      // 动态按需加载，通过箭头函数的形式引入
      component: () => import('@/views/employees'),
      // 路由的源信息 其实就是一个储存数据的地方，可以放任何内容
      meta: {
        title: '员工管理', // 这里用title的原因是因为左侧导航读取了这里的title属性
        icon: 'people'
      }
    },
    {
      path: 'detail/:id',
      component: () => import('@/views/employees/detail'),
      hidden: true,
      meta: { title: '员工详情' }
    },
    {
      path: 'print/:id', // 二级默认路由
      component: () => import('@/views/employees/print'), // 按需加载
      hidden: true,
      meta: {
        title: '打印', // 标记当前路由规则的中文名称 后续在做左侧菜单时 使用
        icon: 'people'
      }
    }
  ]
}
