---
title: 边界处理情况
---
## 访问父级组件实例
可以通过$root 和$parent 属性访问根实例，但是这样用不好
::: warning 
在绝大多数情况下，触达父级组件会使得你的应用更难调试和理解，
尤其是当你变更了父级组件的数据的时候。当我们稍后回看那个组件的时候，很难找出那个变更是从哪里发起的。
:::

## 访问子组件实例或子元素
在官方文档上写的不太清晰，

其实就是给子组件设置一个名字

>下面代码是在父组件中
```vue  

 <NameOne ref="name1"></NameOne>
 
 ///
  alert(this.$refs.name2.name );//这里就可以获取子组件的信息
 
```

::: warning 
$refs 只会在组件渲染完成之后生效，并且它们不是响应式的。这仅作为一个用于直接操作子组件的“逃生舱”——你应该避免在模板或计算属性中访问 $refs
:::

## 组件间的依赖注入
白话文的意思就是： 如果你想在子组件中使用父组件的方法，那么可以使用$root或者$parent 但是这种方法并不好，因为$parent只是父目录的第一级
如果是两级那么需要使用$parent.$parent 写起来非常臃肿，$root最好不要经常使用
在这种情况下，可以使用依赖注入方式，它用到了两个新的实例选项：<code>provide</code> 和 <code>inject</code> 
> 在父组件中
```vue  
 methods: {
            showYourName : function(){
                alert(this.name);
            }
        },
        provide : function(){
            return {
                showYourName : this.showYourName
            }
        }
```
>在子组件中(可以直接写在export default{} 中)
```vue  
inject: ['showYourName']
```
>在子组件中使用
在这里就可以直接使用父组件中的showYourName方法，而且作用域和在父组件中使用一模一样，alert出来的name是 父组件的name
```vue  
<button @click="showYourName()">第一个组件的button</button> 
```
:::danger 提示
然而，依赖注入还是有负面影响的。它将你应用程序中的组件与它们当前的组织方式耦合起来，使重构变得更加困难。同时所提供的属性是非响应式的。这是出于设计的考虑，因为使用它们来创建一个中心化规模化的数据跟使用 $root做这件事都是不够好的。如果你想要共享的这个属性是你的应用特有的，而不是通用化的，
或者如果你想在祖先组件中更新所提供的数据，那么这意味着你可能需要换用一个像 Vuex 这样真正的状态管理方案了。
:::

## 程序化的事件侦听器
其实就是一个更好的选择
原本的代码
```vue  
//在组件销毁的时候，触发某内容
beforeDestroy: function () {
  // do something
}
```
使用事件监听器
这种方法更好
```vue  
mounted : function(){
   //通过监听钩子函数触发，
 this.$once('hook:beforeDestroy', function () {
    picker.destroy()
  })
}
```

##  组件之间的相互调用
举个例子： A组件调用B组件，B组件调用A组件

解决方法：
**方法一**
可以在创建A组件之前的钩子函数中 创建B组件
在A组件中<code>A.vue</code>：
```vue  
beforeCreate: function () {
  this.$options.components.TreeFolderContents = require('./B.vue').default
}
```
**方法二**
在本地注册组件的时候，你可以使用 webpack 的异步 import：
```vue  
components: {
  TreeFolderContents: () => import('./B.vue')
}
```
## 内联模板
没有实际意义，写入vue文件中，并不显示，而且增加了组件域的难度。不建议使用

## 通过v-once 实现将组件绑定到Vue全局缓存起来
```js  
Vue.component('terms-of-service', {
  template: `
    <div v-once>
      <h1>Terms of Service</h1>
      ... a lot of static content ...
    </div>
  `
})
```
