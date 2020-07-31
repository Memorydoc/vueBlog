---
title : Spring事务传播机制和隔离级别
---
> 不使用官方的语言，针对demo 进行自己的理解

1. Propagation.REQUIRED 
> 默认的传播机制， 只要当前有事务就用当前的事务，如果没有事务，则创建新事务

只要是在自己服务中的 service实现的方法， 都会进行回滚， 只需要在顶层调用就接口声明 @Transactional 注解即可

  ```java
@Transactional
    @Override
    public void test() {
        // 数据回滚
        LiveCropVideo liveCropVideo = new LiveCropVideo();
        liveCropVideo.setLiveNo("测试liveNo front");
        liveCropVideoMapper.insertSelective(liveCropVideo);
        //该方法是在同一个JVM中， 虽然是dubbo服务，但是实现类在当前服务中， test 实现类执行的数据会发生回滚
        liveCropVideoService.test();
        throw new RuntimeException("异常");
    }
```

2.Propagation.NOT_SUPPORTED 
> 该注解可以让当前方法 事务无效，也就是说，如果你在被调用的方法上 注解了@Transactional，但是当前方法
使用了    @Transactional(propagation=Propagation.NOT_SUPPORTED),那么当前方法就不会受到外层的事务影响
    
 ```java  
 
     //当前方法不受调用方 事务的影响，让自己强制无事务
     @Override
     @Transactional(propagation=Propagation.NOT_SUPPORTED)
     public void test() {
         LiveCropVideo liveCropVideo = new LiveCropVideo();
         liveCropVideo.setLiveNo("测试liveNo");
         liveCropVideoMapper.insertSelective(liveCropVideo);
         throw  new RuntimeException("测试事务"); // 即使是异常，也不会数据回滚
     }
 ```   
    
   
3. Propagation.REQUIRES_NEW 
> 创建一个新的事务， 老的事务挂起，当自己的事务执行完成之后，才会继续执行老的事务，这里时候的老的事务，其实
就是调用方开启的事务, 即使调用方使用的是 Propagation.NOT_SUPPORTED  传播机制，也仍然会回滚数据
 ```java
  @Override
     @Transactional(propagation=Propagation.REQUIRES_NEW)
     public void test() {
         LiveCropVideo liveCropVideo = new LiveCropVideo();
         liveCropVideo.setLiveNo("测试liveNo");
         liveCropVideoMapper.insertSelective(liveCropVideo);
         throw  new RuntimeException("啛啛喳喳错");
     }
```

4.Propagation.MANDATORY
> 必须在一个已有的事务中执行，否则报错

调用方  使用了非事务 propagation=Propagation.NOT_SUPPORTED
```java 
    @Transactional(propagation=Propagation.NOT_SUPPORTED)
    @Override
    public void test() {
        LiveCropVideo liveCropVideo = new LiveCropVideo();
        liveCropVideo.setLiveNo("测试liveNo front");
        liveCropVideoMapper.insertSelective(liveCropVideo);
        //该方法是在同一个JVM中， 虽然是dubbo服务，但是实现类在当前服务中， test 实现类执行的数据会发生回滚
        liveCropVideoService.test();
        throw new RuntimeException("异常");
    }
```
自己使用了 Propagation.MANDATORY 则会抛出异常
```sh 
org.springframework.transaction.IllegalTransactionStateException: No existing transaction found for transaction marked with propagation 'mandatory'
	at org.springframework.transaction.support.AbstractPlatformTransactionManager.getTransaction(AbstractPlatformTransactionManager.java:363)
	at org.springframework.transaction.interceptor.TransactionAspectSupport.createTransactionIfNecessary(TransactionAspectSupport.java:461)
	at org.springframework.transaction.interceptor.TransactionAspectSupport.invokeWithinTransaction(TransactionAspectSupport.java:277)
	at org.springframework.transaction.interceptor.TransactionInterceptor.invoke(TransactionInterceptor.java:96)
	at org.springframework.aop.framework.ReflectiveMethodInvocation.proceed(ReflectiveMethodInvocation.java:179)
	at org.springframework.aop.interceptor.ExposeInvocationInterceptor.invoke(ExposeInvocationInterceptor.java:92)
	at org.springframework.aop.framework.ReflectiveMethodInvocation.proceed(ReflectiveMethodInvocation.java:179)
	at org.springframework.aop.framework.JdkDynamicAopProxy.invoke(JdkDynamicAopProxy.java:213)
	at com.sun.proxy.$Proxy126.test(Unknown Source)
	at com.sprucetec.live.service.impl.LiveVideoThreeServiceImpl.test(LiveVideoThreeServiceImpl.java:442)
	at sun.reflect.NativeMethodAccessorImpl.invoke0(Native Method)
	at sun.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:62)
	at sun.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)
	at java.lang.reflect.Method.invoke(Method.java:498)
```
:::warning 说明
  Propagation.MANDATORY 传播机制要求当前必须在事务环境中，如果调用方没有事务，那么会抛出异常
:::
 
 5.Propagation.NEVER
 和上面的 Propagation.MANDATORY 恰恰相反，该传播机制要求必须调用方，必须不在事务中，否则抛出异常
 
 
 6.Propagation.SUPPORTS
 > 如果其他bean调用这个方法时，其他bean声明了事务，则就用这个事务，如果没有声明事务，那就不用事务
  
 7.Propagation.NESTED
 > 如果当前存在事务，则在嵌套的事务中执行（也就是调用方开启的事务），如果调用方没有开启事务， 也就是根本没有
 @Transactional 注解，结果为： 也会回滚数据， 就算调用方使用@Transactional(propagation = Propagation.NOT_SUPPORTED)
 结果还是: 回滚数据
 
 ## 简单理解 脏读 、不可重复读、 幻度
 
 * 脏读 ： 读到了别的事务 想要修改成的数据，单最终没有修改成功， 发生回滚了
 也就是说， 我读一条数据， 读到之后， 别人把这个数据改了，我又读到了，但是别人改了之后 程序发生异常了，
 回滚掉了，那么我又堵了，发现数据还和以前一样啊，但是中间怎么变化了呢？ 这个过程就是脏读
 * 不可重复读： 概念很容易和脏读混淆，最大的区别就是， 脏读是别人改我读到的数据，但是没有修改成功，
 不可重复读是别人修改成功了。
 * 幻度： 幻度是针对数据的 新增， 我读一部分数据，第一次读到了10条，后面别人往我搜索条件能查询出来的数据中添加了5
 条，然后我再读取的时候，发现是15条，这就产生了幻度
 
 ### 事务隔离级别
 * 读未提交（read uncommitted）：就是我可以读到别人未提交的数据，别人也可以读到我未提交的数据
 
 * 读已提交（read committed）： 我和别人都只能相互读到别人已经提交的数据，如果数据没有提交，那么不能读到
 可以避免脏读和不可重复读
 * 可重复读（repeatable read） ： innoDB 默认的隔离级别
 不管别人怎么操作我读到的数据，就算对我读到事务中的数据进行了修改，并且进行了提交， 只要我自己的事务没有提交 或者没有
 回滚（其实就是事务结束）， 那么我在自己的事务中永远读到的数据都是最开始读取的数据，并不会收别人修改、新增、删除等操作的影响
 。 可以避免脏读和不可重复读， 但是还是不能避免幻读，以为幻读是针对新增而产生的
 * 序列化（serializable）
 事务顺序执行，可以避免脏读、不可重复读、幻读 但是效率太差了，一般不会采用，在读写数据时， 是数据进行加锁，在没有获取到锁的前提
 下，是不能对数据进行任何修改删除操作的
 
 
 

