---
title: 自己实现观察者模式（监听观察）
---
## 简介
当对象间存在一对多关系时，则使用观察者模式（Observer Pattern）。比如，当一个对象被修改时，则会自动通知它的依赖对象。观察者模式属于行为型模式。

## 案例场景
模拟 张三， 李四，王五三个人都关注了 同一个微信公众号，微信公众号发表文章，这三个人都会受到 发表的文章。 相当于服务端推送的过程

## 观察者接口<code>Observer</code>
观察者都应该有一个 更新自己状态信息的动作(<code>update</code>)，面向接口编程，设计<code>Observer</code>（观察者）接口  
```java  
/**
 * 观察者接口
 * 定义了一个update()方法，当被观察者通知时，观察者的update()方法会被调用
 */
public interface Observer {
    public void update(String message);
}
```
## 被观察者接口<code>Observerable</code>
被观察者应该 拥有三个方法
* 添加（注册观察者的方法）
* 删除观察者的方法
* 通知当前注册的所有观察者的方法。推送通知，主动调用观察者的update方法
```java 
/**
 * 被观察接口
 * 模拟微信公众号，他是一个被观察的接口
 * 声明添加、删除、通知观察者的方法
 */
public interface Observerable {
    //添加（注册）观察者的方法
    public void registerObserver(Observer o);

    //删除观察者的方法
    public void removeObserver(Observer o);

    //通知观察者开始观察的方法
    public void notifyObserver();
}
```
## 具体的观察者
应该具有自己的状态信息和 需要从被被观察者那里 获取的信息属性（<code>message</code>）
```java  
public class User implements  Observer {
    private String name;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    private String message;//用户自己接收到的信息（微信公众号推送过来的信息）

    public void update(String message) {
        this.message = message;
        read();
    }
    public void read(){
        System.out.println(this.name + "获取到了" + this.message);
    }

    public User(String name) {
        this.name = name;
    }
}
```

## 具体的被观察者
根据不同的业务场景进行具体的实现
```java 
package com.design.observer;
import java.util.ArrayList;
import java.util.List;

//微信服务 实现被观察者接口，同时需要具有一个List集合，用来保存注册的观察者。等需要通知观察者的时候，便利集合
public class WechatServer implements  Observerable {
    private List<Observer> observerList = new ArrayList<Observer>(); //注意到这个List集合的泛型参数为Observer接口，设计原则：面向接口编程而不是面向实现编程
    private String message; //这是被观察者的被观察对象，这里只是简单的模拟微信公众号一篇文章
    public void registerObserver(Observer o) {
        observerList.add(o);
    }

    public void removeObserver(Observer o) {
        observerList.remove(o);
    }
    //通知观察者及时获取信息
    public void notifyObserver() {
        for(int i = 0; i < observerList.size(); i++){
            observerList.get(i).update(message);
        }
    }

    //被观察者开始加工需要告诉观察者的信息
    public void machining(String mes){//这里只是加工了一个字符串（在微信中相当于一篇文章）
        this.message = mes;
    }

}
```
## 测试
```java 
public class TestMain {

    public static void main(String[] args) {
        User zhangsan = new User("张三");
        User lisi  = new User("李四");
        User wangwu = new User("王五");
        //------------------------------------------以上三个对象都是观察者，观察微信公众号推送文章
        //开始构建微信公众号（被观察者）,并且将三个观察者注册到被观察者中（相当于三个用户关注了同一个微信公众号）
        WechatServer wechatServer = new WechatServer();
        wechatServer.registerObserver(zhangsan);
        wechatServer.registerObserver(lisi);
        wechatServer.registerObserver(wangwu);
        //模拟微信公众号推送一片文章（在这之前要先加工一片文章）
        wechatServer.machining("床前明月光，疑是地上霜，举头望明月，低头思故乡");
        wechatServer.notifyObserver();//开始推送文章
        //--------------------------------------------------------------
        System.out.println("--------------------------------------------");
        //模拟用户取消关注微信公众号
        wechatServer.removeObserver(zhangsan);
        System.out.println("张三取消关注微信公众号");
        wechatServer.notifyObserver();
    }
}
```
### 测试结果
```sh 
张三获取到了床前明月光，疑是地上霜，举头望明月，低头思故乡
李四获取到了床前明月光，疑是地上霜，举头望明月，低头思故乡
王五获取到了床前明月光，疑是地上霜，举头望明月，低头思故乡
--------------------------------------------
张三取消关注微信公众号
李四获取到了床前明月光，疑是地上霜，举头望明月，低头思故乡
王五获取到了床前明月光，疑是地上霜，举头望明月，低头思故乡
```



