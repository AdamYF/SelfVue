function Watcher(vm, exp, cb) {
  this.vm = vm;   // 指向SelfVue的作用域
  this.exp = exp; // 绑定属性的key值
  this.cb = cb;   // 闭包
  this.value = this.get(); // 将自己添加做订阅器中
}

Watcher.prototype = {
  update: function () {
    this.run();
  },
  run: function () {
    var value = this.vm.data[this.exp];
    var oldVal = this.value;
    if (value !== oldVal) {
      this.value = value;
      this.cb.call(this.vm, value, oldVal);
    }
  },
  get: function () {
    Dep.target = this; // 缓存自己
    var value = this.vm.data[this.exp]; // 强制执行监听器里的get函数
    Dep.target = null; // 释放自己
    return value;
  }
}
