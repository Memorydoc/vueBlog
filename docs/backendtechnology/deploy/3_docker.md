---
title: Docker安装
---
## 安装介绍
Docker 在 1.13 版本之后，从 2017 年的 3 月 1 日开始，版本命名规则变为如下：

项目	说明
版本格式	YY.MM
Stable 版本	每个季度发行
Edge 版本	每个月发行
同时 Docker 划分为 CE 和 EE。CE 即社区版（免费，支持周期三个月），EE 即企业版，强调安全，付费使用。

Docker CE 每月发布一个 Edge 版本 (17.03, 17.04, 17.05...)，每三个月发布一个 Stable 版本 (17.03, 17.06, 17.09...)，Docker EE 和 Stable 版本号保持一致，但每个版本提供一年维护。

官方网站上有各种环境下的 安装指南，这里主要介绍 Docker CE 在 Linux 、Windows 10 (PC) 和 macOS 上的安装。

## Ubuntu 安装 Docker
::: tip 警告
警告：切勿在没有配置 Docker APT 源的情况下直接使用 apt 命令安装 Docker.
:::
 ### 准备工作
 #### 系统要求
 Docker CE 支持以下版本的 Ubuntu 操作系统：
 
 Artful 17.10 (Docker CE 17.11 Edge +)
 Xenial 16.04 (LTS)
 Trusty 14.04 (LTS)
 Docker CE 可以安装在 64 位的 x86 平台或 ARM 平台上。Ubuntu 发行版中，LTS（Long-Term-Support）长期支持版本，会获得 5 年的升级维护支持，这样的版本会更稳定，因此在生产环境中推荐使用 LTS 版本,当前最新的 LTS 版本为 Ubuntu 16.04。
 
 #### 卸载旧版本
 旧版本的 Docker 称为 docker 或者 docker-engine，使用以下命令卸载旧版本：
 
```sh 
$ sudo apt-get remove docker \
               docker-engine \
               docker.io
```

#### Ubuntu 14.04 可选内核模块

从 Ubuntu 14.04 开始，一部分内核模块移到了可选内核模块包 (linux-image-extra-*) ，以减少内核软件包的体积。正常安装的系统应该会包含可选内核模块包，而一些裁剪后的系统可能会将其精简掉。AUFS 内核驱动属于可选内核模块的一部分，作为推荐的 Docker 存储层驱动，一般建议安装可选内核模块包以使用 AUFS。

如果系统没有安装可选内核模块的话，可以执行下面的命令来安装可选内核模块包：
```sh 
$ sudo apt-get update

$ sudo apt-get install \
    linux-image-extra-$(uname -r) \
    linux-image-extra-virtual
```
##### Ubuntu 16.04 +

Ubuntu 16.04 + 上的 Docker CE 默认使用 overlay2 存储层驱动,无需手动配置。

#### 使用 APT 安装
#### 安装必要的一些系统工具

```sh 
sudo apt-get update
sudo apt-get -y install apt-transport-https ca-certificates curl software-properties-common
```
#### 安装GPG证书
```sh
curl -fsSL http://mirrors.aliyun.com/docker-ce/linux/ubuntu/gpg | sudo apt-key add -
```
#### # 写入软件源信息
```sh
sudo add-apt-repository "deb [arch=amd64] http://mirrors.aliyun.com/docker-ce/linux/ubuntu $(lsb_release -cs) stable"
```
#### 更新并安装 Docker CE
```sh 
sudo apt-get -y update
sudo apt-get -y install docker-ce
```
::: tip 
以上命令会添加稳定版本的 Docker CE APT 镜像源，如果需要最新或者测试版本的 Docker CE 请将 stable 改为 edge 或者 test。从 Docker 17.06 开始，edge test 版本的 APT 镜像源也会包含稳定版本的 Docker
:::

