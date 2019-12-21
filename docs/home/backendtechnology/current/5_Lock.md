---
title: Lock 和 CountDownLatch
---

## 语境情景
实现一个容器，提供两个方法，add，size。 写两个线程。线程1 添加10个元素到容器中， 线程2在 容器容量到达5个的时候，给出提示并且结束

::: danger 警告
 一般思维（错误）
:::

```java 
    public class T {
        List<Integer> list = new ArrayList<>();
    
        public void add(Integer i) {
            list.add(i);
        }
    
        public int size() {
            return list.size();
        }
    
        public static void main(String[] args) {
            T t = new T();
            new Thread(() -> {//t1线程
                System.out.println(Thread.currentThread().getName() + "begin");
                while (true) {
                    if (t.size() == 5) {
                        break;
                    }
                }
                System.out.println("list 到达5 finished");
            }).start();
    
            try {
                TimeUnit.SECONDS.sleep(1);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
    
            new Thread(() -> {//t2线程
                System.out.println(Thread.currentThread().getName() + "begin");
                for (int i = 0; i < 10; i++) {
                    t.add(i);
                    System.out.println("add" + i);
                    try {
                        TimeUnit.SECONDS.sleep(1);
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                }
    
            }).start();
        }
    }

```
::: warning 注意
错误分析： 不同线程中，list数组不可见，所有t1线程会一直等待，永不停止
:::

## 使用volatile关键字

```java 
    public class T {
        volatile List<Integer> list = new ArrayList<>();
    
        public void add(Integer i) {
            list.add(i);
        }
    
        public int size() {
            return list.size();
        }
    
        public static void main(String[] args) {
            T t = new T();
            new Thread(() -> {
                System.out.println(Thread.currentThread().getName() + "begin");
                while (true) {
                    if (t.size() == 5) {
                        break;
                    }
                }
                System.out.println("list 到达5 finished");
            }).start();
    
            try {
                TimeUnit.SECONDS.sleep(1);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
    
            new Thread(() -> {
                System.out.println(Thread.currentThread().getName() + "begin");
                for (int i = 0; i < 10; i++) {
                    t.add(i);
                    System.out.println("add" + i);
                    try {
                        TimeUnit.SECONDS.sleep(1);
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                }
    
            }).start();
        }
    }
```

::: tip 提示
可以解决问题，但是代码不够牛x，探索更先进的解决方法 使用锁机制   
:::

## 对象锁

```java 
    public class T {
        List<Integer> list = new ArrayList<>();
        private Object lock = new Object();
    
    
        public void add(Integer i) {
            list.add(i);
        }
    
        public int size() {
            return list.size();
        }
    
        public static void main(String[] args) {
             Object lock = new Object();
            T t = new T();
            new Thread(() -> {//t1线程
                System.out.println(Thread.currentThread().getName() + "begin");
                synchronized (lock){
                    if(t.size() != 5){
                        try {
                            lock.wait();//如果容器容量不等于5，线程等待
                        } catch (InterruptedException e) {
                            e.printStackTrace();
                        }
                    }
                }
                System.out.println("list 到达5 finished");
            }).start();
    
            try {
                TimeUnit.SECONDS.sleep(1);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
    
            new Thread(() -> {//t2线程
                System.out.println(Thread.currentThread().getName() + "begin");
               synchronized (lock){
                   for (int i = 0; i < 10; i++) {
                       t.add(i);
                       System.out.println("add" + i);
                       if(i == 4){
                           lock.notify();
                       }
                       try {
                           TimeUnit.SECONDS.sleep(1);
                       } catch (InterruptedException e) {
                           e.printStackTrace();
                       }
                   }
               }
    
            }).start();
        }
    }
```
::: tip 提示
以上代码并不能产生理想的效果，为什么呢？
**因为 wait() 方法可以释放锁。 但是notify不能释放锁，当t2线程执行到 if(i == 4) 并且调用lock.notify()，开始唤醒t1执行，但是这个时候
lock对象锁在t2的手中，所以此时t1并不会执行。就产生了错误的结果，怎么改进呢？**
:::

此时需要t2调用lock.wait();方法，主动释放锁，然后再唤醒t1线程（lock.notify（））,t1执行完成之后，在调用唤醒方法，让t2继续执行
```java 
    public class T {
        List<Integer> list = new ArrayList<>();
        private Object lock = new Object();
    
    
        public void add(Integer i) {
            list.add(i);
        }
    
        public int size() {
            return list.size();
        }
    
        public static void main(String[] args) {
             Object lock = new Object();
            T t = new T();
            new Thread(() -> {
                System.out.println(Thread.currentThread().getName() + "begin");
                synchronized (lock){
                    if(t.size() != 5){
                        try {
                            lock.wait();//如果容器容量不等于5，线程等待
                        } catch (InterruptedException e) {
                            e.printStackTrace();
                        }
                    }
                    lock.notify();
                }
                System.out.println("list 到达5 finished");
    
            }).start();
    
            try {
                TimeUnit.SECONDS.sleep(1);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
    
            new Thread(() -> {
                System.out.println(Thread.currentThread().getName() + "begin");
               synchronized (lock){
                   for (int i = 0; i < 10; i++) {
                       t.add(i);
                       System.out.println("add" + i);
                       if(i == 4){
                           try {
                               lock.wait();
                           } catch (InterruptedException e) {
                               e.printStackTrace();
                           }
                       }
                       lock.notify();
                       try {
                           TimeUnit.SECONDS.sleep(1);
                       } catch (InterruptedException e) {
                           e.printStackTrace();
                       }
                   }
               }
    
            }).start();
        }
    }

```
>上面的方法是不是很复杂？ 答案：当然啦！！

***
## 最简单的方法是使用CountDownLatch（门闩）
::: tip  提示
每调用一次 countDown()方法的时候，丢掉一个门闩，直到门闩个数为0时， 被await()的线程释放，得以执行;
:::
```java 

    public class T {
        List<Integer> list = new ArrayList<>();
        private Object lock = new Object();
    
    
        public void add(Integer i) {
            list.add(i);
        }
    
        public int size() {
            return list.size();
        }
    
        public static void main(String[] args) {
            CountDownLatch countDownLatch = new CountDownLatch(1);//说明只有一个门闩
            T t = new T();
            new Thread(() -> {
                System.out.println(Thread.currentThread().getName() + "begin");
                    if(t.size() != 5){
                        try {
                            countDownLatch.await();//如果容器容量不等于5，线程等待
                        } catch (InterruptedException e) {
                            e.printStackTrace();
                        }
                    }
                System.out.println("list 到达5 finished");
    
            }).start();
    
            try {
                TimeUnit.SECONDS.sleep(1);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
    
            new Thread(() -> {
                System.out.println(Thread.currentThread().getName() + "begin");
                for (int i = 0; i < 10; i++) {
                    t.add(i);
                    System.out.println("add" + i);
                    if(i == 4){
                        countDownLatch.countDown();;
                    }
                    try {
                        TimeUnit.SECONDS.sleep(1);
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                }
    
            }).start();
        }
    }```





