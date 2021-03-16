---
title: 处理链模式
---
## 处理者一
```java 
package com.design.chain;
/**
 * @version 1.0
 * @program: springTest
 * @description: 处理者一
 * @author: Kevin
 * @create: 2019-08-26 10:10
 **/
public class ConcreteHandlerOne extends  Handler {
    public ConcreteHandlerOne(int level) {
        super(level);
    }

    @Override
    protected void handle(String message) {
        System.out.println("我是处理链一" + message);
    }
}

```

## 处理者二
```java 
package com.design.chain;

/**
 * @version 1.0
 * @program: springTest
 * @description:
 * @author: Kevin
 * @create: 2019-08-26 10:13
 **/
public class ConcreteHandlerTwo extends Handler {
    public ConcreteHandlerTwo(int level) {
        super(level);
    }

    @Override
    protected void handle(String message) {
        System.out.println("我是处理链二" + message);
    }
}
```
## 抽象处理器

```java 
package com.design.chain;

/**
 * @version 1.0
 * @program: springTest
 * @description: 抽象处理器
 * @author: Kevin
 * @create: 2019-08-26 09:56
 **/
public abstract class Handler {

    private static final int INFO = 1;//一级处理级别
    private static final int DEBUG = 2;//二级处理级别
    private static final int ERROR = 3;//三级处理级别

    protected  int level = 1;//默认一级处理级别

    public Handler(int level) {
        this.level = level;
    }
    private Handler nextHandler;//下一个处理器

    //获取下一个责任链
    private Handler nextHandler() {
        return nextHandler;
    }

    //设置下一个责任链
    public void setNextHandler(Handler handler) {
        this.nextHandler = handler;
    }

    abstract  protected  void handle(String message);//真正的处理逻辑在父类中不做处理，在子类中做处理

    //处理功能，判断是否存在处理链，如果存在则交由下一个处理链处理
    ///传入处理级别，设计责任链逻辑
    public void execute(int level, String message) {
        if(this.level <= level){//如果处理级别大于当前处理器的处理级别，那么全部处理
            //这里是不同的处理器的处理方法，
            //execute方法是公共的设计方法，具体的处理逻辑在每个处理器当中
            this.handle(message);
        }
        if(nextHandler != null){
            nextHandler.execute(level, message);
        }
    }
}

```

## 初始化处理链
```java 
package com.design.chain;

/**
 * @version 1.0
 * @program: springTest
 * @description: 初始化处理链
 * @author: Kevin
 * @create: 2019-08-26 10:10
 **/
public class InitHandler {
    public static Handler initChain(){
        ConcreteHandlerOne concreteHandler = new ConcreteHandlerOne(1);
        ConcreteHandlerTwo concreteHandlerTwo = new ConcreteHandlerTwo(2);
        concreteHandler.setNextHandler(concreteHandlerTwo);
        return  concreteHandler;
    }
}

```

## 测试类
```java 
package com.design.chain;

/**
 * @version 1.0
 * @program: 在当前处理链程序中，如果你不设置level级别，那么可以 按照顺序所有的处理链上的处理者进行执行
 * @description:
 * @author: Kevin
 * @create: 2019-08-26 10:14
 **/
public class Test {
    public static void main(String[] args) {
        Handler handler = InitHandler.initChain();//初始化处理链
        /*handler.execute(1, "哈哈哈哈");处理链一，只执行处理链一的内容*/
        handler.execute(2, "哈哈哈哈");

    }
}

```
#### 测试结果
```sh 
我是处理链一哈哈哈哈
我是处理链二哈哈哈哈
```
