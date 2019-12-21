---
title: 自己实现静态代理
---
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
public class OperateImpl implements  Operate {
    public void saying() {
        System.out.println("我说话了");
    }

    public void watching() {
        System.out.println("我看电视了");
    }
}

```

## 代理类

```java 
package com.design.proxy.proxyown;

public class Proxy implements  Operate {
    private OperateImpl operateImpl;

    public Proxy(OperateImpl operateImpl) {
        this.operateImpl = operateImpl;
    }

    public void saying() {
        System.out.println("自定义代理前置");
            operateImpl.saying();
        System.out.println("自定义代理后置");
    }

    public void watching() {
        System.out.println("自定义代理前置");
        operateImpl.watching();
        System.out.println("自定义代理后置");
    }
}

```

## 测试类
```java 

public class TestMain {
    public static void main(String[] args) {
        Proxy proxy = new Proxy(new OperateImpl());
        proxy.saying();
        proxy.watching();
    }
}

```
#### 测试结果
```sh 
自定义代理前置
我说话了
自定义代理后置
自定义代理前置
我看电视了
自定义代理后置
```