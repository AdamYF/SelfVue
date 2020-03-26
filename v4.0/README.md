# v4.0 优化属性赋值的形式
在v3.0版本中，属性赋值的形式是 selfVue.data.name = 'byebye world'，而理想的形式应该是 selfVue.name = 'byebye world'<br>
实现这种形式，需要在 new selfVue 时做一个代理处理，让访问 SelfVue 的属性代理为访问 SelfVue.data 的属性，原理还是使用 Object.defineProperty() 对属性进行一层包装

