# 如何本地运行devtools-frontend基础工程

## 运行项目

#### 1、下载源码

[devtools-frontend](https://github.com/ChromeDevTools/devtools-frontend)是chrome devtools工程源码

```
$ git clone git@github.com:ChromeDevTools/devtools-frontend.git 
或者 npm chrome-devtools-frontend
```

#### 2、运行

```text
npm start（npm run chrome + npm run server）
```

在执行启动前先去下载google chrome canary 版本，然后执行npm start，会发现浏览器调用起来了，并且默认打了两个tab\(inspectable pages 和 [chrome devtools](https://developers.google.com/web/tools/chrome-devtools/) \)



![](.gitbook/assets/image%20%281%29.png)



![](.gitbook/assets/image%20%282%29.png)

  然后点击以chrome-devtools://devtools 开始的记录，新建一个tab将地址粘贴进去（切记把chrome devtool这个页面切换到高亮标签\) 你会发现打开连接是白页（当然如果你的设备自带翻墙则直接可以看到devtools的界面了，appshot去下载两个资源[InspectorBackendCommands.js](https://chrome-devtools-frontend.appspot.com/serve_file/@adc0e9be5563cee7dc975f4d3ae866098431fed7/InspectorBackendCommands.js%20)和[SupportedCSSProperties.js](https://chrome-devtools-frontend.appspot.com/serve_file/@e1460b684f881cc439e22e345cac8e319fedc8c1/SupportedCSSProperties.js)）。 仔细看资源请求过程中只有这两个资源无法加载，当运行server会把本地如下代码中的资源直接转到远程上的一个地址

```text
// scripts/hosted_mode/server.js

var proxyFilePathToURL = {
  '/front_end/SupportedCSSProperties.js': cloudURL.bind(null, 'SupportedCSSProperties.js'),
  '/front_end/InspectorBackendCommands.js': cloudURL.bind(null, 'InspectorBackendCommands.js'),
  '/favicon.ico': () => 'https://chrome-devtools-frontend.appspot.com/favicon.ico',
  '/front_end/accessibility/ARIAProperties.js': cloudURL.bind(null, 'accessibility/ARIAProperties.js'),
};

function cloudURL(path, commitHash) {
  console.log(111,`https://chrome-devtools-frontend.appspot.com/serve_file/@${commitHash}/${path}`)
  return `https://chrome-devtools-frontend.appspot.com/serve_file/@${commitHash}/${path}`;
}
```



{% hint style="info" %}
这个资源是拿localhost:9222/json/version 返回的chrome每次发版的hash版本拼接的，可以直接把这两个资源地址打印出来然后（翻墙）访问一下看看是不是404，过一会在重新启动界面可以出来，如果是404 就download上边的两个资源放到front\_end根目录，然后注释掉这个中转再次启动
{% endhint %}

#### 3、调整运行方式

```
1、可以本地启动webserver然后将跟指定到dev-tools根目录，然后直接访问本地端口+路径，
   然后单独运行npm  run chrome
2、本地run server 去掉中转本地资源，然后 本地运行即可
```

![](.gitbook/assets/image%20%283%29.png)

