---
layout: post
title: '移动端网页性能优化CheckList'
date: 2018-07-02
author: SSH
categories: [Javascript]
tags: [性能优化]
excerpt: 移动端网页性能优化CheckList，做完页面之后可以根据这个列表自查一下
---

## 一、网络加载

1、DNS预加载

> 通过dns-prefetch属性可以让浏览器提前解析资源或接口对应的服务器IP地址，避免在请求中发起DNS解析请求，节省请求时间

2、资源预加载

> 利用preload，prefetch，preconnect属性我们可以在`<head>`内部声明式的书写资源获取请求，提前加载非首屏但又较重要的资源，避免在满足首屏优先加载的情况下，反而忽略了其他次重要资源的加载

3、使用CDN资源，并且注意http缓存头的设定

> HTTP缓存包括强缓存（Cache-Control，Expire）和协议缓存（Last-modified, Etag）两种。其中，协议缓存资源每次都会像服务端发送请求来判断资源是否过期，未过期则返回304，在网络极其卡顿的情况下，这个304请求有可能堵塞整个页面的资源加载

4、对JS资源按照模块和首屏需求进行优先加载，不需要的模块按需加载

> 移动端的网络资源有限，为了尽快让用户看到有意义的首屏，我们需要尽可能的保持首屏需要加载的资源越小越好

5、内联首屏关键CSS

> 将首屏关键样式内联至页面中，保证最快速度看到带有基本样式的首屏，避免用户端出现较长时间的白屏时间

6、内联关键JS代码

> 内联关键代码也是为了让用户第一时间感受到页面已经加载成功，但是内联代码不能将所有代码都内联至HTML中，因为这些代码每次都会伴随HTML下载下来，加大HTML文件的体积，也无法让代码在不同的网页间提供复用的功能

7、检查服务端下发的资源是否使用GZIP压缩

> GZIP对于文本资源（JS，CSS文件）有较高的压缩效率，通常可以减少70%的体积

8、避免资源的重定向

> 增大加载时间，用户体验较差

9、异步延迟加载第三方非关键代码

> 移动端网络资源有限，为了让这些不重要的代码不影响首屏渲染，可以延迟一小段时间在加载

10、合理的使用本地缓存，避免把不必要的数据全部放到COOKIE当中

> 每一次AJAX请求都会将当前域名中的所有COOKIE值传递给服务端

11、使用service worker，增加页面的离线体验和页面的加载体验

> 页面发送请求时，会先经过SW的脚本，这样可以让我们通过编程的方式来制定我们需要控制的文件，同时，缓存在service worker中的文件，可以让用户离线访问

12、在条件允许的情况下，可以使用HTTP2.0协议

> HTTP2.0协议可以提升网络链路的复用性，提升资源加载效率

## 二、HTML

1、注重标签的语义化，保持用最简洁的标签完成所需的功能

> 标签的语义化提高代码的可维护性，在页面加载CSS失败时也不至于很难看。同时，需要保持标签最小化，无意义的标签可以利用伪类表示

2、CSS放到head中，JS到body尾部，JS,CSS都需要放在head中时，JS放在前面

> 1、CSS会阻塞页面的渲染，不阻塞DOM的解析；2、JS会阻塞DOM的解析，但是，浏览器会预先下载资源；3、浏览器在遇到script标签时会触发页面渲染，如果这时CSS尚未加载完成，页面将会等待CSS加载完成后在执行

3、HTML代码压缩，去除注释、空白符

> 减少网络传输的文件大小

4、尽量避免使用iframe

> iframe 内资源的下载进程会阻塞父页面静态资源的下载与 CSS 及 HTML DOM 的解析

## 三、CSS

1、压缩CSS代码，排除重复的CSS样式

> 减少网络传输的文件大小

2、根据组件打包CSS文件

> 按需加载，减少网络传输的文件大小

3、避免使用CSS的@import语法

> 可能阻塞页面的加载

4、使用Sass、Stylus、Less等预编译语言时，编码CSS嵌套不超过3层

> 提高解析css的效率

5、使用autoprefixer给CSS代码自动增加前缀

> 自动帮助我们添加浏览器头，避免意想不到的浏览器兼容性问题

6、尽量少使用css通配符，特别是多层嵌套的末尾使用通配符

> CSS的解析过程是从右往左逆向匹配，使用CSS通配符会增加解析的计算量

7、不要滥用高消耗的样式

> box-shadow、border-radius、filter这些属性绘制前都需要浏览器进行大量的计算

## 四、动画

1、简单动画尽量只使用transform、opacity、transition等属性完成

> width、height、top、left、right、bottom、margin等属性的变更都会触发页面的重排，在移动端环境中频繁的重排会导致动画卡顿

2、较复杂动画可以使用css帧动画

> 在移动端兼容性好、性能好、更具有可操控性

3、js动画不要使用setTimeout、setInterval，使用requestAnimationFrame

> setTimeout和setInterval在动画执行存在性能问题，且无法准确的控制帧数

4、对将要使用动画的部分，开启GPU硬件加速（注意不要滥用）

> 对开启GPU硬件加速的标签，浏览器将把他提升到一个单独的图层，并通过GPU进行预处理

