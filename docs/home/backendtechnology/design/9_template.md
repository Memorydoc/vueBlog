---
title: 模板模式（自定义框架，具体方法用户自己实现）
---

## 情景案例
假设有一个游戏模板，针对于这个游戏模板开发两款游戏<code>Cricket游戏</code> 和 <code>Sport游戏</code>

## 原理
封装不变的内容，将可扩展的内容公开出来，供子类实现具体的业务。提取公共代码，便于维护。行为由父类控制，子类实现

## 游戏模板类
```java 
///游戏模板（模板模式）
public abstract class Game {
    abstract  void init();
    abstract  void startPlay();
    abstract  void endPlay();

    public void play(){
        init();

        startPlay();

        endPlay();
    }
}
```

## Cricket游戏

```java  
public class Cricket extends  Game {
    void init() {
        System.out.println("初始化Cricket游戏");
    }

    void startPlay() {
        System.out.println("开始cricket游戏");
    }

    void endPlay() {
        System.out.println("结束cricket游戏");
    }
}
```
## Sport游戏

```java 

public class Sport extends  Game {
    void init() {
        System.out.println("初始化sport游戏");
    }

    void startPlay() {
        System.out.println("开始sport游戏");
    }

    void endPlay() {
        System.out.println("结束sport游戏");
    }
}

```

## 测试
```java 
public class MainTest {
    public static void main(String[] args) {
        Game game = new Cricket();
        game.play();
    }
}
```

#### 测试结果
```sh 
初始化Cricket游戏
开始cricket游戏
结束cricket游戏
```