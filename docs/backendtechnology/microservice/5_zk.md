---
title: Zookeeper
---

## Zookeeper 的数据模型
Zookeeper 的数据模型是什么样子呢？它很像数据结构当中的树，也很像文件系统的目录。
![zk1](/img/microservice/zk12.png)
树是由节点所组成，Zookeeper 的数据存储也同样是基于节点，这种节点叫做 **Znode**

但是，不同于树的节点，Znode 的引用方式是路径引用，类似于文件路径：
```sh 
/动物/猫
/汽车/宝马
```
这样的层级结构，让每一个 Znode 节点拥有唯一的路径，就像命名空间一样对不同信息作出清晰的隔离。

#### Znode 包含哪些元素
![zk1](/img/microservice/zk13.png)

* data：Znode 存储的数据信息。
* ACL：记录 Znode 的访问权限，即哪些人或哪些 IP 可以访问本节点。
* stat：包含 Znode 的各种元数据，比如事务 ID、版本号、时间戳、大小等等。
* child：当前节点的子节点引用
这里需要注意一点，Zookeeper 是为读多写少的场景所设计。Znode 并不是用来存储大规模业务数据，而是用于存储少量的状态和配置信息，**每个节点的数据最大不能超过 1MB**。

## Zookeeper 的基本操作

创建节点

```sh 
create
```
删除节点

```sh 
delete
```
判断节点是否存在

```sh 
exists
```
获得一个节点的数据

```sh 
getData
```
设置一个节点的数据

```sh 
setData
```
获取节点下的所有子节点

```sh 
getChildren
```
这其中，<code>exists</code>，<code>getData</code>，<code>getChildren</code> 属于读操作。Zookeeper 客户端在请求读操作的时候，可以选择是否设置 **Watch**

## Zookeeper 的事件通知
我们可以把 <code>Watch</code> 理解成是注册在特定 Znode 上的触发器。当这个 Znode 发生改变，也就是调用了 <code>create</code> <code>delete</code> <code>setData</code>方法的时候，将会触发 <code>Znode</code> 上注册的对应事件，请求 Watch 的客户端会接收到异步通知。

具体交互过程如下：

* 客户端调用 <code>getData</code> 方法，<code>watch</code> 参数是 true。服务端接到请求，返回节点数据，并且在对应的哈希表里插入被 Watch 的 Znode 路径，以及 Watcher 列表。
![memorydoc](/img/microservice/zk14.png)
* 当被 Watch 的 Znode 已删除，服务端会查找哈希表，找到该 Znode 对应的所有 Watcher，异步通知客户端，并且删除哈希表中对应的 Key-Value。
![memorydoc](/img/microservice/zk15.png)
## Zookeeper 的一致性
Zookeeper 身为分布式系统协调服务，如果自身挂了如何处理呢？为了防止单机挂掉的情况，Zookeeper 维护了一个集群。如下图：

![memorydoc](/img/microservice/zk16.png)

Zookeeper Service 集群是一主多从结构。

在更新数据时，首先更新到主节点（这里的节点是指服务器，不是 Znode），再同步到从节点。

在读取数据时，直接读取任意从节点。

为了保证主从节点的数据一致性，Zookeeper 采用了 ** ZAB 协议**，这种协议非常类似于一致性算法 **Paxos** 和 **Raft**。

*** 
#### 什么是 ZAB
Zookeeper Atomic Broadcast，有效解决了 Zookeeper 集群崩溃恢复，以及主从同步数据的问题。

#### ZAB 协议定义的三种节点状态
* Looking ：选举状态。
* Following ：Follower 节点（从节点）所处的状态。
* Leading ：Leader 节点（主节点）所处状态。
#### 最大 ZXID
最大 ZXID 也就是节点本地的最新事务编号，包含 epoch 和计数两部分。epoch 是纪元的意思，相当于 Raft 算法选主时候的 term。
#### ZAB 的崩溃恢复
假如 Zookeeper 当前的主节点挂掉了，集群会进行崩溃恢复。ZAB 的崩溃恢复分成三个阶段：

* **Leader election**

选举阶段，此时集群中的节点处于 Looking 状态。它们会各自向其他节点发起投票，投票当中包含自己的服务器 ID 和最新事务 ID（ZXID）。

![memorydoc](/img/microservice/zk17.png)

