package org.backend.service;

import jakarta.validation.Valid;
import org.backend.dto.request.auth.GetUserInfoRequest;
import org.backend.dto.request.auth.LoginRequest;
import org.backend.dto.request.auth.RegisterRequest;
import org.backend.dto.request.auth.UpdateUserInfoRequest;
import org.backend.dto.response.auth.LoginResponse;
import org.backend.entity.User;
import org.springframework.security.core.Authentication;

import java.util.Map;

/**
 * 认证服务接口
 * 提供用户登录、注册、更新信息、令牌管理等认证相关功能
 */
public interface AuthService {
    
    /**
     * 根据登录请求验证用户身份
     * @param loginRequest 登录请求对象
     * @return 验证通过的用户对象
     */
    User authenticateUser(LoginRequest loginRequest);
    

    
    /**
     * 生成登录响应
     * @param user 用户对象
     * @return 登录响应对象
     */
    LoginResponse generateLoginResponse(User user);
    
    /**
     * 验证注册信息（手机号、角色和验证码）
     * @param registerRequest 注册请求对象
     */
    void validateRegistration(RegisterRequest registerRequest);
    
    /**
     * 从注册请求创建用户对象（设置默认密码以应对数据库非空判断）
     * @param registerRequest 注册请求对象
     * @return 创建的用户对象
     */
    User createUserFromRequest(RegisterRequest registerRequest);
    
    /**
     * 根据手机号和角色查找用户（包含参数验证）
     * @param params 包含手机号和角色信息的查询请求
     * @return 找到的用户对象
     */
    User findUserByParams(@Valid GetUserInfoRequest params);
    
    /**
     * 提取刷新令牌
     * @param refreshTokenRequest 刷新令牌请求
     * @return 刷新令牌字符串
     */
    String extractRefreshToken(Map<String, String> refreshTokenRequest);
    
    /**
     * 验证刷新令牌
     * @param refreshToken 刷新令牌
     */
    void validateRefreshToken(String refreshToken);
    
    /**
     * 确保用户已认证
     * @param authentication 认证对象
     */
    void ensureAuthenticated(Authentication authentication);
    
    /**
     * 更新用户详情
     * @param user 用户对象
     * @param updateUserInfoRequest 更新信息请求
     */
    void updateUserDetails(User user, UpdateUserInfoRequest updateUserInfoRequest);
}