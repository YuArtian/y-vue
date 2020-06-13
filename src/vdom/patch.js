export function patch(oldVnode, vnode) {
  //如果没有 oldVnode 就是组件挂载
  if (!oldVnode) {
    //通过当前虚拟节点创建元素
    return createElm(vnode);
  } else {
    //如果是真实元素 就是首次渲染
    const isRealElement = oldVnode.nodeType;
    if (isRealElement) {
      const oldElm = oldVnode;
      const parentElm = oldElm.parentNode;
      //创建元素
      let el = createElm(vnode);
      //插入元素，再删除之前的
      parentElm.insertBefore(el, oldElm.nextSibling);
      parentElm.removeChild(oldElm);
      return el;
    }
  }
  //递归创建真实节点
}
function createElm(vnode) {
  // 根据虚拟节点创建真实的节点
  let { tag, children, key, data, text } = vnode;
  // 是标签就创建标签
  if (typeof tag === "string") {
    //如果是组件 就实例化组件
    if (createComponent(vnode)) {
      return vnode.componentInstance.$el
    }
    vnode.el = document.createElement(tag);
    updateProperties(vnode);
    children.forEach((child) => {
      // 递归创建儿子节点，将儿子节点扔到父节点中
      return vnode.el.appendChild(createElm(child));
    });
  } else {
    // 虚拟dom上映射着真实dom  方便后续更新操作
    vnode.el = document.createTextNode(text);
  }
  // 如果不是标签就是文本
  return vnode.el;
}
// 更新属性
function updateProperties(vnode) {
  let newProps = vnode.data;
  let el = vnode.el;
  for (let key in newProps) {
    if (key === "style") {
      for (let styleName in newProps.style) {
        el.style[styleName] = newProps.style[styleName];
      }
    } else if (key === "class") {
      el.className = newProps.class;
    } else {
      el.setAttribute(key, newProps[key]);
    }
  }
}

//创建组件
function createComponent(vnode){
  let i = vnode.data
  //如果 vnode.data.hook.init 存在，就认为是组件，执行组件初始化
  if ((i = i.hook) && (i = i.init)) {
    i(vnode)
  }
  //执行完成后 如果有 componentInstance 属性则是组件
  if (vnode.componentInstance) {
    return true
  }
}