接下来，节点会用自身的 ZXID 和从其他节点接收到的 ZXID 做比较，如果发现别人家的 ZXID 比自己大，也就是数据比自己新，那么就重新发起投票，投票给目前已知最大的 ZXID 所属节点。

![memorydoc](/img/microservice/zk18.png)

每次投票后，服务器都会统计投票数量，判断是否有某个节点得到半数以上的投票。如果存在这样的节点，该节点将会成为准 Leader，状态变为 Leading。其他节点的状态变为 Following。

![memorydoc](/img/microservice/zk19.png)
***
* **Discovery**

发现阶段，用于在从节点中发现最新的 ZXID 和事务日志。或许有人会问：既然 Leader 被选为主节点，已经是集群里数据最新的了，为什么还要从节点中寻找最新事务呢？

这是为了防止某些意外情况，比如因网络原因在上一阶段产生多个 Leader 的情况。

所以这一阶段，Leader 集思广益，接收所有 Follower 发来各自的最新 epoch 值。Leader 从中选出最大的 epoch，基于此值加 1，生成新的 epoch 分发给各个 Follower。

各个 Follower 收到全新的 epoch 后，返回 ACK 给 Leader，带上各自最大的 ZXID 和历史事务日志。Leader 选出最大的 ZXID，并更新自身历史日志。

* **Synchronization**

同步阶段，把 Leader 刚才收集得到的最新历史事务日志，同步给集群中所有的 Follower。只有当半数 Follower 同步成功，这个准 Leader 才能成为正式的 Leader。

自此，故障恢复正式完成

***
**ZAB 的数据写入**

**Broadcast**

ZAB 的数据写入涉及到 Broadcast 阶段，简单来说，就是 Zookeeper 常规情况下更新数据的时候，由 Leader 广播到所有的 Follower。其过程如下：

* 客户端发出写入数据请求给任意 Follower。
* Follower 把写入数据请求转发给 Leader。
* Leader 采用二阶段提交方式，先发送 Propose 广播给 Follower。
* Follower 接到 Propose 消息，写入日志成功后，返回 ACK 消息给 Leader。
* Leader 接到半数以上ACK消息，返回成功给客户端，并且广播 Commit 请求给 Follower

![memorydoc](/img/microservice/zk20.png)

ZAB 协议既不是强一致性，也不是弱一致性，而是处于两者之间的 **单调一致性（顺序一致性）**。它依靠事务 ID 和版本号，保证了数据的更新和读取是有序的。

## Zookeeper 的应用场景
####     分布式锁
这是雅虎研究员设计 Zookeeper 的初衷。利用 Zookeeper 的临时顺序节点，可以轻松实现分布式锁。

#### 服务注册和发现
利用 Znode 和 Watcher，可以实现分布式服务的注册和发现。最著名的应用就是阿里的分布式 RPC 框架 Dubbo。

#### 共享配置和状态信息
Redis 的分布式解决方案 Codis，就利用了 Zookeeper 来存放数据路由表和 codis-proxy 节点的元信息。同时 codis-config 发起的命令都会通过 ZooKeeper 同步到各个存活的 codis-proxy。

此外，Kafka、HBase、Hadoop，也都依靠Zookeeper同步节点信息，实现高可用。


## 基于 Docker 安装 Zookeeper
### 概述
Zookeeper 部署有三种方式，单机模式、集群模式、伪集群模式，以下采用 Docker 的方式部署

**注意：** 集群为大于等于3个奇数，如 3、5、7,不宜太多，集群机器多了选举和数据同步耗时长，不稳定。

### 单机模式
#### docker-compose.yml
```sh 
version: '3.1'

services:
    zoo1:
        image: zookeeper
        restart: always
        hostname: zoo1
        ports:
            - 2181:2181
        environment:
            ZOO_MY_ID: 1
            ZOO_SERVERS: server.1=zoo1:2888:3888
```
#### 验证是否安装成功

