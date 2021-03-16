---
title : Mini 版的Spring 
---

## 创建 KennyComponent 注解
```java  
package com.spruce.mini.spring.framework.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
public @interface KennyComponent {
    String  value() default "";
}

```

## 创建 KennyController 注解
```java 
package com.spruce.mini.spring.framework.annotation;


import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
public @interface  KennyController {
    String  value() default "";
}

```

## 创建 KennyService 注解
```java  
package com.spruce.mini.spring.framework.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target(ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)
public @interface KennyAutowired {
    String value() default "";
}

```
## 创建 KennyRequestMapping 注解
```java  
package com.spruce.mini.spring.framework.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;


@Target({ElementType.TYPE,ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
public @interface KennyRequestMapping {
    String  value() default "";
}

```
## 创建 KennyRequestParam 注解

```java 
package com.spruce.mini.spring.framework.annotation;


import java.lang.annotation.*;

@Target(ElementType.PARAMETER)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface KennyRequestParam {
    String value();
}

```

## 创建 KennyAutowired 注解

```java 
package com.spruce.mini.spring.framework.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target(ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)
public @interface KennyAutowired {
    String value() default "";
}

```


### 核心 KennyDispatcherServlet  服务启动类
```java 
package com.spruce.mini.spring;


import com.spruce.mini.spring.framework.annotation.KennyAutowired;
import com.spruce.mini.spring.framework.annotation.KennyController;
import com.spruce.mini.spring.framework.annotation.KennyRequestMapping;
import com.spruce.mini.spring.framework.annotation.KennyService;
import com.spruce.mini.spring.framework.base.Handler;
import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.net.URL;
import java.util.*;
import java.util.logging.Logger;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * 手写 Spring 的 DispatcherServlet
 * 继承 HttpServlet 会在 tomcat启动的时候 ，自动调用init 方法进行初始化 Servlet 规范规定
 *
 */
public class KennyDispatcherServlet extends HttpServlet {

    private Logger log = Logger.getLogger("init");
    private Map<String, Object> ioc = new HashMap<String, Object>();

    private Properties contextConfig = new Properties();

    private List<String> classNames = new ArrayList<>();

    // 保存所有的已经存在的接口路径
    //private Map<String, Method> handlerMapping = new HashMap<>();


    private List<Handler> handlerMapping = new ArrayList<Handler>();

    @Override
    public void init(ServletConfig config) throws ServletException {
        // 1.读取配置文件
        doLoadConfig(config.getInitParameter("contentConfigLocation"));

        // 2.扫描相关的类
        doScanner(contextConfig.getProperty("scanPackage"));

        // 3. 实例化相关的类， 并且缓存到IOC容器中
        doInstance();

        // 4.完成依赖注入
        doAutowirted();

        // 5.初始化HandlerMapping
        doInitHandlerMapping();

        System.out.println("Kenny Mvc　framework init successful");

    }

    private void doInitHandlerMapping() {
        if (ioc.isEmpty())
            return;

        for (Map.Entry<String, Object> entry : ioc.entrySet()) {
            Class<?> clazz = entry.getValue().getClass();
            if (!clazz.isAnnotationPresent(KennyController.class))
                continue;
            // 在Controller类上 写了KennyRequestMapping
            String baseUrl = "";
            if (clazz.isAnnotationPresent(KennyRequestMapping.class)) {
                KennyRequestMapping annotation = clazz.getAnnotation(KennyRequestMapping.class);
                baseUrl = annotation.value();
            }
            // 方法上的 KennyRequestMapping
            for (Method method : clazz.getMethods()) {
                if (!method.isAnnotationPresent(KennyRequestMapping.class)) continue;
                KennyRequestMapping requestMapping = method.getAnnotation(KennyRequestMapping.class);
                String url = "/" + baseUrl + "/" + requestMapping.value()
                        .replaceAll("/+", "/"); // 正则表达式 匹配 所有的斜杠
                Pattern pattern = Pattern.compile(url);

                handlerMapping.add(new Handler(pattern, entry.getValue(), method));
                System.out.println("Mapped:" + url + "," + method);
            }

        }

    }

    /**
     * 依赖注入 扫描ioc容器中的所有类
     */
    private void doAutowirted() {
        if (ioc.isEmpty())
            return;
        for (Map.Entry<String, Object> entry : ioc.entrySet()) {
            // private / public / protected /default
            // 拿到类中所有的 属性
            Field[] fields = entry.getValue().getClass().getDeclaredFields();

            for (Field field : fields) {
                if (!field.isAnnotationPresent(KennyAutowired.class))
                    continue;
                KennyAutowired autowired = field.getAnnotation(KennyAutowired.class);
                String beanName = autowired.value().trim();
                // 如果 KennyAutowired 没有 value
                if ("".equals(beanName)) {
                    beanName = toLowerFisrtCase(field.getType().getSimpleName());
                }
                field.setAccessible(true); // private 的 在类外面是拿不到的，这里通过暴力反射获取

                try {
                    field.set(entry.getValue(), ioc.get(beanName));
                } catch (IllegalAccessException e) {
                    e.printStackTrace();
                }
            }
        }
    }

    /**
     * 实例化
     */
    private void doInstance() {
        if (classNames.isEmpty())
            return;
        try {
            for (String className : classNames) {
                Class<?> clazz = Class.forName(className); // 通过类名反射获取类
                if (clazz.isAnnotationPresent(KennyController.class)) {
                    //默认类名首字母小写
                    String beanName = toLowerFisrtCase(clazz.getSimpleName());

                    Object instance = clazz.newInstance();// 或许需要被注入到IOC容器中的对象

                    ioc.put(beanName, instance);// key 为类名， value 为实力对象
                } else if (clazz.isAnnotationPresent(KennyService.class)) {
                    //默认类名首字母小写
                    KennyService service = clazz.getAnnotation(KennyService.class);
                    String beanName = service.value();


                    // 自定义beanName， 不同包下相同类名
                    if ("".equals(beanName)) {
                        beanName = toLowerFisrtCase(clazz.getSimpleName());
                    }
                    Object instance = clazz.newInstance();// 需要被注入到IOC容器中的对象

                    // 如果注入的是接口，那么使用它的接口 来就进行赋值
                    for (Class<?> i : clazz.getInterfaces()) {

                        if (ioc.containsKey(i.getName())) { // 如果接口有多个实现类，那么就只能抛异常了
                            throw new Exception("The beanName is exists");
                        }

                        ioc.put(toLowerFisrtCase(i.getSimpleName()), instance);
                    }
                }
            }
        } catch (Exception ex) {
            ex.printStackTrace();
        }

    }

    // 类名首字母小写
    private String toLowerFisrtCase(String simpleName) {
        char[] chars = simpleName.toCharArray();
        chars[0] += 32;
        return String.valueOf(chars);
    }

    private void doScanner(String scanPackage) {
        // 替换包路径
        URL resource = this.getClass().getClassLoader().getResource("/" + scanPackage.replaceAll("\\."
                , "/"));
        File classPath = new File(resource.getFile());

        for (File file : classPath.listFiles()) {
            if (file.isDirectory()) { // 判断是个文件夹
                doScanner(scanPackage + "." + file.getName());
            } else {
                // 取反，减少代码嵌套 提高代码可读性
                if (!file.getName().endsWith(".class")) // 只处理class文件
                    continue;
                // 类的全类名,可以通过反射 Class.forName() 可以拿到类对象， 进而创建对象
                String className = (scanPackage + "." + file.getName().replace(".class", "")); // 构建全路径名
                classNames.add(className); // 保存全部的全类名
            }
        }

    }


    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        //super.doGet(req, resp);
        log.info("执行MyDispatcherServlet的doGet()");
        try {
            //处理请求
            doDispatch(req, resp);
        } catch (Exception e) {
            e.printStackTrace();
            resp.getWriter().write("500!! Server Exception");
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        try {
            doDispatch(req, resp); // 进行方法调用
        } catch (Exception ex) {
            ex.printStackTrace();
            resp.getWriter().write("500 Request Fail");
        }
    }

    private Handler getHandler(HttpServletRequest req) {
        if (handlerMapping.isEmpty()) {
            return null;
        }
        String url = req.getRequestURI();
        String contextPath = req.getContextPath();
        url = url.replace(contextPath, "").replaceAll("/+", "/");
        for (Handler handler : handlerMapping) {
            Matcher matcher = handler.pattern.matcher(url);
            if (!matcher.matches()) {
                continue;
            }
            return handler;
        }
        return null;
    }

    private void doDispatch(HttpServletRequest req, HttpServletResponse res) throws IOException, InvocationTargetException, IllegalAccessException {
        // 调用具体的方法
        Handler handler = getHandler(req);
        if (handler == null) {
            res.getWriter().write("404 not found.");
            return;
        }
        Class<?>[] paramTypes = handler.method.getParameterTypes(); // 构建所有的方法参数（方法本身）
        Object[] paramValues = new Object[paramTypes.length];
        Map<String, String[]> params = req.getParameterMap(); // 获取请求参数 （浏览器传入参数）
        for (Map.Entry<String, String[]> param : params.entrySet()) { // 遍历所有的请求参数
            String value = Arrays.toString(param.getValue()).replaceAll("\\[|\\]", "");// 去掉 中括号 “[]”
            if (!handler.paramIndexMapping.containsKey(param.getKey())) { // 判断参数是否 在 参数 集合中存在
                continue;
            }
            int index = handler.paramIndexMapping.get(param.getKey());
            paramValues[index] = convert(paramTypes[index], value);
        }
        // 处理 HttpServletRequest  和 HttpServletResponse 参数
        int reqIndex = handler.paramIndexMapping.get(HttpServletRequest.class.getName());
        paramValues[reqIndex] = req;
        int resIndex = handler.paramIndexMapping.get(HttpServletResponse.class.getName());
        paramValues[resIndex] = res;
        handler.method.invoke(handler.controller, paramValues);  // 利用反射调用执行
    }

    private Object convert(Class<?> type, String value) { // 参数转换
        if (Integer.class == type) {
            return Integer.valueOf(value);
        }
        if(Long.class  == type){
            return  Long.parseLong(value);
        }
        return value;
    }

    /**
     * 加载配置文件
     *
     * @param contentConfigLocation
     */
    private void doLoadConfig(String contentConfigLocation) {
        // 去ClassPath 去中找到application.contextConfig 配置文件，并且读取出来
        InputStream resourceAsStream = this.getClass().getClassLoader().getResourceAsStream(contentConfigLocation);
        try {
            contextConfig.load(resourceAsStream);
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            if (null != resourceAsStream) {
                try {
                    resourceAsStream.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
    }
    @Override
    public void destroy() {
        super.destroy();
    }
}
```

