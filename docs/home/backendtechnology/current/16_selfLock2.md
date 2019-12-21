---
title: 通过Condition  手写阻塞队列
---
#### 通过Condition  手写阻塞队列
```java 
package com.current.HandQueue;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.locks.Condition;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

/**
 * @version 1.0
 * @program: springTest
 * @description: 手写阻塞队列 通过Condition 唤醒等待
 * @author: Kevin
 * @create: 2019-06-19 00:50
 **/
public class HandBlockQueue {
    //队列容器
    private List<Integer> container = new ArrayList<>();

    volatile private int capacity;//容器最大容量
    volatile private int size;//容器现有容量

    public HandBlockQueue(int capacity) {
        this.capacity = capacity;
    }

    private Lock lock = new ReentrantLock();
    private Condition addCond = lock.newCondition();
    private Condition taskCond = lock.newCondition();

    public void add(int data) {
        try {
            lock.lock();
            while (size >= capacity) {
                System.out.println("阻塞队列满了");
                addCond.await();
            }
            size++;
            container.add(data);
            taskCond.signal();
        } catch (InterruptedException e) {
            e.printStackTrace();
        } finally {
            lock.unlock();
        }
    }


    /**
     * 取出元素
     *
     * @return
     */
    public Integer take() {
        try {
            lock.lock();
            while (size == 0) {
                System.out.println("阻塞队列空了");
                taskCond.await();
            }
            size--;
            int res = container.get(0);
            container.remove(0);
            addCond.signal();
            return res;
        } catch (InterruptedException e) {
            e.printStackTrace();
        } finally {
            lock.unlock();
        }
        return null;
    }

    public static void main(String[] args) {
        HandBlockQueue handBlockQueue = new HandBlockQueue(5);
        Thread t1 = new Thread(() ->{
            for(int i =0; i< 60; i++){
                handBlockQueue.add(i);
                System.out.println("塞入" + i);
                try {
                    Thread.sleep(100);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        });
        Thread t2 = new Thread(() ->{
            for(int i =0; i< 60; i++){
                System.out.println("取出" + handBlockQueue.take());
                try {
                    Thread.sleep(200);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        });
        t1.start();
        t2.start();
    }

}

```