---
layout: post
title: 'ES6学习笔记1'
date: 2016-11-20
author: SSH
categories: [ES6]
tags: [ES6]
excerpt: 之前校招的时候因为面试需要看了一阵子ES6，到了实际项目中发现学了的ES6没啥用武之地，前段时间看了下NodeJS早就开始支持原生ES6语法了,刚好情封大大在推荐《实战ES2015》这本书，于是就买了一本，后来才发现自己已经要落伍了，该学习学习啦。笔记大概会参照《实战ES2015》的目录总结，同时也会参考ES6 Katas里面的内容。
---

## 背景
之前校招的时候因为面试需要看了一阵子ES6，到了实际项目中发现学了的ES6没啥用武之地，前段时间看了下NodeJS早就开始支持原生ES6语法了,刚好情封大大在推荐《实战ES2015》这本书，于是就买了一本，后来才发现自己已经要落伍了，该学习学习啦。笔记大概会参照《实战ES2015》的目录总结，同时也会参考[ES6 Katas](http://es6katas.org/)里面的内容。

## let和const
在ES6之前，JS是没有块级作用域的概念的，只有全局作用域和函数作用域。让我们先看一下下面的代码

```javascript
var btns = document.querySelectorAll('.btn');
var output = document.querySelectorAll('#output');

for (var i = 0, len = btns.length; i < len; i++) {
	btns[i].onclick = function () {
		output.innerText = btns[i].innerText + ' is clicked';
	};
}
```

对于初学者来说，看到上面的代码很可能会里所有当然的认为，点击哪个按钮就会提示那个按钮被点击。实则不然，点击之后程序会直接报错。因为没有块级作用域，所以for循环结束之后的i将一直保持为4，当每次点击的时候都会调用btns[4].innerText，btns[4]根本不存在所以程序会报错。当然有经验的同学肯定就会用闭包的方式来处理上面的问题，将传入的参数保存起来，每次调用都返回保存住的参数。

```javascript
for (var i = 0, len = btns.length; i < len; i++) {
	btns[i].onclick = (function (index) {
		output.innerText = btns[index].innerText + ' is clicked';
	})(i);
}
```

在ES6中出现了一个var的升级版`let`，他和`var`功能大致相同，但是，还有一点点异同点，请看下图的表格。

|                  |let  | var  |
| ---------------- |:---:| :---:|
| 定义变量         | √   | √    |
| 可被释放         | √   | √    |
| 变量提升         |     | √    |
| 重复定义检查     | √   |      |
| 可用于块级作用域 | √   |      |

看完他们之间的对比你会发现其实最重要的一点就是块级作用域，有了块级作用域之后最开始的代码只需要改一个地方就正常运行了。

```javascript
var btns = document.querySelectorAll('.btn');
var output = document.querySelectorAll('#output');

for (let/*var*/ i = 0, len = btns.length; i < len; i++) {
	btns[i].onclick = function () {
		output.innerText = btns[i].innerText + ' is clicked';
	};
}

```

let使得在循环体内部形成了块级作用域，每一次循环体的执行都可以保存当前计数器的数值和引用。

除了let之外，es6还提供了一个`const`功能，`const`为了JS提供了定义常量的功能。es6之前，想定义常量只能通过字面规定的方式定义常量。

```javascript
// old synaxt
var DIALOG_TYPE = 1;

// new synaxt
const DIALOG_TYPE = 1;
```

`const`定义常量的原理是阻隔变量名所对应的内存地址改变。因此，对于简单类型而言值是无法改变的，而对于复杂类型而言并不是完全无法改变的。

```javascript
const num = 1;
num = 2; // error

const arr = [1, 3, 5, 7];
arr[0] = 123; // arr: 123, 3, 5, 7
```

## 模板字符串
这里的模板指的是格式化字符串，以往我们在做字符串和变量拼接起来需要使用`+`，有了模板字符串之后，我们可以直接在字符串中放入变量。ES6中我们可以使用```来包裹字符串中的内容，同时可以执行表达式或者函数。

```javascript
let world = 'world';
let hello = `hello ${world}`; // 'hello world'

// 多行换行
let sql = `
select * from Users
where firstName = 'hehe'
limit 1;
`;

let x = 100;
let y = 100;
let tplt1 = `${x} + 100 = 200`;

// 执行表达式
let tplt2 = `${x} + ${y} = ${x + y}`; // 100 + 100 = 200

// 执行函数
let tplt3 = `${helloWorld()}`; // 'hello world'

function helloWorld() {
    return 'hello world';    
}
```

## 箭头函数
箭头函数应该是ES6中最常用的特性，可以让函数变得十分简洁，强迫症的福音。听名字应该大概能知道他的用法（利用箭头`=>`）,下面我们来看看它的基本用法。

```javascript
// 单行函数
let fun1 = () => 'I am arrow function';

// 多参数的
let fun2 = (a, b) => a + b;

// 综合的例子，根据下面的规则处理数组
// 1. 返回 {id, name}格式的对象
// 2. 剔除奇数id
// 3. 返回一个由当前值组成的单元数组
// 4. 把所有数组合并成一个数组
const names = ['will', 'jack', 'peter', 'steve', 'john', 'hugo', 'mike'];
const newArr = names
	.map((name, index) => {
		return {
			id: index,
			name: name
		};
	})
	.filter(man => man.id % 2 == 0)
	.map((name, index) => [name])
	.reduce((a, b) => a.concat(b));
```

除此之外，箭头函数还解决了一个让我们很头疼的问题，在函数内部中涉及到`this`的时候我们都需要认真的想要下他到底指的是哪一个？箭头函数很好的解决了这个问题，在箭头函数内部的`this`延伸至上层作用域中，也就是书中所谓的穿透。

```javascript
class Animal {
    constructor() {
        this.type = 'animal'
    }

    says(say) {
        setTimeout(function(){
            console.log(this.type + ' says ' + say)
        }, 1000)
    }
}

 var animal = new Animal()
 animal.says('hi')  //undefined says hi
```

如何解决上面的问题呢？只需要对says函数做一点点修改

```javascript
says(say) {
    setTimeout(() => {
        console.log(this.type + ' says ' + say)
    }, 1000)
}
```

在使用箭头函数时还需要注意以下几点：
+ 箭头函数中的`this`是无法通过`call`和`apply`函数来改变
+ 箭头函数中不能使用arguments，可以使用`...args`来代替
+ 箭头函数直接返回对象，需要用括号括起来，不能直接返回对象字面量

```javascript
class LexicallyBound {
    getFn() {
        return () => {
            return this;
        }
    }

    getArgs() {
        return () => {
            return arguments;
        }
    }
}

var obj = new LexicallyBound(),
    fn = obj.getFn(),
    argsFn = obj.getArgs();

// return 0，在箭头函数中arguments不可用
argsFn(1, 2, 3).length; 
// return LexicallyBound object，在箭头函数中，使用call不能改变this的指向
fn.call({}); 
```