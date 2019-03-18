---
description: 初始化项目会实例化以下几个类 Runtime Runtime.Module Runtime.Extension
---

# 项目代码运行原理



以下以devtools\_app.html 页面为例分析dev-tools初始化流程

![](.gitbook/assets/image%20%284%29.png)

项目是访问静态网页重点加载runtime.js、devtools\_app.js

代码内容仅仅包含（静态方法）Runtime.startApplication\('devtools\_app'\)

#### startApplication 主要做了什么？

1、优先从全局全局描述符（allDescriptors）遍历出来name =&gt; 模块描述的对象

2、如果找不到当前当前应用的描述对象\(applicationDescriptor\)，则加载“应用名”.json，加载方式采用xmlrequest 请求当前目录下的xxx.json

3、解析devtools\_app.json并赋值给descriptor ,找到extends扩展名称的，有则while一直递归加载所有依赖\(例如依赖\)，并合并到 applicationDescriptor的modules，如果没有则直接下一步\(这一步加载 devtools\_app extends联调的json文件）

```text
   shell.json 对象: {
       modules: {
           name: 模块名称，具体模块信息在下面的module.json中
           type: autostart（核心模块，程序加载自动运行）| remote（来自远程的模块）
       }
   }
```

4、遍历modules，加载根据name（当前目录的文件夹名）/module.json,注意加载所需的文件，如果描述符中type=autostart则放到核心模块列表中最终形成一个模块列表，模块信息对象如下（这一步是把整个devtools\_app 依赖的模块文件对应的json文件加载并组织了整个模块列表）

```text
    ##module.json 对象:{      
          condition: 条件
        dependencies: 依赖模块，这些都是在json中配置的
        extensions: 扩展基础信息数组,每一项是如下的extensions对象
        name: 模块名称
        remote: 是否来自远程( 'type' === 'remote')
        resources: css资源列表
        scripts: 模块需要的js
    }
    extensions对象: {
      "type": "@UI.ToolbarItem.Provider",
      "className": "ConsoleCounters.WarningErrorCounter",
      "order": 顺序,
      "location": "main-toolbar-right"
    }
```

5、new runtime的实例

```text
    1) 实例属性（Runtime实例）：
        Runtime对象:{
            _modules  所有模块cache的数组，每个是Runtime.Module 的实例（Runtime.Module 实例属性_manager 反向映射到 runtime的实例）
              _modulesMap 名字对module实例的对象 
              _extensions 整个Runtime实例所需的扩展（具体内容来自于module实例化push进来的） 
              _cachedTypeClasses
              _descriptorsMap 
          }

     2) 拿到4所有的模块列表进行注册（其实就是实例化，每一个模块实例化都会new extension的实例，然后push到Runtime对象里，并给一份给自己的实例）
            Runtime.Module 对象: {
                    _manager : Runtime的实例对象
                    _descriptor: 模块的基础信息(4)
                    _name: 模块名称
                    _extensions 模块自己需要的扩展
                    _extensionsByClassName 
                    _loadedForTest 
            }
         3) Runtime.Module 实例每一个Runtime.Extension 

             Runtime.Extension对象: {
                 _module: Runtime.Module的实例对象（额 还真喜欢把this一层一层的传下去啊）
                 _descriptor: 模块的基础信息(4)中的extensions的描述信息（这个名字起得跟module里的_descriptor很有歧义）
                 _type: 来自于extensions 对象中的type
                 _hasTypeClass: （this._type.charAt(0) === '@'）
                 _className: 来自于extensions 对象中的className
                 _factoryName: 来自于extensions 对象中的factoryName

             }
```

6、上一步已经将所有模块以及模块下的扩展都已经建立好对象关联关系，还没有任何加载对应脚本的代码，接下来优先加载核心模块\(例如\["bindings", "common", "components", "console\_counters", "dom\_extension", "extensions", "host", "main", "persistence", "platform", "product\_registry", "protocol", "sdk", "browser\_sdk", "services", "text\_utils", "ui", "workspace", "emulation", "inspector\_main", "mobile\_throttling"\]\)，先从this.\_modulesMap中调用name to modules的实例方法\_loadPromise 这个方法会加载需要的模块。并从runtime实例中的\_modulesMap属性去取当前模块的信息（其实每一个模块都是加载模块的js和css，资源路径是:根/moduleName/resourcesName，模块本身只是信息存储），加载之前会优先把该模块所有依赖模块放到promise中 然后promise.all\(依赖模块\).then\(this.\_loadResources.bind\(this\)\) .then\(this.\_loadScripts.bind\(this\)\) 然后每一个模块本身又\_loadPromise 去加载依赖的依赖（加载之前有一个判断返回\_pendingLoadPromise，如果这个模块已经在加载队列则不需要循环调用） 注: \_loadScripts 比较特别，会判断是否是远程模块，来自\(2\)中于shell.json中的type, 最终执行回来的代码片段

7、到此dev-tools Runtime实例已经建立完成，它主要完成runtime上挂载modules实例，modules 挂载 extensions 实例，但这里没有说明到底那步开始正式执行devtools的组织和渲染

其实在6的步骤中加载了一个 main的核心模块，这个模块加载完成成后立即执行Main.Main\(\); 然后执行\_appStartedPromise, 将fulfil 返回回来并且 startApplication 最后一步执行\_appStartedPromiseCallback\(\)

