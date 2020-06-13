import Watcher from './observer/watcher'
import { patch } from './vdom/patch'

export function lifeCycleMixin(Vue){
  Vue.prototype._update = function(vnode){
    const vm = this
    //用vnode创建真实节点，替换 $el，实现初渲染
    vm.$el = patch(vm.$el, vnode)
  }
}

export function mountComponent(vm, el){
  const options = vm.$options
  vm.$el = el//存储真实的元素
  //beforeMount 生命周期
  callHook(vm, 'beforeMount')
  //渲染页面
  //渲染和更新都会调用 updateComponent
  let updateComponent = () => {
    //返回虚拟dom
    console.log('update')
    vm._update(vm._render())
  }
  //渲染 watcher
  new Watcher(vm, updateComponent, ()=>{}, true)//渲染watcher标志为true
  callHook(vm, 'mounted')
}
/* 调用钩子 */
export function callHook(vm, hook){
  const handlers = vm.$options[hook]
  if (handlers) {
    for (let index = 0; index < handlers.length; index++) {
      handlers[index].call(vm)
    }
  }
}