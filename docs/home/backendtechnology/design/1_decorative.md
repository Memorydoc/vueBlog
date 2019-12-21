---
title: 装饰器模式（功能扩展、可以解决继承弊端）
---
## 简介
饰器模式（Decorator Pattern）允许向一个现有的对象添加新的功能，同时又不改变其结构。这种类型的设计模式属于结构型模式，它是作为现有的类的一个包装。
这种模式创建了一个装饰类，用来包装原有的类，并在保持类方法签名完整性的前提下，提供了额外的功能。
我们通过下面的实例来演示装饰器模式的用法。其中，我们将把一个形状装饰上不同的颜色，同时又不改变形状类。

## 案例场景
当前有一辆车，主人想去店里花钱**换**一辆会飞的车（当然这里不可能实现,也不是不可能，要相信Nothing is impossible）
即在原来的类的基础之上 增加功能，**但是会替换之前的类**。

## 核心原理
*** tip 
通过java多态的特性，避开多次继承带来代码侵入的弊端，使代码**横向扩展**，而不是纵向耦合
***

根深蒂固，Java面向接口编程易扩展、易维护
## 车接口（Icar）
```java 

/**
 * @version 1.0
 * @program: springTest
 * @description: 装饰模式，车接口 抽象组件
 * @author: Kevin
 * @create: 2019-06-05 00:31
 **/

public interface Icar {
    void move();
}

```
## 被装饰角色(Car)
```java 
/**
 * @version 1.0
 * @program:    装饰模式
 * @description: 要被装饰的类
 * @author: Kevin
 * @create: 2019-06-05 00:33
 **/
public class Car implements  Icar {

    public void move() {
        System.out.println("我是陆地奔跑的车");
    }

}
```
## 装饰器（DecorativeCar）
```java 
 /**
  * @version 1.0
  * @program: springTest
  * @description: 装饰角色   (持有一个构建对象的实例，并定义一个与抽象构件接口一致的接口)
  * @author: Kevin
  * @create: 2019-06-05 00:34
  **/
 public class DecorativeCar implements  Icar {
     private Icar icar;
     public DecorativeCar(Icar icar) {
         this.icar = icar;
     }
     public void move() {
         icar.move();
     }
 }
 ```
 
 ## 最终想要的装饰后角色（FlyCar）
 ```java  
 /**
  * @version 1.0
  * @program: springTest
  * @description: 具体装饰角色
  * @author: Kevin
  * @create: 2019-06-05 00:35
  **/
 public class FlyCar extends DecorativeCar {
 
     public FlyCar(Icar icar) {
         super(icar);
     }
     public void move(){
         super.move();
         System.out.println("我是会飞的车");
     }
 }

 ```
 ## 测试
 ```java 
 public class Test {
     public static void main(String[] args) {
         Car car =  new Car();
         FlyCar flyCar = new FlyCar(car);
         flyCar.move();
     }
 }
 ```
 #### 测试结果
 ```sh 
 我是陆地奔跑的车
 我是会飞的车

 ```
 >通过Car对象扩展出了 FlyCar ，但是 对Car本身和自带关系没有任何改变
 
 ## 总结
 
 没有通过对<code>Car</code> 进行继承，减少继承带来的代码耦合和代码侵入的危害。
 不要认为继承可以替代装饰器模式，装饰器模式的诞生就是为了避开继承的危害，解决继承。通过另外的方式实现 从继承得来的效益