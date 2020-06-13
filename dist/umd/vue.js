(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.Vue = factory());
}(this, (function () { 'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      if (enumerableOnly) symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
      keys.push.apply(keys, symbols);
    }

    return keys;
  }

  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};

      if (i % 2) {
        ownKeys(Object(source), true).forEach(function (key) {
          _defineProperty(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys(Object(source)).forEach(function (key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }

    return target;
  }

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArrayLimit(arr, i) {
    if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  function isObject(data) {
    return _typeof(data) === 'object' && data !== null;
  } //将属性变为不可枚举的

  function def(data, key, value) {
    Object.defineProperty(data, key, {
      enumerable: false,
      configurable: false,
      value: value
    });
  } //代理

  function proxy(vm, source, key) {
    Object.defineProperty(vm, key, {
      get: function get() {
        return vm[source][key];
      },
      set: function set(newValue) {
        vm[source][key] = newValue;
      }
    });
  } //生命周期方法

  var LIFECYCLE_HOOKS = ['beforeCreate', 'created', 'beforeMount', 'mounted', 'beforeUpdate', 'updated', 'beforeDestroy', 'destroyed']; //策略

  var strats = {}; //注册生命周期的合并策略

  LIFECYCLE_HOOKS.forEach(function (hook) {
    strats[hook] = mergeHook;
  });

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
  } //合并


  function mergeOptions(parent, child) {
    var options = {};

    for (var key in parent) {
      if (parent.hasOwnProperty(key)) {
        mergeField(key);
      }
    }

    for (var _key in child) {
      if (child.hasOwnProperty(_key) && !parent.hasOwnProperty(_key)) {
        mergeField(_key);
      }
    } //浅合并


    function mergeField(key) {
      //如果有策略的话 就执行策略
      if (strats[key]) {
        return options[key] = strats[key](parent[key], child[key]);
      } //默认的合并策略


      if (_typeof(parent[key]) === 'object' && _typeof(child[key]) === 'object') {
        options[key] = _objectSpread2(_objectSpread2({}, parent[key]), child[key]);
      } else if (child[key] == null) {
        options[key] = parent[key];
      } else {
        options[key] = child[key];
      }
    }

    return options;
  }

  var oldArrayMethods = Array.prototype; // data.__proto__ = arrayMethods
  // arrayMethods.__proto__ = oldArrayMethods = Array.prototype 利用原型链的查找，进行函数劫持

  var arrayMethods = Object.create(oldArrayMethods); //重写 7 个可以改变数组本身的方法 pop、shift、unshift、push、reverse、splice、sort

  var methods = ['pop', 'shift', 'unshift', 'push', 'reverse', 'splice', 'sort'];
  methods.forEach(function (method) {
    arrayMethods[method] = function () {
      //AOP 切片编程
      console.log('用户改变了数组');

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var result = oldArrayMethods[method].apply(this, args); //如果插入的元素是对象

      var inserted; //拿到实例

      var ob = this.__ob__;

      switch (method) {
        case 'push':
        case 'unshift':
          inserted = args;
          break;

        case 'splice':
          inserted = args.slice(2);
          break;
      }

      if (inserted) {
        //继续观测新增的属性
        ob.observeArray(inserted);
      } //通知视图更新


      console.log('ob', ob);
      ob.dep.notify();
      return result;
    };
  });

  var id = 0;

  var Dep = /*#__PURE__*/function () {
    function Dep() {
      _classCallCheck(this, Dep);

      this.id = id++; //管理 watcher 的队列

      this.subs = [];
    } //依赖收集


    _createClass(Dep, [{
      key: "depend",
      value: function depend() {
        //this.subs.push(Dep.target)
        //在 watcher 中添加 dep
        Dep.target.addDep(this);
      } //派发更新

    }, {
      key: "notify",
      value: function notify() {
        this.subs.forEach(function (watcher) {
          return watcher.update();
        });
      } //添加 watcher 到 Dep

    }, {
      key: "addSub",
      value: function addSub(watcher) {
        this.subs.push(watcher);
      }
    }]);

    return Dep;
  }(); //存储 watcher 的栈


  var stack = []; //新增

  function pushTarget(watcher) {
    Dep.target = watcher;
    stack.push(watcher);
  } //移除当前的 切换到下一个 watcher

  function popTarget() {
    stack.pop();
    Dep.target = stack[stack.length - 1];
  }

  var Observer = /*#__PURE__*/function () {
    function Observer(data) {
      _classCallCheck(this, Observer);

      //为数组单独声明的 dep
      this.dep = new Dep(); //会引发死循环 data.__ob__ = this;

      def(data, '__ob__', this);

      if (Array.isArray(data)) {
        //重写数组的部分方法
        data.__proto__ = arrayMethods; //数组的劫持 只劫持数组中的 对象

        this.observeArray(data);
      } else {
        this.walk(data);
      }
    }

    _createClass(Observer, [{
      key: "walk",
      value: function walk(data) {
        var keys = Object.keys(data);
        keys.forEach(function (key) {
          defineReactive(data, key, data[key]);
        });
      } //处理数组

    }, {
      key: "observeArray",
      value: function observeArray(data) {
        data.forEach(function (value) {
          observe(value);
        });
      }
    }]);

    return Observer;
  }();

  function defineReactive(data, key, value) {
    //每个对象属性上都有一个 dep，来记录 watcher（这个dep是给对象用的）
    var dep = new Dep();
    var childOb = observe(value);
    Object.defineProperty(data, key, {
      configurable: true,
      enumerable: true,
      get: function get() {
        //在取值的时候 将当前的属性和 watcher 对应起来
        if (Dep.target) {
          dep.depend();

          if (childOb) {
            console.log('childOb', childOb); //收集对象 和 数组 的依赖

            childOb.dep.depend();

            if (Array.isArray(value)) {
              dependArray(value);
            }
          }

          console.log('dep.subs', dep.subs);
        }

        return value;
      },
      set: function set(newValue) {
        if (newValue === value) return;
        observe(newValue);
        value = newValue;
        dep.notify();
      }
    });
  }

  function dependArray(value) {
    for (var i = 0; i < value.length; i++) {
      var current = value[i]; // 将数组中的每一个都取出来，数据变化后 也去更新视图
      // 数组中的数组的依赖收集

      current.__ob__ && current.__ob__.dep.depend();

      if (Array.isArray(current)) {
        dependArray(current);
      }
    }
  } // Object.defineProperty 不兼容 ie8


  function observe(data) {
    if (!isObject(data)) return;
    return new Observer(data);
  }

  function initState(vm) {
    var opts = vm.$options; //vue 的数据来源 属性 方法 数据 计算属性 watch
    //初始化 属性

    if (opts.props) ; //初始化 方法


    if (opts.methods) ; //初始化 数据


    if (opts.data) {
      initData(vm);
    }

    if (opts.computed) ;

    if (opts.watch) ;
  }
  /* 代理数据到vm */

  /* 数据初始化 */


  function initData(vm) {
    var data = vm.$options.data;
    data = vm._data = typeof data === 'function' ? data.call(vm) : data; //代理 data 到 vm 上，方便取值

    for (var key in data) {
      proxy(vm, '_data', key);
    } //数据劫持


    observe(data);
  }

  //利用正则匹配解析template生成AST
  var ncname = "[a-zA-Z_][\\-\\.0-9_a-zA-Z]*";
  var qnameCapture = "((?:".concat(ncname, "\\:)?").concat(ncname, ")");
  var startTagOpen = new RegExp("^<".concat(qnameCapture)); // 标签开头的正则 捕获的内容是标签名

  var endTag = new RegExp("^<\\/".concat(qnameCapture, "[^>]*>")); // 匹配标签结尾的 </div>

  var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 匹配属性的

  var startTagClose = /^\s*(\/?)>/; // 匹配标签结束的 >
  var root = null;
  var currentParent;
  var stack$1 = [];
  var ELEMENT_TYPE = 1;
  var TEXT_TYPE = 3;

  function createASTElement(tagName, attrs) {
    return {
      tag: tagName,
      type: ELEMENT_TYPE,
      children: [],
      attrs: attrs,
      parent: null
    };
  }

  function chars(text) {
    text = text.replace(/\s/g, "");

    if (text) {
      currentParent.children.push({
        text: text,
        type: TEXT_TYPE
      });
    }
  }

  function start(tagName, attrs) {
    var element = createASTElement(tagName, attrs);

    if (!root) {
      root = element;
    }

    currentParent = element;
    stack$1.push(element);
  }

  function end(tagName) {
    //弹出最后一个元素 进行匹配
    var element = stack$1.pop(); //判断标签闭合是否正确

    if (tagName === element.tag) {
      //判断父节点
      currentParent = stack$1[stack$1.length - 1]; //实现树结构的父子关系

      if (currentParent) {
        element.parent = currentParent;
        currentParent.children.push(element);
      }
    }
  }
  /* 解析HTML 生成AST */


  function parseHTML(html) {
    //递归循环解析 html 模板
    while (html) {
      var textEnd = html.indexOf("<");

      if (textEnd === 0) {
        //解析开始标签
        var startTagMatch = parseStartTag();

        if (startTagMatch) {
          start(startTagMatch.tagName, startTagMatch.attrs); //开始标签匹配完成之后 可以直接进行下一次匹配

          continue;
        }

        var endTagMatch = html.match(endTag);

        if (endTagMatch) {
          advance(endTagMatch[0].length);
          end(endTagMatch[1]); //进行下一次匹配

          continue;
        }
      } //解析开始标签到下一个标签之间的文本 <div id='app'> xxxxxxxxxx <


      var text = void 0;

      if (textEnd >= 0) {
        text = html.substring(0, textEnd);
      }

      if (text) {
        chars(text);
        advance(text.length);
      }
    } //去除已经解析完的html片段


    function advance(n) {
      html = html.substring(n);
    } //解析开始标签


    function parseStartTag() {
      var start = html.match(startTagOpen);

      if (start) {
        var match = {
          tagName: start[1],
          attrs: []
        }; //start[0] 是解析出来的开始标签 <div

        advance(start[0].length); //开始解析属性
        //如果直接是结束标签 就不需要解析属性了

        var _end, attr;

        while (!(_end = html.match(startTagClose)) && (attr = html.match(attribute))) {
          //将已经匹配好的属性去掉
          advance(attr[0].length);
          match.attrs.push({
            name: attr[1],
            value: attr[3] || attr[4] || attr[5]
          });
        } //如果结束了 返回匹配结果


        if (_end) {
          advance(_end[0].length);
          return match;
        }
      }
    }

    return root;
  }

  var defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;

  function genProps(attrs) {
    // 处理属性 拼接成属性的字符串
    var str = '';

    for (var i = 0; i < attrs.length; i++) {
      var attr = attrs[i];

      if (attr.name === 'style') {
        (function () {
          // style="color: red;fontSize:14px" => {style:{color:'red'},id:name,}
          var obj = {};
          attr.value.split(';').forEach(function (item) {
            var _item$split = item.split(':'),
                _item$split2 = _slicedToArray(_item$split, 2),
                key = _item$split2[0],
                value = _item$split2[1];

            obj[key] = value;
          });
          attr.value = obj;
        })();
      }

      str += "".concat(attr.name, ":").concat(JSON.stringify(attr.value), ",");
    }

    return "{".concat(str.slice(0, -1), "}");
  }

  function genChildren(el) {
    var children = el.children;

    if (children && children.length > 0) {
      return "".concat(children.map(function (c) {
        return gen(c);
      }).join(','));
    } else {
      return false;
    }
  }

  function gen(node) {
    if (node.type == 1) {
      // 元素标签
      return generate(node);
    } else {
      var text = node.text; //   <div>a {{  name  }} b{{age}} c</div>

      var tokens = [];
      var match, index; // 每次的偏移量 buffer.split()

      var lastIndex = defaultTagRE.lastIndex = 0; // 只要是全局匹配 就需要将lastIndex每次匹配的时候调到0处

      while (match = defaultTagRE.exec(text)) {
        index = match.index;

        if (index > lastIndex) {
          tokens.push(JSON.stringify(text.slice(lastIndex, index)));
        }

        tokens.push("_s(".concat(match[1].trim(), ")"));
        lastIndex = index + match[0].length;
      }

      if (lastIndex < text.length) {
        tokens.push(JSON.stringify(text.slice(lastIndex)));
      }

      return "_v(".concat(tokens.join('+'), ")");
    }
  }

  function generate(el) {
    // [{name:'id',value:'app'},{}]  {id:app,a:1,b:2}
    var children = genChildren(el);
    var code = "_c(\"".concat(el.tag, "\",").concat(el.attrs.length ? genProps(el.attrs) : 'undefined').concat(children ? ",".concat(children) : '', ")\n    ");
    return code;
  }

  function compileToFunction(template) {
    // 1) 解析html字符串 将html字符串 => ast语法树
    var root = parseHTML(template); // 需要将ast语法树生成最终的render函数  就是字符串拼接 （模板引擎）

    var code = generate(root); // 核心思路就是将模板转化成 下面这段字符串
    //  <div id="app"><p>hello {{name}}</p> hello</div>
    // 将ast树 再次转化成js的语法
    //  _c("div",{id:app},_c("p",undefined,_v('hello' + _s(name) )),_v('hello'))
    // 所有的模板引擎实现 都需要new Function + with

    var renderFn = new Function("with(this){ return ".concat(code, "}")); // vue的render 他返回的是虚拟dom

    return renderFn;
  }

  var id$1 = 0;

  var Watcher = /*#__PURE__*/function () {
    function Watcher(vm, exprOrFn, callback, options) {
      _classCallCheck(this, Watcher);

      this.vm = vm;
      this.callback = callback;
      this.options = options;
      this.getter = exprOrFn;
      this.id = id$1++;
      this.depsId = new Set();
      this.deps = []; //get方法 执行渲染watcher

      this.get();
    } //get方法 执行渲染watcher


    _createClass(Watcher, [{
      key: "get",
      value: function get() {
        //存入 watcher
        pushTarget(this); //执行 watcher 开始渲染 渲染的时候就会对页面进行取值操作

        this.getter(); //推出 watcher

        popTarget();
      } //执行更新

    }, {
      key: "update",
      value: function update() {
        this.get();
      } //添加dep

    }, {
      key: "addDep",
      value: function addDep(dep) {
        var id = dep.id; //dep去重

        if (!this.depsId.has(id)) {
          this.depsId.add(id);
          this.deps.push(dep); //在 Dep 中添加当前 watcher

          dep.addSub(this);
        }
      }
    }]);

    return Watcher;
  }();

  function patch(oldVnode, vnode) {
    //如果是真实元素 就是首次渲染
    var isRealElement = oldVnode.nodeType;

    if (isRealElement) {
      var oldElm = oldVnode;
      var parentElm = oldElm.parentNode; //创建元素

      var el = createElm(vnode); //插入元素，再删除之前的

      parentElm.insertBefore(el, oldElm.nextSibling);
      parentElm.removeChild(oldElm);
      return el;
    } //递归创建真实节点

  }

  function createElm(vnode) {
    // 根据虚拟节点创建真实的节点
    var tag = vnode.tag,
        children = vnode.children,
        key = vnode.key,
        data = vnode.data,
        text = vnode.text; // 是标签就创建标签

    if (typeof tag === 'string') {
      vnode.el = document.createElement(tag);
      updateProperties(vnode);
      children.forEach(function (child) {
        // 递归创建儿子节点，将儿子节点扔到父节点中
        return vnode.el.appendChild(createElm(child));
      });
    } else {
      // 虚拟dom上映射着真实dom  方便后续更新操作
      vnode.el = document.createTextNode(text);
    } // 如果不是标签就是文本


    return vnode.el;
  } // 更新属性


  function updateProperties(vnode) {
    var newProps = vnode.data;
    var el = vnode.el;

    for (var key in newProps) {
      if (key === 'style') {
        for (var styleName in newProps.style) {
          el.style[styleName] = newProps.style[styleName];
        }
      } else if (key === 'class') {
        el.className = newProps["class"];
      } else {
        el.setAttribute(key, newProps[key]);
      }
    }
  }

  function lifeCycleMixin(Vue) {
    Vue.prototype._update = function (vnode) {
      var vm = this; //用vnode创建真实节点，替换 $el，实现初渲染

      vm.$el = patch(vm.$el, vnode);
    };
  }
  function mountComponent(vm, el) {
    var options = vm.$options;
    vm.$el = el; //存储真实的元素
    //beforeMount 生命周期

    callHook(vm, 'beforeMount'); //渲染页面
    //渲染和更新都会调用 updateComponent

    var updateComponent = function updateComponent() {
      //返回虚拟dom
      vm._update(vm._render());
    }; //渲染 watcher


    new Watcher(vm, updateComponent, function () {}, true); //渲染watcher标志为true

    callHook(vm, 'mounted');
  }
  /* 调用钩子 */

  function callHook(vm, hook) {
    var handlers = vm.$options[hook];

    if (handlers) {
      for (var index = 0; index < handlers.length; index++) {
        handlers[index].call(vm);
      }
    }
  }

  function initMixin(Vue) {
    //初始化
    Vue.prototype._init = function (options) {
      //数据劫持
      var vm = this; //合并用户实例中的 options 和 全局的 options

      vm.$options = mergeOptions(vm.constructor.options, options); //beforeCreate 生命周期

      callHook(vm, 'beforeCreate'); //初始化状态

      initState(vm); //created 生命周期

      callHook(vm, 'created'); //如果用户传入了 el

      if (vm.$options.el) {
        vm.$mount(vm.$options.el);
      }
    }; //挂载


    Vue.prototype.$mount = function (el) {
      var vm = this;
      var options = vm.$options;
      el = document.querySelector(el); //找render方法、没有则用template、再没有就直接用el中的内容

      if (!options.render) {
        var template = options.template;

        if (!template && el) {
          template = el.outerHTML;
        } //生成render方法


        var render = compileToFunction(template);
        options.render = render;
      } //生成了render函数之后，开始挂载组件


      mountComponent(vm, el);
    };
  }

  function createElement(tag) {
    var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var key = data.key;

    if (key) {
      delete data.key;
    }

    for (var _len = arguments.length, children = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      children[_key - 2] = arguments[_key];
    }

    return vnode(tag, data, key, children, undefined);
  }
  function createTextNode(text) {
    return vnode(undefined, undefined, undefined, undefined, text);
  }

  function vnode(tag, data, key, children, text) {
    return {
      tag: tag,
      data: data,
      key: key,
      children: children,
      text: text
    };
  }

  function renderMixin(Vue) {
    //_c 创建元素的虚拟节点
    Vue.prototype._c = function () {
      return createElement.apply(void 0, arguments);
    }; //_v 创建文本的虚拟节点


    Vue.prototype._v = function (text) {
      return createTextNode(text);
    }; //_s JSON.stringify


    Vue.prototype._s = function (val) {
      return val == null ? '' : _typeof(val) === 'object' ? JSON.stringify(val) : val;
    };

    Vue.prototype._render = function () {
      var vm = this;
      var render = vm.$options.render;
      var vnode = render.call(vm);
      return vnode;
    };
  }

  function initGlobalAPI(Vue) {
    //整合了全局相关的内容
    Vue.options = {};

    Vue.mixin = function (mixin) {
      this.options = mergeOptions(this.options, mixin);
    };
  }

  function Vue(options) {
    this._init(options);
  }

  initMixin(Vue);
  renderMixin(Vue);
  lifeCycleMixin(Vue); //初始化全局api

  initGlobalAPI(Vue);

  return Vue;

})));
//# sourceMappingURL=vue.js.map
