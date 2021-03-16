---
title: 合并请求
---

:::info
在高并发场景，响应实时性不需要很快的场景下，可以通过合并请求，通过控制层合并请求到 远端微服务端获取数据的方式，可以很大程度上降低系统压力，
提高系统性能。 
:::

### 构建合并请求注解
```java  
    package com.kenny.cloudclient.aop;
    
    import java.lang.annotation.*;
    
    @Documented
    @Retention(RetentionPolicy.RUNTIME)
    @Target(value = ElementType.METHOD)
    public @interface MergeRequest {
        /**
         * 批量请求时间
         *
         * @return
         */
        long timeout() default 50L; //50毫秒
    
        /**
         * 该注解的自定义id，用于标识该id请求的
         *
         * @return
         */
        String id();
    
        /**
         * 批量方法的名称,此类下的方法
         *
         * @return
         */
        String batchMethod();
    
        /**
         * 比较不同数据正确返回给请求的调用的方法
         *
         * @return
         */
        String compareMethod();
    }
```

### 构建 注解切面
```java 
package com.kenny.cloudclient.aop;

import com.kenny.cloudclient.request.Request;
import com.kenny.cloudclient.util.MergeRequestMethodUtils;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.beans.BeansException;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.stereotype.Component;
import org.springframework.util.ReflectionUtils;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.*;
import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicBoolean;

@Aspect
@Slf4j
@Component
public class MergeRequestAspect implements ApplicationContextAware {
    /**
     * 这个用来获取那个实体类，
     **/
    private ApplicationContext context;
    /**
     * 这个我原本想通过获取注解使用的地方的数目，但是好像行不通，就先写个死的
     **/
    public static int size = 10;
    /**
     * 分批次处理的数量
     **/
    public static final int BATCH_SIZE = 100;
    /**
     * 用来保存某个方法上对应来的请求队列
     **/
    public static final ConcurrentHashMap<String, ConcurrentLinkedDeque<Request>> allRequest = new ConcurrentHashMap<>();
    /**
     * 初始化定时任务
     **/
    public static final ScheduledExecutorService scheduledExecutorService = Executors.newScheduledThreadPool(size);
    /**
     * 用来做某一个方法是否是第一次请求的标识
     **/
    public static final ConcurrentHashMap<String, Boolean> tag = new ConcurrentHashMap<>();


    //创建切点
    @Pointcut("@annotation(com.kenny.cloudclient.aop.MergeRequest)")
    public void MergeRequest() {
    }

    /**
     * @return
     */
    @Around("MergeRequest()")
    public Object aroundMethod(ProceedingJoinPoint joinPoint) {
        /**合并请求 同类方法的id**/
        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        Object param = joinPoint.getArgs()[0]; // 注解方法的第一个参数  这里要注意，批处理请求的第一个参数一定要是业务主键
        MergeRequest mergeRequest = signature.getMethod().getDeclaredAnnotation(MergeRequest.class);
        String did = mergeRequest.id();// 业务ID 不同注解的方法，该值要不同
        /**当前请求id , 随机生成**/
        String pid = UUID.randomUUID().toString();
        /**批量请求的方法名称**/
        String batchMethod = mergeRequest.batchMethod();
        /**批量请求等待的时间**/
        long time = mergeRequest.timeout();
        String compareMethod = mergeRequest.compareMethod();
        CompletableFuture<Object> future = new CompletableFuture<>();
        Request requestPull = new Request(pid, param, did, compareMethod, joinPoint, future);
        ConcurrentLinkedDeque<Request> requests = allRequest.get(did);
        /**这里判断是否是第一次添加 did 对应的请求队列**/
        if (requests == null) {
            synchronized (LinkedBlockingDeque.class) {
                if(requests == null){
                    requests = new ConcurrentLinkedDeque<>();
                    requests.add(requestPull);
                    allRequest.put(did, requests);
                }else{
                    requests.add(requestPull);
                }
            }
        } else {
            requests.add(requestPull);
        }
        /**这里判断是否是第一次加入定时任务**/
        if (Objects.isNull(tag.get(did)) || !tag.get(did)) {
            tag.put(did, true);
            scheduledExecutorService.scheduleWithFixedDelay(() -> {
                if (allRequest.get(did) == null || allRequest.get(did).size() <= 0) {
                    return;
                }
                /**获取被切的那个方法**/
                Method method = MergeRequestMethodUtils.getCompensableMethod(joinPoint);
                if (method == null) {
                    throw new RuntimeException(String.format("join point not found method, point is : %s", joinPoint.getSignature().getName()));
                }
                Class[] clazz = method.getParameterTypes();
                Class returnType = method.getReturnType();
                if (clazz.length != 1) {
                    throw new RuntimeException(String.format("param only one and must one: %s", joinPoint.getSignature().getName()));
                }
                Set longs = new HashSet();

                /**获取当前被切的那个类**/
                Class targetClass = joinPoint.getTarget().getClass();
                try {
                    /**获取批量执行的那个方法**/
                    Method mm = targetClass.getMethod(batchMethod, List.class);
                    /**这个是因为采用了mybatis，就选择从spring容器中获取**/
                    Object target = context.getBean(targetClass);
                    ConcurrentLinkedDeque<Request> deque = allRequest.get(did);
                    List<Request> requestList = new ArrayList<>();
                    for (int i = 0; i < BATCH_SIZE; i++) {
                        Request os = deque.pollFirst();
                        if (os == null) {
                            break;
                        }
                        Object parameter = os.getParam();
                        longs.add(parameter);
                        requestList.add(os);
                    }
                    if(requestList.size() == 0)
                        return;
                    log.info("当前批量处理了" + requestList.size() + "个线程请求");
                    /**执行批量请求的方法**/
                    List<Object> list = (List<Object>) mm.invoke(target, new ArrayList<>(longs));

                    // 构建结果集
                    String cMethodName = requestList.get(0).getCompareMethod();
                    Method cMethod = returnType.getDeclaredMethod(cMethodName);
                    Map<String, Object> resultMap = new HashMap<>();
                    for (Object returnResult : list) {
                        resultMap.put(cMethod.invoke(returnResult).toString(),returnResult);
                    }

                    requestList.forEach(request -> {
                        Object resp = resultMap.get(request.getParam().toString());
                        request.getFuture().complete(resp);
                    });
                } catch (NoSuchMethodException | IllegalAccessException | InvocationTargetException e) {
                    e.printStackTrace();
                } catch (Throwable throwable) {
                    throwable.printStackTrace();
                }
                /**下面的延时执行我设置为time，但是这里为了演示效果，就将这个时间调大了**/
            }, 0, time, TimeUnit.MILLISECONDS);
        }
        try {
            /**下面的延时执行我设置为time*100，但是这里为了演示效果，就将这个时间调大了**/
            /**阻塞获取**/
            return requestPull.getFuture().get(time * 100, TimeUnit.MILLISECONDS);
        } catch (TimeoutException e) {
            return null;
        } catch (Throwable throwable) {
            throwable.printStackTrace();
            return null;
        }
    }

    @Override
    public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
        this.context = applicationContext;
    }
}

```

