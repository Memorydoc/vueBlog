---
title: 服务器搭建https
---



## Let’s Encrypt 搭建HTTPS

> 我这里只介绍通过Let’s Encrypt 搭建https，还有其他的搭建方式，本人觉得 Let’s Encrypt 最好用，而且免费，并且提供自动更新整数功能
*还有linux自签（OPPENSSL生成SSL自签证书） 和 阿里云免费证书， 这里就不做相关介绍了，如果想学习这两种方法，可以参考下面链接*
[搭建HTTPS服务](https://blog.csdn.net/t6546545/article/details/80508554#3)

Let’s Encrypt作为一个公共且免费SSL的项目逐渐被广大用户传播和使用，是由Mozilla、Cisco、Akamai、IdenTrust、EFF等组织人员发起，主要的目的也是为了推进网站从HTTP向HTTPS过度的进程，目前已经有越来越多的商家加入和赞助支持。

Let’s Encrypt免费SSL证书的出现，也会对传统提供付费SSL证书服务的商家有不小的打击。到目前为止，Let’s Encrypt获得IdenTrust交叉签名，这就是说可以应用且支持包括FireFox、Chrome在内的主流浏览器的兼容和支持，虽然目前是公测阶段，但是也有不少的用户在自有网站项目中正式使用起来。

Let’s Encrypt 的最大贡献是它的 ACME 协议，第一份全自动服务器身份验证协议，以及配套的基础设施和客户端。这是为了解决一直以来 HTTPS TLS X.509 PKI 信任模型，即证书权威（Certificate Authority, CA）模型缺陷的一个起步。在客户端-服务器数据传输中，公私钥加密使得公钥可以明文传输而依然保密数据，但公钥本身是否属于服务器，或公钥与服务器是否同属一个身份，是无法简单验证的。证书权威模型通过引入事先信任的第三方，由第三方去验证这一点，并通过在服务器公钥上签名的方式来认证服务器。第三方的公钥则在事先就约定并离线准备好，以备访问时验证签名之用。这个第三方就称为证书权威，简称CA。相应的，CA验证过的公钥被称为证书。问题是，如果服务器私钥泄露，CA无法离线使对应的证书无效化，只能另外发布无效记录供客户端查询。也就是说，在私钥泄露到CA发布无效记录的窗口内，中间人可以肆意监控服-客之间的传输。如果中间人设法屏蔽了客户端对无效记录的访问，那么直到证书过期，中间人都可以进行监控。而由于当前CA验证和签发证书大多手动，证书有效期往往在一年到三年。Let’s Encrypt 签发的证书有效期只有90天，甚至希望缩短到60天。有效期越短，泄密后可供监控的窗口就越短。

*1.在安装之前，服务器需要具备python和git等工具*
*检查python版本是否在2.7以上*

如果没有安装Python的话，执行以下命令进行安装（如果检测到已安装则略过）

```editorconfig
    #安装python所需的包
    yum install zlib-devel
    yum install bzip2-devel
    yum install openssl-devel
    yum install ncurses-devel
    yum install sqlite-devel
    #获取到Python
    cd /usr/local/src
    wget https://www.python.org/ftp/python/2.7.12/Python-2.7.12.tar.xz
    #解压Python2.7.12
    tar -xvf Python-2.7.12.tar.xz
    #编译python
    cd Python-2.7.12/
    ./configure --prefix=/usr/local/python2.7
    make && make install
    #建立link
    ln -s /usr/local/python2.7/bin/python2.7 /usr/local/bin/python
    #解决系统 Python 软链接指向 Python2.7 版本后，因为yum是不兼容 Python 2.7的，所需要指定 yum 的Python版本
    #vim /usr/bin/yum 
    将头部的
    #!/usr/bin/python
    改成
    #!/usr/bin/python2.6.6
```

>如果没有git，请先安装git
*检查系统是否安装git*
git  --version

如果没有安装Git的话，执行以下命令进行安装（如果检测到已安装则略过）

#git 安装
yum install git

*2. 快速获取Let’s Encrypt免费SSL证书*
  相较于第一种自签生成证书的方法，Let’s Encrypt肯定是考虑到推广HTTPS的普及型会让用户简单的获取和部署SSL证书，所以可以采用下面简单的一键部署获取证书。
  
  #获取letsencrypt
  git clone https://github.com/letsencrypt/letsencrypt
  #进入letsencrypt目录
  cd letsencrypt
  #生成证书  --email后填写自己的邮箱   -d 后面填写需要配置证书的域名（支持多个哦）, 我这里域名为: sizegang.cn; 绑定域名为: www.sizegang.cn
  ./letsencrypt-auto certonly --standalone --email 17615195790@163.com -d sizegang.cn -d www.sizegang.cn
  >Let’s Encrypt是支持绑定多域名的，上述两种方法都是只支持单域名。
  
*3. Let’s Encrypt免费SSL证书获取与应用*
  
  在完成Let’s Encrypt证书的生成之后，我们会在"/etc/letsencrypt/live/www.sizegang.cn/" 域名目录下有4个文件就是生成的密钥证书文件。
  
  cert.pem - Apache服务器端证书
  chain.pem - Apache根证书和中继证书
  fullchain.pem - Nginx所需要ssl_certificate文件
  privkey.pem - 安全证书KEY文件
  
  因为我的是Nginx环境，那就需要用到fullchain.pem和privkey.pem两个证书文件。修改nginx配置的详细过程，
  上面两种方法都提到了，这里不再赘述，以下我修改好的配置文件：
  
  ```config 
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
  
  	listen 443 ssl http2; #这里要在阿里云服务器上开放端口，如果你用的别的服务器，可以去指定服务器厂商控制台开放端口，好像默认是开放的，看一下
  	ssl on; #打开ssl
  	ssl_certificate  /etc/letsencrypt/live/www.sizegang.cn/fullchain.pem; #这里的路径要指定正确
          	ssl_certificate_key  /etc/letsencrypt/live/www.sizegang.cn/privkey.pem;    #这里的路径要指定正确 上文中生成的整数路径   	
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
>OK，到这里就完成了使用Let’s Encrypt免费证书的方法配置https协议，大家也可访问我的页面来查看效果，地址：[Memorydoc](https://www.sizegang.cn)。
 下面是配置整数自动更新（Let’s Encrypt证书是有效期90天）
 *4.Let’s Encrypt证书自动续期，实现真正的永久免费使用*
            vim /home/sizegang/https/updatessl.sh    //创建一个名字为updatessl的脚本  这里你可以自定义路径
 然后在脚本里添加如下代码。
```config 
#!/bin/sh
            # 我的updatessl.sh  文件和 letsencrypt文件在同一目录下，所以这样写，你们可以自定义目录，只要正确即可
            ./letsencrypt/certbot-auto renew --force-renew --pre-hook "service nginx stop" --post-hook "service nginx start"
            #第一行是指此脚本使用/bin/sh 来执行
            #第二行中--force-renew参数代表强制更新
            #重启ngiinx
```

退出并保存，然后给脚本添加可执行权限
            //这里的文件路径填写你自己的文件路径
            chmod +x /home/sizegang/https/updatessl.sh
            
*5.创建定时任务*
 >打开crontab文件 执行命令： crontab -e
 
 然后在文件末尾添加一行内容： 
            0  0  28 *  * root /home/sizegang/https/updatessl.sh  
             //我这里代表每月28号更新一次证书文件，文件路径填写你自己的文件路径
             
>>具体格式如下：
>>Minute Hour Day Month Dayofweek command
>> 分钟 小时 天 月 天每星期 命令

每个字段代表的含义如下：

Minute 每个小时的第几分钟执行该任务
Hour 每天的第几个小时执行该任务
Day 每月的第几天执行该任务
Month 每年的第几个月执行该任务
DayOfWeek 每周的第几天执行该任务
Command 指定要执行的程序


>>在这些字段里，除了“Command”是每次都必须指定的字段以外，其它字段皆为可选字段，可视需要决定。对于不指定的字段，要用“*”来填补其位置。
>>  **记得重启crontab服务哦。** 好了，自动更新证书已经配置完了，再也不用担心证书过期啦！ 

 
 

