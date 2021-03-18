# 案例：用PyTorch实现MNIST手写数字识别

MNIST可以说是机器学习入门的hello word了！导师一般第一个就让你研究MNIST，研究透了，也算基本入门了。好的，今天就来扯一扯学一学。

![](/img/articial/ss1.png)

   在本文中，我们将在PyTorch中构建一个简单的卷积神经网络，并使用MNIST数据集训练它识别手写数字。在MNIST数据集上训练分类器可以看作是图像识别的“hello world”。

    MNIST包含70,000张手写数字图像: 60,000张用于培训，10,000张用于测试。图像是灰度的，28x28像素的，并且居中的，以减少预处理和加快运行。

 

## 设置环境

    在本文中，我们将使用PyTorch训练一个卷积神经网络来识别MNIST的手写数字。PyTorch是一个非常流行的深度学习框架，比如Tensorflow、CNTK和caffe2。但是与其他框架不同的是，PyTorch具有动态执行图，这意味着计算图是动态创建的。

    先去官网上根据指南在PC上装好PyTorch环境，然后引入库。

```py  
import torch
import torchvision
from torch.utils.data import DataLoader
```

## 准备数据集
   
导入就绪后，我们可以继续准备将要使用的数据。但在那之前，我们将定义超参数，我们将使用的实验。在这里，epoch的数量定义了我们将循环整个训练数据集的次数，而learning_rate和momentum是我们稍后将使用的优化器的超参数。

```py  
n_epochs = 3
batch_size_train = 64
batch_size_test = 1000
learning_rate = 0.01
momentum = 0.5
log_interval = 10
random_seed = 1
torch.manual_seed(random_seed)
```

对于可重复的实验，我们必须为任何使用随机数产生的东西设置随机种子——如numpy和random! 
现在我们还需要数据集的dataloader。这就是TorchVision发挥作用的地方。它让我们用一种方便的方式来加载MNIST数据集。我们将使用batch_size=64进行训练，并使用size=1000对这个数据集进行测试。下面的Normalize()转换使用的值0.1307和0.3081是MNIST数据集的全局平均值和标准偏差，这里我们将它们作为给定值。
TorchVision提供了许多方便的转换，比如裁剪或标准化。


```py  
train_loader = torch.utils.data.DataLoader(
  torchvision.datasets.MNIST('./data/', train=True, download=True,
                             transform=torchvision.transforms.Compose([
                               torchvision.transforms.ToTensor(),
                               torchvision.transforms.Normalize(
                                 (0.1307,), (0.3081,))
                             ])),
  batch_size=batch_size_train, shuffle=True)
test_loader = torch.utils.data.DataLoader(
  torchvision.datasets.MNIST('./data/', train=False, download=True,
                             transform=torchvision.transforms.Compose([
                               torchvision.transforms.ToTensor(),
                               torchvision.transforms.Normalize(
                                 (0.1307,), (0.3081,))
                             ])),
  batch_size=batch_size_test, shuffle=True)
​
```
 运行上面的程序后，会自动将数据集下载到目录下的data文件夹。下载过程可能有点烦，经常卡住不动，只能多来几遍。完成后就是这样了：


 除了数据集和批处理大小之外，PyTorch的DataLoader还包含一些有趣的选项。例如，我们可以使用num_workers > 1来使用子进程异步加载数据，或者使用固定RAM(通过pin_memory)来加速RAM到GPU的传输。但是因为这些在我们使用GPU时很重要，我们可以在这里省略它们。

    现在让我们看一些例子。我们将为此使用test_loader。

    让我们看看一批测试数据由什么组成。

```py 
examples = enumerate(test_loader)
batch_idx, (example_data, example_targets) = next(examples)
print(example_targets)
print(example_data.shape)
```

example_targets是图片实际对应的数字标签：
![](/img/articial/ss2.png)




一批测试数据是一个形状张量：
 这意味着我们有1000个例子的28x28像素的灰度(即没有rgb通道)。
我们可以使用matplotlib来绘制其中的一些

```py  
import matplotlib.pyplot as plt
fig = plt.figure()
for i in range(6):
  plt.subplot(2,3,i+1)
  plt.tight_layout()
  plt.imshow(example_data[i][0], cmap='gray', interpolation='none')
  plt.title("Ground Truth: {}".format(example_targets[i]))
  plt.xticks([])
  plt.yticks([])
plt.show()
```

