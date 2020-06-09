
/*
* Vue 2.0
*/

//case 4 改写数组的方法 函数劫持
let oldArrayPrototype = Array.prototype;
let proto = Object.create(oldArrayPrototype);
['push', 'pop', 'shift', 'unshift'].forEach(method => {
  //函数劫持
  proto[method] = function(){
    //更新视图
    updateView()//切片编程
    oldArrayPrototype[method].call(this, ...arguments)
  }
})

function observer (target) {
  if (typeof target !== 'object' || target == null) {
    return target
  }
  //case 4 改写数组的方法 函数劫持
  if (Array.isArray(target)) {
    Object.setPrototypeOf(target, proto)
    // traget.__proto__ = proto
  }
  for (const key in target) {
    if (target.hasOwnProperty(key)) {
      defineReactive(target, key, target[key])
    }
  }
}

function defineReactive (target, key, value) {
  //递归 默认就开始递归了
  //case 1 使用递归 使引用类型中的嵌套属性也劫持
  observer(value)
  //数据劫持
  Object.defineProperty(target, key, {
    get(){
      return value
    },
    set(newValue){
      if (newValue !== value) {
        //case2 针对新设置的值 也是对象的情况
        observer(newValue)
        updateView()
        value = newValue
      }
    },
  })
}


function updateView(){
  console.log('更新视图')
}

let data = { name: 'yyyyy', age: {n: 100}, arr: [1,2,3] }
//将数据变为响应式的
observer(data)

data.name = 'zzzzz' //should update 1
/* case 1 改变引用类型中的属性 */
data.age.n = 2000 //should update 2
/* case 2 新设置的值为对象 却没有劫持新值的属性 */
data.age = { n: 3000 } //should update 3
data.age.n = 4000 //should update 4
/* case 3 新增的属性 Vue2.0 不支持，需要使用 Vue.set 方法 */
data.age.b = 'new property' //should update 5
/* case 4 数据为数组的时候 要支持数组的各个方法 */
data.arr.push(4)//should update 6

console.log('data', data)
