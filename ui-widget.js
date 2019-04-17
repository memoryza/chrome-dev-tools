dev-tools 所有UI的基类 Widget

dev - tools中所有看到js画出来的UI的基类都会继承UI.Widget（派生两个子类， vbox和hbox 主要就是让容器最大高度化还是最大宽度化）
 

Widget 一个widget 实例涵盖 基础的状态
是否是web组件（会决定将css插入到页面还是shadowdom中）
父组件
是否可见
是否是mark（#文档）（没有父元素）
是否布局在界面
是否包含子元素

方法级别

展示组件（触发行为是折叠效果， 每次触发将统计父组件有多少子组件展示 + ）
隐藏组件（ - ）

每次source源码切换的时候会存储所有组件的_scrolltop和left

切换到对应标签再次将_scrolltop 还原回scrolTop