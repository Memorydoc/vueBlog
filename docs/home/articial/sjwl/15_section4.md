#  Tensorflow实现神经网络

## 学习目标

- 目标
  - 掌握Tensorflow 模型API的使用
- 应用
  - 应用TF搭建一个时尚分类分类模型

## tf.keras构建模型训练评估测试API介绍

```python
import tensorflow as tf
from tensorflow import keras
```

###  构建模型

* **1、Keras中模型类型：Sequential模型**
  * 在 Keras 中，您可以通过组合层来构建模型。模型（通常）是由层构成的图。最常见的模型类型是层的堆叠，keras.layers中就有很多模型，如下图：可以在源码文件中找到
    * tf.keras.Sequential模型(layers如下)

```python
from tensorflow.python.keras.layers import Dense
from tensorflow.python.keras.layers import DepthwiseConv2D
from tensorflow.python.keras.layers import Dot
from tensorflow.python.keras.layers import Dropout
from tensorflow.python.keras.layers import ELU
from tensorflow.python.keras.layers import Embedding
from tensorflow.python.keras.layers import Flatten
from tensorflow.python.keras.layers import GRU
from tensorflow.python.keras.layers import GRUCell
from tensorflow.python.keras.layers import LSTMCell
...
...
...
```

* Flatten:将输入数据进行形状改变展开
* Dense:添加一层神经元
  * Dense(units,activation=None,**kwargs)
    * units:神经元个数
    * activation：激活函数,参考tf.nn.relu,tf.nn.softmax,tf.nn.sigmoid,tf.nn.tanh
    * **kwargs:输入上层输入的形状，input_shape=()

tf.keras.Sequential构建类似管道的模型

```
model = keras.Sequential([
    keras.layers.Flatten(input_shape=(28, 28)),
    keras.layers.Dense(128, activation=tf.nn.relu),
    keras.layers.Dense(10, activation=tf.nn.softmax)
])
```

* **Model类型：**
* **from** keras.models **import** Model
* Model(inputs=a, outputs=b)
  * inputs:定义模型的输入,Input类型
  * outpts:定义模型的输出
  * **def** **call**(self, inputs):接收来自上层的输入

```python
from keras.models import Model
from keras.layers import Input, Dense

data = Input(shape=(784,))
out = Dense(32)(data)
model = Model(input=data, output=out)
```

### Models属性

- `model.layers`：获取模型结构列表

```python
print(model.layers)
[<tensorflow.python.keras.layers.core.Flatten object at 0x10864a780>, <tensorflow.python.keras.layers.core.Dense object at 0x10f95b128>, <tensorflow.python.keras.layers.core.Dense object at 0x125bd6fd0>, <tensorflow.python.keras.layers.core.Dense object at 0x125bf9240>]
```

- `model.inputs` 是模型的输入张量列表

```python
print(model.inputs)
[<tf.Tensor 'flatten_input:0' shape=(?, 28, 28) dtype=float32>]
```

- `model.outputs` 是模型的输出张量列表

```python
print(model.outputs)
[<tf.Tensor 'dense_2/Softmax:0' shape=(?, 10) dtype=float32>]
```

- `model.summary()`打印模型的摘要表示

```
Layer (type)                 Output Shape              Param #   
=================================================================
flatten (Flatten)            (None, 784)               0         
_________________________________________________________________
dense (Dense)                (None, 64)                50240     
_________________________________________________________________
dense_1 (Dense)              (None, 128)               8320      
_________________________________________________________________
dense_2 (Dense)              (None, 10)                1290      
=================================================================
Total params: 59,850
Trainable params: 59,850
Non-trainable params: 0
```

###  Models方法

* 通过调用model的 `compile` 方法去配置该模型所需要的训练参数以及评估方法。

