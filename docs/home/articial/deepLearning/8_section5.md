# 变量OP

- 目标
  - 说明变量op的特殊作用
  - 说明变量op的trainable参数的作用
  - 应用global_variables_initializer实现变量op的初始化
- 应用
  - 无
- 内容预览
  -  创建变量
  -  使用tf.variable_scope()修改变量的命名空间

TensorFlow变量是表示程序处理的共享持久状态的最佳方法。变量通过 tf.Variable OP类进行操作。变量的特点：

* **存储持久化**
* **可修改值**
* **可指定被训练**

###  创建变量

* tf.Variable(**initial_value=None,trainable=True,collections=None**,name=None)
  * initial_value:初始化的值
  * trainable:是否被训练
  * collections：新变量将添加到列出的图的集合中collections，默认为[GraphKeys.GLOBAL_VARIABLES]，如果trainable是True变量也被添加到图形集合 GraphKeys.TRAINABLE_VARIABLES 

* 变量需要显式初始化，才能运行值

```python
def variable_demo():
    """
    变量的演示
    :return:
    """
    # 定义变量
    a = tf.Variable(initial_value=30)
    b = tf.Variable(initial_value=40)
    sum = tf.add(a, b)

    # 初始化变量
    init = tf.global_variables_initializer()

    # 开启会话
    with tf.Session() as sess:
        # 变量初始化
        sess.run(init)
        print("sum:\n", sess.run(sum))

    return None
```

### 使用tf.variable_scope()修改变量的命名空间

会在OP的名字前面增加命名空间的指定名字

```python
with tf.variable_scope("name"):
    var = tf.Variable(name='var', initial_value=[4], dtype=tf.float32)
    var_double = tf.Variable(name='var', initial_value=[4], dtype=tf.float32)
    
<tf.Variable 'name/var:0' shape=() dtype=float32_ref>
<tf.Variable 'name/var_1:0' shape=() dtype=float32_ref>
```

