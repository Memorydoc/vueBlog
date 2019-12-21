---
title: CAS
---
## CAS介绍
::: tip
在jdk 1.5中增加的一个最主要的支持是Atomic类，比如说AtomicInteger, AtomicLong，这些类可帮助最大限度地减少在多线程中对于一些基本操作（例如，增加或减少多个线程之间共享的值）的复杂性。而这些类的实现都依赖于CAS（compare and swap）的算法。 
:::
在CAS中有三个概念 cas只针对一个变量
 * 第一个是V（主存中的变量值）
 * 第二个是A  (当前存储当前线程中的变量值)
 * 第三个是B  (当前线程将要修改成的值)
通过调用unsafe的方法，可以通过偏移量获取属性值或设置属性值
获取属性偏移量的值
  ![cas1](/img/interviewtopic/cas1.png)

***
```java 
public final int getAndAddInt(Object var1, long var2, int var4) {
        int var5;
        do {
            var5 = this.getIntVolatile(var1, var2);
        } while(!this.compareAndSwapInt(var1, var2, var5, var5 + var4));

        return var5;
    }
```
（通过compareAndSwapInt方法可以获取线程中
的变量值， var1当前对象，var2 当前属性内存偏移量）
最后通过cas操作， compareAndSwapInt 这里只是针对int的介绍，还有 Object 、Long 
  ![cas1](/img/interviewtopic/cas2.png)
  
::: warning 提示
cas操作有一个特点： 当B的值返回将要修改V的值的时候，此时，会判断内存中的值和当前线程A的值 是否相等。当且仅当当前线程中的变量值A（一些文章中解释成预期值）和 主存中的变量值V 相等时，才会将主存中的V改成B（修改值）,否则将重新将V值赋给A值并重新计算得到B。
如果A值和V值总是不相等，那么会产生自旋。在循环中不断的进行CAS操作，就是主存中的值和线程中的值如果一直不相等，就一直等到他们相等，再修改成B值
在语言中不做处理，而是使用CPU和内存实现CAS
:::

  ![cas1](/img/interviewtopic/cas3.png)
  
## CAS中的ABA问题
如果一开始位置V得到的旧值是A，当进行赋值操作时再次读取发现仍然是A，并不能说明变量没有被其它线程改变过。有可能是其它线程将变量改为了B，后来又改回了A。大部分情况下ABA问题不会影响程序并发的正确性，如果要解决ABA问题，用传统的互斥同步可能比原子类更高效。
## ABA问题的解决办法
1.在变量前面追加版本号：每次变量更新就把版本号加1，则A-B-A就变成1A-2B-3A。
2.atomic包下的AtomicStampedReference类：其compareAndSet方法首先检查当前引用是否等于预期引用，并且当前标志是否等于预期标志，如果全部相等，则以原子方式将该引用的该标志的值设置为给定的更新值。