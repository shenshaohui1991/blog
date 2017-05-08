---
layout: post
title: '快速了解小程序'
date: 2017-05-08
author: SSH
categories: [Javascript]
tags: [小程序]
excerpt: 通过HelloWorld带你快速了解什么是小程序
---

## 什么是小程序？

先引用小龙哥的一句话来看看啥是小程序？

> 小程序是一种不需要下载安装即可使用的应用，它实现了应用“触手可及”的梦想，用户扫一扫或者搜一下即可打开应用。也体现了“用完即走”的理念，用户不用关心是否安装太多应用的问题。应用将无处不在，随时可用，但又无需安装卸载。   - Allen Zhang（张小龙）

从程序猿的角度来说：小程序就是依赖于微信平台，利用小程序框架提供视图层描述语言`WXML`、`WXSS`，以及`JavaScript`来实现一个具备原生体验的Web应用。微信小程序相当于基于微信平台造了一个`React Native`的轮子，通过JS的跨平台性实现了一套代码跨平台部署、运行。

## Hello World

### 工程结构

首先，我们先通过微信web开发者工具新建一个项目，项目建成后会自动生成下列文件。下文全部围绕这个新建的项目来简单的介绍一下小程序。

![工程结构](http://opl3e6e3n.bkt.clouddn.com/file_structure.png)

可以看出整个工程包括`app.js`、`app.json`、`app.wxss`，以及`pages`和`utils`目录，后面我们一次介绍各个文件和目录的作用。

其中`app.js`、`app.json`、`app.wxss`最为重要，他们为对整个小程序进行全局配置。

+ `app.js`，声明小程序的整个生命周期、定义全局变量
+ `app.json`，对整个小程序起全局配置的作用，规定小程序包括哪些页面、窗口的样式、底部tab栏的样式、网络超时事件、是否开启debug模式
+ `app.wxss`，这里的`wxss`类似于CSS，只不过是针对微信做了一部分拓展，定义了小程序的全局样式

而`pages`目录下面每一子目录都代表了小程序中的一个页面，而每一个页面都由`*.js`、`*.json`、`*.wxml`、`*.wxss`组成，这里又出现了一个新的后缀`wxml`，同时再次出现了`wxss`，后面会解释他俩是啥用的。先解释一下，页面中的这四种文件是干啥用的？

+ `*.js`，处理页面的逻辑
+ `*.json`，处理页面的配置
+ `*.wxml`，处理页面的结构
+ `*.wxss`，处理页面的样式

为了减少配置同一个页面目录中的文件都需要以同一个名字命名，例如个人习惯将所有页面目录下面的文件都用`index`命名。

### `*.json`中我可以配置什么？

上面有提到`app.json`可以配置页面的全局配置，而pages目录下`*.json`则可以配置对应页面`window`选项（窗口的样式），那么我们到底可以配置哪些具体内容呢？

```javascript
// app.json
{
    // 定义小程序中有哪些页面
    "pages":[
        "pages/index/index",
        "pages/logs/logs"
    ],
    
    // 窗口的样式
    "window":{
        "backgroundTextStyle":"light",
        "navigationBarBackgroundColor": "#fff",
        "navigationBarTitleText": "Demo",
        "navigationBarTextStyle":"black",
        "enablePullDownRefresh": true
    },
    
    // 底部tab的内容和样式
    "tabBar": {
        // tab的具体内容
        "list": [
            {
              "pagePath": "pages/index/index",
              "text": "首页"
            }, 
            {
              "pagePath": "pages/logs/logs",
              "text": "日志"
            }
        ]
    },
    
    // 设置不同请求的网络超时
    "networkTimeout": {
        "request": 10000,
        "downloadFile": 10000
    },
    
    // 是否开启debug模式，开启debug模式之后可以在微信开发者工具的控制台中看到整个APP，以及每个页面的生命周期日志
    "debug": true
}

```

常用的配置都在这里了，根据配置的命名其实已经可以猜个大概啦，如果猜不出来可以参考文档[“配置”](https://mp.weixin.qq.com/debug/wxadoc/dev/framework/config.html)

### 什么是`wxml`？

工程中出现了一个新的后缀`*.wxml`，而WXML(Weixin Markup Language)是微信小程序框架设计出来的一种标签语言，你可以直接把他理解成是微信定义了一套带有特殊事件、效果、属性的标签，但本质上和`<div>`、`<img>`、`<a>`等相似。值得注意的是，在`wxml`中也可以使用HTML的标签。

#### 数据绑定

WXML中还是实现了现在比较流行的数据绑定的功能，省去了我们操作DOM元素的烦恼。WXML使用了`Mustache`语法，即通过2个花括号来包裹某一个属性，通过修改调用JS来修改对象的属性，继而修改页面中dom元素的值。

{% raw %}
```javascript
<view>{{message}}</view>
```
{% endraw %}

```javascript
Page({
    data: {
        message: 'Hello Mina!'
    }
});
```

#### 列表渲染

而除了提供数据绑定，它还提供了列表渲染、条件渲染、模板、事件、引用等功能。不过语法都比较简洁，有基础的同学基本上都可以快速看懂。

{% raw %}
```javascript
<!-- 列表渲染 -->
<view wx:for="{{array}}">"{{item}}"</view>
```
{% endraw %}

#### 条件渲染

在处理条件渲染时需要注意，小程序中所有的条件判断表达式、`true`、`false`都需要使用`{{}}`包裹，否则会按照字符串来处理。

{% raw %}
```javascript
<!-- 条件渲染 -->
<view wx:if="{{condition}}">HAHA</view>
```
{% endraw %}

#### 模版

WXML提供语法简洁的前端模版，只需要你通过`template`中的`is`属性来制定需要使用的模版，并传入需要的参数就可以开始渲染了。

{% raw %}
```javascript
<!-- 模板 -->
<template name="msgItem">
  <view>
    <text> {{msg}} </text>
    <text> Time: {{time}} </text>
  </view>
</template>

<!-- 使用模版 -->
<template is="msgItem" data="{{...item}}"/>
```
{% endraw %}

#### 引用

小程序提供了两种不同方式的引用`import`和`include`，二者的区别在于：

+ `import`会引用目标文件中定义的 template
+ `include`会将目标文件中除了`template`外的所有内容拷贝到`include`定义的位置
 
还需要注意的是`import`存在作用域的概念，即它只会引用目标文件中的`template`，不会引用目标文件中`import`的文件。

{% raw %}
```javascript
<!-- import -->
<!-- A.wxml -->
<template name="A">
  <text> A template </text>
</template>

<!-- B.wxml -->
<import src="a.wxml"/>
<template name="B">
  <text> B template </text>
</template>

<!-- C.wxml -->
<import src="b.wxml"/>
<template is="A"/>  <!-- Error! Can not use tempalte when not import A. -->
<template is="B"/>

<!-- include -->
<!-- index.wxml -->
<include src="header.wxml"/>
<view> body </view>
<include src="footer.wxml"/>

<!-- header.wxml -->
<view> header </view>

<!-- footer.wxml -->
<view> footer </view>
```
{% endraw %}

#### 事件

这里单独说一下WXML中所提到的事件，小程序框架通过事件来保持视图层和逻辑层的通讯，例如，用户进行点击行为，点击行为触发了点击事件，进而触发逻辑层中所绑定的函数。

和我们在浏览器中开发JS有区别的是，这里的事件分两种：冒泡事件和非冒泡事件。其中冒泡事件包括`touchstart`、`touchmove`、`touchcancel`、`touchend`、`tap`、`longtap`，其余未提及的事件或者自定义事件均为非冒泡事件。

而在标签绑定事件函数存在两种方式`bind*`、`catch*`，其中`bind*`的事件绑定不会阻止冒泡事件向上冒泡，`catch*`则会阻止冒泡事件向上冒泡相当于直接在函数中执行`e.stopPropagation()`来阻止事件冒泡。

### 什么是`wxss`？

WXSS(WeiXin Style Sheets)是一套样式语言，我们可以简单理解成**CSS的一个拓展**，它增加了两个特性：

+ 尺寸单位
+ 样式导入

在WXSS中引入了一个新的单位`rpx`(responsive pixel)，根据屏幕宽度的不同`rpx`代表的实际`px`也不同。WXSS规定一个屏幕的宽度为`750rpx`，750刚好是iphone6的物理宽度大小，也是目前大多数设计师出设计稿的标准宽度。也就是说当我们拿到设计稿的时候，我们不需要通过百分比、`rem`，而是直接测量出设计稿上的像素大小并使用微信提供的`rpx`就可以满足多屏适配的问题。

除了`rpx`，WXSS还提供了目前大部分CSS预编译语言所提供的是样式导入，即将外联样式导入当当前文件中

```css
/** common.wxss **/
.small-p {
  padding:5px;
}

/** app.wxss **/
@import "common.wxss";
.middle-p {
  padding:15px;
}
```

### App
我们可以通过`App()`来注册一个小程序，并指定他的生命周期。

```javascript
App({
    // 监听小程序初始化，只会在小程序注册时调用，其中返回值中包括了`path`小程序路径、`query`打开小程序的query、`scene`场景值
    onLaunch: function (options) {},
    
    // 监听小程序显示，当小程序启动或者从前台进入后台时会调用该方法
    onShow: function(options) {},
    
    // 监听小程序隐藏，当小程序从前台进入后台时调用
    onHide: function() {},
    
    // 监听小程序的错误，当小程序发生错误时触发，类似`window.onerror`
    onError: function() {},

    // 全局对象
    globalData: {}
});

// app本身是一个单例在一个程序中只有一个，所以在其它文件中如果想要使用APP对象需要通过下列方法调用
var appInstance = getApp();
```

![小程序的生命周期](http://opl3e6e3n.bkt.clouddn.com/life_app.png)

这里所谓的前台、后台引用文档里面的话来说就是：

> 当用户点击左上角关闭，或者按了设备 Home 键离开微信，小程序并没有直接销毁，而是进入了后台；当再次进入微信或再次打开小程序，又会从后台进入前台。

不难看出和APP所谓的前台后台很类似。

在这里我们还需要注意的一点就是**场景值**，场景值应该是微信所独有的一个概念，即你通过什么的方式进入小程序，你可以是通过“发现栏小程序主入口”，也可以是通过“单人聊天窗口”等等途径进入不同的方式都对应这个一个固定的值，这样你就可以根据不同的场景值对用户作区分、统计，亦或是功能上的区分，这些完全可以根据你的应用场景来决定。具体场景值可以参考文档[“场景值”](https://mp.weixin.qq.com/debug/wxadoc/dev/framework/app-service/scene.html)

### Page

和注册小程序相似，注册页面可以通过`Page()`去指定页面的生命周期、事件函数以及初始化数据

```javascript
Page({
    // 初始化的页面数据
    data: {
        text: "初始化数据"
    },
    
    // 页面加载时触发，这里的加载指的是第一次加载
    onLoad: function(options) {},
    
    // 页面渲染完成时触发
    onReady: function() {},
    
    // 页面显示时触发，每次打开都会触发
    onShow: function() {},
    
    // 页面隐藏时触发
    onHide: function() {},
    
    // 页面卸载时触发
    onUnload: function() {},
    
    // 用户下拉时触发
    onPullDownRefresh: function() {},
    
    // 用户上拉触底时触发
    onReachBottom: function() {},
    
    // 点击分享后触发
    onShareAppMessage: function () {},
    
    // 事件绑定函数
    viewTap: function() {
        // 修改页面数据
        this.setData({
            text: '啦啦啦啦啦'
        })
    },
    
    // 自定义的对象
    customData: {
        hi: 'MINA'
    }
})
```
 
![页面的生命周期](http://opl3e6e3n.bkt.clouddn.com/life_page.png)

上图为页面生命周期的一个描述，其中`onLoad`和`onUnload`对应代表了页面的生命开始和结束，页面的生命周期中`onLoad`、`onUnload`、`onReady`只会调用一次，`onShow`、`onHide`是可以多次调用的。

小程序中所有的页面都由框架自身维护，而框架则以栈的形式去管理所有的页面，下表为路由状态、页面的生命周期、页面栈的表现三者的关系

路由方式 | 触发时机 | 页面栈表现 | 路由前页面 | 路由后页面
---|---|---|---|---
初始化 | 在小程序中打开第一个页面 | 新页面入栈 | - | onLoad,onShow
打开新页面 | 调用`wx.navigateTo`或者使用`navigator`组件跳转方式为`navigateTo` | 新页面入栈 | onHide | onLoad,onShow
页面重定向 | 调用`wx.redirectTo`或者使用`navigator`组件跳转方式为`redirectTo` | 当前页面出栈，新页面入栈 | onUnload | onLoad,onShow
页面返回 | 调用`wx.navigateBack`或者使用`navigator`组件跳转类型为`navigateBack`或者按返回键 | 页面不断出栈，直到找到目标页面 | onUnload | onShow
Tab切换 | 调用`wx.switchTab`或者使用`navigator`组件跳转类型为`switchTab` | 页面全部出栈，只留下访问的tab页 | - | 根据跳转页面的不同而不同
重加载 | 调用`wx.reLaunch`或者使用`navigator`组件跳转类型为`reLaunch` | 页面全部出栈，只留下新的页面 | onUnload | onLoad,onShow

当然，如果你觉得上面的表述比较麻烦，你也可以直接在微信开发者工具中看到当前页面栈的变化情况。

![微信开发者工具-页面栈](http://opl3e6e3n.bkt.clouddn.com/20170508_web_stack.png)

框架也为我们提供了获取页面栈的方法，通过`getCurrentPages()`我们可以以数组的形式获得当前页面栈的实例，但是**不要尝试修改页面栈**，可能会出现莫名其妙的错误。

### 模块化

以项目中的`utils/utils.js`文件为例，它本身是一个普通工具类，采用了**CommonJS**的规范将自身特定的函数暴露给外部使用

```javascript
// utils/utils.js
function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports = {
  formatTime: formatTime
}

// logs/logs.js
// 通过require去引用utils.js
var util = require('../../utils/util.js')
```

在小程序中，基本上一个文件就是一个模块，并通过`module.exports`或者`exports`将想要暴露的对象、函数暴露出去。

### api 和 组件

前面在说`WXML`的时候，又提到小程序框架为我们提供了大量功能、风格和微信相似的原生组件相仿的标签，这些标签就是我们开发中要使用到的组件，下面大致浏览介绍一下

![组件](http://opl3e6e3n.bkt.clouddn.com/all_components.png)

除了这些功能丰富的组件外，微信还提供了丰富的微信API来调起微信

![API](http://opl3e6e3n.bkt.clouddn.com/all_apis.png)

这里只做一个大概介绍，具体内容请参考文档[“组件”](https://mp.weixin.qq.com/debug/wxadoc/dev/component/)和[“API”](https://mp.weixin.qq.com/debug/wxadoc/dev/api/)

### 需要注意的

+ 在小程序中无法使用`window`、`document`，因为小程序运行在`JsCore`中，它里面是不包含`window`、`document`的
+ 在小程序中无法使用`jquery`、`zepto`，因为`jquery`或`zepto`中使用了`window`或`document`
+ background-image不能使用本地资源，只能使用网络资源或者BASE64转码
+ 小程序只能同时打开5个页面，超过5个时，`wx.navigateTo`就不能正常打开了
