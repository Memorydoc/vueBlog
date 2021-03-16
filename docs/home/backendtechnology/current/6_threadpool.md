---
title : '线程池'
---


## 线程池概念
>线程池概念: 可以指定线程池大小，将任务丢入线程池运行，如果丢入的任务超过线程池的大小，将会将超出的任务放入阻塞队列等待执行。
>在线程池中创建的线程，执行完任务之后，不会丢失，会继续执行别的任务(这里会去阻塞队列中去获取新的需要执行的任务)，这样就减少了线程之间的切换
>，提高并发性和吞吐量

**线程池可以通过Executors（工厂方法，构造使用工具）创建**

## 固定长度的线程池
>Executors.newFixedThreadPool(1)//固定存放一个线程的线程池，第二个参数可以指定自定义的线程池工厂，这样就可以创建自定义线程放入线程池
>默认的线程池工厂是 Executors.defaultThreadFactory()

## 缓存线程池
>来几个任务开启几个线程。内部使用SynchronousQueue队列（将任务直接怼到消费者，队列没有容量）

## 单一线程池
>只有一个线程的线程池

```java  
 public static ExecutorService newSingleThreadExecutor() {
        return new FinalizableDelegatedExecutorService
            (new ThreadPoolExecutor(1, 1,
                                    0L, TimeUnit.MILLISECONDS,
                                    new LinkedBlockingQueue<Runnable>()));
    }
    
```

## 定时任务线程池
   ScheduledExecutorService scheduledExecutorService = Executors.newScheduledThreadPool(1);
   创建一个定时任务线程池，里面包含一个线程。此时该线程池具有设置延迟时间 执行任务的功能
   
>延迟多少时间执行任务
```javas
    public ScheduledFuture<?> schedule(Runnable command,
                                       long delay, TimeUnit unit);
```
>延迟多长时间执行可返回的任务
```java 
 public <V> ScheduledFuture<V> schedule(Callable<V> callable,
                                           long delay, TimeUnit unit);
```
    
>初始多少时间每个多少时间执行任务
```java 
public ScheduledFuture<?> scheduleAtFixedRate(Runnable command,
                                                  long initialDelay,
                                                  long period,
                                                  TimeUnit unit);
```
>初始多少时间延迟多少时间执行任务
```java 
    public ScheduledFuture<?> scheduleWithFixedDelay(Runnable command,
                                                     long initialDelay,
                                                     long delay,
                                                     TimeUnit unit);
```

##  newWorkStealingPool(精灵线程)
newWorkStealingPool适合使用在很耗时的操作，但是newWorkStealingPool不是ThreadPoolExecutor的扩展，
它是新的线程池类ForkJoinPool的扩展，但是都是在统一的一个Executors类中实现，
由于能够合理的使用CPU进行对任务操作（并行操作），所以适合使用在很耗时的任务中。
充分（有待研究）


##  ForkJoinPool

>大白话文: 将复杂的任务分成多个任务执行，任务多少，在什么情况下分是可以设置的，即为fork
>最后将结果join起来，可以不join，因为没有返回值，如果有返回值就join起来，充分利用cpu资源，提高吞吐量

*newWorkStealingPool是jdk1.8才有的，会根据所需的并行层次来动态创建和关闭线程，通过使用多个队列减少竞争，底层用的ForkJoinPool来实现的。
ForkJoinPool的优势在于，可以充分利用多cpu，多核cpu的优势，把一个任务拆分成多个“小任务”，
把多个“小任务”放到多个处理器核心上并行执行；当多个“小任务”执行完成之后，再将这些执行结果合并起来即可
内部默认创建 Runtime.getRuntime().availableProcessors() 个线程，每一个线程维护这自己的任务队列，如果自己任务队列的任务执行完成之后，会
去别的线程拿取任务继续执行。 Runtime.getRuntime().availableProcessors()方法是获取计算机CPU核心数
*

下面模拟一个 将一百万长度的数组加和的计算耗时进行判断

