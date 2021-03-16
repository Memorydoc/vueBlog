---
title: Docker 安装部署Registry(使用并配置)
---
 
## 概述
官方的 Docker Hub 是一个用于管理公共镜像的地方，我们可以在上面找到我们想要的镜像，也可以把我们自己的镜像推送上去。但是，有时候我们的服务器无法访问互联网，或者你不希望将自己的镜像放到公网当中，那么你就需要 Docker Registry，它可以用来存储和管理自己的镜像。

## 安装Docker私服
在之前的 Docker 私有仓库 章节中已经提到过如何配置和使用容器运行私有仓库，这里我们使用 docker-compose 来安装，配置如下：
```sh  
version: '3.1'
services:
  registry:
    image: registry
    restart: always
    container_name: registry
    ports:
      - 5000:5000
    volumes:
      - /usr/local/docker/registry/data:/var/lib/registry
```

##  测试
启动成功后需要测试服务端是否能够正常提供服务，有两种方式：
* 浏览器端访问
http://ip:5000/v2/
![registry](/img/pwc/registry.png)

* 终端访问
```sh 
curl http://ip:5000/v2/
```
![registry](/img/pwc/registry1.png)

## 注意事项
   如果你不想使用 <code>127.0.0.1:5000</code> 作为仓库地址，比如想让本网段的其他主机也能把镜像推送到私有仓库。你就得把例如 <code>192.168.199.100:5000 </code>这样的内网地址作为私有仓库地址，这时你会发现无法成功推送镜像。
   
   这是因为 Docker 默认不允许非 <code>HTTPS</code> 方式推送镜像。我们可以通过 Docker 的配置选项来取消这个限制，或者查看下一节配置能够通过 <code>HTTPS</code> 访问的私有仓库。

::: danger 小提示（解决方法）
对于Ubuntu 14.04, Debian 7 Wheezy 版本的（upstart）系统
，编辑 /etc/default/docker 文件，在其中的 DOCKER_OPTS 中增加如下内容：
```sh 
DOCKER_OPTS="--registry-mirror=https://registry.docker-cn.com --insecure-registries=192.168.199.100:5000"

```
重新启动服务。
```sh 
$ sudo service docker restart
```
对于Ubuntu 16.04+, Debian 8+, centos 7 （systemd）系统，请直接使用下面配置 Docker Registry客户端的方法解决
:::

## 配置Docker Registry客户端

   我们这里使用的是 Ubuntu Server 16.04 LTS 版本，属于 systemd 系统，需要在 /etc/docker/daemon.json 中增加如下内容（如果文件不存在请新建该文件）
   
   
```sh 
{
     "registry-mirrors": [
       "https://registry.docker-cn.com"
     ],
     "insecure-registries": [
       "ip:5000"
     ]
   }
```
> 注意：该文件必须符合 json 规范，否则 Docker 将不能启动。
   之后重新启动服务。
```sh   
$ sudo systemctl daemon-reload
$ sudo systemctl restart docker
```
##  检查客户端配置是否生效

使用 docker info 命令手动检查，如果从配置中看到如下内容，说明配置成功（106.13.126.235 为当前案例 IP）
```sh  
Insecure Registries:
 106.13.126.235:5000
 127.0.0.0/8
```

##   测试镜像上传
我们以 Nginx 为例测试镜像上传功能
```sh 
## 拉取一个镜像
docker pull nginx

## 查看全部镜像
docker images

## 标记本地镜像并指向目标仓库（ip:port/image_name:tag，该格式为标记版本号）
docker tag nginx 106.13.126.235:5000/nginx

## 提交镜像到仓库
docker push 106.13.126.235:5000/nginx
```

##  查看全部镜像
```sh  
curl -XGET http://106.13.126.235:5000/v2/_catalog
```
## 查看指定镜像
以 Nginx 为例，查看已提交的列表(命令方式查看)
```sh   
curl -XGET http://106.13.126.235:5000/v2/nginx/tags/list
```
浏览器方式查看   

![resgistry2](/img/pwc/registry2.png)

## 测试拉取镜像
* 先删除镜像本地镜像（尝试从镜像私服拉去镜像）
docker rmi nginx
docker rmi 106.13.126.235:5000/nginx
* 再拉取镜像

```sh 
docker pull 106.13.126.235:5000/nginx
```
* 拉取镜像成功   
    
![registry3](/img/pwc/registry3.png)


## 部署 Docker Registry WebUI
私服安装成功后就可以使用 docker 命令行工具对 registry 做各种操作了。然而不太方便的地方是不能直观的查看 registry 中的资源情况。如果可以使用 UI 工具管理镜像就更好了。这里介绍两个 Docker Registry WebUI 工具   

* [docker-registry-frontend](https://github.com/kwk/docker-registry-frontend)
* [docker-registry-web](https://hub.docker.com/r/hyper/docker-registry-web/)

两个工具的功能和界面都差不多，我们以 docker-registry-fontend 为例讲解

## docker-registry-frontend
我们使用 docker-compose 来安装和运行，docker-compose.yml 配置如下：

```sh 
version: '3.1'
services:
  frontend:
    image: konradkleine/docker-registry-frontend:v2
    ports:
      - 8080:80
    volumes:
      - ./certs/frontend.crt:/etc/apache2/server.crt:ro
      - ./certs/frontend.key:/etc/apache2/server.key:ro
    environment:
      - ENV_DOCKER_REGISTRY_HOST=106.13.126.235
      - ENV_DOCKER_REGISTRY_PORT=5000
```
运行docker-compose up -d (守护进程方式运行: 即后台运行)
> 注意：请将配置文件中的主机和端口换成自己仓库的地址
运行成功后在浏览器访问：http://106.13.126.235:8080
![webui](/img/pwc/webui.png)
   