---
title: 单例模式
---

```java 
public class Singleton {
    //声明一个静态匿名内部类
    //private 私有保证别人不能修改
    private static class LazyHolder{
        private static final Singleton INSTANCT = new Singleton();
    }
    private Singleton(){}//将默认构造函数私有化，防止在外部new对象出来
    //提供静态方法获取实例
    //设置final确保不能被覆盖
    public static final Singleton getInstance(){
        return  LazyHolder.INSTANCT;
    }

}
```