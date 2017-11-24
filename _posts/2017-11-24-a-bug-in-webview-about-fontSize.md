---
layout: post
title: '一个WebView的坑'
date: 2017-11-24
author: SSH
categories: [Javascript]
tags: [WebView]
excerpt: 一个WebView的坑，字体变化导致页面错误乱
---

今天被测试找到说之前做的一个页面在一台高端的手机上发生了错乱。因为使用flex布局，所以第一点就想到是不是因为兼容性的问题，但是，这一台高端手机默认搭载了android7.0的系统，应该不存在对flex不兼容的问题。

在观察页面时，发现只有在app自带的webview中才会出现上述的情况。页面的表现是所有内容都被放大了，所以才到导致页面错乱。而我的页面所有的单位都使用的**rem**，**rem**这个单位的大小是根据根节点的字体大小来决定。所以当时猜测和字体被修改了有关系，于是用x5内核提供的工具一调试发现真的是这样的。那么解决方案就很简单了：重新计算根节点的字体大小就行了。

```javascript
(function (psdWidth) {
    var $html = document.documentElement;

    function recalcRem() {
        var htmlWidth = Math.min($html.clientWidth, psdWidth);
        var htmlFontSize = htmlWidth / psdWidth * 100;

        $html.style.fontSize = htmlFontSize + 'px';

        // 重新计算
        var realFontSize = parseFloat(window.getComputedStyle($html)['font-size']);
        if (Math.abs(realFontSize - htmlFontSize) > 0.1) {
            $html.style.fontSize = (htmlFontSize * htmlFontSize / realFontSize) + 'px';
        }
    }
    
    recalcRem();
    window.addEventListener('resize', recalcRem);
})(720);
```

上面的代码很简单，判断根节点的实际字体大小，如果和当前计算出的字体大小差距较大，可以直接根据比例计算出新的根节点大小。

总结一下出现这种问题的情况：

1. 使用rem作为单位，且使用js动态计算字体大小 
2. 移动端webview或浏览器强制修改了字体大小