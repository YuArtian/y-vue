import { initState } from './state'
import { compileToFunction } from './compiler/index'
import { mountComponent } from './lifeCycle'

export function initMixin(Vue){
  //初始化
  Vue.prototype._init = function(options){
    //数据劫持
    const vm = this
    vm.$options = options
    //初始化状态
    initState(vm)

    //如果用户传入了 el
    if (vm.$options.el) {
      vm.$mount(vm.$options.el)
    }
  }

  //挂载
  Vue.prototype.$mount = function(el){
    const vm = this
    const options = vm.$options
    el = document.querySelector(el)
    //找render方法、没有则用template、再没有就直接用el中的内容
    if (!options.render) {
      let template = options.template
      if (!template && el) {
        template = el.outerHTML
      }
      //生成render方法
      const render = compileToFunction(template)
      options.render = render
    }
    //生成了render函数之后，开始挂载组件
    mountComponent(vm, el)
  }
}