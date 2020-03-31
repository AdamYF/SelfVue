function Compile() {

}

Compile.prototype = {
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
  compileElement: function (el) {
    var childNodes = el.chilsNodes;
    var self = this;
    [].slice.call(childNodes).forEach(function(node) {
      var reg = /\{\{(.*)\}\}/;
      var text = node.textContent;

      if (self.isTextNode(node) && reg.test(text)) { // 判断是否符合'{{ 变量 }}'指令形式
        self.compileText(node, reg.exec(text)[1]);
      }

      if (node.childNodes && node.childNodes.length) {
        self.compileElement(node); // 继续递归遍历子节点
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
  updateText: function (node, value) {
    node.textContent = typeof value == 'undefined' ? '' : value;
  }
}

