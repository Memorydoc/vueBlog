---
title: 综合
---
## Executor（顶级接口，线程执行器）

## ExecutorService （服务）
>通过实现Executor，对线程进行管理execute:submit:isTerminated（线程池是否执行完成）等
execute可以传入 任务，对任务进行处理

## FutureTask (将来的任务)

>下面的案例是FutureTask 错误的示范，在使用ExecuteService的submit方法的时候，只能专递CallAble 类型的任务，有返回值，并且能捕获异常
>可以使用execute方法代替，这样可以执行，但是不能有返回值，因为传入的是一个Runnable接口的任务，本来就没有返回值
```java 
public class T {
    private static final Integer initLength = 10000;
    private static int[] list = new int[10000];
    private static Random r = new Random();
    //对一个十万长度的数组加和
    static {
        for (int i = 0; i < initLength; i++) {
            int num = r.nextInt(100);
            list[i] = num;
        }
    }

    public static void main(String[] args) {
        ExecutorService executorService = Executors.newCachedThreadPool();//内部使用SynchronousQueue队列，来一个任务产生一个线程执行任务
        FutureTask futureTask = new FutureTask(new Callable() {//将任务包装成未来任务（其实就是可以通过阻塞等待的方式，获取任务结果）
            @Override
            public Object call() throws Exception {
                System.out.println("进来了");
               // System.out.println(1/0);
                return Arrays.stream(list).sum();
            }
        });
        /**
         * 这里会出现一个问题，我本身传入的是FutureTask，所以这里获取不到值，在使用submit时候，要传递 Future 类型对象
         */
        Future<?> submit = executorService.submit(futureTask);//将任务放入线程池中执行 换成execute
        try {
            System.out.println(submit.get());//获取不到值，结果为null
            ///System.out.println(futureTask.get());
        } catch (InterruptedException e) {
            e.printStackTrace();
        } catch (ExecutionException e) {
            e.printStackTrace();
        }
    }
}
```
**如果使用 executorService.submit 参数只能传递CallAble类型的参数，如果想使用executorService.execute，那么可以传入FutureTask类型和Runnable类型的参数
因为FutureTask 本身就实现了Runnable接口**


***

## ComplateService

## MyFuture
```java 
package com.current.completionService;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.*;

/**
 * @version 1.0
 * @program: 展示Future的缺点---》 阻塞
 * @description:
 * @author: Kevin
 * @create: 2019-07-03 10:42
 **/
public class MyFuture {

    public static void main(String[] args) {
        //创建一个有三个线程的线程池
        ExecutorService executorService = Executors.newFixedThreadPool(10);
        List<Future> listFuture = new ArrayList<>();
        for (int i = 0; i < 10; i++){
            int finalI = i;
            Callable<Integer> callable = new Callable() {
                @Override
                public Object call() throws Exception {
                    if(finalI == 5){
                        Thread.sleep(4000);
                        return finalI;
                    }
                    return finalI;
            }
            };

            listFuture.add(executorService.submit(callable));
        }
        //在这里使用Future 获取线程返回值的过程是阻塞的,所以在获取第六个线程的时候，会被阻塞4秒
        //主线程一直等待
        for (Future future : listFuture) {
            try {
                System.out.println(future.get());
            } catch (InterruptedException e) {
                e.printStackTrace();
            } catch (ExecutionException e) {
                e.printStackTrace();
            }
        }
    }
}

```
### MyComplateService

```java 
package com.current.completionService;

import java.util.concurrent.*;

/**
 * @version 1.0
 * @program: springTest
 * @description:
 * @author: Kevin
 * @create: 2019-07-03 10:50
 **/
public class MyComplateService {
    public static void main(String[] args) {
        //创建一个有三个线程的线程池
        ExecutorService executorService = Executors.newFixedThreadPool(10);
        CompletionService<Integer> completionService = new ExecutorCompletionService<Integer>(executorService);
        for (int i = 0; i < 10; i++) {
            int finalI = i;
            Callable<Integer> callable = () -> {
                if (finalI == 5) {
                    Thread.sleep(4000);
                    return finalI;
                }
                return finalI;
            };
            //使用comletionService 在获取第六个线程的时候，不会被阻塞，而是直接获取第七个线程的结果
            //第六个线程的结果，会在4秒钟之后返回出来
            completionService.submit(callable);
        }
        //在测试的时候，要注释掉take方法体，或者poll方法体，才能看出来效果
        //take无阻塞，如果任务不存在或者任务阻塞， 会在最后输出等待的线程的值
       /* for (int i = 0; i < 10; i++) {
            try {
                System.out.println( completionService.take().get());
            } catch (InterruptedException e) {
                e.printStackTrace();
            } catch (ExecutionException e) {
                e.printStackTrace();
            }
        }
*/
        //poll无阻塞，如果任务不存在或者任务阻塞， 直接返回null，抛弃模式，直接不等阻塞的线程
        for (int i = 0; i < 10; i++) {
            Future<Integer> poll = completionService.poll();
            if (poll != null) {
                try {
                    System.out.println(poll.get());
                } catch (InterruptedException e) {
                    e.printStackTrace();
                } catch (ExecutionException e) {
                    e.printStackTrace();
                }
            }else{
                System.out.println(poll);
            }
        }
    }
}
```

## 使用自定义的 ThreadFactory
```java 
package com.current;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.ThreadFactory;

/**
 * @version 1.0
 * @program: springTest
 * @description: 自定义的线程工厂
 *          Executors  在创建线程的时候，如果不传入线程工厂，内部会调用默认的线程工厂 在Executors中，如果传递线程工厂则用自定义的线程工厂
 *          static class DefaultThreadFactory implements ThreadFactory
 * @author: Kevin
 * @create: 2019-06-22 19:02
 **/
public class MyThreadFactory implements ThreadFactory {
    @Override
    public Thread newThread(Runnable r) {
        Thread thread  = new Thread(r);
        thread.setName("自定义的线程");
        return thread;
    }

    public static void main(String[] args) {
        MyThreadFactory myThreadFactory = new MyThreadFactory();
        ExecutorService executorService = Executors.newSingleThreadExecutor(myThreadFactory);
        executorService.execute(new Runnable() {
            @Override
            public void run() {
                System.out.println("我是 " + Thread.currentThread().getName());
                return;
            }
        });
    }
}

```
