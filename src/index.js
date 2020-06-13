import { initMixin } from './init'
import { renderMixin } from './render'
import { lifeCycleMixin } from './lifeCycle'
import { initGlobalAPI } from './initGlobalAPI/index'

function Vue (options) {
  this._init(options)
}

initMixin(Vue)
renderMixin(Vue)
lifeCycleMixin(Vue)

//初始化全局api
initGlobalAPI(Vue)

export default Vue