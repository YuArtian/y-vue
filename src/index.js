import { initMixin } from './init'
import { renderMixin } from './render'
import { lifeCycleMixin } from './lifeCycle'

function Vue (options) {
  this._init(options)
}

initMixin(Vue)
renderMixin(Vue)
lifeCycleMixin(Vue)

export default Vue