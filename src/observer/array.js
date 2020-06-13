

const oldArrayMethods = Array.prototype
// data.__proto__ = arrayMethods
// arrayMethods.__proto__ = oldArrayMethods = Array.prototype 利用原型链的查找，进行函数劫持
export const arrayMethods = Object.create(oldArrayMethods)
//重写 7 个可以改变数组本身的方法 pop、shift、unshift、push、reverse、splice、sort
const methods = ['pop','shift','unshift','push','reverse','splice','sort']

methods.forEach(method => {
  arrayMethods[method] = function(...args){
    //AOP 切片编程
    console.log('用户改变了数组')
    const result = oldArrayMethods[method].apply(this, args)
    //如果插入的元素是对象
    let inserted
    //拿到实例
    let ob = this.__ob__;
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args
        break;
      case 'splice':
        inserted = args.slice(2)
        break;
      default:
        break;
    }
    if (inserted) {
      //继续观测新增的属性
      ob.observeArray(inserted)
    }
    //通知视图更新
    console.log('ob',ob)
    ob.dep.notify();
    return result
  }
})