---
title: 'ReentrantLock'
---

## 代替synchronized
ReentRantLock 可以用来代替synchronized 的手动锁

下面代码使用 ReentrantLock 手动加锁的方式锁住了对count变量的操作
```java 
public class T implements  Runnable{
    private int count = 10;
    private ReentrantLock reentrantLock =new ReentrantLock();
    @Override
    public void run() {
        reentrantLock.lock();
        try{
            count--;
            System.out.println(Thread.currentThread().getName() + "count = " + count);
        }catch (Exception ex){
            ex.printStackTrace();
        }finally {
            reentrantLock.unlock();
        }
    }

    public static void main(String[] args) {
        T t =new T();
        for (int i = 0; i< 5; i++){
            new Thread(t, "THREAD" + i ).start();
        }
    }
}
```
       
>这个地方的count可以使用原子类，而不是使用整型，使用AtomicInteger 原子类代替

## tryLock
>尝试获取锁: 可以设置超时时间，如果超过超时时间，还没有获取到锁，则执行下面代码
```java 
    public class T {
        List<Integer> list = new ArrayList<>();
        private ReentrantLock reentrantLock = new ReentrantLock();
    
        public void m1() {
            for (int i = 0; i < 10; i++) {
                reentrantLock.lock();
                list.add(i);
                System.out.println(i);
                try {
                    Thread.sleep(1000);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                } finally {
                    reentrantLock.unlock();
                }
            }
        }
    
        public void m2() {
            boolean lock = false;
            try {//代码1
                lock = reentrantLock.tryLock(5, TimeUnit.SECONDS);
                System.out.println("m2 begin");
            } catch (InterruptedException e) {
                System.out.println("Thread interrupted");
            } finally {
                if (lock) reentrantLock.unlock();
            }
           /* try {// 代码2
                reentrantLock.lock();
                System.out.println("m2 begin");
            } catch (Exception ex) {
                ex.printStackTrace();
            } finally {
                reentrantLock.unlock();
            }*/
    
    
        }
    
        public static void main(String[] args) {
            T t = new T();
            new Thread(t::m1).start();//t1线程 java8 的简写形式
    
            new Thread(t::m2).start();//t2线程
        }
    
    }
```

**代码块2 是不同lock形式，会一直等待10秒之后才能执行 m2 begin ,但是代码块1使用 tryLock() 方法，线程尝试获取锁，如果在制定的时间内获取不到锁
那么会返回false，并且继续往下执行**  


## lockInterruptibly
>可打断锁: 当前锁不会一直锁定，基本的lock()方法会一直等待，lockInterruptibly();可以将锁设置成可以打断的锁，这样可以在主线程中或者其他线程种将线程打断
并抛出异常

```java  
public class T {
    List<Integer> list = new ArrayList<>();
    private ReentrantLock reentrantLock = new ReentrantLock();

    public void m1() {
        for (int i = 0; i < 10; i++) {
            reentrantLock.lock();
            list.add(i);
            System.out.println(i);
            try {
                Thread.sleep(1000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            } finally {
                reentrantLock.unlock();//这里会抛异常，因为这里线程被打断了 不能调用unlock()方法了
            }
        }
    }

    public void m2() {
        try {
            reentrantLock.lockInterruptibly();
            System.out.println("m2 begin");
        } catch (InterruptedException e) {
            System.out.println("Thread interrupted");
        } finally {
            if(reentrantLock.isLocked()){
                reentrantLock.unlock();
            }
        }
    }

    public static void main(String[] args) {
        T t = new T();
        new Thread(t::m1).start();//t1线程

        Thread t2 = new Thread(() -> t.m2());//t2线程
        t2.start();
        try {
            TimeUnit.SECONDS.sleep(2);
            t2.interrupt();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }
}
```
    