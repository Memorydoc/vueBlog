---
title: docker 安装tomcat 和 nginx 一体化安装
---
## docker-compose.yml

```sh  
version: '3.1'
services:
  nginx:
    restart: always
    image: nginx
    container_name: nginx
    links:
      - tomcat-blog:blog1
    ports:
      - 80:80
      - 443:443
    volumes:
      - ./conf/nginx.conf:/etc/nginx/nginx.conf
      - ./wwwroot:/usr/share/nginx/wwwroot
      - ./https:/usr/local/www.sizegang.cn
      - /etc/letsencrypt:/etc/letsencrypt
  tomcat-blog:
    restart: always
    image: tomcat
    container_name: tomcat1
    ports:
      - 8100:8100
    volumes:
      - /usr/local/docker/jenkins-sizegang/blog:/usr/local/blog
      - /usr/local/docker/blog-nginx/tomcat-config/conf:/usr/local/tomcat/conf
    environment:
      TZ: Asia/Shanghai

```