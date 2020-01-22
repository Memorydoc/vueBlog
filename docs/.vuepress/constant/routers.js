const pwcUtil = require('../utils/pwcUtils');

module.exports = {
    //['synchronized', 'volatile', 'Atomic', "Lock", 'ReentrantLock', 'collection', 'comprehensive']
    current: pwcUtil.getFileNameArray("/home/backendtechnology/current"),
    deploy: pwcUtil.getFileNameArray("/home/backendtechnology/deploy"),
    deployplatform: pwcUtil.getFileNameArray("/home/backendtechnology/deploy/deployplatform"),
    other: pwcUtil.getFileNameArray("/home/openuphorizons/other"),//技术拓展
    trap: pwcUtil.getFileNameArray("/home/openuphorizons/trap"),//技术陷阱
    interview: pwcUtil.getFileNameArray("/home/openuphorizons/interview"),//面试宝典
    java: pwcUtil.getFileNameArray("/home/backendtechnology/java"),//JAVA
    microservice: pwcUtil.getFileNameArray("/home/backendtechnology/microservice"),//微服务
    middleware: pwcUtil.getFileNameArray("/home/backendtechnology/middleware"),//中间件
    database: pwcUtil.getFileNameArray("/home/backendtechnology/database"),//数据库
    vue: pwcUtil.getFileNameArray("/home/fronttechnology/vue"),//VUE权威指南
    ownstudy: pwcUtil.getFileNameArray("/home/fronttechnology/vue/ownstudy"),//vue个人阅读
    javascript: pwcUtil.getFileNameArray("/home/fronttechnology/javascript"),//javascript指南
    spring: pwcUtil.getFileNameArray("/home/backendtechnology/frame/spring"),//spring框架
    design: pwcUtil.getFileNameArray("/home/backendtechnology/design"),//设计模式
    datastructure: pwcUtil.getFileNameArray("/home/backendtechnology/datastructure"),//数据结构算法
    dockerinstall: pwcUtil.getFileNameArray("/home/backendtechnology/deploy/dockerinstall"),//设计模式
    home: pwcUtil.getFileNameArray("/home/"),//指南
    cloud: pwcUtil.getFileNameArray("/home/cloud/cloud2.0"),//指南

}
