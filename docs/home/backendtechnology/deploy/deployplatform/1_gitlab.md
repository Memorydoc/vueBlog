---
title: Docker 安装部署gitlab
---

## 下载gitlab 中文版docker镜像
```sh 
docker pull twang2218/gitlab-ce-zh:11.1.4
```
查看镜像是否下载安装成功

```sh 
docker images 
```
如果显示以下内容，安装镜像成功
```sh 
sizegang@sizegang:/usr/local/docker/gitlab$ docker images
REPOSITORY               TAG                 IMAGE ID            CREATED             SIZE
twang2218/gitlab-ce-zh   latest              18da462b5ff5        12 months ago       1.61GB
```


### 使用compose 安装部署

::: tip 提示
使用docker-compose安装应用组件的时候，最好在/usr/local/  目录下新建docker文件夹，然后每次装一种
应用，就在该docker目录下新建一个应用的文件夹，然后通过数据卷的方式，指向相应应用的文件夹，将这个规则编写到
docker-compose.yml 的volumes 中
 ```sh 
 volumes:
         - /usr/local/docker/gitlab/config:/etc/gitlab
         - /usr/local/docker/gitlab/data:/var/opt/gitlab
         - /usr/local/docker/gitlab/logs:/var/log/gitlab
 ```

:::


### 配置docker-compose.yml

::: tip 
我在安装的时候，version为3时候，安装失败，一直没有反应

external_url 和nginx对应端口一定要 一致
:::
```sh 
version: '2'
services:
    gitlab:
      image: 'twang2218/gitlab-ce-zh:11.1.4'
      restart: always
      hostname: '192.168.254.132'
      environment:
        TZ: 'Asia/Shanghai'
        GITLAB_OMNIBUS_CONFIG: |
          external_url 'http://192.168.254.132:8082'
          unicorn['port']= 8888
          gitlab_rails['gitlab_shell_ssh_port'] = 2222
          nginx['listen_port'] = 8082
      ports:
        - '8082:8082'
        - '8443:443'
        - '2222:22'
      volumes:
        - /usr/local/docker/gitlab/config:/etc/gitlab
        - /usr/local/docker/gitlab/data:/var/opt/gitlab
        - /usr/local/docker/gitlab/logs:/var/log/gitlab
```
### 开启docker-compose
```sh 
 sudo docker-compose up -d  
```

### 等待gitlab安装
### 需要等待一段时间
安装成功之后 ，要先设置初始密码，然后登录（默认用户root）
> 安装成功页面
![gitlab](/img/pwc/gitlablogin.png)
