---
title: 定时任务
---

## 非集群定时任务
###  导入Maveny依赖
    
```sh 
<!-- https://mvnrepository.com/artifact/org.quartz-scheduler/quartz -->
    <dependency>
        <groupId>org.quartz-scheduler</groupId>
        <artifactId>quartz</artifactId>
        <version>2.3.0</version>
    </dependency>
```

###  配置quartz.properties
```sh 
#============================================================================
# Configure JobStore
# Using Spring datasource in quartzJobsConfig.xml
# Spring uses LocalDataSourceJobStore extension of JobStoreCMT
#============================================================================
org.quartz.jobStore.useProperties=true
org.quartz.jobStore.tablePrefix = QRTZ_
org.quartz.jobStore.isClustered = false
org.quartz.jobStore.clusterCheckinInterval = 60000
org.quartz.jobStore.misfireThreshold = 60000
org.quartz.jobStore.txIsolationLevelReadCommitted = true

# Change this to match your DB vendor
org.quartz.jobStore.class = org.quartz.impl.jdbcjobstore.JobStoreTX
org.quartz.jobStore.driverDelegateClass = org.quartz.impl.jdbcjobstore.StdJDBCDelegate


#============================================================================
# Configure Main Scheduler Properties
# Needed to manage cluster instances
#============================================================================
org.quartz.scheduler.instanceId=AUTO
org.quartz.scheduler.instanceName=MY_CLUSTERED_JOB_SCHEDULER
org.quartz.scheduler.rmi.export = false
org.quartz.scheduler.rmi.proxy = false


#============================================================================
# Configure ThreadPool
#============================================================================
org.quartz.threadPool.class = org.quartz.simpl.SimpleThreadPool
org.quartz.threadPool.threadCount = 10
org.quartz.threadPool.threadPriority = 5
org.quartz.threadPool.threadsInheritContextClassLoaderOfInitializingThread = true
# Configure Plugins
#============================================================================
org.quartz.plugin.triggHistory.class = org.quartz.plugins.history.LoggingJobHistoryPlugin
org.quartz.plugin.shutdownhook.class = org.quartz.plugins.management.ShutdownHookPlugin
org.quartz.plugin.shutdownhook.cleanShutdown = true
```

### 创建Job
实现 <code>QuartzJobBean</code>
```java 
package pwc.taxtech.quartz.job;

import org.apache.log4j.Logger;
import org.quartz.*;
import org.springframework.stereotype.Component;

/**
 * @version 1.0
 * @program: atms
 * @description:
 * @author: Kevin
 * @create: 2019-08-28 00:25
 **/

public class CheckStatusTask extends QuartzJobBean {
private static final Logger logger = LoggerFactory.getLogger(AnalysisJob.class);

@Resource
private OrganizationMapper organizationMapper;

@Value("${org_sync_url}")
private String orgSyncUrl;

@Value("${org_sync_token}")
private String token;

@Autowired
private AnalysisJobServiceImpl analysisJobService;

@Override
protected void executeInternal(JobExecutionContext jobExecutionContext) throws JobExecutionException {
Integer period = DateUtils.getPeriodNow();
OrganizationExample e = new OrganizationExample();
//e.createCriteria().andIsActiveEqualTo(true);
List<Organization> orgs = organizationMapper.selectByExample(e);

logger.info(String.format("开始分析%s机构数据",period));
analysisJobService.analysisMaster(orgs,period, EnumTbImportType.CoverImport.getCode());

logger.info(String.format("开始分析%s预期返还税数据",period));
analysisJobService.analysisExpectedTax(orgs,period, EnumTbImportType.CoverImport.getCode());
    }
}
```

