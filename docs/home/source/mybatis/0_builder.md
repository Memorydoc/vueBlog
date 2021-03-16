---
title: Mybatis 初始化加载标签解析
---

##  mybatis 的全局配置文件 
```xml  
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE configuration
        PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-config.dtd">
<configuration >
     <properties resource="app.properties" >
    </properties>
    <settings>
        <setting name="mapUnderscoreToCamelCase" value="true"/>
    </settings>
    
    <typeAliases>
    </typeAliases>
    
    <environments default="dev">
        <environment id="dev">
            <transactionManager type="JDBC"/>
            <dataSource type="POOLED">
                <property name="driver" value="${jdbc.driver}"/>
                <property name="url" value="${jdbc.url}"/>
                <property name="username" value="${jdbc.username}"/>
                <property name="password" value="${jdbc.password}"/>
            </dataSource>
        </environment>
    </environments>

    <mappers> <!-mapper包扫描路径-->
        <package name="org.apache.ibatis.luban"/>
    </mappers>
</configuration>

```

## UserMapper.java
```java 
package org.apache.ibatis.luban;

import org.apache.ibatis.annotations.*;
import org.apache.ibatis.luban.bean.User;
import org.apache.ibatis.mapping.StatementType;
import java.util.List;

@CacheNamespace
public interface UserMapper {

    @Select({" select * from users where id=#{1}"})
    User selectByid(Integer id);


    @Select({" select * from users where id=#{1}"})
    User selectByid3(Integer id);

    @Select({" select * from users where name='${name}'"})
    @Options(statementType = StatementType.PREPARED)
    List<User> selectByName(User user);

    List<User> selectByUser(User user);

    @Insert("INSERT INTO `users`( `name`, `age`, `sex`, `email`, `phone_number`) VALUES ( #{name}, #{age}, #{sex}, #{email}, #{phoneNumber})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int addUser(User user);

    int editUser(User user);

    @Update("update  users set name=#{arg1} where id=#{arg0}")
    int setName(Integer id, String name);

    @Delete("delete from users where id=#{id}")
    int deleteUser(Integer id);
}

```



