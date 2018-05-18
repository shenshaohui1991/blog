---
layout: post
title: 'CSS Animation学习笔记'
date: 2018-05-18
author: SSH
categories: [CSS]
tags: [CSS]
excerpt: 关于CSS Animation的学习笔记
---

## 简单介绍一下animation

先看一段代码

```css
animation: slideIn 3s linear 1s infinite reverse both running;
```

上面这一行相信对于初学者来说，前5个参数的意义都很好理解，后面几个就不知道是干啥的了，下面我来简单的介绍一下这些参数。animation后面的参数分别对应下列属性：

+ animation-name: 要使用的动画的名称
+ animation-duration: 动画的持续时间
+ animation-timing-function: 动画使用的时间函数
+ animation-delay: 动画延迟执行的时间
+ animation-iteration-count: 动画执行的次数
+ animation-direction: 动画执行的方向
+ animation-fill-mode: 动画执行前后，执行该动画的对象对应的样式
+ animation-play-state: 定义动画的执行状态

### animation-timing-function

这个属性大家应该觉得很熟悉，他的作用是指定动画运行时所使用的时间函数，新手常用的值包括`linear`、`ease-in`、`ease-out`等等，这里要说的是其他两个比较好用的值

#### steps(n, start、end)

> 看图说话，steps就是把动画分部执行的一个函数，其值氛围如下两种情况：
> - `steps(n,start)`表示动画被分成N步，动画一开始就直接移动到1/n帧
> - `steps(n,end)`表示动画分成N步，动画一开始处于第0帧，然后持续1/n时间后，走到下一帧

