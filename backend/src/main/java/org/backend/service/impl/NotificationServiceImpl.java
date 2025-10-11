package org.backend.service.impl;

import org.backend.A_general.base.service.impl.BaseServiceImpl;
import org.backend.entity.Notification;
import org.backend.entity.enums.NotificationType;
import org.backend.repository.NotificationRepository;
import org.backend.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

import java.util.List;
import java.util.Optional;

/**
 * 通知服务实现类
 * 实现通知管理相关的业务逻辑
 */
@Service
public class NotificationServiceImpl extends BaseServiceImpl<Notification, Long, NotificationRepository> implements NotificationService {
    
    @Override
    public Optional<Notification> findByIdAndNotDeleted(Long id) {
        return super.findByIdAndNotDeleted(id);
    }
    
    @Override
    public List<Notification> saveAll(Iterable<Notification> entities) {
        return super.saveAll(entities);
    }
    
    @Override
    public void delete(Notification entity) {
        super.delete(entity);
    }

    private final NotificationRepository notificationRepository;

    @Autowired
    public NotificationServiceImpl(NotificationRepository notificationRepository) {
        super(notificationRepository);
        this.notificationRepository = notificationRepository;
    }

    @Override
    public Page<Notification> getNotificationsByUserId(Long userId, Pageable pageable) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable);
    }

    @Override
    public Page<Notification> getNotificationsByCondition(Long userId, Boolean isRead, NotificationType type, Pageable pageable) {
        if (isRead != null && type != null) {
            return notificationRepository.findByUserIdAndIsReadAndTypeOrderByCreatedAtDesc(userId, isRead, type, pageable);
        } else if (isRead != null) {
            return notificationRepository.findByUserIdAndIsReadOrderByCreatedAtDesc(userId, isRead, pageable);
        } else if (type != null) {
            return notificationRepository.findByUserIdAndTypeOrderByCreatedAtDesc(userId, type, pageable);
        } else {
            return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable);
        }
    }

    @Override
    public long getUnreadCount(Long userId) {
        return notificationRepository.countByUserIdAndIsReadFalse(userId);
    }

    @Transactional
    @Override
    public boolean markAsRead(Long notificationId, Long userId) {
        int updatedRows = notificationRepository.updateByIdAndUserIdSetIsReadTrue(notificationId, userId);
        return updatedRows > 0;
    }

    @Transactional
    @Override
    public boolean markAllAsRead(Long userId) {
        int updatedRows = notificationRepository.updateByUserIdAndIsReadFalseSetIsReadTrue(userId);
        return updatedRows > 0;
    }

    @Transactional
    @Override
    public boolean deleteNotification(Long notificationId, Long userId) {
        int deletedRows = notificationRepository.deleteByIdAndUserId(notificationId, userId);
        return deletedRows > 0;
    }

    @Transactional
    @Override
    public boolean deleteNotifications(List<Long> notificationIds, Long userId) {
        int totalDeleted = 0;
        for (Long id : notificationIds) {
            totalDeleted += notificationRepository.deleteByIdAndUserId(id, userId);
        }
        return totalDeleted > 0;
    }

    @Override
    public Notification createNotification(Long userId, String title, String message, NotificationType type) {
        return createNotification(userId, title, message, type, null, null);
    }

    @Override
    public Notification createNotification(Long userId, String title, String message, NotificationType type, Integer duration, String targetUrl) {
        Notification notification = new Notification();
        notification.setUserId(userId);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setType(type);
        if (duration != null) {
            notification.setDuration(duration);
        }
        if (targetUrl != null) {
            notification.setTargetUrl(targetUrl);
        }
        notification.setRead(false);
        return save(notification);
    }
}