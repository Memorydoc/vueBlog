---
title: Docker安装mysql
---
## 查找 Docker Hub 上的 MySQL 镜像
```sh 
root@UbuntuBase:/usr/local/docker/mysql# docker search mysql
NAME                                                   DESCRIPTION                                     STARS               OFFICIAL            AUTOMATED
mysql                                                  MySQL is a widely used, open-source relati...   5177                [OK]                
mariadb                                                MariaDB is a community-developed fork of M...   1602                [OK]                
mysql/mysql-server                                     Optimized MySQL Server Docker images. Crea...   361                                     [OK]
percona                                                Percona Server is a fork of the MySQL rela...   298                 [OK]                
hypriot/rpi-mysql                                      RPi-compatible Docker Image with Mysql          72                                      
zabbix/zabbix-server-mysql                             Zabbix Server with MySQL database support       62                                      [OK]
centurylink/mysql                                      Image containing mysql. Optimized to be li...   53                                      [OK]
sameersbn/mysql                                                                                        48                                      [OK]
zabbix/zabbix-web-nginx-mysql                          Zabbix frontend based on Nginx web-server ...   36                                      [OK]
tutum/mysql                                            Base docker image to run a MySQL database ...   27                                      
1and1internet/ubuntu-16-nginx-php-phpmyadmin-mysql-5   ubuntu-16-nginx-php-phpmyadmin-mysql-5          17                                      [OK]
schickling/mysql-backup-s3                             Backup MySQL to S3 (supports periodic back...   16                                      [OK]
centos/mysql-57-centos7                                MySQL 5.7 SQL database server                   15                                      
linuxserver/mysql                                      A Mysql container, brought to you by Linux...   12                                      
centos/mysql-56-centos7                                MySQL 5.6 SQL database server                   6                                       
openshift/mysql-55-centos7                             DEPRECATED: A Centos7 based MySQL v5.5 ima...   6                                       
frodenas/mysql                                         A Docker Image for MySQL                        3                                       [OK]
dsteinkopf/backup-all-mysql                            backup all DBs in a mysql server                3                                       [OK]
circleci/mysql                                         MySQL is a widely used, open-source relati...   2                                       
cloudposse/mysql                                       Improved `mysql` service with support for ...   0                                       [OK]
astronomerio/mysql-sink                                MySQL sink                                      0                                       [OK]
ansibleplaybookbundle/rhscl-mysql-apb                  An APB which deploys RHSCL MySQL                0                                       [OK]
cloudfoundry/cf-mysql-ci                               Image used in CI of cf-mysql-release            0                                       
astronomerio/mysql-source                              MySQL source                                    0                                       [OK]
jenkler/mysql                   
```
这里我们拉取官方的镜像(这里使用的是5.7.27版本)
```sh 
docker pull mysql:5.7.27
```
等待下载完成后，我们就可以在本地镜像列表里查到 REPOSITORY 为 mysql 的镜像
## 运行容器
```sh 
docker run -p 3306:3306 --name mysql-sizegang \
-v /usr/local/docker/mysql/conf:/etc/mysql \
-v /usr/local/docker/mysql/logs:/var/log/mysql \
-v /usr/local/docker/mysql/data:/var/lib/mysql \
-e MYSQL_ROOT_PASSWORD=123456 \
-d mysql:5.7.27
```
命令参数：

* -p 3306:3306：将容器的3306端口映射到主机的3306端口
* -v /usr/local/docker/mysql/conf:/etc/mysql：将主机当前目录下的 conf 挂载到容器的 /etc/mysql
* -v /usr/local/docker/mysql/logs:/var/log/mysql：将主机当前目录下的 logs 目录挂载到容器的 /var/log/mysql
* -v /usr/local/docker/mysql/data:/var/lib/mysql：将主机当前目录下的 data 目录挂载到容器的 /var/lib/mysql
* -e MYSQL\_ROOT\_PASSWORD=123456：初始化root用户的密码
查看容器启动情况

```sh 
root@UbuntuBase:/usr/local/docker/mysql# docker ps
CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS              PORTS                    NAMES
bc49c9de4cdf        mysql:latest        "docker-entrypoint..."   4 minutes ago       Up 4 minutes        0.0.0.0:3306->3306/tcp   mysql
```
使用客户端工具连接 MySQL

![mysql1](/img/dockerinstall/mysql1.png)


### 附加
如果你直接执行docker pull mysql 会拉去最新的lasted版本（8.x）
会需要额外在启动参数中添加数据卷 mysql_files 
```sh 
```sh 
docker run -p 3306:3306 --name mysql-sizegang \
-v /usr/local/docker/mysql/conf:/etc/mysql \
-v /usr/local/docker/mysql/logs:/var/log/mysql \
-v /usr/local/docker/mysql/data:/var/lib/mysql \
-v /usr/local/docker/mysql/mysql_files/:/var/data/mysql_files \
-e MYSQL_ROOT_PASSWORD=123456 \
-d mysql
```

同时需要配置一下
password格式，在连接sqlyong的时候
![mysql1](/img/dockerinstall/mysql2.png)