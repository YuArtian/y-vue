import initMixin from './mixin'
import {ASSETS_TYPE} from './const'
import initAssetRegisters from './assets.js'
import initExtend  from './extend'

export function initGlobalAPI(Vue){
  //整合了全局相关的内容
  Vue.options = {}
  //初始化 mixin 方法
  initMixin(Vue)
  // 初始化的全局过滤器 指令  组件
  ASSETS_TYPE.forEach(type=>{
    Vue.options[type+'s'] = {}
  });
  // _base 是 Vue 的构造函数
  Vue.options._base = Vue;
  // 注册extend方法
  initExtend(Vue)
  initAssetRegisters(Vue)
}