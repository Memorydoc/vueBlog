const pwcUtil = require('../utils/pwcUtils');

module.exports = {
    //['synchronized', 'volatile', 'Atomic', "Lock", 'ReentrantLock', 'collection', 'comprehensive']
    current: pwcUtil.getFileNameArray("/backendtechnology/current"),
    other: pwcUtil.getFileNameArray("/openuphorizons/other"),//技术拓展
    trap: pwcUtil.getFileNameArray("/openuphorizons/trap"),//技术陷阱
    interview: pwcUtil.getFileNameArray("/openuphorizons/interview"),//面试宝典
    java: pwcUtil.getFileNameArray("/backendtechnology/java"),//JAVA
    microservice: pwcUtil.getFileNameArray("/backendtechnology/microservice"),//微服务
    middleware: pwcUtil.getFileNameArray("/backendtechnology/middleware"),//中间件
    database: pwcUtil.getFileNameArray("/backendtechnology/database"),//数据库
}