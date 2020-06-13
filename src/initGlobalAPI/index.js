import { mergeOptions } from '../util/index'

export function initGlobalAPI(Vue){
  //整合了全局相关的内容
  Vue.options = {}
  Vue.mixin = function(mixin){
    this.options = mergeOptions(this.options, mixin)
  }
}