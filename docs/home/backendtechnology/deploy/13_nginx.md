---
title: Nginx的使用(启动、重启、关闭)
---
1. 首先利用配置文件启动nginx。
* 命令: nginx -c /usr/local/nginx/conf/nginx.conf
* 重启服务： service nginx restart

2. 快速停止或关闭Nginx：nginx -s stop

3. 正常停止或关闭Nginx：nginx -s quit
 
4. 配置文件修改重装载命令：nginx -s reload