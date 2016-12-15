---
layout: post
title: 'ES6学习笔记3'
date: 2016-12-11
author: SSH
categories: [front]
tags: [Javascript, ES6]
excerpt: ES6学习笔记最后一篇，这段时间实在是太忙啦，所以隔了2周才写最后一篇，接下来应该是学习ReactNative啦。。
---
## Class
在class提出之前其实已经有了一套继承的方式，那就是利用原型来类和继承

```javascript
function Animate(name) {
    this.name = name;
}

Animate.prototype.sayHi = function () {
    console.log('hi animate');
};

function Dog(name) {
    this.name = name;
}

Dog.prototype = Animate.prototype;
Dog.prototype.sayHi = function () {
    console.log('hi dog');
};

var dog = new Dog('dog');
dog.sayHi();
```

而在ES6中，它提供了类似JAVA语法的Class语法糖，使得继承变得更加简单，类中的函数包括了3种，静态函数、构造函数、普通函数

```javascript
class Animate {
    constructor (name) {
        this.name = name;
    }

    eat() {
        console.log('I am ' + this.name + ',I eat food');
    }

    static hi() {
        console.log('I am Animate');
    }
}

class Dog extends Animate {
    constructor(name) {
        super(name);
    }

    eat() {
        super.eat();
        console.log('I am Dog');
    }
    
    static hi() {
        console.log('I am Dog');
    }
}

Animate.hi();
Dog.hi();

var animate = new Animate('haha');
var dog = new Dog('hehe');

animate.eat();
dog.eat();
```

ES6中的类完全可以看成是构造函数的另外一种写法，同时在类中`prototype`属性依然生效，而所有方法其实都是绑在`prototype`上的

```javascript
class Point {
    constructor() {
        // ...
    }
    
    toString() {
        // ...
    }
    
    toValue() {
        // ...
    }
}

typeof Point // function
Point === Point.prototype.constructor; // true
```

Getter/Setter是一种元编程的概念，元编程就是允许程序对运行时的对象进行操作

```javascript
const list = {
    _array: [],
    
    set new(value) {
        this._array.push(value);
    },
    
    get last() {
        return this._array[0];
    },
    
    get value() {
        return this._array;
    }
};

list.new = 1;
list.new = 2;
list.new = 3;
console.log(list.last); // 1
console.log(list.value); // [1, 2, 3]
```

## Generator
对于Generator可以简单的将他理解成状态机，内部有多个状态，靠`next`来走到下一个环节，通过`yield`来规定状态机内部的状态

```javascript
// function后面增加*变成generatorFn
function* genFn() {
    let a = 2;

    yield a;
    
    while(true) {
        yield a = a / (2 * a + 1);
    } 
}

const gen = genFn();

for (const b of gen) {
    if (b < 0.01) {
        break;
    }
    console.log(b);
}

for (var i = 0; i < 10; i++) {
    console.log(gen.next());
}

// 在函数名前面加*
const generatorName = 'g';
let obj = {
    *[generatorName]() {}
};
class clazz {
    *[generatorName]() {}
}

function* genFn2() {
    yield 1;
    yield 2;
}

let gen2 = genFn2();

typeof gen2; // object
typeof gen2[Symbol.iterator]; // function
```

需要注意的是`yield`并不能出现在普通函数中

## Promise
`Promise`是用一种异步编程的解决方案，它是一个保存了未来结果的容器，他只有三种状态`Pending`(进行中),`Resolved`(已完成),`Rejected`(已失败)，不存在其他中间状态。

```javascript
// 创建Promise

function asynTask(...args) {
    return new Promise((resolve, reject) => {
        api.call('fetch-data', (err, data) => {
            if (err) {
                reject(err);
            }
            
            resolve(data);
        })
    });
}

```

其中resolve代表结果成功可以进行下一步的成功处理，reject代表结果失败可以进行一步的失败处理，下一步的处理可以通过`then`函数来定义，同时失败的处理方法也可以通过`catch`来定义

```javascript
asynTask()
    .then(data => {
        console.log('success', data);
    })
    .catch(err => {
        console.log('error', err);
    });
```

ES6还为`Promise`提供了两个特别的方法`all`，`race`，其中`all`代表所有传入的Promise都执行完成后，才去执行后续的操作，而`race`表示传入的Promise只有一个成功了就会执行后面的操作

```javascript
const promises = [async(1), async(2), async(3)];

Promise
    .all(promises)
    .then(() => {
        // ...
    });
    
Promise
    .race(promises)
    .then(() => {
        // ...
    });
```

## Proxy
Proxy用于修改某些操作的默认行为属于元编程，可以将`Proxy`理解成在原对象设置了一层代理对象，任何对原对象的操作都会经过这层代理

```javascript
var obj = new Proxy({}, {
    get: function (target, key, receiver) {
        console.log(`getting ${key}!`);
        return Reflect.get(target, key, receiver);
    },

    set: function (target, key, value, receiver) {
        console.log(`setting ${key}!`);
        return Reflect.set(target, key, value, receiver);
    }
});

obj.count = 1;
// setting count
obj.count++;
// getting count
// setting count
console.log(obj.count);
// getting count
// 3
```

拦截函数也可以对构造函数进行操作

```javascript
var fproxy = new Proxy(function(x, y) {
    return x + y;
}, {
    get: function(target, name) {
        if (name === 'prototype') {
            return Object.prototype;
        }
        console.log(`get is running, return ${name}`);
        return 'Hello, ' + name;
    },

    apply: function(target, thisBinding, args) {
        console.log(`apply is running, return ${args[0]}`);
        return args[0];
    },

    construct: function(target, args) {
        console.log(`construct is running, return ${args[1]}`);
        return {value: args[1]};
    }
});

fproxy(1, 2);
// apply is running, return 1
new fproxy(1,2);
// construct is running, return 2
fproxy.prototype === Object.prototype; // true
fproxy.foo;
// get is running, return foo
```

`Reflect`对象和`Proxy`对象一样是用来操作对象的，只不过是将原来属于`Object`对象上明显属于语言内部的方法放到了`Reflect`上

```javascript
// Reflect is object
console.log(typeof Reflect === 'object');

// can not be instantiated
// new Reflect(); // throw error

// 没有call函数
console.log(typeof Reflect.call === 'undefined');

let obj = {
    x: 23,
    y: 12,
    z: 'z'
};

// Reflect.get
// obj.x
console.log(Reflect.get(obj, 'x'));

// Reflect.has
// y in obj
console.log(Reflect.has(obj, 'y'));

// Reflect.deleteProperty
// delete obj['z']
Reflect.deleteProperty(obj, 'z');
console.log(obj.z);

// Reflect.apply   fn,obj,args
// Function.prototype.apply
console.log(Reflect.apply([].slice, [0, 1, 2, 3], [1]));

// Reflect.getPrototypeOf
// Object.getPrototypeOf
console.log(Reflect.getPrototypeOf([]) === Object.getPrototypeOf([]));
// 不可以调用非对象
console.log(Reflect.getPrototypeOf(1)); // called on non-object
```