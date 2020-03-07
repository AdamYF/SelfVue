function defineReactive (data, key, val) {
  observe(val);
  Object.defineProperty(data, key, {
    enumerable: true,   // 当且仅当该Object的configurable属性为true时，这个属性描述符才能被改变，或是从Obejct上被删除
    configurable: true, // 当且仅当该Object的enumerable属性为true时，这个属性才能出现在Obejct的枚举属性中
    get: function () {
      return val;
    },
    set: function (newVal) {
      val = newVal;
      console.log('属性' + key + '已被监听，现在值已被修改为："' + newVal.toString() + '"');
    }
  })
}

function observe (data) {
  if (!data || typeof data !== 'object') {
    return;
  }
  Object.keys(data).forEach(function (key) {
    defineReactive(data, key, data[key]);
  });
}



// 测试部分
var library = {
  book1: {
    name: ''
  },
  book2: ''
};
observe(library);
library.book1.name = 'vue权威指南'; // 属性name已经被监听了，现在值为："vue权威指南"
library.book2 = '没有此书籍';       // 属性book2已经被监听了，现在值为："没有此书籍"