## Handler 类
```java 
package com.spruce.mini.spring.framework.base;

import com.spruce.mini.spring.framework.annotation.KennyRequestParam;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.lang.annotation.Annotation;
import java.lang.reflect.Method;
import java.util.HashMap;
import java.util.Map;
import java.util.regex.Pattern;

public class Handler {

    public Object controller;
    public Method method;
    public Pattern pattern;
    public Map<String, Integer> paramIndexMapping;

    public Handler(Pattern pattern, Object controller, Method method) {
        this.pattern = pattern;
        this.controller = controller;
        this.method = method;
        paramIndexMapping = new HashMap<String, Integer>(); // key 为参数的名字 值为参数的索引值
        putParamIndexMapping(method);
    }

    private void putParamIndexMapping(Method method) {
        Annotation[][] methodParameterAnnotations = method.getParameterAnnotations(); // 获取方法上的注解
        for (int i = 0; i < methodParameterAnnotations.length; i++) {
            for (Annotation a : methodParameterAnnotations[i]) {
                if (a instanceof KennyRequestParam) {
                    String paramName = ((KennyRequestParam) a).value();
                    if (!"".equals(paramName)) {
                        paramIndexMapping.put(paramName, i);
                    }
                }
            }
        }
        Class<?>[] paramTypes = method.getParameterTypes(); // 获取方法的所有参数
        for (int i = 0; i < paramTypes.length; i++) {
            Class<?> type = paramTypes[i];
            if (type == HttpServletRequest.class || type == HttpServletResponse.class) {
                paramIndexMapping.put(type.getName(), i);
            }
        }
    }


}

```

