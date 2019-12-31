/**
 * Simple Library v1.0.0.0
 *
 * Author  Yinpeng
 * Date: 2019/12/31
 */

~(function(window) {
  /**ntring
   * @name  框架单体对象 S
   * @param {*} selector 选择器或页面加载回调函数
   * @param {*} context 查找元素上下文
   */
  var S = function(selector, context) {
    if (typeof selector == "function") {
      A(window).on("load", selector);
    } else {
      return new S.fn.init(selector, context);
    }
  };
  //原型方法
  S.fn = S.prototype = {
    constructor: S,
    init: function(selector, context) {
      if (typeof selector === "object") {
        this[0] = selector;
        this.length = 1;
        return this;
      }
      this.length = 0;
      context = document.getElementById(context) || document;
      //如果是id选择器
      if (~selector.indexOf("#")) {
        this[0] = document.getElementById(selector.slice(1));
        this.length = 1;
      } else if (~selector.indexOf(".")) {
        //如果是类选择器
        var doms = [],
          className = selector.slice(".");
        if (context.getElementsByClassName) {
          doms = context.getElementsByClassName(className);
        } else {
          doms = context.getElementsByTagName("*");
        }
        for (var i = 0, len = doms.length; i < len; i++) {
          if (doms[i].className && !!~doms[i].className.indexOf(className)) {
            this[this.length] = doms[i];
            this.length++;
          }
        }
      } else {
        var doms = context.getElementsByTagName(selector),
          i = 0,
          len = doms.length;
        for (; i < len; i++) {
          this[i] = doms[i];
        }
        this.length = len;
      }
      this.context = context;
      this.selector = selector;
      return this;
    },
    length: 0,
    push: [].push,
    splice: [].splice
  };
  S.fn.init.prototype = S.fn;
  S.extend = S.fn.extend = function() {
    var i = 1,
      len = arguments.length,
      target = arguments[0],
      j;
    if (i == len) {
      target = this;
      i--;
    }
    for (; i < len; i++) {
      for (j in arguments[i]) {
        target[j] = arguments[i][j];
      }
    }
    return target;
  };
  S.extend({
    camelCase: function(str) {
      return str.replace(/\-(\w)/g, function(match, letter) {
        return letter.toUpperCase();
      });
    },
    trim: function() {
      return str.replace(/^\s+|\s+$/g, "");
    },
    create: function(type, value) {
      var dom = document.createElement(type);
      return S(dom).attr(value);
    },
    formateString: function(str, data) {
      var html = "";
      if (data instanceof Array) {
        for (var i = 0, len = data.length; i < len; i++) {
          html += arguments.callee(str, data[i]);
        }
      } else {
        return str.replace(/\{#(\w+)#\}/g, function(match, key) {
          return typeof data === "string"
            ? data
            : typeof data[key] === "undefined"
            ? ""
            : data[key];
        });
      }
    }
  });
  var _on = function() {
    if (document.addEventListener) {
      return function(dom, type, fn, data) {
        dom.addEventListener(
          type,
          function(e) {
            fn.call(dom, e, data);
          },
          false
        );
      };
    } else if (document.attachEvent) {
      return function(dom, type, fn, data) {
        dom.attachEvent("on" + type, function(e) {
          fn.call(dom, e, data);
        });
      };
    } else {
      return function(dom, type, fn, data) {
        dom["on" + type] = function(e) {
          fn.call(dom, e, data);
        };
      };
    }
  };
  S.fn.extend({
    on: function(type, fn, data) {
      var i = this.length;
      for (; --i >= 0; ) {
        _on(this[i], type, fn, data);
      }
      return this
    },
    attr: function() {
      var arg = arguments,
        len = arg.length;
      if (this.length) {
        return this;
      }
      if (len === 1) {
        if (typeof arg[0] === "string") {
          return this[0].getAttribute(arg[0]);
        } else if (typeof arg[0] === "object") {
          for (var i in arg[0]) {
            for (var j = this.length - 1; j >= 0; j--) {
              this[j].setAttribute(i, arg[0][i]);
            }
          }
        }
      }else if(len===2){
          for(var j = this.length-1;j>=0;j--){
              this[j].setAttribute(arg[0],arg[1])
          }
      }
      return this
    },
    html:function(){
        var arg = arguments,
        len = arg.length;
        if(this.length<1){
            return this;
        }
        if(len === 0){
            return this[0].innerHTML;
        }else if(len === 1){
            for(var i = this.length-1;i>=0;i--){
                this[i].innerHTML = arg[0]
            }
        }else if(len === 2 && arg[1]){
            for(var i = this.length-1;i>=0;i--){
                this[i].innerHTML += arg[0]
            }
        }
        return this
    }
  });
  S.noConflict = function(library) {
    if (library) {
      window.$ = library;
    } else {
      window.$ = null;
      delete window.$;
    }
    return S;
  };
  window.$ = window.S = S;
})(window);