* model.compile(optimizer,loss=None,metrics=None, 准确率衡):配置训练相关参数

  * optimizer:梯度下降优化器(在keras.optimizers)

  ```python
  from tensorflow.python.keras.optimizers import Adadelta
  from tensorflow.python.keras.optimizers import Adagrad
  from tensorflow.python.keras.optimizers import Adam
  from tensorflow.python.keras.optimizers import Adamax
  from tensorflow.python.keras.optimizers import Nadam
  from tensorflow.python.keras.optimizers import Optimizer
  from tensorflow.python.keras.optimizers import RMSprop
  from tensorflow.python.keras.optimizers import SGD
  from tensorflow.python.keras.optimizers import deserialize
  from tensorflow.python.keras.optimizers import get
  from tensorflow.python.keras.optimizers import serialize
  from tensorflow.python.keras.optimizers import AdamOptimizer()
  ```

  * loss=None:损失类型,类型可以是字符串或者该function名字参考：

  ```python
  from tensorflow.python.keras.losses import KLD
  from tensorflow.python.keras.losses import KLD as kld
  from tensorflow.python.keras.losses import KLD as kullback_leibler_divergence
  from tensorflow.python.keras.losses import MAE
  from tensorflow.python.keras.losses import MAE as mae
  from tensorflow.python.keras.losses import MAE as mean_absolute_error
  from tensorflow.python.keras.losses import MAPE
  from tensorflow.python.keras.losses import MAPE as mape
  from tensorflow.python.keras.losses import MAPE as mean_absolute_percentage_error
  from tensorflow.python.keras.losses import MSE
  from tensorflow.python.keras.losses import MSE as mean_squared_error
  from tensorflow.python.keras.losses import MSE as mse
  from tensorflow.python.keras.losses import MSLE
  from tensorflow.python.keras.losses import MSLE as mean_squared_logarithmic_error
  from tensorflow.python.keras.losses import MSLE as msle
  from tensorflow.python.keras.losses import binary_crossentropy
  from tensorflow.python.keras.losses import categorical_crossentropy
  from tensorflow.python.keras.losses import categorical_hinge
  from tensorflow.python.keras.losses import cosine
  from tensorflow.python.keras.losses import cosine as cosine_proximity
  from tensorflow.python.keras.losses import deserialize
  from tensorflow.python.keras.losses import get
  from tensorflow.python.keras.losses import hinge
  from tensorflow.python.keras.losses import logcosh
  from tensorflow.python.keras.losses import poisson
  from tensorflow.python.keras.losses import serialize
  from tensorflow.python.keras.losses import sparse_categorical_crossentropy
  from tensorflow.python.keras.losses import squared_hinge
  ```

  * metrics=None, ['accuracy']


```python
model.compile(optimizer=tf.keras.optimizers.Adam(),
              loss='sparse_categorical_crossentropy',
              metrics=['accuracy'])
```

sparse_categorical_crossentropy:对于目标值是整型的进行交叉熵损失计算

categorical_crossentropy:对于两个output tensor and a target tensor进行交叉熵损失计算

* model.fit()：进行训练

  * (x=None,y=None, batch_size=None,epochs=1,callbacks=None)

  * x:特征值:

    ```python
    1、Numpy array (or array-like), or a list of arrays
    2、A TensorFlow tensor, or a list of tensors
    3、`tf.data` dataset or a dataset iterator. Should return a tuple of either `(inputs, targets)` or `(inputs, targets, sample_weights)`.
    4、A generator or `keras.utils.Sequence` returning `(inputs, targets)` or `(inputs, targets, sample weights)`.
    ```

  * y:目标值

  * batch_size=None：批次大小

  * epochs=1：训练迭代次数

  * **callbacks=None：添加回调列表（用于如tensorboard显示等）**

```python
model.fit(train_images, train_labels, epochs=5, batch_size=32)
```

* model.evaluate(test_images, test_labels)

```
model.evaluate(test, test_label)
```

* 预测model.predict(test)：

