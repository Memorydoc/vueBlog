---
title: 适配器模式(类兼容、适配、功能合并)
---
## 简介
适配器模式（Adapter Pattern）是作为两个不兼容的接口之间的桥梁。这种类型的设计模式属于结构型模式，它结合了两个独立接口的功能。

这种模式涉及到一个单一的类，该类负责加入独立的或不兼容的接口功能。举个真实的例子，读卡器是作为内存卡和笔记本之间的适配器。您将内存卡插入读卡器，再将读卡器插入笔记本，这样就可以通过笔记本来读取内存卡。

我们通过下面的实例来演示适配器模式的使用。其中，音频播放器设备只能播放 mp3 文件，通过使用一个更高级的音频播放器来播放 vlc 和 mp4 文件。

## 案例场景
如果当前有两种 影音播放器分别是Mp4播放器和Vlc播放器， 当前有一个需求：客户方想要一个技能播放Mp4 有能播放Vlc的播放器,
并且能扩展更多的播放模式（例如能支持播放Mp3）

假设当前已经有两个类（Mp4Player 和 VlcPlayer）,都实现了AdvanceMediaPlayer （接口类，先进的媒体播放器，为了实现Mp4Player 和VlcPlayer 共同的播放功能，兼容类）
* 先进的媒体播放器(<code>AdvanceMediaPlayer</code>)
```java  
/**
 * @version 1.0
 * @program: springTest
 * @description: 先进的媒体播放器
 * @author: Kevin
 * @create: 2019-06-06 13:11
 **/
public interface AdvanceMediaPlayer {
    public void playVlc(String fileName);
    public void playMp4(String fileName);
}

```
## Mp4播放器<code>Mp4Player</code>
```java  
public class Mp4Player  implements  AdvanceMediaPlayer{
    @Override
    public void playVlc(String fileName) {

    }
    @Override
    public void playMp4(String fileName) {
        System.out.println("我是MP4播放器，我正在播放: " + fileName);
    }
}

```

## Vlc播放器<code>VlcPlayer</code>
```java  
public class VlcPlayer implements  AdvanceMediaPlayer {
    @Override
    public void playVlc(String fileName) {
        System.out.println("我是Vlc播放器，我正在播放: " + fileName);
    }

    @Override
    public void playMp4(String fileName) {

    }
}

```
::: tip 小提示
此时，我们要做的一件事就是，我们要通过传入不同的播放类型，使用不同的播放器，那我们会想到，
创建一个类（适配器类），创建一个接口类（先进的媒体播放器<code>AdvanceMediaPlayer</code>）的属性，通过传入不同的播放类型（<code>playType</code>）
调用不同的播放方法。 此时不同所有的播放器类都要通过多态的方式传入到适配器中，以备使用
:::
* 

所有的播放器都会有自己的播放功能（<code>play</code>）
所以要创建一个播放器接口（<code>MediaPlayer</code>）

```java  
//播放器接口
public interface MediaPlayer {
    public void play(String fileName, String playType) throws Exception;
}
```

::: tip
适配器也是一种播放器，所以要实现播放器接口。在这里你们或许会有一个疑问，为什么上面的Mp4播放器和Vlc播放器没有实现播放器接口，其实刚开始编写代码的时候，
可能会实现，但是为了将传统的播放器升级为先进的播放器，所以这里只是让传统播放器实现 先进播放器的接口，而仅仅让播放器适配器和下面介绍的 最终播放器实现播放器接口 
:::

## 播放器适配器<code>MediaAdapter</code>
```java 

/**
 * @version 1.0
 * @program: springTest
 * @description: 播放器适配器（通过该适配器可以调节不同播放器之间兼容性的问题）
 * 适配器要做到的就是要将传统的播放器和先进的播放器结合，使传统播放器兼容先进播放器
 * @author: Kevin
 * @create: 2019-06-06 13:16
 **/
//适配器要实现扩展方法，在这里MediaPlayer是要扩展成先进播放器的目标
public class MediaAdapter implements MediaPlayer {
    //适配器必须要将要扩展的类加载进来 （是先进的播放器AdvanceMediaPlayer）
    private AdvanceMediaPlayer advanceMediaPlayer;

    @Override
    public void play(String fileName, String playType) throws Exception {
        if (advanceMediaPlayer != null) {
            if(playType.equalsIgnoreCase("mp4")){
                advanceMediaPlayer.playMp4(fileName);
            }else {
                advanceMediaPlayer.playVlc(fileName);
            }
        } else {
            throw new Exception("不支持当前媒体类型");
        }
    }

    public MediaAdapter(String playType) {
        if (playType.equalsIgnoreCase("mp4")) {
            advanceMediaPlayer = new Mp4Player();
        } else if (playType.equalsIgnoreCase("vlc")) {
            advanceMediaPlayer = new VlcPlayer();
        } else {
            advanceMediaPlayer = null;
        }
    }
}

```

## 兼容播放器(Compatible)
内部通过传入播放器适配器，去调节匹配具体用哪一个种类的播放器
```java 

/**
 * @version 1.0
 * @program: springTest
 * @description: 播放器（当前播放器是适配器结合完成的结合体，兼容各种传统和先进播放器的所有功能）
 *                最终要实现的 兼容播放器
 * @author: Kevin
 * @create: 2019-06-06 13:13
 **/
public class CompatiblePlayer implements MediaPlayer {
    private MediaAdapter mediaAdapter;

    @Override
    public void play(String fileName, String playType) throws Exception {
        if (playType.equalsIgnoreCase("mp3")) {
            System.out.println("我是mp3播放器, 正在播放:" + fileName);
        } else if (playType.equalsIgnoreCase("vlc")
                || playType.equalsIgnoreCase("mp4")) {
            mediaAdapter = new MediaAdapter(playType);
            mediaAdapter.play(fileName, playType);
        } else {
            mediaAdapter = new MediaAdapter(playType);
            mediaAdapter.play(fileName, playType);
        }
    }
}
```
## 测试
```java 
/**
 * @version 1.0
 * @program: springTest
 * @description: 适配器模式测试方法
 * @author: Kevin
 * @create: 2019-06-06 13:32
 **/
public class Test {
    public static void main(String[] args) {
        try {
            CompatiblePlayer audioPlayer = new CompatiblePlayer();
            audioPlayer.play("beyond the horizon.mp3", "mp3");
            audioPlayer.play("alone.mp4", "mp4");
            audioPlayer.play("far far away.vlc", "vlc");
            audioPlayer.play("mind me.avi", "avi");//不支持avi类型
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}

```
#### 测试结果
```sh 
我是mp3播放器, 正在播放:beyond the horizon.mp3
我是MP4播放器，我正在播放: alone.mp4
我是Vlc播放器，我正在播放: far far away.vlc
java.lang.Exception: 不支持当前媒体类型
	at com.design.adapter.MediaAdapter.play(MediaAdapter.java:25)
	at com.design.adapter.CompatiblePlayer.play(CompatiblePlayer.java:24)
	at com.design.adapter.Test.main(Test.java:18)
Process finished with exit code 0

```





