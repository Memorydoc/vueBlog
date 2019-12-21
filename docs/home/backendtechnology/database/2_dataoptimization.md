---
title: Mybatis 插入数据优化
---

## mybatis 一次性插入一万条数据

::: tip 场景再现
模拟四种场景:（方式四看具体业务场景，如果多线程会对业务产生影响，请不要使用，避免发生不必要的错误）
:::

**方式一:** 循环insert语句,server层是普通的mybatis插入方法
```java  
    //通过循环insert语句插入
    long begin1 = System.currentTimeMillis();

    for (int i1 = 0; i1 < cycleLength; i1++) {
        userService.insert(userList.get(i1));
    }
    long end1 = System.currentTimeMillis();
    System.out.println("通过循环insert语句插入消耗:" + String.valueOf(end1 - begin1));
```
**方式二:** 通过拼接xml语句的方式（推荐使用，但是sql语句长度达到1M的时候会报错，可以在mysql.ini文件中设置大小）
```java 
  //通过拼接xml语句的方式 forEach
        long begin2 = System.currentTimeMillis();
        userService.insertForEach(userList);
        long end2 = System.currentTimeMillis();
        System.out.println("通过拼接xml语句的方式 forEach消耗:" + String.valueOf(end2 - begin2));
```
对应的xml

```xml  
     <insert id="insertForEach">
    
        insert into user (id, username, password, address) values
        <foreach collection="lists" item="user" separator=",">
          (#{user.id}, #{user.username}, #{user.password},  #{user.address})
        </foreach>
    
      </insert>
```

**方式三:** 通过SqlSession 的Batch 批处理方式
```java  
    //通过mybatis批处理方式
    long begin3 = System.currentTimeMillis();
    userService.insertBatch(userList);
    long end3 = System.currentTimeMillis();
    System.out.println("通过mybatis批处理方式消耗:" + String.valueOf(end3 - begin3));
```
对应的servceImpl代码:
```java 
    public void insertBatch(List<User> lists) {
            SqlSession sqlSession = sqlSessionTemplate.getSqlSessionFactory().openSession(ExecutorType.BATCH, false);
            UserMapper mapper = sqlSession.getMapper(UserMapper.class);
            try {
                for (User _user : lists) {
                    mapper.insert(_user);
                }
                //统一提交
                sqlSession.commit();
            } catch (Exception e) {
                //没有提交的数据可以回滚
                sqlSession.rollback();
            } finally {
                //关闭 sqlSession
                sqlSession.close();
            }
        }
```

>下面是对应的耗时时间(毫秒):

```editorconfig
      方式一:  通过循环insert语句插入消耗:3937
      方式二:  通过拼接xml语句的方式 forEach消耗:114
      方式三:  通过mybatis批处理方式消耗:3187
```
***

**方式四:** 通过 **Executors** 开启线程池,配合CompletionService 完成多线程并发插入多条数据
::: warning 提示
这里使用上方得出来的最快的功能即:forEach方法插入批量数据到数据库, 让你体验多线程的魅力
调用方代码
:::

```java 

    //通过拼接xml语句的方式 forEach
    long begin2 = System.currentTimeMillis();
    userService.insertForEach(userList);
    long end2 = System.currentTimeMillis();
    System.out.println("通过拼接xml语句的方式 forEach消耗:" + String.valueOf(end2 - begin2));


    //通过拼接xml语句的current方式 forEach
    long begin3 = System.currentTimeMillis();
    userService.insertForEachCurrent(userList);
    long end3 = System.currentTimeMillis();
    System.out.println("通过拼接xml语句的current 的方式 forEach:" + String.valueOf(end3 - begin3));
    
```

调用多线程代码
```java 
 public void insertForEachCurrent(List<User> lists) {
        DataUtils dataUtils = new DataUtils();
        dataUtils.calcute(lists, 1, 10, userMapper);
    }
```
多线程批量插入（DataUtils 类中code）
```java 
    public void calcute(List list, int strategyCode, int threadCount, UserMapper userMapper) {
            ExecutorService executorService = Executors.newFixedThreadPool(threadCount);
            CompletionService<Integer> completionService = new ExecutorCompletionService<Integer>(executorService);
            List listNew = groupList(list, 10);
            for (int i = 0; i < threadCount; i++) {
                int finalI = i;
                Callable callable = () -> {
                    return userMapper.insertForEach((List<User>) listNew.get(finalI));
                };
                completionService.submit(callable);
            }
    
            for (int i = 0; i < threadCount; i++) {
                try {
                    completionService.take().get();
                } catch (InterruptedException e) {
                    e.printStackTrace();
                } catch (ExecutionException e) {
                    e.printStackTrace();
                }
            }
    
        }
    
        /**
         * @param list  分组数组
         * @param share 要分成多少分
         * @return
         */
        public static List<List<Object>> groupList(List<Object> list, int share) {
            List<List<Object>> listGroup = new ArrayList<List<Object>>();
            int listSize = list.size();
            int totalGroup = list.size() / share;
            int Remaining = (listSize % share);
            for (int i = 0; i < share; i++) {
                List<Object> newList = null;
                if (share - i == 1) {
                    newList = list.subList(i * totalGroup, (i + 1) * totalGroup + Remaining);
                } else {
                    newList = list.subList(i * totalGroup, (i + 1) * totalGroup);
                }
                listGroup.add(newList);
            }
            return listGroup;
        }

```
看执行结果：
            
            方式三: 通过拼接xml语句的方式 forEach消耗:892
            方式四: 通过拼接xml语句的current 的方式 forEach:242




### 总结
通过forEach 循环拼接sql语句是最快的，不知道为啥， 通过mybatis批处理的方式应该也挺快的，但是经过真实测试，竟然没有比循环插入的方式快多少
批处理方式会重复利用mybatis预编译的sql，原理上应该更快的。有点困惑，还请大神指出。   
Mybatis内置执行器类型ExecutorType有3种
分别是
ExecutorType.SIMPLE: 不做特殊处理，为每个语句的执行创建一个新的预处理语句。   
ExecutorType.REUSE: 可以复用预处理语句。   
ExecutorType.BATCH:可以批量执行所有更新语句  
    
**SIMPLE与BATCH（批量）对比**   
默认的是simple，该模式下它为每个语句的执行创建一个新的预处理语句，单条提交sql；
而batch模式重复使用已经预处理的语句，并且批量执行所有更新语句，显然batch性能将更优；但是批量模式无法返回自增主键


::: tip  叮嘱
在能用多线程的情况下，尽量使用多线程。当然没有必要用的时候，也不要用，反正多线程真是魅力无限。可以迅速减少你系统的相应时间和提高
系统吞吐量。尤其是在系统反应很缓慢的时候，数据量太大的时候，可以考虑多线程优化java（在单体，当然可以使用分布式）,
同时优化数据，优化jvm
:::


    