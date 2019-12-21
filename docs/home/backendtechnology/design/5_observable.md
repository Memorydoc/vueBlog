---
title: Java自带的观察者模式（监听观察）
---
## 简介
当对象间存在一对多关系时，则使用观察者模式（Observer Pattern）。比如，当一个对象被修改时，则会自动通知它的依赖对象。观察者模式属于行为型模式。
## 案例场景
模拟两种情景： 情景一：通过同步的方式 测试Java 发布通知，订阅者收到通知
情景二 ：通过异步的方式 测试Java 发布通知，订阅者收到通知

:::danger 注意
如果直接通过  notifyObservers 方法发布消息，并不能产生结果，要重写发布器的change方法，这样才会真正发布了
:::
## 继承Observable
``` java 
//Observable 被观察者
public static class MyObservable extends Observable {
    protected synchronized void setChanged() {
        super.setChanged();
    }//标记此 Observable对象为已改变的对象
}
```
## 创建被观察对象
```java 
// Observable observable = new Observable();//java自带的被观察者
MyObservable myObservable1 = new MyObservable();//这里使用自己的被观察者
MyObservable myObservable2 = new MyObservable();//这里使用自己的被观察者
```

## 添加订阅者
```java 
//添加订阅者（添加观察者）
    myObservable1.addObserver(new Observer() {
        @Override
        public void update(Observable o, Object value) {//o 代表发布器， value代表发布器发送的消息
            System.out.println(Thread.currentThread().getName() + value);
        }
    });

//添加订阅者（添加观察者）
myObservable2.addObserver(new Observer() {
    @Override
    public void update(Observable o, Object value) {//o 代表发布器， value代表发布器发送的消息
        System.out.println(Thread.currentThread().getName() + value);
    }
});
```

## 发布通知
```java 
myObservable1.setChanged();
myObservable2.setChanged();
myObservable2.notifyObservers("我醒了");
//发布通知，订阅者被动感知（推模式）
//myObservable.notifyObservers("hello world");
MyThread myThread = new MyThread(myObservable1);
new Thread(myThread).start();
//myObservable1.notifyObservers();
```

## 完整代码
```java 
/**
 * @version 1.0
 * @program: springTest
 * @description: Java自带的观察者模式
 * 如果直接通过  notifyObservers 方法发布消息，并不能产生结果，要重写发布器的change方法，这样才会真正发布了
 * @author: Kevin
 * @create: 2019-06-27 23:10
 **/
public class JdkObserver {

    public static void main(String[] args) {
        // Observable observable = new Observable();//java自带的被观察者
        MyObservable myObservable1 = new MyObservable();//这里使用自己的被观察者
        MyObservable myObservable2 = new MyObservable();//这里使用自己的被观察者

        //添加订阅者（添加观察者）
        myObservable1.addObserver(new Observer() {
            @Override
            public void update(Observable o, Object value) {//o 代表发布器， value代表发布器发送的消息
                System.out.println(Thread.currentThread().getName() + value);
            }
        });

        //添加订阅者（添加观察者）
        myObservable2.addObserver(new Observer() {
            @Override
            public void update(Observable o, Object value) {//o 代表发布器， value代表发布器发送的消息
                System.out.println(Thread.currentThread().getName() + value);
            }
        });//添加订阅者


        myObservable1.setChanged();
        myObservable2.setChanged();
        myObservable2.notifyObservers("我醒了");
        //发布通知，订阅者被动感知（推模式）
        //myObservable.notifyObservers("hello world");
        MyThread myThread = new MyThread(myObservable1);
        new Thread(myThread).start();
        //myObservable1.notifyObservers();

    }

    public static class MyThread implements Runnable {
        private MyObservable myObservable;

        public MyThread(MyObservable myObservable) {
            this.myObservable = myObservable;
        }

        @Override
        public void run() {
            try {
                System.out.println(Thread.currentThread().getName() + "正在睡觉");
                Thread.sleep(1000);
                System.out.println("睡醒了");
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            myObservable.notifyObservers("我醒了");
        }
    }

    //Observable 被观察者
    public static class MyObservable extends Observable {
        protected synchronized void setChanged() {
            super.setChanged();
        }//标记此 Observable对象为已改变的对象
    }
}
```

#### 测试结果
```java 
main我是订阅者二，我醒了
正在睡觉
睡醒了
Thread-0我醒了
```