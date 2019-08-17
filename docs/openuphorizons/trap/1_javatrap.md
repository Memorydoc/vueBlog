---
title: JAVA 陷阱
---

##  Java中两个Long对象如何比较是否相等

:::tip  
Long a = 4l;
Long b = 4l;
a == b //true   
Long a = 128l;
Long b = 128l;
a == b //false
:::

::: danger 注意
如果Long的值在[-127,128]之间，用“==”判断是否相等是没问题的，如果不在这个区间，是不能用“==”的
:::

原因如下源码解释：

```java 
public static Long valueOf(long l) {
        final int offset = 128;
        if (l >= -128 && l <= 127) { // will cache
            return LongCache.cache[(int)l + offset];
        }
        return new Long(l);
    }
```
如果不在[-127,128]之间，则会new一个新对象，自然“==”两个不同的对象，其结果必然是false了。




::: warning 解决方案：
1:使用Long中的longValue()进行转换

Long a = 128l;
Long b = 128l;
a.longValue() == b.longValue() //true      

2:使用Long中的equals()   
Long a = 128l;
Long b = 128l;
a.equals(b);//true   
:::

下面是该方法源码：

```java  
    public boolean equals(Object obj) {
            if (obj instanceof Long) {
                return value == ((Long)obj).longValue();
            }
            return false;
            }
```