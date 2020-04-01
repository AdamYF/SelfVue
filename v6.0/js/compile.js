function Compile(el, vm) {
  this.vm = vm;
  this.el = document.querySelector(el);
  this.fragment = null;
  this.init();
}

Compile.prototype = {
  init: function () {
    if (this.el) {
      this.fragment = this.nodeToFragment(this.el);
      this.compileElement(this.fragment);
      this.el.appendChild(this.fragment);
    } else {
      console.log('Dom元素不存在');
    }
  },
  // 为了解析模板，首先要获取dom元素，并对其上含有指令的节点进行处理，因此需要对dom操作比较频繁
  // 所以，先建一个fragment片段，将需要解析的dom节点存入fragment片段里再进行处理
  nodeToFragment: function (el) {
    var fragment = document.createDocumentFragment();
    var child = el.firstChild;
    while (child) {
      // 将Dom元素放入fragment中
      fragment.appendChild(child);
      child = el.firstChild;
    }
    return fragment;
  },
  // 遍历各个节点，对含有指令的节点进行特殊处理
  // 先处理最简单的情况，'{{ 变量 }}'形式的指令
  compileElement: function (el) {   // 遍历各个节点,对含有相关指定的节点进行特殊处理
    var childNodes = el.childNodes; // childNodes属性返回节点的子节点集合，即 NodeList 对象
    var self = this;
    // [].slice.call()方法将传入的非数组对象浅拷贝为一个数组
    // 这里，NodeList 对象被转换为 node 对象的数组
    [].slice.call(childNodes).forEach(function(node) {
      var reg = /\{\{(.*)\}\}/;
      var text = node.textContent; // textContent 属性设置或返回指定节点的文本内容

      if (self.isElementNode(node)) {
        self.compile(node);
      } else if (self.isTextNode(node) && reg.test(text)) { // 判断是否符合{{}}的指令
        // exec() 方法用于检索字符串中的正则表达式的匹配
        // 此方法会返回一个数组，其中存放匹配的结果。如果未找到匹配，则返回值为 null
        self.compileText(node, reg.exec(text)[1]);
      }

      if (node.childNodes && node.childNodes.length) {
        self.compileElement(node); // 继续递归遍历子节点
      }
    });
  },
  compile: function (node) {
    var nodeAttrs = node.attributes; // attributes 属性返回指定节点的属性集合，即 NamedNodeMap
    var self = this;
    // Array.prototype属性表示Array构造函数的原型，本身就是一个Array
    Array.prototype.forEach.call(nodeAttrs, function(attr) {
      var attrName = attr.name; // 添加事件的方法名和前缀:v-on:click="onClick"，则attrName='v-on:click' id="app" attrname= 'id'
      if (self.isDirective(attrName)) {
        var exp = attr.value; // 添加事件的方法名和前缀:v-on:click="onClick"，exp = 'onClick'
        var dir = attrName.substring(2); // substring() 方法用于提取字符串中介于两个指定下标之间的字符，dir = 'on:click'
        if (self.isEventDirective(dir)) { // v-on事件指令
            self.compileEvent(node, self.vm, exp, dir);
        } else { //v-model指令
            self.compileModel(node, self.vm, exp, dir);
        }

        node.removeAttribute(attrName);
      }
    });
  },
  compileText: function (node, exp) {
    var self = this;
    var initText = this.vm[exp];
    this.updateText(node, initText); // 将初始化的数据初始化到视图中
    new Watcher(this.vm, exp, function (value) { // 生成订阅器并绑定更新函数
      self.updateText(node, value);
    });
  },
  compileEvent: function (node, vm, exp, dir) {
    var eventType = dir.split(':')[1];
    var cb = vm.methods && vm.methods[exp];

    if (eventType && cb) {
      node.addEventListener(eventType, cb.bind(vm), false);
    }
  },
  compileModel: function (node, vm, exp, dir) {
    var self = this;
    var val = this.vm[exp];
    this.modelUpdater(node, val);
    new Watcher(this.vm, exp, function(value) {
      self.modelUpdater(node, value);
    });

    node.addEventListener('input', function(e) {
      var newValue = e.target.value;
      if (val === newValue) {
          return;
      }
      self.vm[exp] = newValue;
      val = newValue;
    });
  },

  // 辅助方法
  updateText: function (node, value) {
    node.textContent = typeof value == 'undefined' ? '' : value;
  },
  modelUpdater: function (node, value, oldValue) {
    node.value = typeof value == 'undefined' ? '' : value;
  },
  isDirective: function (attr) {
    return attr.indexOf('v-') == 0;
  },
  isEventDirective: function (dir) {
    return dir.indexOf('on:') == 0;
  },
  isElementNode: function (node) {
    return node.nodeType == 1;
  },
  isTextNode: function (node) {
    return node.nodeType == 3;
  }
}
