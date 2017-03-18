---
layout: post
title: '项目填坑记-cookie'
date: 2017-03-18
author: SSH
categories: [front]
tags: [Javascript, WTF]
excerpt: 流水账，关于在项目中使用cookie遇到的一些坑
---

前段时间开发了一个用户登录的模块，需求很简单，用户输入手机号和验证码，我们就会返回给用户一套身份信息并保存在cookie里面。so easy，于是就有以下代码：

```javascript
// 大致意思如下，并非真实模块中的代码
document.cookie = 'token=xxxxxxxx;domain=xxx.com;path=/;expires=xxxx';
```

大功告成！但是，问题也来了，这样做并不安全，用户的信息可以轻易的通过JS获取，`XSS`，`CSRF`变的轻而易举。于是，我们将种cookie的操作交给了服务端，并给其中一个cookie加上了`httponly`属性，这个属性**仅仅**保证我们的cookie不能通过`document.cookie`来获取，减小了用户cookie被窃取的概率。

```javascript
Set-Cookie:token1=xxxxx; expires=GMT Date; Max-Age=xxx; path=/; domain=xxx.com
Set-Cookie:token2=xxxxx; expires=GMT Date; Max-Age=xxx; path=/; domain=xxx.com; httponly
```

好啦，再次大功告成。但是，过了一段时间，我们的网站多啦，同时存在了几个域名，我们需要在用户登录的时，同时给多个域种cookie。OK，很简单，我们只需要调用多个域名下的种cookie的接口，不就行啦？

事情没有这么简单，经过测试之后发现我们的cookie在某些特定的浏览器下有可能跨域种cookie失败。为什么呢？经过一番google之后，发现其实是一些浏览器对于跨域种cookie做了一些限制，我们需要用一些方法来解决限制。

> P3P由万维网协会研制，它为Web用户提供了对自己公开信息的更多的控制。支持P3P的Web站点可以为浏览者声明他们的隐私策略。

其实上面都是废话，大概意思就是说你要在你的http header里面加入一个P3P协议的说明，详细信息可以看这个歪果仁写的文章["P3P, Cookies and IE6.0: A Case Study"](https://www.sitepoint.com/p3p-cookies-ie6/2/)

```javascript
P3P:CP="NOI ADM DEV PSAi COM NAV OUR OTRo STP IND DEM"
```

很开心，再次大功告成。BUT，现实总是这么残酷，safari上仍然不能跨域种cookie。这又是为什么呢？根据苹果爸爸的尿性来推测，肯定又是他做了什么安全性的限制。果然！在safari浏览器中打开`设置 > 隐私 > 阻止cookie > 永不`，打开上述设置之后，跨域种cookie瞬间成功。但是，我们总不能要求用户一个个去打开这个设置吧？所以还要另寻解决办法。

后来我们发现其实对于safari来说所谓的第三方需要满足两个条件：

1. 用户从来没有主动访问该域名
2. 该域名并没有作为第一方种过cookie

基于以上两点我们做了2个操作：

1. 通过`http 302`的方式来跨域种cookie
2. 在用户访问我们的域名之后，默认在访问域名下种下一个记录性的cookie，减小我们的域名种Cookie失败的概率

好啦，这次真的大功告成啦，写一篇流水账记录一下这个坑。