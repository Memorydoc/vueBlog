---
title: JVM 原理
---

## 常用命令
* 将Java文件编译成<code>.class</code> 文件
 ```sh 
 javac xxx.java
 ```
 编译后的文件
 ```java
漱壕   4 
   
  
    <init> ()V Code LineNumberTable math ()I main ([Ljava/lang/String;)V 
SourceFile 
Demo1.java   com/xiangxue/spring/cap1/Demo1 
  java/lang/Object !                    *??   	         
      1     
<=`
h>?   	              	  
     .     ?Y?L+?W?   	         
 
         	  	 		
 ```
 * <code>.class</code> 文件 编译成 指令文件 javap -c xxx.class > xxx.txt
 编译后的文件
 ```txt
Compiled from "Demo1.java"
public class com.xiangxue.spring.cap1.Demo1 {
  public com.xiangxue.spring.cap1.Demo1();
    Code:
       0: aload_0
       1: invokespecial #1                  // Method java/lang/Object."<init>":()V
       4: return

  public int math();
    Code:
       0: iconst_1 //将第一个int 类型的值放入栈顶
       1: istore_1 // 将第一个int 类型的值 放到 局部变量表。相当于当前值在栈顶的值剪贴到 局部变量表
       2: iconst_2 //将第二个int 类型的值放入栈顶
       3: istore_2 // 将第二个int 类型的值 放到 局部变量表。相当于当前值在栈顶的值剪贴到 局部变量表
       4: iload_1 // 将 第一个int类型的值从 局部变量表复制到 操作数栈栈顶 压栈
       5: iload_2
       6: iadd   //  去 cpu中执行
       7: bipush        10
       9: imul
      10: istore_3
      11: iload_3
      12: ireturn   // 将值返回