## 获取构建器，解析mybatis-config.xml 文件
```java 
    // 获取构建器
    SqlSessionFactoryBuilder factoryBuilder = new SqlSessionFactoryBuilder();
    // 解析XML 并构造会话工厂 设置 大量的工作，解析了全局配置文件，也解析了Mapper相关的xml文件
    factory = factoryBuilder.build(ExecutorTest.class.getResourceAsStream("/mybatis-config.xml"));
```
* 调用 SqlSessionFactoryBuilder 的 build 方法
```java  
  public SqlSessionFactory build(InputStream inputStream, String environment, Properties properties) {
    try {
      XMLConfigBuilder parser = new XMLConfigBuilder(inputStream, environment, properties);
      // parser.parse() 返回 mybatis-config.xml中的 configuration 标签内部的对象填充
      return build(parser.parse()); // build方法 根据configuration 构建默认的 DefaultSqlSessionFactory
    } catch (Exception e) {
      throw ExceptionFactory.wrapException("Error building SqlSession.", e);
    } finally {
      ErrorContext.instance().reset();
      try {
        inputStream.close();
      } catch (IOException e) {
        // Intentionally ignore. Prefer previous error.
      }
    }
  }
    // 方法重载
    public SqlSessionFactory build(Configuration config) {
      return new DefaultSqlSessionFactory(config); // 使用 Configuration 构建默认的SqlSessionFactory
    }
```
* 分析 parser.parse() 方法内部究竟做了什么？
1. 深入解析 
```java  
    public Configuration parse() {
        if (parsed) {
          throw new BuilderException("Each XMLConfigBuilder can only be used once.");
        }
        parsed = true;
        parseConfiguration(parser.evalNode("/configuration"));   // 解析 mybatis-config.xml 中的 configuration 标签
        return configuration;
      }
```
2. 一探究竟之 parseConfiguration 
```java 
// 解析 configuration 中的各个参数
  private void parseConfiguration(XNode root) {
    try {
      // issue #117 read properties first
      propertiesElement(root.evalNode("properties")); // 解析 properties 标签
      Properties settings = settingsAsProperties(root.evalNode("settings")); // 解析settings 配置设置，内部会遍历 内部标签进行赋值
      loadCustomVfs(settings);// 加载Setting
      loadCustomLogImpl(settings);
      // 解析插件标签 内部会将  plugin 保存到   private final List<Interceptor> interceptors = new ArrayList<>(); // 保存所有拦截器
      // 该拦截器数组中的 Interceptor  会在 Executor 和 StatmentHandler中都进行拦截
      pluginElement(root.evalNode("plugins"));
      objectFactoryElement(root.evalNode("objectFactory"));
      objectWrapperFactoryElement(root.evalNode("objectWrapperFactory"));
      reflectorFactoryElement(root.evalNode("reflectorFactory"));
      settingsElement(settings);
      // read it after objectFactory and objectWrapperFactory issue #631
      environmentsElement(root.evalNode("environments")); // 解析 environments 部分
      databaseIdProviderElement(root.evalNode("databaseIdProvider"));
      typeHandlerElement(root.evalNode("typeHandlers"));
      mapperElement(root.evalNode("mappers")); // 解析 Mapper 包扫描路径 "重要"
    } catch (Exception e) {
      throw new BuilderException("Error parsing SQL Mapper Configuration. Cause: " + e, e);
    }
  }
```
3. 一探究竟之 mapperElement 方法
```java  
// 内部进行了大量的操作 解析Mapper.xml 构建 MapperStatment 赋值 configuration
  private void mapperElement(XNode parent) throws Exception {
    if (parent != null) {
      for (XNode child : parent.getChildren()) {
        if ("package".equals(child.getName())) { // 配置的是 包路径。 这里是 org.apache.ibatis.luban
          String mapperPackage = child.getStringAttribute("name");
          configuration.addMappers(mapperPackage); // 进行读取Mapper java文件 构建MappedStatment 通过  MapperRegistry 进行addMappers 
        } else {
          String resource = child.getStringAttribute("resource");
          String url = child.getStringAttribute("url");
          String mapperClass = child.getStringAttribute("class");
          if (resource != null && url == null && mapperClass == null) {
            ErrorContext.instance().resource(resource);
            InputStream inputStream = Resources.getResourceAsStream(resource);
            XMLMapperBuilder mapperParser = new XMLMapperBuilder(inputStream, configuration, resource, configuration.getSqlFragments());
            mapperParser.parse();
          } else if (resource == null && url != null && mapperClass == null) {
            ErrorContext.instance().resource(url);
            InputStream inputStream = Resources.getUrlAsStream(url);
            XMLMapperBuilder mapperParser = new XMLMapperBuilder(inputStream, configuration, url, configuration.getSqlFragments());
            mapperParser.parse();
          } else if (resource == null && url == null && mapperClass != null) {
            Class<?> mapperInterface = Resources.classForName(mapperClass);
            configuration.addMapper(mapperInterface);
          } else {
            throw new BuilderException("A mapper element may only specify a url, resource or class, but not more than one.");
          }
        }
      }
    }
  }
```
4. 一探究竟之 MapperRegistry 的  addMapper 方法
```java  
public <T> void addMapper(Class<T> type) {
    if (type.isInterface()) { // 这里就说明了 Mapper.java 文件必须为接口的原因，如果不是接口，则mybatis 不会完成Mapper.java的扫描
      if (hasMapper(type)) { // 判断 Mapper是否已经被扫描过了？ 如果被扫描过，则抛出异常
        throw new BindingException("Type " + type + " is already known to the MapperRegistry.");
      }
      boolean loadCompleted = false; // 是否加载完成
      try {
        knownMappers.put(type, new MapperProxyFactory<>(type)); // 每个Mapper 对应一个MapperProxyFactory 动态代理工厂
        // It's important that the type is added before the parser is run
        // otherwise the binding may automatically be attempted by the
        // mapper parser. If the type is already known, it won't try.
        MapperAnnotationBuilder parser = new MapperAnnotationBuilder(config, type); // 读取 Mapper 文件中的相关注解信息
        parser.parse(); // 进行真正的 解析Mapper 通过Mapper.java 中的 相关注解配置， 进行解析构建 MappedStatement 
        loadCompleted = true; // 标记 已经将Mapper 加载完成
      } finally {
        if (!loadCompleted) {
          knownMappers.remove(type);
        }
      }
    }
  }
```
5. 一探究竟之 MapperAnnotationBuilder 的 parse 方法， MapperAnnotationBuilder 作用是根据java 文件的注解配置进行builder相关的 MappedStatment
```java 
 // 根据Mapper.java 接口中的注解，进行解析并构建 MappedStatment
  public void parse() {
    String resource = type.toString();
    if (!configuration.isResourceLoaded(resource)) { // 判断当前 interface org.apache.ibatis.luban.UserMapper 是否被 加载过，如果没有被加载 则进行加载
      loadXmlResource(); // 解析Mapper.java 文件对应的xml文件 ‘重要’
      configuration.addLoadedResource(resource);
      assistant.setCurrentNamespace(type.getName());
      parseCache(); // 构建二级缓存
      parseCacheRef();
      for (Method method : type.getMethods()) {  // 循环解析 Mapper.xml 中所有的 （增删改查） 每个都是一个MappedStatment
        if (!canHaveStatement(method)) {
          continue;
        }
        if (getSqlCommandType(method) == SqlCommandType.SELECT && method.getAnnotation(ResultMap.class) == null) {
          parseResultMap(method);
        }
        try {
          parseStatement(method);
        } catch (IncompleteElementException e) {
          configuration.addIncompleteMethod(new MethodResolver(this, method));
        }
      }
    }
    parsePendingMethods(); // 未完成的 MappedStatment的加载  在 loadXmlResource 方法中加载 异常的 会被放入一个 Collection<MethodResolver> incompleteMethods 中， 再次加载
  }
```
6. 一探究竟之 MapperAnnotationBuilder 的loadXmlResource
```java 
// 加载解析 Mapper.java 文件的xml文件； 其中的 type  就是 对应 上面的 UserMapper.java  类
  private void loadXmlResource() {
    // Spring may not know the real resource name so we check a flag
    // to prevent loading again a resource twice
    // this flag is set at XMLMapperBuilder#bindMapperForNamespace
    if (!configuration.isResourceLoaded("namespace:" + type.getName())) {
      String xmlResource = type.getName().replace('.', '/') + ".xml"; // 获取 xml 资源文件名
      // #1347
      InputStream inputStream = type.getResourceAsStream("/" + xmlResource); // 获取xml文件流
      if (inputStream == null) {
        // Search XML mapper that is not in the module but in the classpath.
        try {
          inputStream = Resources.getResourceAsStream(type.getClassLoader(), xmlResource);
        } catch (IOException e2) {
          // ignore, resource is not required
        }
      }
      if (inputStream != null) {
        XMLMapperBuilder xmlParser = new XMLMapperBuilder(inputStream, assistant.getConfiguration(), xmlResource, configuration.getSqlFragments(), type.getName());
        xmlParser.parse(); // 通过 XMLMapperBuilder  配合 configuration 相关的mybatis配置进行 xml的解析
      }
    }
  }
```
7. 一探究竟之 XMLMapperBuilder 的parse 方法
```java 
 /**
   * 解析Mapper.xml 构建MapperStatement 赋值 configuration
   */
  public void parse() {
    if (!configuration.isResourceLoaded(resource)) {
      // 该方法重要 加载 mapper标签内容
      configurationElement(parser.evalNode("/mapper")); // 开始解析 Mapper.xml 的mapper的 标签, 并将解析的全局的配置相关结果 configuration
      configuration.addLoadedResource(resource); // 将已经解析过的xml文件保存起来，防止下次重复加载
      bindMapperForNamespace(); // 将资源与命名空间绑定
    }
    parsePendingResultMaps();
    parsePendingCacheRefs();
    parsePendingStatements(); // 出现异常的MapperStatment的构建，会再这里再次构建
  }

```
8. 一探究竟之 XMLMapperBuilder 的 configurationElement方法
```java 
/**
   * 解析mapper.xml 中的  <mapper></mapper> 标签
   * @param context
   */
  private void configurationElement(XNode context) {
    try {
      String namespace = context.getStringAttribute("namespace");
      if (namespace == null || namespace.isEmpty()) {
        throw new BuilderException("Mapper's namespace cannot be empty");
      }
      builderAssistant.setCurrentNamespace(namespace);
      cacheRefElement(context.evalNode("cache-ref")); // 解析  cache-ref 二级缓存引用标签
      cacheElement(context.evalNode("cache")); // 解析 二级缓存标签 如果配置了 二级缓存，MapperBuilderAssistant 会创建一个二级缓存对象（useNewCache）
      parameterMapElement(context.evalNodes("/mapper/parameterMap")); // 解析 parameterMap
      resultMapElements(context.evalNodes("/mapper/resultMap")); // 解析 resultMap
      sqlElement(context.evalNodes("/mapper/sql")); // 解析sql  标签
      // 下面是解析 sql的 正删改查 标签语句  <select id="selectByUser"; <update  id="editUser" ... 等
      buildStatementFromContext(context.evalNodes("select|insert|update|delete")); // 解析成XNode 并构建MapperStatment 并保存到Configuration中
    } catch (Exception e) {
      throw new BuilderException("Error parsing Mapper XML. The XML location is '" + resource + "'. Cause: " + e, e);
    }
  }

```

