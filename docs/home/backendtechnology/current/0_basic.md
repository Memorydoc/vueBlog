---
title: 多线程基础
---
::: warning
线程是协作式的
:::

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


## 线程中断

### 继承Thread的线程的中断

 ```java  
 package com.pwc.current.interrupt;
 
 /**
  *  继承Thread的线程的中断方式
  */
 public class ThreadInterrupt extends Thread {
 
 
     @Override
     public void run() {
         while (!isInterrupted()){
             System.out.println("线程正在执行-ing");
         }
         System.out.println("线程执行结束了----->end");
     }
 
     public static void main(String[] args) throws InterruptedException {
         ThreadInterrupt threadInterrupt = new ThreadInterrupt();
         threadInterrupt.start();
 
         Thread.sleep(2000);
 
         threadInterrupt.interrupt();
     }
 }

 ```
 * 执行结果 (中间省略了部分打印)
 ```sh  
 线程正在执行-ing
 线程正在执行-ing
 线程正在执行-ing
 线程正在执行-ing
 线程正在执行-ing
 线程正在执行-ing
 线程正在执行-ing
 线程正在执行-ing
 线程正在执行-ing
 线程正在执行-ing
 线程正在执行-ing
 线程正在执行-ing
 线程正在执行-ing
 线程正在执行-ing
 线程执行结束了----->end
 ```
 
 ### 实现Runnable接口的线程中断
 ```java 
 package com.pwc.current.interrupt;
 
 /**
  * 实现Runnable的线程的中断
  */
 public class RunnableInterrupt  implements  Runnable{
     @Override
     public void run() {
         while (!Thread.currentThread().isInterrupted()){
             System.out.println("线程正在执行-ing");
         }
         System.out.println("线程执行结束了----->end");
     }
 
     public static void main(String[] args) throws InterruptedException {
         RunnableInterrupt threadInterrupt = new RunnableInterrupt();
         Thread thread = new Thread(threadInterrupt);
         thread.start();
         Thread.sleep(2000);
         thread.interrupt();
     }
 }

 ```
 * 执行结果 (中间省略了部分打印)
 ```sh  
 线程正在执行-ing
 线程正在执行-ing
 线程正在执行-ing
 线程正在执行-ing
 线程正在执行-ing
 线程正在执行-ing
 线程正在执行-ing
 线程正在执行-ing
 线程正在执行-ing
 线程正在执行-ing
 线程正在执行-ing
 线程正在执行-ing
 线程正在执行-ing
 线程正在执行-ing
 线程执行结束了----->end
 ```
 
### 会抛出InterruptedException 异常的的线程的中断
1.  先看直接使用中断
```java 
package com.pwc.current.interrupt;

public class ThrowExceptionInterrupted extends Thread{

    public void run() {
        while (!isInterrupted()) {
            System.out.println("线程正在执行-ing");
            try {
                Thread.sleep(1000);
                System.out.println("线程正在执行-ing");
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
        System.out.println("线程执行结束了----->end");
    }
    public static void main(String[] args) throws InterruptedException {
        ThrowExceptionInterrupted throwExceptionInterrupted = new ThrowExceptionInterrupted();
        throwExceptionInterrupted.start();
        Thread.sleep(2000);
        throwExceptionInterrupted.interrupt();
    }
}
```
测试结果
```sh 
线程正在执行-ing
线程正在执行-ing
线程正在执行-ing
java.lang.InterruptedException: sleep interrupted
	at java.lang.Thread.sleep(Native Method)
	at com.pwc.current.interrupt.ThrowExceptionInterrupted.run(ThrowExceptionInterrupted.java:9)
线程正在执行-ing
线程正在执行-ing
线程正在执行-ing
线程正在执行-ing
线程正在执行-ing
线程正在执行-ing
线程正在执行-ing
......
```
::: warning 注意
线程会一直打印，只是抛出了异常，但是永不停止， 说明线程不能被中断
:::

2. 解决
```java 
package com.pwc.current.interrupt;

public class ThrowExceptionInterrupted extends Thread{

    public void run() {
        while (!isInterrupted()) {
            System.out.println("线程正在执行-ing");
            try {
                Thread.sleep(1000);
                System.out.println("线程正在执行-ing");
            } catch (InterruptedException e) {
                e.printStackTrace();
                interrupt(); //这里要再次中断，才能将抛出 InterruptedException异常的线程中断
            }
        }
        System.out.println("线程执行结束了----->end");
    }
    public static void main(String[] args) throws InterruptedException {
        ThrowExceptionInterrupted throwExceptionInterrupted = new ThrowExceptionInterrupted();
        throwExceptionInterrupted.start();
        Thread.sleep(2000);
        throwExceptionInterrupted.interrupt();
    }
}
```
测试结果
```sh  
线程正在执行-ing
线程正在执行-ing
线程正在执行-ing
java.lang.InterruptedException: sleep interrupted
	at java.lang.Thread.sleep(Native Method)
	at com.pwc.current.interrupt.ThrowExceptionInterrupted.run(ThrowExceptionInterrupted.java:9)
线程执行结束了----->end
```




 
 
 