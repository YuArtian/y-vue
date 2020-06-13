let id = 0
class Dep {
  constructor(){
    this.id = id++
    //管理 watcher 的队列
    this.subs = []
  }
  //依赖收集
  depend(){
    //this.subs.push(Dep.target)
    //在 watcher 中添加 dep
    Dep.target.addDep(this)
  }
  //派发更新
  notify(){
    this.subs.forEach(watcher => watcher.update())
  }
  //添加 watcher 到 Dep
  addSub(watcher){
    this.subs.push(watcher)
  }
}

//存储 watcher 的栈
let stack = []
//新增
export function pushTarget(watcher){
  Dep.target = watcher
  stack.push(watcher)
}
//移除当前的 切换到下一个 watcher
export function popTarget(){
  stack.pop()
  Dep.target = stack[stack.length - 1]
}

export default Dep