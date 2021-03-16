---
title: API 接口安全设计
---

## 数据防泄露

### 使用加密算法（RSA）

####  对称加密

**对称加密采用了对称密码编码技术，它的特点是文件加密和解密使用相同的密钥加密**

#### 非对称加密

**与对称加密算法不同，非对称加密算法需要两个密钥：公开密钥（publickey）和私有密钥（privatekey）。**

***

因为非对称加密相对来说 安全性更高一些，这里讲解使用RSA（非对称加密进行加密、签名）

##### 加密（对方请求我方服务）

使用publicKey进行加密， 使用privateKey 进行解密

##### 签名（请求对方服务）

使用privateKey 进行加密， 使用publicKey 进行解密

#### RSAUtil

```
package com.pwc.safe;

import java.security.KeyPair;
import org.apache.tomcat.util.codec.binary.Base64;
import javax.crypto.Cipher;
import java.io.ByteArrayOutputStream;
import java.security.*;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
public class RSAUtils {

    /**
     * RSA最大加密明文大小
     **/
    private static final int MAX_ENCRYPT_BLOCK = 117;

    /**
     * RSA最大解密密文大小
     **/
    private static final int MAX_DECRYPT_BLOCK = 128;


    public static final String KEY_ALGORITHM = "RSA";
    public static final String SIGNATURE_ALGORITHM = "MD5withRSA";

    /**
     * @Title: getKeyPair
     * @Description: 获取密钥对
     * @Date: 2020/7/17 14:44
     * @return: java.security.KeyPair
     **/
    public static KeyPair getKeyPair() throws Exception {
        KeyPairGenerator generator = KeyPairGenerator.getInstance(KEY_ALGORITHM);
        generator.initialize(1024);
        return generator.generateKeyPair();
    }

    /**
     * @Title: getPrivateKey
     * @Description: 获取私钥
     * @param privateKey 私钥字符串
     * @Date: 2020/7/17 14:45
     * @return: java.security.PrivateKey
     **/
    public static PrivateKey getPrivateKey(String privateKey) throws Exception {
        KeyFactory keyFactory = KeyFactory.getInstance(KEY_ALGORITHM);
        byte[] decodedKey = Base64.decodeBase64(privateKey.getBytes());
        PKCS8EncodedKeySpec keySpec = new PKCS8EncodedKeySpec(decodedKey);
        return keyFactory.generatePrivate(keySpec);
    }

    /**
     * @Title: getPublicKey
     * @Description: 获取公钥
     * @param publicKey 公钥字符串
     * @Date: 2020/7/17 14:47
     * @return: java.security.PublicKey
     **/
    public static PublicKey getPublicKey(String publicKey) throws Exception {
        KeyFactory keyFactory = KeyFactory.getInstance(KEY_ALGORITHM);
        byte[] decodedKey = Base64.decodeBase64(publicKey.getBytes());
        X509EncodedKeySpec keySpec = new X509EncodedKeySpec(decodedKey);
        return keyFactory.generatePublic(keySpec);
    }

    /**
     * @Title: encrypt
     * @Description: RSA 加密
     * @param data 待加密数据
     * @param publicKey 公钥
     * @Date: 2020/7/17 14:47
     * @return: java.lang.String
     **/
    public static String encrypt(String data, PublicKey publicKey) throws Exception {
        Cipher cipher = Cipher.getInstance(KEY_ALGORITHM);
        cipher.init(Cipher.ENCRYPT_MODE, publicKey);
        int inputLen = data.getBytes().length;
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        int offset = 0;
        byte[] cache;
        int i = 0;
        // 对数据分段加密
        while (inputLen - offset > 0) {
            if (inputLen - offset > MAX_ENCRYPT_BLOCK) {
                cache = cipher.doFinal(data.getBytes(), offset, MAX_ENCRYPT_BLOCK);
            } else {
                cache = cipher.doFinal(data.getBytes(), offset, inputLen - offset);
            }
            out.write(cache, 0, cache.length);
            i++;
            offset = i * MAX_ENCRYPT_BLOCK;
        }
        byte[] encryptedData = out.toByteArray();
        out.close();
        // 获取加密内容使用base64进行编码,并以UTF-8为标准转化成字符串
        // 加密后的字符串
        return new String(Base64.encodeBase64String(encryptedData));
    }

    /**
     * @Title: decrypt
     * @Description: RSA 解密
     * @param data 待解密数据
     * @param privateKey 私钥
     * @Date: 2020/7/17 14:48
     * @return: java.lang.String
     **/
    public static String decrypt(String data, PrivateKey privateKey) throws Exception {
        Cipher cipher = Cipher.getInstance(KEY_ALGORITHM);
        cipher.init(Cipher.DECRYPT_MODE, privateKey);
        byte[] dataBytes = Base64.decodeBase64(data);
        int inputLen = dataBytes.length;
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        int offset = 0;
        byte[] cache;
        int i = 0;
        // 对数据分段解密
        while (inputLen - offset > 0) {
            if (inputLen - offset > MAX_DECRYPT_BLOCK) {
                cache = cipher.doFinal(dataBytes, offset, MAX_DECRYPT_BLOCK);
            } else {
                cache = cipher.doFinal(dataBytes, offset, inputLen - offset);
            }
            out.write(cache, 0, cache.length);
            i++;
            offset = i * MAX_DECRYPT_BLOCK;
        }
        byte[] decryptedData = out.toByteArray();
        out.close();
        // 解密后的内容
        return new String(decryptedData, "UTF-8");
    }

    /**
     * @Title: sign
     * @Description: 签名
     * @param data 待签名数据
     * @param privateKey 私钥
     * @Date: 2020/7/17 14:49
     * @return: java.lang.String
     **/
    public static String sign(String data, PrivateKey privateKey) throws Exception {
        byte[] keyBytes = privateKey.getEncoded();
        PKCS8EncodedKeySpec keySpec = new PKCS8EncodedKeySpec(keyBytes);
        KeyFactory keyFactory = KeyFactory.getInstance(KEY_ALGORITHM);
        PrivateKey key = keyFactory.generatePrivate(keySpec);
        Signature signature = Signature.getInstance(SIGNATURE_ALGORITHM);
        signature.initSign(key);
        signature.update(data.getBytes());
        return new String(Base64.encodeBase64(signature.sign()));
    }

    /**
     * @Title: verify
     * @Description: 验签
     * @param srcData 原始字符串
     * @param publicKey 公钥
     * @param sign 签名
     * @Date: 2020/7/17 14:50
     * @return: boolean
     **/
    public static boolean verify(String srcData, PublicKey publicKey, String sign) throws Exception {
        byte[] keyBytes = publicKey.getEncoded();
        X509EncodedKeySpec keySpec = new X509EncodedKeySpec(keyBytes);
        KeyFactory keyFactory = KeyFactory.getInstance(KEY_ALGORITHM);
        PublicKey key = keyFactory.generatePublic(keySpec);
        Signature signature = Signature.getInstance(SIGNATURE_ALGORITHM);
        signature.initVerify(key);
        signature.update(srcData.getBytes());
        return signature.verify(Base64.decodeBase64(sign.getBytes()));
    }

    public static void main(String[] args) {
        try {
            // 生成密钥对
            KeyPair keyPair = getKeyPair();
            String privateKey = new String(Base64.encodeBase64(keyPair.getPrivate().getEncoded()));
            String publicKey = new String(Base64.encodeBase64(keyPair.getPublic().getEncoded()));
            System.out.println("私钥:" + privateKey);
            System.out.println("公钥:" + publicKey);
            // RSA加密
            String data = "待加密的文字内容";
            String encryptData = encrypt(data, getPublicKey(publicKey));
            System.out.println("加密后内容:" + encryptData);
            // RSA解密
            String decryptData = decrypt(encryptData, getPrivateKey(privateKey));
            System.out.println("解密后内容:" + decryptData);

            // RSA签名
            String sign = sign(data, getPrivateKey(privateKey));
            // RSA验签
            boolean result = verify(data, getPublicKey(publicKey), sign);

            System.out.print("验签结果:" + result);
        } catch (Exception e) {
            e.printStackTrace();
            System.out.print("加解密异常");
        }
    }

}
```

