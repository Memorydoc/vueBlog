---
title: 情景案例
---


## 使用Future 和Callable 的多线程实例  （模拟渲染界面的功能）
*渲染界面需要  =》  渲染文本和下载图片 渲染图片三部分组成*

```java 
public class FutureAndCallable {
    private final static int imagesCount = 100;
    private final static ExecutorService executorService = Executors.newCachedThreadPool();

    static void renderPage() {//渲染界面
        Long beginTime = System.currentTimeMillis();
        Callable<Integer> task = new Callable<Integer>() {
            @Override
            public Integer call() throws Exception {
                return downLoadImage();
            }
        };
        Future<Integer> future = executorService.submit(task);
        renderText();
        try {
            renderImage(future.get());
        } catch (InterruptedException e) {
            e.printStackTrace();
        } catch (ExecutionException e) {
            e.printStackTrace();
        }

        System.out.println("渲染界面一共花费: " + String.valueOf(System.currentTimeMillis() - beginTime) + "毫秒");
    }

    static void renderText() {//模拟渲染界面文本需要花费500毫秒
        try {
            System.out.println("渲染文本开始");
            Thread.sleep(500);
            System.out.println("渲染文本结束");
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }

    static int downLoadImage() {//构造图片信息，用户模拟下载图片
        int img = 0;
        for (int i = 0; i < imagesCount; i++) {
            try {
                Thread.sleep(20);//每次下载一个图片需要20毫秒
                img++;
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
        return img;
    }

    static void renderImage(int num) {
        for (int i = 0; i < num; i++) {
            System.out.println(i);
        }
    }

    public static void main(String[] args) {
        renderPage();
    }
}

```

## FutureAndCallable 升级版（上方代码）
>  这种方式，可以充分利用系统资源，为什么这么说呢？
   因为，如果使用Furture Callable ，下载慢的情况下，下面的线程都需要等待当前任务（图片执行完成之后，才能得以执行）很不友好
   使用升级版本，可以将任务全部执行，发生长时间下载也没有关系，并不会对别的线程产生影响。
   其实就是， 你除了问题，你自己的事，跟别人有啥关系（己所不欲勿施于人啊，哈哈）
>

```java 
    /**
     * @program: FutureAndCallable 升级版， 从FutureAndCallable 花费两千多好秒缩减到500毫秒
     * 针对每个图片的下载都是用多线程
     *多线程 | CompletionService异步获取并行任务执行结果
     *  * 使用Future和Callable可以获取线程执行结果，但获取方式确是阻塞的，根据添加到线程池中的线程顺序，依次获取，
     *  获取不到就阻塞(task() 方法)(如果不想阻塞，那么使用poll)。
     *  * 为了解决这种情况，可以采用轮询的做法。
     *
     * @description:
     * @author: Kevin
     **/
    
    
    public class FutureAndCallableTop {
        private final static int imagesCount = 100;
        private final static ExecutorService executorService = Executors.newCachedThreadPool();
        private final static CompletionService completionService = new ExecutorCompletionService(executorService);
    
        static void renderPage() {//渲染界面
            Long beginTime = System.currentTimeMillis();
            renderText();
            downLoadImage();
            renderImage();
            System.out.println("渲染界面一共花费: " + String.valueOf(System.currentTimeMillis() - beginTime) + "毫秒");
        }
    
        static void renderText() {//模拟渲染界面文本需要花费500毫秒
            try {
                System.out.println("渲染文本开始");
                Thread.sleep(500);
                System.out.println("渲染文本结束");
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    
        static void downLoadImage() {//构造图片信息，用户模拟下载图片
            for (int i = 0; i < imagesCount; i++) {
                final int finalI = i;
                completionService.submit(new Callable() {//获取线程执行结果，获取的顺序根据线程的执行顺序而定
                    @Override
                    public Object call() throws Exception {
                        if(finalI == 3){//在下载第三张图片的时候，发生了阻塞，可能因为第三张图片过大，需要更多的时间，这里模拟需要2秒才能下载完成
                            Thread.sleep(2000);//每次下载一个图片需要2秒
                        }
                        return finalI;
                    };
                });
    
            }
        }
    
        static void renderImage() {
            try {
                for(int i =0; i< imagesCount; i++){
                    /*
                    这种方式是，如果获取不到值，不管，直接返回null
                    Future poll = completionService.poll();
                    if(poll != null){
                        System.out.println(poll.get());///这里因为CompletionService 获取线程的执行结果顺序不确定，所以值顺序不确定
                    }else{
                        System.out.println("null");
                    }*/
                    System.out.println(completionService.take().get());
                }
            } catch (InterruptedException e) {
                e.printStackTrace();
            } catch (ExecutionException e) {
                e.printStackTrace();
            }
        }
    
        public static void main(String[] args) {
            renderPage();
        }
    }

```