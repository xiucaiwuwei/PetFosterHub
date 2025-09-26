package org.backend.service;

/**
 * 短信服务接口
 * 提供发送短信验证码的功能
 */
public interface SmsService {
    
    /**
     * 发送短信验证码
     * @param phone 手机号码
     * @param code 验证码
     * @param type 验证码类型
     * @return 是否发送成功
     */
    boolean sendVerificationCode(String phone, String code, String type);
}