* 以交互的方式进入容器
```sh 
docker exec -it zookeeper_zoo1_1 /bin/bash
```
* 使用客户端连接到服务端
```sh 
bash-4.3# ./bin/zkCli.sh -server 192.168.75.130:2181
Connecting to 192.168.75.130:2181
2017-11-09 07:45:58,365 [myid:] - INFO  [main:Environment@100] - Client environment:zookeeper.version=3.4.10-39d3a4f269333c922ed3db283be479f9deacaa0f, built on 03/23/2017 10:13 GMT
2017-11-09 07:45:58,374 [myid:] - INFO  [main:Environment@100] - Client environment:host.name=zoo1
2017-11-09 07:45:58,374 [myid:] - INFO  [main:Environment@100] - Client environment:java.version=1.8.0_131
2017-11-09 07:45:58,380 [myid:] - INFO  [main:Environment@100] - Client environment:java.vendor=Oracle Corporation
2017-11-09 07:45:58,381 [myid:] - INFO  [main:Environment@100] - Client environment:java.home=/usr/lib/jvm/java-1.8-openjdk/jre
2017-11-09 07:45:58,381 [myid:] - INFO  [main:Environment@100] - Client environment:java.class.path=/zookeeper-3.4.10/bin/../build/classes:/zookeeper-3.4.10/bin/../build/lib/*.jar:/zookeeper-3.4.10/bin/../lib/slf4j-log4j12-1.6.1.jar:/zookeeper-3.4.10/bin/../lib/slf4j-api-1.6.1.jar:/zookeeper-3.4.10/bin/../lib/netty-3.10.5.Final.jar:/zookeeper-3.4.10/bin/../lib/log4j-1.2.16.jar:/zookeeper-3.4.10/bin/../lib/jline-0.9.94.jar:/zookeeper-3.4.10/bin/../zookeeper-3.4.10.jar:/zookeeper-3.4.10/bin/../src/java/lib/*.jar:/conf:
2017-11-09 07:45:58,381 [myid:] - INFO  [main:Environment@100] - Client environment:java.library.path=/usr/lib/jvm/java-1.8-openjdk/jre/lib/amd64/server:/usr/lib/jvm/java-1.8-openjdk/jre/lib/amd64:/usr/lib/jvm/java-1.8-openjdk/jre/../lib/amd64:/usr/java/packages/lib/amd64:/usr/lib64:/lib64:/lib:/usr/lib
2017-11-09 07:45:58,381 [myid:] - INFO  [main:Environment@100] - Client environment:java.io.tmpdir=/tmp
2017-11-09 07:45:58,381 [myid:] - INFO  [main:Environment@100] - Client environment:java.compiler=<NA>
2017-11-09 07:45:58,381 [myid:] - INFO  [main:Environment@100] - Client environment:os.name=Linux
2017-11-09 07:45:58,382 [myid:] - INFO  [main:Environment@100] - Client environment:os.arch=amd64
2017-11-09 07:45:58,382 [myid:] - INFO  [main:Environment@100] - Client environment:os.version=4.4.0-98-generic
2017-11-09 07:45:58,386 [myid:] - INFO  [main:Environment@100] - Client environment:user.name=root
2017-11-09 07:45:58,386 [myid:] - INFO  [main:Environment@100] - Client environment:user.home=/root
2017-11-09 07:45:58,386 [myid:] - INFO  [main:Environment@100] - Client environment:user.dir=/zookeeper-3.4.10
2017-11-09 07:45:58,389 [myid:] - INFO  [main:ZooKeeper@438] - Initiating client connection, connectString=192.168.75.130:2181 sessionTimeout=30000 watcher=org.apache.zookeeper.ZooKeeperMain$MyWatcher@3eb07fd3
2017-11-09 07:45:58,428 [myid:] - INFO  [main-SendThread(192.168.75.130:2181):ClientCnxn$SendThread@1032] - Opening socket connection to server 192.168.75.130/192.168.75.130:2181. Will not attempt to authenticate using SASL (unknown error)
Welcome to ZooKeeper!
JLine support is enabled
2017-11-09 07:45:58,529 [myid:] - INFO  [main-SendThread(192.168.75.130:2181):ClientCnxn$SendThread@876] - Socket connection established to 192.168.75.130/192.168.75.130:2181, initiating session
[zk: 192.168.75.130:2181(CONNECTING) 0] 2017-11-09 07:45:58,573 [myid:] - INFO  [main-SendThread(192.168.75.130:2181):ClientCnxn$SendThread@1299] - Session establishment complete on server 192.168.75.130/192.168.75.130:2181, sessionid = 0x15f9fbc12ec0000, negotiated timeout = 30000

WATCHER::

WatchedEvent state:SyncConnected type:None path:null
```
* 使用服务端工具检查服务器状态
```sh 
bash-4.3# ./bin/zkServer.sh status
ZooKeeper JMX enabled by default
Using config: /conf/zoo.cfg
Mode: standalone
```
### 集群模式

