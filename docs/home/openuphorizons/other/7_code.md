---
title: 怎样编写优雅的代码
---
##  构造器参数太多怎么办？
使用建造者模式 [建造者模式创建对象](../../backendtechnology/design/15_builder.md)

## 不需要实例化的类，将构造器私有
## 不要创建不必要的对象

```java 
public class LongAndlongTest {
    public static void main(String[] args) {
        long start = System.currentTimeMillis();
        long sum = 0;
        for(int i = 0; i<Integer.MAX_VALUE;i++){
            sum = sum + i;
        }
        long xiaohao = System.currentTimeMillis() - start;
        System.out.println("消耗：" + xiaohao);
    }
}

```

## 避免使用 终止方法


## 使用类和成员可访问性最小化

能用私有方法的尽量使用私有方法， 这样让自己内部对外不可见， 对外只暴露接口和公共方法， 内部怎么玩是自己的事

## 使可变性最小化
类不可变，就不用考虑线程安全的问题，可以设置成final， 也可以不提供成员变量的 设置方法， 即不提供set方法或者其他的方法，
声明了final 的属性，将会保存在常量池中。

* 可以使用写时复制， 就是在 类对象 修改或者获取的时候， 创建出来一个新的 ，而不是修改原本的对象

## 优先使用复合 **胜过** 继承
在编写一个业务的时候，可以模仿JDK源码的方式， 声明一个 接口类， 在声明一个 抽象骨架类， 具体的实现类 实现接口类， 集成骨架类 这样设计

## 返回零长度的数组和集合 

返回零长度的数组和集合 ,最好不要返回null， 使用Collections.EMYTY_LIST  比较好


## 优先使用标准的异常