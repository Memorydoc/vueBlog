---
title: RPC实现原理
---
* 现在有一个场景就是不同JVM（进程）之间（也可以说成是两个服务），A服务想调用B服务的方法
> 首先想到两个服务之间应该有一个桥梁接通双方
## JAVA语言实现
 (1)Java 自带的序列化，在服务提供方序列化，在消费方反序列化      
 (2)使用Socket编程 ->**RMI框架**应运而生      
## 跨语言实现
>假设上方情景两个服务之间跨语言      

(1) 序列化成XML 文件    
(2) 通过通用的HTTP协议传输xml文件  -> **webservice** 应运而生，解决跨语言之间的传输     
::: warning 
 但是xml方式，文件较大，局限于网络带宽，传输效率较低。 然后应运而生的就是 序列化成json 
 即HTTP+JSON 的方式 
:::

* 为了解决以上的远程方法调用。好事之者站了出来，实现了各种框架解决这个问题，进而 RPC(Remote Procedure Call) 应运而生

## 基于Socket 手写一个RPC框架（使用代理模式）


### 创建rpc-provider 项目
#### pom.xml
```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>rpc-provider</groupId>
    <artifactId>rpc-provider</artifactId>
    <version>1.0</version>
    <packaging>jar</packaging>
</project>
```
#### 创建远程调用接口
```java 
package provider;

/**
 * @version 1.0
 * @program: springTest
 * @description:
 * @author: Kevin
 * @create: 2019-09-05 22:22
 **/

public interface IRpcService {
    String sayHello(String txt);
}

```

#### 创建服务注解
```java 
package provider;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * @version 1.0
 * @program: springTest
 * @description: 该注解是服务发布的注解
 * @author: Kevin
 * @create: 2019-09-05 22:37
 **/
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
public @interface KevinRpc {


    /**
     * 对外发布服务的接口
     *
     * @return
     */
    Class<?> value();

    /**
     * 版本，用来区分不同版本
     * @return
     */
    String version() default "";
}

```

#### 创建统一传输对象
```java 
package provider;

import java.io.Serializable;

/**
 * @version 1.0
 * @program: springTest
 * @description: 统一传输对象
 * @author: Kevin
 * @create: 2019-09-05 22:55
 **/
public class RpcRequest   implements Serializable {
    private String className;
    private String methodName;
    private Object[] parameters;

    public String getClassName() {
        return className;
    }

    public void setClassName(String className) {
        this.className = className;
    }

    public String getMethodName() {
        return methodName;
    }

    public void setMethodName(String methodName) {
        this.methodName = methodName;
    }

    public Object[] getParameters() {
        return parameters;
    }

    public void setParameters(Object[] parameters) {
        this.parameters = parameters;
    }
}

```
### 创建 rpc-server项目
#### pom.xml
```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>rpc-server</groupId>
    <artifactId>rpc-server</artifactId>
    <version>1.0</version>
    <packaging>jar</packaging>

    <dependencies>
        <dependency>
            <groupId>rpc-provider</groupId>
            <artifactId>rpc-provider</artifactId>
            <version>1.0</version>
        </dependency>

    </dependencies>

</project>
```
#### RpcServer
```java 
package com.rpc.server;

import provider.KevinRpc;

import java.io.IOException;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/**
 * @version 1.0
 * @program: springTest
 * @description:
 * @author: Kevin
 * @create: 2019-09-05 22:35
 **/
public class RpcServer {


    private Map<String, Object> serviceMap = new HashMap();// 保存绑定到服务器上的service服务



    private String address;// 服务发布地址


    public RpcServer(String address) {
        this.address = address;
    }

    private ExecutorService executorService = Executors.newCachedThreadPool();

    public void publisher() {// 发布服务，
        int port = Integer.parseInt(address.split(":")[1]); // 获取客户端请求的端口
        Socket socket = null;
        try {
            ServerSocket serverSocket = new ServerSocket(port);
            while (true) {
                socket = serverSocket.accept();//监听客户端请求，如果没有客户端请求，则阻塞
                executorService.execute(new ProcessorHandler(socket, serviceMap));
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (socket != null) {
                try {
                    socket.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
    }


    public void bind(Object... services) {
        for (Object service : services) {
            //绑定的服务，必须添加KevinRpc注解，否则无法绑定
            KevinRpc annotation = service.getClass().getAnnotation(KevinRpc.class);//如果服务上添加了这个注解，说明注册了服务
            if (annotation == null)
                continue;
            //发布接口的class
            String serviceName = annotation.value().getName();
            serviceMap.put(serviceName, service);

        }
    }
}

```

