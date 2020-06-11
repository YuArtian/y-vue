import { observe } from './observer/index'
import { proxy } from './util/index'

export function initState (vm) {
  const opts = vm.$options
  //vue 的数据来源 属性 方法 数据 计算属性 watch
  //初始化 属性
  if (opts.props) {
    initProps(vm)
  }
  //初始化 方法
  if (opts.methods) {
    initMethod(vm)
  }
  //初始化 数据
  if (opts.data) {
    initData(vm)
  }
  if (opts.computed) {
    initComputed(vm)
  }
  if (opts.watch) {
    initWatch(vm)
  }
}


function initProps(){}
function initMethod(){}

/* 代理数据到vm */

/* 数据初始化 */
function initData(vm){
  let data = vm.$options.data
  data = vm._data = typeof data === 'function' ? data.call(vm) : data
  //代理 data 到 vm 上，方便取值
  for(let key in data){
    proxy(vm, '_data', key)
  }
  //数据劫持
  observe(data);
}

function initComputed(){}
function initWatch(){}