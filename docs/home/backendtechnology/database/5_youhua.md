---
title: 数据库优化
---
## 执行计划
#### 什么是执行计划

使用EXPLAIN 关键字可以模拟优化器执行SQL查询语句，从而知道Mysql是如何处理你的SQL语句的，分析你的查询语句或者表结构的性能瓶颈
* 表的读取顺序
* 数据读取操作的操作类型
* 哪些索引可以使用
* 哪些索引实际被使用
* 表之间的引用
* 每张表有多少被优化器查询
#### 语法
<code>Explain </code> + <code>SQL</code>语句

执行计划分析
![mysql2](/img/database/mysql2.png)

1. id: 执行顺序，如果id相等的， 会按照从上往下依次查询， id越大越先执行
2. select_type : 查询类型， 
 * SIMPLE: （不包含UNION，不包含子查询，就是最简单的查询）
 * PRIMARY : 查询中若包含任何复杂的子查询，最外层的查询被标记为PRIMARY
 * SUBQUERY： 子查询
 * DERIVED： 衍生表查询
 * UNION： 若第二个查询带有UNION，则被标记为UNION
 * UNION RESULT: UNION的聚合结果

3. table: 操作的那张表
4. type ： type显示的是访问类型，是较为重要的一个指标，结果只是从最好到最坏
system > const > eq_ref > ref > rang > index > ALL
const : 经过一次就可以找到
eq_ref: 唯一性索引， 
ref: 不是唯一索引
rang : 带有between in 等
index: 查询列都是索引的
ALL： 全表扫描的
5： passbile_keys： 可能会用到的索引
6： key: 实际中使用的索引，如果为NULL，则没有使用索引


## SQL 优化原则
* 列类型选择 优先级： 整型 > date, tiime> enum, char > varchar > blob, text
* 选择列长度的时候，够用就行原则，不要设置过大， 比如声明varchar(100) 和varchar(300)， 在表联查的时候varchar(300)会占更多内存
* 尽量避免使用NULL




