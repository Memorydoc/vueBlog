const pwcUtil = require('../utils/pwcUtils');

module.exports = {
    //['synchronized', 'volatile', 'Atomic', "Lock", 'ReentrantLock', 'collection', 'comprehensive']
    current: pwcUtil.getFileNameArray("/backendtechnology/current"),
    deploy: pwcUtil.getFileNameArray("/backendtechnology/deploy"),
    deployplatform: pwcUtil.getFileNameArray("/backendtechnology/deploy/deployplatform"),
    other: pwcUtil.getFileNameArray("/openuphorizons/other"),//技术拓展
    trap: pwcUtil.getFileNameArray("/openuphorizons/trap"),//技术陷阱
    interview: pwcUtil.getFileNameArray("/openuphorizons/interview"),//面试宝典
    java: pwcUtil.getFileNameArray("/backendtechnology/java"),//JAVA
    microservice: pwcUtil.getFileNameArray("/backendtechnology/microservice"),//微服务
    middleware: pwcUtil.getFileNameArray("/backendtechnology/middleware"),//中间件
    database: pwcUtil.getFileNameArray("/backendtechnology/database"),//数据库
    vue: pwcUtil.getFileNameArray("/fronttechnology/vue"),//VUE权威指南
    ownstudy: pwcUtil.getFileNameArray("/fronttechnology/vue/ownstudy"),//vue个人阅读
    javascript: pwcUtil.getFileNameArray("/fronttechnology/javascript"),//javascript指南
    spring: pwcUtil.getFileNameArray("/backendtechnology/frame/spring"),//spring框架
    design: pwcUtil.getFileNameArray("/backendtechnology/design"),//设计模式
    dockerinstall: pwcUtil.getFileNameArray("/backendtechnology/deploy/dockerinstall"),//设计模式


}