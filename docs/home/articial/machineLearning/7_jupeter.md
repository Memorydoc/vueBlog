---
title: Jupyter Notebook使用
---
# 学习目标
* 目标
    * 学会使用Jupyter Notebook


***
    
## Jupyter Notebook介绍
Jupyter项目是一个非盈利的开源项目，源于2014年的ipython项目，因为它逐渐发展为支持跨所有编程语言的交互式数据科学和科学计算

* Jupyter Notebook，原名IPython Notbook，是IPython的加强网页版，一个开源Web应用程序
* 名字源自Julia、Python 和 R（数据科学的三种开源语言）
* 是一款程序员和科学工作者的编程/文档/笔记/展示软件
* .ipynb文件格式是用于计算型叙述的JSON文档格式的正式规范

![](/img/articial/jupyternotebook.png)

## 为什么使用Jupyter Notebook?

* 传统软件开发：工程／目标明确
    * 需求分析，设计架构，开发模块，测试
* 数据挖掘：艺术／目标不明确
    * 目的是具体的洞察目标，而不是机械的完成任务
    * 通过执行代码来理解问题
    * 迭代式地改进代码来改进解决方法
实时运行的代码、叙事性的文本和可视化被整合在一起，方便使用代码和数据来讲述故事

对比Jupyter Notebook和Pycharm


**对比Jupyter Notebook和Pycharm**

* 画图
![](/img/articial/展示1.png)

* 数据展示
![](/img/articial/展示2.png)

## Jupyter Notebook的使用-helloworld

### **界面启动、创建文件**
```sh  
# 输入命令
jupyter notebook

```
本地notebook的默认URL为：http://localhost:8888

想让notebook打开指定目录，只要进入此目录后执行命令即可
![](/img/articial/notebook1.png)

### **新建notebook文档**
* notebook的文档格式是.ipynb
![](/img/articial/createnotebook.png)

**内容界面操作-helloworld**
标题栏：点击标题（如Untitled）修改文档名

编辑栏：
![](/img/articial/jupyter_helloworld.png)

### **cell操作**
* 什么是cell？
    * cell：一对In Out会话被视作一个代码单元，称为cell
    * cell行号前的 * ，表示代码正在运行
Jupyter支持两种模式：

* 编辑模式（Enter）
    * 命令模式下回车Enter或鼠标双击cell进入编辑模式
    * 可以操作cell内文本或代码，剪切／复制／粘贴移动等操作
* 命令模式（Esc）
    * 按Esc退出编辑，进入命令模式
    * 可以操作cell单元本身进行剪切／复制／粘贴／移动等操作

### 鼠标操作
![](/img/articial/工具栏cell.png)

### 快捷键操作
* 两种模式通用快捷键
    * Shift+Enter，执行本单元代码，并跳转到下一单元
    vCtrl+Enter，执行本单元代码，留在本单元
* 命令模式：按ESC进入

    * Y，cell切换到Code模式

    * M，cell切换到Markdown模式

    * A，在当前cell的上面添加cell

    * B，在当前cell的下面添加cell

* 其他(了解)

    * 双击D：删除当前cell

    * Z，回退

    * L，为当前cell加上行号 <!--

    * Ctrl+Shift+P，对话框输入命令直接运行

    * 快速跳转到首个cell，Crtl+Home

    * 快速跳转到最后一个cell，Crtl+End -->

* 编辑模式：按Enter进入

    * 补全代码：变量、方法后跟Tab键

    * 为一行或多行代码添加/取消注释：Ctrl+/（Mac:CMD+/）

* 其他(了解)：

    * 多光标操作：Ctrl键点击鼠标（Mac:CMD+点击鼠标）
    * 回退：Ctrl+Z（Mac:CMD+Z）
    * 重做：Ctrl+Y（Mac:CMD+Y)

### markdown演示

掌握标题和缩进即可
![](/img/articial/markdown演示1.png)


### Jupyter Notebook中自动补全代码等相关功能拓展【了解】
![](/img/articial/nbextnsions1.png)
安装jupyter_contrib_nbextensions库

安装该库的命令如下：

```sh  
python -m pip install jupyter_contrib_nbextensions
```
然后执行：

```sh 
jupyter contrib nbextension install --user --skip-running-check
```
在原来的基础上勾选： “Table of Contents” 以及 “Hinterland”
![](/img/articial/nbextensions2.png)
