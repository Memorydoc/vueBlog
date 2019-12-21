---
title: 策略模式
---

## 简介
::: warning
* 在策略模式（Strategy Pattern）中，一个类的行为或其算法可以在运行时更改。这种类型的设计模式属于行为型模式。

* 在策略模式中，我们创建表示各种策略的对象和一个行为随着策略对象改变而改变的 context 对象。策略对象改变 context 对象的执行算法。
:::

>下面模拟 加减乘除不同策略执行不同方法

### 创建Context

```java  
package com.pwc.design.strategy;
//执行策略者（策略模式） 也叫 Context上下文
public class Context {
    private Strategy strategy;
    public Context(Strategy strategy){
        this.strategy = strategy;
    }
    public int executeStrategy(int num1, int num2){
        return strategy.doOperation(num1, num2);
    }
}

```

### 创建策略接口
```java 
package com.pwc.design.strategy;
//声明一个策略接口
public interface Strategy {
    public int doOperation(int num1, int num2);
}
```


### 具体不同的策略
 1. 加法策略
```java  
package com.pwc.design.strategy;
//加的策略
public class StrategyAdd  implements  Strategy{
    public int doOperation(int num1, int num2) {
        return num1 + num2;
    }
}

```
2. 减法策略
```java 
package com.pwc.design.strategy;
//减的策略
public class StrategySubstract implements Strategy {
    public int doOperation(int num1, int num2) {
        return num1 - num2;
    }
}

```
3. 乘法策略
```java  
package com.pwc.design.strategy;
//乘的策略
public class StrategyMultiply implements Strategy {
    public int doOperation(int num1, int num2) {
        return num1 * num2;
    }
}

```

### 测试
```java  
package com.pwc.design.strategy;

public class TestMain {
    public static void main(String[] args) {
        Context executorStrategy = new Context(new StrategySubstract());
        System.out.println(executorStrategy.executeStrategy(143, 233));
    }
}

```


### 总结
*  优点： 1、算法可以自由切换。 2、避免使用多重条件判断。 3、扩展性良好。
*  将这些算法封装成一个一个的类，任意地替换。
*  策略模式主要是用来封装一组可以互相替代的算法族，并且可以根据需要动态地去替换 Context 使用的算法