* 其它方法：
  - `model.save_weights(filepath)` 将模型的权重保存为HDF5文件或者ckpt文件
  - `model.load_weights(filepath, by_name=False)`从HDF5文件（由其创建`save_weights`）加载模型的权重。默认情况下，架构预计不会更改。要将权重加载到不同的体系结构（具有一些共同的层），请使用`by_name=True`仅加载具有相同名称的那些层。

## 案例：实现多层神经网络进行时装分类

70000 张灰度图像，涵盖 10 个类别。以下图像显示了单件服饰在较低分辨率（28x28 像素）下的效果：

![服装](/img/articial/服装.png)

###  需求：

| 标签 | 类别        |
| ---- | ----------- |
| 0    | T 恤衫/上衣 |
| 1    | 裤子        |
| 2    | 套衫        |
| 3    | 裙子        |
| 4    | 外套        |
| 5    | 凉鞋        |
| 6    | 衬衫        |
| 7    | 运动鞋      |
| 8    | 包包        |

### 步骤分析和代码实现：

* 读取数据集:
  * 从datasets中获取相应的数据集，直接有训练集和测试集

```python
class SingleNN(object):

    def __init__(self):
        (self.train, self.train_label), (self.test, self.test_label) = keras.datasets.fashion_mnist.load_data()
```

* 进行模型编写
  * 双层：128个神经元，全连接层10个类别输出
  * Dense(128, activation=tf.nn.relu)：
    * 定义网络结构以及初始化权重偏置参数

```python
class SingleNN(object):

    model = keras.Sequential([
        keras.layers.Flatten(input_shape=(28, 28)),
        keras.layers.Dense(128, activation=tf.nn.relu),
        keras.layers.Dense(10, activation=tf.nn.softmax)
    ])
```

这里我们model只是放在类中，作为类的固定模型属性, 这里的激活函数暂时使用tf.nn.relu函数

* 编译定义优化过程:

这里选择我们SGD优化器

* keras.optimizers.SGD()

```
keras.optimizers.SGD(lr=0.01)
```

loss:tf.keras.losses.sparse_categorical_crossentropy

metrics：accuracy

```python
def compile(self):

        SingleNN.model.compile(optimizer=keras.optimizers.SGD(lr=0.01),
                               loss=tf.keras.losses.sparse_categorical_crossentropy,
                               metrics=['accuracy'])
        return None
```

* 训练:
  * **关于迭代次数与每次迭代样本数**
  * 设置batch_size=32或者128查看效果（值如何设置，优化部分会进行讲解）

```python
    def fit(self):

        SingleNN.model.fit(self.train, self.train_label, epochs=5, batch_size=32)

        return None
```

* 评估:

```python
	def evaluate(self):

        test_loss, test_acc = SingleNN.model.evaluate(self.test, self.test_label)

        print(test_loss, test_acc)

        return None
```

观察效果