#### 第一台主机
#### docker-compose.yml
```sh 
version: '3.1'
services:
    zoo1:
        image: zookeeper
        restart: always
        environment:
            ZOO_MY_ID: 1
            ZOO_SERVERS: server.1=192.168.75.130:2888:3888 server.2=192.168.75.134:2888:3888 server.3=192.168.75.135:2888:3888
        network_mode: host
```
#### 验证测试
```sh 
root@UbuntuBase:/usr/local/docker/zookeeper# docker exec -it zookeeper_zoo1_1 /bin/bash
bash-4.3# ./bin/zkServer.sh status
ZooKeeper JMX enabled by default
Using config: /conf/zoo.cfg
Mode: leader
```
#### 第二台主机
#### docker-compose.yml
```sh 

version: '3.1'
services:
    zoo2:
        image: zookeeper
        restart: always
        environment:
            ZOO_MY_ID: 2
            ZOO_SERVERS: server.1=192.168.75.130:2888:3888 server.2=192.168.75.134:2888:3888 server.3=192.168.75.135:2888:3888
        network_mode: host
```
#### 验证测试
root@UbuntuBase:/usr/local/docker/zookeeper# docker exec -it zookeeper_zoo2_1 /bin/bash
bash-4.3# ./bin/zkServer.sh status
ZooKeeper JMX enabled by default
Using config: /conf/zoo.cfg
Mode: follower
#### 第三台主机
#### docker-compose.yml
```sh 
version: '3.1'
services:
    zoo3:
        image: zookeeper
        restart: always
        environment:
            ZOO_MY_ID: 3
            ZOO_SERVERS: server.1=192.168.75.130:2888:3888 server.2=192.168.75.134:2888:3888 server.3=192.168.75.135:2888:3888
        network_mode: host
```
#### 验证测试
```sh 
root@UbuntuBase:/usr/local/docker/zookeeper# docker exec -it zookeeper_zoo3_1 /bin/bash
bash-4.3# ./bin/zkServer.sh status
ZooKeeper JMX enabled by default
Using config: /conf/zoo.cfg
Mode: follower
```

伪集群模式
# docker-compose.yml
```sh 
version: '3.1'
services:
    zoo1:
        image: zookeeper
        restart: always
        hostname: zoo1
        ports:
            - 2181:2181
        environment:
            ZOO_MY_ID: 1
            ZOO_SERVERS: server.1=zoo1:2888:3888 server.2=zoo2:2888:3888 server.3=zoo3:2888:3888

    zoo2:
        image: zookeeper
        restart: always
        hostname: zoo2
        ports:
            - 2182:2181
        environment:
            ZOO_MY_ID: 2
            ZOO_SERVERS: server.1=zoo1:2888:3888 server.2=zoo2:2888:3888 server.3=zoo3:2888:3888

    zoo3:
        image: zookeeper
        restart: always
        hostname: zoo3
        ports:
            - 2183:2181
        environment:
            ZOO_MY_ID: 3
            ZOO_SERVERS: server.1=zoo1:2888:3888 server.2=zoo2:2888:3888 server.3=zoo3:2888:3888
```
#### 验证是否安装成功
* 分别以交互方式进入容器查看
```sh 
docker exec -it zookeeper_zoo1_1 /bin/bash
```
```sh 
docker exec -it zookeeper_zoo2_1 /bin/bash
```
```sh 
docker exec -it zookeeper_zoo3_1 /bin/bash
```
* 使用服务端工具检查服务器状态
```sh 
root@UbuntuBase:/usr/local/docker/zookeeper# docker exec -it zookeeper_zoo1_1 /bin/bash
bash-4.3# ./bin/zkServer.sh status
ZooKeeper JMX enabled by default
Using config: /conf/zoo.cfg
Mode: follower
```
```sh 
root@UbuntuBase:/usr/local/docker/zookeeper# docker exec -it zookeeper_zoo2_1 /bin/bash
bash-4.3# ./bin/zkServer.sh status
ZooKeeper JMX enabled by default
Using config: /conf/zoo.cfg
Mode: follower
```
```sh 
root@UbuntuBase:/usr/local/docker/zookeeper# docker exec -it zookeeper_zoo3_1 /bin/bash
bash-4.3# ./bin/zkServer.sh status
ZooKeeper JMX enabled by default
Using config: /conf/zoo.cfg
Mode: leader
```
从上面的验证结果可以看出：zoo1 为跟随者，zoo2 为跟随者，zoo3 为领导者


