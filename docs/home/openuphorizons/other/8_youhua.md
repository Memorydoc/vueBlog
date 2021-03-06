---
title: 优化web 项目性能
---
## 前端优化手段
#### 减少前端js css 请求数
合并css js 图片

#### 使用客户端缓冲
静态资源缓存在浏览器上，  通过设 <code>Cache-Control</code> 和 <code>Expires</code>

#### 启用压缩
在服务端压缩， 在客户端解压缩
但是会对浏览器和服务器上都会带来性能上的压力， 所以这个压缩需要权衡

#### 资源文件加载顺序
Css 放在最上面， 先渲染界面， js放在下面，如果js比较复杂，将阻塞界面渲染， 最好是将js放在最下面。

#### 减少 Cookie 传输
每次请求 cookie都会在浏览器和服务器 进行传输，如果cookie过大，将会加大传输压力

#### 给用户一个提示
当浏览器或者 服务器在进行某种操作的时候，最好给用户一个提示，这样用户会有更好的体验

### CDN 加速
静态文件的CDN加速

### 反向代理缓存
直接通过nginx 将静态资源反向代理返回给 客户端，都不需要将静态资源加载到服务器

### WEB 组件分离

将静态资源 设置不同域名放置在不同服务器上，因为浏览器针对于相同域名 下载资源的时候，受限于最大资源数的限制， 限制了浏览器的下载速度
如果 将 img 部署在  img.com 域名下， 将 js 部署在 js 域名下，等等，将大大加快浏览器下载静态资源的速度   


## 后端优化
###  缓存
网站性能优化第一定律： 优先使用缓存优化性能
#### 缓存的基本原理和本质
* 频繁修改的数据，尽量不要缓存
* 缓存一定是热点数据，做不到将所有数据缓存， 缓存是在内存中缓存，缓存是比较昂贵的
* 使用缓存就要容忍一定时间的数据不一致（最终一致性）
* 缓存可用性问题： 使用集群 使缓存高可用
* 缓存预热： 缓存系统突然启动后，会对数据库压力增大，可以提前将一些热点数据提前缓存
* 缓存击穿： 持续高并发访问缓存中不存在的数据，会直接访问 数据库，给数据库造成较大的压力 
    解决方法
    1.使用布隆过滤器（布隆过滤器将 访问的数据 通过不同的HASH算法， 分布到一个数组中， 不同的算法映射到不同的位置，布隆过滤器有一个特点
    就是： 布隆过滤器判断存在的 数据在 不一定存在，但是 判断**不存在的** 一定是**不存在**）
    2. 持续访问 多次（三次） 不存在的数据， 如果缓存和数据库中都不存在，那么在缓存中造一条当前数据缓存，防止缓存击穿
#### 分布式缓存与一致性哈希

如果使用缓存集群，但是 如果仅仅使用一个一个服务器并排的 缓存， 会

## 异步
 #### 同步和异步， 阻塞和非阻塞
 同步阻塞： BIO编程
 同步非阻塞： NIO 编程
 异步非阻塞： AIO 编程
 
 将消息发送到消息中间件（消息队列）， 主线程直接返回， 异步发送通知消息。(短信，邮件 等等)
## 集群
单个服务器 在并发访问的时候， 压力过大， 并发量编程， 系统吞吐量和系统性能 会逐渐降低。 这时候引入集群，将压力分摊到多个服务器上。有利于提高系统吞吐量和性能

## 代码级别
#### 选择合适的数据结构
比如说： 在大循环中尽量不要使用<code>ArrayList</code> ，因为会出现扩容问题
#### 选择合适的算法
比如说： 在排序的方法中， 选择最合适的排序算法
#### 编写最少的代码
比如说： 减少代码中不必要的部分

## 并发编程
#### 充分利用CPU多核，尽量使用线程池， 合理设置线程数量，尽量使用JDK自带的并发工具
#### 实现线程安全的类，避免线程安全问题
#### 同步下减少锁的竞争
* 缩小锁的范围，缩小锁的粒度， 锁分段（<code>CurrentHashMap</code>）
* 替换独占锁， 读写锁， <code>CAS</code>代替锁，<code>ThreadLocal</code> 等等

 
 
 ## 资源复用
 减少开销很大的系统资源的创建和销毁
 
 #### 单例模式
 #### 池化技术 
 比如： 数据库连接池中的连接都是比较昂贵的资源，使用完要释放，方便其他线程获取使用
 