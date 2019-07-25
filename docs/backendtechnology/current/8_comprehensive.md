---
title: 综合
---
## Executor（顶级接口，线程执行器）

## ExecutorService （服务）
>通过实现Executor，对线程进行管理execute、submit、isTerminated（线程池是否执行完成）等
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
