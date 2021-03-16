---
title: 线程约束
---

## 控制线程并发数量

>1.该类可以控制线程并发数量,相当于给线程颁发执行许可证
```java 
public class SemaphoreTest1 {
    private Semaphore semaphore = new Semaphore(1);//表示只能有一个线程可以执行acquire() 和release()之间的代码

    public class Service{
        public void testMethod(){
            try{
                semaphore.acquire();
                System.out.println( Thread.currentThread().getName());
                System.out.println(semaphore.hasQueuedThreads());
            }catch (Exception ex){
                semaphore.release();
            }
        }

    }

    public static void main(String[] args) {

    }
   //semaphore.acquireUninterruptibly() 该方法不允许进入accquire的线程被打断（interrupt）
   //semaphore.availablePermits() 返回Semaphore中当前正在使用的许可证数量
   //semaphore.drainPermits() 返回当前可用的许可证数量
   //semaphore.hasQueuedThreads() 返回是否线程在等待当前许可证
   //semaphore.getQueueLength() 返回等待许可证的线程个数

}
```

> 2.可以起到减缓压力的作用(和ReentrantLock同时使用)

```java 
    /**
     * 这里所说的同步代码段是 acquire 和release之前的代码段，可以起到减缓压力的作用
     */
        //可以将 Semaphore 和ReentrantLock同时使用，这样就可以实现控制制定线程数量执行代码块，同时，保证了同步执行
        //本例中代码块中一次只能进入三个线程，并且三个线程是串行处理，保证了线程安全，防止高QPS压力，将压力减缓
    public class SemaphoreTest2 {
        private boolean isFail = false;
        private Semaphore semaphore = new Semaphore(3, isFail);//可以将同步代码段变成非公平锁，这样就不会局限于线程执行顺序
        private Lock lock = new ReentrantLock();
        private Condition condition = lock.newCondition();//可以控制被lock锁住的代码块 等待 condition.await() 或者 唤醒 condition.signalAll()
        public void testMethod() {
            try {
                //semaphore.tryAcquire();//尝试获取一个许可证，默认是一个，如果获得成功返回true
                //semaphore.tryAcquire(3);//尝试获得三个许可证，获得成功返回true;
                //semaphore.tryAcquire(2, TimeUnit.SECONDS);//尝试在两秒钟获取2个执行许可证，如果获得返回true
    
                semaphore.acquire();
                lock.lock();
                System.out.println("ThreadName=" + Thread.currentThread().getName());
            } catch (Exception ex) {
            } finally {
                lock.unlock();
                semaphore.release();
            }
        }
    }
    
    122112sdsddssdsads
```

## 线程执行屏障
> CyclicBarrier 线程执行屏障，约定线程个数，如果到达cyclicBarrier.await();的线程数不够约定的线程个数，则等待

```java 
public class Test {
    public static void main(String[] args) {
        //约定2个线程 到达屏障
        // 如果到达的线程数量没有2个，那么不会执行，构造器第二个参数的方法
        CyclicBarrier cyclicBarrier = new CyclicBarrier(2, new Runnable() {
            @Override
            public void run() {
                System.out.println("全来了");
            }
        });
        for (int i =0; i< 4; i++){
            ThreadA threadA = new ThreadA(cyclicBarrier);
            //cyclicBarrier.getNumberWaiting() 获取几个线程已经到达了屏障点
            //获取parties的个数
            threadA.start();
            try {
                Thread.sleep(2000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }

    public static class ThreadA  extends  Thread{
        private CyclicBarrier cyclicBarrier;
        public ThreadA(CyclicBarrier cyclicBarrier) {
            super();
            this.cyclicBarrier= cyclicBarrier;
        }

        @Override
        public void run() {
            System.out.println(Thread.currentThread().getName() + "开始=" + System.currentTimeMillis() + "等待凑齐2个线程开始执行");
            try {
                cyclicBarrier.await();
                System.out.println(Thread.currentThread().getName() + "结束=" + System.currentTimeMillis() + "已经凑齐2个线程开始执行");
            } catch (InterruptedException e) {
                e.printStackTrace();
            } catch (BrokenBarrierException e) {
                e.printStackTrace();
            }
        }
    }
}

```