## TestController 
```java 
package com.spruce.mini.spring.mvc.controller;


import com.spruce.mini.spring.framework.annotation.KennyAutowired;
import com.spruce.mini.spring.framework.annotation.KennyController;
import com.spruce.mini.spring.framework.annotation.KennyRequestMapping;
import com.spruce.mini.spring.framework.annotation.KennyRequestParam;
import com.spruce.mini.spring.mvc.service.TestService;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@KennyController
@KennyRequestMapping("test")
public class TestController {

    @KennyAutowired
    private TestService testService;

    @KennyRequestMapping("mvc")
    public String mvc(HttpServletRequest request, HttpServletResponse response, @KennyRequestParam("name") String name,
                      @KennyRequestParam("addr")String addr) {
        String resp = testService.test(name, addr);
        response.setContentType("application/json;charset=UTF-8");
        try {
            response.getWriter().write(resp);
        } catch (IOException e) {
            e.printStackTrace();
        }
        return "index";
    }
}

```

## TestService 接口
```java 
package com.spruce.mini.spring.mvc.service;

public interface TestService {
    String test(String name, String address);
}

```

### TestServiceImpl 接口实现类
```java  
package com.spruce.mini.spring.mvc.service.impl;


import com.spruce.mini.spring.framework.annotation.KennyService;
import com.spruce.mini.spring.mvc.service.TestService;

@KennyService
public class TestServiceImpl implements TestService {

    public String test(String name, String address) {

        return "Mvc success " + name + ": 地址" + address;
    }
}
```
