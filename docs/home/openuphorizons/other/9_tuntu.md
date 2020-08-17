---
title: 提升万倍系统吞吐量
---

## 普通接口编写方式
### Controller 层
```java 
   @PostMapping(value = "/test1")
    public ServiceResult test1() {
        long start = System.currentTimeMillis();
        ServiceResult serviceResult = new ServiceResult();
        String kevin = userService.getUserInfo("kevin");
        serviceResult.setMessage("请求成功");
        serviceResult.setSuccess(true);
        serviceResult.setBody(kevin);
        System.out.println("消耗时间：" + (System.currentTimeMillis() - start));
        return serviceResult;
    }
```
### Service 层
```java 
    @Override
    public String getUserInfo(String username) {
        String firstName = thirdSupplierService.testCallAble();
        String lastName = thirdSupplierService.testCallAble2();

        return firstName + lastName;
    }
```

## 查看结果
```sh 
消耗时间：4065
```



## 第一步优化, 使用 Future 和 线程池 ExecutorService
```java 
ExecutorService executorService = Executors.newFixedThreadPool(10);

    @Override
    public String getUserInfo(String username) {

        Callable<String> callable1 = new Callable() {
            @Override
            public Object call() throws Exception {
                return thirdSupplierService.testCallAble(); 该方法大约会调用消耗1s
            }
        };

        Callable<String> callable2 = new Callable() {
            @Override
            public Object call() throws Exception {
                return thirdSupplierService.testCallAble2(); // 该方法大约会调用消耗3s
            }
        };

        Future submit1 = executorService.submit(callable1); 
        Future submit2 = executorService.submit(callable2);

        String result = null;
        try {
            String ob1 = submit1.get().toString();
            String ob2 = submit2.get().toString();
            result = ob1 + ob2;
        } catch (InterruptedException e) {
            e.printStackTrace();
        } catch (ExecutionException e) {
            e.printStackTrace();
        }

        return result;
    }
```
## 查看执行结果
```sh 
消耗时间：3059
```

::: tip 提示
有没有发现，异步调用接口， 消耗时间会接近远程消耗最长时间的接口所用的时间
:::



## 提高系统吞吐量万倍 

修改上面Controller中的接口方法
```java 

    /**
     * 使用WebAsyncTask 异步返回结果，可以实现提高 tomcat 吞吐量万倍以上
     * todo 该方法可以进一步统一封装
     *
     * @return
     */
    @PostMapping(value = "/throughput")
    public WebAsyncTask<ServiceResult> throughput() {
        System.out.println("吞吐量方法被调用开始；tomcat线程" + Thread.currentThread().getName());
        Callable<ServiceResult> callable = new Callable() {
            @Override
            public Object call() throws Exception {
                ServiceResult serviceResult = new ServiceResult();
                serviceResult.setBody(userService.getUserInfo("kevin"));
                serviceResult.setMessage("请求成功");
                serviceResult.setSuccess(true);
                System.out.println("获取到执行结果，当前线程为" + Thread.currentThread().getName());
                return serviceResult;
            }
        };
        SimpleAsyncTaskExecutor executor = new SimpleAsyncTaskExecutor();
        executor.setThreadNamePrefix("MeiCai-");
        // 这里可以使用下面默认配置的方式， 只返回 WebAsyncTask 对象， 这里是为了灵活，所以全都写出来 
        WebAsyncTask<ServiceResult> webAsyncTask = new WebAsyncTask<>(60 * 1000L, executor, callable);

        webAsyncTask.onCompletion(new Runnable() {
            @Override
            public void run() {
                System.out.println("Completion");
            }
        });

        webAsyncTask.onTimeout(new Callable<ServiceResult>() {
            @Override
            public ServiceResult call() throws Exception {
                ServiceResult serviceResult = new ServiceResult();
                System.out.println("Request TimeOut");
                serviceResult.setErrorCode(0);
                serviceResult.setSuccess(false);
                serviceResult.setBody(null);
                serviceResult.setMessage("Request TimeOut");
                return serviceResult;
            }
        });

        System.out.println("吞吐量方法被调用结束；tomcat线程" + Thread.currentThread().getName());
        return webAsyncTask;
    }
```

### 执行结果（tomcat 线程会立即释放， 返回数据则有jvm线程异步返回接口，大大提高了系统吞吐量）
```sh 
吞吐量方法被调用开始；tomcat线程http-nio-9401-exec-6
吞吐量方法被调用结束；tomcat线程http-nio-9401-exec-6
获取到执行结果，当前线程为MeiCai-1
Completion

```

## 通过配置实现<code>WebAsyncTask</code> 异常处理， 并设置线程池控制异步 返回无须每次都创建新线程
```sh 
 /**
     * 下面是为了提高系统吞吐量 使用WebAsyncTask 异步返回结果，可以实现提高tomcat 吞吐量万倍以上
     * @param configurer
     */
    @Override
    public void configureAsyncSupport(final AsyncSupportConfigurer configurer) {
        configurer.setDefaultTimeout(60 * 1000L);
        configurer.registerCallableInterceptors(timeoutInterceptor());
        configurer.setTaskExecutor(threadPoolTaskExecutor());
    }

    @Bean
    public TimeoutCallableProcessingInterceptor timeoutInterceptor() {
        return new TimeoutCallableProcessingInterceptor();
    }

    @Bean
    public ThreadPoolTaskExecutor threadPoolTaskExecutor() {
        ThreadPoolTaskExecutor t = new ThreadPoolTaskExecutor();
        t.setCorePoolSize(10);
        t.setMaxPoolSize(50);
        t.setThreadNamePrefix("MeiCai");
        return t;
    }
```



### Controller 层可以直接这样写
> 注意， 这样写之前要配置上面的配置，不然会每次异步返回都会创建新的线程
```java 
 @PostMapping(value = "/throughput")
    public WebAsyncTask<ServiceResult> throughput() {
        System.out.println("吞吐量方法被调用开始；tomcat线程" + Thread.currentThread().getName());
        Callable<ServiceResult> callable = new Callable() {
            @Override
            public Object call() throws Exception {
                ServiceResult serviceResult = new ServiceResult();
                serviceResult.setBody(userService.getUserInfo("kevin"));
                serviceResult.setMessage("请求成功");
                serviceResult.setSuccess(true);
                System.out.println("获取到执行结果，当前线程为" + Thread.currentThread().getName());
                return serviceResult;
            }
        };
        System.out.println("吞吐量方法被调用结束；tomcat线程" + Thread.currentThread().getName());
        return new WebAsyncTask<>(callable);
    }
```


## 总结
**是Tomcat的线程 在执行Controller层的代码， Tomcat服务器最大可以创建的线程数是750个线程， 如果太多的线程阻塞在Controller层不释放的话，那么会大大降低系统的吞吐量。**
**这样就可以使用上面 <code>WebAsyncTask</code> 的方式， 异步返回结果，这样就可以释放tomcat 线程去接收别的用户的请求，就会大大提高系统吞吐量**