### 配置job
```java 
package pwc.taxtech.quartz.config;

import org.quartz.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import pwc.taxtech.quartz.job.CheckStatusTask;
/**
 * @version 1.0
 * @program: atms
 * @description:
 * @author: Kevin
 * @create: 2019-08-27 23:22
 **/
@Configuration
public class QuartzConfig {
    public static final String QUARTZ_PROPERTIES_PATH = "/quartz.properties";
    @Bean
    public JobDetail printTimeJobDetail(){
        return JobBuilder.newJob(CheckStatusTask.class)//PrintTimeJob我们的业务类
                .withIdentity("PrintTimeJob")//可以给该JobDetail起一个id
                //每个JobDetail内都有一个Map，包含了关联到这个Job的数据，在Job类中可以通过context获取
                .usingJobData("msg", "Hello Quartz")//关联键值对
                .storeDurably()//即使没有Trigger关联时，也不需要删除该JobDetail
                .build();
    }
    @Bean
    public Trigger printTimeJobTrigger() {
        CronScheduleBuilder cronScheduleBuilder = CronScheduleBuilder.cronSchedule("* * * * * ? *");
        return TriggerBuilder.newTrigger()
                .forJob(printTimeJobDetail())//关联上述的JobDetail
                .withIdentity("quartzTaskService")//给Trigger起个名字
                .withSchedule(cronScheduleBuilder)
                .build();
    }
}
```


## 集群定时任务
### 引入依赖
```sh 
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-quartz</artifactId>
</dependency>
<dependency>
    <groupId>org.quartz-scheduler</groupId>
    <artifactId>quartz</artifactId>
    <version>2.3.1</version>
</dependency>
```

### 配置quartz.properties

```sh 

#============================================================================
# Configure JobStore
# Using Spring datasource in quartzJobsConfig.xml
# Spring uses LocalDataSourceJobStore extension of JobStoreCMT
#============================================================================
org.quartz.jobStore.useProperties=true
org.quartz.jobStore.tablePrefix = QRTZ_
org.quartz.jobStore.isClustered = true
org.quartz.jobStore.clusterCheckinInterval = 60000
org.quartz.jobStore.misfireThreshold = 60000
org.quartz.jobStore.txIsolationLevelReadCommitted = true

# Change this to match your DB vendor
org.quartz.jobStore.class = org.quartz.impl.jdbcjobstore.JobStoreTX
org.quartz.jobStore.driverDelegateClass = org.quartz.impl.jdbcjobstore.StdJDBCDelegate


#============================================================================
# Configure Main Scheduler Properties
# Needed to manage cluster instances
#============================================================================
org.quartz.scheduler.instanceId=AUTO
org.quartz.scheduler.instanceName=MY_CLUSTERED_JOB_SCHEDULER
org.quartz.scheduler.rmi.export = false
org.quartz.scheduler.rmi.proxy = false


#============================================================================
# Configure ThreadPool
#============================================================================
org.quartz.threadPool.class = org.quartz.simpl.SimpleThreadPool
org.quartz.threadPool.threadCount = 10
org.quartz.threadPool.threadPriority = 5
org.quartz.threadPool.threadsInheritContextClassLoaderOfInitializingThread = true
# Configure Plugins
#============================================================================
org.quartz.plugin.triggHistory.class = org.quartz.plugins.history.LoggingJobHistoryPlugin
org.quartz.plugin.shutdownhook.class = org.quartz.plugins.management.ShutdownHookPlugin
org.quartz.plugin.shutdownhook.cleanShutdown = true
```

### 配置定时任务
```java 
package pwc.taxtech.quartz.config;

import org.quartz.*;
import org.quartz.spi.JobFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.beans.factory.config.PropertiesFactoryBean;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.scheduling.quartz.SchedulerFactoryBean;
import pwc.taxtech.quartz.factory.AutowiringSpringBeanJobFactory;
import javax.sql.DataSource;
import java.util.Properties;

/**
 * @version 1.0
 * @program: atms
 * @description:
 * @author: Kevin
 * @create: 2019-08-27 23:22
 **/
@Configuration
public class QuartzConfig {
    public static final String QUARTZ_PROPERTIES_PATH = "/quartz.properties";
    /* ----------------------------quartz配置--------------------*/
    @Autowired
    private DataSource dataSource;



    @Bean
    public JobFactory jobFactory(ApplicationContext applicationContext) {
        AutowiringSpringBeanJobFactory jobFactory = new AutowiringSpringBeanJobFactory();
        jobFactory.setApplicationContext(applicationContext);
        return jobFactory;
    }

    @Bean
    public SchedulerFactoryBean schedulerFactoryBean( JobFactory jobFactory) {
        SchedulerFactoryBean schedulerFactoryBean = new SchedulerFactoryBean();
        schedulerFactoryBean.setJobFactory(jobFactory);
        schedulerFactoryBean.setStartupDelay(20);
        schedulerFactoryBean.setDataSource(dataSource);
        //用于quartz集群,加载quartz数据源配置
        schedulerFactoryBean.setQuartzProperties(quartzProperties());
        return schedulerFactoryBean;
    }


    @Bean
    public Properties quartzProperties(){
        PropertiesFactoryBean factoryBean = new PropertiesFactoryBean();
        factoryBean.setLocation(new ClassPathResource(QUARTZ_PROPERTIES_PATH));
        try {
            factoryBean.afterPropertiesSet();
            return factoryBean.getObject();
        }catch (Exception e){
            e.printStackTrace();
        }
        return null;
    }
}
```

