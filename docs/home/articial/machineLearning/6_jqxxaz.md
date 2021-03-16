---
title: 机器学习基础环境安装与使用
---

## 学习目标
*完成机器学习基础阶段的环境安装
* 学会使用jupyter notebook平台完成代码编写运行


整个机器学习基础阶段会用到Matplotlib、Numpy、Pandas等库，为了统一版本号在环境中使用，将所有的库及其版本放到了文件requirements.txt当中，然后统一安装

创建 requirement.txt
```python   
matplotlib==2.2.2
numpy==1.14.2
pandas==0.20.3
tables==3.4.2
jupyter==1.0.0
```
* 注意：
    * 每个包安装的过程中，尽量指定稳定版本进行安装

```python  
pip3 install -r requirements.txt
```

## 小结
* 机器学习(科学计算库)阶段环境的搭建和基本库的安装
    * 注意：最好安装指定的稳定版本
