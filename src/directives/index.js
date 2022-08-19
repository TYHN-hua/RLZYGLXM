
// 先写逻辑
export const imgerror = {
  inserted: function(dom, options) {
    console.log(dom) // 指令用在那个标签上 dom就是那个标签
    console.log(options) // 对当前指令的描述 指令的名称 表达式 表达式 对应的值
    // 图片加载失败 触发 img error
    dom.onerror = function() {
      // dom img 设置一个默认图片
      dom.src = options.value
    }
  }
}