#### 使用脚本自动安装
在测试或开发环境中 Docker 官方为了简化安装流程，提供了一套便捷的安装脚本，Ubuntu 系统上可以使用这套脚本安装
```sh 
$ curl -fsSL get.docker.com -o get-docker.sh
# 可能会出现 404 错误，请移步下面的特别说明
$ sudo sh get-docker.sh --mirror Aliyun
```
执行这个命令后，脚本就会自动的将一切准备工作做好，并且把 Docker CE 的 Edge 版本安装在系统中。
#### 特别说明

2018 年 7 月 21 日，貌似阿里云这边在做调整，故导致 Docker 的 Aliyun 安装脚本不可用，是永久性还是临时性的尚不清除，如果你已经按照之前的操作安装 Docker，请按以下步骤进行修复并重新安装

如果已经使用了 Aliyun 脚本安装并成功的
请先卸载 Docker，命令为：<code>apt-get autoremove docker-ce</code>
删除 <code>/etc/apt/sources.list.d</code> 目录下的 <code>docker.list</code> 文件
使用 <code>AzureChinaCloud</code> 镜像脚本重新安装，命令为：<code>sudo sh get-docker.sh --mirror AzureChinaCloud</code>

#### 启动 Docker CE
```sh 
$ sudo systemctl enable docker
$ sudo systemctl start docker
```
Ubuntu 14.04 请使用以下命令启动：
```sh 
$ sudo service docker start
```
#### 建立 docker 用户组
默认情况下，docker 命令会使用 Unix socket 与 Docker 引擎通讯。而只有 root 用户和 docker 组的用户才可以访问 Docker 引擎的 Unix socket。出于安全考虑，一般 Linux 系统上不会直接使用 root 用户。因此，更好地做法是将需要使用 docker 的用户加入 docker 用户组。

建立 docker 组：
```sh 
$ sudo groupadd docker
```
将当前用户加入 docker 组：
```sh 
$ sudo usermod -aG docker $USER
```
退出当前终端并重新登录，进行如下测试。

#### 测试 Docker 是否安装正确
```sh 
$ docker run hello-world

Unable to find image 'hello-world:latest' locally
latest: Pulling from library/hello-world
ca4f61b1923c: Pull complete
Digest: sha256:be0cd392e45be79ffeffa6b05338b98ebb16c87b255f48e297ec7f98e123905c
Status: Downloaded newer image for hello-world:latest

Hello from Docker!
This message shows that your installation appears to be working correctly.

To generate this message, Docker took the following steps:
 1. The Docker client contacted the Docker daemon.
 2. The Docker daemon pulled the "hello-world" image from the Docker Hub.
    (amd64)
 3. The Docker daemon created a new container from that image which runs the
    executable that produces the output you are currently reading.
 4. The Docker daemon streamed that output to the Docker client, which sent it
    to your terminal.

To try something more ambitious, you can run an Ubuntu container with:
 $ docker run -it ubuntu bash

Share images, automate workflows, and more with a free Docker ID:
 https://cloud.docker.com/

For more examples and ideas, visit:
 https://docs.docker.com/engine/userguide/
```
若能正常输出以上信息，则说明安装成功。

#### 镜像加速
镜像加速
鉴于国内网络问题，后续拉取 Docker 镜像十分缓慢，强烈建议安装 Docker 之后配置 "国内镜像加速"


## CentOS 安装 Docker
::: tip 警告
警告：切勿在没有配置 Docker YUM 源的情况下直接使用 yum 命令安装 Docker.
:::

### 准备工作
#### 系统要求

Docker CE 支持 64 位版本 CentOS 7，并且要求内核版本不低于 3.10。 CentOS 7 满足最低内核的要求，但由于内核版本比较低，部分功能（如 overlay2 存储层驱动）无法使用，并且部分功能可能不太稳定。

### 卸载旧版本
旧版本的 Docker 称为 docker 或者 docker-engine，使用以下命令卸载旧版本：
```sh 
$ sudo yum remove docker \
                  docker-client \
                  docker-client-latest \
                  docker-common \
                  docker-latest \
                  docker-latest-logrotate \
                  docker-logrotate \
                  docker-selinux \
                  docker-engine-selinux \
                  docker-engine
```

### 使用 yum 安装
执行以下命令安装依赖包：

