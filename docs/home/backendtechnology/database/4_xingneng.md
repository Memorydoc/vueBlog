---
title: 慢查询 
---
## 慢查询 
慢查询日志，顾名思义就是查询慢的日志。是指mysql记录所有执行时间超过<code>long_query_time</code>参数设定的时间阀值语句的日志，
该日志能为SQL语句的优化带来很好的帮助，默认情况下，慢查询日志总是关闭的。要使用慢查询日志功能，首先要开启慢查询日志的功能


**常用配置**

* slow_query_log 启动停止技术慢查询日志
* slow_query_log_file 指定慢查询日志的存储路径及文件（查看数据存放路径<code>SHOW VARIABLES LIKE 'datadir'</code>）
* long_query_time 指定记录慢查询日志SQL执行时间的阀值（单位：秒， 默认 10秒）
* log_queries_not_using_indexes 是否记录未使用索引的SQL
* log_output 日志村存放的地方（可以是TABLE 可以是FILE， 最好不存在TABLE中，最好使用默认值FILE）


### 查看mysql数据库全局参数

```sh 
SHOW VARIABLES LIKE '%slow_query_log%'
```
## 显示结果
![mysql](/img/database/mysql1.png)

### 开启慢查询日志功能
**(1 代表开启)**， 设置阀值时间为5秒
```sh 
SET GLOBAL long_query_time  = 1
# 设置阀值时间为5秒
SET GLOBAL  long_query_time = 5;
```

## 慢查询分析工具
* （mysqldumpslow.pl） 在<code>mysql</code>安装目录的<code>bin</code>下
```sh 
mysqldumpslow.pl -s t -t 10 D:\xxx.log
```

* (pt_query_digest)
需要知道mysql服务器数据库的用户名 host username password
```sh 
perl pt-query-digest --explain h= 127.0.0.1, u = root, p  = password  slow-mysql.log
```