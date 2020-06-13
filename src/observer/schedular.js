import { nextTick } from '../util/nextTick'

/* 更新队列 以及 watcher 去重 */
let queue = []
let has = {}

function flushSchedularQueue(){
  queue.forEach(watcher => watcher.run())
  queue = []
  has = {}
}

export function queueWatcher(watcher){
  const id = watcher.id
  if (has[id] == null) {
    queue.push(watcher)
    has[id] = true
    //Vue.nextTick
    nextTick(flushSchedularQueue)
  }
}