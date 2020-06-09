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

  }

  function Vue(options) {
    this._init(options);
  }

  initMixin(Vue);

  return Vue;

})));
//# sourceMappingURL=vue.js.map
