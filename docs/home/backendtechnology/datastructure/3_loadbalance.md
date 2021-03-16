---
title: 负载均衡算法
---

::: warning 
 包含 **简单轮训算法** **加权轮训**  **随机算法** **加权随机**  **源地址HASH算法**
:::

```java   
package com.pwc.loadbalance;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

public class LoadBalanceTest {
    private static Map<String, Integer> serviceWeightMap = new ConcurrentHashMap<>();

    static {
        serviceWeightMap.put("192.168.1.100", 1);
        serviceWeightMap.put("192.168.1.101", 1);
        serviceWeightMap.put("192.168.1.102", 4);
        serviceWeightMap.put("192.168.1.103", 1);
        serviceWeightMap.put("192.168.1.104", 1);
        serviceWeightMap.put("192.168.1.105", 3);
        serviceWeightMap.put("192.168.1.106", 1);
        serviceWeightMap.put("192.168.1.107", 2);
        serviceWeightMap.put("192.168.1.108", 1);
        serviceWeightMap.put("192.168.1.109", 1);
        serviceWeightMap.put("192.168.1.110", 1);
    }
    //简单轮训算法
    private static Integer pos = 0;
    public String roundRobin(){
        String server = null;
        List<String> list = new ArrayList<>();
        Set<String> keySet = serviceWeightMap.keySet();
        list.addAll(keySet);
        synchronized (pos){
            if(pos > keySet.size()){
                pos = 0;
            }
            server = list.get(pos);
            pos++;
        }
        return server;
    }

    //  加权轮训法
    public String weightRobin(){
        List<String> serverList  = new ArrayList<>();
        Set<String> keySet = serviceWeightMap.keySet();
        Iterator<String> it = keySet.iterator();
        while (it.hasNext()){
            String server = it.next();
            int weight = serviceWeightMap.get(server);
            for(int i = 0; i< weight; i++){
                serverList.add(server);
            }
        }
        String server = null;
        synchronized (pos) {
            if (pos > serverList.size()) {
                pos = 0;
            }
            server = serverList.get(pos);
            pos++;
        }
        return server;
    }

    //源地址哈希法  该方法是对客户端的IP地址做一个Hash，然后对服务器列表的大小取模，得到处理该请求的服务器
    public static String consumerHash(String remoteIp) {
        Set<String> keySet = serviceWeightMap.keySet();
        ArrayList<String> keyList = new ArrayList<String>();
        keyList.addAll(keySet);

        int hashCode = remoteIp.hashCode();
        int pos = hashCode % keyList.size();

        return keyList.get(pos);
    }

    // 随机算法
    public static String testRandom() {
        Set<String> keySet = serviceWeightMap.keySet();
        ArrayList<String> keyList = new ArrayList<String>();
        keyList.addAll(keySet);

        Random random = new Random();
        int randomPos = random.nextInt(keyList.size());
        String server = keyList.get(randomPos);
        return server;
    }
    //加权随机算法
    public static String weightRandom() {
        Set<String> keySet = serviceWeightMap.keySet();
        List<String> serverList = new ArrayList<String>();
        Iterator<String> it = keySet.iterator();

        while (it.hasNext()) {
            String server = it.next();
            Integer weight = serviceWeightMap.get(server);
            for (int i = 0; i < weight; i++) {
                serverList.add(server);
            }
        }
        Random random = new Random();
        int randomPos = random.nextInt(serverList.size());
        String server = serverList.get(randomPos);
        return server;
    }


}

```