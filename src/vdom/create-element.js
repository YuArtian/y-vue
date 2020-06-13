import { isReservedTag, isObject } from "../util/index";

/* 创建元素 */
export function createElement(vm, tag, data = {}, ...children) {
  let key = data.key;
  if (key) {
    delete data.key;
  }
  if (isReservedTag(tag)) {
    return vnode(tag, data, key, children, undefined);
  } else {
    //组件的构造函数
    let Ctor = vm.$options.components[tag];
    return createComponent(vm, tag, data, key, children, Ctor);
  }
}
/* 创建组件 */
function createComponent(vm, tag, data, key, children, Ctor) {
  if (isObject(Ctor)) {
    Ctor = vm.$options._base.extend(Ctor);
  }
  data.hook = {
    init(vnode) {
      // 当前组件的实例 就是componentInstance
      let child = (vnode.componentInstance = new Ctor({ _isComponent: true }));
      // 组件的挂载 vm.$el
      child.$mount(); // vnode.componentInstance.$el
    },
  };
  //组件没有 children，后面的 children 是指插槽
  return vnode(`vue-component-${Ctor.cid}-${tag}`, data, key, undefined, {
    Ctor,
    children,
  });
}
/* 创建文本 */
export function createTextNode(vm, text) {
  return vnode(undefined, undefined, undefined, undefined, text);
}

function vnode(tag, data, key, children, text, componentOpions) {
  return {
    tag,
    data,
    key,
    children,
    text,
    componentOpions,
  };
}
