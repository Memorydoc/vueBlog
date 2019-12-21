---
title: new-backend 项目结构
---
## 项目依赖结构



* atms-api ： 实体类，枚举，Dto
* atms-common ： 公共配置，顶级接口，工具类。 依赖于： atms-api
* atms-assemble： 项目启动模块，存放项目启动相关配置，包括 SpringSecurity 和SwaggerConfig； 依赖atms-web、atms-mq
* atms-base-biz： ServiceImpl层服务; 依赖： amts-api、atms-dal
* atms-dal ： Dao（Mapper）层服务，包括： Mapper、BeanExample
* amts-mq： RabbitMq 服务
* atms-web：控制层服务。包括Controller接口请求控制器、具体权限控制；依赖: 业务-biz

>atms-assembel -> atms-web -> 具体业务的biz (配合 atms-api 实体类层) -> atms-dal

::: warning 小提示
带有biz后缀的模块，都是不同业务模块对应服务层（ServiceImpl层）
项目去掉了service接口层，通过直接继承共用的BaseService来设计（BaseService在atms-common模块中）
:::
## 附加
**因为公司产品代码，具体代码未开放，对您造成的不便，请谅解**