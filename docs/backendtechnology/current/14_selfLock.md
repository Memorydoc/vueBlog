---
title: 自己实现锁
---
## CAS实现锁
```java  
/**
 * @version 1.0
 * @description: 这是一个不可重入锁，如果 重复lock会产生死锁
 * @author: Kevin
 * @create: 2019-08-27 00:16
 **/
public class SLock {
    private AtomicReference atomicReference = new AtomicReference();

    public void lock(){
        Thread currentThread = Thread.currentThread();
        //自旋
        for(;;){
            // 如果atomicReference 为null，则获取锁
            if(atomicReference.compareAndSet(null,currentThread ))return;
        }
    }
    public void unlock(){
        Thread currentThread = Thread.currentThread();
        //将 设置为null ,释放锁
        atomicReference.compareAndSet(currentThread, null);
    }
}

```

## 利用AQS实现锁
**AQS中使用的模板方法， 它提供了抽象方法供我们继承重写，可以实现自定义的锁机制，现在让我们利用AQS手写一把锁**
```java  
package com.current.xiangxue.Lock;

import java.util.ArrayList;
import java.util.concurrent.Callable;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.locks.Lock;

/**
 * @version 1.0
 * @program: springTest
 * @description:
 * @author: Kevin
 * @create: 2019-08-27 00:19
 **/
public class Test {
    private int num = 0;

    public static void main(String[] args) {
        Test test = new Test();
        long begin = System.currentTimeMillis();
        Lock sLock = new AQSSelfLock();
        CountDownLatch countDownLatch = new CountDownLatch(100000);
        for (int i = 0; i < 100000; i++) {
            new Thread(() -> {
                // 这里两个lock会产生死锁
                //sLock.lock();
                try {
                    Thread.sleep(10);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
                /*synchronized (Test.class){
                    test.num++;
                    countDownLatch.countDown();
                }*/

                try {
                    sLock.lock();
                    test.num++;
                    countDownLatch.countDown();
                } catch (Exception ex) {
                    ex.printStackTrace();
                } finally {
                    sLock.unlock();
                }


            /*    test.num++;
                countDownLatch.countDown();*/

            }).start();
        }
        try {
            long end = System.currentTimeMillis();
            long xiaohao = end - begin;
            System.out.println("消耗时间:" + xiaohao);
            countDownLatch.await();
            System.out.println(test.num);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }
}

```

## 测试 
```java  
package com.current.xiangxue.Lock;

import java.util.concurrent.CountDownLatch;
import java.util.concurrent.locks.Lock;
/**
 * @version 1.0
 * @program: springTest
 * @description:
 * @author: Kevin
 * @create: 2019-08-27 00:19
 **/
public class Test {
    private int num = 0;

    public static void main(String[] args) {
        Test test = new Test();
        long begin = System.currentTimeMillis();
        Lock sLock = new AQSSelfLock();
        CountDownLatch countDownLatch = new CountDownLatch(100000);
        for (int i = 0; i < 100000; i++) {
            new Thread(() -> {
                // 这里两个lock会产生死锁
                //sLock.lock();
                try {
                    Thread.sleep(10);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
                /*synchronized (Test.class){
                    test.num++;
                    countDownLatch.countDown();
                }*/

                try {
                    sLock.lock();
                    test.num++;
                    countDownLatch.countDown();
                } catch (Exception ex) {
                    ex.printStackTrace();
                } finally {
                    sLock.unlock();
                }
            /*    test.num++;
                countDownLatch.countDown();*/

            }).start();
        }
        try {
            long end = System.currentTimeMillis();
            long xiaohao = end - begin;
            System.out.println("消耗时间:" + xiaohao);
            countDownLatch.await();
            System.out.println(test.num);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }
}

```

:::warning 测试结果
不使用锁 消耗时间:9246     
使用synchronized关键字 消耗时间:10751    
使用利用cas实现的锁： 消耗时间:10394     
使用AQS实现锁： 消耗时间:9715    
:::


