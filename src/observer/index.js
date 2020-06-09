import { isObject, def } from '../util/index'
import { arrayMethods } from './array'

class Observer {
  constructor(data){
    //会引发死循环
    // data.__ob__ = this;
    def(data, '__ob__', this)
    if (Array.isArray(data)) {
      //重写数组的部分方法
      data.__proto__ = arrayMethods
      //数组的劫持 只劫持数组中的 对象
      this.observeArray(data)
    } else {
      this.walk(data)
    }
  }
  walk(data){
    let keys = Object.keys(data)
    keys.forEach(key => {
      defineReactive(data, key, data[key])
    })
  }
  //处理数组
  observeArray(data){
    data.forEach(value => {
      observe(value)
    })
  }
}

function defineReactive(data, key, value){
  observe(value)
  Object.defineProperty(data, key, {
    get(){
      return value
    },
    set(newValue){
      if (newValue === value) return
      observe(newValue)
      console.log('值发生变化了')
      value = newValue
    }
  })
}

// Object.defineProperty 不兼容 ie8
export function observe (data) {
  if (!isObject(data)) {
    return
  }
  new Observer(data)
}