---
title: 面试题目
---

::: tip 友情提示
带公司名称的并不是作者本人经历的面试，而是某位热衷技术的同事经历的面试（就职于阿里巴巴）
:::

##  阿里云 开放api


* 项目 应用架构

* hashmap

* redis 数据淘汰策略

* jvm gc

* 怎样判断链表中存在环

* 类加载 双亲委派



## 京东 开普勒

* 类反射

* 暴力反射（私有属性、私有方法）

* ioc、aop问很多 动态代理 cglib、jdk

* 手写阻塞队列

## 0825蚂蚁金服

* 项目经历

* future 同步任务等

* concurrent包 线程池

* 数据库索引 分库策略

* jvm gc清理策略 cms g1

## 阿里

* 项目

* future模式 异步调用多个服务

* 数据库索引

* 线程池

* 阻塞队列实现

* sleep和wait区别

## 京东
* shell $0输出什么   脚本名
* JVM调优经验
* 设计模式
* 线程异步
* collections.sort实现
* 事务的传播机制
* concurrentHashMap原理

## 京东
1、项目
2、算法 25人 5个跑道 比赛出前三，需要几次
3、数据库 范式
4、其他

## 京东视频面


* 项目
* MQ如何保证消息不丢失
* 外界消息如何接入


## 转转

* list和set区别

* 设计模式 策略模式、观察者模式

* hashmap 线程安全问题

* shell awk统计词频

* 如何保证线程安全

* 线程池

* dubbo如何实现序列化，不停机更新

* 如何查看zk服务列表，连接zk

* 怎样判断线程都执行结束

* MYSQL原理 INNODB 索引原理



## 京东电面

* 线程如何保证安全

* syncronized 和 volatile的区别


* 原子数据类型 （8个都是

* 高可用、灾备

* 线上问题

* 阻塞队列

* 内存溢出场景

* volatile如何保证一致 （原子性、可见性、有序性



## 便利蜂

* 项目

* failover重连设计 数据结构set

* dubbo协议

* 数据库 事务


## 到家司机端初


* 设计模式 手写单例 双重检查

* 阻塞队列 手写，拒绝策略 syncronized锁

* MQ协议  KAFKA、rabbitMQ


## 到家初

* Spring 的启动 、Spring如何管理对象的声明周期

* Spring MVC 的处理流程

* Spring 使用了哪些设计模式。FactoryBean、BeanFactory

* HashMap的基本原理

* Dubbo的原理、协议 http、dubbo等

* Dubbo和Zk的关系，心跳、选举、Failover的机制（update、select各该使用哪种机制）

* Redis五大数据结构，分布式锁

* Redis持久化 rdb、aof

* Redis分布式锁

* Queue offer、poll的lock锁

* Sync和lock的区别 
* 数据库分表根据 A&B两个键共同分表   
* Oracle特性 原子、一致、隔离、持久  ACID     
* 事务隔离级别   
* 系统更新步骤，切断数据来源（Socket连接池）、监控线程状态、心跳去判断是否可以停止服务     
* linux基本指令    

## 新浪初（死亡）    

* spring的作用    
* spring ioc 和 aop 底层实现   
* bean如何实现注入   
* spring如何管理对象   
* dubbo、zookeeper的原理   
* dubbo具体实现    
* RPC框架是如何实现的   
* 进程间如何通信？当页面修改了某条数据，其他端如何同步这条数据的状态   
* GC的原理和算法 survivor如何移除要清理的对象   
* shell脚本如何向内核发起命令   
* oracle 脚本的目的   
* 设计模式   
* kafka  partition数>=消费者数   
* 四类引用   
* 手写算法IP压缩成INT   