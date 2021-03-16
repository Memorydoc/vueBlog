---
title: DockerCompose安装 Nginx
---
## 概述
我们使用 Docker 来安装和运行 Nginx，docker-compose.yml 配置如下：

```sh 
version: '3.1'
services:
  nginx:
    restart: always
    image: nginx
    container_name: nginx
    ports:
      - 81:80
    volumes:
      - ./conf/nginx.conf:/etc/nginx/nginx.conf
      - ./wwwroot:/usr/share/nginx/wwwroot
```

## 配置nginx.conf
```sh 
# For more information on configuration, see:
#   * Official English Documentation: http://nginx.org/en/docs/
#   * Official Russian Documentation: http://nginx.org/ru/docs/

user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log;
pid /run/nginx.pid;

# Load dynamic modules. See /usr/share/nginx/README.dynamic.
include /usr/share/nginx/modules/*.conf;

events {
    worker_connections 1024;
}

http {
        
    upstream blog {
     server localhost:8888;
   }

    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';
		
	       	  

    access_log  /var/log/nginx/access.log  main;

    sendfile            on;
    tcp_nopush          on;
    tcp_nodelay         on;
    keepalive_timeout   65;
    types_hash_max_size 2048;

    include             /etc/nginx/mime.types;
    default_type        application/octet-stream;

    # Load modular configuration files from the /etc/nginx/conf.d directory.
    # See http://nginx.org/en/docs/ngx_core_module.html#include
    # for more information.
    include /etc/nginx/conf.d/*.conf;
	server{
	listen 80;
        	server_name www.sizegang.cn;
        	return 301 https://www.sizegang.cn$request_uri;
	}	
    	server {

	listen 443 ssl http2;
	ssl on;
	ssl_certificate  /etc/letsencrypt/live/www.sizegang.cn/fullchain.pem;
        	ssl_certificate_key  /etc/letsencrypt/live/www.sizegang.cn/privkey.pem;       	
	ssl_session_cache shared:SSL:1m;
        	ssl_session_timeout  10m;
        	ssl_ciphers HIGH:!aNULL:!MD5;
        	ssl_prefer_server_ciphers on;
        root         /usr/share/nginx/html;

	location /blog {
	  proxy_pass http://blog/blog/html;	
	}
	location / {
	  proxy_pass http://blog/blog/html;	
	}

	location /view/blog{
	  proxy_pass http://blog/view/blog;
	}
	location /view/admin{
	  proxy_pass http://blog/view/admin;
	}
	location /blog/html{
	  proxy_pass http://blog/blog/html;
	}
	location /pay{
	  proxy_pass http://blog/pay;
	}
	location /admin/html{
	  proxy_pass http://blog/admin/html;
	}
        error_page 404 /404.html;
            location = /40x.html {
        }

        error_page 500 502 503 504 /50x.html;
            location = /50x.html {
        }
    }
}
```

## 附加
上面是基于https 编写的配置文件nginx.conf，如果你不想基于https，那么可以使用
下面的配置文件
```sh 
# For more information on configuration, see:

# 启动进程,通常设置成和 CPU 的数量相等
worker_processes  1;

events {
    # epoll 是多路复用 IO(I/O Multiplexing) 中的一种方式
    # 但是仅用于 linux2.6 以上内核,可以大大提高 nginx 的性能
    use epoll;
    # 单个后台 worker process 进程的最大并发链接数
    worker_connections  1024;
}


http {
        
    upstream blog {
     server 106.13.126.235:8888;
   }

    sendfile            on;
    tcp_nopush          on;
    tcp_nodelay         on;
    keepalive_timeout   65;
    types_hash_max_size 2048;
	
    # 设定 mime 类型,类型由 mime.type 文件定义
    include       mime.types;
    default_type        application/octet-stream;

    server {
	listen 80;
	server_name  106.13.126.235;
	location /blog {
	  proxy_pass http://blog/blog/html;	
	}
	location / {
	  proxy_pass http://blog/blog/html;	
	}

	location /view/blog{
	  proxy_pass http://blog/view/blog;
	}
	location /view/admin{
	  proxy_pass http://blog/view/admin;
	}
	location /blog/html{
	  proxy_pass http://blog/blog/html;
	}
	location /pay{
	  proxy_pass http://blog/pay;
	}
	location /admin/html{
	  proxy_pass http://blog/admin/html;
	}
        error_page 404 /404.html;
            location = /40x.html {
        }

        error_page 500 502 503 504 /50x.html;
            location = /50x.html {
        }
    }
}
```

**访问地址** <code>http://106.13.126.235:81/</code>