#### 服务处理方法 **ProcessorHandler**
```java 
package com.rpc.server;

import provider.RpcRequest;

import java.io.*;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.net.Socket;
import java.util.Map;

/**
 * @version 1.0
 * @program: springTest
 * @description: 使用反射执行服务方法, 因为是开启线程池执行的，所以这里要实现Runnable
 * @author: Kevin
 * @create: 2019-09-05 22:43
 **/
public class ProcessorHandler implements Runnable {


    private Socket socket;

    /**
     * 服务端发布的服务
     */
    private Map<String, Object> serviceMap;

    public ProcessorHandler(Socket socket, Map<String, Object> serviceMap) {
        this.socket = socket;
        this.serviceMap = serviceMap;
    }

    public void run() {
        ObjectInputStream objectInputStream = null;
        InputStream inputStream = null;
        try {
            objectInputStream = new ObjectInputStream(socket.getInputStream());
            RpcRequest rpcRequest = (RpcRequest) objectInputStream.readObject();
            Object result = invoke(rpcRequest);
            //将结果返回给客户端
            ObjectOutputStream objectOutputStream = new ObjectOutputStream(socket.getOutputStream());
            objectOutputStream.writeObject(result);
            objectOutputStream.flush();
            objectInputStream.close();
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (objectInputStream != null) {
                try {
                    objectInputStream.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
            if (inputStream != null) {
                try {
                    inputStream.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
    }

    /**
     * 使用反射执行 服务方法
     */
    public Object invoke(RpcRequest request) {
        System.out.println("------服务端开始调用------");
        String className = request.getClassName();
        String methodName = request.getMethodName();
        Object[] parameters = request.getParameters();
        Class[] parameterTypes = new Class[parameters.length];

        for (int i = 0; i < parameters.length; i++) {
            parameterTypes[i] = parameters[i].getClass();
        }
        try {
            Object service = serviceMap.get(className);// 获取到具体的service
            Method method = service.getClass().getMethod(methodName, parameterTypes);
            return method.invoke(service, parameters);//执行具体的方法
        } catch (NoSuchMethodException e) {
            e.printStackTrace();
        } catch (IllegalAccessException e) {
            e.printStackTrace();
        } catch (InvocationTargetException e) {
            e.printStackTrace();
        }
        return null;

    }
}

```

#### 服务启动类
```java 
package com.rpc.server;

import provider.IRpcService;

/**
 * @version 1.0
 * @program: springTest
 * @description:
 * @author: Kevin
 * @create: 2019-09-05 23:08
 **/
public class RpcServerTest {
    public static void main(String[] args) {
        RpcServer rpcServer = new RpcServer("localhost:8888");//将8888端口绑定服务
        rpcServer.bind(new RpcServiceImpl());
        rpcServer.publisher();
    }
}
```

#### 服务测试方法
```java 
package com.rpc.server;

import provider.IRpcService;
import provider.KevinRpc;

/**
 * @version 1.0
 * @program: springTest
 * @description:
 * @author: Kevin
 * @create: 2019-09-05 22:23
 **/
@KevinRpc(value = IRpcService.class)// 这里必须是接口的名字， 在 客户端那里只能使用接口调用，所以这里要使用接口的名字
public class RpcServiceImpl implements IRpcService {

    public String sayHello(String txt) {
        System.out.println("远程调用成功");
        return "hello rpc " + txt;
    }
}
```

