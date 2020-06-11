
export function isObject (data) {
  return typeof data === 'object' && data !== null
}
//将属性变为不可枚举的
export function def(data, key, value){
  Object.defineProperty(data, key, {
    enumerable: false,
    configurable: false,
    value,
  })
}
//代理
export function proxy(vm, source, key){
  Object.defineProperty(vm, key, {
    get(){
      return vm[source][key]
    },
    set(newValue){
      vm[source][key] = newValue
    }
  })
}