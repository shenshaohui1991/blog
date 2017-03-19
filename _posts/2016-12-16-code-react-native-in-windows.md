---
layout: post
title: '在Windows下开发ReactNative程序'
date: 2016-12-16
author: SSH
categories: [ReactNative]
tags: [ReactNative]
excerpt: 本文教你如何在windows上搭建ReactNative环境，步骤很简单，只要网速够快就可以啦。。
---

## 安装依赖
需要的依赖:

+ node.js
+ python2
+ ReactNative
+ JDK
+ Android SDK

### node.js && python2
可以通过[chocolate](https://chocolatey.org/)来安装node.js和python

```javascript
choco install nodejs.install
choco install python2
```

### 安装JDK
下载一个JDK，直接下一步下一步，安装完成之后，在系统变量中添加`JAVA_HOME`，具体步骤可以参考[安装说明](http://jingyan.baidu.com/article/6dad5075d1dc40a123e36ea3.html)

### 安装Android SDK
提供一个带AndroidSDK的Android Studio的[下载地址](https://dl.google.com/dl/android/studio/install/2.2.2.0/android-studio-bundle-145.3360264-windows.exe)，安装过程也是下一步下一步，需要注意的是你需要下载Android6.0版本

### 初始化ReactNative工程
首先需要下载`react-native-cli`

```javascript
npm install -g react-native-cli
```

初始化过程一般比较久，大概十分钟左右，需要下载很多依赖

```javascript
react-native init ReactNativeDemo
```

### 运行第一个ReactNative程序

```javascript
react-native run-android
```

可以通过访问`http://localhost:8081/index.android.bundle?platform=android`检查是否启动成功或者直接在手机上查看程序

***注意***:对于小米手机需要做一下操作
+ 打开开发者模式
+ 打开USB调试
+ ***关闭MIUI优化***
+ ***允许悬浮窗***，禁用可能导致出现长时间白屏

运行项目可能遇到的BUG：

```javascript
SyntaxError: Strict mode does not allow function declarations in a lexically nested statement on a newly created app
```

这个问题具体原因可以参考[Issue](https://github.com/facebook/react-native/issues/11389)，提供一个简单的修复方法，找到项目目录下`\node_modules\react-native\Libraries\Core\InitializeCore.js`的112行修改函数的定义方式，然后执行`npm start --reset-cache`

```javascript
var handleError = function(e, isFatal)
```

### Hello World

修改`index.android.js`文件，ReactNative全面支持ES6的语法，在改的时候完全不需要担心是否支持的问题

```javascript
import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';

export default class ReactNativeDemo extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
            Hello World!
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },

  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  }
});

AppRegistry.registerComponent('ReactNativeDemo', () => ReactNativeDemo);

```