---
layout: post
title: 'HTTP协议小记'
date: 2018-01-17
author: SSH
categories: [Javascript]
tags: [Http]
excerpt: 关于HTTP协议的一点"小姿势"
---

## http协议简介

### 简介

http协议(HyperText Transfer Protocol，超文本传输协议)是一种基于tcp连接**无状态**的应用层协议，用于从服务器传输html文本到用户本地浏览器。协议采用了请求/响应模型，客户端发送一个请求，在请求头中包含了请求的方法、URL、协议版本、请求的状态码、响应头、请求头。

![http header](http://opl3e6e3n.bkt.clouddn.com/http_header.jpeg)

### URL
URL(Uniform Resource Locator 统一资源定位符)是对互联网上资源的位置的一种简洁表示方式，一般格式如下：

```
协议://服务器名:端口/路径/文件名
```

### 请求方法

HTTP1.0定义了三种请求方法：GET, POST 和 HEAD方法。
HTTP1.1新增了五种请求方法：OPTIONS, PUT, DELETE, TRACE 和 CONNECT 方法。

+ GET: 请求指定的页面信息，并返回实体主体。
+ HEAD: 类似于get请求，只不过返回的响应中没有具体的内容，用于获取报头
+ POST: 向指定资源提交数据进行处理请求（例如提交表单或者上传文件）。数据被包含在请求体中。POST请求可能会导致新的资源的建立和/或已有资源的修改。
+ PUT: 从客户端向服务器传送的数据取代指定的文档的内容。
+ DELETE: 请求服务器删除指定的页面。
+ CONNECT: HTTP/1.1协议中预留给能够将连接改为管道方式的代理服务器。
+ OPTIONS: 允许客户端查看服务器的性能。
+ TRACE: 回显服务器收到的请求，主要用于测试或诊断。

### 状态码

状态码一般分5类

+ 1xx：指示信息--表示请求已接收，继续处理
+ 2xx：成功--表示请求已被成功接收、理解、接受
+ 3xx：重定向--要完成请求必须进行更进一步的操作
+ 4xx：客户端错误--请求有语法错误或请求无法实现
+ 5xx：服务器端错误--服务器未能实现合法的请求

比较常用的

+ 200 OK
+ 206 Partial Content(断点续传)
+ 304 Not Modified
+ 403 Forbidden
+ 404 Not Found
+ 500 Server Error

## http协议的比较

HTTP协议目前在用的版本包括1.0、1.1、2.0，下面对这些版本做一个简单的比较。

http1.0 和 http1.1的区别：

+ 缓存处理，http1.1新增了entity tag、if-unmodified-since、if-match等控制混存的头
+ 带宽优化 & 网络连接使用，
+ 错误通知管理，http1.1新增了24个错误状态码，406()、408()、410()
+ 长链接，http1.1默认开启Connenction: keep-alive，利用一个tcp链接传送多个http请求和相应，减少建立、关闭链接时的耗时

http1.1可能出现的问题：

线头阻塞：http1.1提供了Pipelining技术，即多个http请求通过一个tcp连接发送，发送的过程中不需要等待前一个请求的结果，但是，客户端在相应的过程中，需要按照发送顺序等待结果，因此，如果在等待的过程中前一个请求的处理事件较长就会堵塞后面的请求。不过不用担心我们的网站会遇到这个问题，因为http pipelining 默认处于关闭状态。

http2.0新增的功能：

+ 新的二进制格式，http2.0新增了二进制分帧层，对所有传输的数据采用二进制格式编码
+ 多路复用，多个请求共用一个tcp请求，但是并不会出现上述线头阻塞的情况，因为每一个request都带上独有的id，接收方根据requestId来对请求归类
+ header压缩，通过header表来避免重复的header的传输，减小每次传输的header的体积
+ 服务端推送，服务端可以对客户端的一个请求发送多个响应

## http缓存机制

为了减少页面浏览的延迟、降低消耗的网络流量，http提供了缓存机制，通过http头中一些标示来控制是否需要加载最新的数据，主要的http头包括：

+ expires（http1.0），展示资源的过期时间，`expires:Thu, 19 Nov 1981 08:52:00 GMT`
+ cache-control（http1.1），类似于expires，但是用的相对时间，`cache-control:max-age=[秒]`
+ Last-Modified（http1.0），最新的修改时间，浏览器向服务端发送`If-Modified-Since`头，让服务端判断数据是否修改
+ ETags（http1.1），服务器对于一个资源文件生成的唯一标示，浏览器向服务端发送请求并通过`If-None-Match`字段将`etags`发送给服务器，如果匹配则返回304，不匹配则返回请求数据和200

expires和cache-control属于强缓存，发现资源没有过期就**不会**向服务端发送请求
last-modified和etags属于弱缓存，每次都会向服务端发送请求判断资源是否改变，即无法避免的304请求

手动刷新页面：浏览器会认为缓存已过期，则在请求中增加`Cache-Control: max-age=0`，向服务端查询文件是否有更新
强制刷新：浏览器会直接忽略本地缓存，在请求中增加`Cache-Control: no-cache`，则一定会向服务端发送请求

|                         | Expires/Cache-Control | Last-Modified/Etag |
| ----------------------- | :-------------------: | :----------------: |
| 地址栏回车              | 有效                  | 有效               |
| 页面跳转                | 有效                  | 有效               |
| 新开窗口                | 有效                  | 有效               |
| 前进后退                | 有效                  | 有效               |
| 手动刷新                | 无效                  | 有效               |
| 强制刷新                | 无效                  | 无效               |

## 参考

+ [http2讲解](https://www.gitbook.com/book/ye11ow/http2-explained/details)
+ [HTTP,HTTP2.0,SPDY,HTTPS你应该知道的一些事](http://www.alloyteam.com/2016/07/httphttp2-0spdyhttps-reading-this-is-enough)
+ [HTTP2.0的奇妙日常](http://www.alloyteam.com/2015/03/http2-0-di-qi-miao-ri-chang/)
+ [Caching Tutorial](https://www.mnot.net/cache_docs)