![](/img/articial/ss3.png)

 好的，经过一些训练，这些应该不难识别。

 

## 构建网络

现在让我们开始建立我们的网络。我们将使用两个2d卷积层，然后是两个全连接(或线性)层。作为激活函数，我们将选择整流线性单元(简称ReLUs)，作为正则化的手段，我们将使用两个dropout层。在PyTorch中，构建网络的一个好方法是为我们希望构建的网络创建一个新类。让我们在这里导入一些子模块，以获得更具可读性的代码。

```py  
import torch.nn as nn
import torch.nn.functional as F
import torch.optim as optim

class Net(nn.Module):
    def __init__(self):
        super(Net, self).__init__()
        self.conv1 = nn.Conv2d(1, 10, kernel_size=5)
        self.conv2 = nn.Conv2d(10, 20, kernel_size=5)
        self.conv2_drop = nn.Dropout2d()
        self.fc1 = nn.Linear(320, 50)
        self.fc2 = nn.Linear(50, 10)
    def forward(self, x):
        x = F.relu(F.max_pool2d(self.conv1(x), 2))
        x = F.relu(F.max_pool2d(self.conv2_drop(self.conv2(x)), 2))
        x = x.view(-1, 320)
        x = F.relu(self.fc1(x))
        x = F.dropout(x, training=self.training)
        x = self.fc2(x)
        return F.log_softmax(x)
```





具体各部分的含义，在下面详细讲！

广义地说，我们可以想到torch.nn层中包含可训练的参数，而torch.nn.functional就是纯粹的功能性。forward()传递定义了使用给定的层和函数计算输出的方式。为了便于调试，在前向传递中打印出张量是完全可以的。在试验更复杂的模型时，这就派上用场了。请注意，前向传递可以使用成员变量甚至数据本身来确定执行路径——它还可以使用多个参数!

现在让我们初始化网络和优化器。

```py  
network = Net()
optimizer = optim.SGD(network.parameters(), lr=learning_rate,
                      momentum=momentum)
```

    注意:如果我们使用GPU进行训练，我们也应该使用例如network.cuda()将网络参数发送给GPU。在将网络参数传递给优化器之前，将它们传输到适当的设备是很重要的，否则优化器将无法以正确的方式跟踪它们。

## 模型训练
    是时候建立我们的训练循环了。首先，我们要确保我们的网络处于训练模式。然后，每个epoch对所有训练数据进行一次迭代。加载单独批次由DataLoader处理。

    首先，我们需要使用optimizer.zero_grad()手动将梯度设置为零，因为PyTorch在默认情况下会累积梯度。然后，我们生成网络的输出(前向传递)，并计算输出与真值标签之间的负对数概率损失。现在，我们收集一组新的梯度，并使用optimizer.step()将其传播回每个网络参数。有关PyTorch自动渐变系统内部工作方式的详细信息，请参阅autograd的官方文档(强烈推荐)。

    我们还将使用一些打印输出来跟踪进度。为了在以后创建一个良好的培训曲线，我们还创建了两个列表来节省培训和测试损失。在x轴上，我们希望显示网络在培训期间看到的培训示例的数量。

```py 
train_losses = []
train_counter = []
test_losses = []
test_counter = [i*len(train_loader.dataset) for i in range(n_epochs + 1)]
```

    在开始训练之前，我们将运行一次测试循环，看看仅使用随机初始化的网络参数可以获得多大的精度/损失。你能猜出我们的准确度是多少吗?


```py 
def train(epoch):
  network.train()
  for batch_idx, (data, target) in enumerate(train_loader):
    optimizer.zero_grad()
    output = network(data)
    loss = F.nll_loss(output, target)
    loss.backward()
    optimizer.step()
    if batch_idx % log_interval == 0:
      print('Train Epoch: {} [{}/{} ({:.0f}%)]\tLoss: {:.6f}'.format(
        epoch, batch_idx * len(data), len(train_loader.dataset),
        100. * batch_idx / len(train_loader), loss.item()))
      train_losses.append(loss.item())
      train_counter.append(
        (batch_idx*64) + ((epoch-1)*len(train_loader.dataset)))
      torch.save(network.state_dict(), './model.pth')
      torch.save(optimizer.state_dict(), './optimizer.pth')
          
train(1)
```
![](/img/articial/ss4.png)
神经网络模块以及优化器能够使用.state_dict()保存和加载它们的内部状态。这样，如果需要，我们就可以继续从以前保存的状态dict中进行训练——只需调用.load_state_dict(state_dict)。

