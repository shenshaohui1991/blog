---
layout: post
title: 'Javascript定时器那些事儿'
date: 2017-01-02
author: SSH
categories: [front]
tags: [Javascript, share]
excerpt: 分享关于JS定时器的一点小知识点
---

## 一、什么是定时器

JS提供了一些原生方法来实现延时去执行某一段代码，下面来简单介绍一下

`setTimeout`: 设置一个定时器，在定时器到期后执行一次函数或代码段

```javascript
var timeoutId = window.setTimeout(func[, delay, param1, param2, ...]);
var timeoutId = window.setTimeout(code[, delay]);
```

> - timeoutId: 定时器ID
> - func: 延迟后执行的函数
> - code: 延迟后执行的代码字符串，不推荐使用原理类似`eval()`
> - delay: 延迟的时间（单位：毫秒），默认值为0
> - param1,param2: 向延迟函数传递而外的参数，IE9以上支持

`setInterval`: 以固定的时间间隔重复调用一个函数或者代码段

```javascript
var intervalId = window.setInterval(func, delay[, param1, param2, ...]);
var intervalId = window.setInterval(code, delay);
```


> - intervalId: 重复操作的ID
> - func: 延迟调用的函数
> - code: 代码段
> - delay: 延迟时间，没有默认值

`setImmediate`: 在浏览器完全结束当前运行的操作之后立即执行指定的函数(仅IE10和Node 0.10+中有实现)，类似`setTimeout(func, 0)`

```javascript
var immediateId = setImmediate(func[, param1, param2, ...]);
var immediateId = setImmediate(func);
```

> - immediateId: 定时器ID
> - func: 回调

`requestAnimationFrame`: 专门为实现高性能的帧动画而设计的API，但是不能指定延迟时间，而是根据浏览器的刷新频率而定（帧）

```javascript
var requestId = window.requestAnimationFrame(func);
```

> - func: 回调

## 二、举个栗子

- 基本用法

```javascript
var intervalId, timeoutId;

timeoutId = setTimeout(function () {
    console.log(1);
}, 300);

setTimeout(function () {
    clearTimeout(timeoutId);
    console.log(2);
}, 100);

setTimeout('console.log("5")', 400);

intervalId = setInterval(function () {
    console.log(4);
    clearInterval(intervalId);
}, 200);
```

- `setInterval` 和 `setTimeout`的区别？

```javascript
setTimeout(function () {
    console.log('timeout');
}, 1000);

setInterval(function () {
    console.log('interval')
}, 1000);


/*--------------------------------*/

var callback = function () {
    if (times++ > max) {
        clearTimeout(timeoutId);
        clearInterval(intervalId);
    }

    console.log('start', Date.now() - start);
    for (var i = 0; i < 990000000; i++) {}
    console.log('end', Date.now() - start);
},
delay = 100,
times = 0,
max = 5,
start = Date.now(),
intervalId, timeoutId;

function imitateInterval(fn, delay) {
    timeoutId = setTimeout(function () {
        fn();

        if (times <= max) {
            imitateInterval(fn ,delay);
        }
    }, delay);
}

imitateInterval(callback, delay);
intervalId = setInterval(callback, delay);
```

`setTimeout`和`setInterval`仅仅在执行次数上有区别，`setTimeout`一次、`setInterval`n次，而通过`setTimeout`模拟的`setInterval`与`setInterval`的区别则在于：`setTimeout`只有在***回调完成之后才会去调用下一次定时器***，而`setInterval`则不管回调函数的执行情况，当***到达规定时间就会在事件队列中插入一个执行回调的事件***，所以在选择定时器的方式时需要考虑`setInterval`的这种特性是否会对你的业务代码有什么影响？

- `setTimeout(func, 0)` 和 `setImmediate(func)`谁更快？

```javascript
console.time('immediate');
console.time('timeout');

setImmediate(() => {
    console.timeEnd('immediate');
});

setTimeout(() => {
    console.timeEnd('timeout');
}, 0);
```

在`Node.JS v6.7.0`中测试发现`setTimeout`更早执行

- 面试题

下面代码运行后的结果是什么？