## 附：Linux 下手动安装 Zookeeper

Zookeeper 部署有三种方式，单机模式、集群模式、伪集群模式，以下采用手动安装的方式部署

**注意：** 集群为大于等于3个奇数，如 3、5、7,不宜太多，集群机器多了选举和数据同步耗时长，不稳定。

单机模式
#### 下载
进入要下载的版本的目录，选择 <code>.tar.gz</code> 文件下载，下载链接：http://archive.apache.org/dist/zookeeper/

####安装
注意： 需要先安装 <code>Java</code>

使用 tar 解压要安装的目录即可，以 3.4.13 版本为例，解压到 <code> /usr/local/zookeeper-3.4.13</code>

```sh 
tar -zxvf zookeeper-3.4.13.tar.gz -C /usr/local
```
#### 配置
在根目录下创建 data 和 logs 两个目录用于存储数据和日志

```sh 
cd /usr/local/zookeeper-3.4.13
mkdir data
mkdir logs
```
在 conf 目录下新建 zoo.cfg 文件，写入以下内容保存

```sh 
tickTime=2000
dataDir=/usr/local/zookeeper-3.4.13/data
dataLogDir=/usr/local/zookeeper-3.4.13/logs
clientPort=2181
```
#### 启动和停止
进入 bin 目录，启动、停止、重启和查看当前节点状态

```sh 
./zkServer.sh start
./zkServer.sh stop
./zkServer.sh restart
./zkServer.sh status
```
### 伪集群模式
伪集群模式就是在同一主机启动多个 zookeeper 并组成集群，下边以在 192.168.10.134 主机上创 3 个 zookeeper 组集群为例。

将通过单机模式安装的 zookeeper，复制成 zookeeper1/zookeeper2/zookeeper3 三份

#### zookeeper1
修改配置文件
```sh 
tickTime=2000
dataDir=/usr/local/zookeeper1/data
dataLogDir=/usr/local/zookeeper1/logs
clientPort=2181
initLimit=5
syncLimit=2
server.1=192.168.10.134:2888:3888
server.2=192.168.10.134:4888:5888
server.3=192.168.10.134:6888:7888
```
设置服务器 ID
echo '1' > data/myid
#### zookeeper2
修改配置文件
```sh 
tickTime=2000
dataDir=/usr/local/zookeeper2/data
dataLogDir=/usr/local/zookeeper2/logs
clientPort=2181
initLimit=5
syncLimit=2
server.1=192.168.10.134:2888:3888
server.2=192.168.10.134:4888:5888
server.3=192.168.10.134:6888:7888
```
设置服务器 ID
```sh 
echo '2' > data/myid
```
#### zookeeper3
修改配置文件
```sh 
tickTime=2000
dataDir=/usr/local/zookeeper3/data
dataLogDir=/usr/local/zookeeper3/logs
clientPort=2181
initLimit=5
syncLimit=2
server.1=192.168.10.134:2888:3888
server.2=192.168.10.134:4888:5888
server.3=192.168.10.134:6888:7888
```
设置服务器 ID
```sh 
echo '3' > data/myid
```
### 启动和停止
分别启动服务器，顺序无所谓
```sh 

./zkServer.sh start
./zkServer.sh stop
./zkServer.sh restart
./zkServer.sh status
```
### 集群模式
集群模式就是在不同主机上安装 zookeeper 然后组成集群的模式，操作步骤同上，此处不再赘述


## Zookeeper 配置说明
### Zookeeper 的三种工作模式
* 单机模式：存在单点故障
* 集群模式：在多台机器上部署 Zookeeper 集群，适合线上环境使用。
* 伪集群模式：在一台机器同时运行多个 Zookeeper 实例，仍然有单点故障问题，当然，其中配置的端口号要错开的，适合实验环境模拟集群使用。
### Zookeeper 的三种端口号
* 2181：客户端连接 Zookeeper 集群使用的监听端口号
* 3888：选举 leader 使用
* 2888：集群内机器通讯使用（Leader 和 Follower 之间数据同步使用的端口号，Leader 监听此端口）
### Zookeeper 单机模式配置文件
配置文件路径：<code>/conf/zoo.cfg</code>

```sh 
clientPort=2181
dataDir=/data
dataLogDir=/datalog
tickTime=2000
```

