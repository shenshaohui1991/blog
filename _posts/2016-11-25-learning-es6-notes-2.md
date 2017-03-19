---
layout: post
title: 'ES6学习笔记2'
date: 2016-11-25
author: SSH
categories: [ES6]
tags: [ES6]
excerpt: 这周继续学习ES6，进度有点慢了，所以准备尽快写完ES6的学习笔记，这样可以开始ReactNative的学习。这一次主要是了解的是对象、Map、Set相关的知识，同时要推荐一下阮一峰老师的ES6教程很详细
---

## 对象的拓展
### 属性名
在ES6中允许省略定义直接写入变量或者利用表达式的方式来动态计算变量名

```javascript
const a = 1;
const fn = () => 'fn';

// 省略定义变量
const obj1 = {
    a,
    fn
};

// 利用表达式动态计算属性名
const propName = 'xxx';
const obj2 = {
    [propName + 'Suffix']: 1
};

obj2.xxxSuffix // 1

// 定义函数 同时省略function
const funcName = 'func';
const obj3 = {
    [funcName]() {
        return 'i am a function';
    }
};
console.log(obj3.func());
```

### Object.is
在ES6之前比较两个指是否相等只有2种方法`==`、`===`，这两种方法各有自己的缺点

```javascript
// 不同类型自动进行类型转换
'1' == 1; // true
null == undefined; // true

NaN === NaN // false
+0 === -0 // false
```

为了解决上面的问题ES6提出了“Same-value equality”的算法，`Object.is`就是这个算法的实现

```javascript
// Object.is() 判断两个值是否一样，与`===`逻辑有所不同
Object.is(1, 1); // true
Object.is([], []); // false
Object.is(NaN, NaN); // true
Object.is(0, -0); // false

// Polyfill
Object.is = Object.is || function (x, y) {
    // 值相等
    if (x === y) {
        return x !== 0 || 1 / x === 1 / y;
    } else {
        // NaN
        return x !== x && y !== y;
    }
};
```

### 遍历属性
目前ES6中一共有5种遍历对象属性的方式

```javascript
let obj = {
    a: 1,
    b: 2,
    c: 3,
    d: 4,
    2: 'qwe',
    1: '123',
    [Symbol('hehe')]: 'hehe',
    [Symbol('haha')]: 'haha'
};

// 不包含Symbol的值
for (let key in obj) {
    console.log(key); // 1, 2, a, b, c, d
}
console.log(Object.keys(obj)); // [1, 2, a, b, c, d]
console.log(Object.getOwnPropertyNames(obj)); // [1, 2, a, b, c, d]
// 仅包含Symbol
console.log(Object.getOwnPropertySymbols(obj)); // [Symbol(hehe), Symbol[haha]]
// 所有
console.log(Reflect.ownKeys(obj)); // [1, 2, a, b, c, d, Symbol(hehe), Symbol[haha]]
```

遍历返回值的顺序按照，先按创建顺序返回有数字键，再按创建顺序返回所有字符串键，再按创建顺序返回所有Symbol

## 解构赋值
听名字可能会觉得有点懵逼，但是你看了代码就会了解什么叫解构赋值

```javascript
let [a, b, c] = [1, 2, 3];
console.log(a, b, c); // 1 2 3
```

解构赋值，其实就是用更简洁的语法来获取到多个变量中的值

```javascript
// 数组
const [first] = [1];
console.log(first === 1); // true

// 对象
const magic = {first: 23, second: 42};
const {second} = magic;
console.log(second === 42); // true

// 省略参数
let all = ['x', 'y', 'z'];
let [,,z] = all;
console.log(z); // 'z'

// 默认值
const [,k=2,] = [1,,3];
console.log(k); // 2
```

解构赋值可以直接接受数组、对象、字符串中的值或者属性，同时也可以处理省略的参数和默认的参数，如果你觉得就是传递一个值这么简单，那你就大错特错了，它还可以处理很多复杂的情况

```javascript
// 交换
let [x, y] = ['a', 'b'];
[x, y] = [y, x];
console.log(x, y);

// 嵌套数组
const user = [['some', 'one'], 23];
const [[firstName, lastName], age] = user;
console.log(`${firstName} ${lastName} ${age} years old`);

// 链式
let a, b, c, d;
[a, b] = [c, d] = [1, 2];
console.log([a, b, c, d]);

// unicode
const [, space, coffee] = 'a ☕';
console.log(space + '-' + coffee); // ' -☕'

// 嵌套
const [,[{lang}]] = [null, [{env: 'browser', lang: 'ES6'}]];
console.log(lang);
```

