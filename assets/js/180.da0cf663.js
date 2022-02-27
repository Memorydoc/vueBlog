(window.webpackJsonp=window.webpackJsonp||[]).push([[180],{453:function(s,t,n){"use strict";n.r(t);var a=n(10),e=Object(a.a)({},function(){var s=this,t=s.$createElement,n=s._self._c||t;return n("ContentSlotsDistributor",{attrs:{"slot-key":s.$parent.slotKey}},[n("div",{staticClass:"tip custom-block"},[n("p",{staticClass:"custom-block-title"},[s._v("声明")]),s._v(" "),n("p",[s._v("我这里只介绍通过Let’s Encrypt 搭建https，还有其他的搭建方式，本人觉得 Let’s Encrypt 最好用，而且免费，并且提供自动更新整数功能\n"),n("em",[s._v("还有linux自签（OPPENSSL生成SSL自签证书） 和 阿里云免费证书， 这里就不做相关介绍了，如果想学习这两种方法，可以参考下面链接")]),s._v(" "),n("a",{attrs:{href:"https://blog.csdn.net/t6546545/article/details/80508554#3",target:"_blank",rel:"noopener noreferrer"}},[s._v("搭建HTTPS服务"),n("OutboundLink")],1)])]),s._v(" "),n("h2",{attrs:{id:"let’s-encrypt-搭建https"}},[s._v("Let’s Encrypt 搭建HTTPS")]),s._v(" "),n("p",[s._v("Let’s Encrypt作为一个公共且免费SSL的项目逐渐被广大用户传播和使用，是由Mozilla:Cisco:Akamai:IdenTrust:EFF等组织人员发起，主要的目的也是为了推进网站从HTTP向HTTPS过度的进程，目前已经有越来越多的商家加入和赞助支持。")]),s._v(" "),n("p",[s._v("Let’s Encrypt免费SSL证书的出现，也会对传统提供付费SSL证书服务的商家有不小的打击。到目前为止，Let’s Encrypt获得IdenTrust交叉签名，这就是说可以应用且支持包括FireFox:Chrome在内的主流浏览器的兼容和支持，虽然目前是公测阶段，但是也有不少的用户在自有网站项目中正式使用起来。")]),s._v(" "),n("p",[s._v("Let’s Encrypt 的最大贡献是它的 ACME 协议，第一份全自动服务器身份验证协议，以及配套的基础设施和客户端。这是为了解决一直以来 HTTPS TLS X.509 PKI 信任模型，即证书权威（Certificate Authority, CA）模型缺陷的一个起步。在客户端-服务器数据传输中，公私钥加密使得公钥可以明文传输而依然保密数据，但公钥本身是否属于服务器，或公钥与服务器是否同属一个身份，是无法简单验证的。证书权威模型通过引入事先信任的第三方，由第三方去验证这一点，并通过在服务器公钥上签名的方式来认证服务器。第三方的公钥则在事先就约定并离线准备好，以备访问时验证签名之用。这个第三方就称为证书权威，简称CA。相应的，CA验证过的公钥被称为证书。问题是，如果服务器私钥泄露，CA无法离线使对应的证书无效化，只能另外发布无效记录供客户端查询。也就是说，在私钥泄露到CA发布无效记录的窗口内，中间人可以肆意监控服-客之间的传输。如果中间人设法屏蔽了客户端对无效记录的访问，那么直到证书过期，中间人都可以进行监控。而由于当前CA验证和签发证书大多手动，证书有效期往往在一年到三年。Let’s Encrypt 签发的证书有效期只有90天，甚至希望缩短到60天。有效期越短，泄密后可供监控的窗口就越短。")]),s._v(" "),n("div",{staticClass:"danger custom-block"},[n("p",{staticClass:"custom-block-title"},[s._v("注意")]),s._v(" "),n("p",[n("em",[s._v("在安装之前，服务器需要具备python和git等工具。")]),s._v(" "),n("em",[s._v("检查python版本是否在2.7以上")])])]),s._v(" "),n("h2",{attrs:{id:"安装python-和-git"}},[s._v("安装python 和 git")]),s._v(" "),n("p",[s._v("如果没有安装Python的话，执行以下命令进行安装（如果检测到已安装则略过）")]),s._v(" "),n("div",{staticClass:"language-sh line-numbers-mode"},[n("pre",{pre:!0,attrs:{class:"language-sh"}},[n("code",[s._v("    "),n("span",{pre:!0,attrs:{class:"token comment"}},[s._v("#安装python所需的包")]),s._v("\n    yum "),n("span",{pre:!0,attrs:{class:"token function"}},[s._v("install")]),s._v(" zlib-devel\n    yum "),n("span",{pre:!0,attrs:{class:"token function"}},[s._v("install")]),s._v(" bzip2-devel\n    yum "),n("span",{pre:!0,attrs:{class:"token function"}},[s._v("install")]),s._v(" openssl-devel\n    yum "),n("span",{pre:!0,attrs:{class:"token function"}},[s._v("install")]),s._v(" ncurses-devel\n    yum "),n("span",{pre:!0,attrs:{class:"token function"}},[s._v("install")]),s._v(" sqlite-devel\n    "),n("span",{pre:!0,attrs:{class:"token comment"}},[s._v("#获取到Python")]),s._v("\n    "),n("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v("cd")]),s._v(" /usr/local/src\n    "),n("span",{pre:!0,attrs:{class:"token function"}},[s._v("wget")]),s._v(" https://www.python.org/ftp/python/2.7.12/Python-2.7.12.tar.xz\n    "),n("span",{pre:!0,attrs:{class:"token comment"}},[s._v("#解压Python2.7.12")]),s._v("\n    "),n("span",{pre:!0,attrs:{class:"token function"}},[s._v("tar")]),s._v(" -xvf Python-2.7.12.tar.xz\n    "),n("span",{pre:!0,attrs:{class:"token comment"}},[s._v("#编译python")]),s._v("\n    "),n("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v("cd")]),s._v(" Python-2.7.12/\n    ./configure --prefix"),n("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v("/usr/local/python2.7\n    "),n("span",{pre:!0,attrs:{class:"token function"}},[s._v("make")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token operator"}},[s._v("&&")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token function"}},[s._v("make")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token function"}},[s._v("install")]),s._v("\n    "),n("span",{pre:!0,attrs:{class:"token comment"}},[s._v("#建立link")]),s._v("\n    "),n("span",{pre:!0,attrs:{class:"token function"}},[s._v("ln")]),s._v(" -s /usr/local/python2.7/bin/python2.7 /usr/local/bin/python\n    "),n("span",{pre:!0,attrs:{class:"token comment"}},[s._v("#解决系统 Python 软链接指向 Python2.7 版本后，因为yum是不兼容 Python 2.7的，所需要指定 yum 的Python版本")]),s._v("\n    "),n("span",{pre:!0,attrs:{class:"token comment"}},[s._v("#vim /usr/bin/yum ")]),s._v("\n    将头部的\n    "),n("span",{pre:!0,attrs:{class:"token comment"}},[s._v("#!/usr/bin/python")]),s._v("\n    改成\n    "),n("span",{pre:!0,attrs:{class:"token comment"}},[s._v("#!/usr/bin/python2.6.6")]),s._v("\n")])]),s._v(" "),n("div",{staticClass:"line-numbers-wrapper"},[n("span",{staticClass:"line-number"},[s._v("1")]),n("br"),n("span",{staticClass:"line-number"},[s._v("2")]),n("br"),n("span",{staticClass:"line-number"},[s._v("3")]),n("br"),n("span",{staticClass:"line-number"},[s._v("4")]),n("br"),n("span",{staticClass:"line-number"},[s._v("5")]),n("br"),n("span",{staticClass:"line-number"},[s._v("6")]),n("br"),n("span",{staticClass:"line-number"},[s._v("7")]),n("br"),n("span",{staticClass:"line-number"},[s._v("8")]),n("br"),n("span",{staticClass:"line-number"},[s._v("9")]),n("br"),n("span",{staticClass:"line-number"},[s._v("10")]),n("br"),n("span",{staticClass:"line-number"},[s._v("11")]),n("br"),n("span",{staticClass:"line-number"},[s._v("12")]),n("br"),n("span",{staticClass:"line-number"},[s._v("13")]),n("br"),n("span",{staticClass:"line-number"},[s._v("14")]),n("br"),n("span",{staticClass:"line-number"},[s._v("15")]),n("br"),n("span",{staticClass:"line-number"},[s._v("16")]),n("br"),n("span",{staticClass:"line-number"},[s._v("17")]),n("br"),n("span",{staticClass:"line-number"},[s._v("18")]),n("br"),n("span",{staticClass:"line-number"},[s._v("19")]),n("br"),n("span",{staticClass:"line-number"},[s._v("20")]),n("br"),n("span",{staticClass:"line-number"},[s._v("21")]),n("br"),n("span",{staticClass:"line-number"},[s._v("22")]),n("br"),n("span",{staticClass:"line-number"},[s._v("23")]),n("br")])]),n("blockquote",[n("p",[s._v("如果没有git，请先安装git\n"),n("em",[s._v("检查系统是否安装git")]),s._v("\ngit  --version")])]),s._v(" "),n("p",[s._v("如果没有安装Git的话，执行以下命令进行安装（如果检测到已安装则略过）")]),s._v(" "),n("p",[s._v("git 安装\nyum install git")]),s._v(" "),n("h2",{attrs:{id:"快速获取免费ssl证书"}},[s._v("快速获取免费SSL证书*")]),s._v(" "),n("p",[s._v("相较于第一种自签生成证书的方法，Let’s Encrypt肯定是考虑到推广HTTPS的普及型会让用户简单的获取和部署SSL证书,所以可以采用下面简单的一键部署获取证书。\n获取letsencrypt")]),s._v(" "),n("div",{staticClass:"language-sh line-numbers-mode"},[n("pre",{pre:!0,attrs:{class:"language-sh"}},[n("code",[n("span",{pre:!0,attrs:{class:"token function"}},[s._v("git")]),s._v(" clone https://github.com/letsencrypt/letsencrypt   \n")])]),s._v(" "),n("div",{staticClass:"line-numbers-wrapper"},[n("span",{staticClass:"line-number"},[s._v("1")]),n("br")])]),n("p",[s._v("进入letsencrypt目录")]),s._v(" "),n("div",{staticClass:"language-sh line-numbers-mode"},[n("pre",{pre:!0,attrs:{class:"language-sh"}},[n("code",[s._v("  "),n("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v("cd")]),s._v(" letsencrypt   \n")])]),s._v(" "),n("div",{staticClass:"line-numbers-wrapper"},[n("span",{staticClass:"line-number"},[s._v("1")]),n("br")])]),n("p",[s._v("生成证书  --email后填写自己的邮箱   -d 后面填写需要配置证书的域名（支持多个哦）, 我这里域名为: sizegang.cn; 绑定域名为: www.sizegang.cn")]),s._v(" "),n("div",{staticClass:"language-sh line-numbers-mode"},[n("pre",{pre:!0,attrs:{class:"language-sh"}},[n("code",[s._v("  ./letsencrypt-auto certonly --standalone --email "),n("span",{pre:!0,attrs:{class:"token number"}},[s._v("17615195790")]),s._v("@163.com -d sizegang.cn -d www.sizegang.cn\n")])]),s._v(" "),n("div",{staticClass:"line-numbers-wrapper"},[n("span",{staticClass:"line-number"},[s._v("1")]),n("br")])]),n("blockquote",[n("p",[s._v("Let’s Encrypt是支持绑定多域名的，上述两种方法都是只支持单域名。")])]),s._v(" "),n("h2",{attrs:{id:"免费ssl证书获取与应用"}},[s._v("免费SSL证书获取与应用")]),s._v(" "),n("p",[s._v('在完成Let’s Encrypt证书的生成之后，我们会在"/etc/letsencrypt/live/www.sizegang.cn/" 域名目录下有4个文件就是生成的密钥证书文件。')]),s._v(" "),n("p",[s._v("cert.pem - Apache服务器端证书\nchain.pem - Apache根证书和中继证书\nfullchain.pem - Nginx所需要ssl_certificate文件\nprivkey.pem - 安全证书KEY文件")]),s._v(" "),n("p",[s._v("因为我的是Nginx环境，那就需要用到fullchain.pem和privkey.pem两个证书文件。修改nginx配置的详细过程，\n上面两种方法都提到了，这里不再赘述，以下我修改好的配置文件：")]),s._v(" "),n("div",{staticClass:"language-sh line-numbers-mode"},[n("pre",{pre:!0,attrs:{class:"language-sh"}},[n("code",[s._v("events "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n    worker_connections "),n("span",{pre:!0,attrs:{class:"token number"}},[s._v("1024")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n\nhttp "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n        \n    upstream blog "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n     server localhost:8888"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n   "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n\n    log_format  main  "),n("span",{pre:!0,attrs:{class:"token string"}},[s._v("'"),n("span",{pre:!0,attrs:{class:"token variable"}},[s._v("$remote_addr")]),s._v(" - "),n("span",{pre:!0,attrs:{class:"token variable"}},[s._v("$remote_user")]),s._v(" ["),n("span",{pre:!0,attrs:{class:"token variable"}},[s._v("$time_local")]),s._v('] "'),n("span",{pre:!0,attrs:{class:"token variable"}},[s._v("$request")]),s._v("\" '")]),s._v("\n                      "),n("span",{pre:!0,attrs:{class:"token string"}},[s._v("'"),n("span",{pre:!0,attrs:{class:"token variable"}},[s._v("$status")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token variable"}},[s._v("$body_bytes_sent")]),s._v(' "'),n("span",{pre:!0,attrs:{class:"token variable"}},[s._v("$http_referer")]),s._v("\" '")]),s._v("\n                      "),n("span",{pre:!0,attrs:{class:"token string"}},[s._v("'\""),n("span",{pre:!0,attrs:{class:"token variable"}},[s._v("$http_user_agent")]),s._v('" "'),n("span",{pre:!0,attrs:{class:"token variable"}},[s._v("$http_x_forwarded_for")]),s._v("\"'")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n\t\t\n\t       \t  \n\n    access_log  /var/log/nginx/access.log  main"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n\n    sendfile            on"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n    tcp_nopush          on"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n    tcp_nodelay         on"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n    keepalive_timeout   "),n("span",{pre:!0,attrs:{class:"token number"}},[s._v("65")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n    types_hash_max_size "),n("span",{pre:!0,attrs:{class:"token number"}},[s._v("2048")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n\n    include             /etc/nginx/mime.types"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n    default_type        application/octet-stream"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n\n    "),n("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# Load modular configuration files from the /etc/nginx/conf.d directory.")]),s._v("\n    "),n("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# See http://nginx.org/en/docs/ngx_core_module.html#include")]),s._v("\n    "),n("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# for more information.")]),s._v("\n    include /etc/nginx/conf.d/*.conf"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n\tserver"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n\tlisten "),n("span",{pre:!0,attrs:{class:"token number"}},[s._v("80")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n        \tserver_name www.sizegang.cn"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n        \t"),n("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v("return")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token number"}},[s._v("301")]),s._v(" https://www.sizegang.cn"),n("span",{pre:!0,attrs:{class:"token variable"}},[s._v("$request_uri")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n\t"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\t\n    \tserver "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n\n\tlisten "),n("span",{pre:!0,attrs:{class:"token number"}},[s._v("443")]),s._v(" ssl http2"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token comment"}},[s._v("#这里要在阿里云服务器上开放端口，如果你用的别的服务器，可以去指定服务器厂商控制台开放端口，好像默认是开放的，看一下")]),s._v("\n\tssl on"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token comment"}},[s._v("#打开ssl")]),s._v("\n\tssl_certificate  /etc/letsencrypt/live/www.sizegang.cn/fullchain.pem"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token comment"}},[s._v("#这里的路径要指定正确")]),s._v("\n        \tssl_certificate_key  /etc/letsencrypt/live/www.sizegang.cn/privkey.pem"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("    "),n("span",{pre:!0,attrs:{class:"token comment"}},[s._v("#这里的路径要指定正确 上文中生成的整数路径   \t")]),s._v("\n\tssl_session_cache shared:SSL:1m"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n        \tssl_session_timeout  10m"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n        \tssl_ciphers HIGH:"),n("span",{pre:!0,attrs:{class:"token operator"}},[s._v("!")]),s._v("aNULL:"),n("span",{pre:!0,attrs:{class:"token operator"}},[s._v("!")]),s._v("MD5"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n        \tssl_prefer_server_ciphers on"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n        root         /usr/share/nginx/html"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n\n\tlocation /blog "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n\t  proxy_pass http://blog/blog/html"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\t\n\t"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n\tlocation / "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n\t  proxy_pass http://blog/blog/html"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\t\n\t"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n\n\tlocation /view/blog"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n\t  proxy_pass http://blog/view/blog"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n\t"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n\tlocation /view/admin"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n\t  proxy_pass http://blog/view/admin"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n\t"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n\tlocation /blog/html"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n\t  proxy_pass http://blog/blog/html"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n\t"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n\tlocation /pay"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n\t  proxy_pass http://blog/pay"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n\t"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n\tlocation /admin/html"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n\t  proxy_pass http://blog/admin/html"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n\t"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n        error_page "),n("span",{pre:!0,attrs:{class:"token number"}},[s._v("404")]),s._v(" /404.html"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n            location "),n("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" /40x.html "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n        "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n\n        error_page "),n("span",{pre:!0,attrs:{class:"token number"}},[s._v("500")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token number"}},[s._v("502")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token number"}},[s._v("503")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token number"}},[s._v("504")]),s._v(" /50x.html"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n            location "),n("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" /50x.html "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n        "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n    "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n")])]),s._v(" "),n("div",{staticClass:"line-numbers-wrapper"},[n("span",{staticClass:"line-number"},[s._v("1")]),n("br"),n("span",{staticClass:"line-number"},[s._v("2")]),n("br"),n("span",{staticClass:"line-number"},[s._v("3")]),n("br"),n("span",{staticClass:"line-number"},[s._v("4")]),n("br"),n("span",{staticClass:"line-number"},[s._v("5")]),n("br"),n("span",{staticClass:"line-number"},[s._v("6")]),n("br"),n("span",{staticClass:"line-number"},[s._v("7")]),n("br"),n("span",{staticClass:"line-number"},[s._v("8")]),n("br"),n("span",{staticClass:"line-number"},[s._v("9")]),n("br"),n("span",{staticClass:"line-number"},[s._v("10")]),n("br"),n("span",{staticClass:"line-number"},[s._v("11")]),n("br"),n("span",{staticClass:"line-number"},[s._v("12")]),n("br"),n("span",{staticClass:"line-number"},[s._v("13")]),n("br"),n("span",{staticClass:"line-number"},[s._v("14")]),n("br"),n("span",{staticClass:"line-number"},[s._v("15")]),n("br"),n("span",{staticClass:"line-number"},[s._v("16")]),n("br"),n("span",{staticClass:"line-number"},[s._v("17")]),n("br"),n("span",{staticClass:"line-number"},[s._v("18")]),n("br"),n("span",{staticClass:"line-number"},[s._v("19")]),n("br"),n("span",{staticClass:"line-number"},[s._v("20")]),n("br"),n("span",{staticClass:"line-number"},[s._v("21")]),n("br"),n("span",{staticClass:"line-number"},[s._v("22")]),n("br"),n("span",{staticClass:"line-number"},[s._v("23")]),n("br"),n("span",{staticClass:"line-number"},[s._v("24")]),n("br"),n("span",{staticClass:"line-number"},[s._v("25")]),n("br"),n("span",{staticClass:"line-number"},[s._v("26")]),n("br"),n("span",{staticClass:"line-number"},[s._v("27")]),n("br"),n("span",{staticClass:"line-number"},[s._v("28")]),n("br"),n("span",{staticClass:"line-number"},[s._v("29")]),n("br"),n("span",{staticClass:"line-number"},[s._v("30")]),n("br"),n("span",{staticClass:"line-number"},[s._v("31")]),n("br"),n("span",{staticClass:"line-number"},[s._v("32")]),n("br"),n("span",{staticClass:"line-number"},[s._v("33")]),n("br"),n("span",{staticClass:"line-number"},[s._v("34")]),n("br"),n("span",{staticClass:"line-number"},[s._v("35")]),n("br"),n("span",{staticClass:"line-number"},[s._v("36")]),n("br"),n("span",{staticClass:"line-number"},[s._v("37")]),n("br"),n("span",{staticClass:"line-number"},[s._v("38")]),n("br"),n("span",{staticClass:"line-number"},[s._v("39")]),n("br"),n("span",{staticClass:"line-number"},[s._v("40")]),n("br"),n("span",{staticClass:"line-number"},[s._v("41")]),n("br"),n("span",{staticClass:"line-number"},[s._v("42")]),n("br"),n("span",{staticClass:"line-number"},[s._v("43")]),n("br"),n("span",{staticClass:"line-number"},[s._v("44")]),n("br"),n("span",{staticClass:"line-number"},[s._v("45")]),n("br"),n("span",{staticClass:"line-number"},[s._v("46")]),n("br"),n("span",{staticClass:"line-number"},[s._v("47")]),n("br"),n("span",{staticClass:"line-number"},[s._v("48")]),n("br"),n("span",{staticClass:"line-number"},[s._v("49")]),n("br"),n("span",{staticClass:"line-number"},[s._v("50")]),n("br"),n("span",{staticClass:"line-number"},[s._v("51")]),n("br"),n("span",{staticClass:"line-number"},[s._v("52")]),n("br"),n("span",{staticClass:"line-number"},[s._v("53")]),n("br"),n("span",{staticClass:"line-number"},[s._v("54")]),n("br"),n("span",{staticClass:"line-number"},[s._v("55")]),n("br"),n("span",{staticClass:"line-number"},[s._v("56")]),n("br"),n("span",{staticClass:"line-number"},[s._v("57")]),n("br"),n("span",{staticClass:"line-number"},[s._v("58")]),n("br"),n("span",{staticClass:"line-number"},[s._v("59")]),n("br"),n("span",{staticClass:"line-number"},[s._v("60")]),n("br"),n("span",{staticClass:"line-number"},[s._v("61")]),n("br"),n("span",{staticClass:"line-number"},[s._v("62")]),n("br"),n("span",{staticClass:"line-number"},[s._v("63")]),n("br"),n("span",{staticClass:"line-number"},[s._v("64")]),n("br"),n("span",{staticClass:"line-number"},[s._v("65")]),n("br"),n("span",{staticClass:"line-number"},[s._v("66")]),n("br"),n("span",{staticClass:"line-number"},[s._v("67")]),n("br"),n("span",{staticClass:"line-number"},[s._v("68")]),n("br"),n("span",{staticClass:"line-number"},[s._v("69")]),n("br"),n("span",{staticClass:"line-number"},[s._v("70")]),n("br"),n("span",{staticClass:"line-number"},[s._v("71")]),n("br"),n("span",{staticClass:"line-number"},[s._v("72")]),n("br"),n("span",{staticClass:"line-number"},[s._v("73")]),n("br"),n("span",{staticClass:"line-number"},[s._v("74")]),n("br"),n("span",{staticClass:"line-number"},[s._v("75")]),n("br"),n("span",{staticClass:"line-number"},[s._v("76")]),n("br"),n("span",{staticClass:"line-number"},[s._v("77")]),n("br"),n("span",{staticClass:"line-number"},[s._v("78")]),n("br"),n("span",{staticClass:"line-number"},[s._v("79")]),n("br")])]),n("blockquote",[n("p",[s._v("OK，到这里就完成了使用Let’s Encrypt免费证书的方法配置https协议，大家也可访问我的页面来查看效果，地址："),n("a",{attrs:{href:"https://www.sizegang.cn",target:"_blank",rel:"noopener noreferrer"}},[s._v("Memorydoc"),n("OutboundLink")],1),s._v("。\n下面是配置整数自动更新（Let’s Encrypt证书是有效期90天）")])]),s._v(" "),n("h2",{attrs:{id:"证书自动续期，实现真正的永久免费使用"}},[s._v("证书自动续期，实现真正的永久免费使用")]),s._v(" "),n("div",{staticClass:"language-sh line-numbers-mode"},[n("pre",{pre:!0,attrs:{class:"language-sh"}},[n("code",[n("span",{pre:!0,attrs:{class:"token function"}},[s._v("vim")]),s._v(" /home/sizegang/https/updatessl.sh    //创建一个名字为updatessl的脚本  这里你可以自定义路径\n")])]),s._v(" "),n("div",{staticClass:"line-numbers-wrapper"},[n("span",{staticClass:"line-number"},[s._v("1")]),n("br")])]),n("p",[s._v("然后在脚本里添加如下代码。")]),s._v(" "),n("div",{staticClass:"language-sh line-numbers-mode"},[n("pre",{pre:!0,attrs:{class:"language-sh"}},[n("code",[n("span",{pre:!0,attrs:{class:"token shebang important"}},[s._v("#!/bin/bash")]),s._v("\n"),n("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 我的updatessl.sh  文件和 letsencrypt文件在同一目录下，所以这样写，你们可以自定义目录，只要正确即可")]),s._v("\n"),n("span",{pre:!0,attrs:{class:"token assign-left variable"}},[n("span",{pre:!0,attrs:{class:"token environment constant"}},[s._v("PATH")])]),n("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v("/etc:/bin:/sbin:/usr/bin:/usr/sbin:/usr/local/bin:/usr/local/sbin\n/home/sizegang/https/letsencrypt/certbot-auto renew --force-renew --pre-hook "),n("span",{pre:!0,attrs:{class:"token string"}},[s._v('"service nginx stop"')]),s._v(" --post-hook "),n("span",{pre:!0,attrs:{class:"token string"}},[s._v('"service nginx start"')]),s._v("\n"),n("span",{pre:!0,attrs:{class:"token comment"}},[s._v("#第一行是指此脚本使用/bin/sh 来执行")]),s._v("\n"),n("span",{pre:!0,attrs:{class:"token comment"}},[s._v("#第二行中--force-renew参数代表强制更新")]),s._v("\n"),n("span",{pre:!0,attrs:{class:"token comment"}},[s._v("#重启ngiinx")]),s._v("\n")])]),s._v(" "),n("div",{staticClass:"line-numbers-wrapper"},[n("span",{staticClass:"line-number"},[s._v("1")]),n("br"),n("span",{staticClass:"line-number"},[s._v("2")]),n("br"),n("span",{staticClass:"line-number"},[s._v("3")]),n("br"),n("span",{staticClass:"line-number"},[s._v("4")]),n("br"),n("span",{staticClass:"line-number"},[s._v("5")]),n("br"),n("span",{staticClass:"line-number"},[s._v("6")]),n("br"),n("span",{staticClass:"line-number"},[s._v("7")]),n("br")])]),n("ul",[n("li",[n("code",[s._v("--pre-hook")]),s._v("\n前置钩子函数")]),s._v(" "),n("li",[n("code",[s._v("--post-hook")]),s._v("\n后置钩子函数")])]),s._v(" "),n("div",{staticClass:"danger custom-block"},[n("p",{staticClass:"custom-block-title"},[s._v("警告")]),s._v(" "),n("p",[s._v("在使用crontab 执行shell脚本的时候，会出现忽略命令的情况。解决方式:在sh脚本中加入 "),n("code",[s._v("PATH=/etc:/bin:/sbin:/usr/bin:/usr/sbin:/usr/local/bin:/usr/local/sbin")]),s._v("\n这时的shell脚本最好用绝对路径，避免出现因环境变量导致路径的不必要的问题")])]),s._v(" "),n("p",[s._v("退出并保存，然后给脚本添加可执行权限(这里的文件路径填写你自己的文件路径)")]),s._v(" "),n("div",{staticClass:"language-sh line-numbers-mode"},[n("pre",{pre:!0,attrs:{class:"language-sh"}},[n("code",[n("span",{pre:!0,attrs:{class:"token function"}},[s._v("chmod")]),s._v(" +x /home/sizegang/https/updatessl.sh\n")])]),s._v(" "),n("div",{staticClass:"line-numbers-wrapper"},[n("span",{staticClass:"line-number"},[s._v("1")]),n("br")])]),n("h2",{attrs:{id:"创建定时任务"}},[s._v("创建定时任务")]),s._v(" "),n("blockquote",[n("p",[s._v("打开crontab文件 执行命令： crontab -e")])]),s._v(" "),n("p",[s._v("然后在文件末尾添加一行内容： "),n("strong",[s._v("(我这里代表每月28号更新一次证书文件，文件路径填写你自己的文件路径 )")])]),s._v(" "),n("div",{staticClass:"language-sh line-numbers-mode"},[n("pre",{pre:!0,attrs:{class:"language-sh"}},[n("code",[n("span",{pre:!0,attrs:{class:"token number"}},[s._v("0")]),s._v("  "),n("span",{pre:!0,attrs:{class:"token number"}},[s._v("0")]),s._v("  "),n("span",{pre:!0,attrs:{class:"token number"}},[s._v("28")]),s._v(" *  * "),n("span",{pre:!0,attrs:{class:"token function"}},[s._v("sh")]),s._v(" /home/sizegang/https/updatessl.sh\n")])]),s._v(" "),n("div",{staticClass:"line-numbers-wrapper"},[n("span",{staticClass:"line-number"},[s._v("1")]),n("br")])]),n("p",[n("strong",[s._v("具体格式如下:")])]),s._v(" "),n("blockquote",[n("p",[s._v("Minute Hour Day Month Dayofweek command\n分钟 小时 天 月 天每星期 命令")])]),s._v(" "),n("p",[s._v("每个字段代表的含义如下：")]),s._v(" "),n("p",[s._v("Minute 每个小时的第几分钟执行该任务"),n("br"),s._v("\nHour 每天的第几个小时执行该任务"),n("br"),s._v("\nDay 每月的第几天执行该任务"),n("br"),s._v("\nMonth 每年的第几个月执行该任务"),n("br"),s._v("\nDayOfWeek 每周的第几天执行该任务"),n("br"),s._v("\nCommand 指定要执行的程序")]),s._v(" "),n("div",{staticClass:"tip custom-block"},[n("p",[s._v("在这些字段里，除了“Command”是每次都必须指定的字段以外，其它字段皆为可选字段，可视需要决定。对于不指定的字段，要用“*”来填补其位置。\n"),n("strong",[s._v("记得重启crontab服务哦。")]),s._v(" 好了，自动更新证书已经配置完了，再也不用担心证书过期啦！")])]),s._v(" "),n("h2",{attrs:{id:"附加"}},[s._v("附加")]),s._v(" "),n("h3",{attrs:{id:"crontab-常用命令"}},[s._v("crontab 常用命令")]),s._v(" "),n("ul",[n("li",[s._v("tail -f /var/log/cron 查看crontab 日志")]),s._v(" "),n("li",[s._v("service crond restart 重启crontab 服务")]),s._v(" "),n("li",[s._v("crontab -e 添加计划执行脚本")])])])},[],!1,null,null,null);t.default=e.exports}}]);