```java  
 public class T {
     private static final Integer initLength = 1000000;
     private static int[] list = new int[1000000];
     private static Random r = new Random();
 
     //假设数组中保存着所圆的半径， 求所有圆面积之和
     static {
         for (int i = 0; i < initLength; i++) {
             int num = r.nextInt(100);
             list[i] = num;
         }
     }
 
     static class ForkJoinTask extends RecursiveTask<Long> {///这里必须用泛型制定类型，不然在 compute 中返回值的Object不能相加
 
         private int[] nums;
         private int from;
         private int to;
 
         public ForkJoinTask(int[] nums, int from, int to) {
             this.nums = nums;
             this.from = from;
             this.to = to;
         }
 
         @Override
         protected Long compute() {
             if (to - from <= 10) {//少于10个半径的才会进行执行操作，否则托管给ForkJoin，开启多个线程执行任务
                 long total1 = 0;
                 for (int i = from; i < to; i++) {
                     total1 += getArea(nums[i]);
                 }
                 return total1;
             }
             int middle = (from + to) / 2;
             ForkJoinTask taskLeft = new ForkJoinTask(nums, from, middle);
             ForkJoinTask taskRight = new ForkJoinTask(nums, middle, to);
             taskLeft.fork();
             taskRight.fork();
             return taskLeft.join() + taskRight.join();
         }
     }
 
     public static void main(String[] args) {
         long num1 = 0;
         long begin = System.currentTimeMillis();
         for (int radis : list) {
             num1 += getArea(radis);
             /// num2 += getPerimeter(radis);
         }
         System.out.println(num1 / 10000);
         long end = System.currentTimeMillis();
         System.out.println("基本方法消耗 " + String.valueOf(end - begin));
 
         System.out.println("----------------------------fork join begin------------------------------");
         long begin1 = System.currentTimeMillis();
         ForkJoinPool forkJoinPool = new ForkJoinPool();
         ForkJoinTask forkJoinTask = new ForkJoinTask(list, 0, list.length - 1);
         System.out.println(forkJoinPool.invoke(forkJoinTask) / 10000);
         long end1 = System.currentTimeMillis();
         System.out.println("fork join comsume " + String.valueOf(end1 - begin1));
         System.out.println("----------------------------fork join end------------------------------");
 
     }
 
     public static double getArea(int radius) {
         //return Math.PI * Math.pow(radius, 2);//如果是任务执行时间比较短的，那么 forkjoin 反而会消耗时间
 
         double l = Double.parseDouble((String.valueOf((2 * 3 * radius)) + "1.21"));
         ///越复杂的任务，越能突显 forkjoin优势
         return Double.parseDouble(String.valueOf(l)); //运行看结果，这里为了增加时间，增加字符串拼接，消耗时间，这样可以看效果
     }
 }       
```

##  扩展ThreadPoolExecutor
```java 
public class ExtendThreadPoolExecutor extends ThreadPoolExecutor {


    public ExtendThreadPoolExecutor(int corePoolSize, int maximumPoolSize, long keepAliveTime, TimeUnit unit, BlockingQueue<Runnable> workQueue, RejectedExecutionHandler handler) {
        super(corePoolSize, maximumPoolSize, keepAliveTime, unit, workQueue, handler);
    }

    /**
     * beforeExecute:afterExecute:terminated 这些方法可以用来扩展ThreadPoolExecutor的行为
     * 在执行任务的线程中将调用beforeExecutor和afterExecute等方法，在这写方法中可以添加日志:计时:监控或统计信息收集的功能
     * 无论是任务是从run正常返回，还是抛出一个异常而返回，afterExecute都会被调用（如果任务在完成后带一个Error，那么不会调用afterExecute）
     * 如果beforExecute抛出一个RuntimeExeception,那么任务不会被执行并且afterExecutor不会被调用
     */

    private final ThreadLocal<Long> startTime = new ThreadLocal<Long>();//线程开始时间
    private final Logger logger = Logger.getLogger("ExtendThreadPoolExecutor");
    private final AtomicLong numTasks = new AtomicLong();
    private final AtomicLong totalTime = new AtomicLong();
    @Override
    protected void beforeExecute(Thread t, Runnable runnable) {
        super.beforeExecute(t, runnable);
        logger.fine(String.format("Thread %s : start %s", t, runnable));
    }
    @Override
    protected void afterExecute(Runnable r, Throwable t) {
        try {
            long endTime = System.nanoTime();
            long taskTime = endTime - startTime.get();
            numTasks.incrementAndGet();
            totalTime.addAndGet(taskTime);
            System.out.println(String.format("afterExecute() : end '%s', time=%dns", r, taskTime));
        } finally {
            super.afterExecute(r, t);
        }
    }

    protected void terminated() {
        try {
            logger.info(String.format("Terminated : avg time  = %dns", totalTime.get() / numTasks.get()));
        } catch (Exception ex) {
        } finally {
            super.terminated();
        }
    }

}
```
***