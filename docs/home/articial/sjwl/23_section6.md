#  经典分类网络结构

## 学习目标

- 目标
  - 知道LeNet-5网络结构
  - 了解经典的分类网络结构
  - 知道一些常见的卷机网络结构的优化
    - 知道NIN中1x1卷积原理以及作用
    - 知道Inception的作用
  - 了解卷积神经网络学习过程内容
- 应用
  - 无

下面我们主要以一些常见的网络结构去解析，并介绍大部分的网络的特点。这里看一下卷积的发展历史图。

![](/img/articial/发展.png)

### LeNet-5解析

首先我们从一个稍微早一些的卷积网络结构LeNet-5（这里稍微改了下名字）,开始的目的是用来识别数字的。从前往后介绍完整的结构组成，并计算相关输入和输出。

####  网络结构

![](/img/articial/LeNet5结构.png)

* 激活层默认不画网络图当中，这个网络结构当时使用的是sigmoid和Tanh函数，还没有出现Relu函数
* 将卷积、激活、池化视作一层，即使池化没有参数

#### 参数形状总结

|                |   shape    | size | parameters |
| :------------: | :--------: | :--: | :--------: |
|     Input      | (32,32,3)  | 3072 |     0      |
| Conv1(f=5,s=1) | (28,28,6)  | 4704 |   450+6    |
|     Pool1      | (14,14,6)  | 1176 |     0      |
| Conv2(f=5,s=1) | (10,10,16) | 1600 |  2400+16   |
|     Pool2      |  (5,5,16)  | 400  |     0      |
|      FC3       |  (120,1)   | 120  | 48000+120  |
|      FC4       |   (84,1)   |  84  |  10080+84  |
| Ouput:softmax  |   (10,1)   |  10  |   840+10   |

* 中间的特征大小变化不宜过快

事实上，在过去很多年，许多机构或者学者都发布了各种各样的网络，其实去了解设计网络最好的办法就是去研究现有的网络结构或者论文。大多数网络设计出来是为了Image Net的比赛（解决ImageNet中的1000类图像分类或定位问题），后来大家在各个业务上进行使用。

### AlexNet

2012年，Alex Krizhevsky、Ilya Sutskever在多伦多大学Geoff Hinton的实验室设计出了一个深层的卷积神经网络AlexNet，夺得了2012年ImageNet LSVRC的冠军，且准确率远超第二名（top5错误率为15.3%，第二名为26.2%），引起了很大的轰动。AlexNet可以说是具有历史意义的一个网络结构。

![](/img/articial/%E7%BB%B4%E5%BA%A6%E7%B4%A2%E5%BC%951.png)

* 总参数量：60M=6000万，5层卷积+3层全连接
* 使用了非线性激活函数：ReLU
* 防止过拟合的方法：Dropout
* 批标准化层的使用

###卷积网络结构的优化

#### 常见结构特点

整个过程：AlexNet—NIN—(VGG—GoogLeNet)—ResNet 

* NIN:**引入1 * 1卷积**
* VGG，斩获2014年分类第二（第一是GoogLeNet），定位任务第一。
  - 参数量巨大,140M = 1.4亿
  - 19layers
  - VGG 版本
    - VGG16
    - VGG19

![](/img/articial/VGG参数量.png)

* GoogleNet，2014年比赛冠军的model，这个model证明了一件事：用更多的卷积，更深的层次可以得到更好的结构。（当然，它并没有证明浅的层次不能达到这样的效果）
  * 500万的参数量
  * 22layers
  * **引入了Inception模块**
    * Inception V1
    * Inception V2
    * Inception V3
    * Inception V4

![](/img/articial/GoogleNet参数介绍.png)

* 下面我们将针对卷积网络架构常用的一些结构进行详细分析，来探究这些结构带来的好处

### Inception 结构

首先我们要说一下在Network in Network中引入的1 x 1卷积结构的相关作用

#### MLP卷积(1 x 1卷积)

![](/img/articial/NIN论文.png)

* 目的:提出了一种新的深度网络结构，称为“网络中的网络”（NIN），增强接受域内局部贴片的模型判别能力。
* 做法
  * 提出MLP卷积取代传统线性卷积核
* 作用或优点：
  * **重要作用：1x1的卷积核操作还可以实现卷积核通道数的降维和升维，实现参数的减小化**
  * 多个1x1的卷积核，提高特征抽象能力（Multilayer Perceptron,缩写MLP,就是一个多层神经网络）

#### 1 x 1卷积介绍

![](/img/articial/11卷积.png)

从图中，看到1 x 1卷积的过程，那么这里先假设只有3个1x1Filter，那么最终结果还是56x56x3。但是每一个FIlter的三个参数的作用

* **1、看作是对三个通道进行了线性组合。**

我们甚至可以把这几个FIlter可以看成就是一个简单的神经元结构，每个神经元参数数量与前面的通道数量相等。

