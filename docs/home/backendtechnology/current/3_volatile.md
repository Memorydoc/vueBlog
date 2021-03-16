---
title: volatile(内存可见)
---

## volatile作用
>使用volatile关键字，会让所有线程都会读到变量的修改值
在下面的代码中， running是存在于堆内存的t对象中，当线程t1开始运行的时候，会把running的值读到t1线程的工作区（统称为工作区，可以说是cpu，缓存一系列）
在运行过程中，直接使用这个copy之后的值，不会每次都去主存中读取（堆内存）。这样，当主线程修改了runnning的值后，t1感知不到变化。所以不会停止原型

>**使用volatile关键字将会强制所有线程都去堆内存中读取running的值** 

```java
    public class T{
        public volatile boolean running = true;
    
        void m(){
            System.out.println("m start");
    
            while(running){
    
            }
            System.out.println("m end");
        }
    
        public static void main(String[] args) {
            T t = new T();
            new Thread(t:: m).start();
            try {
                TimeUnit.SECONDS.sleep(2);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            t.running = false;
        }
    }

```




*volatile并不能保证多线程共同修改running变量带来的不一致性。也就是说volatile 并不能代替synchronized，只能保证可见性，不能保证一致性*

## volatile原理
volatile 能告诉所有线程，被标注了volatile关键字的属性是否刷新，如果刷新则告诉并且是所有线程重新去主存中获取新的属性值


