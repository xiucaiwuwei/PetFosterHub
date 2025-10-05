package org.backend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.backend.A_general.base.controller.BaseController;
import org.backend.A_general.base.dto.BaseResponse;
import org.backend.dto.request.auth.VerificationCodeRequest;
import org.backend.dto.request.auth.VerificationCodeVerifyRequest;
import org.backend.service.VerificationCodeService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

/**
 * 验证码控制器
 * 处理手机号验证码的发送和获取请求
 */
@RestController
@RequestMapping("/verification-code")
@RequiredArgsConstructor
@Tag(name = "验证码服务", description = "验证码发送和验证接口")
public class VerificationCodeController extends BaseController {

    private static final Logger logger = LoggerFactory.getLogger(VerificationCodeController.class);

    private final VerificationCodeService verificationCodeService;
    
    @Value("${spring.profiles.active:}")
    private String activeProfile;

    /**
     * 验证码验证接口
     *
     * @param request 验证码验证请求对象，包含手机号、验证码、类型和角色信息
     * @return 验证结果响应，成功或失败信息
     */
    @PostMapping("/verify")
    @Operation(summary = "验证验证码", description = "验证用户输入的验证码是否正确")
    public ResponseEntity<BaseResponse<String>> verifyVerificationCode(
            @Valid @RequestBody VerificationCodeVerifyRequest request) {
        try {
            logger.info("收到验证码验证请求: 手机号={}, 类型={}", request.getPhone(), request.getType());

            // 调用验证码服务验证验证码
            boolean valid = verificationCodeService.verifyCode(request);

            if (valid) {
                logger.info("验证码验证成功: 手机号={}", request.getPhone());
                return super.success("验证码验证成功");
            } else {
                logger.warn("验证码验证失败: 手机号={}", request.getPhone());
                return super.failure("验证码错误或已过期");
            }
        } catch (Exception e) {
            logger.error("验证码验证异常: 手机号={}, 错误信息: {}", 
                    request != null && request.getPhone() != null ? request.getPhone() : "未知",
                    e.getMessage());
            return super.failure("验证码验证失败：" + e.getMessage());
        }
    }

    /**
     * 发送验证码接口
     *
     * @param request 验证码请求对象，包含手机号和验证码类型
     * @return 发送结果响应，成功或失败信息
     */
    @PostMapping("/send")
    @Operation(summary = "发送验证码", description = "向指定手机号发送验证码")
    public ResponseEntity<BaseResponse<String>> sendVerificationCode(
            @Valid @RequestBody VerificationCodeRequest request) {
        try {
            logger.info("收到发送验证码请求: 手机号={}, 类型={}", request.getPhone(), request.getType());

            // 调用验证码服务发送验证码
            boolean success = verificationCodeService.sendVerificationCode(request);

            if (success) {
                logger.info("验证码发送成功: 手机号={}", request.getPhone());
                return success("验证码发送成功，请注意查收");
            } else {
                logger.error("验证码发送失败: 手机号={}", request.getPhone());
                return failure("验证码发送失败，请稍后重试");
            }
        } catch (Exception e) {
            logger.error("发送验证码异常: 手机号={}, 异常信息={}", request.getPhone(), e.getMessage(), e);
            return failure("系统异常，请稍后重试");
        }
    }
    
    /**
     * 获取验证码接口（仅开发环境可用）
     * 用于开发者查看最新生成的验证码，方便调试
     *
     * @param request 验证码请求对象，包含手机号和验证码类型
     * @return 验证码信息，包括验证码和有效期
     */
    @PostMapping("/get-code")
    @Operation(summary = "获取验证码（仅开发环境）", description = "获取指定手机号和类型的验证码")
    public ResponseEntity<BaseResponse<Map<String, Object>>> getVerificationCode( @Valid @RequestBody VerificationCodeRequest request) {
        try {
            // 检查是否为开发环境
            if (!"dev".equals(activeProfile) && !"test".equals(activeProfile)) {
                logger.warn("非开发环境尝试访问验证码查看接口，环境标识: {}", activeProfile);
                return failure("该功能仅在开发环境可用");
            }
            logger.info("开发环境获取验证码请求: 手机号={}, 类型={}", request.getPhone(), request.getType());
            
            // 生成一个新的6位数字验证码
            String code = verificationCodeService.generateCode();
            
            // 构造返回数据
            Map<String, Object> result = new HashMap<>();
            result.put("code", code);
            result.put("expiresIn", 5); // 5分钟有效期
            
            return success("验证码获取成功", result);

        } catch (Exception e) {
            logger.error("获取验证码异常: 手机号={}, 异常信息={}", request.getPhone(), e.getMessage(), e);
            return failure("系统异常，请稍后重试");
        }
    }
}