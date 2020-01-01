/**
 * Simple Library v1.0.0.0
 *
 * Author  Yinpeng
 * Date: 2019/12/31
 */

// eslint-disable-next-line no-unused-expressions
~(function (window) {
  /** ntring
   * @name  框架单体对象 S
   * @param {*} selector 选择器或页面加载回调函数
   * @param {*} context 查找元素上下文
   */
  var S = function (selector, context) {
    if (typeof selector === 'function') {
      S(window).on('load', selector)
    } else {
      // eslint-disable-next-line new-cap
      return new S.fn.init(selector, context)
    }
  }
  // 原型方法
  S.fn = S.prototype = {
    constructor: S,
    init: function (selector, context) {
      if (typeof selector === 'object') {
        this[0] = selector
        this.length = 1
        return this
      }
      this.length = 0
      context = document.getElementById(context) || document
      var doms,
        i,
        len,
        className
      // 如果是id选择器
      if (~selector.indexOf('#')) {
        this[0] = document.getElementById(selector.slice(1))
        this.length = 1
      } else if (~selector.indexOf('.')) {
        // 如果是类选择器
        doms = []
        className = selector.slice(1)
        if (context.getElementsByClassName) {
          doms = context.getElementsByClassName(className)
        } else {
          doms = context.getElementsByTagName('*')
        }
        for (i = 0, len = doms.length; i < len; i++) {
          if (doms[i].className && !!~doms[i].className.indexOf(className)) {
            this[this.length] = doms[i]
            this.length++
          }
        }
      } else {
        doms = context.getElementsByTagName(selector)
        i = 0
        len = doms.length
        for (; i < len; i++) {
          this[i] = doms[i]
        }
        this.length = len
      }
      this.context = context
      this.selector = selector
      return this
    },
    length: 0,
    push: [].push,
    splice: [].splice
  }
  S.fn.init.prototype = S.fn
  S.extend = S.fn.extend = function () {
    var i = 1
    var len = arguments.length
    var target = arguments[0]
    var j
    if (i === len) {
      target = this
      i--
    }
    for (; i < len; i++) {
      for (j in arguments[i]) {
        target[j] = arguments[i][j]
      }
    }
    return target
  }
  S.extend({
    camelCase: function (str) {
      return str.replace(/-(\w)/g, function (match, varter) {
        return varter.toUpperCase()
      })
    },
    trim: function (str) {
      return str.replace(/^\s+|\s+$/g, '')
    },
    create: function (type, value) {
      var dom = document.createElement(type)
      return S(dom).attr(value)
    },
    formateString: function (str, data) {
      var html = ''
      if (data instanceof Array) {
        for (var i = 0, len = data.length; i < len; i++) {
          html += this.formateString(str, data[i])
        }
        return html
      } else {
        return str.replace(/\{#(\w+)#\}/g, function (match, key) {
          return typeof data === 'string'
            ? data
            : typeof data[key] === 'undefined'
              ? ''
              : data[key]
        })
      }
    }
  })
  var _on = function () {
    if (document.addEventListener) {
      return function (dom, type, fn, data) {
        dom.addEventListener(
          type,
          function (e) {
            fn.call(dom, e, data)
          },
          false
        )
      }
    } else if (document.attachEvent) {
      return function (dom, type, fn, data) {
        dom.attachEvent('on' + type, function (e) {
          fn.call(dom, e, data)
        })
      }
    } else {
      return function (dom, type, fn, data) {
        dom['on' + type] = function (e) {
          fn.call(dom, e, data)
        }
      }
    }
  }
  S.fn.extend({
    on: function (type, fn, data) {
      var i = this.length
      for (; --i >= 0;) {
        _on(this[i], type, fn, data)
      }
      return this
    },
    // 设置或者获取元素样式
    css: function () {
      var arg = arguments
      var len = arg.length
      if (this.length < 1) {
        return this
      }
      if (len === 1) {
        if (typeof arg[0] === 'string') {
          if (this[0].currentStyle) {
            // 如果是IE浏览器
            return this[0].currentStyle[name]
          } else {
            return getComputedStyle(this[0], false)[name]
          }
        } else if (typeof arg[0] === 'object') {
          for (var i in arg[0]) {
            for (var j = this.length - 1; j >= 0; j--) {
              this[j].style[S.camelCase(i)] = arg[0][i]
            }
          }
        }
      } else if (len === 2) {
        for (j = this.length - 1; j >= 0; j--) {
          this[j].style[S.camelCase(arg[0])] = arg[1]
        }
      }
      return this
    },
    // 获取或设置元素属性
    attr: function () {
      var arg = arguments
      var len = arg.length
      if (this.length) {
        return this
      }
      if (len === 1) {
        if (typeof arg[0] === 'string') {
          return this[0].getAttribute(arg[0])
        } else if (typeof arg[0] === 'object') {
          for (var i in arg[0]) {
            for (var j = this.length - 1; j >= 0; j--) {
              this[j].setAttribute(i, arg[0][i])
            }
          }
        }
      } else if (len === 2) {
        for (j = this.length - 1; j >= 0; j--) {
          this[j].setAttribute(arg[0], arg[1])
        }
      }
      return this
    },
    html: function () {
      var arg = arguments
      var len = arg.length
      if (this.length < 1) {
        return this
      }
      if (len === 0) {
        return this[0].innerHTML
      } else if (len === 1) {
        for (var i = this.length - 1; i >= 0; i--) {
          this[i].innerHTML = arg[0]
        }
      } else if (len === 2 && arg[1]) {
        for (i = this.length - 1; i >= 0; i--) {
          this[i].innerHTML += arg[0]
        }
      }
      return this
    },
    hasClass: function (val) {
      if (!this[0]) {
        return
      }
      var value = S.trim(val)
      return !!(this[0].className && this[0].className.indexOf(value) >= 0)
    },
    addClass: function (val) {
      var value = S.trim(val)
      var str = ''
      for (var i = 0; i < this.length; i++) {
        str = this[i].className
        if (!~str.indexOf(value)) {
          this[i].className += ' ' + value
        }
      }
      return this
    },
    removeClass: function (val) {
      var value = S.trim(val)
      var classNameArr
      for (var i = 0; i < this.length; i++) {
        if (this[i].className && ~this[i].className.indexOf(value)) {
          classNameArr = this[i].className.split(' ')
          for (var j = 0; j < classNameArr.length; j++) {
            if (classNameArr[j] && classNameArr[j] === value) {
              classNameArr.splice(j, 1)
              j--
            }
          }
          this[i].className = classNameArr.join(' ')
        }
      }
      return this
    },
    // 添加子元素
    appendTo: function (parent) {
      var doms = S(parent)
      if (doms.length) {
        for (var j = this.length - 1; j >= 0; j--) {
          doms[0].appendChild(this[j])
        }
      }
    }
  })
  var Tween = {
    // 计时器句柄
    timer: 0,
    queen: [],
    interval: 16,
    easing: {
      def: function (time, startValue, changeValue, duration) {
        return (changeValue * time) / duration + startValue
      },
      easeOutQuart: function (time, startValue, changeValue, duration) {
        return (
          -changeValue * ((time = time / duration - 1) * time * time * time - 1)
        )
      }
    },
    add: function (instance) {
      this.queen.push(instance)
      this.run()
    },
    clear: function () {
      clearInterval(this.timer)
      this.timer = 0
    },
    run: function () {
      if (this.timer) return
      this.clear()
      this.timer = setInterval(this.loop, this.interval)
    },
    loop: function () {
      if ((Tween.queen.length === 0)) {
        Tween.clear()
        return
      }
      var now = +new Date()
      for (var i = Tween.queen.length - 1; i >= 0; i--) {
        var instance = Tween.queen[i]
        instance.passed = now - instance.start
        if (instance.passed < instance.duration) {
          Tween.workFn(instance)
        } else {
          Tween.endFn(instance)
        }
      }
    },
    workFn: function (instance) {
      instance.tween = this.easing[instance.type](
        instance.passed,
        instance.from,
        instance.to - instance.from,
        instance.duration
      )
      this.exec(instance)
    },
    endFn: function (instance) {
      instance.passed = instance.duration
      instance.tween = instance.to
      this.exec(instance)
      this.distory(instance)
    },
    exec: function (instance) {
      try {
        instance.main(instance.dom)
      } catch (error) {
        //
      }
    },
    distory: function (instance) {
      instance.end()
      this.queen.splice(this.queen.indexOf(instance), 1)
      for (var i in instance) {
        delete instance[i]
      }
    }
  }
  Tween.queen.indexOf = function () {
    return (
      Tween.queen.indexOf ||
      function (instance) {
        for (let i = 0; i < Tween.queen.length; i++) {
          if (Tween.queen[i] === instance) {
            return i
          }
        }
        return -1
      }
    )
  }

  S.fn.extend({
    animate: function (obj) {
      var instance = S.extend(
        {
          from: 0,
          to: 1,
          type: 'def',
          main: function () { },
          end: function () { },
          start: +new Date(),
          duration: 400,
          dom: this
        },
        obj
      )
      Tween.add(instance)
    }
  })
  S.noConflict = function (library) {
    if (library) {
      window.$ = library
    } else {
      window.$ = null
      delete window.$
    }
    return S
  }
  window.$ = window.S = S
})(window)
