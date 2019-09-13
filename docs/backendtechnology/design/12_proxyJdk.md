---
title: JDK动态代理(方法增强)
---
## 简介

代理模式是一种常用的设计模式，在AOP、RPC等诸多框架中均有它的身影。根据代理类的创建时机和创建方式的不同，
可以将其分为静态代理和动态代理两种形式：在程序运行前就已经存在的编译好的代理类是为静态代理，在程序运行期间根据需要动态创建代理类及其实例来完成具体的功能是为动态代理。代理模式的目的就是为真实业务对象提供一个代理对象以控制对真实业务对象的访问，代理对象的作用有：

* 代理对象存在的价值主要用于拦截对真实业务对象的访问；

*代理对象具有和目标对象(真实业务对象)实现共同的接口或继承于同一个类；

* 代理对象是对目标对象的增强，以便对消息进行预处理和后处理。

## 原理
java动态代理是利用反射机制生成一个实现代理接口的匿名类，在调用具体方法前调用InvokeHandler来处理。

## 被代理类接口
```java 
//操作统一接口
public interface Operate {
    public void saying();
    public void watching();
}

```
## 被代理类
```java 

public class OperateImpl implements  Operate{
    public void saying() {
        System.out.println("开始说话了");
    }

    public void watching() {
        System.out.println("开始看电视了");
    }
}

```
## JDK代理类
```java 

import java.lang.reflect.InvocationHandler;
import java.lang.reflect.Method;
import java.lang.reflect.Proxy;

public class MyInvocationHandler implements InvocationHandler {

    private Object target;

    public MyInvocationHandler(Object target) {
        this.target = target;
    }

    public Object getProxyInstance(InvocationHandler invocationHandler){
        return  Proxy.newProxyInstance(target.getClass().getClassLoader(), target.getClass().getInterfaces(), this);
    }

    /**
     *
     * @param proxy  代理对象
     * @param method 代理的方法
     * @param args  真是对象的参数
     * @return
     * @throws Throwable
     */
    public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
        System.out.println("jdk代理了前置");
        Object obj = method.invoke(target, args);
        System.out.println("jdk代理了后置");
        return obj;
    }
}
```
## 测试
```java 

public class TestMain {
    public static void main(String[] args) {
        OperateImpl im = new OperateImpl();
        MyInvocationHandler my = new MyInvocationHandler(im);
        Operate proxyInstance = (Operate)my.getProxyInstance(my);
        proxyInstance.saying();
        proxyInstance.watching();
    }
}

```
#### 测试结果

```sh  
jdk代理了前置
开始说话了
jdk代理了后置
jdk代理了前置
开始看电视了
jdk代理了后置

```


## 注意
::: 注意
* JDK动态代理只能对实现了接口的类生成代理，而不能针对类
* Spring在选择用JDK还是CGLiB的依据：

   (1)当Bean实现接口时，Spring就会用JDK的动态代理

   (2)当Bean没有实现接口时，Spring使用CGlib是实现

　 (3)可以强制使用CGlib（在spring配置中加入<aop:aspectj-autoproxy proxy-target-class="true"/>）

* CGlib比JDK快？

　 (1)使用CGLib实现动态代理，CGLib底层采用ASM字节码生成框架，使用字节码技术生成代理类，比使用Java反射效率要高。唯一需要注意的是，CGLib不能对声明为final的方法进行代理，因为CGLib原理是动态生成被代理类的子类。

　 (2)在对JDK动态代理与CGlib动态代理的代码实验中看，1W次执行下，JDK7及8的动态代理性能比CGlib要好20%左右。
:::