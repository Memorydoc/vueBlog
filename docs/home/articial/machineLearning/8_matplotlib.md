---
title: Matplotlib之HelloWorld
---

## 学习目标
* 目标
    * 了解什么是matplotlib
    * 为什么要学习matplotlib
    * matplotlib简单图形的绘制


## 什么是Matplotlib
![](/img/articial/matplotlib图标.png)

* 是专门用于开发2D图表(包括3D图表)
* 以渐进、交互式方式实现数据可视化

## 为什么要学习Matplotlib
可视化是在整个数据挖掘的关键辅助工具，可以清晰的理解数据，从而调整我们的分析方法。

* 能将数据进行可视化,更直观的呈现
* 使数据更加客观、更具说服力
例如下面两个图为数字展示和图形展示：

![](/img/articial/star.png)

实现一个简单的Matplotlib画图 — 以折线图为例

## matplotlib.pyplot模块

matplotlib.pytplot包含了一系列类似于matlab的画图函数。
```py  
import matplotlib.pyplot as plt
```

## 图形绘制流程
* 创建画布 -- plt.figure()
```py  

plt.figure(figsize=(), dpi=)
    figsize:指定图的长宽
    dpi:图像的清晰度
    返回fig对象
```
* 绘制图像 -- plt.plot(x, y)
* 显示图像 -- plt.show()
## 折线图绘制与显示
```py 
import matplotlib.pyplot as plt

# 1.创建画布
plt.figure(figsize=(10, 10), dpi=100)

# 2.绘制折线图
plt.plot([1, 2, 3, 4, 5, 6 ,7], [17,17,18,15,11,11,13])

# 3.显示图像
plt.show()
```

![](/img/articial/折线图举例.png)
