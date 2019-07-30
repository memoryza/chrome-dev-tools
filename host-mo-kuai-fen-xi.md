---
description: front_end 中每一个文件夹就是一个模块，例如host模块路径是/front_end/host/
---

# host模块分析

#### 1、Platform

Platform 这个文件像全局Host对象挂了一堆静态方法，涵盖机器平台、字体，为了防止反复走函数调用和判断逻辑，对应函数一旦调用会后都会向Host挂载一个\_${method}的变量 , 例如下面的例子



{% code-tabs %}
{% code-tabs-item title="/front\_end/host/Platform.js" %}
```text
// 获取系统 isMac|isWin 判断是那个系统 
Host.platform = function() {
  if (!Host._platform)
    Host._platform = InspectorFrontendHost.platform(); // 这里是用ua判断的
  return Host._platform;
};
/**
 * @return {boolean}
 * @desc 判断是否是devtools的页面
 */
Host.isCustomDevtoolsFrontend = function() {
  if (typeof Host._isCustomDevtoolsFronend === 'undefined')
    Host._isCustomDevtoolsFronend = window.location.toString().startsWith('chrome-devtools://devtools/custom/');
  return Host._isCustomDevtoolsFronend;
};
/**
 * @return {string}
 * @func 获取系统字体
 */
Host.fontFamily = function() {
  if (Host._fontFamily)
    return Host._fontFamily;
  switch (Host.platform()) {
    case 'linux':
      Host._fontFamily = 'Roboto, Ubuntu, Arial, sans-serif';
      break;
    case 'mac':
      Host._fontFamily = '\'Lucida Grande\', sans-serif';
      break;
    case 'windows':
      Host._fontFamily = '\'Segoe UI\', Tahoma, sans-serif';
      break;
  }
  return Host._fontFamily;
};
```
{% endcode-tabs-item %}
{% endcode-tabs %}

#### 2、InspectorFrontendHost

将InspectorFrontendHostStub 和 InspectorFrontendAPIImpl类挂载到Host下，向全局抛出InspectorFrontendHost的实例\(new Host.InspectorFrontendHostStub\(\)\)

* **InspectorFrontendHost 类**

       constructor中定义keydown 当按按下Ctrl+/Ctrl- 的时候阻止冒泡，实例方法包含获取平台、devtools右键save相关，判断被调试的页面时候在前台，以及更改tab标题、copy文本、新开窗口以及需要保存到ls相关操作的函数，当然也包含一些空方法和写死返回的方法，不一一说明了，具体方法和说明

![](.gitbook/assets/image%20%286%29.png)

* **InspectorFrontendAPIImpl 类**

todo

  



