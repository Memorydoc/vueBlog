# 神经网络基础

## 学习目标

- 目标
  - 知道逻辑回归的算法计算输出、损失函数
  - 知道导数的计算图
  - 知道逻辑回归的梯度下降算法
  - 知道多样本的向量计算
- 应用
  - 应用完成向量化运算
  - 应用完成一个单神经元神经网络的结构

### Logistic回归

####  Logistic回归

逻辑回归是一个主要用于二分分类类的算法。那么逻辑回归是给定一个$$ x $$ , 输出一个该样本属于1对应类别的预测概率$$ \hat{y}=P(y=1|x) $$。

Logistic 回归中使用的参数如下：

![](/img/articial/sigmoid解析.png)

![](/img/articial/sigmoid函数.png)

$$e^{-z}$$的函数如下

![](/img/articial/指数图像.png)

例如：

![损失计算过程](/img/articial/损失计算过程.png)

#### 逻辑回归损失函数

**损失函数（loss function）**用于衡量预测结果与真实值之间的误差。最简单的损失函数定义方式为平方差损失：

$$ L(\hat{y},y) = \frac{1}{2}(\hat{y}-y)^2$$

逻辑回归一般使用$$L(\hat{y},y) = -(y\log\hat{y})-(1-y)\log(1-\hat{y}) $$

该式子的理解：

* 如果y=1,损失为$$- \log\hat{y}$$，那么要想损失越小，$$\hat{y} $$的值必须越大，即越趋近于或者等于1
* 如果y=0,损失为$$1\log(1-\hat{y})$$,那么要想损失越小，那么$$\hat{y}$$的值越小，即趋近于或者等于0

损失函数是在单个训练样本中定义的，它衡量了在**单个**训练样本上的表现。**代价函数（cost function）**衡量的是在**全体**训练样本上的表现，即衡量参数 w 和 b 的效果，所有训练样本的损失平均值

$$J(w,b) = \frac{1}{m}\sum_{i=1}^mL(\hat{y}^{(i)},y^{(i)}) $$

### 梯度下降算法

目的：使损失函数的值找到最小值

方式：梯度下降

函数的**梯度（gradient）**指出了函数的最陡增长方向。**梯度的方向走，函数增长得就越快。那么按梯度的负方向走，函数值自然就降低得最快了**。模型的训练目标即是寻找合适的 w 与 b 以最小化代价函数值。假设 **w 与 b 都是一维实数**，那么可以得到如下的 J 关于 w 与 b 的图：

![](/img/articial/损失函数图.png)

可以看到，成本函数 J 是一个**凸函数**，与非凸函数的区别在于其不含有多个局部最低。

参数w和b的更新公式为：

$$w := w - \alpha\frac{dJ(w, b)}{dw}$$，$$b := b - \alpha\frac{dJ(w, b)}{db}$$

>  注：其中 α 表示学习速率，即每次更新的 w 的步伐长度。当 w 大于最优解 w′ 时，导数大于 0，那么 w 就会向更小的方向更新。反之当 w 小于最优解 w′ 时，导数小于 0，那么 w 就会向更大的方向更新。迭代直到收敛。

通过平面来理解梯度下降过程：

![](/img/articial/梯度下降理解.png)

### 导数

理解梯度下降的过程之后，我们通过例子来说明梯度下降在计算导数意义或者说这个导数的意义。

#### 导数

导数也可以理解成某一点处的斜率。斜率这个词更直观一些。

* 各点处的导数值一样

![](/img/articial/直线图.png)

我们看到这里有一条直线，这条直线的斜率为4。我们来计算一个例子

例：取一点为a=2,那么y的值为8，我们稍微增加a的值为a=2.001,那么y的值为8.004，也就是当a增加了0.001，随后y增加了0.004，即4倍

那么我们的这个斜率可以理解为当一个点偏移一个不可估量的小的值，所增加的为4倍。

可以记做$$\frac{f(a)}{da}$$或者$$\frac{d}{da}f(a)$$