* clientPort：这个端口就是客户端连接 Zookeeper 服务器的端口，Zookeeper 会监听这个端口，接受客户端的访问请求。
* dataDir：Zookeeper 保存数据的目录。
* dataLogDir：Zookeeper 保存日志的目录。
* tickTime：这个时间是作为 Zookeeper 服务器之间或客户端与服务器之间维持心跳的时间间隔，也就是每隔 tickTime 时间就会发送一个心跳。
### Zookeeper 集群模式配置文件

配置文件路径：<code>/conf/zoo.cfg</code>

```sh 
clientPort=2181
dataDir=/data
dataLogDir=/datalog
tickTime=2000
initLimit=5
syncLimit=2
autopurge.snapRetainCount=3
autopurge.purgeInterval=0
maxClientCnxns=60
server.1=192.168.0.1:2888:3888
server.2=192.168.0.2:2888:3888
server.3=192.168.0.3:2888:3888
```
* initLimit：配置 Zookeeper 接受客户端（这里所说的客户端不是用户连接 Zookeeper 服务器的客户端，而是 Zookeeper 服务器集群中连接到 Leader 的 Follower 服务器）初始化连接时最长能忍受多少个心跳时间间隔数。当已经超过 initLimit（默认为 10） 个心跳的时间（也就是 tickTime）长度后 Zookeeper 服务器还没有收到客户端的返回信息，那么表明这个客户端连接失败。总的时间长度就是 5 * 2000 = 10 秒
* syncLimit：配置 Leader 与 Follower 之间发送消息，请求和应答时间长度，最长不能超过多少个 tickTime 的时间长度，总的时间长度就是 2 * 2000 = 4 秒
* 定时清理（Zookeeper 从 3.4.0 开始提供了自动清理快照和事务日志的功能）以下两个参数配合使用：
    * autopurge.purgeInterval：指定了清理频率，单位是小时，需要填写一个 1 或更大的整数，默认是 0，表示不开启自己清理功能。
    * autopurge.snapRetainCount：指定了需要保留的文件数目。默认是保留 3 个。
* maxClientCnxns：限制连接到 Zookeeper 的客户端的数量，限制并发连接的数量，它通过 IP 来区分不同的客户端。此配置选项可以用来阻止某些类别的 Dos 攻击。将它设置为 0 或者忽略而不进行设置将会取消对并发连接的限制。
* server.A=B：C：D：其中 A 是一个数字，表示这个是第几号服务器。B 是这个服务器的 IP 地址。C 表示的是这个服务器与集群中的 Leader 服务器交换信息的端口(2888)；D 表示的是万一集群中的 Leader 服务器挂了，需要一个端口来重新进行选举，选出一个新的 Leader，而这个端口就是用来执行选举时服务器相互通信的端口(3888)。如果是伪集群的配置方式，由于 B 都是一样，所以不同的 Zookeeper 实例通信端口号不能一样，所以要给它们分配不同的端口号。
注意： server.A 中的 A 是在 dataDir 配置的目录中创建一个名为 myid 的文件里的值（如：1）

#### Zookeeper 常用命令

#### zkServer
启动服务
```sh 
./zkServer.sh start
```
停止服务
```sh 
./zkServer.sh stop
```
重启服务
```sh 
./zkServer.sh restart
```
执行状态
```sh 
./zkServer.sh status
```
#### zkClient
客户端连接服务器并进入 Bash 模式
```sh 
./zkCli.sh -server <ip>:<port>
```

#### 命令参数
```sh 
ZooKeeper -server host:port cmd args
	stat path [watch]
	set path data [version]
	ls path [watch]
	delquota [-n|-b] path
	ls2 path [watch]
	setAcl path acl
	setquota -n|-b val path
	history 
	redo cmdno
	printwatches on|off
	delete path [version]
	sync path
	listquota path
	rmr path
	get path [watch]
	create [-s] [-e] path data acl
	addauth scheme auth
	quit 
	getAcl path
	close 
	connect host:port
```
* 创建节点（Bash 模式）
```sh 
create /test "hello zookeeper"
```
* 查询节点（Bash 模式）
```sh 
get /test

#### 输出如下
Hello Zookeeper
cZxid = 0x100000004
ctime = Fri Oct 19 05:11:47 GMT 2018
mZxid = 0x100000004
mtime = Fri Oct 19 05:11:47 GMT 2018
pZxid = 0x100000004
cversion = 0
dataVersion = 0
aclVersion = 0
ephemeralOwner = 0x0
dataLength = 15
numChildren = 0
```
* 删除节点（Bash 模式）
```sh 
delete
```