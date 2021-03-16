---
title: 真正实现：一次构建，到处运行
---
## 真正实现：一次构建，到处运行
1.将项目上传到gitlab服务器(git push)        
2.配置项目自己的nexus私服    
3.Registry 镜像服务器下载对应项目的代码（git clone）。安装maven jdk，将项目打包   
4.创建对应项目的Dockerfile 文件，并通过docker build 构建项目镜像   
5.在部署服务器配置Registry私服客户端配置（上文有提到，配置daemon.json）   
6.docker pull projectImage   
7.docker run projectImage -d    
