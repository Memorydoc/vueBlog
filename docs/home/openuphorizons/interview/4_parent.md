---
title: 双亲委派模型
---
## 判断一会类是否唯一
* 由本来决定
* 由加载 该类的类加载器决定
只有同时满足上面两点，才能保证一个类是否唯一

::: dander
在同一个tomcat运行多个项目， 如果有多个项目同时 拥有一个 包名和类名都 **相同** 的时候， tomcat是分配不同的WebApplication ClassLoader
因为**类加载器** 不同，所以实现了隔离
:::

![classload](/img/openuphorizons/classloader.png)

## 启动类加载器 BootStrap ClassLoader
加载<JAVA_HOME>\lib 文件夹的文件，并且是虚拟机识别的类库加载到虚拟机中

## 扩展类加载器 Extensioin ClassLoader
加载<JAVA_HOME>\lib\ext 文件夹中的文件，开发者可以使用

## 应用程序下载类 Application ClassLoader
加载 classpath 下的类

## 双亲委派模型 源码实现
不是继承实现的， 是委派实现的
```java 
protected Class<?> loadClass(String name, boolean resolve)
        throws ClassNotFoundException
    {
        synchronized (getClassLoadingLock(name)) {
            // First, check if the class has already been loaded
            Class<?> c = findLoadedClass(name);
            if (c == null) {
                long t0 = System.nanoTime();
                try {
                    if (parent != null) {
                        c = parent.loadClass(name, false);
                    } else {
                        c = findBootstrapClassOrNull(name);
                    }
                } catch (ClassNotFoundException e) {
                    // ClassNotFoundException thrown if class not found
                    // from the non-null parent class loader
                }

                if (c == null) {
                    // If still not found, then invoke findClass in order
                    // to find the class.
                    long t1 = System.nanoTime();
                    c = findClass(name);

                    // this is the defining class loader; record the stats
                    sun.misc.PerfCounter.getParentDelegationTime().addTime(t1 - t0);
                    sun.misc.PerfCounter.getFindClassTime().addElapsedTimeFrom(t1);
                    sun.misc.PerfCounter.getFindClasses().increment();
                }
            }
            if (resolve) {
                resolveClass(c);
            }
            return c;
        }
    }
```

## 破坏双亲委派模型
 ### JNDI破坏双亲委派模型 
 JNDI是Java标准服务，它的代码由启动类加载器去加载。但是JNDI需要回调独立厂商实现的代码，而类加载器无法识别这些回调代码（SPI）。 
 为了解决这个问题，引入了一个线程上下文类加载器。 可通过Thread.setContextClassLoader()设置。 
 利用线程上下文类加载器去加载所需要的SPI代码，即父类加载器请求子类加载器去完成类加载的过程，而破坏了双亲委派模型
 ### Spring破坏双亲委派模型 
 Spring要对用户程序进行组织和管理，而用户程序一般放在WEB-INF目录下，由WebAppClassLoader类加载器加载，而Spring由Common类加载器或Shared类加载器加载。 
 那么Spring是如何访问WEB-INF下的用户程序呢？ 
 
 使用线程上下文类加载器。 Spring加载类所用的classLoader都是通过Thread.currentThread().getContextClassLoader()获取的。当线程创建时会默认创建一个AppClassLoader类加载器（对应Tomcat中的WebAppclassLoader类加载器）： setContextClassLoader(AppClassLoader)。 
 利用这个来加载用户程序。即任何一个线程都可通过getContextClassLoader()获取到WebAppclassLoader