```
Epoch 1/1
   32/60000 [..............................] - ETA: 3:23 - loss: 14.7501 - acc: 0.0312
  640/60000 [..............................] - ETA: 14s - loss: 14.2735 - acc: 0.1109 
 1408/60000 [..............................] - ETA: 8s - loss: 13.4711 - acc: 0.1626 
 2144/60000 [>.............................] - ETA: 7s - loss: 13.3273 - acc: 0.1721
 2688/60000 [>.............................] - ETA: 6s - loss: 13.2748 - acc: 0.1752
 2944/60000 [>.............................] - ETA: 7s - loss: 13.2538 - acc: 0.1766
 3328/60000 [>.............................] - ETA: 7s - loss: 13.2791 - acc: 0.1752
 3552/60000 [>.............................] - ETA: 7s - loss: 13.2540 - acc: 0.1768
 4000/60000 [=>............................] - ETA: 7s - loss: 13.3192 - acc: 0.1727
 4448/60000 [=>............................] - ETA: 7s - loss: 13.4163 - acc: 0.1668
 5248/60000 [=>............................] - ETA: 6s - loss: 13.4322 - acc: 0.1658
 5888/60000 [=>............................] - ETA: 6s - loss: 13.4066 - acc: 0.1675
 6592/60000 [==>...........................] - ETA: 6s - loss: 13.3856 - acc: 0.1688
 7040/60000 [==>...........................] - ETA: 5s - loss: 13.4107 - acc: 0.1673
 7552/60000 [==>...........................] - ETA: 5s - loss: 13.4235 - acc: 0.1666
 8064/60000 [===>..........................] - ETA: 5s - loss: 13.4387 - acc: 0.1657
 8480/60000 [===>..........................] - ETA: 5s - loss: 13.4314 - acc: 0.1662
 8928/60000 [===>..........................] - ETA: 5s - loss: 13.4435 - acc: 0.1654
 9440/60000 [===>..........................] - ETA: 5s - loss: 13.4144 - acc: 0.1673
10016/60000 [====>.........................] - ETA: 5s - loss: 13.3976 - acc: 0.1683
10304/60000 [====>.........................] - ETA: 5s - loss: 13.3751 - acc: 0.1697
10528/60000 [====>.........................] - ETA: 5s - loss: 13.3661 - acc: 0.1703
10880/60000 [====>.........................] - ETA: 5s - loss: 13.3701 - acc: 0.1699
11296/60000 [====>.........................] - ETA: 5s - loss: 13.3929 - acc: 0.1686
12032/60000 [=====>........................] - ETA: 5s - loss: 13.4497 - acc: 0.1651
12352/60000 [=====>........................] - ETA: 5s - loss: 13.4571 - acc: 0.1646
12608/60000 [=====>........................] - ETA: 5s - loss: 13.4575 - acc: 0.1646
```

* **效果不好，这里要进行特征归一化（优化部分会进行讲解）**

```python
# 做特征值的归一化
# 所有像素值范围0~255,
self.train = self.train / 255.0
self.test = self.test / 255.0
```

```
Epoch 1/1
   32/60000 [..............................] - ETA: 4:17 - loss: 2.4778 - acc: 0.1250
  480/60000 [..............................] - ETA: 23s - loss: 2.2573 - acc: 0.1917 
 1056/60000 [..............................] - ETA: 13s - loss: 2.0594 - acc: 0.3248
 1632/60000 [..............................] - ETA: 10s - loss: 1.9308 - acc: 0.3909
 2112/60000 [>.............................] - ETA: 9s - loss: 1.8408 - acc: 0.4304 
 2464/60000 [>.............................] - ETA: 9s - loss: 1.7832 - acc: 0.4517
 2816/60000 [>.............................] - ETA: 9s - loss: 1.7343 - acc: 0.4677
 3296/60000 [>.............................] - ETA: 8s - loss: 1.6729 - acc: 0.4909
 3712/60000 [>.............................] - ETA: 8s - loss: 1.6327 - acc: 0.5030
 4032/60000 [=>............................] - ETA: 8s - loss: 1.5975 - acc: 0.5131
 4480/60000 [=>............................] - ETA: 8s - loss: 1.5590 - acc: 0.5250
 4768/60000 [=>............................] - ETA: 8s - loss: 1.5328 - acc: 0.5344
 5248/60000 [=>............................] - ETA: 7s - loss: 1.4884 - acc: 0.5497
 5664/60000 [=>............................] - ETA: 7s - loss: 1.4587 - acc: 0.5572
 6304/60000 [==>...........................] - ETA: 7s - loss: 1.4136 - acc: 0.5692
 7040/60000 [==>...........................] - ETA: 6s - loss: 1.3682 - acc: 0.5805
 7392/60000 [==>...........................] - ETA: 6s - loss: 1.3480 - acc: 0.5875
 7712/60000 [==>...........................] - ETA: 6s - loss: 1.3311 - acc: 0.5927
 8128/60000 [===>..........................] - ETA: 6s - loss: 1.3119 - acc: 0.5979
 8832/60000 [===>..........................] - ETA: 6s - loss: 1.2828 - acc: 0.6060
 9568/60000 [===>..........................] - ETA: 6s - loss: 1.2503 - acc: 0.6156
10080/60000 [====>.........................] - ETA: 6s - loss: 1.2283 - acc: 0.6216
10528/60000 [====>.........................] - ETA: 5s - loss: 1.2136 - acc: 0.6260

```