9. 一探究竟之  XMLMapperBuilder 的 cacheElement  二级缓存 解析标签   
```java  
 /**
   * 解析 xml文件中的 cache标签
   *  context 是 cache 标签内部的配置参数
   * @param context
   */
  private void cacheElement(XNode context) {
    if (context != null) { // 必须配置了 cache标签才会进入
      String type = context.getStringAttribute("type", "PERPETUAL");
      Class<? extends Cache> typeClass = typeAliasRegistry.resolveAlias(type);
      String eviction = context.getStringAttribute("eviction", "LRU"); // 默认使用LRU缓存淘汰策略
      Class<? extends Cache> evictionClass = typeAliasRegistry.resolveAlias(eviction);
      Long flushInterval = context.getLongAttribute("flushInterval");
      Integer size = context.getIntAttribute("size");
      boolean readWrite = !context.getBooleanAttribute("readOnly", false);
      boolean blocking = context.getBooleanAttribute("blocking", false);
      Properties props = context.getChildrenAsProperties();
      // 根据cache标签构建  二级缓存
      builderAssistant.useNewCache(typeClass, evictionClass, flushInterval, size, readWrite, blocking, props); 
    }
  }
```
 解析 增删改查sql 的过程 （buildStatementFromContext） 其实就是构建 MappedStatment 的过程 内部调用过程为
    > buildStatementFromContext(XMLMapperBuilder) 
        -> parseStatementNode(XMLStatementBuilder) 经过一系列的 标签参数配置获取 
             ->addMappedStatement(MapperBuilderAssistant)
             
 ```java 
 public MappedStatement addMappedStatement(
       String id,
       SqlSource sqlSource,
       StatementType statementType,
       SqlCommandType sqlCommandType,
       Integer fetchSize,
       Integer timeout,
       String parameterMap,
       Class<?> parameterType,
       String resultMap,
       Class<?> resultType,
       ResultSetType resultSetType,
       boolean flushCache,
       boolean useCache,
       boolean resultOrdered,
       KeyGenerator keyGenerator,
       String keyProperty,
       String keyColumn,
       String databaseId,
       LanguageDriver lang,
       String resultSets) {
 
     if (unresolvedCacheRef) {
       throw new IncompleteElementException("Cache-ref not yet resolved");
     }
 
     id = applyCurrentNamespace(id, false);
     boolean isSelect = sqlCommandType == SqlCommandType.SELECT;
     // 构建MapperStatement
     MappedStatement.Builder statementBuilder = new MappedStatement.Builder(configuration, id, sqlSource, sqlCommandType)
         .resource(resource)
         .fetchSize(fetchSize)
         .timeout(timeout)
         .statementType(statementType)
         .keyGenerator(keyGenerator)
         .keyProperty(keyProperty)
         .keyColumn(keyColumn)
         .databaseId(databaseId)
         .lang(lang)
         .resultOrdered(resultOrdered)
         .resultSets(resultSets)
         .resultMaps(getStatementResultMaps(resultMap, resultType, id))
         .resultSetType(resultSetType)
         .flushCacheRequired(valueOrDefault(flushCache, !isSelect))
         .useCache(valueOrDefault(useCache, isSelect))
         .cache(currentCache);
 
     ParameterMap statementParameterMap = getStatementParameterMap(parameterMap, parameterType, id); // 构建 parameterMap xml中的参数返回Map
     if (statementParameterMap != null) {
       statementBuilder.parameterMap(statementParameterMap);
     }
 
     MappedStatement statement = statementBuilder.build();
     configuration.addMappedStatement(statement); // 将MapperStatement设置到 configuration中
     return statement;
   }
 ```



