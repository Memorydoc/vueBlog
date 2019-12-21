---
title: 简单工厂模式
---
## 简介
工厂模式（Factory Pattern）是 Java 中最常用的设计模式之一。这种类型的设计模式属于创建型模式，它提供了一种创建对象的最佳方式。
在工厂模式中，我们在创建对象时不会对客户端暴露创建逻辑，并且是通过使用一个共同的接口来指向新创建的对象。

## 案例场景
想创造一个工厂，既可以 造奥迪车， 有可以制造奔驰车，又可以制造宝马车。 正常情况下，这三种车 是来自不同的厂商

::: tip 小提示
这种制造方式并不好。不过还是需要你了解的，如果你不想了解或者你已经了解，可以继续阅读 [抽象工厂](./4_abstractFactory.md)
:::

## 汽车统一接口(Car)
```java 
public interface Car {
     String name = null;
     public void getCarType();
}
```
## 奥迪车
```java 
public class Audi implements Car {
    private String name;
    public void getCarType(){
        System.out.println("我是一辆奥迪车");
    }
}
``` 
## 奔驰车
```java 
public class Benci implements  Car {
    private String name;
    public void getCarType(){
        System.out.println("我是一辆奔驰车");
    }
}
```
## 宝马车
```java 

public class BWM  implements  Car{
    private String name;
    public void getCarType(){
        System.out.println("我是一辆宝马车");
    }
}
```

## 简单工厂
```java 
public class SimpleFactory {
    public Car getCar(String carType){
        if(carType  == null){
            return  new BWM();
        }
        if(carType.equals("bwm")){
            return  new BWM();
        }
        if(carType.equals("audi")){
            return  new Audi();
        }
        if(carType.equals("benci")){
            return  new Benci();
        }
        return null;
    }
}
```

## 测试
```java 
public class SimpleTest {
    public static void main(String[] args) {
        SimpleFactory simpleFactory = new SimpleFactory();
        simpleFactory.getCar("benci").getCarType();;
    }
}
```
 #### 测试结果
```sh 
我是一辆奔驰车
```
## 总结
简单工程模式中创建车的过程已经冗杂在工厂中，不利于维护，应该想法把制造的过程解耦到不同的工厂中
可以设置一个统一的工厂类（抽象工厂方法）这样就可以把整个项目中的所有需要工厂生产的对象统一分被到相对应的工厂中，便于自己维护自己的生产对象