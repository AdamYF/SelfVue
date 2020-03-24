function SelfVue(data, el, exp) {
  this.data = data;
  observer(data);
  el.innerHTML = this.data[exp];
  new Watcher(this, exp, function (value) {
    el.innerHTML = value;
  });
  return this;
}

