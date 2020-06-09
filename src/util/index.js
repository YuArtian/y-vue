
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