## 数据防篡改

### 使用Base64防篡改

#### 原因

* Base64是不可逆的编码
* 同一个字符串进行N次编码（hash） 都会生成同一个编码

#### 原理

Base64 是将字符串 转换成 二进制 （001010101这种的），然后按照每6个一组进行分组，然后在将 这每组的二进制转换成10进制 会生成 0 -64 的数字，

这64个数字会根据ASCII 中数字代表的字母进行获取而生成的一种国际上都会认识的一个字符串

### 应用场景

下订单的过程中， 如果在付款的时候，用户需要付款5000元，但是被黑客抓包篡改了金额，变成1元，那么将会损失4999元大洋，是不是很惨。

#### 解决

* 在订单提交的请求中双方协商 订单生成字符串拼接规则, 例如：data1 =  Base64加密（用户名-金额-日期） , md5Str = xxxxxxxxxxxxxxxxxxxx;
* 如果字符串拼接规则 和 md5串都被抓包了怎么办？ 那么可以使用邮件发送一个salt(盐)， 拼接在data1后面，例如：  Base64加密（用户名-金额-日期-盐）

> 这个盐可以约定 是根据时间动态生成的 例如： new Date().getHour();



## 数据防窃取

所谓的数据防窃取就是接口防止被恶意调用， 使用token进行解决，每次请求接口的时候，都需要带着token进行请求

