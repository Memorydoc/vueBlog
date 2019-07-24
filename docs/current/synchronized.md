---
editLinks: true
title: 'synchronized'
---
## synchronized对象监视器为Object时的使用


```java
       private int count = 10;
       private Object object = new Object();
   
       public void m() {
           synchronized (object) {
               count--;
               System.out.println(Thread.currentThread().getName() + "count = " + count);
           }
       }
```
## `synchronized`对象监视器为Class时的使用
```java
public class Test1 {
       private int count = 10;
       public static void m() {//这里是静态方法
           synchronized (Test1.class) {//这里可以使用this吗？
               count--;
               System.out.println(Thread.currentThread().getName() + "count = " + count);
           }
       }
     }
```
在非静态代码块的情况下，可以使用this锁
```java
   public class Test1 {
          private int count = 10;
          public void m() {
              synchronized (this) {//这里可以使用this
                  count--;
                  System.out.println(Thread.currentThread().getName() + "count = " + count);
              }
          }
        }
```

以上代码简化写法
```java
public class Test1 {
       private int count = 10;
       public synchronized void m() {
               count--;
               System.out.println(Thread.currentThread().getName() + "count = " + count);
       }
     }
```

***
**分析这个程序输出**
>线程重入问题
```java
    public class T implements  Runnable{
        private int count = 10;
    
        @Override
        public void run() {
            count--;
            System.out.println(Thread.currentThread().getName() + "count = " + count);
        }
    
        public static void main(String[] args) {
            T t =new T();
            for (int i = 0; i< 5; i++){
                new Thread(t, "THREAD" + i ).start();
            }
        }
    }
```

>在同步代码块中，不要出现异常，否则会释放锁，会出现异常数据，可以用try catch 捕获异常，进行事务处理





