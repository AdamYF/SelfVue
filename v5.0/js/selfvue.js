function SelfVue(options) {
  var self = this;
  this.vm = this;
  this.data = options;
  // Object.keys() 方法会返回一个由给定对象自身可枚举属性组成的数组
  Object.keys(this.data).forEach(function (key) {
    self.proxyKeys(key); // 绑定代理属性
  });
  observe(this.data);
  new Compile(options, this.vm);
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