### 创建Job
```java 
package pwc.taxtech.quartz.job;

import org.apache.log4j.Logger;
import org.quartz.*;
import org.springframework.stereotype.Component;

/**
 * @version 1.0
 * @program: atms
 * @description:
 * @author: Kevin
 * @create: 2019-08-28 00:25
 **/

@PersistJobDataAfterExecution
@DisallowConcurrentExecution
@Component
public class CheckStatusTask implements Job {

    private Logger log = Logger.getLogger(CheckStatusTask.class);
    public void execute(JobExecutionContext context) throws JobExecutionException {
        System.out.println("执行了");
    }

}

```
### 配置 SpringBeanJobFactory
```java  
package pwc.taxtech.quartz.factory;

import org.quartz.spi.TriggerFiredBundle;
import org.springframework.beans.factory.config.AutowireCapableBeanFactory;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.scheduling.quartz.SpringBeanJobFactory;

/**
 * @version 1.0
 * @program: atms
 * @description:
 * @author: Kevin
 * @create: 2019-08-28 00:16
 **/
public final class AutowiringSpringBeanJobFactory extends SpringBeanJobFactory implements
        ApplicationContextAware {

    private transient AutowireCapableBeanFactory beanFactory;

    @Override
    public  void setApplicationContext(final ApplicationContext context) {
        beanFactory = context.getAutowireCapableBeanFactory();
    }

    @Override
    protected Object createJobInstance(final TriggerFiredBundle bundle) throws Exception {
        final Object job = super.createJobInstance(bundle);
        beanFactory.autowireBean(job);
        return job;
    }
}
```
### 配置Job 和 配置Trigger
```java  

package pwc.taxtech.quartz.detail;

import org.apache.log4j.Logger;
import org.quartz.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.quartz.SchedulerFactoryBean;
import org.springframework.stereotype.Component;
import pwc.taxtech.quartz.job.CheckStatusTask;
//import pwc.taxtech.quartz.job.CheckStatusTask;
import javax.annotation.PostConstruct;
import static org.quartz.CronScheduleBuilder.cronSchedule;

/**
 * @version 1.0
 * @program: atms
 * @description:
 * @author: Kevin
 * @create: 2019-08-28 00:18
 **/
@Component
public class QuartzScheduler {
    @SuppressWarnings("SpringJavaAutowiringInspection")
    @Autowired
    private SchedulerFactoryBean schedulerFactoryBean;

    private Logger logger = Logger.getLogger(QuartzScheduler.class);

    @PostConstruct
    public void init() throws SchedulerException {
        scheduleJobs();
    }

    public void scheduleJobs() throws SchedulerException {
        logger.info("=======任务初始化========");
        Scheduler scheduler = schedulerFactoryBean.getScheduler();
        //需要传递数据,就是使用JobDataMa
        //       JobDataMap jobDataMap = new JobDataMap();
        //       jobDataMap.put("jobArg", "world");
        //CheckStatusTask.class 是需要执行定时任务的类名


        JobDetail jobDetail = JobBuilder.newJob(CheckStatusTask.class)
                //              .setJobData(jobDataMap)
                .withDescription("CheckStatusTask")
                .withIdentity("job-CheckStatus", "demo-group")
                .build();

        //InsertEvaluateTask.class 是需要执行定时任务的类名
        /*JobDetail jobDetail2 = JobBuilder.newJob(InsertEvaluateTask.class)
                //            .setJobData(jobDataMap)
                .withDescription("InsertEvaluateTask")
                .withIdentity("job-InsertEvaluate", "demo-group")
                .build();*/

        Trigger trigger = TriggerBuilder.newTrigger()
                //.forJob(jobDetail)
                .withSchedule(cronSchedule("* * * * * ? *"))
                .build();

        /*Trigger trigger2 = TriggerBuilder.newTrigger()
                .forJob(jobDetail2)
                .withSchedule(cronSchedule("0 0/1 * * * ? "))
                .build();*/

        try {
            /*if(!scheduler.checkExists(JobKey.jobKey("job-CheckStatus","demo-group"))){
                scheduler.scheduleJob(jobDetail,trigger);
            }*/
            /*if(!scheduler.checkExists(JobKey.jobKey("job-InsertEvaluate","demo-group"))){
                scheduler.scheduleJob(jobDetail2,trigger2);
            }*/
            scheduler.start();
            logger.info("=======任务初始化完成========");
        } catch (SchedulerException e) {
            e.printStackTrace();
        }
    }
}
```