现在进入测试循环。在这里，我们总结了测试损失，并跟踪正确分类的数字来计算网络的精度。


```py 
def test():
  network.eval()
  test_loss = 0
  correct = 0
  with torch.no_grad():
    for data, target in test_loader:
      output = network(data)
      test_loss += F.nll_loss(output, target, size_average=False).item()
      pred = output.data.max(1, keepdim=True)[1]
      correct += pred.eq(target.data.view_as(pred)).sum()
  test_loss /= len(test_loader.dataset)
  test_losses.append(test_loss)
  print('\nTest set: Avg. loss: {:.4f}, Accuracy: {}/{} ({:.0f}%)\n'.format(
    test_loss, correct, len(test_loader.dataset),
    100. * correct / len(test_loader.dataset)))
    
test()
```

使用上下文管理器no_grad()，我们可以避免将生成网络输出的计算结果存储在计算图中。
    是时候开始训练了!我们将在循环遍历n_epochs之前手动添加test()调用，以使用随机初始化的参数来评估我们的模型。

```py 
test()
for epoch in range(1, n_epochs + 1):
  train(epoch)
  test()
```
![](/img/articial/ss5.png)

::: warning
此时看一下电脑CPU
:::



##  评估模型的性能
就是这样。仅仅经过3个阶段的训练，我们已经能够达到测试集97%的准确率!我们开始使用随机初始化的参数，正如预期的那样，在开始训练之前，测试集的准确率只有10%左右。
我们来画一下训练曲线。




```py 
import matplotlib.pyplot as plt
fig = plt.figure()
plt.plot(train_counter, train_losses, color='blue')
plt.scatter(test_counter, test_losses, color='red')
plt.legend(['Train Loss', 'Test Loss'], loc='upper right')
plt.xlabel('number of training examples seen')
plt.ylabel('negative log likelihood loss')
plt.show()

```
![](/img/articial/ss6.png)

从训练曲线来看，看起来我们甚至可以继续训练几个epoch!

但在此之前，让我们再看看几个例子，正如我们之前所做的，并比较模型的输出。

```py 
examples = enumerate(test_loader)
batch_idx, (example_data, example_targets) = next(examples)
with torch.no_grad():
  output = network(example_data)
fig = plt.figure()
for i in range(6):
  plt.subplot(2,3,i+1)
  plt.tight_layout()
  plt.imshow(example_data[i][0], cmap='gray', interpolation='none')
  plt.title("Prediction: {}".format(
    output.data.max(1, keepdim=True)[1][i].item()))
  plt.xticks([])
  plt.yticks([])
plt.show()

```
![](/img/articial/ss7.png)
    我们的模型对这些例子的预测似乎是正确的!

## 检查点的持续训练
   
   现在让我们继续对网络进行训练，或者看看如何从第一次培训运行时保存的state_dicts中继续进行训练。我们将初始化一组新的网络和优化器。

```py 
continued_network = Net()
continued_optimizer = optim.SGD(network.parameters(), lr=learning_rate,
                                momentum=momentum)
```
  使用.load_state_dict()，我们现在可以加载网络的内部状态，并在最后一次保存它们时优化它们。
```py 
network_state_dict = torch.load('model.pth')
continued_network.load_state_dict(network_state_dict)
optimizer_state_dict = torch.load('optimizer.pth')
continued_optimizer.load_state_dict(optimizer_state_dict)
```  
  
同样，运行一个训练循环应该立即恢复我们之前的训练。为了检查这一点，我们只需使用与前面相同的列表来跟踪损失值。由于我们为所看到的训练示例的数量构建测试计数器的方式，我们必须在这里手动添加它。  

```py 
for i in range(4,9):
  test_counter.append(i*len(train_loader.dataset))
  train(i)
  test()
```
![](/img/articial/ss8.png)
  


