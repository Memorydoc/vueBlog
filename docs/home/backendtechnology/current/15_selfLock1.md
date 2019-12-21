---
title: 通过lock 手写阻塞队列
---
#### 通过lock 手写阻塞队列
```java 
package com.current.HandQueue;

import java.util.LinkedList;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.LinkedBlockingDeque;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * @version 1.0
 * @program: 通过lock 手写阻塞队列
 *
 * notifyAll() 不能换成 notify()，因为如果换成this.notify()函数，此时只唤醒一个线程，假设这样一种状态，
 * 消费者线程消费了最后一个元素后，容器为空，此时消费者线程本打算唤醒生产者线程，结果却唤醒了消费者线程，
 * 消费者线程在执行了while(lists.size()==0)中的this.wait()方法后进入阻塞状态，此时被唤醒的消费者线程也进入阻塞状态，程序死锁。
 *
 * @description:
 * @author: Kevin
 * @create: 2019-07-03 16:56
 **/
public class LockQueueByHand {
    //元素集合
    private LinkedList<Object> list=new LinkedList<Object>();
    //计数器(同步),判断集合元素数量
    private AtomicInteger count=new AtomicInteger();
    //集合上限与下限,final必须指定初值
    private final int minSize=0;
    private final int maxSize;
    //构造器指定最大值
    public LockQueueByHand(int maxSize) {
        this.maxSize = maxSize;
    }

    //初始化对象,用于加锁,也可直接用this
    private Object lock=new Object();
    //put方法:往集合中添加元素,如果集合元素已满,则此线程阻塞,直到有空间再继续
    public void put(Object obj){
        synchronized (lock) {
            while(count.get()==this.maxSize){
                try {
                    lock.wait();
                } catch (InterruptedException e) {
                    e.printStackTrace();}
            }
            list.add(obj);
            //计数器加一
            count.incrementAndGet();
            System.out.println("放入元素:"+obj);
            //唤醒另一个线程,(处理极端情况:集合一开始就是空,此时take线程会一直等待)
            lock.notifyAll();
        }
    }
    //take方法:从元素中取数据,如果集合为空,则线程阻塞,直到集合不为空再继续
    public Object take(){
        Object result=null;
        synchronized(lock){
            while(count.get()==this.minSize){
                try {
                    lock.wait();
                } catch (InterruptedException e) {
                    e.printStackTrace();}
            }
            //移除第一个
            result=list.removeFirst();
            //计数器减一
            count.decrementAndGet();
            System.out.println(Thread.currentThread().getName() + "拿走元素:"+result);
            //唤醒另一个线程,(处理极端情况:集合一开始就是满的,此时put线程会一直等待)
            lock.notifyAll();
        }
        return result;
    }
    public static void main(String[] args) {
        LockQueueByHand lockQueueByHand = new LockQueueByHand(3);

        Thread thread1 = new Thread(() -> {
            for (int i = 0; i < 100; i++) {
                lockQueueByHand.put(i);
            }
        });
      /*  Thread thread2 = new Thread(() -> {
            for (int i = 0; i < 100; i++) {
                lockQueueByHand.take();
            }
        });
        Thread thread3 = new Thread(() -> {
            for (int i = 0; i < 100; i++) {
                lockQueueByHand.take();
            }
        });
*/
        thread1.start();
        ThreadPoolExecutor threadPoolExecutor = new ThreadPoolExecutor(100, 200, 60 * 1000, TimeUnit.SECONDS, new LinkedBlockingDeque());
        for (int i = 0; i <=100; i++) {
            Runnable r = new Runnable() {
                @Override
                public void run() {
                    lockQueueByHand.take();
                }
            };
            threadPoolExecutor.execute(r);
        }

        //thread2.start();
        //thread3.start();

    }

}

```