package org.backend.service.impl;

import org.backend.A_general.base.utils.ValidationUtils;
import org.backend.dto.request.auth.VerificationCodeRequest;
import org.backend.dto.request.auth.VerificationCodeVerifyRequest;
import org.backend.service.SmsService;
import org.backend.service.VerificationCodeService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Random;
import java.util.concurrent.TimeUnit;

/**
 * 验证码服务实现类
 * 使用Redis存储验证码，集成真实短信服务，添加频率限制功能
 */
@Service
public class VerificationCodeServiceImpl implements VerificationCodeService {

    private static final Logger logger = LoggerFactory.getLogger(VerificationCodeServiceImpl.class);

    // 验证码有效期（分钟）
    private static final int CODE_EXPIRATION_MINUTES = 5;
    
    // Redis键前缀
    private static final String CODE_PREFIX = "verification_code:";
    private static final String RATE_LIMIT_PREFIX = "sms_rate_limit:";
    
    // Redis模板
    private final RedisTemplate<String, String> redisTemplate;
    
    // 短信服务
    private final SmsService smsService;
    
    // 频率限制配置
    private final int maxAttempts;
    private final int timeWindowSeconds;
    
    // 当前激活的环境配置
    private final String activeProfile;
    
    // 构造函数注入，提供默认值防止注入失败
    public VerificationCodeServiceImpl(RedisTemplate<String, String> redisTemplate,
                                     SmsService smsService,
                                     @Value("${sms.rate-limit.send-sms.max-attempts:5}") int maxAttempts,
                                     @Value("${sms.rate-limit.send-sms.time-window:1}") int timeWindowSeconds,
                                     @Value("${spring.profiles.active:}") String activeProfile) {
        this.redisTemplate = redisTemplate;
        this.smsService = smsService;
        this.maxAttempts = maxAttempts;
        this.timeWindowSeconds = timeWindowSeconds;
        this.activeProfile = activeProfile;
        logger.info("VerificationCodeServiceImpl initialized successfully with RedisTemplate: {}, SmsService: {}, maxAttempts: {}, timeWindowSeconds: {}, activeProfile: {}", 
                   redisTemplate != null, smsService != null, maxAttempts, timeWindowSeconds, activeProfile);
    }

    // 生成6位数字验证码
    @Override
    public String generateCode() {
        // 在开发和测试环境下，返回固定验证码123456
        if ("dev".equals(activeProfile) || "test".equals(activeProfile) || activeProfile.isEmpty()) {
            logger.info("开发环境下使用固定验证码: 123456");
            return "123456";
        }
        // 生产环境下生成随机验证码
        Random random = new Random();
        int code = 100000 + random.nextInt(900000); // 生成100000-999999之间的随机数
        return String.valueOf(code);
    }

    // 发送验证码
    @Override
    public boolean sendVerificationCode(VerificationCodeRequest request) {
        try {
            String phone = request.getPhone();
            String type = request.getType();

            // 验证参数
            if (phone == null || phone.isEmpty() || type == null || type.isEmpty()) {
                logger.error("手机号或验证码类型不能为空");
                return false;
            }

            // 使用通用验证工具验证手机号格式
            if (!ValidationUtils.isValidPhone(phone)) {
                logger.error("验证码服务: 手机号格式不正确: {}", phone);
                return false;
            }

            // 验证验证码类型
            if (!isValidCodeType(type)) {
                logger.error("无效的验证码类型: {}", type);
                return false;
            }
            
            // 检查频率限制
            if (!checkRateLimit(phone)) {
                logger.error("发送频率过高，请稍后再试: {}", phone);
                return false;
            }

            // 生成验证码
            String code = generateCode();

            // 计算过期时间
            LocalDateTime expiryTime = LocalDateTime.now().plusMinutes(CODE_EXPIRATION_MINUTES);
            String expiryTimeStr = expiryTime.format(DateTimeFormatter.ISO_LOCAL_DATE_TIME);

            // 存储验证码到Redis
            String cacheKey = generateCodeKey(phone, type);
            redisTemplate.opsForValue().set(
                cacheKey,
                code,
                CODE_EXPIRATION_MINUTES,
                TimeUnit.MINUTES
            );
            
            // 存储过期时间（可选）
            redisTemplate.opsForValue().set(
                cacheKey + ":expiry",
                expiryTimeStr,
                CODE_EXPIRATION_MINUTES,
                TimeUnit.MINUTES
            );

            // 开发环境判断优化，确保正确跳过实际短信发送
            boolean isDevEnvironment = "dev".equals(activeProfile) || "test".equals(activeProfile) || activeProfile.isEmpty();
            if (isDevEnvironment) {
                logger.info("开发/测试环境下跳过短信发送，验证码已存储: {} (类型: {}，过期时间: {})",
                        code, type, expiryTime);
                logger.info("当前环境: {}", activeProfile.isEmpty() ? "未设置(默认视为开发环境)" : activeProfile);
                
                // 增加发送计数（用于频率限制）
                incrementSendCount(phone);
                
                return true;
            } else {
                // 生产环境下调用短信服务发送真实短信
                try {
                    boolean sendSuccess = smsService.sendVerificationCode(phone, code, type);
                    
                    if (sendSuccess) {
                        logger.info("向手机号 {} 发送验证码成功 (类型: {}，过期时间: {})",
                                phone, type, expiryTime);
                        
                        // 增加发送计数（用于频率限制）
                        incrementSendCount(phone);
                        
                        return true;
                    } else {
                        logger.error("向手机号 {} 发送验证码失败", phone);
                        
                        // 发送失败，删除存储的验证码
                        redisTemplate.delete(cacheKey);
                        redisTemplate.delete(cacheKey + ":expiry");
                        
                        return false;
                    }
                } catch (Exception smsEx) {
                    logger.error("短信服务调用异常: {}", smsEx.getMessage());
                    // 即使短信服务失败，开发环境下也返回成功
                    if (!activeProfile.contains("prod")) {
                        logger.info("非生产环境下短信服务异常，视为发送成功");
                        incrementSendCount(phone);
                        return true;
                    }
                    return false;
                }
            }
        } catch (Exception e) {
            logger.error("发送验证码失败: {}", e.getMessage(), e);
            return false;
        }
    }

