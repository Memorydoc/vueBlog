---
title: docker 安装es 集群
---

## docker-compose.yml
```sh 
version: '3'
services:
     es-master:
       image:  elasticsearch:6.4.3
       container_name: es-master
       restart: always
       volumes:
         - ./master/data:/usr/share/elasticsearch/data
         - ./master/conf/elasticsearch.yml:/usr/share/elasticsearch/config/elasticsearch.yml
         - ./master/plugins:/usr/share/elasticsearch/plugins
         - ./master/logs:/user/share/elasticsearch/logs
       environment:
         - "ES_JAVA_OPTS=-Xms512m -Xmx512m"
       ports:
         - "9200:9200"
         - "9300:9300"

     es-node1:
       image:  elasticsearch:6.4.3
       container_name: es-node1
       restart: always
       volumes:
         - ./node1/data:/usr/share/elasticsearch/data
         - ./node1/conf/elasticsearch.yml:/usr/share/elasticsearch/config/elasticsearch.yml
         - ./node1/plugins:/usr/share/elasticsearch/plugins
         - ./node1/logs:/user/share/elasticsearch/logs
       environment:
         - "ES_JAVA_OPTS=-Xms512m -Xmx512m"
     es-node2:
       image:  elasticsearch:6.4.3
       container_name: es-node2
       restart: always
       volumes:
         - ./node2/data:/usr/share/elasticsearch/data
         - ./node2/conf/elasticsearch.yml:/usr/share/elasticsearch/config/elasticsearch.yml
         - ./node2/plugins:/usr/share/elasticsearch/plugins
         - ./node2/logs:/user/share/elasticsearch/logs
       environment:
         - "ES_JAVA_OPTS=-Xms512m -Xmx512m"
     # 下面是es-head 插件，可以不安装，可以直接在window down下来连接，相当于一个 mysql客户端，直接使用window的也行    
     #es-head:
       #image: tobias74/elasticsearch-head:6
       #container_name: es-head
       #restart: always
       #ports:
       #- "9100:9100"

     kibana:
       image: kibana:6.4.3
       container_name: kibana
       environment:
         - ELASTICSEARCH_HOSTS=http://es-master:9200
         # 需要将Kibana配置文件中的小写转换成大写，然后这个才能用于变量，才能被设置到
         - I18N_LOCALE=zh-CN
         - xpack.monitoring.ui.container.elasticsearch.enabled=false
       ports:
         - 5601:5601
       volumes:
         - ./kibana/conf/kibana.yml:/usr/share/kibana/config/kibana.yml

```
## master 节点的 配置文件 elasticsearch.yml
```sh 
bootstrap.memory_lock: false
cluster.name: "es-cluster"
node.name: es-master
node.master: true
node.data: false
network.host: 0.0.0.0
http.port: 9200
transport.tcp.port: 9300
discovery.zen.ping.unicast.hosts: 182.92.153.190:9300, 182.92.153.190:9301, 182.92.153.190:9302"
discovery.zen.minimum_master_nodes: 1

path.logs: /usr/share/elasticsearch/logs
http.cors.enabled: true
http.cors.allow-origin: "*"
xpack.security.audit.enabled: true

```

## node1 节点的 配置文件 elasticsearch.yml
```sh  
cluster.name: "es-cluster"
node.name: node1
node.master: false
node.data: true
network.host: 0.0.0.0
network.publish_host: 0.0.0.0
network.bind_host: 0.0.0.0
http.port: 9201
transport.tcp.port: 9301
discovery.zen.ping.unicast.hosts: 182.92.153.190:9300, 182.92.153.190:9301, 182.92.153.190:9302

path.logs: /usr/share/elasticsearch/logs

```

## node2 节点的配置文件 elasticsearch.yml
```sh  
cluster.name: "es-cluster"
node.name: node2
node.master: false
node.data: true
network.host: 0.0.0.0
http.port: 9202
transport.tcp.port: 9302
discovery.zen.ping.unicast.hosts: 182.92.153.190:9300, 182.92.153.190:9301, 182.92.153.190:9302

path.logs: /usr/share/elasticsearch/logs

```

## kibana.yml
```sh 
server.host: "0.0.0.0"
elasticsearch.url: http://182.92.153.190:9200
xpack:
  apm.ui.enabled: false
  graph.enabled: false
  ml.enabled: false
  monitoring.enabled: false
  reporting.enabled: false
  security.enabled: false
  grokdebugger.enabled: false
  searchprofiler.enabled: false

```
