#  会话

## 学习目标

- 目标
  - 应用sess.run或者eval运行图程序并获取张量值
  - 应用feed_dict机制实现运行时填充数据
  - 应用placeholder实现创建占位符
- 应用
  - 无
- 内容预览
  - 2.3.1 会话
    - 1 \_\_init\_\_(target='', graph=None, config=None)
    - 2 会话的run()
    - 3 feed操作

##  会话

一个运行TensorFlow operation的类。会话包含以下两种开启方式

* tf.Session：用于完整的程序当中
* tf.InteractiveSession：用于交互式上下文中的TensorFlow ，例如shell

> 1 TensorFlow 使用 tf.Session 类来表示客户端程序（通常为 Python 程序，但也提供了使用其他语言的类似接口）与 C++ 运行时之间的连接
>
> 2 tf.Session 对象使用分布式 TensorFlow 运行时提供对本地计算机中的设备和远程设备的访问权限。

###  \_\_init\_\_(target='', graph=None, config=None)

会话可能拥有的资源，如 tf.Variable，tf.QueueBase和tf.ReaderBase。当这些资源不再需要时，释放这些资源非常重要。因此，需要调用tf.Session.close会话中的方法，或将会话用作上下文管理器。以下两个例子作用是一样的：

```python
def session_demo():
    """
    会话演示
    :return:
    """

    a_t = tf.constant(10)
    b_t = tf.constant(20)
    # 不提倡直接运用这种符号运算符进行计算
    # 更常用tensorflow提供的函数进行计算
    # c_t = a_t + b_t
    c_t = tf.add(a_t, b_t)
    print("tensorflow实现加法运算：\n", c_t)

    # 开启会话
    # 传统的会话定义
    # sess = tf.Session()
    # sum_t = sess.run(c_t)
    # print("sum_t:\n", sum_t)
    # sess.close()

    # 开启会话
    with tf.Session() as sess:
        # sum_t = sess.run(c_t)
        # 想同时执行多个tensor
        print(sess.run([a_t, b_t, c_t]))
        # 方便获取张量值的方法
        # print("在sess当中的sum_t:\n", c_t.eval())
        # 会话的图属性
        print("会话的图属性：\n", sess.graph)

    return None
```

* target：如果将此参数留空（默认设置），会话将仅使用本地计算机中的设备。可以指定 grpc:// 网址，以便指定 TensorFlow 服务器的地址，这使得会话可以访问该服务器控制的计算机上的所有设备。
* graph：默认情况下，新的 tf.Session 将绑定到当前的默认图。
* config：此参数允许您指定一个 tf.ConfigProto 以便控制会话的行为。例如，ConfigProto协议用于打印设备使用信息

```python
# 运行会话并打印设备信息
sess = tf.Session(config=tf.ConfigProto(allow_soft_placement=True,
                                        log_device_placement=True))
```

会话可以分配不同的资源在不同的设备上运行。

```
/job:worker/replica:0/task:0/device:CPU:0
```

> device_type：类型设备（例如CPU，GPU，TPU）

### 会话的run()

* **run(fetches,feed_dict=None, options=None, run_metadata=None)**
  * 通过使用sess.run()来运行operation
  * fetches：单一的operation，或者列表、元组(其它不属于tensorflow的类型不行)
  * feed_dict：参数允许调用者覆盖图中张量的值，运行时赋值
    * 与tf.placeholder搭配使用，则会检查值的形状是否与占位符兼容。

>  使用tf.operation.eval()也可运行operation，但需要在会话中运行

```python
# 创建图
a = tf.constant(5.0)
b = tf.constant(6.0)
c = a * b

# 创建会话
sess = tf.Session()

# 计算C的值
print(sess.run(c))
print(c.eval(session=sess))
```
### feed操作 

- placeholder提供占位符，run时候通过feed_dict指定参数

```python
def session_run_demo():
    """
    会话的run方法
    :return:
    """
    # 定义占位符
    a = tf.placeholder(tf.float32)
    b = tf.placeholder(tf.float32)
    sum_ab = tf.add(a, b)
    print("sum_ab:\n", sum_ab)
    # 开启会话
    with tf.Session() as sess:
        print("占位符的结果：\n", sess.run(sum_ab, feed_dict={a: 3.0, b: 4.0}))
    return None
```

> 请注意运行时候报的错误error:

>```python
>RuntimeError：如果这Session是无效状态（例如已关闭）。
>TypeError：如果fetches或者feed_dict键的类型不合适。
>ValueError：如果fetches或feed_dict键无效或引用 Tensor不存在的键。
>```
