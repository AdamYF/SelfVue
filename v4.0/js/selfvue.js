function SelfVue(data, el, exp) {
  var self = this;
  this.data = data;
  // Object.keys() 方法会返回一个由给定对象自身可枚举属性组成的数组
  Object.keys(data).forEach(function (key) {
    self.proxyKeys(key); // 绑定代理属性
  });
  observe(data);
  el.innerHTML = this.data[exp]; // 初始化模板数据的值
  new Watcher(this, exp, function (value) {
    el.innerHTML = value;
  });
  return this;
}

SelfVue.prototype = {
  proxyKeys: function (key) {
    var self = this;
    Object.defineProperty(this, key, {
      enumerable: false,
      configurable: true,
      get: function proxyGetter() {
        return self.data[key];
      },
      set: function proxySetter(newVal) {
        self.data[key] = newVal;
      }
    });
  }
}