* 各点的导数值不全一致

![](/img/articial/a方图.png)

例：取一点为a=2,那么y的值为4，我们稍微增加a的值为a=2.001,那么y的值约等于4.004（4.004001），也就是当a增加了0.001，随后y增加了4倍

取一点为a=5,那么y的值为25，我们稍微增加a的值为a=5.001,那么y的值约等于25.01（25.010001），也就是当a增加了0.001，随后y增加了10倍

可以得出该函数的导数2为2a。

* 更多函数的导数结果

|                          函数                          |             导数             |
| :----------------------------------------------------: | :--------------------------: |
|                     $$f(a) = a^2$$                     |            $$2a$$            |
|                      $$f(a)=a^3$$                      |           $$3a^2$$           |
|                     $$f(a)=ln(a)$$                     |       $$\frac{1}{a}$$        |
|                     $$f(a) = e^a$$                     |           $$e^a$$            |
|           $$\sigma(z) = \frac{1}{1+e^{-z}}$$           |  $$\sigma(z)(1-\sigma(z))$$  |
| $$g(z) = tanh(z) = \frac{e^z - e^{-z}}{e^z + e^{-z}}$$ | $$1-(tanh(z))^2=1-(g(z))^2$$ |

#### 导数计算图

那么接下来我们来看看含有多个变量的到导数流程图，假设$$J(a,b,c) = 3{(a + bc)}$$

我们以下面的流程图代替

![](/img/articial/导数计算图.png)

这样就相当于从左到右计算出结果，然后从后往前计算出导数

* 导数计算

问题：那么现在我们要计算J相对于三个变量a,b,c的导数？

假设b=4,c=2,a=7,u=8,v=15,j=45

* $$\frac{dJ}{dv}=3$$

增加v从15到15.001，那么$$J\approx45.003 $$

* $$\frac{dJ}{da}=3$$

增加a从7到7.001,那么$$v=\approx15.001$$，$$J\approx45.003 $$

这里也涉及到链式法则

#### 链式法则

* $$\frac{dJ}{da}=\frac{dJ}{dv}\frac{dv}{da}=3*1=3$$

J相对于a增加的量可以理解为J相对于v*v相对于a增加的

接下来计算

* $$\frac{dJ}{db}=6=\frac{dJ}{du}\frac{du}{db}=3*2$$

* $$\frac{dJ}{dc}=9=\frac{dJ}{du}\frac{du}{dc}=3*3$$

#### 逻辑回归的梯度下降

逻辑回归的梯度下降过程计算图，首先从前往后的计算图得出如下

* $$z = w^Tx + b$$

* $$\hat{y} =a= \sigma(z)$$

* $$L(\hat{y},y) = -(y\log{a})-(1-y)\log(1-a) $$

那么计算图从前向过程为,假设样本有两个特征

![](/img/articial/逻辑回归的计算图.png)

问题：计算出$$J$$ 关于$$z$$的导数

* $$dz = \frac{dJ}{da}\frac{da}{dz} = a-y$$
  * $$\frac{dJ}{da} = -\frac{y}{a} + \frac{1-y}{1-a}$$
  * $$\frac{da}{dz} = a(1-a)$$ 

所以我们这样可以求出总损失相对于$$w_1,w_2,b$$参数的某一点导数，从而可以更新参数

* $$\frac{dJ}{dw_1} = \frac{dJ}{dz}\frac{dz}{dw_1}=dz*x1$$
* $$\frac{dJ}{dw_2} = \frac{dJ}{dz}\frac{dz}{dw_1}=dz*x2$$
* $$\frac{dJ}{db}=dz$$

相信上面的导数计算应该都能理解了，所以当我们**计算损失函数的某个点相对于$$w_1,w_2,b$$的导数之后，就可以更新这次优化后的结果。**

$$w_1 := w_1 - \alpha\frac{dJ(w_1, b)}{dw_1}$$

