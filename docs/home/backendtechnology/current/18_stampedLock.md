---
title: StampedLock 乐观读写锁
---

> JDK1.8之前, 锁已经那么多了, 为什么还要有StampedLock?
>  一般应用, 都是读多写少, ReentrantReadWriteLock 因读写互斥, 故读时阻塞写, 因而性能上上不去。 可能会使线程饥饿
更高的提高并发量

```java 

package com.pwc.current;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.locks.*;

/**
 * @ClassName StampedLockTest
 * @Description: 乐观读锁 jdk1.8
 * @Author Kenny
 * @Date 2020/7/30
 **/
public class StampedLockTest {
    static ExecutorService service = Executors.newFixedThreadPool(10);
    static StampedLock lock = new StampedLock();
    static long milli = 5000;
    static int count = 0;

    private static long writeLock() {
        long stamp = lock.writeLock(); //获取排他写锁
        System.out.println("获取到了写锁");
        count += 1;
        lock.unlockWrite(stamp); //释放写锁
        System.out.println("数据写入完成");
        return System.currentTimeMillis();
    }

    // 普通读锁，在读的时候，就不能写
    private static void readLock() {//悲观读锁
        service.submit(() -> {
            int currentCount = 0;
            long stamp = lock.readLock(); //获取悲观读锁
            System.out.println("获取到读锁");
            try {
                currentCount = count; //获取变量值
                try {
                    TimeUnit.MILLISECONDS.sleep(milli);//模拟读取需要花费20秒
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            } finally {
                lock.unlockRead(stamp); //释放读锁
            }
            System.out.println("readLock==" + currentCount); //显示最新的变量值
        });
        try {
            TimeUnit.MILLISECONDS.sleep(500);//要等一等读锁先获得
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }


    /**
     * 乐观读锁，在读的时候，可以尝试获取写锁。在获取读锁的时候。判断是否是写的模式，如果是写的模式，那么是悲观锁，否则可以直接读取
     */
    private static void optimisticRead() {
        service.submit(() -> {
            long stamp = lock.tryOptimisticRead(); //尝试获取乐观读锁
            int currentCount = count; //获取变量值
            if (!lock.validate(stamp)) { //判断count是否进入写模式
                System.out.println("是写模式");
                stamp = lock.readLock(); //已经进入写模式，没办法只能老老实实的获取读锁
                try {
                    currentCount = count; //成功获取到读锁，并重新获取最新的变量值
                } finally {
                    lock.unlockRead(stamp); //释放读锁
                }
            }
            try {
                TimeUnit.MILLISECONDS.sleep(milli);//模拟读取需要花费5秒 这5秒内写锁是可以写数据的， 会先打印写数据
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            //走到这里，说明count还没有被写，那么可以不用加读锁，减少了读锁的开销
            System.out.println("optimisticRead==" + currentCount); //显示最新的变量值
        });
        try {
            TimeUnit.MILLISECONDS.sleep(500);//要等一等读锁先获得
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }

    public static void main(String[] args) throws InterruptedException {
//
//        long l1 = System.currentTimeMillis();
//        readLock();
//        long l2 = writeLock();
//        System.out.println(l2 - l1);

        long l3 = System.currentTimeMillis();
        optimisticRead();
        Thread.sleep(1000); // 睡眠一秒钟，证明这时候，肯定是拥有读锁的， 所以如果能打印出来 获取到写锁，那么证明，可以在读的时候写
        long l4 = writeLock();
        System.out.println(l4 - l3);
    }
}

```
