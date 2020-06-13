export function isObject(data) {
  return typeof data === "object" && data !== null;
}
//将属性变为不可枚举的
export function def(data, key, value) {
  Object.defineProperty(data, key, {
    enumerable: false,
    configurable: false,
    value,
  });
}
//代理
export function proxy(vm, source, key) {
  Object.defineProperty(vm, key, {
    get() {
      return vm[source][key];
    },
    set(newValue) {
      vm[source][key] = newValue;
    },
  });
}
//生命周期方法
const LIFECYCLE_HOOKS = [
  "beforeCreate",
  "created",
  "beforeMount",
  "mounted",
  "beforeUpdate",
  "updated",
  "beforeDestroy",
  "destroyed",
];
//策略
let strats = {};

//注册生命周期的合并策略
LIFECYCLE_HOOKS.forEach((hook) => {
  strats[hook] = mergeHook;
});
//组件的合并策略
strats.components = mergeAssets;
function mergeAssets(parentVal, childVal) {
  const res = Object.create(parentVal);
  if (childVal) {
    for (const key in childVal) {
      res[key] = childVal[key];
    }
  }
  return res;
}

function mergeHook(parentVal, childVal) {
  if (childVal) {
    if (parentVal) {
      return parentVal.concat(childVal);
    } else {
      return [childVal];
    }
  } else {
    return parentVal;
  }
}

//合并
export function mergeOptions(parent, child) {
  const options = {};
  for (const key in parent) {
    if (parent.hasOwnProperty(key)) {
      mergeField(key);
    }
  }
  for (const key in child) {
    if (child.hasOwnProperty(key) && !parent.hasOwnProperty(key)) {
      mergeField(key);
    }
  }
  //浅合并
  function mergeField(key) {
    //如果有策略的话 就执行策略
    if (strats[key]) {
      return (options[key] = strats[key](parent[key], child[key]));
    }
    //默认的合并策略
    if (typeof parent[key] === "object" && typeof child[key] === "object") {
      options[key] = {
        ...parent[key],
        ...child[key],
      };
    } else if (child[key] == null) {
      options[key] = parent[key];
    } else {
      options[key] = child[key];
    }
  }
  return options;
}

//判断是否是原始标签
export const isReservedTag = (tagName) => {
  let str = "p,div,span,input,button";
  let obj = {};
  str.split(",").forEach((tag) => {
    obj[tag] = true;
  });

  return obj[tagName];
};
