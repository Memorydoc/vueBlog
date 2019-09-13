---
title: CGlib(方法增强)
---
## 简介

代理模式是一种常用的设计模式，在AOP、RPC等诸多框架中均有它的身影。根据代理类的创建时机和创建方式的不同，
可以将其分为静态代理和动态代理两种形式：在程序运行前就已经存在的编译好的代理类是为静态代理，在程序运行期间根据需要动态创建代理类及其实例来完成具体的功能是为动态代理。代理模式的目的就是为真实业务对象提供一个代理对象以控制对真实业务对象的访问，代理对象的作用有：

* 代理对象存在的价值主要用于拦截对真实业务对象的访问；

*代理对象具有和目标对象(真实业务对象)实现共同的接口或继承于同一个类；

* 代理对象是对目标对象的增强，以便对消息进行预处理和后处理。

## 原理
而cglib动态代理是利用asm开源包，对代理对象类的class文件加载进来，通过修改其字节码生成子类来处理


## 被代理类
```java 
public class OperateImpl {
    public String saying() {
        System.out.println("开始说话了");
        return "说话的返回值";
    }

    public String watching() {
        System.out.println("开始看电视了");
        return "看电视的返回值";
    }
}
```

## CGlib代理类
```javascript
import net.sf.cglib.proxy.Enhancer;
import net.sf.cglib.proxy.MethodInterceptor;
import net.sf.cglib.proxy.MethodProxy;
import java.lang.reflect.Method;

public class CglibProxy implements MethodInterceptor {
    private Enhancer enhancer = new Enhancer();

    public Object getProxyInstance(Class clazz) {//创建代理子类
        enhancer.setSuperclass(clazz);
        enhancer.setCallback(this);
        return enhancer.create();
    }

    public Object intercept(Object o, Method method, Object[] objects, MethodProxy methodProxy) throws Throwable {
        System.out.println("cglib动态代理前置， 代理了" + method.getName());
        Object o1 = methodProxy.invokeSuper(o, objects);///返回值是代理方法执行之后的结果
        System.out.println("cglib动态代理后置 代理了" + method.getName());
        return o1;
    }
}
```

## 测试
```java 
public class testMain {
    public static void main(String[] args) {
        OperateImpl o = new OperateImpl();
        CglibProxy cglibProxy =new CglibProxy();
        OperateImpl proxyInstance = (OperateImpl)cglibProxy.getProxyInstance(o.getClass());
        proxyInstance.saying();

        proxyInstance.watching();
    }
}

```
#### 测试结果
```sh 
cglib动态代理前置， 代理了saying
开始说话了
cglib动态代理后置 代理了saying
cglib动态代理前置， 代理了watching
开始看电视了
cglib动态代理后置 代理了watching

```

## 注意
::: 注意
* CGLIB是针对类实现代理，主要是对指定的类生成一个子类，覆盖其中的方法（继承）
* Spring在选择用JDK还是CGLiB的依据：

   (1)当Bean实现接口时，Spring就会用JDK的动态代理

   (2)当Bean没有实现接口时，Spring使用CGlib是实现

　 (3)可以强制使用CGlib（在spring配置中加入<aop:aspectj-autoproxy proxy-target-class="true"/>）

* CGlib比JDK快？

　 (1)使用CGLib实现动态代理，CGLib底层采用ASM字节码生成框架，使用字节码技术生成代理类，比使用Java反射效率要高。唯一需要注意的是，CGLib不能对声明为final的方法进行代理，因为CGLib原理是动态生成被代理类的子类。

　 (2)在对JDK动态代理与CGlib动态代理的代码实验中看，1W次执行下，JDK7及8的动态代理性能比CGlib要好20%左右。
:::