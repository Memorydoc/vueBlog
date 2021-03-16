---
title: 机器学习概述
---

## 学习目标

* 了解人工智能在现实生活中的应用
* 知道人工智能发展必备三要素
* 知道人工智能和机器学习、深度学习三者之间的关系

## 人工智能应用场景

![课题导入2](/img/articial/课题导入2.gif)

## 人工智能小案例
案例一：
![人工智能应用场景1](/img/articial/人工智能应用场景1.png)

参考链接：[](https://quickdraw.withgoogle.com)

案例二：

![人工智能应用场景3](/img/articial/人工智能应用场景3.png)


参考链接：[](https://pjreddie.com/darknet/yolo/)

案例三：
![人工智能应用场景4](/img/articial/人工智能应用场景4.png)
查看更多：[](https://deepdreamgenerator.com/)

## 人工智能发展必备三要素

* 数据
* 算法
* 计算力
    * CPU,GPU,TPU

![人工智能必备三要素](/img/articial/人工智能必备三要素.png)
* 计算力之CPU、GPU对比：

    * CPU主要适合I\O密集型的任务

    * GPU主要适合计算密集型任务

* 提问：什么类型的程序适合在GPU上运行？
(1)计算密集型的程序。

所谓计算密集型(Compute-intensive)的程序，就是其大部分运行时间花在了寄存器运算上，寄存器的速度和处理器的速度相当，从寄存器读写数据几乎没有延时。可以做一下对比，读内存的延迟大概是几百个时钟周期；读硬盘的速度就不说了，即便是SSD, 也实在是太慢了。　　
(2)易于并行的程序。
GPU其实是一种SIMD(Single Instruction Multiple Data)架构， 他有成百上千个核，每一个核在同一时间最好能做同样的事情。

CPU和GPU的区别：


[CPU和GPU的区别](http://www.sohu.com/a/201309334_468740) 

Google TPU 介绍：
[Google TPU 介绍](https://buzzorange.com/techorange/2017/09/27/what-intel-google-nvidia-microsoft-do-for-ai-chips/)
 
## 人工智能、机器学习和深度学习
![人工智能必备三要素](/img/articial/人工智能范围.png)

* 人工智能和机器学习，深度学习的关系
    * 机器学习是人工智能的一个实现途径
    * 深度学习是机器学习的一个方法发展而来
## 小结
* 人工智能应用场景【了解】
    * 网络安全、电子商务、计算模拟、社交网络 … ...
人工智能必备三要素【知道】
    * 数据、算法、计算力
* 人工智能和机器学习，深度学习的关系【知道】
    * 机器学习是人工智能的一个实现途径
    * 深度学习是机器学习的一个方法发展而来