*  DefaultSqlSessionFactory 对象用户创建 SqlSession（会话 通过ThreadLocal进行线程之间的隔离）
   内部维护了 Configuration 对象，将 openSession 交给 Configuration 进行创建处理
 ``` java  
 public class DefaultSqlSessionFactory implements SqlSessionFactory {
 
   private final Configuration configuration;
 
   public DefaultSqlSessionFactory(Configuration configuration) {
     this.configuration = configuration;
   }
 
   @Override
   public SqlSession openSession() {
     return openSessionFromDataSource(configuration.getDefaultExecutorType(), null, false);
   }
 
   @Override
   public SqlSession openSession(boolean autoCommit) {
     return openSessionFromDataSource(configuration.getDefaultExecutorType(), null, autoCommit);
   }
   
   
   /**
      * 通过 Datasource 配置， 构建对应的Session
      * @param execType
      * @param level
      * @param autoCommit
      * @return
      */
     private SqlSession openSessionFromDataSource(ExecutorType execType, TransactionIsolationLevel level, boolean autoCommit) {
       Transaction tx = null;
       try {
         final Environment environment = configuration.getEnvironment(); // 获取 SqlSessionFactoryBuilder 中通过builder方法 读取的 数据库配置等信息 和上下文环境
         final TransactionFactory transactionFactory = getTransactionFactoryFromEnvironment(environment);
         tx = transactionFactory.newTransaction(environment.getDataSource(), level, autoCommit);// 创建事物管理器
         final Executor executor = configuration.newExecutor(tx, execType); // 根据传入的ExecutorType 类型创建相应的Executor
         return new DefaultSqlSession(configuration, executor, autoCommit); // 使用默认的sqlSession
       } catch (Exception e) {
         closeTransaction(tx); // may have fetched a connection so lets call close()
         throw ExceptionFactory.wrapException("Error opening session.  Cause: " + e, e);
       } finally {
         ErrorContext.instance().reset();
       }
     }
   
   //... 此处省略部分代码
   }
 ```
    


