---
title: 网站限流
---

::: warning 
 **LimitService 是限流统一接口**
:::
## 使用接口的方式

### 创建限流接口
```java  
package com.pwc.requestlimit.inter;

public interface LimitService {

    public boolean accquire();

    public void release();
}
```

### 使用计数器
* 创建计数器 service
```java  
package com.pwc.requestlimit.iterimpl;

import com.pwc.requestlimit.inter.LimitService;

public class CountLimitImpl  implements LimitService {
    private int request = 0;
    private long start = System.currentTimeMillis();

    private long interval = 60;//间隔时间

    private int nums = 60;// 请求总数


    @Override
    public boolean accquire() {
        if(System.currentTimeMillis() > start + interval){
            request = 0;
            start = System.currentTimeMillis();
        }
        request++;
        return request < nums;
    }

    @Override
    public void release() {

    }
}

```
* 计数器方法测试
```java  
package com.pwc.requestlimit.test;

import com.pwc.requestlimit.iterimpl.CountLimitImpl;
import org.apache.catalina.Executor;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class CountLimitTest {
    final static ExecutorService executorService = Executors.newFixedThreadPool(100);

    public static void main(String[] args) throws InterruptedException {
        CountLimitImpl  countLimit = new CountLimitImpl();
        for(int i=0; i< 100; i++){
            executorService.submit(new Runnable() {
                @Override
                public void run() {
                    if(countLimit.accquire()){
                        System.out.println("可以执行任务");
                    }else{
                        System.out.println("被限流了");

                    }
                }
            });
        }


    }


}

```


### 使用令牌桶算法
#### 创建 BuketLimitServiceImpl 服务
```java  
package com.pwc.requestlimit.iterimpl;

import com.google.common.util.concurrent.RateLimiter;
import com.pwc.requestlimit.inter.LimitService;

public class BuketLimitServiceImpl implements LimitService {
    private RateLimiter rateLimiter =RateLimiter.create(500);// 并发数量 permitsPerSecond 允许每秒钟获取的令牌数量

    @Override
    public boolean accquire() {
        return rateLimiter.tryAcquire();
    }

    @Override
    public void release() {
    }
}

```

#### 创建 BuketLimitTest 测试类
```java   
package com.pwc.requestlimit.test;

import com.pwc.requestlimit.iterimpl.BuketLimitServiceImpl;
import com.pwc.requestlimit.iterimpl.CountLimitImpl;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class BuketLimitTest {
    final static ExecutorService executorService = Executors.newFixedThreadPool(100);

    public static void main(String[] args) throws InterruptedException {
        BuketLimitServiceImpl buketLimitService = new BuketLimitServiceImpl();
        for(int i=0; i< 100; i++){
            executorService.submit(new Runnable() {
                @Override
                public void run() {
                    if(buketLimitService.accquire()){
                        System.out.println("可以执行任务");
                    }else{
                        System.out.println("被限流了");

                    }
                }
            });
        }


    }
}

```

#### 测试结果
```sh  
可以执行任务
可以执行任务
被限流了
被限流了
可以执行任务
被限流了
可以执行任务
被限流了
被限流了
被限流了
可以执行任务
被限流了
```

### 使用Semaphore 限流

####  创建 SemaphoreLimitServiceImpl 服务
```java   
package com.pwc.requestlimit.iterimpl;


import com.pwc.requestlimit.inter.LimitService;

import java.util.concurrent.Semaphore;

/**
 * 使用信号量限流
 */
public class SemaphoreLimitServiceImpl  implements LimitService {
    private Semaphore semaphore =  new Semaphore(10);// 允许执行指定代码块的线程数量
    @Override
    public boolean accquire() {
        return semaphore.tryAcquire();
    }

    @Override
    public void release() {
        semaphore.release();
    }
}

```
#### 创建测试类
```java  
package com.pwc.requestlimit.test;

import com.pwc.requestlimit.iterimpl.CountLimitImpl;
import com.pwc.requestlimit.iterimpl.SemaphoreLimitServiceImpl;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class SemaphoreTest {
    final static ExecutorService executorService = Executors.newFixedThreadPool(100);

    public static void main(String[] args) throws InterruptedException {
        SemaphoreLimitServiceImpl semaphoreLimitService = new SemaphoreLimitServiceImpl();
        for(int i=0; i< 100; i++){
            executorService.submit(new Runnable() {
                @Override
                public void run() {
                    try {
                        if(semaphoreLimitService.accquire()){
                            System.out.println("可以执行任务");
                            Thread.sleep(1000);
                        }else{
                            System.out.println("被限流了");

                        }
                    }catch (Exception ex){
                        ex.printStackTrace();
                    }finally {
                        semaphoreLimitService.release();
                    }
                }
            });
        }
    }
}

```
#### 测试结果