```sh 
$ sudo yum install -y yum-utils \
           device-mapper-persistent-data \
           lvm2
```
鉴于国内网络问题，强烈建议使用国内源，官方源请在注释中查看。

执行下面的命令添加 yum 软件源：

```sh 
$ sudo yum-config-manager \
    --add-repo \
    https://mirrors.ustc.edu.cn/docker-ce/linux/centos/docker-ce.repo


# 官方源
# $ sudo yum-config-manager \
#     --add-repo \
#     https://download.docker.com/linux/centos/docker-ce.repo  
```
如果需要最新版本的 Docker CE 请使用以下命令：
```sh 
$ sudo yum-config-manager --enable docker-ce-edge
```
如果需要测试版本的 Docker CE 请使用以下命令：

```sh 
$ sudo yum-config-manager --enable docker-ce-test
```
### 安装 Docker CE
更新 yum 软件源缓存，并安装 docker-ce。
```sh 
$ sudo yum makecache fast
$ sudo yum install docker-ce
```
###  使用脚本自动安装
在测试或开发环境中 Docker 官方为了简化安装流程，提供了一套便捷的安装脚本，CentOS 系统上可以使用这套脚本安装：

```sh  
$ curl -fsSL get.docker.com -o get-docker.sh
$ sudo sh get-docker.sh --mirror Aliyun
```
执行这个命令后，脚本就会自动的将一切准备工作做好，并且把 Docker CE 的 Edge 版本安装在系统中。

### 启动 Docker CE
```sh   
$ sudo systemctl enable docker
$ sudo systemctl start docker
```
###  建立 docker 用户组
默认情况下，docker 命令会使用 Unix socket 与 Docker 引擎通讯。而只有 root 用户和 docker 组的用户才可以访问 Docker 引擎的 Unix socket。出于安全考虑，一般 Linux 系统上不会直接使用 root 用户。因此，更好地做法是将需要使用 docker 的用户加入 docker 用户组。

建立 docker 组：
```sh  
$ sudo groupadd docker
```
将当前用户加入 docker 组
```sh  
$ sudo usermod -aG docker $USER
```
退出当前终端并重新登录，进行如下测试。

### 测试 Docker 是否安装正确
```sh  
$ docker run hello-world

Unable to find image 'hello-world:latest' locally
latest: Pulling from library/hello-world
ca4f61b1923c: Pull complete
Digest: sha256:be0cd392e45be79ffeffa6b05338b98ebb16c87b255f48e297ec7f98e123905c
Status: Downloaded newer image for hello-world:latest

Hello from Docker!
This message shows that your installation appears to be working correctly.

To generate this message, Docker took the following steps:
 1. The Docker client contacted the Docker daemon.
 2. The Docker daemon pulled the "hello-world" image from the Docker Hub.
    (amd64)
 3. The Docker daemon created a new container from that image which runs the
    executable that produces the output you are currently reading.
 4. The Docker daemon streamed that output to the Docker client, which sent it
    to your terminal.

To try something more ambitious, you can run an Ubuntu container with:
 $ docker run -it ubuntu bash

Share images, automate workflows, and more with a free Docker ID:
 https://cloud.docker.com/

For more examples and ideas, visit:
 https://docs.docker.com/engine/userguide/
```

若能正常输出以上信息，则说明安装成功。

## 镜像加速
鉴于国内网络问题，后续拉取 Docker 镜像十分缓慢，强烈建议安装 Docker 之后配置 国内镜像加速。

### 添加内核参数
默认配置下，如果在 CentOS 使用 Docker CE 看到下面的这些警告信息：
```sh 
WARNING: bridge-nf-call-iptables is disabled
WARNING: bridge-nf-call-ip6tables is disabled
```


请添加内核配置参数以启用这些功能。

```sh  
$ sudo tee -a /etc/sysctl.conf <<-EOF
net.bridge.bridge-nf-call-ip6tables = 1
net.bridge.bridge-nf-call-iptables = 1
EOF
```
然后重新加载 sysctl.conf 即可

```sh  
$ sudo sysctl -p
```