```javascript
var t = true;
 
setTimeout(function(){
    t = false;
}, 1000);
 
while(t){}
 
alert('end');

/*--------------------------------*/

for (var i = 0; i < 5; i++) {
    setTimeout(function () {
        console.log(i);
    }, 0);
}

/*--------------------------------*/

var obj = {
    msg: 'obj',
    shout: function () {
        alert(this.msg);
    },
    waitAndShout: function() {
        setTimeout(function () {
            this.shout();
        }, 0);    
    }
};
obj.waitAndShout();
```

***问题答案会在后面解答***

## 三、JS定时器的工作原理

在解释上面问题的答案之前我们先来了解一下定时器的工作原理，这里将用引用[How JavaScript Timers Work](http://ejohn.org/blog/how-javascript-timers-work/)中的例子来解释定时器的工作原理，该图为一个简单版的原理图。

![定时器](http://p7.yx-s.com/d/inn/74622874/Timers.png)

上图中，左侧数字代表时间，单位毫秒；左侧文字代表某一个操作完成后，浏览器去询问当前队列中存在哪些正在等待执行的操作；蓝色方块表示正在执行的代码块；右侧文字代表在代码运行过程中，出现哪些异步事件。该图大致流程如下：

- 程序开始时，有一个JS代码块开始执行，执行时长约为18ms，在执行过程中有3个异步事件触发，其中包括一个`setTimeout`、鼠标点击事件、`setInterval`
- 第一个`setTimeout`先运行，延迟时间为10ms，稍后鼠标事件出现，浏览器在事件队列中插入点击的回调函数，稍后`setInterval`运行，10ms到达之后，`setTimeout`向事件队列中插入`setTimeout`的回调
- 当第一个代码块执行完成后，浏览器查看队列中有哪些事件在等待，他取出排在队列最前面的代码来执行
- 在浏览器处理鼠标点击回调时，`setInterval`再次检查到到达延迟时间，他将再次向事件队列中插入一个interval的回调，以后每隔指定的延迟时间之后都会向队列中插入一个回调
- 后面浏览器将在执行完当前队头的代码之后，将再次取出目前队头的事件来执行

## 四、题目答案

第一题

> `alert`永远都不会执行，因为JS是单线程的，且定时器的回调将在等待当前正在执行的任务完成后才执行，而`while(t) {}`直接就进入了死循环一直占用线程，不给回调函数执行机会

第二题

> 代码会输出 `5 5 5 5 5`，理由同上，当`i = 0`时，生成一个定时器，将回调插入到事件队列中，等待当前队列中无任务执行时立即执行，而此时`for`循环正在执行，所以回调被搁置。当for循环执行完成后，队列中存在着5个回调函数，他们的都将执行`console.log(i)`的操作，因为当前JS代码上中并没有使用块级作用域，所以i的值在`for`循环结束后一直为5，所以代码将输出5个5

第三题

> 这个问题涉及到`this`的指向问题，由setTimeout()调用的代码运行在与所在函数完全分离的执行环境上. 这会导致这些代码中包含的`this`关键字会指向`window` (或全局)对象，`window`对象中并不存在`shout`方法，所以就会报错，修改方案如下:

```javascript
var obj = {
    msg: 'obj',
    shout: function () {
        alert(this.msg);
    },
    waitAndShout: function() {
        var self = this; // 这里将this赋给一个变量
        setTimeout(function () {
            self.shout();
        }, 0);    
    }
};
obj.waitAndShout();
```

## 五、需要注意的点

- `setTimeout`有最小时间间隔限制，HTML5标准为4ms，小于4ms按照4ms处理，但是每个浏览器实现的最小间隔都不同
- JS引擎只有一个线程，将会强制异步事件排队执行
- 如果`interval`的回调执行时间长于指定的延迟，`interval`或许将无间隔的一个接一个执行
- `this`的指向问题问题可以通过`bind`函数、定义变量、箭头函数的方式来解决

## 六、参考
+ [MDN](https://developer.mozilla.org)
+ [How JavaScript Timers Work](http://ejohn.org/blog/how-javascript-timers-work/)
+ [JavaScript定时器与执行机制解析](http://www.alloyteam.com/2016/05/javascript-timer/)