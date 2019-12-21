---
title: 组件之间的合并（混入）
---
::: tip 提示
所谓的混入，其实就是你可以将组件中公共的部分抽离出来，方便别的组件公用，一个混入对象可以包含任意的组件选项（created、methods、mounted... 等等）
所有选项都可以混入到目标组件中充当其真正的组件
:::

下面一个例子： 
> 在这个例子中 A对象被混入组件中。 和在组件中直接写data(){} 方法一模一样。
**混入的好处: 可以组件公共的方法选项提出来公用**
```js  
//混入对象A
    var A = {
        data() {
            return {
                currentTabComponent: 'NameTwo',
                sizegang: '司泽刚',
                name: "哈哈哈啊，这是测试数据helloworl2112d"
            }
        }
    };
    export default {
        name: 'HelloWorld',
        components: {
            NameTwo, NameOne,
        },
        mixins: [A],
        props: {
            msg: String
        }.... //下面的内容就不写了
```

> 还可以创建基于A对象组件项内容的组件对象
```js  
var Component = Vue.extend({
  mixins: [A]
})
```
## 选项合并
::: tip 
就是说: 如果在合并的时候，选项重复了，在 A中有（基于上面的例子），在组件中也有。此时
1.如果冲突选项是钩子函数 ：将合并为一个数组，因此都将被调用。另外，混入对象的钩子将在组件自身钩子**之前**调用。
2.如果冲突选项是对象例如： methods、components 和 directives，将被合并为同一个对象。两个对象键名冲突时，取组件对象的键值对。
:::
> 注意：Vue.extend() 也使用同样的策略进行合并。

## 全局混入
   混入也可以进行全局注册。使用时格外小心！一旦使用全局混入，它将影响每一个之后创建的 Vue 实例。使用恰当时，这可以用来为自定义选项注入处理逻辑。
   
   // 为自定义的选项 'myOption' 注入一个处理器。
   Vue.mixin({
     created: function () {
       var myOption = this.$options.myOption
       if (myOption) {
         console.log(myOption)
       }
     }
   })
   
   new Vue({
     myOption: 'hello!'
   })
   // => "hello!"
  ::: danger 注意
   请谨慎使用全局混入，因为它会影响每个单独创建的 Vue 实例 (包括第三方组件)。大多数情况下，只应当应用于自定义选项，就像上面示例一样。
     推荐将其作为插件发布，以避免重复应用混入。
  :::
  
  ## 自定义选项合并策略
  [自定义选项合并策略](https://cn.vuejs.org/v2/guide/mixins.html)