```sh   
可以执行任务
可以执行任务
可以执行任务
可以执行任务
可以执行任务
可以执行任务
可以执行任务
可以执行任务
可以执行任务
可以执行任务
被限流了
可以执行任务
被限流了
可以执行任务
被限流了
可以执行任务
被限流了
可以执行任务
被限流了
可以执行任务
```

::: danger 思考 
 可以使用<code>ConcurrentHashMap</code> 将 请求地址（key） 和 限流类（value） 存放在 <code>ConcurrentHashMap</code> 集合中，
 然后对不同接口使用不同的 限流配置， 因为不同的接口限流可能不相同， 这样来做统一配置管理
:::



## 使用自定义注解的方式

### 使用令牌桶算法（guava提供）
guava公司提供了<code>RateLimiter</code> 可以实现令牌桶算法
这里使用<code>spring</code> 的<code>AOP</code> 和 自定义注解配合 实现<code>Controller层面的限流</code> 

#### 创建<code>GuavaTateLimeter</code> 注解
```java  
package com.pwc.requestlimit.annotation;

import java.lang.annotation.*;

/**
 * @version 1.0
 * @program: springTest
 * @description:
 * @author: Kevin
 * @create: 2019-09-20 17:44
 **/
@Target({ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface GuavaTateLimeter {

     // 每秒限制并发数
     double limit() default Double.MAX_VALUE;

     // 获取令牌超时时间
     int timeOut() default  Integer.MAX_VALUE;
}

```
#### 创建GuavaAOP 
```java  
package com.pwc.requestlimit.aop;
import com.google.common.util.concurrent.RateLimiter;
import com.pwc.requestlimit.annotation.GuavaTateLimeter;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.Signature;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.lang.reflect.Method;
import java.sql.Time;
import java.util.concurrent.TimeUnit;

/**
 * @version 1.0
 * @program: springTest
 * @description:
 * @author: Kevin
 * @create: 2019-09-20 18:21
 **/
@Aspect
@Component
public class GuavaAop {
    @Autowired
    private HttpServletResponse response;

    //创建切点
    @Pointcut("execution(public * com.pwc.requestlimit.controller.*.*(..))")
    public void guaLog() {
    }

    private  RateLimiter rateLimiter = RateLimiter.create(2);
    @Around("guaLog()")
    public Object beforeBuy(ProceedingJoinPoint proceedingJoinPoint) throws Throwable {
        MethodSignature signature = (MethodSignature)proceedingJoinPoint.getSignature();
        GuavaTateLimeter annotation = signature.getMethod().getDeclaredAnnotation(GuavaTateLimeter.class);
        if(annotation  == null){
            return proceedingJoinPoint.proceed();
        }else{
            rateLimiter.setRate(annotation.limit());
            if (rateLimiter.tryAcquire( annotation.timeOut(), TimeUnit.MILLISECONDS)) {
               return proceedingJoinPoint.proceed();
            }else{
                fullback();
            }
        }
        return  null;
    }
    public void fullback() {
        response.setHeader("Content-Type", "text/html;charset=UTF-8");
        PrintWriter printWriter = null;
        try {
            printWriter = response.getWriter();
            printWriter.println("服务器繁忙，请重试");
        } catch (IOException e) {
            e.printStackTrace();
        }finally {
            printWriter.close();
        }
    }
}

```
#### 创建<code>Controller</code>层
 ```java  
 package com.pwc.requestlimit.controller;
 
 import com.google.common.util.concurrent.RateLimiter;
 import com.pwc.requestlimit.annotation.GuavaTateLimeter;
 import com.pwc.requestlimit.annotation.RedisTateLimeter;
 import org.springframework.web.bind.annotation.RequestMapping;
 import org.springframework.web.bind.annotation.RestController;
 
 import java.util.concurrent.atomic.AtomicInteger;
 
 /**
  * @version 1.0
  * @program: springTest
  * @description: 订单控制器
  * @author: Kevin
  * @create: 2019-09-20 17:43
  **/
 @RestController
 @RequestMapping("order")
 public class OrderController {
 
     private RateLimiter rateLimiter = RateLimiter.create(5);// 每秒往筒中放入5个令牌，请求过来获取到令牌 就可以执行业务逻辑否则，将降级，返回服务器繁忙
 
     //使用最普通的方法，实现限流
     @RequestMapping("buy")
     public String buy(){
         if(rateLimiter.tryAcquire(1)){
             return  "下单成功";
         }else{
             return "服务器繁忙， 请稍后再试";
         }
     }
 
     private AtomicInteger atomicInteger = new AtomicInteger();
     /**
      * 通过注解的方式实现降级
      * @return
      */
     @RequestMapping("buyAnno")
     @GuavaTateLimeter(limit = 100, timeOut = 500)
     public String buyAnno(){
         // 查询数据库，操作数据库 下单
         return  "下单成功";//直接返回下单成功
     }
 
     /**
      * 通过 redis + lua 脚本实现分布式限流降级
      * limit 每秒可以请求的次数， 具体情况可能会跟这个数据有偏差，可能因为网络原因 和其他未人为因素导致
      */
     @RequestMapping("buyRedis")
     @RedisTateLimeter(limit = 100)
     public String buyRedis(){
         atomicInteger.getAndIncrement();
         System.out.println("下单成功" + atomicInteger.get());
         return  "下单成功";
     }
 
 
 }

 ```
 
 ### 使用redis实现分布式限流
 #### 创建<code> RedisTateLimeter</code> 注解
 ```java  
 package com.pwc.requestlimit.annotation;
 
 import java.lang.annotation.*;
 
 /**
  * @version 1.0
  * @program: springTest
  * @description:
  * @author: Kevin
  * @create: 2019-09-20 17:44
  **/
 @Target({ElementType.METHOD})
 @Retention(RetentionPolicy.RUNTIME)
 @Documented
 public @interface RedisTateLimeter {
 
      // 每秒限制并发数
      double limit() default Double.MAX_VALUE;
 
      // 获取令牌超时时间
      int timeOut() default  Integer.MAX_VALUE;
 }

 ```
