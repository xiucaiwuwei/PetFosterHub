package org.backend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.backend.A_general.base.controller.BaseController;
import org.backend.A_general.base.dto.BaseResponse;
import org.backend.A_general.base.utils.ValidationUtils;
import org.backend.dto.request.UserRequest;
import org.backend.dto.response.user.UserProfileResponse;
import org.backend.entity.User;
import org.backend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@Tag(name = "用户管理", description = "用户信息管理接口")
public class UserController extends BaseController {

    private final UserService userService;

    @GetMapping("/profile")
    @Operation(summary = "获取当前用户信息")
    public ResponseEntity<BaseResponse<UserProfileResponse>> getCurrentUser(Authentication authentication) {
        // 由于移除了email字段，我们需要根据id获取用户信息
        Long userId = Long.parseLong(authentication.getName());
        User user = userService.findById(userId)
                .orElseThrow(() -> new RuntimeException("用户不存在"));
        
        // 转换为响应DTO，确保不包含敏感信息
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
        
        return super.success("获取成功", responseDTO);
    }

    @GetMapping("/{id}")
    @Operation(summary = "根据ID获取用户信息")
    public ResponseEntity<BaseResponse<UserProfileResponse>> getUserById(@PathVariable Long id) {
        User user = userService.getUserById(id)
                .orElseThrow(() -> new RuntimeException("用户不存在"));
        
        // 转换为响应DTO，确保不包含敏感信息
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
        
        return super.success("获取成功", responseDTO);
    }

    @PutMapping("/profile")
    @Operation(summary = "更新当前用户信息")
    public ResponseEntity<BaseResponse<UserProfileResponse>> updateCurrentUser(
            Authentication authentication,
            @Valid @RequestBody UserRequest userDTO) {
        // 由于移除了email字段，我们需要根据id获取用户信息
        Long userId = Long.parseLong(authentication.getName());
        User user = userService.findById(userId)
                .orElseThrow(() -> new RuntimeException("用户不存在"));
        
        // 验证手机号格式
        if (userDTO.getPhone() != null && !ValidationUtils.isValidPhone(userDTO.getPhone())) {
            throw new RuntimeException("手机号格式不正确");
        }
        
        // 更新用户信息
        if (userDTO.getFullName() != null) user.setFullName(userDTO.getFullName());
        if (userDTO.getPhone() != null) user.setPhone(userDTO.getPhone());
        if (userDTO.getAddress() != null) user.setAddress(userDTO.getAddress());
        if (userDTO.getBio() != null) user.setBio(userDTO.getBio());
        
        User updatedUser = userService.saveUser(user);
        
        // 转换为响应DTO，确保不包含敏感信息
        UserProfileResponse responseDTO = new UserProfileResponse();
        responseDTO.setId(updatedUser.getId());
        responseDTO.setPhone(updatedUser.getPhone());
        responseDTO.setAvatar(updatedUser.getAvatar());
        responseDTO.setNickname(updatedUser.getNickname());
        responseDTO.setRole(updatedUser.getRole());
        responseDTO.setFullName(updatedUser.getFullName());
        responseDTO.setAddress(updatedUser.getAddress());
        responseDTO.setBio(updatedUser.getBio());
        responseDTO.setRating(updatedUser.getRating());
        responseDTO.setReviewCount(updatedUser.getReviewCount());
        responseDTO.setCreatedAt(updatedUser.getCreatedAt());
        responseDTO.setUpdatedAt(updatedUser.getUpdatedAt());
        
        return super.success("更新成功", responseDTO);
    }

    @DeleteMapping("/account")
    @Operation(summary = "删除当前用户账户")
    public ResponseEntity<BaseResponse<String>> deleteCurrentUser(Authentication authentication) {
        // 由于移除了email字段，我们需要根据id获取用户信息
        Long userId = Long.parseLong(authentication.getName());
        userService.deleteById(userId);
        return super.success("账户删除成功");
    }
}
