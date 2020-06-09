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

  function isObject(data) {
    return _typeof(data) === 'object' && data !== null;
  } //将属性变为不可枚举的

  function def(data, key, value) {
    Object.defineProperty(data, key, {
      enumerable: false,
      configurable: false,
      value: value
    });
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
      }

      return result;
    };
  });

  var Observer = /*#__PURE__*/function () {
    function Observer(data) {
      _classCallCheck(this, Observer);

      //会引发死循环
      // data.__ob__ = this;
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
    observe(value);
    Object.defineProperty(data, key, {
      get: function get() {
        return value;
      },
      set: function set(newValue) {
        if (newValue === value) return;
        observe(newValue);
        console.log('值发生变化了');
        value = newValue;
      }
    });
  } // Object.defineProperty 不兼容 ie8


  function observe(data) {
    if (!isObject(data)) {
      return;
    }

    new Observer(data);
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

  function initData(vm) {
    var data = vm.$options.data;
    data = vm._data = typeof data === 'function' ? data.call(vm) : data; //数据劫持

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
  var stack = [];
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
    text = text.replace(/\s/g, '');

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
    stack.push(element);
  }

  function end(tagName) {
    //弹出最后一个元素 进行匹配
    var element = stack.pop(); //判断标签闭合是否正确

    if (tagName === element.tag) {
      //判断父节点
      currentParent = stack[stack.length - 1]; //实现树结构的父子关系

      if (currentParent) {
        element.parent = currentParent;
        currentParent.children.push(element);
      }
    }
  }

  function parseHTML(html) {
    //递归循环解析 html 模板
    while (html) {
      var textEnd = html.indexOf('<');

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

  function compileToFunction(template) {
    var root = parseHTML(template);
    console.log('root', root);
    return function render() {};
  }

  function initMixin(Vue) {
    //初始化
    Vue.prototype._init = function (options) {
      //数据劫持
      var vm = this;
      vm.$options = options; //初始化状态

      initState(vm); //如果用户传入了 el

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
        }

        console.log('template-------', template); //生成render方法

        var render = compileToFunction(template);
        options.render = render;
      }
    };
  }

  function Vue(options) {
    this._init(options);
  }

  initMixin(Vue);

  return Vue;

})));
//# sourceMappingURL=vue.js.map