### 构建Request对象
```java 
package com.kenny.cloudclient.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.aspectj.lang.ProceedingJoinPoint;

import java.util.concurrent.CompletableFuture;

@Data
@AllArgsConstructor
public class Request {
    /**
     * 该对象id
     */
    private Object token;
    /**
     * 参数
     */
    private Object param;
    /**
     * 批量处理的方法名
     */
    private String batchMethod;
    /**
     * 比较不同数据正确返回给请求的调用的方法
     */
    private String compareMethod;
    private ProceedingJoinPoint jpt;
    private CompletableFuture<Object> future;
}

```
### controller 层测试
```java 
 @GetMapping(value = "/testMergeRequest")
    public String testMergeRequest() {
        for(int i =0; i< 1000;i++){
            executorService.submit(()->{
                long id = Thread.currentThread().getId();
                Order order = mergeRequestService.testMergeRequest(id);
                System.out.println(order);
            });
        }
        return "success";
    }
```
### service 层
```java  
   /**
     * @param id 订单id
     * @return
     */
    @MergeRequest(id = "testMergeRequest", batchMethod = "batchPull", compareMethod = "getId", timeout = 1000)
    @Override
    public Order testMergeRequest(Long id) {
        return new Order();
    }
    
    public List<Order> batchPull(List<Long> requestIds) {
        Map<String,String> map = new HashMap();
        map.put("requestIds", JSONObject.toJSONString(requestIds));
        Order[] forObject = restTemplate.getForObject("http://cloud-server/getAllList?requestIds={requestIds}", Order[].class, map);
        List<Order> forObject1 = Arrays.asList(forObject);
        return new ArrayList<>(forObject1);
    }
```
### 工具类
```java 
package com.kenny.cloudclient.util;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.Signature;
import org.aspectj.lang.reflect.MethodSignature;

import java.lang.reflect.Method;

public class MergeRequestMethodUtils {


    public static Method getCompensableMethod(ProceedingJoinPoint proceedingJoinPoint) {
        Signature sig = proceedingJoinPoint.getSignature();
        MethodSignature msig = null;
        if (!(sig instanceof MethodSignature)) {
            throw new IllegalArgumentException("该注解只能用于方法");
        }
        msig = (MethodSignature) sig;
        Object target = proceedingJoinPoint.getTarget();
        try {
            Method currentMethod = target.getClass().getMethod(msig.getName(), msig.getParameterTypes());
            return  currentMethod;
        } catch (NoSuchMethodException e) {
            e.printStackTrace();
        }
        return null;
    }
}
```

### cloud server端 
```java 

package com.kenny.cloudserver.rest;


import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.kenny.api.entity.Order;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@Controller
public class MergeRequest {

    @RestController
    public class EchoController {
        @GetMapping(value = "/echo/{message}")
        public String echo(@PathVariable String message) {
            return "Hello Nacos Discovery " + message;
        }

        @RequestMapping("getAllList")
        public List<Order> getAllList(@RequestParam String requestIds) {
            List<String> ordersStr = JSON.parseArray(requestIds, String.class);
            // 根据请求的参数 随机生成订单，方便测试
            List<Order> orders = new ArrayList<>();
            for (String requestId : ordersStr) {
                Order order = new Order();
                order.setId(Long.valueOf(requestId));
                int i = new Random().nextInt(999999999);
                order.setProdName(String.valueOf(i));
                orders.add(order);
            }
            return orders;
        }
    }
}

```
