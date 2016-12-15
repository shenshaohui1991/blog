---
layout: post
title: 'Javascript Promises快速指南(译)'
date: 2016-10-14
author: SSH
categories: [front]
tags: [Javascript, Translate]
excerpt: 本文是一片关于如何让一个初学者迅速掌握Promise的文章，我也是在学习了Promise之后，无意中发现了这篇文章，发现自己对promise的理解还有很多遗漏的地方，于是就把它翻译了一遍。
---

当你在写JS代码的时候，[回调函数](https://developer.mozilla.org/en-US/docs/Mozilla/js-ctypes/Using_js-ctypes/Declaring_and_Using_Callbacks#Using_Callbacks)是最让人困惑的概念之一。[Promise](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise)是一种改善异步代码的新方法。

![回调地狱](https://www.twilio.com/blog/wp-content/uploads/2016/09/31orCejQRkSvmchYeZC2GKswNtst-d_xEoSPoP3X-bAm9RRe8hxz59vVZrrRm78VvJgVbuUo5R7dAikR2gY1rxtqQ14yMJP8K4CS3Siiir_wRpB6IYgoWGlpokE51vV4eYAI2lpP-1.png)

回调函数最严重的问题之一是不同的异步事件的链接。在异步函数执行完成之后，你通过传值结束了对他的调用。这样做的结果就是不可维护的回调地狱。Promise就是为了解决这个问题而出现的，但是，在刚开始使用它的时候可能会有一些困惑。

让我们来定义一下什么是Promise，为什么它这么有效，怎么用他去处理并行的或者串行的请求。

## 准备

在我们开始之前，你需要准备下面的东西来尝试运行我们的代码例子：

+ [Node.js](https://nodejs.org/)版本高于6.0。你可以在命令行中使用`node -v`来检查你的NodeJS版本，你可以通过他的网站来升级，也可以通过`nvm`来升级。(译者注：window直接去网站下载最新版本覆盖安装，linux/mac可以利用`n`来安装)

当你安装好之后，你需要创建一个新的文件夹，并通过下列命令在这个文件夹中来安装`fetch`和`request`:

```bash
npm init
npm install node-fetch request --save
```

创建一个新的文件`promises.js`，同时将下面代码写到文件中：

```javascript
'use strict'; // 使用严格模式

const fetch = require('node-fetch');
const request = require('request');
```

整个文章中，我们都将使用相同的`promise.js`文件

## Promise概览
在理解Promise的好处之前让我们先来看一下不使用Promise我是怎么处理异步请求的。为此我们将使用`request`库来发送一个HTTP请求。

添加下列代码到`promise.js`文件中:

```javascript
request.get('http://httpbin.org/get', (error, response, body) => {
    if (error) {
        console.error('Oh shoot. Something went wrong:');
        console.error(error.message);
        return;
    }

    console.log('Request done. Response status code: %d', response.statusCode);
});
```

通过`node promises.js`来运行上面的代码。正如你所见的，通过`request.get`的第二个参数我们进入了这个回调函数。当有HTTP响应的时候，库会自动执行这个函数。这个函数有三个参数，第一个参数返回潜在的问题，如果返回`null`则表示请求成功，第二个参数是http的响应，第三个参数是http响应体。

如果我们使用`fetch`来替代`request.get`，我们就可以利用`fetch`来使用Promise，他将会返回一个`promise`来代替通过接受回调函数作为参数。`Promise`是拥有2个重要的方法`then()`和`catch()`，`then()`接受1到2个参数，`catch()`可以获取到错误信息。

对于`then`函数来说，当调用结果成功则第一个函数会被调用，当调用结果失败则第二个函数会被调用。稍后我们来看一下`then`和`catch`有什么区别。将之前的代码替换成下列代码，我们来看一下`promise`该怎么使用：

```javascript
fetch('http://httpbin.org/get')
    .then(response => {
        console.log('Request using Promises done. Response status code: %d', response.status);
    })
    .catch(error => {
        console.error('Oh shoot. Something went wrong with the promise code:');
        console.error(error.message);
    });
```

目前为止Promise和回调函数相比除了代码简洁一点并有没有大的区别，真正神奇的地方是当我们需要做一些数据操作或者调用多个请求的时候。为此，一般规则是如果我们在传递给`then`或`catch`的处理函数中返回一个值或另一个Promise，Promise链将继续。

下面是一个例子增加了一个提取HTTP状态码的函数并返回该状态码：

```javascript
function extractStatusCode(response) {
    return response.status;
}

fetch('http://httpbin.org/get')
    .then(extractStatusCode)
    .then(statusCode => {
        console.log('Request using Promises, part II. Response status code: %s', statusCode);
    })
    .catch(error => {
        console.error('Oh shoot. Something went wrong with the promise code:');
        console.error(error.message);
    });
```

重新运行，输出的代码和之前一样，但是，我们的代码更加结构化。

这段代码先执行HTTP请求，然后调用`extractStatusCode`函数，一旦该函数返回，它将执行输出相应状态码的匿名函数。

## 抓住异常
现在我们使用Promise可能会遇到一个问题，如果我们不正确的抓住错误，那我们的代码执行错误时将不会有任何反映。

![Catch errors](https://www.twilio.com/blog/wp-content/uploads/2016/09/YS8PLVpcyhjaXzBZwzJ93O93W5blxqXQg-qqTIFEBXG0EG-OLRlgERwItSphhZ9imcpJQ35f0I7-s2FAZcQUHktJjU3-iMOTYuK2eFTQcctukZoxW9TzIvNAtrTNnR5YVtd7S5tX-4.png)

想像一下使用Promises就像在你的代码外面包裹一个`try {}`代码块。如果你不明确抓住错误，那你的代码执行失败时将不会有任何反应。抓住错误是相当重要的，而不只是‘规范’。

为了能正确的抓住的抓住错误，我们有两种方法。第一种方法是在我们的`then()`函数中传入第二个函数，或者是做下裂的改变：

```javascript
function extractStatusCode(response) {
    return response.status;
}

fetch('invalid URL')
    .then(extractStatusCode, errorInFetch => {
        console.error('An error occurred in the fetch call.');
        console.error(errorInFetch.message);
        // 返回null作为响应代码，因为没有执行任何请求
        return null;
    })
    .then(statusCode => {
        console.log('Request using Promises. Response status code: %s', statusCode);
    })
    .catch(error => {
        console.error('This will never be executed');
    });
```

当你运行这段代码时，你将会看到它出发了我们的错误回调并且在屏幕上打印出对应的信息：

![错误日志](https://www.twilio.com/blog/wp-content/uploads/2016/09/MDMEk6tcP9UztGgMMeYhTJVy9vSDPNxF-TE5gkr5HHGeoFimdsz1v985Uu0kAVwqQvzdRE25IXavzCaSJKhJqi5iDV0OX0I6kipDWE8vvOMlwbnbMC_0f2sGdTIGTWN42qRWG4ek-4.png)

因为我们在处理函数里面返回了一个`null`，所以我们的`catch`方法并没有执行。因为错误已经被处理啦，所以在Promise链的那一个位置起被认为是快乐的路线。

我们可以通过`throw`错误或者通过`Promise.reject(error)`返回新的Promise来确保他继续被当成一个错误来对待。

```javascript
function extractStatusCode(response) {
    return response.status;
}

fetch('invalid URL')
    .then(extractStatusCode, errorInFetch => {
        console.error('An error occurred in the fetch call.');
        console.error(errorInFetch.message);
        // forward the error
        return Promise.reject(errorInFetch);
    })
    .then(statusCode => {
        console.log('Request using Promises. Response status code: %s', statusCode);
    })
    .catch(error => {
        console.error('This will now be executed as another exception handler.');
    });
```

现在我们知道如何通过`then()`来抓住错误啦，但是`then()`和`catch()`又有什么区别呢？为了理解他们的区别，让我们看一下下面的代码：

```javascript
function extractStatusCode(response) {
    response = undefined;
    return response.status;
}

fetch('http://httpbin.org/get')
    .then(extractStatusCode, errorInFetch => {
        console.error('This will not be executed.');
        console.error(errorInFetch.message);
        // forward the error
        return Promise.reject(errorInFetch);
    })
    .then(statusCode => {
        console.log('Request using Promises. Response status code: %s', statusCode);
    })
    .catch(error => {
        console.error('There was an error somewhere in the chain.');
        console.error(error.message);
    });
```

![not execute errorInfect](https://www.twilio.com/blog/wp-content/uploads/2016/09/6i33oKjzuVOypuMfZrOrLoDwwpQZNnqg1Bj6A96ggBi1f1jykx51RNVvHUoZity2m8ssF7dTdA0GHF8lkZVXnfJUiK0BPOnLwTT3ywctJhZpkJ_-BrYyOnDbUi_KJjy1OE4A8xOT-4.png)

因为在`then()`只处理前一个Promise返回的错误，所以上面代码中`then()`错误部分并没有执行，而我们的`catch()`会处理所有所有发生在这条Promise链上的所有错误。

## 并行执行
考虑到我们想发送多个HTTP请求或者同时执行多项异步操作并且想知道他们何时全部完成的情况，Promise的神奇的地方就体现出来啦。

![two people](https://www.twilio.com/blog/wp-content/uploads/2016/09/gkYYQjOd3_hIFskG7pg6MBnP8uvvZFAL2j7xUHL-nPB7OvM835olCSo0594rCSnmvMl63Zyms_vZqHz1aKzPmY4wN6FpnQEhVYy-jWUw68YuPPrz6ieaW4VPxAXdYGWza_TdZBsc-4.png)

我们把想要请求的节点都放到数组中，通过回调来处理他将会是一团糟，为了完成统计所有请求都完成的目的，我们不得不在回调函数中加入计数器或者其他方式。

用Promise的话，我只需要利用`map`来遍历请求数组并返回所有请求的promise，最后把所有返回结果传入`Promise.all()`函数中。这样当所有Promise返回成功或者其中一个返回失败，就会马上返回一个新的Promise。

```javascript
const queryParameters = ['ahoy', 'hello', 'hallo'];

const fetchPromises = queryParameters.map(queryParam => {
    return fetch('http://httpbin.org/get?${queryParam}')
        .then(response => {
            // parse response body as JSON
            return response.json()
        })
        .then(response => {
            // extract the URL property from the response object
            let url = response.url;
            console.log('Response from: %s', url);
            return url;
        });
});

Promise
    .all(fetchPromises)
    .then(allUrls => {
        console.log('The return values of all requests are passed as an array:');
        console.log(allUrls);
    }).catch(error => {
        console.error('A call failed:');
        console.error(error.message);
    });
```

运行这段代码，你需要有多个请求，但是不能保证他们完成顺序。

## 串行执行
虽然并行执行效率很高，但是有些时候由于某些限制和依赖导致我们不得不做一些串行请求。这个时候我们仍然可以利用Promise。当你知道Promise链所有调用之后，做上面的操作就变得很简单。然而，如果我们动态生成要执行的异步函数，这就变得更复杂啦。

![series](https://www.twilio.com/blog/wp-content/uploads/2016/09/5vTdWZEcbtgpgO-Wg4a7P_BPjeCG0DWjeK4uMsPlUvYgoAx0fASq-NJHwN9n_hjtkzly4zc2D0d3h-Az7PwrN1CiQm0DUCsII2j38mXtewOoYCKMaWGnNjsOPpIIGaiPWbhd4QRR-1.png)

```javascript
const queryParameters = ['ahoy', 'hello', 'hallo'];

let mostRecentPromise = Promise.resolve([]); // start with an immediately resolving promise and an empty list
queryParameters.forEach(queryParam => {
    // chain the promise to the previous one
    mostRecentPromise = mostRecentPromise.then(requestedUrlsSoFar => {
        return fetch('http://httpbin.org/get?${queryParam}')
            .then(response => {
                // parse response body as JSON
                return response.json()
            })
            .then(response => {
                // extract the URL property from the response object
                let url = response.url;
                console.log('Response from: %s', url);
                requestedUrlsSoFar.push(url);
                return requestedUrlsSoFar;
            });
        });
    });

mostRecentPromise.then(allUrls => {
    console.log('The return values of all requests are passed as an array:');
    console.log(allUrls);
}).catch(error => {
    console.error('A call failed:');
    console.error(error.message);
});
```

## 把回调代码转化成Promise
现在我们已经知道怎么利用Promise了，但是我们还有一个问题就是当我们的异步代码不支持Promise的时候，我们该怎么办？这种请求我们可以把代码放到一个新的函数中，并用`new Promise`来包裹他。这个构造函数接收2个参数`resolve`和`reject`，当我们需要同意或者拒绝Promise时使用。

```javascript
const fs = require('fs');

function readFileWithPromise(path) {
    return new Promise((resolve, reject) => {
        fs.readFile(path, 'utf8', (err, content) => {
            if (err) {
                return reject(err);
            }
            return resolve(content);
        });
    });
}

readFileWithPromise('/etc/hosts').then(content => {
    console.log('File content:');
    console.log(content);
}).catch(err => {
    console.error('An error occurred reading this file.');
    console.error(err.message);
});

```

当我们用一个函数作为参数调用`new Promise()`时，这个函数将会马上执行。接着我们执行`fs.readFile`，一旦触发回调我们就会知道`readFile`是否有错，如果有错误则马上`reject`，否则`resolve`这个Promise。


> - 原文链接:[A quick guide to JavaScript Promises](https://www.twilio.com/blog/2016/10/guide-to-javascript-promises.html)
> - 原文作者:[dkundel](https://github.com/dkundel)
> - 译文作者:[shenshaohui1991](https://github.com/shenshaohui1991)
> - 译文地址:[sshfe.com](http://www.sshfe.com)