* 2、通常在卷积之后会加入非线性激活函数，在这里之后加入激活函数，就可以理解成一个简单的MLP网络了。

![](/img/articial/1*1举例子.png)

#### 通道数变化

那么对于1x1网络对通道数的变化，其实并不是最重要的特点，因为毕竟3 x 3,5 x 5都可以带来通道数的变化，

而1x1卷积的参数并不多，我们拿下面的例子来看。

![](/img/articial/卷积通道变化.png)

* 保持通道数不变
* 提升通道数
* 减少通道数

#### Inception层

这个结构其实还有名字叫盗梦空间结构。

* 目的：
  * 代替人手工去确定到底使用1x1,3x3,5x5还是是否需要max_pooling层，由网络自动去寻找适合的结构。并且节省计算。

![](/img/articial/Inception.png)

* 特点
  * 是每一个卷积/池化最终结果的长、宽大小一致
  * 特殊的池化层，需要增加padding，步长为1来使得输出大小一致，并且选择32的通道数
  * 最终结果28 x 28 x 256
    * 使用更少的参数，达到跟AlexNet或者VGG同样类似的输出结果

#### Inception改进

改进目的：减少计算，如5 x 5卷积那的运算量

![](/img/articial/inception改进.png)

* 上面的参数：5 x 5 x 32 x 192 =153600
* 下面的参数：192 x 16 + 5 x 5 x 16 x 32 = 3072 + 12800 = 15872

所以上面的结构会需要大量的计算，我们把这种改进的结构称之为网络的"瓶颈",网络缩小后扩大。

那么这样改变会影响网络的性能和效果吗？

GoogleNet就是如此，获得了非常好的效果。所以合理的设计网络当中的Inception结构能够减少计算，实现更好的效果。

####  GoogleNet结构（了解）

其中包含了多个Inception结构。

![](/img/articial/GoogleNetin.png)

完整结构：

![](/img/articial/GoogleNet.png)

###  卷积神经网络学习特征可视化

我们肯定会有疑问真个深度的卷积网络到底在学习什么？可以将网络学习过程中产生的特征图可视化出来，并且对比原图来看看每一层都干了什么。

* 可视化案例使用的网络

![](/img/articial/可视化网络结构.png)

* 可视化结果

![](/img/articial/可视化特征1.png)

![](/img/articial/可视化特征2.png)

![](/img/articial/可视化特征3.png)

![](/img/articial/可视化特征4.png)

![](/img/articial/可视化特征5.png)

* layer1,layer2学习到的特征基本是颜色、边缘等低层特征
* layer3学习到的特征，一些纹理特征，如网格纹理
* layer4学习到的特征会稍微复杂些，比如狗的头部形状
* layer5学习到的是完整一些的，比如关键性的区分特征

## 案例：使用pre_trained模型进行VGG预测

Google 在提供VGG行预测的时候效果会更好一些，所以选择VGG来进行测试

###  VGG模型使用

在tensorflow.keras.applications中已经存在很多现有模型，

```python
from tensorflow._api.v1.keras.applications import densenet
from tensorflow._api.v1.keras.applications import inception_resnet_v2
from tensorflow._api.v1.keras.applications import inception_v3
from tensorflow._api.v1.keras.applications import mobilenet
from tensorflow._api.v1.keras.applications import mobilenet_v2
from tensorflow._api.v1.keras.applications import nasnet
from tensorflow._api.v1.keras.applications import resnet50
from tensorflow._api.v1.keras.applications import vgg16
from tensorflow._api.v1.keras.applications import vgg19
from tensorflow._api.v1.keras.applications import xception
from tensorflow.python.keras.applications import DenseNet121
from tensorflow.python.keras.applications import DenseNet169
from tensorflow.python.keras.applications import DenseNet201
from tensorflow.python.keras.applications import InceptionResNetV2
from tensorflow.python.keras.applications import InceptionV3
from tensorflow.python.keras.applications import MobileNet
from tensorflow.python.keras.applications import MobileNetV2
from tensorflow.python.keras.applications import NASNetLarge
from tensorflow.python.keras.applications import NASNetMobile
from tensorflow.python.keras.applications import ResNet50
from tensorflow.python.keras.applications import VGG16
from tensorflow.python.keras.applications import VGG19
from tensorflow.python.keras.applications import Xception
```

我们来使用其中一个VGG16的模型进行预测，这个模型源码文件中提供了相关的预处理图片的接口以及预测结果概率的处理API

```python
from tensorflow.python.keras.applications import VGG16
from tensorflow.python.keras.applications.vgg16 import decode_predictions
from tensorflow.python.keras.applications.vgg16 import preprocess_input
```

* preprocess_input：处理输入图片
* decode_predictions：对预测结果进行处理

###  步骤以及代码

* 模型获取以及已训练好的参数加载
  * 注意:参数总计超过500M，因此当你首次使用下面的命令时，Keras需要从网上先下载这些参数模型数据到本地~/.keras/models，这可能需要耗用一些时间。

