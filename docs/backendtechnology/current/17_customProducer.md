---
title: 阻塞队列实现生产者消费者模式
---
#### 阻塞队列实现生产者消费者模式
```java 
package com.current.HandQueue;



import com.current.Semaphore.Customer;

import java.util.concurrent.BlockingQueue;
import java.util.concurrent.LinkedBlockingDeque;
import java.util.concurrent.LinkedBlockingQueue;
import java.util.function.Consumer;

/**
 * @version 1.0
 * @program: springTest
 * @description: 用阻塞队列实现生产者消费者模式, 调用 Concurrent 原生阻塞队列
 * @author: Kevin
 * @create: 2019-07-03 22:34
 **/
public class QueueImplProductCustome {

    public static class Producer implements  Runnable{
        private final BlockingQueue blockingQueue;

        public Producer(BlockingQueue blockingQueue) {
            this.blockingQueue = blockingQueue;
        }

        @Override
        public void run() {
            for(int  i = 0; i< 10; i++){
                System.out.println("生产了" + i);
                blockingQueue.add(i);

            }

        }
    }

    public  static class TCustomer implements  Runnable{

        private final BlockingQueue blockingQueue;

        public TCustomer(BlockingQueue blockingQueue) {
            this.blockingQueue = blockingQueue;
        }

        @Override
        public void run() {
            while(true) {
                try {
                    System.out.println("消费了: "+ blockingQueue.take());
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        }
    }
    public static void main(String[] args) {
        BlockingQueue blockingQueue = new LinkedBlockingQueue();
        Producer producer = new Producer(blockingQueue);
        TCustomer customer = new TCustomer(blockingQueue);
        //创建生产者线程和消费者线程
        Thread prodThread = new Thread(new Producer(blockingQueue));
        Thread consThread = new Thread(new TCustomer(blockingQueue));

        //启动生产者线程和消费者线程
        prodThread.start();
        consThread.start();
    }
}
```