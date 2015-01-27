var Stack = function Stack () {
  this.top = 0;
  this.dataStore = [];
};

function push (element) {
  return this.dataStore[this.top++] = element;
}

function pop () {
  return this.dataStore[--this.top];
}

function peek () {
  return this.dataStore[this.top - 1];
}

function clear () {
  this.top = 0;
  this.dataStore.length = 0;
}

function length () {
  return this.top;
}

Stack.prototype = {
  push: push,
  pop: pop,
  peek: peek,
  length: length,
  clear: clear
};

module.exports = Stack;