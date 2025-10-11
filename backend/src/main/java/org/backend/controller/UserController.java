package org.backend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.backend.A_general.base.controller.BaseController;
import org.backend.A_general.base.dto.BaseResponse;
import org.backend.A_general.base.utils.ValidationUtils;
import org.backend.dto.request.UserRequest;
import org.backend.dto.response.user.UserProfileResponse;
import org.backend.entity.User;
import org.backend.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@Tag(name = "用户管理", description = "用户信息管理接口")
public class UserController extends BaseController {

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);
    private final UserService userService;

    @GetMapping("/profile")
    @Operation(summary = "获取当前用户信息")
    public ResponseEntity<BaseResponse<UserProfileResponse>> getCurrentUser(Authentication authentication) {
        try {
            logger.info("开始获取当前用户信息，用户ID: {}", authentication.getName());
            Long userId = Long.parseLong(authentication.getName());
            User user = userService.findById(userId)
                    .orElseThrow(() -> new RuntimeException("用户不存在"));
            
            UserProfileResponse responseDTO = convertToResponseDTO(user);
            logger.info("获取当前用户信息成功，用户ID: {}", userId);
            return super.success("获取成功", responseDTO);
        } catch (Exception e) {
            logger.error("获取当前用户信息失败: {}", e.getMessage(), e);
            throw e;
        }
    }

    @PutMapping("/profile")
    @Operation(summary = "更新当前用户信息")
    public ResponseEntity<BaseResponse<UserProfileResponse>> updateCurrentUser(
            Authentication authentication,
            @Valid @RequestBody UserRequest userDTO) {
        try {
            logger.info("开始更新当前用户信息，用户ID: {}", authentication.getName());
            Long userId = Long.parseLong(authentication.getName());
            User user = userService.findById(userId)
                    .orElseThrow(() -> new RuntimeException("用户不存在"));

            // 验证手机号格式
            if (userDTO.getPhone() != null && !ValidationUtils.isValidPhone(userDTO.getPhone())) {
                logger.warn("用户ID: {}，手机号格式不正确: {}", userId, userDTO.getPhone());
                throw new RuntimeException("手机号格式不正确");
            }

            // 更新用户信息
            if (userDTO.getFullName() != null) {
                logger.debug("用户ID: {}，更新全名: {}", userId, userDTO.getFullName());
                user.setFullName(userDTO.getFullName());
            }
            if (userDTO.getPhone() != null) {
                logger.debug("用户ID: {}，更新手机号: {}", userId, userDTO.getPhone());
                user.setPhone(userDTO.getPhone());
            }
            if (userDTO.getAddress() != null) {
                logger.debug("用户ID: {}，更新地址: {}", userId, userDTO.getAddress());
                user.setAddress(userDTO.getAddress());
            }
            if (userDTO.getBio() != null) {
                logger.debug("用户ID: {}，更新个人简介", userId);
                user.setBio(userDTO.getBio());
            }

            User updatedUser = userService.saveUser(user);
            UserProfileResponse responseDTO = convertToResponseDTO(updatedUser);
            logger.info("更新当前用户信息成功，用户ID: {}", userId);
            return super.success("更新成功", responseDTO);
        } catch (RuntimeException e) {
            logger.warn("更新用户信息失败，用户ID: {}, 错误信息: {}", 
                    authentication != null ? authentication.getName() : "未知", e.getMessage());
            throw e;
        } catch (Exception e) {
            logger.error("更新用户信息时发生系统错误，用户ID: {}", 
                    authentication != null ? authentication.getName() : "未知", e);
            throw e;
        }
    }

    @GetMapping("/{id}")
    @Operation(summary = "根据ID获取用户信息")
    public ResponseEntity<BaseResponse<UserProfileResponse>> getUserById(@PathVariable Long id) {
        try {
            logger.info("开始根据ID获取用户信息，用户ID: {}", id);
            User user = userService.getUserById(id)
                    .orElseThrow(() -> new RuntimeException("用户不存在"));

            UserProfileResponse responseDTO = convertToResponseDTO(user);
            logger.info("根据ID获取用户信息成功，用户ID: {}", id);
            return super.success("获取成功", responseDTO);
        } catch (RuntimeException e) {
            logger.warn("根据ID获取用户信息失败，用户ID: {}, 错误信息: {}", id, e.getMessage());
            throw e;
        } catch (Exception e) {
            logger.error("根据ID获取用户信息时发生系统错误，用户ID: {}", id, e);
            throw e;
        }
    }

    @DeleteMapping("/account")
    @Operation(summary = "删除当前用户账户")
    public ResponseEntity<BaseResponse<String>> deleteCurrentUser(Authentication authentication) {
        try {
            logger.info("开始删除当前用户账户，用户ID: {}", authentication.getName());
            Long userId = Long.parseLong(authentication.getName());
            userService.deleteById(userId);
            logger.info("删除当前用户账户成功，用户ID: {}", userId);
            return super.success("账户删除成功");
        } catch (Exception e) {
            logger.error("删除用户账户失败，用户ID: {}, 错误信息: {}", 
                    authentication != null ? authentication.getName() : "未知", e.getMessage(), e);
            throw e;
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
    @PostMapping("/logout")
    @Operation(summary = "用户登出", description = "清除用户的认证信息")
    public ResponseEntity<BaseResponse<String>> logout(HttpServletRequest request, HttpServletResponse response) {
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
     * 将User实体转换为UserProfileResponse DTO
     * 用于消除重复代码，提高可维护性
     * 
     * @param user 用户实体
     * @return 用户资料响应DTO
     */
    private UserProfileResponse convertToResponseDTO(User user) {
        UserProfileResponse responseDTO = new UserProfileResponse();
        responseDTO.setId(user.getId());
        responseDTO.setPhone(user.getPhone());
        responseDTO.setAvatar(user.getAvatar());
        responseDTO.setNickname(user.getNickname());
        responseDTO.setRole(user.getRole());
        responseDTO.setFullName(user.getFullName());
        responseDTO.setAddress(user.getAddress());
        responseDTO.setBio(user.getBio());
        responseDTO.setRating(user.getRating());
        responseDTO.setReviewCount(user.getReviewCount());
        responseDTO.setCreatedAt(user.getCreatedAt());
        responseDTO.setUpdatedAt(user.getUpdatedAt());
        return responseDTO;
    }
}