$$w_2 := w_2 - \alpha\frac{dJ(w_2, b)}{dw_2}$$

$$b := b - \alpha\frac{dJ(w, b)}{db}$$

### 向量化编程

**每更新一次梯度时候，在训练期间我们会拥有m个样本，那么这样每个样本提供进去都可以做一个梯度下降计算。所以我们要去做在所有样本上的计算结果、梯度等操作**

$$J(w,b) = \frac{1}{m}\sum_{i=1}^mL({a}^{(i)},y^{(i)}) $$

计算参数的梯度为：这样，我们想要得到最终的$$d{w_1},d{w_2},d{b}$$，如何去设计一个算法计算？伪代码实现：

![](/img/articial/计算梯度过程.png)

#### 向量化优势

**什么是向量化**

由于在进行计算的时候，最好不要使用for循环去进行计算，因为有Numpy可以进行更加快速的向量化计算。

在公式$$z = w^Tx+b$$中$$w,x$$ 都可能是多个值，也就是

![](/img/articial/向量化.png)

```python
import numpy as np
import time
a = np.random.rand(100000)
b = np.random.rand(100000)
```

* 第一种方法

```python
# 第一种for 循环
c = 0
start = time.time()
for i in range(100000):
    c += a[i]*b[i]
end = time.time()

print("计算所用时间%s " % str(1000*(end-start)) + "ms")
```

* 第二种向量化方式使用np.dot

```python
# 向量化运算
start = time.time()
c = np.dot(a, b)
end = time.time()
print("计算所用时间%s " % str(1000*(end-start)) + "ms")
```

Numpy能够充分的利用并行化，Numpy当中提供了很多函数使用

|        函数         |       作用       |
| :-----------------: | :--------------: |
| np.ones or np.zeros | 全为1或者0的矩阵 |
|       np.exp        |     指数计算     |
|       np.log        |     对数计算     |
|       np.abs        |    绝对值计算    |

**所以上述的m个样本的梯度更新过程，就是去除掉for循环。原本这样的计算**

#### 向量化实现伪代码

* 思路


|  $$ z^1 = w^Tx^1+b$$  |  $$ z^2 = w^Tx^2+b$$   |  $$ z^3 = w^Tx^3+b$$   |
| :-------------------: | :--------------------: | :--------------------: |
| $$a^1 = \sigma(z^1)$$ | $$a^2 = \sigma(z^2) $$ | $$a^3 = \sigma(z^3) $$ |

可以变成这样的计算

![](/img/articial/向量化实现.png)

注：w的形状为(n,1), x的形状为(n, m)，其中n为特征数量，m为样本数量

我们可以让，得出的结果为(1, m)大小的矩阵
注：大写的wx为多个样本表示

* 实现多个样本向量化计算的伪代码

![](/img/articial/伪代码.png)

这相当于一次使用了M个样本的所有特征值与目标值，那我们知道如果想多次迭代，使得这M个样本重复若干次计算

### 案例：实现逻辑回归

#### 使用数据：制作二分类数据集

```python
from sklearn.datasets import load_iris, make_classification
from sklearn.model_selection import train_test_split
import tensorflow as tf
import numpy as np

X, Y = make_classification(n_samples=500, n_features=5, n_classes=2)
x_train, x_test, y_train, y_test = train_test_split(X, Y, test_size=0.3)
```

####  步骤设计：

分别构建算法的不同模块

- 1、初始化参数

```python
def initialize_with_zeros(shape):
    """
    创建一个形状为 (shape, 1) 的w参数和b=0.
    return:w, b
    """
 
    w = np.zeros((shape, 1))
    b = 0
    
    return w, b
```

- 计算成本函数及其梯度
  - w (n,1).T * x (n, m)
  - y: (1, n)

