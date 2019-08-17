---
title: SpringBoot 引入 spring-boot-starter-logging 日志冲突
---
错误信息: **springboot application提示“LoggerFactory is not a Logback LoggerContext but Logback is on the classpath”**

::: danger 错误解析
springboot application后（打包成war包部署)，提示如上错误。根据下面的堆栈错误原因， 可知slf4j 提供的LoggerFactory 并没有使用Logback 上下文， 但是logback的库被引入到了我们的工程里。 这时候springboot 应用启动的时候， spring框架广播了一个事件， LoggingApplicationListener 侦听到了该事件后，启动了检查工作，发现logback并没有启用， 报了如上错误。 查看如此解决办法可以想到有2个办法。 1）  移除logback 包 ， 错误里也提示的比较明确， 使用默认的 log4j 管理日志打印。（因为错误已经明确提示告诉我们，org.apache.logging.slf4j.Log4jLoggerFactory 被默认加载了。 ） 
:::
## 移除logback
```xml 
<dependency>
 <groupId>org.springframework.boot</groupId>
 <artifactId>spring-boot-starter-web</artifactId>
        <exclusions>
        <exclusion>
            <groupId>ch.qos.logback</groupId>
            <artifactId>logback-classic</artifactId>
        </exclusion>
    </exclusions>
 </dependency>
```
## 移除log4j
```xml 
<dependency>
 <groupId>org.springframework.boot</groupId>
 <artifactId>spring-boot-starter-web</artifactId>
        <exclusions>
        <exclusion>
            <groupId>org.slf4j</groupId>
            <artifactId>og4j-over-slf4j</artifactId>
        </exclusion>
    </exclusions>
 </dependency>
```