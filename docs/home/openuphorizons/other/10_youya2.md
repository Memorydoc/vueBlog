---
title: 优雅写代码二
---

## 怎么更好的避免if else 语句？

### 创建业务父类
```java 
package com.sprucetec.live.category.bao;

import com.sprucetec.live.common.dto.baoreq.BaoReqDto;
import com.sprucetec.live.common.dto.baoreq.BaoUploadReqDto;
import com.sprucetec.live.common.dto.baores.BaoVideoResDto;
import lombok.Data;

/**
 * @ClassName BaoCallBack
 * @Description:
 * @Author Kenny
 * @Date 2020/6/10
 **/
@Data
public abstract class BaoCallBack {

    public String type; // 业务类型
    public abstract void handle(BaoUploadReqDto baoUploadReqDto);
}


```


### 创建业务一代码

```java  
package com.sprucetec.live.category.bao;

import com.sprucetec.live.common.dto.baoreq.BaoUploadReqDto;
import com.sprucetec.live.common.dto.business.LiveVideoDto;
import com.sprucetec.live.entity.LiveCropVideo;
import com.sprucetec.live.entity.LiveVideo;
import com.sprucetec.live.enums.BaoResCodeEnum;
import com.sprucetec.live.enums.LiveStatusEnum;
import com.sprucetec.live.enums.SettingEnum;
import com.sprucetec.live.mapper.LiveCropVideoMapper;
import com.sprucetec.live.mapper.LiveVideoMapper;
import com.sprucetec.live.service.RedisService;
import lombok.Data;
import org.apache.coyote.http2.Setting;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;
import tk.mybatis.mapper.entity.Example;

/**
 * @ClassName VideoUpload
 * @Description:
 * @Author Kenny
 * @Date 2020/6/10
 **/

@Component
@Data
public class VideoUpload extends BaoCallBack {

    private String desc = "视频上传回调";
    public String type = "upload";

    @Autowired
    private RedisTemplate redisTemplate;

    @Autowired
    private LiveVideoMapper liveVideoMapper;

    @Autowired
    private LiveCropVideoMapper liveCropVideoMapper;

    @Autowired
    private RedisService redisService;

    @Override
    public void handle(BaoUploadReqDto baoVideoResDto) {
        String liveNo = null;
        Example liveExample = new Example(LiveVideo.class);
        Example cropVideoExample = new Example(LiveCropVideo.class);
        cropVideoExample.createCriteria().andEqualTo("vid", baoVideoResDto.getData().getVid());
        LiveCropVideo liveCropVideo = liveCropVideoMapper.selectOneByExample(cropVideoExample);
        if (liveCropVideo != null) {
            liveNo = liveCropVideo.getLiveNo();
        }
        liveExample.createCriteria().andEqualTo("liveNo", liveNo);
        LiveVideo liveVideo = new LiveVideo();
        if (BaoResCodeEnum.ERROR.getCode().equals(baoVideoResDto.getRet())) { // 失败
            liveVideo.setLiveStatus(LiveStatusEnum.UPLOADERROR.getCode());
        } else if (BaoResCodeEnum.SUCCESS.getCode().equals(baoVideoResDto.getRet())) {
            LiveCropVideo updateLiveCrop = new LiveCropVideo();
            updateLiveCrop.setIsUpload(SettingEnum.YES.getCode());
            liveCropVideoMapper.updateByExampleSelective(updateLiveCrop, cropVideoExample);
            liveVideo.setLiveStatus(LiveStatusEnum.UPLOADED.getCode());
        }
        liveVideo.setIsUpload(SettingEnum.YES.getCode()); // 设置直播上传状态 1成功 2失败
        liveVideo.setType(1); // 回看
        liveVideoMapper.updateByExampleSelective(liveVideo, liveExample);
        LiveVideoDto liveVideoDto = new LiveVideoDto(); // 清空缓存
        liveVideoDto.setLiveNo(liveNo);
        redisService.videoChangeRefreshCache(liveVideoDto);
    }
}


```

### 创建业务三类

