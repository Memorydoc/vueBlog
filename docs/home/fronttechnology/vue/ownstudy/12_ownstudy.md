---
title: 动态组件&异步组件
---

## keep-alive 
> keep-alive要绑定在动态组件上才有效果
可以包裹在 有**名字**的组件外部，可以缓存当前组件，避免每次切换从新刷新组件内容

## 基本组件
```vue
Vue.component('button-counter', {
  data: function () {
    return {
      count: 0
    }
  },
  template: '<button v-on:click="count++">You clicked me {{ count }} times.</button>'
})
```
## 动态组件
>在使用动态组件的时候，必须要将动态组件全局声明。
组件全局注册
```sh 

```
在<code>src/main.js</code>中写入:
```vue
import upperFirst from 'lodash/upperFirst'
import camelCase from 'lodash/camelCase'

const requireComponent = require.context(
    // 其组件目录的相对路径
    './components/common',//components 下建立common文件夹，存放公共组件
    // 是否查询其子目录
    false,
    // 匹配基础组件文件名的正则表达式
    / *\.(vue|js)/ //匹配以vue结尾的所有组件
)
requireComponent.keys().forEach(fileName => {
  // 获取组件配置
  const componentConfig = requireComponent(fileName)
  // 获取组件的 PascalCase 命名
  const componentName = upperFirst(
      camelCase(
          // 获取和目录深度无关的文件名
          fileName
              .split('/')
              .pop()
              .replace(/\.\w+$/, '')
      )
  )
  // 全局注册组件
  console.log(componentName);
  Vue.component(
      componentName,
      // 如果这个组件选项是通过 `export default` 导出的
      // 那么就会优先使用 `.default`，
      // 否则回退到使用模块的根。
      componentConfig.default || componentConfig
  );
})
```

## 异步组件



* 


