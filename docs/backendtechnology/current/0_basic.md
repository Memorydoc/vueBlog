---
title: 多线程基础
---
## 线程终止
* 反对使用stop()，强制停止（不推荐）会解除由线程获取的所有锁定，而且对象处于一种不连贯状态，如果其他线程在那种状态下检查和修改他们，很难找出真正的问题  
* 反对使用subspend（），因为其很容易发生死锁，其虽然会暂停，但是仍然握有锁定的资源 , 如果该线程占有了锁，则它不会释放锁。suspend()已经是一个过时的方法了； resume()方法恢复 因suspend()方法挂起的线程，使之重新能够获得CPU执行。
* interrupt() 中断一个线程， 并不是强行关闭线程，而是发信号给线程，说你应该终止了,将中断标志位置改为 <code>true</code>（设计初衷： 给线程充足的时间清理资源，而这种方式也更加安全）
* isInterrupted() 判断当前线程是否中断状态
* static 方法 interrupted() 判断当前线程是否中断状态， 将中断标志位置改为<code>false</code>

#### 优雅的停止线程
```java 
package com.xiangxue.stopthread;
/**
 * @author: Kevin
 **/
public class InterruptedTest {

    static class th implements Runnable {
        private volatile boolean cancelled = false;
        @Override
        public void run() {
            while (!cancelled) {
                //没有停止需要做什么操作
                System.out.println("1111"); 
            }
            //线程停止后需要干什么
            System.out.println("任务结束了");

        }

        public void cancel() {
            cancelled = true;
        }
    }
    
    public static void main(String[] args) {
        th th = new th();
        Thread t = new Thread(th);
        t.start();
        try {
            Thread.sleep(100);
            th.cancel();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }
}
```

## 守护线程
线程.setDeamon() 
和主线程共死，就是说 主线程结束，守护进程必定结束