```python
def propagate(w, b, X, Y):
    """
    参数：w,b,X,Y：网络参数和数据
    Return:
    损失cost、参数W的梯度dw、参数b的梯度db
    """
    m = X.shape[1]
    
    # w (n,1), x (n, m)
    A = basic_sigmoid(np.dot(w.T, X) + b)
    # 计算损失
    cost = -1 / m * np.sum(Y * np.log(A) + (1 - Y) * np.log(1 - A))
    dz = A - Y
    dw = 1 / m * np.dot(X, dz.T)
    db = 1 / m * np.sum(dz)

    cost = np.squeeze(cost)
    
    grads = {"dw": dw,
             "db": db}
    
    return grads, cost
```

需要一个基础函数sigmoid

```python
def basic_sigmoid(x):
    """
    计算sigmoid函数
    """

    s = 1 / (1 + np.exp(-x))
    
    return s
```



- 使用优化算法（梯度下降）
  - 实现优化函数. 全局的参数随着w,b对损失J进行优化改变. 对参数进行梯度下降公式计算，指定学习率和步长。
  - 循环：
    - **计算当前损失**
    - **计算当前梯度**
    - 更新参数（梯度下降）

```python
def optimize(w, b, X, Y, num_iterations, learning_rate):
    """
    参数：
    w:权重,b:偏置,X特征,Y目标值,num_iterations总迭代次数,learning_rate学习率
    Returns:
    params:更新后的参数字典
    grads:梯度
    costs:损失结果
    """
    
    costs = []
    
    for i in range(num_iterations):
        
        # 梯度更新计算函数
        grads, cost = propagate(w, b, X, Y)
        
        # 取出两个部分参数的梯度
        dw = grads['dw']
        db = grads['db']
        
        # 按照梯度下降公式去计算
        w = w - learning_rate * dw
        b = b - learning_rate * db
        
        if i % 100 == 0:
            costs.append(cost)
        if i % 100 == 0:
            print("损失结果 %i: %f" %(i, cost))
            print(b)
    
    params = {"w": w,
              "b": b}
    
    grads = {"dw": dw,
             "db": db}
    
    return params, grads, costs
```

- 预测函数（不用实现）

利用得出的参数来进行测试得出准确率

```python
def predict(w, b, X):
    '''
    利用训练好的参数预测
    return：预测结果
    '''

    m = X.shape[1]
    y_prediction = np.zeros((1, m))
    w = w.reshape(X.shape[0], 1)

    # 计算结果
    A = basic_sigmoid(np.dot(w.T, X) + b)

    for i in range(A.shape[1]):

        if A[0, i] <= 0.5:
            y_prediction[0, i] = 0
        else:
            y_prediction[0, i] = 1

    return y_prediction
```

- 整体逻辑
  - 模型训练

```python
def model(x_train, y_train, x_test, y_test, num_iterations=2000, learning_rate=0.0001):
    """
    """

    # 修改数据形状
    x_train = x_train.reshape(-1, x_train.shape[0])
    x_test = x_test.reshape(-1, x_test.shape[0])
    y_train = y_train.reshape(1, y_train.shape[0])
    y_test = y_test.reshape(1, y_test.shape[0])
    print(x_train.shape)
    print(x_test.shape)
    print(y_train.shape)
    print(y_test.shape)

    # 1、初始化参数
    w, b = initialize_with_zeros(x_train.shape[0])

    # 2、梯度下降
    # params:更新后的网络参数
    # grads:最后一次梯度
    # costs:每次更新的损失列表
    params, grads, costs = optimize(w, b, x_train, y_train, num_iterations, learning_rate)

    # 获取训练的参数
    # 预测结果
    w = params['w']
    b = params['b']
    y_prediction_train = predict(w, b, x_train)
    y_prediction_test = predict(w, b, x_test)

    # 打印准确率
    print("训练集准确率: {} ".format(100 - np.mean(np.abs(y_prediction_train - y_train)) * 100))
    print("测试集准确率: {} ".format(100 - np.mean(np.abs(y_prediction_test - y_test)) * 100))

    return None
```

- 训练

```python
model(x_train, y_train, x_test, y_test, num_iterations=2000, learning_rate=0.0001)
```













