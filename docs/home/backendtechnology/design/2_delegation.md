---
title: 委派模式（分配任务，统一管理）
---
## 案例场景
假设某开发公司的一个项目经理正在分配任务。 不同的员工应该对应不同的任务

## 创建任务执行接口(IExecutor)
```java 
public interface IExecutor {
    //普通员工执行任务
    void doing();
}
```
## 员工A(TargetA)
员工需要实现动作接口，即任务接口

```java 
//普通员工A
public class TargetA implements IExecutor {
    public void doing() {
        System.out.println("员工A开始执行销售任务");
    }
}
```

## 员工B(TargetB)
员工需要实现动作接口，即任务接口
```java 
//普通员工B
public class TargetB implements IExecutor {
    public void doing() {
        System.out.println("员工B开始执行开发任务");
    }
}
```
## 项目经理
在构造器中设置不同的任务规则， 保存到任务集合中（Map）
```java 
//项目经理（委派模式）
public class Dispatcher  {
    private Map<String, IExecutor> targets = new HashMap<String, IExecutor>();
    //制定任务规则，具体下发任务
    public Dispatcher(){
        targets.put("sale", new TargetA());//销售任务给A员工
        targets.put("development", new TargetB());//开发任务给B员工
    }
    //dispatcher 委派方法，但是项目经理的doing方法是委派员工去做
    public IExecutor dispatcher(String executor) throws Exception {//项目经理根据传入的任务内容分配给具体的员工去执行
            if(targets.get(executor) == null){
                throw new  Exception("该任务没有被分配");
            }
        return targets.get(executor);
    }
}
```
## 测试
```java 
public class TestMain {
    public static void main(String[] args) {
        try {
            new Dispatcher().dispatcher("sss").doing();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

}
```

```sh  
java.lang.Exception: 该任务没有被分配
	at com.design.delegation.Dispatcher.dispatcher(Dispatcher.java:16)
	at com.design.delegation.TestMain.main(TestMain.java:6)
```

```java 
public class TestMain {
    public static void main(String[] args) {
        try {
            new Dispatcher().dispatcher("sale").doing();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

}

```
```sh 
员工A开始执行销售任务
```





