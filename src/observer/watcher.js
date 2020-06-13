import { pushTarget, popTarget } from './dep'
import { queueWatcher } from './schedular'

let id = 0
class Watcher {
  constructor(vm, exprOrFn, callback, options){
    this.vm = vm
    this.callback = callback
    this.options = options
    this.getter = exprOrFn
    this.id = id++
    this.depsId = new Set()
    this.deps = []
    //get方法 执行渲染watcher
    this.get()
  }
  //get方法 执行渲染watcher
  get(){
    //存入 watcher
    pushTarget(this)
    //执行 watcher 开始渲染 渲染的时候就会对页面进行取值操作
    this.getter()
    //推出 watcher
    popTarget()
  }
  //执行更新
  update(){
    //this.get()
    //异步更新 加入更新队列
    queueWatcher(this)
  }
  //添加dep
  addDep(dep){
    let id = dep.id
    //dep去重
    if (!this.depsId.has(id)) {
      this.depsId.add(id)
      this.deps.push(dep)
      //在 Dep 中添加当前 watcher
      dep.addSub(this)
    }
  }
  //异步更新
  run(){
    this.get()
  }
}

export default Watcher