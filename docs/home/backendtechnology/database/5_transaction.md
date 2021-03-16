---
title: 事务
---

## spring事务隔离级别与传播机制
隔离级别：

1、ISOLOCATION_DEFAULT:  数据库默认级别 对应着  REPEATABLE_READ（可重复读： 意思就是在一个事务中，读取同一个值， 不管都多少次值都是不变的，叫做可重复读）

2、ISOLOCATION_READ_UNCOMMITTED: 允许读取未提交的读， 可能导致脏读，不可重复读，幻读

3、ISOLOCATION_READ_COMMITTED:  读取的数据必须是已提交的数，可能导致不可重复读，幻读

4、ISOLOCATION_REPEATABLE_READ : 不能能更新另一个事务修改单尚未提交(回滚)的数据，可能引起幻读

5、ISOLOCATION_SERIALIZABLE: 序列执行效率低

 

## 传播级别：

1、PROPERGATION_MANDATORY:　方法必须运行在一个事务中，不存在事务则抛出异常

2、PROPERGATION_NESTED:　　存在事务则运行在嵌套事务中，不存在则创建一个事务

3、PROPERGATION_NEVER: 当前方法不能运行在事务中，存在事务则抛出异常

4、PROPERGATION_NOT_SUPPORT: 当前存在事务则将其 挂起

5、PROPERGATION_REQUIRED: 不存在事务则创建一个事务

6、PROPERGATION_REQUIRES_NEW:  新建一个自己的事务，不论当前是否存在事务

7、PROPERGATION_SUPPORT: 存在事务则加入，不存在也可以