```java 

import com.sprucetec.live.common.dto.baoreq.BaoUploadReqDto;
import com.sprucetec.live.common.dto.business.LiveVideoDto;
import com.sprucetec.live.entity.LiveCropVideo;
import com.sprucetec.live.entity.LiveVideo;
import com.sprucetec.live.enums.BaoResCodeEnum;
import com.sprucetec.live.enums.LiveStatusEnum;
import com.sprucetec.live.enums.SettingEnum;
import com.sprucetec.live.mapper.LiveCropVideoMapper;
import com.sprucetec.live.mapper.LiveVideoMapper;
import com.sprucetec.live.service.RedisService;
import lombok.Data;
import org.apache.coyote.http2.Setting;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;
import tk.mybatis.mapper.entity.Example;

/**
 * @ClassName VideoUpload
 * @Description:
 * @Author Kenny
 * @Date 2020/6/10
 **/

@Component
@Data
public class VideoUpload extends BaoCallBack {

    private String desc = "视频上传回调";
    public String type = "upload";

    @Autowired
    private RedisTemplate redisTemplate;

    @Autowired
    private LiveVideoMapper liveVideoMapper;

    @Autowired
    private LiveCropVideoMapper liveCropVideoMapper;

    @Autowired
    private RedisService redisService;

    @Override
    public void handle(BaoUploadReqDto baoVideoResDto) {
    
            //xxx  业务
    }
}

```

### 依赖Spring的 加载注入功能
```java
    Map<String, BaoCallBack> baoCallBackMap = new ConcurrentHashMap<>(); 
    /**
     * 利用Spring DI 将在项目重启，自动构建map，策略解决if else 问题
     * Spring 会在系统启动的过程中， 将实现了 BaoCallBack 的所有子类加载到 baoCallBackMap 集合中
     *
     * @param baoCallBacks
     */
    public LiveVideoThreeServiceImpl(List<BaoCallBack> baoCallBacks) {
        for (BaoCallBack baoCallBack : baoCallBacks) {
            baoCallBackMap.put(baoCallBack.getType(), baoCallBack);
        }
    }
```
### 业务调用 

```java 
// 通过类型直接从map中获取
 BaoCallBack baoCallBack = baoCallBackMap.get(CategoryEnum.UPLOAD.getCode());
 baoCallBack.handle(baoUploadReqDto);
```



## 使用Spring 事件

### 创建事件父类
```java 
package com.sprucetec.purchase.event;
import org.springframework.context.ApplicationEvent;

/**
 * @ClassName TestEventParent
 * @Description:
 * @Author Kenny
 * @Date 2020/9/29
 **/

public abstract class TestEventParent extends ApplicationEvent {
    public Integer businessType; // 业务类型
    /**
     * Constructs a prototypical Event.
     *
     * @param source The object on which the Event initially occurred.
     * @throws IllegalArgumentException if source is null.
     */
    public TestEventParent(Object source) {
        super(source);
    }

    public abstract  void execute();

    public Integer getBusinessType() {
        return businessType;
    }

    public void setBusinessType(Integer businessType) {
        this.businessType = businessType;
    }
}

```

### 创建事件一
```java 
package com.sprucetec.purchase.event;

import org.springframework.stereotype.Component;

/**
 * @ClassName TestEventOne
 * @Description:
 * @Author Kenny
 * @Date 2020/9/29
 **/
public class TestEventOne extends TestEventParent {
    /**
     * Constructs a prototypical Event.
     *
     * @param source The object on which the Event initially occurred.
     * @throws IllegalArgumentException if source is null.
     */
    public TestEventOne(Object source) {
        super(source);
    }

    public Integer getBusinessType() {
        return businessType;
    }

    public void setBusinessType(Integer businessType) {
        this.businessType = businessType;
    }

    private Integer businessType = 1;

    @Override
    public void execute() {
        System.out.println("执行TestEventOne" + businessType);
    }


}

```

### 创建事件二
```java 
package com.sprucetec.purchase.event;

import org.springframework.stereotype.Component;

/**
 * @ClassName TestEventOne
 * @Description:
 * @Author Kenny
 * @Date 2020/9/29
 **/
public class TestEventTwo extends TestEventParent {

    public Integer getBusinessType() {
        return businessType;
    }

    public void setBusinessType(Integer businessType) {
        this.businessType = businessType;
    }

    private Integer businessType = 1;

    /**
     * Create a new ApplicationEvent.
     *
     * @param source the object on which the event initially occurred (never {@code null})
     */
    public TestEventTwo(Object source) {
        super(source);
    }

    @Override
    public void execute() {
        System.out.println("执行TestEventTwo" + businessType);
    }
}

```

### 发布事件
```java 
// 注入spring 事件发布器
    @Autowired
    private ApplicationEventPublisher applicationEventPublisher;

// 发布事件
     applicationEventPublisher.publishEvent(new TestEventOne(""));
```
