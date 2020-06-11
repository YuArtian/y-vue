export function patch(oldVnode, vnode){
  console.log('oldVnode',oldVnode)
  console.log('vnode',vnode)
  //如果是真实元素 就是首次渲染
  const isRealElement = oldVnode.nodeType
  if (isRealElement) {
    const oldElm = oldVnode
    const parentElm = oldElm.parentNode
    //创建元素
    let el = createElm(vnode)
    //插入元素，再删除之前的
    parentElm.insertBefore(el, oldElm.nextSibling)
    parentElm.removeChild(oldElm)
  }

  //递归创建真实节点

}
function createElm(vnode){ // 根据虚拟节点创建真实的节点
  let {tag,children,key,data,text} = vnode;
  // 是标签就创建标签
  if(typeof tag === 'string'){
      vnode.el = document.createElement(tag);
      updateProperties(vnode);
      children.forEach(child=>{ // 递归创建儿子节点，将儿子节点扔到父节点中
          return vnode.el.appendChild(createElm(child))
      })
  }else{
      // 虚拟dom上映射着真实dom  方便后续更新操作
      vnode.el = document.createTextNode(text)
  }
  // 如果不是标签就是文本
  return vnode.el;
}
// 更新属性
function updateProperties(vnode){
  let newProps = vnode.data;
  let el = vnode.el;
  for(let key in newProps){
      if(key === 'style'){
          for(let styleName in newProps.style){
              el.style[styleName] = newProps.style[styleName];
          }
      }else if(key === 'class'){
          el.className = newProps.class;
      }else{
          el.setAttribute(key,newProps[key]);
      }
  }
}