### 打印模型

* model.summary()：查看模型结构

### 手动保存和恢复模型

* 保存成ckpt形式
  * model.save_weights('./weights/my_model')
  * model.load_weights('./weights/my_model')

```python
SingleNN.model.save_weights("./ckpt/SingleNN")

def predict(self):

    # 直接使用训练过后的权重测试
    if os.path.exists("./ckpt/checkpoint"):

    	SingleNN.model.load_weights("./ckpt/SingleNN")

    predictions = SingleNN.model.predict(self.test)

    # 对预测结果进行处理
    print(np.argmax(predictions, 1))

    return
```

* 保存成h5文件

```python
SingleNN.model.save_weights("./ckpt/SingleNN.h5")

def predict(self):

    # 直接使用训练过后的权重测试
    if os.path.exists("./ckpt/checkpoint"):

    	SingleNN.model.load_weights("./ckpt/SingleNN.h5")

    predictions = SingleNN.model.predict(self.test)

    print(np.argmax(predictions, 1))

    return
```

##  fit的callbacks详解

回调是在训练过程的给定阶段应用的一组函数。可以使用回调来获取培训期间内部状态和模型统计信息的视图。您可以将回调列表（作为关键字参数`callbacks`）传递给或类的`fit()`方法。然后将在训练的每个阶段调用回调的相关方法。

* 定制化保存模型
* 保存events文件

###  ModelCheckpoint

from tensorflow.python.keras.callbacks import ModelCheckpoint

* keras.callbacks.ModelCheckpoint(filepath, monitor='val_loss', save_best_only=False, save_weights_only=False, mode='auto', period=1)
  * Save the model after every epoch：每隔多少次迭代保存模型
  * filepath: 保存模型字符串
    * 如果设置 weights.{epoch:02d}-{val_loss:.2f}.hdf5格式，将会每隔epoch number数量并且将验证集的损失保存在该位置
    * 如果设置weights.{epoch:02d}-{val_acc:.2f}.hdf5，将会按照val_acc的值进行保存模型
  * monitor: quantity to monitor.设置为'val_acc'或者'val_loss'
  * save_best_only: if save_best_only=True, 只保留比上次模型更好的结果
  * save_weights_only: if True, 只保存去那种(model.save_weights(filepath)), else the full model is saved (model.save(filepath)).
  * mode: one of {auto, min, max}. 如果save_best_only=True, 对于val_acc, 要设置max, 对于val_loss要设置min
  * period: 迭代保存checkpoints的间隔

```python
check = ModelCheckpoint('./ckpt/singlenn_{epoch:02d}-{val_acc:.2f}.h5',
                                monitor='val_acc',
                                save_best_only=True,
                                save_weights_only=True,
                                mode='auto',
                                period=1)

SingleNN.model.fit(self.train, self.train_label, epochs=5, callbacks=[check])
```

### Tensorboard

* 添加Tensorboard观察损失等情况
* keras.callbacks.TensorBoard(log_dir='./logs', histogram_freq=0, batch_size=32, write_graph=True, write_grads=False, write_images=False, embeddings_freq=0, embeddings_layer_names=None, embeddings_metadata=None, embeddings_data=None, update_freq='epoch')
  * log_dir:保存事件文件目录
  * write_graph=True：是否显示图结构
  * write_images=False：是否显示图片
  * write_grads=True:是否显示梯度`histogram_freq` 必须大于0

```python
# 添加tensoboard观察
 tensorboard = keras.callbacks.TensorBoard(log_dir='./graph', histogram_freq=1,
                                                  write_graph=True, write_images=True)

SingleNN.model.fit(self.train, self.train_label, epochs=5, callbacks=[tensorboard])
```