```python
itcast:~/.keras/models$ ls -alh
total 1198296
drwxr-xr-x  5 root  staff   160B Jan 16 23:25 .
drwxr-xr-x  5 root  staff   160B Feb 19 13:11 ..
-rw-r--r--  1 root  staff    35K Jan 16 14:19 imagenet_class_index.json
-rw-r--r--  1 root  staff   528M Jan 16 14:15 vgg16_weights_tf_dim_ordering_tf_kernels.h5
itcast:~/.keras/models$
```

模型获取代码

```python
model = VGG16()
print(model.summary())
```
模型打印为：
```
_________________________________________________________________
Layer (type)                 Output Shape              Param #   
=================================================================
input_1 (InputLayer)         (None, 224, 224, 3)       0         
_________________________________________________________________
block1_conv1 (Conv2D)        (None, 224, 224, 64)      1792      
_________________________________________________________________
block1_conv2 (Conv2D)        (None, 224, 224, 64)      36928     
_________________________________________________________________
block1_pool (MaxPooling2D)   (None, 112, 112, 64)      0         
_________________________________________________________________
block2_conv1 (Conv2D)        (None, 112, 112, 128)     73856     
_________________________________________________________________
block2_conv2 (Conv2D)        (None, 112, 112, 128)     147584    
_________________________________________________________________
block2_pool (MaxPooling2D)   (None, 56, 56, 128)       0         
_________________________________________________________________
block3_conv1 (Conv2D)        (None, 56, 56, 256)       295168    
_________________________________________________________________
block3_conv2 (Conv2D)        (None, 56, 56, 256)       590080    
_________________________________________________________________
block3_conv3 (Conv2D)        (None, 56, 56, 256)       590080    
_________________________________________________________________
block3_pool (MaxPooling2D)   (None, 28, 28, 256)       0         
_________________________________________________________________
block4_conv1 (Conv2D)        (None, 28, 28, 512)       1180160   
_________________________________________________________________
block4_conv2 (Conv2D)        (None, 28, 28, 512)       2359808   
_________________________________________________________________
block4_conv3 (Conv2D)        (None, 28, 28, 512)       2359808   
_________________________________________________________________
block4_pool (MaxPooling2D)   (None, 14, 14, 512)       0         
_________________________________________________________________
block5_conv1 (Conv2D)        (None, 14, 14, 512)       2359808   
_________________________________________________________________
block5_conv2 (Conv2D)        (None, 14, 14, 512)       2359808   
_________________________________________________________________
block5_conv3 (Conv2D)        (None, 14, 14, 512)       2359808   
_________________________________________________________________
block5_pool (MaxPooling2D)   (None, 7, 7, 512)         0         
_________________________________________________________________
flatten (Flatten)            (None, 25088)             0         
_________________________________________________________________
fc1 (Dense)                  (None, 4096)              102764544 
_________________________________________________________________
fc2 (Dense)                  (None, 4096)              16781312  
_________________________________________________________________
predictions (Dense)          (None, 1000)              4097000   
=================================================================
Total params: 138,357,544
Trainable params: 138,357,544
Non-trainable params: 0
```


* 图片的输入以及格式转换

我们将会用到两个API，但是使用这个API需要PIL工具，3.7兆左右大小

```python
# 在虚拟环境中下载
pip install PIL
```

```python
from tensorflow.keras.preprocessing.image import load_img
from tensorflow.keras.preprocessing.image import img_to_array
```

进行本地图片的加载,

```python
# 加载一个图片到VGG指定输入大小
image = load_img('./tiger.png', target_size=(224, 224))

# 进行数据转换到numpy数组形式，以便于VGG能够进行使用
image = img_to_array(image)

# 形状修改
image = image.reshape((1, image.shape[0], image.shape[1], image.shape[2]))
```

* 使用模型对数据进行处理和预测
  * from tensorflow.python.keras.applications.vgg16 import decode_predictions
    from tensorflow.python.keras.applications.vgg16 import preprocess_input
  * 对模型输入进行处理，对预测结果进行解码

```python
# 输入数据进行预测,进行图片的归一化处理
image = preprocess_input(image)
y_predict = model.predict(image)

# 进行结果解码
label = decode_predictions(y_predict)
# 进行lable获取
res = label[0][0]
# 预测的结果输出
print('预测的类别为：%s 概率为：(%.2f%%)' % (res[1], res[2]*100))
```

输出结果为

```
Downloading data from https://s3.amazonaws.com/deep-learning-models/image-models/imagenet_class_index.json
 8192/35363 [=====>........................] - ETA: 0s
24576/35363 [===================>..........] - ETA: 0s
40960/35363 [==================================] - 0s 6us/step

预测的类别为：tiger 概率为：(80.30%)
```

##  总结

* 掌握LeNet-5 结构计算
* 了解卷积常见网络结构
* 掌握1x1卷积结构作用
* 掌握Inception结构作用
* 掌握keras的VGG模型的使用

