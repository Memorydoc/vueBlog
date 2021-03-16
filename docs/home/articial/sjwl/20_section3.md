# 案例：CIFAR100类别分类

## 学习目标

- 目标
  - 掌握keras卷积网络相关API
  - 掌握卷机网络的构建
- 应用
  - 应用keras构建CNN神经网络进行CIFAR100类别分类

##  CIFAR100数据集介绍

这个数据集就像CIFAR-10，除了它有100个类，每个类包含600个图像。，每类各有500个训练图像和100个测试图像。CIFAR-100中的100个类被分成20个超类。每个图像都带有一个“精细”标签（它所属的类）和一个“粗糙”标签（它所属的超类） 以下是CIFAR-100中的类别列表：

![](/img/articial/100类别名称.png)

等等...

![](/img/articial/100图.png)

## API 使用

- 用于构建CNN模型的API
  - Conv2D：实现卷积，kernel_size,strides,padding,dataformat,'NHWC'和'NCHW'
  - MaxPool2D：池化操作

```
keras.layers.Conv2D(32, kernel_size=5, strides=1,
                            padding='same', data_format='channels_last', activation=tf.nn.relu),
        keras.layers.MaxPool2D(pool_size=2, strides=2, padding='same'),
```

## 步骤分析以及代码实现(缩减版LeNet5)

- 读取数据集:
  - 从datasets中获取相应的数据集，直接有训练集和测试集
  - 需要进行形状处理以及归一化

```python
class CNNMnist(object):
    def __init__(self):

        (self.train, self.train_label), (self.test, self.test_label) = \
            keras.datasets.cifar100.load_data()

        self.train = self.train.reshape(-1, 32, 32, 3) / 255.0
        self.test = self.test.reshape(-1, 32, 32, 3) / 255.0
```

- 进行模型编写
  - 两层卷积层+两个神经网络层
  - 网络设计：

- 第一层
  - 卷积：32个filter、大小5*5、strides=1、padding="SAME"
  - 激活：Relu
  - 池化：大小2x2、strides2
- 第一层
  - 卷积：64个filter、大小5*5、strides=1、padding="SAME"
  - 激活：Relu
  - 池化：大小2x2、strides2
- 全连接层

**经过每一层图片数据大小的变化需要确定，CIFAR100输入的每批次若干图片数据大小为[None, 32 * 32]，如果要进过卷积计算，需要变成[None, 32, 32, 3]**

- 第一层
  - 卷积：[None, 32, 32, 3]———>[None, 32, 32, 32]
    - 权重数量：[5, 5, 1 ,32]
    - 偏置数量：[32]
  - 激活：[None, 32, 32, 32]———>[None, 32, 32, 32]
  - 池化：[None, 32, 32, 32]———>[None, 16, 16, 32]
- 第二层
  - 卷积：[None, 16, 16, 32]———>[None, 16, 16, 64]
    - 权重数量：[5, 5, 32 ,64]
    - 偏置数量：[64]
  - 激活：[None, 16, 16, 64]———>[None, 16, 16, 64]
  - 池化：[None, 16, 16, 64]———>[None, 8, 8, 64]
- 全连接层
  - [None, 8, 8, 64]——>[None, 8 * 8 * 64]
  - [None, 8 * 8 * 64] x [8 * 8 * 64, 1024] = [None, 1024]
  - [None,1024] x [1024, 100]——>[None, 100]
  - 权重数量：[8 * 8 * 64, 1024] + [1024, 100]，由分类别数而定
  - 偏置数量：[1024] + [100]，由分类别数而定

```python
model = keras.Sequential([
        keras.layers.Conv2D(32, kernel_size=5, strides=1,
                            padding='same', data_format='channels_last', activation=tf.nn.relu),
        keras.layers.MaxPool2D(pool_size=2, strides=2, padding='same'),
        keras.layers.Conv2D(64, kernel_size=5, strides=1,
                            padding='same', data_format='channels_last', activation=tf.nn.relu),
        keras.layers.MaxPool2D(pool_size=2, strides=2, padding='same'),
        keras.layers.Flatten(),
        keras.layers.Dense(1024, activation=tf.nn.relu),
        keras.layers.Dense(100, activation=tf.nn.softmax),
    ])
```

* 其它完整代码

```python
 def compile(self):

        CNNMnist.model.compile(optimizer=keras.optimizers.Adam(),
                               loss=tf.keras.losses.sparse_categorical_crossentropy,
                               metrics=['accuracy'])
        return None

    def fit(self):

        CNNMnist.model.fit(self.train, self.train_label, epochs=1, batch_size=32)

        return None

    def evaluate(self):

        test_loss, test_acc = CNNMnist.model.evaluate(self.test, self.test_label)

        print(test_loss, test_acc)
        return None


if __name__ == '__main__':

    cnn = CNNMnist()

    cnn.compile()

    cnn.fit()

    cnn.predict()

    print(CNNMnist.model.summary())
```

* 训练效果

```
epoch 1:
......
43168/50000 [========================>.....] - ETA: 35s - loss: 3.6360 - acc: 0.1547
43200/50000 [========================>.....] - ETA: 35s - loss: 3.6354 - acc: 0.1547
43232/50000 [========================>.....] - ETA: 35s - loss: 3.6352 - acc: 0.1548
43264/50000 [========================>.....] - ETA: 34s - loss: 3.6348 - acc: 0.1549
43296/50000 [========================>.....] - ETA: 34s - loss: 3.6346 - acc: 0.1549


```

