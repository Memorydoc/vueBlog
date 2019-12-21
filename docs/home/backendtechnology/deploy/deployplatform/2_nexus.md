---
title: Docker 安装部署nexus
---

:::warning 提示
在安装之前要先安装docker和docker compose
:::
## 下载安装nexus镜像
```sh 
docker pull sonatype/nexus3
```
## 配置docker-compose.yml

:::tip
 这里使用的是3.16.1版本，最新版本的用户名密码需要去容器中查询，可以通过hub.docker官网上的方法并没有找到admin.password文件，所以这里使用
 的不是最新版本用户名密码是可以确定的
:::
```sh 
version: '3'
services:
    nexus:
      image: sonatype/nexus3:3.16.1
      restart: always
      container_name : nexus
      ports:
        - '8081:8081'
      volumes:
        - /usr/local/docker/nexus/data:/etc/nexus-data
```

## 运行docker-compose up -d 
>默认密码是 admin/admin123
![nexus](/img/pwc/nexus.png)


##  在项目中nexus私有仓库
在 Maven settings.xml 中添加 Nexus 认证信息(servers 节点下)：
### 配置认证信息
```sh 
<server>
  <id>nexus-releases</id>
  <username>admin</username>
  <password>admin123</password>
</server>

<server>
  <id>nexus-snapshots</id>
  <username>admin</username>
  <password>admin123</password>
</server>
```
### Snapshots 与 Releases 的区别
* nexus-releases: 用于发布 Release 版本
* nexus-snapshots: 用于发布 Snapshot 版本（快照版）
Release 版本与 Snapshot 定义如下：
```sh 
Release: 1.0.0/1.0.0-RELEASE
Snapshot: 1.0.0-SNAPSHOT
```
* 在项目 pom.xml 中设置的版本号添加 SNAPSHOT 标识的都会发布为 SNAPSHOT 版本，没有 SNAPSHOT 标识的都会发布为 RELEASE 版本。
* SNAPSHOT 版本会自动加一个时间作为标识，如：1.0.0-SNAPSHOT 发布后为变成 1.0.0-SNAPSHOT-20180522.123456-1.jar
### 配置自动化部署

在 pom.xml 中添加如下代码：
```sh 
<distributionManagement>  
  <repository>  
    <id>nexus-releases</id>  
    <name>Nexus Release Repository</name>  
    <url>http://192.168.254.132:8081/repository/maven-releases/</url>  
  </repository>  
  <snapshotRepository>  
    <id>nexus-snapshots</id>  
    <name>Nexus Snapshot Repository</name>  
    <url>http://192.168.254.132:8081/repository/maven-snapshots/</url>  
  </snapshotRepository>  
</distributionManagement> 
```
注意事项：

* ID 名称必须要与 settings.xml 中 Servers 配置的 ID 名称保持一致。
* 项目版本号中有 SNAPSHOT 标识的，会发布到 Nexus Snapshots Repository, 否则发布到 Nexus Release Repository，并根据 ID 去匹配授权账号。
### 部署到仓库    
```sh 
mvn deploy -Dmaven.test.skip=true
```

### 上传第三方 JAR 包
Nexus 3.0 不支持页面上传，可使用 maven 命令：
```sh 
# 如第三方JAR包：aliyun-sdk-oss-2.2.3.jar
mvn deploy:deploy-file 
  -DgroupId=com.aliyun.oss 
  -DartifactId=aliyun-sdk-oss 
  -Dversion=2.2.3 
  -Dpackaging=jar 
  -Dfile=D:\aliyun-sdk-oss-2.2.3.jar 
  -Durl=http://192.168.254.132/repository/maven-3rd/ 
  -DrepositoryId=nexus-releases
```
注意事项：

* 建议在上传第三方 JAR 包时，创建单独的第三方 JAR 包管理仓库，便于管理有维护。（maven-3rd）
* <code>-DrepositoryId=nexus-releases</code> 对应的是 <code>settings.xml</code> 中 Servers 配置的 ID 名称。（授权）
### 配置代理仓库
```sh 
<repositories>
    <repository>
        <id>nexus</id>
        <name>Nexus Repository</name>
        <url>http://192.168.254.132:8081/repository/maven-public/</url>
        <snapshots>
            <enabled>true</enabled>
        </snapshots>
        <releases>
            <enabled>true</enabled>
        </releases>
    </repository>
</repositories>
<pluginRepositories>
    <pluginRepository>
        <id>nexus</id>
        <name>Nexus Plugin Repository</name>
        <url>http://192.168.254.132:8081/repository/maven-public/</url>
        <snapshots>
            <enabled>true</enabled>
        </snapshots>
        <releases>
            <enabled>true</enabled>
        </releases>
    </pluginRepository>
</pluginRepositories>    
```

::: warning 误区
在设计公共代码框架依赖的时候，不能将公共代码下载当前开发的项目中，应该新建项目，通过maven依赖引入，在后续
可以通过maven install 单独部署成jar 发布到nexus私有仓库，就可以通过maven依赖引入了。

这里注意： 不是将项目写在当前开发的项目中，开始一直以为写在当前开发的项目中，一直在寻找将文件夹打包成jar的方法，发现并没有结果。有点坑
原来是一个项目依赖，通过安装出来的，并不是通过某项技术直接可以将文件夹中所有的class文件都打成jar。
开始将文件压缩，改了一个后缀（.jar），部署到私服发现，引入的时候一直报找不到符号，原因是在依赖内部找不到依赖需要的依赖。。。。。
:::

    