### 创建 rpc-client
#### pom.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>rpc-client</groupId>
    <artifactId>rpc-client</artifactId>
    <version>1.0</version>
    <packaging>jar</packaging>
    <dependencies>
        <dependency>
            <groupId>rpc-provider</groupId>
            <artifactId>rpc-provider</artifactId>
            <version>1.0</version>
        </dependency>

    </dependencies>
</project>
```
#### 创建RpcClient 启动类
```java 
package com.pwc.client;

import provider.IRpcService;

/**
 * @version 1.0
 * @program: springTest
 * @description:
 * @author: Kevin
 * @create: 2019-09-05 22:25
 **/
public class RpcClient {


    public static void main(String[] args) {
        RpcClientProxy rpcClientProxy = new RpcClientProxy("localhost:8888");
        IRpcService service = (IRpcService) rpcClientProxy.send(IRpcService.class);
        System.out.println(service.sayHello("哈哈哈哈"));
    }
}

```

#### 客户端代理类
```java  
package com.pwc.client;
import java.lang.reflect.Proxy;

/**
 * @version 1.0
 * @program: springTest
 * @description: rpc客户端代理类
 * @author: Kevin
 * @create: 2019-09-05 23:14
 **/
public class RpcClientProxy {
    private String address;

    public RpcClientProxy(String address) {
        this.address = address;
    }

    public Object send(Class clz) {
        return  Proxy.newProxyInstance(clz.getClassLoader(), new Class[]{clz}, new RpcClientHandler(address));
    }
}
```

#### 代理执行类
```java 
package com.pwc.client;

import provider.RpcRequest;

import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.lang.reflect.InvocationHandler;
import java.lang.reflect.Method;
import java.net.Socket;

/**
 * @version 1.0
 * @program: springTest
 * @description:
 * @author: Kevin
 * @create: 2019-09-05 23:39
 **/
public class RpcClientHandler implements InvocationHandler {
    private String address;

    public RpcClientHandler(String address) {
        this.address = address;
    }

    /**
     * 序列化数据 发送给服务端
     * @param client
     * @param method
     * @param args
     * @return 返回服务端响应的数据
     * @throws Throwable
     */
    public Object invoke(Object client, Method method, Object[] args) throws Throwable {
        String ip = null;
        int port = 0;
        try {
            ip = address.split(":")[0];
            port = Integer.parseInt(address.split(":")[1]);
        } catch (Exception ex) {
            ex.printStackTrace();
            System.out.println("请求地址配置错误");
        } finally {

        }
        Socket socket = null;
        ObjectOutputStream objectOutputStream = null;
        ObjectInputStream objectInputStream = null;
        try {
            socket = new Socket(ip, port);
            objectOutputStream = new ObjectOutputStream(socket.getOutputStream());
            RpcRequest rpcRequest = new RpcRequest();
            rpcRequest.setClassName(method.getDeclaringClass().getName());
            rpcRequest.setMethodName(method.getName());
            rpcRequest.setParameters(args);
            objectOutputStream.writeObject(rpcRequest);
            objectOutputStream.flush();
            //获取返回数据
            objectInputStream = new ObjectInputStream(socket.getInputStream());
            return objectInputStream.readObject();

        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (objectOutputStream != null) {
                objectOutputStream.close();
            }
            if (objectInputStream != null) {
                objectInputStream.close();
            }
            if (socket != null) {
                socket.close();
            }
        }
        return null;
    }
}

```


### RPC远程调用测试
* 先启动服务端
```sh 
E:\java\jdk1.8\bin\java.exe "
```
控制台会在这里等待，等待远程服务的调用

* 启动服务消费者 调用服务 (这里是启动上面的 <code>RpcClient</code> 类)
 ```sh 
 hello rpc kevin
 ```
 
 * 再回来看服务端控制台
 ```sh 
 ------服务端开始调用------
 远程调用成功
 ```

## 基于Netty的 注册中心

## Dubbo底层原理



