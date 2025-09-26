package org.backend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.Getter;
import org.backend.base.controller.BaseController;
import org.backend.base.dto.BaseResponse;
import org.backend.base.utils.JwtUtil;
import org.backend.dto.request.auth.GetUserInfoRequest;
import org.backend.dto.request.auth.LoginRequest;
import org.backend.dto.request.auth.RegisterRequest;
import org.backend.dto.request.auth.UpdateUserInfoRequest;
import org.backend.dto.response.auth.LoginResponse;
import org.backend.dto.response.auth.UserInfoResponse;
import org.backend.entity.User;
import org.backend.service.AuthService;
import org.backend.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

/**
 * 认证控制器
 * 处理用户登录、注册、令牌刷新和登出等认证相关操作
 */
@Tag(name = "认证管理", description = "用户认证相关接口")
@RestController
@RequestMapping("/api/auth")
public class AuthController extends BaseController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    private final AuthService authService;
    private final UserService userService;
    @Getter
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Autowired
    public AuthController(AuthService authService, UserService userService, PasswordEncoder passwordEncoder,
                          JwtUtil jwtUtil) {
        this.authService = authService;
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    /**
     * 用户登录接口
     * 支持密码登录和验证码登录两种方式
     *
     * @param loginRequest 登录请求对象，包含手机号、密码、验证码、登录类型和角色信息
     * @return 登录结果响应，包含访问令牌、刷新令牌等信息
     */
    @Operation(summary = "用户登录", description = "支持密码登录和验证码登录两种方式")
    @PostMapping("/login")
    public ResponseEntity<BaseResponse<LoginResponse>> login(@RequestBody @Valid LoginRequest loginRequest) {
        try {
            User user = authService.authenticateUser(loginRequest);
            LoginResponse loginResponse = authService.generateLoginResponse(user);
            logger.info("用户登录成功，用户ID: {}, 手机号: {}", user.getId(), user.getPhone());
            return super.success("登录成功", loginResponse);
        } catch (Exception e) {
            logger.warn("用户登录失败，手机号: {}, 错误信息: {}",
                    loginRequest != null && loginRequest.getPhone() != null ? loginRequest.getPhone() : "未知",
                    e.getMessage());
            return super.failure("登录失败：" + e.getMessage());
        }
    }

    /**
     * 用户注册接口
     * 验证手机号和验证码，创建新用户
     *
     * @param registerRequest 注册请求对象，包含手机号、验证码和角色信息
     * @return 注册结果响应
     */
    @Operation(summary = "用户注册", description = "验证手机号和验证码，创建新用户")
    @PostMapping("/register")
    public ResponseEntity<BaseResponse<Object>> register(@RequestBody @Valid RegisterRequest registerRequest) {
        try {
            authService.validateRegistration(registerRequest);
            User newUser = authService.createUserFromRequest(registerRequest);
            User savedUser = userService.saveUser(newUser);

            logger.info("用户注册成功，用户ID: {}, 手机号: {}", savedUser.getId(), savedUser.getPhone());
            return super.success("注册成功");
        } catch (Exception e) {
            logger.warn("用户注册失败，手机号: {}, 错误信息: {}",
                    registerRequest != null && registerRequest.getPhone() != null ? registerRequest.getPhone() : "未知",
                    e.getMessage());
            return super.failure("注册失败：" + e.getMessage());
        }
    }

    /**
     * 根据手机号和角色查询用户信息
     * 支持前端通过手机号和角色组合查询用户信息
     *
     * @param getUserInfoRequest 查询用户信息请求对象，包含phone和role
     * @return 用户信息响应
     */
    @Operation(summary = "查询用户信息", description = "根据手机号和角色查询用户信息")
    @PostMapping("/get-user-info")
    public ResponseEntity<BaseResponse<UserInfoResponse>> getUserInfo(
            @RequestBody @Valid GetUserInfoRequest getUserInfoRequest) {
        try {

            User user = authService.findUserByParams(getUserInfoRequest);

            // 将User对象转换为UserInfoResponse对象
            UserInfoResponse userInfoResponse = new UserInfoResponse(
                    user.getId(),
                    user.getPhone(),
                    user.getAvatar(),
                    user.getNickname(),
                    user.getRole()
            );

            logger.info("查询用户信息成功，用户ID: {}", user.getId());
            return super.success("查询成功", userInfoResponse);
        } catch (IllegalArgumentException e) {
            logger.warn("查询用户信息失败，错误信息: {}", e.getMessage());
            return super.failure(e.getMessage());
        } catch (Exception e) {
            logger.error("查询用户信息时发生系统错误", e);
            return super.internalServerError("查询用户信息失败");
        }
    }

    /**
     * 刷新访问令牌接口
     * 使用刷新令牌获取新地访问令牌
     *
     * @param refreshTokenRequest 刷新令牌请求对象，包含刷新令牌
     * @return 新地访问令牌
     */
    @Operation(summary = "刷新访问令牌", description = "使用刷新令牌获取新的访问令牌")
    @PostMapping("/refresh")
    public ResponseEntity<BaseResponse<Map<String, String>>> refresh(
            @RequestBody Map<String, String> refreshTokenRequest) {
        try {
            // 简化调用，因为extractRefreshToken已经包含验证逻辑
            String refreshToken = authService.extractRefreshToken(refreshTokenRequest);

            Long userId = jwtUtil.getUserIdFromToken(refreshToken);
            if (userId == null) {
                throw new IllegalArgumentException("无法从令牌获取用户信息");
            }

            User user = userService.findById(userId)
                    .orElseThrow(() -> new IllegalArgumentException("用户不存在"));

            String newAccessToken = jwtUtil.generateToken(user);
            Map<String, String> tokens = new HashMap<>();
            tokens.put("accessToken", newAccessToken);

            logger.info("令牌刷新成功，用户ID: {}", userId);
            return super.success("令牌刷新成功", tokens);
        } catch (IllegalArgumentException e) {
            logger.warn("令牌刷新失败，错误信息: {}", e.getMessage());
            return super.failure(e.getMessage());
        } catch (Exception e) {
            logger.error("刷新令牌时发生系统错误", e);
            return super.internalServerError("令牌刷新失败");
        }
    }

    /**
     * 用户登出接口
     * 清除用户的认证信息
     *
     * @param request  HTTP请求对象
     * @param response HTTP响应对象
     * @return 登出结果响应
     */
    @Operation(summary = "用户登出", description = "清除用户的认证信息")
    @PostMapping("/logout")
    public ResponseEntity<BaseResponse<Object>> logout(HttpServletRequest request, HttpServletResponse response) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null) {
            new SecurityContextLogoutHandler().logout(request, response, auth);
            logger.info("用户登出成功，用户名: {}", auth.getName());
        } else {
            logger.info("用户未登录，无需登出操作");
        }
        return super.success("登出成功");
    }

    /**
     * 更新用户信息接口
     *
     * @param updateUserInfoRequest 用户信息更新请求对象
     * @param authentication        当前用户认证信息
     * @return 更新结果响应
     */
    @Operation(summary = "更新用户信息", description = "更新用户昵称、密码等信息")
    @PostMapping("/update-info")
    public ResponseEntity<BaseResponse<Object>> updateUserInfo(
            @RequestBody @Valid UpdateUserInfoRequest updateUserInfoRequest,
            Authentication authentication) {
        try {
            authService.ensureAuthenticated(authentication);

            Long userId = Long.parseLong(authentication.getName());
            User user = userService.findById(userId)
                    .orElseThrow(() -> new IllegalArgumentException("用户不存在"));

            authService.updateUserDetails(user, updateUserInfoRequest);
            userService.saveUser(user);

            logger.info("用户信息更新成功，用户ID: {}", userId);
            return super.success("用户信息更新成功");
        } catch (IllegalArgumentException e) {
            logger.warn("用户信息更新失败，用户ID: {}, 错误信息: {}",
                    authentication != null ? authentication.getName() : "未知",
                    e.getMessage());
            return super.failure(e.getMessage());
        } catch (Exception e) {
            logger.error("更新用户信息时发生系统错误", e);
            return super.internalServerError("用户信息更新失败");
        }
    }

}
