---
title: 类加解密 & 自定义类加载器
---

## 类加解密工具
```java  
package com.xiangxue.classloader;

import java.io.*;

/**
 * @version 1.0
 * @program: springTest
 * @description: 类的加解密工具
 * @author: Kevin
 * @create: 2019-09-10 14:00
 **/
public class EDClassUtils {

    ///异或操作， 可以进行加密、解密
    public void xor(InputStream inputStream, OutputStream outputStream) throws IOException {
        int ch;
        while (-1 != (ch = inputStream.read())){
            ch = ch^ 0xff;
            outputStream.write(ch);
        }
    }

    public void encrypt(File src, File dest) throws IOException {
        InputStream inputStream = new FileInputStream(src);
        OutputStream outputStream = new FileOutputStream(dest);
        try {
            xor(inputStream, outputStream);
        } catch (IOException e) {
            e.printStackTrace();
        }finally {
            inputStream.close();
            outputStream.close();
        }
    }

    //解密方法
    public byte[] decode(File src) throws IOException {
        InputStream inputStream = new FileInputStream(src);
        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        xor(inputStream, byteArrayOutputStream);
        byte[] data = byteArrayOutputStream.toByteArray();
        return data;
    }


    public static void main(String[] args) {
        EDClassUtils edClassUtils = new EDClassUtils();
        File src = new File("D:\\gitcloneTest\\springTest\\target\\classes\\com\\xiangxue\\io\\aio\\ServerEx.class");
        File dest = new File("D:\\gitcloneTest\\springTest\\target\\classes\\com\\xiangxue\\io\\aio\\Server.class");
        System.out.println("加密完成");
        try {
            edClassUtils.encrypt(src, dest);
        } catch (IOException e) {
            e.printStackTrace();
        }
        try {
            edClassUtils.decode(dest);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}

```

## 自定义类加载器
```java 
package com.xiangxue.classloader;

import java.io.File;
import java.io.IOException;

/**
 * @version 1.0
 * @program: springTest
 * @description: 自定义的类加载器
 * @author: Kevin
 * @create: 2019-09-10 14:02
 **/
public class CustomClassLoader extends ClassLoader {

    private String bashPath;
    private static final String FILE_EXT = ".class";

    public CustomClassLoader(String bashPath) {
        this.bashPath = bashPath;
    }

    @Override
    protected Class<?> findClass(String name) throws ClassNotFoundException {
        byte[] data = this.loadClassData(name);
        return this.defineClass(name, data, 0, data.length);
    }

    private byte[] loadClassData(String name) {
        byte[] data = null;
        EDClassUtils edClassUtils = new EDClassUtils();
        String tempName = name.replaceAll("\\.", "\\\\");
        try {
            data = edClassUtils.decode(new File(bashPath + tempName + FILE_EXT));
        } catch (IOException e) {
            e.printStackTrace();
        }
        return data;
    }
}

```

## 测试类
```java 
package com.xiangxue.classloader;

/**
 * @version 1.0
 * @program: springTest
 * @description:
 * @author: Kevin
 * @create: 2019-09-10 14:20
 **/
public class Test {
    public static void main(String[] args) {
        CustomClassLoader customClassLoader =new CustomClassLoader("D:\\gitcloneTest\\springTest\\target\\classes\\");
        try {
            Class<?> serverEx = customClassLoader.findClass("com.xiangxue.io.aio.Server");
            System.out.println(serverEx.getClassLoader());
            Object o = serverEx.newInstance();
            System.out.println(o);
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        } catch (IllegalAccessException e) {
            e.printStackTrace();
        } catch (InstantiationException e) {
            e.printStackTrace();
        }
    }
}

```
### 测试结果
```sh   
com.xiangxue.classloader.CustomClassLoader@63947c6b
com.xiangxue.io.aio.Server@355da254
```