![animation-step](http://opl3e6e3n.bkt.clouddn.com/animation-steps.jpg)

#### cubic-bezier()

> 贝塞尔曲线一个生成速度的曲线，制定动画的运行速度，可以在[cubic-bezier](http://cubic-bezier.com)这个网站里查看不同函数对应的效果

#### animation-direction

和他的名字一样这个属性的作用是指定动画执行的方向，包括下列值：

+ normal: 默认属性，每个循环内动画向前循环
+ reverse：反向执行
+ alternate: 正 =》 反 =》 正，交替执行
+ alternate-reverse：反 =》 正 =》 反，交替执行

#### animation-fill-mode

这个属性是用于定于动画执行之前之后，元素所处于的样式。

+ forwards: 动画结束后，元素保持动画结束时的状态
+ backwards：动画开始前，元素保持动画开始前的状态
+ both：兼顾上述两个属性，开始前，结束后都保持动画中所定义的起始状态

#### animation-play-state

这个属性适用于控制动画的播放状态，`paused`表示暂停、`running`表示进行中，这样我们就能通过CSS来控制动画的状态了

上述属性介绍所对应的DEMO都在[这里](https://jsfiddle.net/shenshaohui1991/oLuajccm/)

## 小案例

这里的小案例都是看别人的代码学到的

#### 实现轮播

这里主要是通过animation-delay来实现轮播图的切换，每张图片设置不同的动画执行延迟即可

```css
.banners {
    position: relative;
    width: 200px;
    height: 200px;
    margin: 20px auto;
    list-style: none;
    li {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        line-height: 200px;
        text-align: center;
        opacity: 0;
    }
    li:nth-child(1) {
        background: pink;
        animation: fadeIn 8s linear infinite;
    }
    li:nth-child(2) {
        background: skyblue;
        animation: fadeIn 8s linear 2s infinite;
    }
    li:nth-child(3) {
        background: lightgreen;
        animation: fadeIn 8s linear 4s infinite;
    }
    li:nth-child(4) {
        background: red;
        animation: fadeIn 8s linear 6s infinite;
    }
}

@keyframes fadeIn {
    0% {
        opacity: 1;
        visibility: visible;
    }
    25% {
        opacity: 1;
        visibility: visible;
    }
    25.1% {
        opacity: 1;
        visibility: hidden;
    }
    100% {
        opacity: 0;
        visibility: hidden;
    }
}
```

[在线查看效果](https://jsfiddle.net/shenshaohui1991/c7sw4us2/)

#### 闹钟

利用steps函数做一个

```css
.clock-wrapper {
    position: relative;
    margin: 100px auto;
    background: #fff;
    border: 15px solid #ed6e46;
    border-radius: 50%;
    width: 125px;
    height: 125px;
    .clock-face1 {
        position: absolute;
        top: 0;
        left: 0;
        width: 125px;
        height: 125px;
        border-radius: 50%;
        background: #fff;
        z-index: 2;
        div {
            position: absolute;
            left: 50%;
            margin-left: -3px;
            background: #808080;
            width: 6px;
            height: 126px;
        }
        div:nth-child(2),
        div:nth-child(3),
        div:nth-child(5),
        div:nth-child(6) {
            margin-left: -1px;
            width: 2px
        }
        @for $i from 1 to 7 {
            div:nth-child(#{$i}) {
                transform: rotate(($i - 1) * 30deg)
            }
        }
    }
    .clock-face2 {
        position: absolute;
        top: 7.5px;
        left: 7.5px;
        width: 110px;
        height: 110px;
        border-radius: 50%;
        background: #fff;
        z-index: 3;
        .hour {
            position: absolute;
            top: 50%;
            left: 50%;
            margin-left: -4px;
            background: #f8b65b;
            transform-origin: top;
            transform: rotate(90deg);
            border-radius: 50px;
            width: 8px;
            height: 35px;
            z-index: 5;
            animation: tick-tock 24 * 60 * 60s steps(60, end) infinite;
        }
        .minute {
            position: absolute;
            top: 5px;
            left: 55px;
            margin-left: -4px;
            width: 8px;
            height: 50px;
            background: #f8b65b;
            border-radius: 50px;
            transform-origin: bottom;
            z-index: 3;
            animation: tick-tock 60 * 60s steps(60, end) infinite;
        }
        .second {
            position: absolute;
            top: 5px;
            left: 56px;
            margin-left: -2px;
            width: 2px;
            height: 50px;
            background: #333;
            border-radius: 50px;
            transform-origin: bottom;
            z-index: 5;
            animation: tick-tock 60s steps(60, end) infinite;
        }
        .center {
            position: absolute;
            top: 62px;
            margin-top: -15px;
            left: 55px;
            margin-left: -8px;
            border-radius: 50%;
            background: #ed6e46;
            width: 16px;
            height: 16px;
            z-index: 20;
        }
    }
}

@keyframes tick-tock {
    to {
        transform: rotate(360deg);
    }
}

```

[在线查看效果](https://jsfiddle.net/shenshaohui1991/s2a2439y/)

#### loading

这里主要使用了`animation-delay`为负数的情况，未负数可以让动画提前执行

```css
.bar-loading {
    position: relative;
    overflow: hidden;
    list-style: none;
    margin: 20px auto;
    height: 100px;
    li {
        float: left;
        width: 10px;
        height: 100px;
        margin-right: 4px;
        animation: short .8s cubic-bezier(.34, .77, .55, .19) infinite alternate;
        transform-origin: bottom;
    }
    li:nth-child(5n+1) {
        background: rgba(171, 189, 129, 1);
    }
    li:nth-child(5n+2) {
        background: rgba(244, 126, 96, 1);
    }
    li:nth-child(5n+3) {
        background: rgba(225, 91, 100, 1);
    }
    li:nth-child(5n+4) {
        background: rgba(132, 155, 135, 1);
    }
    li:nth-child(5n) {
        background: rgba(248, 178, 106, 1);
    }
    @for $i from 1 to 10 {
        li:nth-child(#{$i}) {
            animation-delay: (-4-$i * $i)*0.1s;
        }
    }
}

@keyframes short {
    from {
        transform: scaleY(1);
    }
    to {
        transform: scaleY(.2);
    }
}

.block-loading {
    position: relative;
    width: 300px;
    height: 300px;
    border-radius: 4px;
    border: 1px solid #d1d1d1;
    list-style: none;
    li {
        position: absolute;
        top: 0;
        left: 0;
        width: 100px;
        height: 100px;
        animation: blockMove 4s linear infinite both;
        border-radius: 4px;
    }
    li:nth-child(1) {
        background: rgba(255, 236, 88, 1);
        animation-delay: -2s;
    }
    li:nth-child(2) {
        background: rgba(124, 215, 255, 1);
        animation-delay: -1s;
    }
    li:nth-child(3) {
        background: rgba(255, 124, 129, 1);
    }
}

@keyframes blockMove {
    0% {
        transform: translate(0, 0);
    }
    
    25% {
        transform: translate(200px, 0);
    }
    
    50% {
        transform: translate(200px, 200px);
    }
    
    75% {
        transform: translate(0, 200px);
    }
    
    100% {
        transform: translate(0, 0);
    }
}
```

[在线查看效果](https://jsfiddle.net/shenshaohui1991/3qz9rgzp/)

## 参考

+ [animation动画实践](http://imweb.io/topic/55bb5e50193684376cd08b44)
+ [css3 animation 属性众妙](https://aotu.io/notes/2016/11/28/css3-animation-properties/index.html)
+ [How to Use steps() in CSS Animations](https://designmodo.com/steps-css-animations/)
+ [CSS3动画之逐帧动画](https://aotu.io/notes/2016/05/17/css3-animation-frame/)