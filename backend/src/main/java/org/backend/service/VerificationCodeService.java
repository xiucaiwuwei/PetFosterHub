package org.backend.service;

import org.backend.dto.request.auth.VerificationCodeRequest;
import org.backend.dto.request.auth.VerificationCodeVerifyRequest;

/**
 * 验证码服务接口
 * 用于处理手机号验证码的发送和验证逻辑
 */
public interface VerificationCodeService {

    /**
     * 发送验证码
     *
     * @param request 验证码请求对象，包含手机号和验证码类型
     * @return 是否发送成功
     */
    boolean sendVerificationCode(VerificationCodeRequest request);

    /**
     * 验证验证码
     *
     * @param request 验证码验证请求对象，包含手机号、验证码和类型
     * @return 验证是否通过
     */
    boolean verifyCode(VerificationCodeVerifyRequest request);

    /**
     * 生成验证码
     *
     * @return 6位数字验证码
     */
    String generateCode();
}