package org.backend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.backend.A_general.base.controller.BaseController;
import org.backend.A_general.base.dto.BaseResponse;
import org.backend.dto.request.BatchNotificationRequest;
import org.backend.dto.response.NotificationDTO;
import org.backend.entity.Notification;
import org.backend.entity.enums.NotificationType;
import org.backend.service.NotificationService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

/**
 * 通知控制器
 * 处理前端通知相关的API请求
 */
@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@Tag(name = "通知管理", description = "用户通知相关接口")
public class NotificationController extends BaseController {

    private final NotificationService notificationService;

    /**
     * 获取当前用户的通知列表
     * 对应前端notificationApi.ts中的getNotifications函数
     */
    @GetMapping
    @Operation(summary = "获取当前用户的通知列表")
    public ResponseEntity<BaseResponse<List<NotificationDTO>>> getNotifications(
            Authentication authentication,
            Pageable pageable,
            @RequestParam(required = false) Boolean isRead,
            @RequestParam(required = false) NotificationType type) {
        Long userId = Long.parseLong(authentication.getName());
        Page<Notification> notifications = notificationService.getNotificationsByCondition(userId, isRead, type, pageable);
        List<NotificationDTO> notificationDTOs = notifications.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return success("获取成功", notificationDTOs);
    }

    /**
     * 获取当前用户的未读通知数量
     * 对应前端notificationApi.ts中的getUnreadCount函数
     */
    @GetMapping("/unread-count")
    @Operation(summary = "获取当前用户的未读通知数量")
    public ResponseEntity<BaseResponse<Long>> getUnreadCount(Authentication authentication) {
        Long userId = Long.parseLong(authentication.getName());
        long count = notificationService.getUnreadCount(userId);
        return success("获取成功", count);
    }

    /**
     * 标记单个通知为已读
     * 对应前端notificationApi.ts中的markAsRead函数
     */
    @PutMapping("/{notificationId}/read")
    @Operation(summary = "标记单个通知为已读")
    public ResponseEntity<BaseResponse<Void>> markAsRead(
            Authentication authentication,
            @PathVariable Long notificationId) {
        Long userId = Long.parseLong(authentication.getName());
        boolean result = notificationService.markAsRead(notificationId, userId);
        if (result) {
            return success("标记成功");
        } else {
            return failure("标记失败，通知不存在或不属于该用户");
        }
    }

    /**
     * 标记所有通知为已读
     * 对应前端notificationApi.ts中的markAllAsRead函数
     */
    @PutMapping("/mark-all-read")
    @Operation(summary = "标记所有通知为已读")
    public ResponseEntity<BaseResponse<Void>> markAllAsRead(Authentication authentication) {
        Long userId = Long.parseLong(authentication.getName());
        notificationService.markAllAsRead(userId);
        return success("标记成功");
    }

    /**
     * 删除单个通知
     * 对应前端notificationApi.ts中的deleteNotification函数
     */
    @DeleteMapping("/{notificationId}")
    @Operation(summary = "删除单个通知")
    public ResponseEntity<BaseResponse<Void>> deleteNotification(
            Authentication authentication,
            @PathVariable Long notificationId) {
        Long userId = Long.parseLong(authentication.getName());
        boolean result = notificationService.deleteNotification(notificationId, userId);
        if (result) {
            return success("删除成功");
        } else {
            return failure("删除失败，通知不存在或不属于该用户");
        }
    }

    /**
     * 批量删除通知
     * 对应前端notificationApi.ts中的deleteNotifications函数
     */
    @PostMapping("/delete-multiple")
    @Operation(summary = "批量删除通知")
    public ResponseEntity<BaseResponse<Void>> deleteNotifications(
            Authentication authentication,
            @Valid @RequestBody BatchNotificationRequest request) {
        Long userId = Long.parseLong(authentication.getName());
        boolean result = notificationService.deleteNotifications(request.getNotificationIds(), userId);
        if (result) {
            return success("删除成功");
        } else {
            return failure("删除失败，部分通知可能不存在或不属于该用户");
        }
    }

    /**
     * 将Notification实体转换为NotificationDTO
     */
    private NotificationDTO convertToDTO(Notification notification) {
        NotificationDTO dto = new NotificationDTO();
        dto.setId(notification.getId());
        dto.setTitle(notification.getTitle());
        dto.setMessage(notification.getMessage());
        dto.setType(notification.getType());
        dto.setCreatedAt(notification.getCreatedAt());
        dto.setDuration(notification.getDuration());
        dto.setRead(notification.isRead());
        dto.setTargetUrl(notification.getTargetUrl());
        return dto;
    }
}