#### 创建<code>RedisAop</code> 
```java   
package com.pwc.requestlimit.aop;

import com.google.common.collect.Lists;
import com.google.common.util.concurrent.RateLimiter;
import com.pwc.requestlimit.annotation.GuavaTateLimeter;
import com.pwc.requestlimit.annotation.RedisTateLimeter;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.script.DefaultRedisScript;
import org.springframework.scripting.support.ResourceScriptSource;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * @version 1.0
 * @program: springTest
 * @description:
 * @author: Kevin
 * @create: 2019-09-20 18:21
 **/
@Aspect
@Component
public class RedisAop {
    @Autowired
    private HttpServletResponse response;

    private AtomicInteger atomicInteger = new AtomicInteger();
    @Autowired
    private StringRedisTemplate stringRedisTemplate;
    private DefaultRedisScript<List> redisScript;

    @PostConstruct
    public void init(){
        redisScript = new DefaultRedisScript<List>();
        redisScript.setResultType(List.class);
        redisScript.setScriptSource(new ResourceScriptSource(new ClassPathResource("limit.lua")));
    }

    //创建切点
    @Pointcut("execution(public * com.pwc.requestlimit.controller.*.*(..))")
    public void guaLog() {
    }

    @Around("guaLog()")
    public Object beforeBuy(ProceedingJoinPoint proceedingJoinPoint) throws Throwable {
        MethodSignature signature = (MethodSignature)proceedingJoinPoint.getSignature();
        RedisTateLimeter annotation = signature.getMethod().getDeclaredAnnotation(RedisTateLimeter.class);
        if(annotation  == null){
            return proceedingJoinPoint.proceed();
        }else{
            String key  = "ip:" + System.currentTimeMillis() /1000;
            List<String> keyList = Lists.newArrayList(key);
            // 调用脚本执行
            List execute = stringRedisTemplate.execute(redisScript, keyList, String.valueOf(annotation.limit()));
            //lua 脚本返回0， 表示超出流量大小，返回1 表示没有超出流量大小
            if (execute.get(0).toString().equals("0")) {
               fullback();
            }else{
               return proceedingJoinPoint.proceed();
            }
        }
        return  null;
    }

    public void fullback() {
        response.setHeader("Content-Type", "text/html;charset=UTF-8");
        PrintWriter printWriter = null;
        try {
            atomicInteger.getAndIncrement();
            System.out.println("下单失败" + atomicInteger.get());
            printWriter = response.getWriter();
            printWriter.println("服务器繁忙，请重试");
        } catch (IOException e) {
            e.printStackTrace();
        }finally {
            printWriter.close();
        }


    }

}

```
### 创建lua 限流脚本
```sh  
local key = KEYS[1] --限流 KEY （一秒一个）
local limit = tonumber(ARGV[1]) -- 限流大小
local current = tonumber(redis.call('get', key) or 0)
if current + 1 > limit then -- 如果超出限流大小
    return 0
else -- 请求数 +1, 并设置两秒过期
    redis.call("INCRBY", key,"1")
    redis.call("expire", key,"2")
    return 1
end

```

#### 创建Controller
  和令牌桶算法限流使用的同一个Contoller



















