---
title: 自定义指令
---
## 注册全局自定义指令
* 编写指令

```js  
// 注册一个全局自定义指令 `v-focus`
module.exports = {
    // 当被绑定的元素插入到 DOM 中时……
    inserted: function(el){
        el.focus();
    }
}
```
::: tip 一个指令定义对象可以提供如下几个**钩子函数** (均为可选)： 
* bind：只调用一次，指令第一次绑定到元素时调用。在这里可以进行一次性的初始化设置。
* inserted：被绑定元素插入父节点时调用 (仅保证父节点存在，但不一定已被插入文档中)。
* update：所在组件的 VNode 更新时调用，但是可能发生在其子 VNode 更新之前。指令的值可能发生了改变，也可能没有。但是你可以通过比较更新前后的值来忽略不必要的模板更新 (详细的钩子函数参数见下)。
* 我们会在稍后讨论渲染函数时介绍更多 VNodes 的细节。
* componentUpdated：指令所在组件的 VNode 及其子 VNode 全部更新后调用。
* unbind：只调用一次，指令与元素解绑时调用。
:::

* 在main.js中注册全局指令
```js  
import focus from './directives/commons/focus';
//注册全局指令
Vue.directive('focus',focus);
```
* 使用自定义全局指令
```js  
<input type="text" v-focus  value ="这是自定义指令">
```

## 注册局部指令
> vue 提供了一个<code>directives</code>选项

```js  
directives: {
  focus: {
    // 指令的定义
    inserted: function (el) {
      el.focus()
    }
  }
}
```

[其余的教程内容参考文档](https://cn.vuejs.org/v2/guide/custom-directive.html) 从钩子函数接着浏览