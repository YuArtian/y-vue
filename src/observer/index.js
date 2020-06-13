import { isObject, def } from '../util/index'
import { arrayMethods } from './array'
import Dep from './dep'

class Observer {
  constructor(data){
    //为数组单独声明的 dep
    this.dep = new Dep();
    //会引发死循环 data.__ob__ = this;
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
  //每个对象属性上都有一个 dep，来记录 watcher（这个dep是给对象用的）
  let dep = new Dep()
  let childOb = observe(value)
  Object.defineProperty(data, key, {
    configurable: true,
    enumerable: true,
    get(){
      //在取值的时候 将当前的属性和 watcher 对应起来
      if (Dep.target) {
        dep.depend()
        if (childOb) {
          //收集对象 和 数组 的依赖
          childOb.dep.depend()
          if (Array.isArray(value)) {
            dependArray(value)
          }
        }
      }
      return value
    },
    set(newValue){
      if (newValue === value) return
      observe(newValue)
      value = newValue
      dep.notify()
    }
  })
}
function dependArray(value){
  for(let i =0; i < value.length;i++){
    let current = value[i]; // 将数组中的每一个都取出来，数据变化后 也去更新视图
    // 数组中的数组的依赖收集
    current.__ob__ && current.__ob__.dep.depend();
    if(Array.isArray(current)){
      dependArray(current);
    }
  }
}
// Object.defineProperty 不兼容 ie8
export function observe (data) {
  if (!isObject(data)) return
  return new Observer(data)
}