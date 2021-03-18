(window.webpackJsonp=window.webpackJsonp||[]).push([[187],{460:function(v,_,t){"use strict";t.r(_);var s=t(10),i=Object(s.a)({},function(){var v=this,_=v.$createElement,t=v._self._c||_;return t("ContentSlotsDistributor",{attrs:{"slot-key":v.$parent.slotKey}},[t("h2",{attrs:{id:"前端优化手段"}},[v._v("前端优化手段")]),v._v(" "),t("h4",{attrs:{id:"减少前端js-css-请求数"}},[v._v("减少前端js css 请求数")]),v._v(" "),t("p",[v._v("合并css js 图片")]),v._v(" "),t("h4",{attrs:{id:"使用客户端缓冲"}},[v._v("使用客户端缓冲")]),v._v(" "),t("p",[v._v("静态资源缓存在浏览器上，  通过设 "),t("code",[v._v("Cache-Control")]),v._v(" 和 "),t("code",[v._v("Expires")])]),v._v(" "),t("h4",{attrs:{id:"启用压缩"}},[v._v("启用压缩")]),v._v(" "),t("p",[v._v("在服务端压缩， 在客户端解压缩\n但是会对浏览器和服务器上都会带来性能上的压力， 所以这个压缩需要权衡")]),v._v(" "),t("h4",{attrs:{id:"资源文件加载顺序"}},[v._v("资源文件加载顺序")]),v._v(" "),t("p",[v._v("Css 放在最上面， 先渲染界面， js放在下面，如果js比较复杂，将阻塞界面渲染， 最好是将js放在最下面。")]),v._v(" "),t("h4",{attrs:{id:"减少-cookie-传输"}},[v._v("减少 Cookie 传输")]),v._v(" "),t("p",[v._v("每次请求 cookie都会在浏览器和服务器 进行传输，如果cookie过大，将会加大传输压力")]),v._v(" "),t("h4",{attrs:{id:"给用户一个提示"}},[v._v("给用户一个提示")]),v._v(" "),t("p",[v._v("当浏览器或者 服务器在进行某种操作的时候，最好给用户一个提示，这样用户会有更好的体验")]),v._v(" "),t("h3",{attrs:{id:"cdn-加速"}},[v._v("CDN 加速")]),v._v(" "),t("p",[v._v("静态文件的CDN加速")]),v._v(" "),t("h3",{attrs:{id:"反向代理缓存"}},[v._v("反向代理缓存")]),v._v(" "),t("p",[v._v("直接通过nginx 将静态资源反向代理返回给 客户端，都不需要将静态资源加载到服务器")]),v._v(" "),t("h3",{attrs:{id:"web-组件分离"}},[v._v("WEB 组件分离")]),v._v(" "),t("p",[v._v("将静态资源 设置不同域名放置在不同服务器上，因为浏览器针对于相同域名 下载资源的时候，受限于最大资源数的限制， 限制了浏览器的下载速度\n如果 将 img 部署在  img.com 域名下， 将 js 部署在 js 域名下，等等，将大大加快浏览器下载静态资源的速度")]),v._v(" "),t("h2",{attrs:{id:"后端优化"}},[v._v("后端优化")]),v._v(" "),t("h3",{attrs:{id:"缓存"}},[v._v("缓存")]),v._v(" "),t("p",[v._v("网站性能优化第一定律： 优先使用缓存优化性能")]),v._v(" "),t("h4",{attrs:{id:"缓存的基本原理和本质"}},[v._v("缓存的基本原理和本质")]),v._v(" "),t("ul",[t("li",[v._v("频繁修改的数据，尽量不要缓存")]),v._v(" "),t("li",[v._v("缓存一定是热点数据，做不到将所有数据缓存， 缓存是在内存中缓存，缓存是比较昂贵的")]),v._v(" "),t("li",[v._v("使用缓存就要容忍一定时间的数据不一致（最终一致性）")]),v._v(" "),t("li",[v._v("缓存可用性问题： 使用集群 使缓存高可用")]),v._v(" "),t("li",[v._v("缓存预热： 缓存系统突然启动后，会对数据库压力增大，可以提前将一些热点数据提前缓存")]),v._v(" "),t("li",[v._v("缓存击穿： 持续高并发访问缓存中不存在的数据，会直接访问 数据库，给数据库造成较大的压力\n解决方法\n1.使用布隆过滤器（布隆过滤器将 访问的数据 通过不同的HASH算法， 分布到一个数组中， 不同的算法映射到不同的位置，布隆过滤器有一个特点\n就是： 布隆过滤器判断存在的 数据在 不一定存在，但是 判断"),t("strong",[v._v("不存在的")]),v._v(" 一定是"),t("strong",[v._v("不存在")]),v._v("）\n2. 持续访问 多次（三次） 不存在的数据， 如果缓存和数据库中都不存在，那么在缓存中造一条当前数据缓存，防止缓存击穿")])]),v._v(" "),t("h4",{attrs:{id:"分布式缓存与一致性哈希"}},[v._v("分布式缓存与一致性哈希")]),v._v(" "),t("p",[v._v("如果使用缓存集群，但是 如果仅仅使用一个一个服务器并排的 缓存， 会")]),v._v(" "),t("h2",{attrs:{id:"异步"}},[v._v("异步")]),v._v(" "),t("h4",{attrs:{id:"同步和异步，-阻塞和非阻塞"}},[v._v("同步和异步， 阻塞和非阻塞")]),v._v(" "),t("p",[v._v("同步阻塞： BIO编程\n同步非阻塞： NIO 编程\n异步非阻塞： AIO 编程")]),v._v(" "),t("p",[v._v("将消息发送到消息中间件（消息队列）， 主线程直接返回， 异步发送通知消息。(短信，邮件 等等)")]),v._v(" "),t("h2",{attrs:{id:"集群"}},[v._v("集群")]),v._v(" "),t("p",[v._v("单个服务器 在并发访问的时候， 压力过大， 并发量编程， 系统吞吐量和系统性能 会逐渐降低。 这时候引入集群，将压力分摊到多个服务器上。有利于提高系统吞吐量和性能")]),v._v(" "),t("h2",{attrs:{id:"代码级别"}},[v._v("代码级别")]),v._v(" "),t("h4",{attrs:{id:"选择合适的数据结构"}},[v._v("选择合适的数据结构")]),v._v(" "),t("p",[v._v("比如说： 在大循环中尽量不要使用"),t("code",[v._v("ArrayList")]),v._v(" ，因为会出现扩容问题")]),v._v(" "),t("h4",{attrs:{id:"选择合适的算法"}},[v._v("选择合适的算法")]),v._v(" "),t("p",[v._v("比如说： 在排序的方法中， 选择最合适的排序算法")]),v._v(" "),t("h4",{attrs:{id:"编写最少的代码"}},[v._v("编写最少的代码")]),v._v(" "),t("p",[v._v("比如说： 减少代码中不必要的部分")]),v._v(" "),t("h2",{attrs:{id:"并发编程"}},[v._v("并发编程")]),v._v(" "),t("h4",{attrs:{id:"充分利用cpu多核，尽量使用线程池，-合理设置线程数量，尽量使用jdk自带的并发工具"}},[v._v("充分利用CPU多核，尽量使用线程池， 合理设置线程数量，尽量使用JDK自带的并发工具")]),v._v(" "),t("h4",{attrs:{id:"实现线程安全的类，避免线程安全问题"}},[v._v("实现线程安全的类，避免线程安全问题")]),v._v(" "),t("h4",{attrs:{id:"同步下减少锁的竞争"}},[v._v("同步下减少锁的竞争")]),v._v(" "),t("ul",[t("li",[v._v("缩小锁的范围，缩小锁的粒度， 锁分段（"),t("code",[v._v("CurrentHashMap")]),v._v("）")]),v._v(" "),t("li",[v._v("替换独占锁， 读写锁， "),t("code",[v._v("CAS")]),v._v("代替锁，"),t("code",[v._v("ThreadLocal")]),v._v(" 等等")])]),v._v(" "),t("h2",{attrs:{id:"资源复用"}},[v._v("资源复用")]),v._v(" "),t("p",[v._v("减少开销很大的系统资源的创建和销毁")]),v._v(" "),t("h4",{attrs:{id:"单例模式"}},[v._v("单例模式")]),v._v(" "),t("h4",{attrs:{id:"池化技术"}},[v._v("池化技术")]),v._v(" "),t("p",[v._v("比如： 数据库连接池中的连接都是比较昂贵的资源，使用完要释放，方便其他线程获取使用")])])},[],!1,null,null,null);_.default=i.exports}}]);