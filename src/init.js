import { initState } from './state'

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

}