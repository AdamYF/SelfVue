# v5.0 实现指令解析器 Compile
在前面几个版本的 demo 中，整个过程都没有解析 dom 节点，而是对指定的某个节点进行数据操作，因此接下来要实现一个解析器 Compile 来解析和绑定 dom 节点<br>
解析器 Compile 的作用主要是：
- 解析模板指令，并替换模板数据，初始化试图
- 将模板指令对应的节点绑定对应的更新函数，初始化相应的订阅器