## 完整代码
```py 
# # -*- coding:utf-8 -*-
import cv2
import os
import numpy as np
# 检测人脸
def detect_face(img):
 #将测试图像转换为灰度图像，因为opencv人脸检测器需要灰度图像
 gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
 #加载OpenCV人脸检测分类器Haar
 face_cascade = cv2.CascadeClassifier('D:\gitclone-python\python-test\haarcascade_frontalface_default.xml')
 #检测多尺度图像，返回值是一张脸部区域信息的列表（x,y,宽,高）
 faces = face_cascade.detectMultiScale(gray, scaleFactor=1.2, minNeighbors=5)
 # 如果未检测到面部，则返回原始图像
 if (len(faces) == 0):
  return None, None
 #目前假设只有一张脸，xy为左上角坐标，wh为矩形的宽高
 (x, y, w, h) = faces[0]
 #返回图像的正面部分
 return gray[y:y + w, x:x + h], faces[0]
# 该函数将读取所有的训练图像，从每个图像检测人脸并将返回两个相同大小的列表，分别为脸部信息和标签
def prepare_training_data(data_folder_path):
 # 获取数据文件夹中的目录（每个主题的一个目录）
 dirs = os.listdir(data_folder_path)
 # 两个列表分别保存所有的脸部和标签
 faces = []
 labels = []
 # 浏览每个目录并访问其中的图像
 for dir_name in dirs:
  # dir_name(str类型)即标签
  label = int(dir_name)
  # 建立包含当前主题主题图像的目录路径
  subject_dir_path = data_folder_path + "/" + dir_name
  # 获取给定主题目录内的图像名称
  subject_images_names = os.listdir(subject_dir_path)
 # 浏览每张图片并检测脸部，然后将脸部信息添加到脸部列表faces[]
 for image_name in subject_images_names:
  # 建立图像路径
  image_path = subject_dir_path + "/" + image_name
 # 读取图像
  image = cv2.imread(image_path)
 # 显示图像0.1s
 print("fdsfsad")
 print(image_path)
 cv2.imshow("Training on image...", image)
 cv2.waitKey(100)
 # 检测脸部
 face, rect = detect_face(image)
 # 我们忽略未检测到的脸部
 if face is not None:
  #将脸添加到脸部列表并添加相应的标签
  faces.append(face)
  labels.append(label)
  cv2.waitKey(1)
  cv2.destroyAllWindows()
 #最终返回值为人脸和标签列表
 return faces, labels
#调用prepare_training_data（）函数
faces, labels = prepare_training_data("./training_data")
#创建LBPH识别器并开始训练，当然也可以选择Eigen或者Fisher识别器
face_recognizer = cv2.face.LBPHFaceRecognizer_create()
face_recognizer.train(faces, np.array(labels))
#根据给定的（x，y）坐标和宽度高度在图像上绘制矩形
def draw_rectangle(img, rect):
 (x, y, w, h) = rect
 cv2.rectangle(img, (x, y), (x + w, y + h), (128, 128, 0), 2)
# 根据给定的（x，y）坐标标识出人名
def draw_text(img, text, x, y):
 cv2.putText(img, text, (x, y), cv2.FONT_HERSHEY_COMPLEX, 1, (128, 128, 0), 2)
#建立标签与人名的映射列表（标签只能为整数）
subjects = ["jiaju", "jiaqiang"]
# 此函数识别传递的图像中的人物并在检测到的脸部周围绘制一个矩形及其名称
def predict(test_img):
 #生成图像的副本，这样就能保留原始图像
 img = test_img.copy()
 #检测人脸
 face, rect = detect_face(img)
 #预测人脸
 label = face_recognizer.predict(face)
 # 获取由人脸识别器返回的相应标签的名称
 label_text = subjects[label[0]]
 # 在检测到的脸部周围画一个矩形
 draw_rectangle(img, rect)
 # 标出预测的名字
 draw_text(img, label_text, rect[0], rect[1] - 5)
 #返回预测的图像
 return img
#加载测试图像
test_img1 = cv2.imread("./test_data/test1.jpg")
test_img2 = cv2.imread("./test_data/test2.jpg")
#执行预测
predicted_img1 = predict(test_img1)
predicted_img2 = predict(test_img2)
#显示两个图像
cv2.imshow(subjects[0], predicted_img1)
cv2.imshow(subjects[1], predicted_img2)
cv2.waitKey(0)
cv2.destroyAllWindows()


```
