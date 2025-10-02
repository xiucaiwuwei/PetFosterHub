package org.backend.service.impl;

import jakarta.validation.Valid;
import org.backend.base.utils.JwtUtil;
import org.backend.dto.request.auth.*;
import org.backend.dto.response.auth.LoginResponse;
import org.backend.entity.User;
import org.backend.entity.enums.LoginType;
import org.backend.entity.enums.UserRole;
import org.backend.entity.enums.VerificationCodeType;
import org.backend.service.AuthService;
import org.backend.service.UserService;
import org.backend.service.VerificationCodeService;
import org.backend.utils.ValidationUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

/**
 * 认证服务实现类
 * 实现用户登录验证和响应生成等功能
 */
@Service
public class AuthServiceImpl implements AuthService {
    
    private static final Logger logger = LoggerFactory.getLogger(AuthServiceImpl.class);
    
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final VerificationCodeService verificationCodeService;
    
    @Autowired
    public AuthServiceImpl(UserService userService, PasswordEncoder passwordEncoder, JwtUtil jwtUtil, VerificationCodeService verificationCodeService) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.verificationCodeService = verificationCodeService;
    }
    
    /**
     * 根据登录请求验证用户身份，支持密码登录和验证码登录
     */
    @Override
    public User authenticateUser(LoginRequest loginRequest) {
        // 验证手机号格式
        if (!ValidationUtil.isValidPhone(loginRequest.getPhone())) {
            throw new IllegalArgumentException("手机号格式不正确");
        }

        User user = userService.findByPhoneAndRole(loginRequest.getPhone(), loginRequest.getRole());
        
        if (loginRequest.getLoginType() == LoginType.PASSWORD) {
            // 密码登录验证
            if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
                throw new IllegalArgumentException("密码错误");
            }
        } else if (loginRequest.getLoginType() == LoginType.VERIFICATION_CODE) {
            // 验证码登录验证
            if (!userService.verifyCode(loginRequest.getPhone(), loginRequest.getVerificationCode(),
                    VerificationCodeType.LOGIN)) {
                throw new IllegalArgumentException("验证码错误或已过期");
            }
        } else {
            throw new IllegalArgumentException("不支持的登录类型");
        }
        return user;
    }
    
    /**
     * 生成登录响应
     */
    @Override
    public LoginResponse generateLoginResponse(User user) {
        String jwt = jwtUtil.generateToken(user);
        String refreshToken = jwtUtil.generateRefreshToken(user);
        return new LoginResponse(
                jwt,
                refreshToken,
                user.getId().intValue(), // 将Long类型转换为Integer类型
                user.getPhone(),
                user.getRole(),
                user.getNickname(),
                user.getAvatar());
    }
    
    /**
     * 验证注册信息
     */
    @Override
    public void validateRegistration(RegisterRequest registerRequest) {
        // 验证手机号格式
        if (!ValidationUtil.isValidPhone(registerRequest.getPhone())) {
            throw new IllegalArgumentException("手机号格式不正确");
        }
        
        // 检查手机号和角色的组合是否已存在
        if (userService.existsByPhoneAndRole(registerRequest.getPhone(), registerRequest.getRole())) {
            throw new IllegalArgumentException("该手机号已注册该角色");
        }
        
        // 验证验证码
        VerificationCodeVerifyRequest verifyRequest = new VerificationCodeVerifyRequest();
        verifyRequest.setPhone(registerRequest.getPhone());
        verifyRequest.setCode(registerRequest.getVerificationCode());
        verifyRequest.setType(VerificationCodeType.REGISTER);
        
        if (!verificationCodeService.verifyCode(verifyRequest)) {
            throw new IllegalArgumentException("验证码错误或已过期");
        }
    }
    
    /**
     * 从注册请求创建用户对象
     */
    @Override
    public User createUserFromRequest(RegisterRequest registerRequest) {
        // 注意：这里不再调用validateRegistration，因为在Controller层已经验证过了
        // 直接创建用户对象
        
        User newUser = new User();
        newUser.setPhone(registerRequest.getPhone());
        // 设置默认密码以应对数据库非空判断
        newUser.setPassword(passwordEncoder.encode("123456"));
        newUser.setRole(registerRequest.getRole());
        // 设置idCard为null以避免数据库非空约束错误
        newUser.setIdCard(null);
        return newUser;
    }
    

    
    /**
     * 根据参数查找用户（包含参数验证）
     */
    @Override
    public User findUserByParams(@Valid GetUserInfoRequest params) {
        if (params == null) {
            throw new IllegalArgumentException("参数不能为空");
        }
        
        String phone = params.getPhone();
        UserRole role = params.getRole();
        
        if (phone == null || phone.isEmpty()) {
            throw new IllegalArgumentException("手机号不能为空");
        }
        
        if (role == null) {
            throw new IllegalArgumentException("角色不能为空");
        }
        
        if (!ValidationUtil.isValidPhone(phone)) {
            throw new IllegalArgumentException("手机号格式不正确");
        }
        
        return userService.findByPhoneAndRole(phone, role);
    }
    
    /**
     * 提取并验证刷新令牌
     */
    @Override
    public String extractRefreshToken(Map<String, String> refreshTokenRequest) {
        if (refreshTokenRequest == null) {
            throw new IllegalArgumentException("请求参数不能为空");
        }
        
        String refreshToken = refreshTokenRequest.get("refreshToken");
        if (refreshToken == null || refreshToken.isEmpty()) {
            throw new IllegalArgumentException("刷新令牌不能为空");
        }
        
        if (!jwtUtil.validateToken(refreshToken)) {
            throw new IllegalArgumentException("无效的刷新令牌");
        }
        
        return refreshToken;
    }
    
    /**
     * 验证刷新令牌（兼容旧接口调用）
     */
    @Override
    public void validateRefreshToken(String refreshToken) {
        // 直接复用extractRefreshToken中的验证逻辑
        Map<String, String> tokenMap = new HashMap<>();
        tokenMap.put("refreshToken", refreshToken);
        extractRefreshToken(tokenMap);
    }
    
    /**
     * 确保用户已认证
     */
    @Override
    public void ensureAuthenticated(Authentication authentication) {
        if (authentication == null) {
            throw new IllegalArgumentException("用户未登录，请先登录");
        }
    }
    
    /**
     * 更新用户详情
     */
    @Override
    public void updateUserDetails(User user, UpdateUserInfoRequest updateUserInfoRequest) {
        // 更新昵称
        if (updateUserInfoRequest.getNickname() != null && !updateUserInfoRequest.getNickname().isEmpty()) {
            user.setNickname(updateUserInfoRequest.getNickname());
        }
        
        // 更新密码
        if (updateUserInfoRequest.getPassword() != null && !updateUserInfoRequest.getPassword().isEmpty()) {
            // 验证密码复杂度
            if (!ValidationUtil.isValidPassword(updateUserInfoRequest.getPassword())) {
                throw new IllegalArgumentException("密码必须包含字母和数字，长度8-20位");
            }
            user.setPassword(passwordEncoder.encode(updateUserInfoRequest.getPassword()));
        }
    }
}