  public static void main(java.lang.String[]);
    Code:
       0: new           #2                  // class com/xiangxue/spring/cap1/Demo1
       3: dup
       4: invokespecial #3                  // Method "<init>":()V
       7: astore_1
       8: aload_1
       9: invokevirtual #4                  // Method math:()I
      12: pop
      13: return
}
 ```

具体的指令分析可以参考[指令集](https://www.jianshu.com/p/d64a5dcccaa5)
 具体的指令就不分析了，  过程就是将 数推送至栈顶，
 
 * 导出dump文件 
 这里是针对 内存溢出错误，可以不写 <code>-XX:+HeapDumpOnOutOfMemoryError</code>
 ```sh 
 -Xms10m
 -Xmx10m
 -XX:+PrintGCDetails
 -XX:+HeapDumpOnOutOfMemoryError
 -XX:HeapDumpPath=D:\outdump.dump
 ```
 
 * jps 查看进程pid
```sh 
5584
11668 Launcher
12408
20248 Main
1420 Jps
```
 * jstack pid   查看栈信息
 ```sh 
 2019-09-02 20:25:32
 Full thread dump OpenJDK 64-Bit Server VM (25.202-b49 mixed mode):
 
 "JobScheduler FJ pool 5/7" #773 daemon prio=4 os_prio=-1 tid=0x000000001df81800 nid=0x3da4 waiting on condition [0x000000006db0f000]
    java.lang.Thread.State: TIMED_WAITING (parking)
 	at sun.misc.Unsafe.park(Native Method)
 	- parking to wait for  <0x000000074a292b08> (a java.util.concurrent.ForkJoinPool)
 	at java.util.concurrent.ForkJoinPool.awaitWork(ForkJoinPool.java:1824)
 	at java.util.concurrent.ForkJoinPool.runWorker(ForkJoinPool.java:1693)
 	at java.util.concurrent.ForkJoinWorkerThread.run(ForkJoinWorkerThread.java:157)
 
 "Process I/O pool 60" #770 daemon prio=4 os_prio=-1 tid=0x000000001df89800 nid=0x489c waiting on condition [0x000000006d20f000]
    java.lang.Thread.State: TIMED_WAITING (parking)
 	at sun.misc.Unsafe.park(Native Method)
 	- parking to wait for  <0x000000074b0c7220> (a java.util.concurrent.SynchronousQueue$TransferStack)
 	at java.util.concurrent.locks.LockSupport.parkNanos(LockSupport.java:215)
 	at java.util.concurrent.SynchronousQueue$TransferStack.awaitFulfill(SynchronousQueue.java:460)
 	at java.util.concurrent.SynchronousQueue$TransferStack.transfer(SynchronousQueue.java:362)
 	at java.util.concurrent.SynchronousQueue.poll(SynchronousQueue.java:941)
 	at java.util.concurrent.ThreadPoolExecutor.getTask(ThreadPoolExecutor.java:1073)
 	at java.util.concurrent.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1134)
 	at java.util.concurrent.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:624)
 	at java.lang.Thread.run(Thread.java:748)
 
 "Process I/O pool 59" #769 daemon prio=4 os_prio=-1 tid=0x000000001df86800 nid=0x4854 waiting on condition [0x000000006d10f000]
    java.lang.Thread.State: TIMED_WAITING (parking)
 	at sun.misc.Unsafe.park(Native Method)
 	- parking to wait for  <0x000000074b0c7220> (a java.util.concurrent.SynchronousQueue$TransferStack)
 	at java.util.concurrent.locks.LockSupport.parkNanos(LockSupport.java:215)
 	at java.util.concurrent.SynchronousQueue$TransferStack.awaitFulfill(SynchronousQueue.java:460)
 	at java.util.concurrent.SynchronousQueue$TransferStack.transfer(SynchronousQueue.java:362)
 	at java.util.concurrent.SynchronousQueue.poll(SynchronousQueue.java:941)
 	at java.util.concurrent.ThreadPoolExecutor.getTask(ThreadPoolExecutor.java:1073)
 	at java.util.concurrent.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1134)
 	at java.util.concurrent.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:624)
 	at java.lang.Thread.run(Thread.java:748)
 
 "Process I/O pool 58" #768 daemon prio=4 os_prio=-1 tid=0x000000001df87800 nid=0x2cf8 waiting on condition [0x000000006d00f000]
    java.lang.Thread.State: TIMED_WAITING (parking)
 	at sun.misc.Unsafe.park(Native Method)
 	- parking to wait for  <0x000000074b0c7220> (a java.util.concurrent.SynchronousQueue$TransferStack)
 	at java.util.concurrent.locks.LockSupport.parkNanos(LockSupport.java:215)
 	at java.util.concurrent.SynchronousQueue$TransferStack.awaitFulfill(SynchronousQueue.java:460)
 	at java.util.concurrent.SynchronousQueue$TransferStack.transfer(SynchronousQueue.java:362)
 	at java.util.concurrent.SynchronousQueue.poll(SynchronousQueue.java:941)
 	at java.util.concurrent.ThreadPoolExecutor.getTask(ThreadPoolExecutor.java:1073)
 	at java.util.concurrent.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1134)
 	at java.util.concurrent.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:624)
 	at java.lang.Thread.run(Thread.java:748)
 ```
 
*  使用Java VisualVM 在jdk的 lib目录下， 也可以使用cmd 命令下的： 
 ```sh 
 jvisualvm
 ```
 #### VisualVM 安装GC插件 
 1.先去插件中心下载自己JDK对应的插件版本 [官网](https://visualvm.github.io/pluginscenters.html)
 ![jvm](/img/interviewtopic/jvm.jpg)
 2.点击进入下载自己所需要的插件，例如：gc插件 com-sun-tools-visualvm-modules-visualgc_1.nbm
 3.打开Java JvisualVM-工具-插件-已下载-添加插件，选择已下载的插件安装即可
 
 ### 命令总结
 * jinfo:可以输出并修改运行时的java 进程的opts。 
 * jps:与unix上的ps类似，用来显示本地的java进程，可以查看本地运行着几个java程序，并显示他们的进程号。 
 * jstat:一个极强的监视VM内存工具。可以用来监视VM内存内的各种堆和非堆的大小及其内存使用量。 
 * jmap:打印出某个java进程（使用pid）内存内的所有'对象'的情况（如：产生那些对象，及其数量）。 
 * jconsole:一个java GUI监视工具，可以以图表化的形式显示各种数据。并可通过远程连接监视远程的服务器VM。
 
 详细：在使用这些工具前，先用JPS命令获取当前的每个JVM进程号，然后选择要查看的JVM。 
 
 ----------------------------------------------------------------------
 * jstat工具特别强大，有众多的可选项，详细查看堆内各个部分的使用量，以及加载类的数量。使用时，需加上查看进程的进程id，和所选参数。以下详细介绍各个参数的意义。 
 * jstat -class pid:显示加载class的数量，及所占空间等信息。 
 * jstat -compiler pid:显示VM实时编译的数量等信息。 
 * jstat -gc pid:可以显示gc的信息，查看gc的次数，及时间。其中最后五项，分别是young gc的次数，young gc的时间，full gc的次数，full gc的时间，gc的总时间。 
 * jstat -gccapacity:可以显示，VM内存中三代（young,old,perm）对象的使用和占用大小，如：PGCMN显示的是最小perm的内存使用量，PGCMX显示的是perm的内存最大使用量，PGC是当前新生成的perm内存占用量，PC是但前perm内存占用量。其他的可以根据这个类推， OC是old内纯的占用量。 
 * jstat -gcnew pid:new对象的信息。 
 * jstat -gcnewcapacity pid:new对象的信息及其占用量。 
 * jstat -gcold pid:old对象的信息。 
 * jstat -gcoldcapacity pid:old对象的信息及其占用量。 
 * jstat -gcpermcapacity pid: perm对象的信息及其占用量。 
 * jstat -util pid:统计gc信息统计。 
 * jstat -printcompilation pid:当前VM执行的信息。 
 除了以上一个参数外，还可以同时加上 两个数字，如：jstat -printcompilation 3024 250 6是每250毫秒打印一次，一共打印6次，还可以加上-h3每三行显示一下标题。 
 
 jmap是一个可以输出所有内存中对象的工具，甚至可以将VM 中的heap，以二进制输出成文本。 
 命令：jmap -dump:format=b,file=heap.bin pid 
 file：保存路径及文件名 
 pid：进程编号 
 jmap -histo:live  pid| less :堆中活动的对象以及大小 
 jmap -heap pid : 查看堆的使用状况信息 

 ## JVM内存模型
 * 先看一下jvm内存模型，分为 堆、方法区、栈、本地方法栈、程序计数器
 #### 总体内存模型
 
   ![jvm](/img/interviewtopic/jvm10.png) 
 
橙色的部分是共享的， 蓝色的部分是私有的
* **方法区** 它用于存储虚拟机加载的类信息、常量、静态变量、是各个线程共享的内存区域。
* **虚拟机栈(JVM Stack)** 描述的是java方法执行的内存模型：每个方法被执行的时候都会创建一个"栈帧",用于存储局部变量表(包括参数)、操作栈、方法出口等信息。每个方法被调用到执行完的过程，就对应着一个栈帧在虚拟机栈中从入栈到出栈的过程。
* **本地方法栈(Native Stack)** 本地方法栈（Native Method Stacks）与虚拟机栈所发挥的作用是非常相似的，其区别不过是虚拟机栈为虚拟机执行Java方法（也就是字节码）服务，而本地方法栈则是为虚拟机使用到的Native方法服务。
* **程序计数器（PC Register）**  程序计数器是用于标识当前线程执行的字节码文件的行号指示器。多线程情况下，每个线程都具有各自独立的程序计数器，所以该区域是非线程共享的内存区域。 当执行java方法时候，计数器中保存的是字节码文件的行号；当执行Native方法时，计数器的值为空。
 #### JVM内存参数设置
 
 * -Xms设置堆的最小空间大小。
 * -Xmx设置堆的最大空间大小。
 * -Xmn:设置年轻代大小
 * -XX:NewSize设置新生代最小空间大小。
 * -XX:MaxNewSize设置新生代最大空间大小。
 * -XX:PermSize设置永久代最小空间大小。
 * -XX:MaxPermSize设置永久代最大空间大小。
 * -Xss设置每个线程的堆栈大小
 * -XX:+UseParallelGC:选择垃圾收集器为并行收集器。此配置仅对年轻代有效。即上述配置下,年轻代使用并发收集,而年老代仍旧使用串行收集。
 * -XX:ParallelGCThreads=20:配置并行收集器的线程数,即:同时多少个线程一起进行垃圾回收。此值最好配置与处理器数目相等。
 典型JVM参数配置参考:
 
 * -Xmx3550m-Xms3550m-Xmn2g-Xss128k
 * -XX:ParallelGCThreads=20
 * -XX:+UseConcMarkSweepGC-XX:+UseParNewGC
 * -Xmx3550m:设置JVM最大可用内存为3550M。
 
 * -Xms3550m:设置JVM促使内存为3550m。此值可以设置与-Xmx相同,以避免每次垃圾回收完成后JVM重新分配内存。
 
 * -Xmn2g:设置年轻代大小为2G。整个堆大小=年轻代大小+年老代大小+持久代大小。持久代一般固定大小为64m,所以增大年轻代后,将会减小年老代大小。此值对系统性能影响较大,官方推荐配置为整个堆的3/8。
 
 * -Xss128k:设置每个线程的堆栈大小。JDK5.0以后每个线程堆栈大小为1M,以前每个线程堆栈大小为256K。更具应用的线程所需内存大 小进行调整。在相同物理内存下,减小这个值能生成更多的线程。但是操作系统对一个进程内的线程数还是有限制的,不能无限生成,经验值在3000~5000 左右。
 ## 堆内存模型
![jvm](/img/interviewtopic/jvm8.png) 
      
* 分为Eden 区 from  、to 、 old Memory（老年代） 
* Eden : from : to = 8 : 1 : 1 ( 可以通过参数 –XX:SurvivorRatio 来设定 )，即： Eden = 8/10 的新生代空间大小，from = to = 1/10 的新生代空间大小。
 
 ::: danger
 Eden 区会通过MinorGC(YoungGC) 回收 Eden 区产生的垃圾，如果 没有回收的垃圾将会 转移到 from区， from区 也会执行MinorGC, 如果没有
 成功回收的垃圾将会转译到to 区， 如果to区执行MinorGC, 也没有成功回收那么垃圾会重新返回到from区，如果这个垃圾在from 区到to区循环15次之后还是没有被回收
 那么 该垃圾将被转译到 老年代（old），在老年代中收集着难以回收的垃圾，和大对象等等。 老年代执行的垃圾回收叫做 MajorGC(Old GC)
 
 :::

 ##  栈内存模型
![jvm](/img/interviewtopic/jvm9.png) 
 
## 垃圾回收算法


 ### 标记清除算法
 
 **定义**：标记清除算法顾名思义，是指在虚拟机执行垃圾回收的过程中，先采用标记算法确定可回收对象，然后垃圾收集器根据标识清除相应的内容，给堆内存腾出相应的空间。
 
**缺点**：容易产生大量的内存碎片，可能无法满足大对象的内存分配，一旦导致无法分配对象，那就会导致jvm启动gc，一旦启动gc，我们的应用程序就会暂停，这就导致应用的响应速度变慢。
![jvm](/img/interviewtopic/jvm11.png) 
 ### 复制算法
 **定义**：把内存空间分成两个维度，每次只使用其中一个空间。当开始gc的时，垃圾回收器会把相应的垃圾清除，剩下的存活对象按照顺序排列完成清理。
 
**缺点**：复制算法把有用的空间压缩了一半，因为每次只能使用一半的空间用作分配，剩下的用作gc后的分配。
  ![jvm](/img/interviewtopic/jvm12.png) 
 ### 标记-整理算法
 **定义**：标记整理算法是标记清除的改进版本，当垃圾收集器把垃圾清除后，下一步还会对内存碎片进行整理，把存活对象统一的整理到一边。
 
**缺点**：虽然算法免去了内存碎片的出现和节省了空间，但这种算法需要频繁的移动对象，所以会造成gc效率的降低。
![jvm](/img/interviewtopic/jvm13.png) 
 
 ## 垃圾回收器
 图解HotSpot虚拟机所包含的收集器：
 
  ![jvm](/img/interviewtopic/jvm1.png)
  
 **新生代收集器**：Serial、ParNew、Parallel Scavenge
 
 **老年代收集器**：CMS、Serial Old、Parallel Old
 
 **整堆收集器**： G1
 
 几个相关概念：
 **并行收集**：指多条垃圾收集线程并行工作，但此时用户线程仍处于等待状态。
 
 **并发收集**：指用户线程与垃圾收集线程同时工作（不一定是并行的可能会交替执行）。用户程序在继续运行，而垃圾收集程序运行在另一个CPU上。
 
 **吞吐量**：即CPU用于运行用户代码的时间与CPU总消耗时间的比值（吞吐量 = 运行用户代码时间 / ( 运行用户代码时间 + 垃圾收集时间 )）。例如：虚拟机共运行100分钟，垃圾收集器花掉1分钟，那么吞吐量就是99%
 
 ### Serial 收集器
 Serial收集器是最基本的、发展历史最悠久的收集器。
 
 **特点**：单线程、简单高效（与其他收集器的单线程相比），对于限定单个CPU的环境来说，Serial收集器由于没有线程交互的开销，专心做垃圾收集自然可以获得最高的单线程手机效率。收集器进行垃圾回收时，必须暂停其他所有的工作线程，直到它结束（Stop The World）。
 
 **应用场景**：适用于Client模式下的虚拟机。
 
 Serial / Serial Old收集器运行示意图
 
 ![jvm](/img/interviewtopic/jvm2.png)
 
  
 
 ### ParNew收集器
 ParNew收集器其实就是Serial收集器的多线程版本。
 
 除了使用多线程外其余行为均和Serial收集器一模一样（参数控制、收集算法、Stop The World、对象分配规则、回收策略等）。
 
 **特点**：多线程、ParNew收集器默认开启的收集线程数与CPU的数量相同，在CPU非常多的环境中，可以使用-XX:ParallelGCThreads参数来限制垃圾收集的线程数。
 
 　　　和Serial收集器一样存在Stop The World问题
 
 **应用场景**：ParNew收集器是许多运行在Server模式下的虚拟机中首选的新生代收集器，因为它是除了Serial收集器外，唯一一个能与CMS收集器配合工作的。
 
 ParNew/Serial Old组合收集器运行示意图如下：
 
   ![jvm](/img/interviewtopic/jvm3.png)
 
  
 
 ### Parallel Scavenge 收集器
 与吞吐量关系密切，故也称为吞吐量优先收集器。
 
 **特点**：属于新生代收集器也是采用复制算法的收集器，又是并行的多线程收集器（与ParNew收集器类似）。
 
 该收集器的目标是达到一个可控制的吞吐量。还有一个值得关注的点是：GC自适应调节策略（与ParNew收集器最重要的一个区别）
 
 GC自适应调节策略：Parallel Scavenge收集器可设置-XX:+UseAdptiveSizePolicy参数。当开关打开时不需要手动指定新生代的大小（-Xmn）、Eden与Survivor区的比例（-XX:SurvivorRation）、晋升老年代的对象年龄（-XX:PretenureSizeThreshold）等，虚拟机会根据系统的运行状况收集性能监控信息，动态设置这些参数以提供最优的停顿时间和最高的吞吐量，这种调节方式称为GC的自适应调节策略。
 
 Parallel Scavenge收集器使用两个参数控制吞吐量：
 
 XX:MaxGCPauseMillis 控制最大的垃圾收集停顿时间
 
 XX:GCRatio 直接设置吞吐量的大小。
 
 ### Serial Old 收集器
 Serial Old是Serial收集器的老年代版本。
 
 **特点：** 同样是单线程收集器，采用标记-整理算法。
 
 **应用场景**：主要也是使用在Client模式下的虚拟机中。也可在Server模式下使用。
 
 Server模式下主要的两大用途（在后续中详细讲解···）：
 
 在JDK1.5以及以前的版本中与Parallel Scavenge收集器搭配使用。
 作为CMS收集器的后备方案，在并发收集Concurent Mode Failure时使用。
 Serial / Serial Old收集器工作过程图（Serial收集器图示相同）：
 
  ![jvm](/img/interviewtopic/jvm4.png)
 
 ### Parallel Old 收集器
 是Parallel Scavenge收集器的老年代版本。
 
 特点：多线程，采用标记-整理算法。
 
 应用场景：注重高吞吐量以及CPU资源敏感的场合，都可以优先考虑Parallel Scavenge+Parallel Old 收集器。
 
 Parallel Scavenge/Parallel Old收集器工作过程图：
 
  ![jvm](/img/interviewtopic/jvm5.png)
 
 
 ### CMS收集器
 **一种以获取最短回收停顿时间为目标的收集器。**
 
 **特点**：基于标记-清除算法实现。并发收集、低停顿。
 
 **应用场景**：适用于注重服务的响应速度，希望系统停顿时间最短，给用户带来更好的体验等场景下。如web程序、b/s服务。
 
 CMS收集器的运行过程分为下列4步：
 
 **初始标记**：标记GC Roots能直接到的对象。速度很快但是仍存在Stop The World问题。
 
 **并发标记**：进行GC Roots Tracing 的过程，找出存活对象且用户线程可并发执行。
 
 **重新标记**：为了修正并发标记期间因用户程序继续运行而导致标记产生变动的那一部分对象的标记记录。仍然存在Stop The World问题。
 
 **并发清除**：对标记的对象进行清除回收。
 
  CMS收集器的内存回收过程是与用户线程一起并发执行的。
 
  CMS收集器的工作过程图：
  
  ![jvm](/img/interviewtopic/jvm6.png)
 
 
 **CMS收集器的缺点**：
 
 对CPU资源非常敏感。
 无法处理浮动垃圾，可能出现Concurrent Model Failure失败而导致另一次Full GC的产生。
 因为采用标记-清除算法所以会存在空间碎片的问题，导致大对象无法分配空间，不得不提前触发一次Full GC。
 ### G1收集器
 一款面向服务端应用的垃圾收集器。
 
 **特点如下：**
 
 **并行与并发**：G1能充分利用多CPU、多核环境下的硬件优势，使用多个CPU来缩短Stop-The-World停顿时间。部分收集器原本需要停顿Java线程来执行GC动作，G1收集器仍然可以通过并发的方式让Java程序继续运行。
 
 **分代收集**：G1能够独自管理整个Java堆，并且采用不同的方式去处理新创建的对象和已经存活了一段时间、熬过多次GC的旧对象以获取更好的收集效果。
 
 **空间整合**：G1运作期间不会产生空间碎片，收集后能提供规整的可用内存。
 
 **可预测的停顿**：G1除了追求低停顿外，还能建立可预测的停顿时间模型。能让使用者明确指定在一个长度为M毫秒的时间段内，消耗在垃圾收集上的时间不得超过N毫秒。
 
 **G1为什么能建立可预测的停顿时间模型?**
 
 因为它有计划的避免在整个Java堆中进行全区域的垃圾收集。G1跟踪各个Region里面的垃圾堆积的大小，在后台维护一个优先列表，每次根据允许的收集时间，优先回收价值最大的Region。这样就保证了在有限的时间内可以获取尽可能高的收集效率。
 
 **G1与其他收集器的区别：**
 
 其他收集器的工作范围是整个新生代或者老年代、G1收集器的工作范围是整个Java堆。在使用G1收集器时，它将整个Java堆划分为多个大小相等的独立区域（Region）。虽然也保留了新生代、老年代的概念，但新生代和老年代不再是相互隔离的，他们都是一部分Region（不需要连续）的集合。
 
 **G1收集器存在的问题：**
 
 Region不可能是孤立的，分配在Region中的对象可以与Java堆中的任意对象发生引用关系。在采用可达性分析算法来判断对象是否存活时，得扫描整个Java堆才能保证准确性。其他收集器也存在这种问题（G1更加突出而已）。会导致Minor GC效率下降。
 
 **G1收集器是如何解决上述问题的?**？
 
 采用Remembered Set来避免整堆扫描。G1中每个Region都有一个与之对应的Remembered Set，虚拟机发现程序在对Reference类型进行写操作时，会产生一个Write Barrier暂时中断写操作，检查Reference引用对象是否处于多个Region中（即检查老年代中是否引用了新生代中的对象），如果是，便通过CardTable把相关引用信息记录到被引用对象所属的Region的Remembered Set中。当进行内存回收时，在GC根节点的枚举范围中加入Remembered Set即可保证不对全堆进行扫描也不会有遗漏。
 
 如果不计算维护 Remembered Set 的操作，G1收集器大致可分为如下步骤：
 
 **初始标记**：仅标记GC Roots能直接到的对象，并且修改TAMS（Next Top at Mark Start）的值，让下一阶段用户程序并发运行时，能在正确可用的Region中创建新对象。（需要线程停顿，但耗时很短。）
 
 **并发标记**：从GC Roots开始对堆中对象进行可达性分析，找出存活对象。（耗时较长，但可与用户程序并发执行）
 
 **最终标记**：为了修正在并发标记期间因用户程序执行而导致标记产生变化的那一部分标记记录。且对象的变化记录在线程Remembered Set  Logs里面，把Remembered Set  Logs里面的数据合并到Remembered Set中。（需要线程停顿，但可并行执行。）
 
 **筛选回收**：对各个Region的回收价值和成本进行排序，根据用户所期望的GC停顿时间来制定回收计划。（可并发执行）
 
 G1收集器运行示意图：
 
  ![jvm](/img/interviewtopic/jvm7.png)
 

 
  
 ## GC 调优步骤
 1. 打印GC日志
```sh 
-XX:+PrintGCDetails -XX:+PrintGCTimeStamps -XX:+PrintGCDateStamps -xloggc:./gc.log
```
:::tip
-XX:+PrintGC 输出GC日志
-XX:+PrintGCDetails 输出GC的详细日志
-XX:+PrintGCTimeStamps 输出GC的时间戳（以基准时间的形式）
-XX:+PrintGCDateStamps 输出GC的时间戳（以日期的形式，如 2013-05-04T21:53:59.234+0800）
-XX:+PrintHeapAtGC 在进行GC的前后打印出堆的信息
-Xloggc:../logs/gc.log 日志文件的输出路径
:::

Tomcat 可以直接加载JAVA_OPTS变量里
2. 分析日志得到关键性指标
3. 分析GC原因，调优JVM参数

推荐使用一个GC分析工具[GCeasy](https://gceasy.io/)
将生成的<code>.log</code>文件 上传上去即可分析GC日志

[JVM 参数 官网](https://docs.oracle.com/javase/8/docs/technotes/tools/unix/java.html)
[Jvm 简书总结](https://www.jianshu.com/p/1c6b5c2e95f9)

 
 