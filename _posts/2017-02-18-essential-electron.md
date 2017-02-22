---
layout: post
title: 'Electron简介（译）'
date: 2017-02-18
author: SSH
categories: [front]
tags: [Javascript, Electron, Translate]
excerpt: 最近想做一个上传图片的桌面应用，于是就找了一下Electron相关的资料。但是，electron相关的文章太少了，千辛万苦终于找到了一篇，在这里就翻译一下它，作为学习Electron的第一步。
---

## 一、什么是Electron?

Electron是一个让你通过JavaScript、HTML、CSS就可以编写桌面应用的库。这些应用可以打包运行在Mac、Windows、Linux电脑上，同时也可以放到Mac和Windows的App Store中。

#### 定义：

+ **JavaScript,HTML,CSS** 都是Web开发语言，这意味着他们是构建网站和浏览器的片段，它知道如何把代码转换成你能看到的虚拟画面。

+ **electron是一个库** 你不需要重复编写代码，你只需要利用Electron来构建你的应用即可。

#### 资源：

+ [Apps built on Electron](http://electron.atom.io/apps)
+ [Electron API Demos](http://electron.atom.io/#get-started)

## 二、有什么优点？

通常来说，运行在不同操作系统的桌面应用应该用对应的原生语言来编写，这意味着在不同的操作系统上运行需要不同的团队编写不同的语言。Electron可以让你通过web语言写一次APP。

#### 定义：

+ **原生语言（操作系统）** 下列是所有操作系统最多使用的原生语言：Mac, Objective C; Linux, C; Windows, C++。

## 三、它是怎么运行的呢？

Electron融合了Chromium、Node.js以及一些操作系统的API，例如打开窗口、通知消息、桌面ICON等等。

![Electron](http://p8.yx-s.com/d/inn/7dc574f9/components.png)

#### 定义：

+ **API** 应用接口为你提供一批可以操作这个库的函数
+ **Chromium** 由谷歌创建的chrome浏览器的开源库
+ **Node.js** 一个用js写服务端代码的工具，同时可以操作文件系统和网络。

#### 资源：

+ [Node.js](https://nodejs.org)
+ [Chromium](http://chromium.org)
+ [Eelctron blog post](http://electron.atom.io/blog/2016/08/08/electron-internals-using-node-as-a-library)
+ [Electron versioning](http://electron.atom.io/docs/tutorial/electron-versioning/)

## 四、开发起来是啥感觉？

开发Electron时你可以在页面中直接使用Node.js的语法，同时不需要考虑任何兼容性的问题，你只需要考虑最新版的Chrome是否支持就可以啦。

#### 定义：

+ **使用Node** 这不是全部！ 除了完整的Node API之外，你可以使用已经编写和托管在npm的超过300,000个模块，Node的包管理器。
+ **一个浏览器** 并非所有的浏览器都是一样的，网页设计师和开发人员往往需要额外的努力，使每个网站看起来一模一样。
+ **最新的Chrome** 使用超过90%的ES2015语法，或者最新的功能CSS变量

#### 资源：

+ [Can I Use?](http://caniuse.com/#home)
+ [Updates to Chrome](http://blog.chromium.org)
+ [CSS Variables](https://developers.google.com/web/updates/2016/02/css-variables-why-should-you-care?hl=en)

## 五、前置条件

开发Electron你需要：1、了解JS、CSS、HTML 2、安装Node.js

#### 定义： 

+ **现实一点** 学习做网站或者写Node并不是一夜之间的事情，但是希望下面的链接可以帮助到你。

#### 资源：

+ [Install Node](https://nodejs.org)
+ [NodeSchool Tutorials](http://nodeschool.io)
+ [JS for Cats](http://jsforcats.com)
+ [Learn to Code HTML & CSS](http://learn.shayhowe.com/html-css)
+ [CSS Tricks](https://css-tricks.com)
+ [Mozilla Developer Network](https://developers.google.com/web/updates/2016/02/css-variables-why-should-you-care?hl=en)

## 六、2种进程

Electron有两种类型的进程：主进程和渲染进程，Electron中有很多模块可以单独运行于其中一个或两个进程中。主进程更多的是运行在后台，而渲染进程则是你应用中的每一个窗口。

#### 定义：

+ **模块** Electron的接口是根据他的功能划分的，举个例子,`dialog`模块拥有所有原生窗口的APIs，类似打开文件、保存文件、弹窗。

#### 资源：

+ [Electron APIs List](http://electron.atom.io/docs/api/)

## 七、主进程

主线程是每一个Electron应用的入口，一般命名成`main.js`。它管理着整个应用的生命周期，从开始到结束。同时，他也可以调用系统原生的元素和在应用中创建新的渲染进程。打开窗口或者其他原生系统操作都是资源密集型的操作，为了不打断渲染进程，所以这些操作都在主线程完成。

![Main Process](http://p9.yx-s.com/d/inn/72c3d836/main.png)

## 八、渲染进程

渲染进程是你应用中的浏览器窗口。和主线程不同，渲染进程是独立的且可以同时存在多个。渲染进程也可以被隐藏。一般来说会命名成`index.html`。他们就是普通的HTML页面，但是在electron中你还可以使用所有Node.js的接口。

![Renderer Process](http://p9.yx-s.com/d/inn/20df86fe/renderer.png)

## 九、怎么理解这两种进程呢？

Chrome浏览器中的每一个Tab都类似于一个独立渲染进程。如果拟关闭了所有的Tab，Chrome依然存在，就像主进程一样，你还可以继续打开新窗口或者退出应用。

![how](http://p7.yx-s.com/d/inn/35e058ac/like-this.png)

#### 资源：

+ [主进程和渲染进程之间的区别](http://electron.atom.io/docs/tutorial/quick-start/#differences-between-main-process-and-renderer-process)

## 十、保持通信

因为主进程和渲染进程都需要响应不同的任务，所以他们需要保持联系。我们可以使用IPC在主线程和渲染进程中发送消息。

![IPC](http://p9.yx-s.com/d/inn/e53988be/ipc.png)

#### 定义：

+ **IPC** 每一个主进程和渲染进程都有一个`IPC`模块可以使用。

## 十一、总结

electron应用类似于Node应用，通过`package.json`文件来定义主线程是通过那个文件启动。然后主线程创建渲染线程并通过`IPC`在两者之间传递消息。

![app-files](http://p9.yx-s.com/d/inn/07a4087b/app-files.png)

## 十二、快速入门

`Electron Quick Start`这个工程仅仅包含了`package.json`、`main.js`、`index.html`，你已经学到这里了，是时候试一试身手啦。此外，你可以`check out`下面的模版作为你应用的框架。

#### 资源：

+ [Electron Quick Start](https://github.com/electron/electron-quick-start)
+ [Awesome Electron:Boilerplates](http://electron.atom.io/community#boilerplates)

## 十三、打包

当你的应用开发完成之后，你可以利用`electron-packager`来打包。

#### 资源：

+ [electron-packager](http://github.com/electron-userland/electron-packager)
+ [Electron API Demos打包命令](https://github.com/electron/electron-api-demos/blob/master/package.json#L15-L18)
+ [Mac应用商店Electron指南](http://electron.atom.io/docs/tutorial/mac-app-store-submission-guide/)
+ [Windows应用商店Electron指南](http://electron.atom.io/docs/tutorial/windows-store-guide/)

## 十四、其他资源

现在跟你说这些概念可能还有一些远，但是这里还有别的资源。

#### 资源：

+ [Electron文档](http://electron.atom.io/docs/)
+ [Awesome Electron](http://electron.atom.io/community/)
+ [Spectron](http://electron.atom.io/spectron/)
+ [Devtron](http://electron.atom.io/devtron/)

## 十五、读后感

感觉本文比较适合作为electron入门的PPT，内容真的很简洁，读完之后大致了解了怎么开发Electron，但是还是要实际写一写体会一下具体流程。

> - 原文链接:[Essential Electron](http://jlord.us/essential-electron/)
> - 译文地址:[sshfe.com](http://www.sshfe.com)
> - 译文作者:[shenshaohui1991](https://github.com/shenshaohui1991)
> - 分享PPT:[ppt](https://ppt.baomitu.com/p/9ed9fea8)