这个token可以有多种方案

* 在第一次请求之前， 需要向服务端申请获取token，服务端将token保存在redis中，并设置expire超时时间（比如30分钟）。如果下次请求

  携带的token，没有在redis中查询到，那么需要返回权限过期信息。

* 使用Oauth2 框架集成

* 使用自定义的token生成规则，其中双方要协商token生成规则， 使用下方规则生成。 tag  和 key需要双方制定，切记不能泄露 tag key 和 生成方式

  ```
  urlencode(base64({
      tag:标识符,
      expires:有效期时间戳(例如：time()+3600)
      token:md5(tag+key+expires)MD5校验
  }))
  ```



##### AuthInfoHelper 工具类



```
package com.sprucetec.live.common.util;

/**
 * @ClassName AuthInfoHelper
 * @Description:
 * @Author Kenny
 * @Date 2020/7/7
 **/

import com.alibaba.fastjson.JSON;
import com.sprucetec.live.common.dto.baores.AuthInfo;
import org.springframework.util.DigestUtils;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Date;

public class AuthInfoHelper {

    /*
    urlencode(base64({
        tag:标识符,
        expires:有效期时间戳(例如：time()+3600)
        token:md5(tag+key+expires)MD5校验
    }))
     */

    public static AuthInfo getAuthInfo(String tag, String key, int expiration) {
        AuthInfo authInfo = new AuthInfo();
        authInfo.setTag(tag);
        authInfo.setExpires(getAuthExpiration(expiration));
        authInfo.setToken(getToken(tag, key, authInfo.getExpires()));
        return authInfo;
    }

    public static String getAuthInfoText(String tag, String key, int expiration) throws UnsupportedEncodingException {
        AuthInfo authInfo = getAuthInfo(tag, key, expiration);
        return getAuthInfoText(authInfo);
    }

    public static String getAuthInfoBase64(String tag, String key, int expiration) {
        AuthInfo authInfo = getAuthInfo(tag, key, expiration);
        return getAuthInfoBase64(authInfo);
    }

    public static String getAuthInfoBase64(AuthInfo authInfo) {
        String jsonText = JSON.toJSONString(authInfo);
        return getBase64Text(jsonText);
    }

    public static String getAuthInfoText(AuthInfo authInfo) throws UnsupportedEncodingException {
        String base64Text = getAuthInfoBase64(authInfo);
        return getUrlEncodedText(base64Text);
    }

    public static boolean checkAuthInfo(AuthInfo authInfo, String key) {
        long now = getUnixTime();
        if (authInfo.getExpires() >= now) {

            String token = getToken(authInfo.getTag(), key, authInfo.getExpires());

            return authInfo.getToken().equals(token);
        }
        return false;
    }

    public static boolean checkAuthInfoText(String authInfoText, String key) throws UnsupportedEncodingException {
        return checkAuthInfo(parseAuthInfoText(authInfoText), key);
    }

    public static boolean checkAuthInfoBase64(String authInfoBase64, String key) {
        return checkAuthInfo(parseAuthInfoBase64(authInfoBase64), key);
    }

    public static AuthInfo parseAuthInfoBase64(String authInfoBase64) {
        String jsonText = parseBase64Text(authInfoBase64);

        return AuthInfo.fromJsonText(jsonText, AuthInfo.class);
    }

    public static AuthInfo parseAuthInfoText(String authInfoText) throws UnsupportedEncodingException {
        String base64Text = parseUrlEncodedText(authInfoText);
        return parseAuthInfoBase64(base64Text);
    }

    public static String getToken(String tag, String key, long expiration) {
        String str = tag + key + expiration;
        return DigestUtils.md5DigestAsHex(str.getBytes(StandardCharsets.UTF_8));
    }

    public static long getAuthExpiration(int expiration) {
        return getUnixTime() + expiration;
    }

    public static long getUnixTime() {
        return new Date().getTime()/1000;
    }

    public static String getMd5Text(String text) {
        return DigestUtils.md5DigestAsHex(text.getBytes(StandardCharsets.UTF_8));
    }

    private static Base64.Encoder base64Encoder = Base64.getEncoder();
    public static String getBase64Text(String text) {
        return base64Encoder.encodeToString(text.getBytes(StandardCharsets.UTF_8));
    }

    private static Base64.Decoder base64Decoder = Base64.getDecoder();
    public static String parseBase64Text(String base64Text) {
        byte[] bytes = base64Decoder.decode(base64Text.getBytes(StandardCharsets.UTF_8));
        return new String(bytes, StandardCharsets.UTF_8);
    }

    public static String getUrlEncodedText(String text) throws UnsupportedEncodingException {
        return URLEncoder.encode(text, StandardCharsets.UTF_8.name());
    }

    public static String parseUrlEncodedText(String urlEncodedText) throws UnsupportedEncodingException {
        return URLDecoder.decode(urlEncodedText, StandardCharsets.UTF_8.name());
    }

}
```