    // 验证验证码
    @Override
    public boolean verifyCode(VerificationCodeVerifyRequest request) {
        try {
            String phone = request.getPhone();
            String code = request.getCode();
            String type = request.getType() != null ? request.getType().getValue() : null;

            // 验证参数
            if (phone == null || phone.isEmpty() || code == null || code.isEmpty() || type == null || type.isEmpty()) {
                logger.error("手机号、验证码或类型不能为空");
                return false;
            }

            // 使用通用验证工具验证手机号格式
            if (!ValidationUtils.isValidPhone(phone)) {
                logger.error("验证码服务: 手机号格式不正确: {}", phone);
                return false;
            }

            // 验证验证码类型
            if (!isValidCodeType(type)) {
                logger.error("无效的验证码类型: {}", type);
                return false;
            }

            String cacheKey = generateCodeKey(phone, type);
            String storedCode = redisTemplate.opsForValue().get(cacheKey);

            if (storedCode == null) {
                logger.info("验证码不存在或已被使用");
                return false;
            }

            // 验证验证码是否匹配
            boolean isValid = code.equals(storedCode);

            // 验证通过后，移除验证码，防止重复使用
            if (isValid) {
                redisTemplate.delete(cacheKey);
                redisTemplate.delete(cacheKey + ":expiry");
                logger.info("手机号 {} 的验证码验证成功", phone);
            } else {
                logger.info("手机号 {} 的验证码验证失败，验证码不匹配", phone);
            }

            return isValid;
        } catch (Exception e) {
            logger.error("验证验证码失败: {}", e.getMessage(), e);
            return false;
        }
    }

    // 生成验证码缓存键
    private String generateCodeKey(String phone, String type) {
        return CODE_PREFIX + phone + ":" + type;
    }
    
    // 生成频率限制键
    private String generateRateLimitKey(String phone) {
        return RATE_LIMIT_PREFIX + phone;
    }
    
    // 检查频率限制
    private boolean checkRateLimit(String phone) {
        String rateLimitKey = generateRateLimitKey(phone);
        
        // 获取当前计数
        String countStr = redisTemplate.opsForValue().get(rateLimitKey);
        if (countStr != null) {
            int count = Integer.parseInt(countStr);
            return count < maxAttempts;
        }
        
        return true;
    }
    
    // 增加发送计数
    private void incrementSendCount(String phone) {
        String rateLimitKey = generateRateLimitKey(phone);
        
        // 递增计数，如果键不存在则创建并设置过期时间
        Long count = redisTemplate.opsForValue().increment(rateLimitKey);
        if (count != null && count == 1) {
            // 第一次发送，设置过期时间
            redisTemplate.expire(rateLimitKey, timeWindowSeconds, TimeUnit.SECONDS);
        }
    }

    // 验证验证码类型是否有效
    private boolean isValidCodeType(String type) {
        return "login".equals(type) || "register".equals(type) || "resetPassword".equals(type);
    }

}