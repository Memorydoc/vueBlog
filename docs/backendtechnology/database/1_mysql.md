---
title: mysql
---
## Mysql 锁
对表进行加锁,已只读的方法创建锁
特点： 如果是读锁，在同个session中对表进行修改会**报错**，
如果在不同的session中对表加了读锁的表进行修改操作，不会报错，二十**等待**
```sh 
lock table tableName READ
```