而解构赋值的本质其实是'模式匹配'，只要左右两边的模式相同，左边的变量就可以被赋值。当然也存在比较特殊的情况，如果解构赋值的对象是数值或者布尔型，则会先将其转换成对象，再做处理

```javascript
let {toString: s1} = 123;
s1 === Number.prototype.toString; // true

let {toString: s2} = true;
s2 === Boolean.prototype.toString; // true
```

对于无法转换成对象的，解构赋值将会报错

```javascript
let {prop: q1} = undefined; // TypeError: cannot match against `undefined` or `null`
let {prop: q2} = null; // TypeError: cannot match against `undefined` or `null`
```

## Set

### Set
ES6中引入集合（`set`）的概念，如果说之前的数组可以理解成`有序集合`，那这里说的集合就可以理解成数据结构中的无序集合。集合和数组略有区别，数组内部值有序且不唯一，而集合的特点就是其内部的值无序且值唯一

```javascript
// 初始化
let set = new Set([1, 2, 3, 4, 5, 6]);

// set中的值是唯一，增加重复值之后集合的大小不改变
set.add(1);
console.log(set.size); // 6

// 检查元素是否存在
console.log(set.has(2)); // true
set.delete(2);
console.log(set.has(2)); // false

// 遍历集合
set.forEach(key => {
    console.log(`${key} * 2 = ${key * 2}`);
});
// 返回键名的遍历器
console.log(set.keys());

// 清空
set.clear();
console.log(set.size); // 0
```

### WeakSet
WeakSet结构与Set类似，也是不重复的值的集合。但是，它与Set有三个区别:
+ WeakSet的成员不能是值类型
+ WeakSet中无引用的值都会被自动清除
+ WeakSet无法被探知大小，也无法探知其中包含了哪些元素

```javascript
const weakSet = new WeakSet();
// weakSet.add(1); // TypeError: invalid value used in week set

weakSet.add({
    x: 1,
    y: 2
});
console.log(weakSet); // WeekSet {}
console.log(weakSet.size); // undefined
```

WeekSet中仅仅包括三个方法`add`、`has`、`delete`，用于增加数据，判断成员是否存在于集合中，清除指定成员

```javascript
const weakSet2 = new WeakSet();
let obj = {
    x: 1,
    y: 2
};

weakSet2.add(obj);
console.log(weakSet2.has(obj)); // true
console.log(weakSet2.delete(obj)); // true
console.log(weakSet2.has(obj)); // false
```

有了WeakSet之后，我们就可以通过代码去了解引擎中垃圾收集的运行状况

## Map

### Map
除了set，ES6还引入了映射类型(`map`)，Map和Object很类似都是`key-value`的形式，但是，`map`对键没有限制任何键都可以，`Object`则要求键必须是字符串。和`Object`类似，`Map`也提供了增删改查等操作。

```javascript
let map = new Map();
map.set('key', 'value');
console.log(map.get('key'));
console.log(map.has('key'));

// 键是独立的，重复的话，最后一个生效
map.set('1', 'one');
map.set('2', 'two');
map.set('1', '11');
map.set('2', '22');
console.log(map.entries());

// 复杂类型做键
const objKey = {x: 1};
map.set(objKey, 'it is object key');
console.log(map.get(objKey));

// Map.size
console.log(map.size);

console.log(map.delete('1')); // 返回true代表删除成功
console.log(map.size);
console.log(map.clear());
console.log(map.size);

const objKey1 = {'a': 1};
const objKey2 = {'b': 2};
map = new Map([[objKey1, '1'], [objKey2, '2']]);
console.log(map.keys());
console.log(map.values());
```

看了这些之后我们再来总结一下`map`和`object`有什么区别

|                         | map    | object |
| ----------------------- | :----: | :----: |
| 存储键值对              | √      | √      |
| 遍历所有键值            | √      | √      |
| 检查是否含有指定键值对  | √      | √      |
| 使用字符串做键          | √      | √      |
| 使用Symbol做键          | √      | √      |
| 使用任何对象做键        | √      |        |
| 查看键值对的个数        | √      |        |


### WeakMap
`WeakMap`和`WeakSet`很类似，都会检查变量的引用，如果没有则会清理掉