## 附加
### quartz建表语句
 ```sh 
 
DROP TABLE IF EXISTS QRTZ_FIRED_TRIGGERS;
DROP TABLE IF EXISTS QRTZ_PAUSED_TRIGGER_GRPS;
DROP TABLE IF EXISTS QRTZ_SCHEDULER_STATE;
DROP TABLE IF EXISTS QRTZ_LOCKS;
DROP TABLE IF EXISTS QRTZ_SIMPLE_TRIGGERS;
DROP TABLE IF EXISTS QRTZ_SIMPROP_TRIGGERS;
DROP TABLE IF EXISTS QRTZ_CRON_TRIGGERS;
DROP TABLE IF EXISTS QRTZ_BLOB_TRIGGERS;
DROP TABLE IF EXISTS QRTZ_TRIGGERS;
DROP TABLE IF EXISTS QRTZ_JOB_DETAILS;
DROP TABLE IF EXISTS QRTZ_CALENDARS;

CREATE TABLE QRTZ_JOB_DETAILS
(
SCHED_NAME VARCHAR(120) NOT NULL,
JOB_NAME  VARCHAR(200) NOT NULL,
JOB_GROUP VARCHAR(200) NOT NULL,
DESCRIPTION VARCHAR(250) NULL,
JOB_CLASS_NAME   VARCHAR(250) NOT NULL,
IS_DURABLE VARCHAR(1) NOT NULL,
IS_NONCONCURRENT VARCHAR(1) NOT NULL,
IS_UPDATE_DATA VARCHAR(1) NOT NULL,
REQUESTS_RECOVERY VARCHAR(1) NOT NULL,
JOB_DATA BLOB NULL,
PRIMARY KEY (SCHED_NAME,JOB_NAME,JOB_GROUP)
);

CREATE TABLE QRTZ_TRIGGERS
(
SCHED_NAME VARCHAR(120) NOT NULL,
TRIGGER_NAME VARCHAR(200) NOT NULL,
TRIGGER_GROUP VARCHAR(200) NOT NULL,
JOB_NAME  VARCHAR(200) NOT NULL,
JOB_GROUP VARCHAR(200) NOT NULL,
DESCRIPTION VARCHAR(250) NULL,
NEXT_FIRE_TIME BIGINT(13) NULL,
PREV_FIRE_TIME BIGINT(13) NULL,
PRIORITY INTEGER NULL,
TRIGGER_STATE VARCHAR(16) NOT NULL,
TRIGGER_TYPE VARCHAR(8) NOT NULL,
START_TIME BIGINT(13) NOT NULL,
END_TIME BIGINT(13) NULL,
CALENDAR_NAME VARCHAR(200) NULL,
MISFIRE_INSTR SMALLINT(2) NULL,
JOB_DATA BLOB NULL,
PRIMARY KEY (SCHED_NAME,TRIGGER_NAME,TRIGGER_GROUP),
FOREIGN KEY (SCHED_NAME,JOB_NAME,JOB_GROUP)
REFERENCES QRTZ_JOB_DETAILS(SCHED_NAME,JOB_NAME,JOB_GROUP)
);

CREATE TABLE QRTZ_SIMPLE_TRIGGERS
(
SCHED_NAME VARCHAR(120) NOT NULL,
TRIGGER_NAME VARCHAR(200) NOT NULL,
TRIGGER_GROUP VARCHAR(200) NOT NULL,
REPEAT_COUNT BIGINT(7) NOT NULL,
REPEAT_INTERVAL BIGINT(12) NOT NULL,
TIMES_TRIGGERED BIGINT(10) NOT NULL,
PRIMARY KEY (SCHED_NAME,TRIGGER_NAME,TRIGGER_GROUP),
FOREIGN KEY (SCHED_NAME,TRIGGER_NAME,TRIGGER_GROUP)
REFERENCES QRTZ_TRIGGERS(SCHED_NAME,TRIGGER_NAME,TRIGGER_GROUP)
);

CREATE TABLE QRTZ_CRON_TRIGGERS
(
SCHED_NAME VARCHAR(120) NOT NULL,
TRIGGER_NAME VARCHAR(200) NOT NULL,
TRIGGER_GROUP VARCHAR(200) NOT NULL,
CRON_EXPRESSION VARCHAR(200) NOT NULL,
TIME_ZONE_ID VARCHAR(80),
PRIMARY KEY (SCHED_NAME,TRIGGER_NAME,TRIGGER_GROUP),
FOREIGN KEY (SCHED_NAME,TRIGGER_NAME,TRIGGER_GROUP)
REFERENCES QRTZ_TRIGGERS(SCHED_NAME,TRIGGER_NAME,TRIGGER_GROUP)
);

CREATE TABLE QRTZ_SIMPROP_TRIGGERS
(
SCHED_NAME VARCHAR(120) NOT NULL,
TRIGGER_NAME VARCHAR(200) NOT NULL,
TRIGGER_GROUP VARCHAR(200) NOT NULL,
STR_PROP_1 VARCHAR(512) NULL,
STR_PROP_2 VARCHAR(512) NULL,
STR_PROP_3 VARCHAR(512) NULL,
INT_PROP_1 INT NULL,
INT_PROP_2 INT NULL,
LONG_PROP_1 BIGINT NULL,
LONG_PROP_2 BIGINT NULL,
DEC_PROP_1 NUMERIC(13,4) NULL,
DEC_PROP_2 NUMERIC(13,4) NULL,
BOOL_PROP_1 VARCHAR(1) NULL,
BOOL_PROP_2 VARCHAR(1) NULL,
PRIMARY KEY (SCHED_NAME,TRIGGER_NAME,TRIGGER_GROUP),
FOREIGN KEY (SCHED_NAME,TRIGGER_NAME,TRIGGER_GROUP)
REFERENCES QRTZ_TRIGGERS(SCHED_NAME,TRIGGER_NAME,TRIGGER_GROUP)
);

CREATE TABLE QRTZ_BLOB_TRIGGERS
(
SCHED_NAME VARCHAR(120) NOT NULL,
TRIGGER_NAME VARCHAR(200) NOT NULL,
TRIGGER_GROUP VARCHAR(200) NOT NULL,
BLOB_DATA BLOB NULL,
PRIMARY KEY (SCHED_NAME,TRIGGER_NAME,TRIGGER_GROUP),
FOREIGN KEY (SCHED_NAME,TRIGGER_NAME,TRIGGER_GROUP)
REFERENCES QRTZ_TRIGGERS(SCHED_NAME,TRIGGER_NAME,TRIGGER_GROUP)
);

CREATE TABLE QRTZ_CALENDARS
(
SCHED_NAME VARCHAR(120) NOT NULL,
CALENDAR_NAME  VARCHAR(200) NOT NULL,
CALENDAR BLOB NOT NULL,
PRIMARY KEY (SCHED_NAME,CALENDAR_NAME)
);

CREATE TABLE QRTZ_PAUSED_TRIGGER_GRPS
(
SCHED_NAME VARCHAR(120) NOT NULL,
TRIGGER_GROUP  VARCHAR(200) NOT NULL,
PRIMARY KEY (SCHED_NAME,TRIGGER_GROUP)
);

CREATE TABLE QRTZ_FIRED_TRIGGERS
(
SCHED_NAME VARCHAR(120) NOT NULL,
ENTRY_ID VARCHAR(95) NOT NULL,
TRIGGER_NAME VARCHAR(200) NOT NULL,
TRIGGER_GROUP VARCHAR(200) NOT NULL,
INSTANCE_NAME VARCHAR(200) NOT NULL,
FIRED_TIME BIGINT(13) NOT NULL,
SCHED_TIME BIGINT(13) NOT NULL,
PRIORITY INTEGER NOT NULL,
STATE VARCHAR(16) NOT NULL,
JOB_NAME VARCHAR(200) NULL,
JOB_GROUP VARCHAR(200) NULL,
IS_NONCONCURRENT VARCHAR(1) NULL,
REQUESTS_RECOVERY VARCHAR(1) NULL,
PRIMARY KEY (SCHED_NAME,ENTRY_ID)
);

CREATE TABLE QRTZ_SCHEDULER_STATE
(
SCHED_NAME VARCHAR(120) NOT NULL,
INSTANCE_NAME VARCHAR(200) NOT NULL,
LAST_CHECKIN_TIME BIGINT(13) NOT NULL,
CHECKIN_INTERVAL BIGINT(13) NOT NULL,
PRIMARY KEY (SCHED_NAME,INSTANCE_NAME)
);

CREATE TABLE QRTZ_LOCKS
(
SCHED_NAME VARCHAR(120) NOT NULL,
LOCK_NAME  VARCHAR(40) NOT NULL,
PRIMARY KEY (SCHED_NAME,LOCK_NAME)
);
commit;
###如果定时任务比较多，建议增加索引提升速度。
create index idx_qrtz_j_req_recovery on qrtz_job_details(SCHED_NAME,REQUESTS_RECOVERY);
create index idx_qrtz_j_grp on qrtz_job_details(SCHED_NAME,JOB_GROUP);
create index idx_qrtz_t_j on qrtz_triggers(SCHED_NAME,JOB_NAME,JOB_GROUP);
create index idx_qrtz_t_jg on qrtz_triggers(SCHED_NAME,JOB_GROUP);
create index idx_qrtz_t_c on qrtz_triggers(SCHED_NAME,CALENDAR_NAME);
create index idx_qrtz_t_g on qrtz_triggers(SCHED_NAME,TRIGGER_GROUP);
create index idx_qrtz_t_state on qrtz_triggers(SCHED_NAME,TRIGGER_STATE);
create index idx_qrtz_t_n_state on qrtz_triggers(SCHED_NAME,TRIGGER_NAME,TRIGGER_GROUP,TRIGGER_STATE);
create index idx_qrtz_t_n_g_state on qrtz_triggers(SCHED_NAME,TRIGGER_GROUP,TRIGGER_STATE);
create index idx_qrtz_t_next_fire_time on qrtz_triggers(SCHED_NAME,NEXT_FIRE_TIME);
create index idx_qrtz_t_nft_st on qrtz_triggers(SCHED_NAME,TRIGGER_STATE,NEXT_FIRE_TIME);
create index idx_qrtz_t_nft_misfire on qrtz_triggers(SCHED_NAME,MISFIRE_INSTR,NEXT_FIRE_TIME);
create index idx_qrtz_t_nft_st_misfire on qrtz_triggers(SCHED_NAME,MISFIRE_INSTR,NEXT_FIRE_TIME,TRIGGER_STATE);
create index idx_qrtz_t_nft_st_misfire_grp on qrtz_triggers(SCHED_NAME,MISFIRE_INSTR,NEXT_FIRE_TIME,TRIGGER_GROUP,TRIGGER_STATE);
create index idx_qrtz_ft_trig_inst_name on qrtz_fired_triggers(SCHED_NAME,INSTANCE_NAME);
create index idx_qrtz_ft_inst_job_req_rcvry on qrtz_fired_triggers(SCHED_NAME,INSTANCE_NAME,REQUESTS_RECOVERY);
create index idx_qrtz_ft_j_g on qrtz_fired_triggers(SCHED_NAME,JOB_NAME,JOB_GROUP);
create index idx_qrtz_ft_jg on qrtz_fired_triggers(SCHED_NAME,JOB_GROUP);
create index idx_qrtz_ft_t_g on qrtz_fired_triggers(SCHED_NAME,TRIGGER_NAME,TRIGGER_GROUP);
create index idx_qrtz_ft_tg on qrtz_fired_triggers(SCHED_NAME,TRIGGER_GROUP);  
 ```