5、使用will-change属性（注意不要滥用）

> will-change的作用告诉浏览器哪些属性将要变化，让他可以提前做好准备

## 五、JavaScript

1、JS代码压缩，代码分模块加载

> 减少代码大小，根据页面需求按需加载资源，最下化用户需要加载的资源大小加快页面展示的速度

2、处理长列表或者大量DOM元素时，不要绑定太多的事件监听函数

> 节省内存和减少监听事件的注册

3、利用throttle和debounce函数去处理频发触发，但是不需要频发执行的函数，例如scroll,touchmove

> 避免频繁的无效的操作，避免页面的卡顿

4、利用setTimeout代替setInterval

> setInterval可能存在指令堆积的问题，导致页面卡顿

5、尽量避免大批量的重排重绘

> 页面的重排重绘很耗性能，尤其是重排

## 六、图片

1、使用工具压缩图片

> 移动端网络条件有限，图片越大加载时间越长，合理使用工具压缩图片，可以兼顾图片质量和图片大小

2、使用较高压缩比格式的文件webp

> 减少文件传输的大小，避免出现图片尺寸使用不当的问题，小icon用大图

3、使用雪碧图

> 减少http请求数，不过当我们的http协议升级至1.1，2.0之后，雪碧图减少http请求数的效果并不明显

4、图片懒加载

> 避免用户提前加载过多无用的资源，浪费用户流量

5、根据不同的屏幕像素比加载不同尺寸的图片

> 在较大像素比的屏幕下加载小尺寸的图片，图片会模糊；在较小像素比的屏幕下加载大尺寸的图片，会浪费用户流量和cdn流量

6、小于2KB的图片可以尝试使用base64格式去替换

> 将图片转换成base64格式可以减少http请求数量，但是，不能对较大尺寸的图片使用base64格式，因为base64算法会提升三分之一的文件大小

## 七、字体

1、压缩字库大小，避免加载过多无用的资源，推荐工具字蛛

> 我们只需要页面需要的字体文件即可，不需要浪费流量加载用户不需要的资源

2、优化字体的展示策略

> 使用font-display属性可以避免在字体加载过程中，不显示文字的问题

3、当特殊文字量较少且内容固定时，可以尝试使用图片代替

> 快速完美的还原界面

## 八、体验

1. 对于整个页面资源需求量较大时，可以使用骨架屏或者增加loading效果

> 加强用户体验，加速首屏体验，通过有意义的ui让用户提前得到反馈

## 九、工具

1、lighthouse性能跑分

> Google推出的网页性能跑分工具，可以较全面的了解网站的性能

2、通过Chrome的控制面板code coverage部分，找到未使用代码的比例

> 帮助我们快速找到首屏未使用的代码

3、通过构建工具中使用Scope Hoisting

> 这里以webpack举例，使用Scope Hoisting后打包的文件，文件体积更小，代码运行时创建的函数作用域更少，提升JS的启动速度

## 参考

+ web-performance-made-easy:[https://speakerdeck.com/addyosmani/web-performance-made-easy](https://speakerdeck.com/addyosmani/web-performance-made-easy)
+ rail模型讲解:[https://zhuanlan.zhihu.com/p/20276064](https://zhuanlan.zhihu.com/p/20276064)
+ Yahoo性能优化:[https://developer.yahoo.com/performance/rules.html](https://developer.yahoo.com/performance/rules.html)
+ Google PageSpeed Insights规则:[https://developers.google.cn/speed/docs/insights/rules](https://developers.google.cn/speed/docs/insights/rules)
+ Google IO web性能优化笔记:[https://medium.com/@afutseng/i-o-18-%E7%AD%86%E8%A8%98-web-performance-made-easy-c10cfd5ef83e](https://medium.com/@afutseng/i-o-18-%E7%AD%86%E8%A8%98-web-performance-made-easy-c10cfd5ef83e)
+ 14 Rules for Faster-Loading Web Sites:[http://stevesouders.com/hpws/rules.php](http://stevesouders.com/hpws/rules.php)
+ 2018前端性能优化清单:[https://juejin.im/post/5a966bd16fb9a0635172a50a](https://juejin.im/post/5a966bd16fb9a0635172a50a)
+ 2017前端性能优化清单:[https://github.com/Findow-team/Blog/issues/11](https://github.com/Findow-team/Blog/issues/11)
+ 美团感官性能优化:[https://tech.meituan.com/Optimization_of_front_end_sensory_properties.html](https://tech.meituan.com/Optimization_of_front_end_sensory_properties.html)
+ 前端性能优化相关:[https://github.com/wy-ei/notebook/issues/34](https://github.com/wy-ei/notebook/issues/34)
+ 前端那些事，性能优化:[https://juejin.im/post/59ff2dbe5188254dd935c8ab](https://juejin.im/post/59ff2dbe5188254dd935c8ab)
+ PWA简介:[http://sangka-z.com/PWA-Book-CN/ch03/3.2.html](http://sangka-z.com/PWA-Book-CN/ch03/3.2.html)
+ css性能优化:[https://segmentfault.com/a/1190000007336987](https://segmentfault.com/a/1190000007336987)