##### 使用工具类

* 生成token

```
 AuthInfoHelper.getAuthInfoBase64(baoTag, baoKey, baoExpires); // 生成自定义token，每次请求需要携带该生成的token进行请求
```

* 检验token是否合法

  ```checkAuthInfo
  AuthInfoHelper.checkAuthInfo(authInfo, key); // authInfo是上面生成的token，key是双方协商定义的系统key
  ```

##### 补充

> 上方AuthInfoHelper 的辅助类

```
package com.pwc.safe;

/**
 * @ClassName AuthInfo
 * @Description:
 * @Author Kenny
 * @Date 2020/7/7
 **/

import com.alibaba.fastjson.JSONObject;
import com.alibaba.fastjson.annotation.JSONField;

import java.io.Serializable;
import java.util.Date;

public class AuthInfo implements Serializable {
    private static final long serialVersionUID = 2969080097480877691L;
    private String tag;

    private long expires;

    private String token;

    public String getTag() {
        return tag;
    }

    public void setTag(String tag) {
        this.tag = tag;
    }

    public long getExpires() {
        return expires;
    }

    @JSONField(serialize = false)
    public Date getExpiresDate() {
        return new Date(getExpires()*1000);
    }

    public void setExpires(long expires) {
        this.expires = expires;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }


    public static AuthInfo fromJsonText(String json, Class<AuthInfo> clz){
        return JSONObject.parseObject(json, clz);
    }

}
```
