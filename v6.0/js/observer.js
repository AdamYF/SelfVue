function Observer(data) {
  this.data = data;
  this.walk(data);
}

Observer.prototype = {
  walk: function (data) {
    var self = this;
    Object.keys(data).forEach(function (key) {
      self.defineReactive(data, key, data[key]);
    });
  },
  defineReactive: function (data, key, val) {
    var dep = new Dep();
    observe(val);
    Object.defineProperty(data, key, {
      enumerable: true,   // 当且仅当该Object的configurable属性为true时，这个属性描述符才能被改变，或是从Obejct上被删除
      configurable: true, // 当且仅当该Object的enumerable属性为true时，这个属性才能出现在Obejct的枚举属性中
      get: function () {
        if (Dep.target) { // Watcher初始化触发，判断是否需要添加订阅者
          dep.addSub(Dep.target); // 添加一个订阅者
        }
        return val;
      },
      set: function (newVal) {
        if (val === newVal) {
          return;
        }
        val = newVal;
        console.log('属性' + key + '已被监听，现在值已被修改为："' + newVal.toString() + '"');
        dep.notify(); // 如果数据变化，通知所有订阅者
      }
    });
  }
}

function observe(data) {
  if (!data || typeof data !== 'object') {
    return;
  }
  return new Observer(value);
}



function Dep() {
  this.subs = [];
}

Dep.prototype = {
  addSub: function (sub) {
    this.subs.push(sub);
  },
  notify: function () {
    this.subs.forEach(function (sub) {
      sub.update(); // 通知每个订阅者检查更新
    })
  }
}
Dep.target = null;
