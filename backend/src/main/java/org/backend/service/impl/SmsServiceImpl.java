package org.backend.service.impl;

import com.aliyuncs.DefaultAcsClient;
import com.aliyuncs.IAcsClient;
import com.aliyuncs.exceptions.ClientException;
import com.aliyuncs.profile.DefaultProfile;
import com.aliyuncs.profile.IClientProfile;
import com.aliyuncs.afs.model.v20180112.AuthenticateSigRequest;
import com.aliyuncs.afs.model.v20180112.AuthenticateSigResponse;
import org.backend.service.SmsService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

/**
 * 短信服务实现类
 * 集成阿里云验证码服务功能
 */
@Service("smsService")
@Profile({"prod", "default"}) // 只在生产和默认环境使用
public class SmsServiceImpl implements SmsService {

    private static final Logger logger = LoggerFactory.getLogger(SmsServiceImpl.class);
    
    // 阿里云验证码服务配置
    private final String regionId;
    private final String accessKeyId;
    private final String accessKeySecret;
    private final String appKey;
    
    // 构造函数注入，提供默认值防止注入失败
    public SmsServiceImpl(@Value("${sms.api.regionId:cn-hangzhou}") String regionId,
                         @Value("${sms.api.secretId:your_access_key_id}") String accessKeyId,
                         @Value("${sms.api.secretKey:your_access_key_secret}") String accessKeySecret,
                         @Value("${sms.app.key:your_app_key}") String appKey) {
        this.regionId = regionId;
        this.accessKeyId = accessKeyId;
        this.accessKeySecret = accessKeySecret;
        this.appKey = appKey;
        logger.info("SmsServiceImpl initialized successfully for production environment with regionId: {}, appKey: {}, loaded from configuration: {}", 
                   regionId, appKey, !regionId.equals("cn-hangzhou"));
    }
    
    /**
     * 发送短信验证码
     * @param phone 手机号码
     * @param code 验证码
     * @param type 验证码类型
     * @return 是否发送成功
     */
    @Override
    public boolean sendVerificationCode(String phone, String code, String type) {
        try {
            logger.debug("准备使用阿里云SDK发送验证码到 {}, 验证码: {}, 类型: {}", phone, code, type);
            
            // 创建IClientProfile实例
            IClientProfile profile = DefaultProfile.getProfile(regionId, accessKeyId, accessKeySecret);
            IAcsClient client = new DefaultAcsClient(profile);
            DefaultProfile.addEndpoint(regionId, regionId, "afs", "afs.aliyuncs.com");
            
            // 构建请求对象
            AuthenticateSigRequest request = new AuthenticateSigRequest();
            request.setSessionId(phone + "_" + type); // 会话ID，使用手机号和类型组合
            request.setSig(code); // 签名串，这里使用验证码
            request.setToken(code); // 请求唯一标识，这里使用验证码
            request.setScene(type); // 场景标识，与前端页面填写数据一致
            request.setAppKey(appKey); // 应用类型标识
            request.setRemoteIp("127.0.0.1"); // 客户端IP，实际应用中应获取真实客户端IP
            
            // 发送请求并获取响应
            AuthenticateSigResponse response = client.getAcsResponse(request);
            
            // 处理响应结果
            logger.debug("验证码服务响应: {}", response.toString());
            
            // 检查验签结果，100表示验签通过，900表示验签失败
            if (response.getCode() == 100) {
                logger.info("验证码服务调用成功: {}, 会话ID: {}", phone, request.getSessionId());
                return true;
            } else {
                logger.error("验证码服务调用失败: {}, 错误码: {}, 错误信息: {}", 
                            phone, response.getCode(), response.getMsg());
            }
            
            return false;
        } catch (ClientException e) {
            logger.error("发送验证码异常(ClientException): {}", e.getMessage(), e);
            return false;
        } catch (Exception e) {
            logger.error("发送验证码异常: {}", e.getMessage(), e);
            return false;
        }
    }
}