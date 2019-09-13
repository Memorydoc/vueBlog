---
title: 建造者模式
---

## 模型
* Product（产品类）：需要被构建的复杂对象
* Builder（抽象建造者）：规范产品的组建，一般是由子类实现具体的组件过程
* ConcreteBuilder（具体建造者）：实现抽象接口，构建复杂对象
* Director（指挥者）:构造一个使用Builder接口的对象

## 情景模拟

实现一个计算器



## 使用普通的建造者模式
```sh  
private int reult = 0;
```

### 实现一个Builder类
```java 
public abstract class Builder {

    public abstract void add(int val);

    public abstract void substract(int val);

    public abstract void multiply(int val);

    public abstract void divide(int val);

    public abstract int getResult();

}
```
Builder类规范了计算器最终的结果是由加减乘除相关方法造成的。

### 实现ConcreteBuilder类
```java 
public class Math1Builder extends Builder {

    private int reult = 0;

    @Override
    public void add(int val) {
        reult += val;
    }

    @Override
    public void substract(int val) {
        reult -= val;
    }

    @Override
    public void multiply(int val) {
        reult *= val;
    }

    @Override
    public void divide(int val) {
        reult /= val;
    }

    @Override
    public int getResult() {
        return reult;
    }
}
```

### 实现一个Director类
```java 
public class Director {
    private Builder mBuilder;

    public Director(Builder builder){
        this.mBuilder = builder;
    }

    //构建对象
    public void create(int num1,int num2,int num3,int num4){
        mBuilder.add(num1);
        mBuilder.substract(num2);
        mBuilder.multiply(num3);
        mBuilder.divide(num4);
    }
}
```
Director中的Create方法控制了构建过程：按顺序做加减乘除。

### 实现结果

```java 
  public static void main(String[] args) {
        Builder builder = new Math1Builder();

        Director director = new Director(builder);
        director.create(3,2,4,2);
        System.out.println("输出一个数："+builder.getResult());
    }
```

## 优化
```java 
public class Builder {

    private int result = 0;

    public Builder add(int val) {
        result += val;
        return this;
    }

    public Builder substract(int val) {
        result -= val;
        return this;
    }

    public Builder multiply(int val) {
        result *= val;
        return this;
    }

    public Builder divide(int val) {
        result /= val;
        return this;
    }

    public int getResult() {
        return result;
    }
}
```
在这个例子中，Director、Builder、甚至是Product类都直接省略掉了，只剩下一个ConcreteBuilder。这样调用更加灵活：
```java 
public static void main(String[] args) {
    int result = new Builder().add(3).substract(2).multiply(4).divide(2).add(3).getResult();
    System.out.println("输出一个数：" + result);
}
```

输出结果
```sh 
输出一个数：5
```

## 使用建造者模式 链式调用 创建对象
* 创建电脑产品对象 
```java 
package com.design.builder;

/**
 * @version 1.0
 * @program: springTest
 * @description: 电脑类，通过建造者模式建造一个复杂的类， 这里使用链式的建造者模式
 * @author: Kevin
 * @create: 2019-09-10 00:20
 **/
public class Computer {
    private String cpu;//主机
    private String graphics; //显卡
    private String soundCard;// 声卡
    //因为电脑的零件太多这里就不一一写了



    // 属性值都是取的 Builder中的值
    public Computer(Builder builder) {
        this.cpu = builder.cpu;
        this.graphics = builder.graphics;
        this.soundCard = builder.soundCard;
    }

    public static Builder newBuilder(){
        return  new Builder();
    }

    /// 每个set方法 都返回 Builder对象，这样就可以形成链式调用
    //这里的Builder类知识用
    static class  Builder{
        private String cpu;//主机
        private String graphics; //显卡
        private String soundCard;// 声卡

        public String getCpu() {
            return cpu;
        }

        public Builder setCpu(String cpu) {
            this.cpu = cpu;
            return this;
        }

        public String getGraphics() {
            return graphics;
        }

        public Builder setGraphics(String graphics) {
            this.graphics = graphics;
            return this;
        }

        public String getSoundCard() {
            return soundCard;
        }

        public Builder setSoundCard(String soundCard) {
            this.soundCard = soundCard;
            return this;
        }
        //最终的build 方法，可以返回创建后的对象
        public Computer build(){
            return  new Computer(this);
        }
    }

    @Override
    public String toString() {
        return "Computer{" +
                "cpu='" + cpu + '\'' +
                ", graphics='" + graphics + '\'' +
                ", soundCard='" + soundCard + '\'' +
                '}';
    }
}

```
### 测试获取电脑对象
```java 
package com.design.builder;

/**
 * @version 1.0
 * @program: springTest
 * @description:
 * @author: Kevin
 * @create: 2019-09-10 00:29
 **/
public class Test {
    public static void main(String[] args) {
        Computer.Builder builder = Computer.newBuilder();
        System.out.println(builder.setCpu("Inter").setGraphics("AMD显卡").setSoundCard("英伟达声卡").build());
    }
}

```

### 测试结果
```sh 
Computer{cpu='Inter', graphics='AMD显卡', soundCard='英伟达声卡'}
```