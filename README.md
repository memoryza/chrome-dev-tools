---
description: >-
  devtools集成到web系统中进行远程真机调试，顺带分析项目如何运行、原理以及如何开发一个插件（项目需求需要将它集成到web系统中，虽然工程集成进来了，但抱着好奇的心，熟悉一下部分源码和运行原理）
---

# ChromeDevTools/devtools-frontend

        身为一个前端开发者对于chrome 的devtools并不陌生，它在我们日常的开发中扮演着很重要的角色，我们用来完成网页开发、调试、性能优化以及从插件市场中安装各种提升效率的插件，对于神奇的工具大多数时间我们是使用它，对于它的怎么实现的？身为前端开发接触过chrome插件，接触过devtools的插件（这里有一个比较全的[例子](https://memoryza.gitbook.io/chromedevtools-devtools-frontend/~/edit/drafts/-LaDuOKgYJjMYnjqBTSg/)），但devtools本身怎么实现的？如何运行的（不会是一坨cpp吧），前端同学能不能介入呢？答案是devtools在chrome源码是独立的[模块](https://docs.google.com/document/d/1WNF-KqRSzPLUUfZqQG5AFeU_Ll8TfWYcJasa_XGf7ro/view#heading=h.8pmor7vpbvt2)，它是由js代码写出来的。

不废话了,项目工程在[这里](https://github.com/ChromeDevTools/devtools-frontend) ，接下来将说如何运行起来，并且逐步分析它的运行机制





