package org.backend.service.impl;

import org.backend.service.SmsService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

/**
 * 模拟短信服务实现类
 * 用于开发和测试环境，不发送真实短信
 */
@Service("smsService")
@Profile({"dev", "test"}) // 在开发和测试环境使用
public class MockSmsServiceImpl implements SmsService {

    private static final Logger logger = LoggerFactory.getLogger(MockSmsServiceImpl.class);
    
    // 是否模拟发送失败
    private final boolean mockFail;
    
    // 构造函数注入，提供默认值防止注入失败
    public MockSmsServiceImpl(@Value("${sms.api.regionId:cn-hangzhou}") String regionId,
                             @Value("${sms.api.secretId:your_access_key_id}") String accessKeyId,
                             @Value("${sms.api.secretKey:your_access_key_secret}") String accessKeySecret,
                             @Value("${sms.app.key:your_app_key}") String appKey,
                             @Value("${sms.mock.fail:false}") boolean mockFail) {
        this.mockFail = mockFail;
        logger.info("MockSmsServiceImpl initialized successfully for dev/test environment with mockFail={}", mockFail);
        logger.debug("MockSmsService configuration - regionId: {}, appKey: {}", 
                    regionId, appKey);
    }
    
    /**
     * 模拟发送短信验证码
     * @param phone 手机号码
     * @param code 验证码
     * @param type 验证码类型
     * @return 是否发送成功
     */
    @Override
    public boolean sendVerificationCode(String phone, String code, String type) {
        try {
            // 记录模拟发送的短信信息
            logger.info("[模拟发送短信] 向手机号 {} 发送验证码 {} (类型: {})", phone, code, type);
            
            // 模拟短信内容
            String messageContent = generateMessageContent(code, type);
            logger.info("[模拟发送短信] 短信内容: {}", messageContent);
            
            // 如果配置了模拟失败，则返回失败
            if (mockFail) {
                logger.warn("[模拟发送短信] 模拟发送失败");
                return false;
            }
            
            // 模拟网络延迟
            try {
                Thread.sleep(500); // 模拟500ms的发送延迟
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
            
            logger.info("[模拟发送短信] 发送成功");
            return true;
        } catch (Exception e) {
            logger.error("[模拟发送短信] 发生异常: {}", e.getMessage(), e);
            return false;
        }
    }
    
    /**
     * 生成短信内容
     * @param code 验证码
     * @param type 验证码类型
     * @return 短信内容
     */
    private String generateMessageContent(String code, String type) {
        String purpose = switch (type) {
            case "login" -> "登录验证"; 
            case "register" -> "注册验证"; 
            case "resetPassword" -> "密码重置"; 
            default -> "验证"; 
        };
        
        return String.format("您的%s验证码是：%s，有效期5分钟，请勿泄露给他人。【宠物寄养中心】", purpose, code);
    }
}