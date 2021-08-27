//自定义Promise函数模块:匿名函数自定义
(function (window) {
  const PENDING = 'pending'
  const RESOLVED = 'resolved'
  const REJECTED = 'rejected'
  //Promise构造函数
  //executor:执行器函数,（同步执行）(resolve, reject) => {}
  function Promise(executor) {
    const _this = this //将当前promise对象保存起来
    _this.status = PENDING //给Promise指定status属性,初始值为pending
    _this.data = undefined //给Promise指定一个用于存储结果数据的属性
    _this.callbacks = [] //给Promise指定status属性,初始值为pending
    function resolve(value) {
      //如果当前状态不是pending,直接结束
      if (_this.status !== PENDING) {
        return
      }
      //将状态改为resolved
      _this.status = RESOLVED
      //保存value数据
      _this.data = value
      //如果有待执行的callback函数,立即异步执行回调函数
      if (_this.callbacks.length > 0) {
        setTimeout(() => { //放入队列中执行所有的回调
          _this.callbacks.forEach(callbacksObj => {
            callbacksObj.onResolved(value)
          });
        }, 0);
      }
    }

    function reject(reason) {
      //如果当前状态不是pending,直接结束
      if (_this.status !== PENDING) {
        return
      }
      //将状态改为rejected
      _this.status = REJECTED
      //保存value数据
      _this.data = reason
      //如果有待执行的callback函数,立即异步执行回调函数
      if (_this.callbacks.length > 0) {
        setTimeout(() => { //放入队列中执行所有的回调
          _this.callbacks.forEach(callbacksObj => {
            callbacksObj.onRejected(reason)
          });
        }, 0);
      }
    }
    //立即同步执行executor
    try {
      executor(resolve, reject)
    } catch (error) { //如果执行器抛出异常,Promise对象变为rejected
      reject(error)
    }
  }

  //Promise原型上的then方法,指定成功和失败的回调函数,返回一个新的Promise
  Promise.prototype.then = function (onResolved, onRejected) {
    // 指定默认的成功的回调onResolved （向后传递成功的value）
    onResolved = typeof onResolved === 'function' ? onResolved : value => value
    // 指定默认的失败的回调onRejected（向后传递失败的reason 实现错误/异常传透的关键点）
    onRejected = typeof onRejected === 'function' ? onRejected : reason => {
      throw reason
    }
    const _this = this

    //返回新的Promise对象
    return new Promise((resolve, reject) => {
      //调用指定回调函数封装处理,根据执行结果,改变return的promise状态
      function handle(callback) {
        //1.如果抛出异常,return的Promise失败,reason就是error
        //2.如果回调函数执行返回非Promise,return的Promise成功,value就是返回的值
        //3.如果回调函数返回的是Promise,return的Promise结果就是本身Promise的结果
        try {
          const result = callback(_this.data)
          if (result instanceof Promise) {
            //如果回调函数返回的是Promise,return的Promise结果就是本身Promise的结果
            //1.写法1
            // result.then(
            //   value => resolve(value), //当result成功时,让return的Promise也成功
            //   reason => reject(reason) //当result失败时,让return的Promise也失败
            // )
            //2.写法2
            result.then(resolve, reject)
          } else {
            //如果返回非Promise,return的Promise成功,value就是返回的值
            resolve(result)
          }
        } catch (error) {
          //如果抛出异常,return的Promise失败,reason就是error
          reject(error)
        }

      }
      if (_this.status === RESOLVED) { //'resolved'
        setTimeout(() => {
          handle(onResolved)
        }, 0);
      } else if (_this.status === REJECTED) { //'rejected'
        setTimeout(() => {
          handle(onRejected)
        }, 0);
      } else {
        //假设当前状态还是pending状态,将回调函数保存起来
        _this.callbacks.push({
          onResolved(value) {
            handle(onResolved)
          },
          onRejected(reason) {
            handle(onRejected)
          }
        })
      }
    })
  }
  //Promise原型上的catch方法,指定失败的回调函数,返回一个新的Promise
  Promise.prototype.catch = function (onRejected) {
    return this.then(undefined, onRejected)
  }
  //Promise函数对象的resolve方法,返回指定结果的一个成功Promise
  Promise.resolve = function (value) {

  }
  //Promise函数对象的reject方法,返回指定reason的一个失败Promise
  Promise.reject = function (reason) {

  }
  //Promise函数对象的all方法,返回一个Promise,只有所有Promise成功时才成功
  Promise.all = function (promises) {

  }
  //Promise函数对象的race方法,返回一个Promise,其结果由第一个完成的Promise决定
  Promise.race = function (promises) {

  }
  //向外暴露Promise函数
  window.Promise = Promise
})(window)