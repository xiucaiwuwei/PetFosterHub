package org.backend.service;

import org.backend.A_general.base.service.BaseService;
import org.backend.dto.response.BaseResponse;
import org.backend.entity.Notification;
import org.backend.entity.enums.NotificationType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

/**
 * 通知服务接口
 * 提供通知管理相关的业务逻辑
 */
public interface NotificationService extends BaseService<Notification, Long> {

    /**
     * 获取用户的通知列表
     * @param userId 用户ID
     * @param pageable 分页参数
     * @return 通知分页列表
     */
    Page<Notification> getNotificationsByUserId(Long userId, Pageable pageable);

    /**
     * 根据条件筛选通知列表
     * @param userId 用户ID
     * @param isRead 是否已读
     * @param type 通知类型
     * @param pageable 分页参数
     * @return 通知分页列表
     */
    Page<Notification> getNotificationsByCondition(Long userId, Boolean isRead, NotificationType type, Pageable pageable);

    /**
     * 获取用户未读通知数量
     * @param userId 用户ID
     * @return 未读通知数量
     */
    long getUnreadCount(Long userId);

    /**
     * 标记单个通知为已读
     * @param notificationId 通知ID
     * @param userId 用户ID
     * @return 操作结果
     */
    boolean markAsRead(Long notificationId, Long userId);

    /**
     * 标记所有通知为已读
     * @param userId 用户ID
     * @return 操作结果
     */
    boolean markAllAsRead(Long userId);

    /**
     * 删除单个通知
     * @param notificationId 通知ID
     * @param userId 用户ID
     * @return 操作结果
     */
    boolean deleteNotification(Long notificationId, Long userId);

    /**
     * 批量删除通知
     * @param notificationIds 通知ID列表
     * @param userId 用户ID
     * @return 操作结果
     */
    boolean deleteNotifications(List<Long> notificationIds, Long userId);

    /**
     * 创建并发送通知
     * @param userId 用户ID
     * @param title 标题
     * @param message 内容
     * @param type 类型
     * @return 创建的通知
     */
    Notification createNotification(Long userId, String title, String message, NotificationType type);

    /**
     * 创建并发送通知（带额外参数）
     * @param userId 用户ID
     * @param title 标题
     * @param message 内容
     * @param type 类型
     * @param duration 显示时长
     * @param targetUrl 点击跳转URL
     * @return 创建的通知
     */
    Notification createNotification(Long userId, String title, String message, NotificationType type, Integer duration, String targetUrl);
}