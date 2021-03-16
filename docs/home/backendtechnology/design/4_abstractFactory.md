---
title: 抽象工厂（解耦工厂）
---
## 简介
抽象工厂模式（Abstract Factory Pattern）是围绕一个超级工厂创建其他工厂。该超级工厂又称为其他工厂的工厂。这种类型的设计模式属于创建型模式，它提供了一种创建对象的最佳方式。
在抽象工厂模式中，接口是负责创建一个相关对象的工厂，不需要显式指定它们的类。每个生成的工厂都能按照工厂模式提供对象

## 案例场景
在简单工厂的基础上，如果你没有阅读 简单工厂的相关内容，我们推荐你阅读以下[简单工厂模式](./3_simpleFactory.md)
场景和简单工厂场景一样

## 类的工厂
```java 
public class AudiFactory extends   AbstractFactory {

    public Car getCar() {
        return new Audi();
    }
}
-------------------------------------------------
public class BenciFactory extends AbstractFactory {

    public Car getCar() {
        return  new Benci();

    }
}
------------------------------------------------
public class BWMFactory extends AbstractFactory {

    public Car getCar() {
        return new BWM();
    }
}

```
## 抽象工厂

```java 
package com.design.Factory.abstrfactory;
import com.design.Factory.Car;
//抽象工程模式
public abstract  class  AbstractFactory {
    abstract Car getCar();
    public Car getCar(String carType) throws Exception {
        if(carType.equals("benci")){
            return  new BenciFactory().getCar();
        }else if(carType.equals("bwm")){
            return  new BWMFactory().getCar();
        }else if(carType.equals("audi")){
            return  new AudiFactory().getCar();
        }else {
            throw  new Exception("没有该类型的车");
        }
    }
}

```
## 默认工厂
这也是Spring框架的一种设计模式，如果没有传递具体想要制造什么样的 对象，那么就提供一个默认工厂对外开放

```java 
public class DefaultFactory extends AbstractFactory {
    AudiFactory audiFactory = new AudiFactory();

    Car getCar() {
        return audiFactory.getCar();
    }

    public Car getCar(String carType) throws Exception {
        //使用父类的方法
        return super.getCar(carType);
    }
}
```
::: tip
  abstract 抽象类 有一个特点就是统一、共用的方法 编写在抽象类中，想让子类集成实现的 声明为abstract类型，这样子类通过继承就可以实现自己的自定义方法了
:::

## 测试
结果和 简单工厂实现同样的功能，但是可以降低代码耦合度
```java 
public class AbsTest {
    public static void main(String[] args) {
        DefaultFactory factory = new DefaultFactory();
        try {
            Car benci = factory.getCar("bwm");
            benci.getCarType();
        } catch (Exception e) {
            e.printStackTrace();
        }

    }
}
```





