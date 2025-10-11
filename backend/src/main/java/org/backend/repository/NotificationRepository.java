package org.backend.repository;

import org.backend.A_general.base.repository.BaseRepository;
import org.backend.entity.Notification;
import org.backend.entity.enums.NotificationType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * 通知仓库接口
 * 提供通知实体的数据库操作方法
 */
@Repository
public interface NotificationRepository extends BaseRepository<Notification, Long> {

    /**
     * 根据用户ID获取通知列表
     * @param userId 用户ID
     * @param pageable 分页参数
     * @return 通知分页列表
     */
    Page<Notification> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);

    /**
     * 根据用户ID和已读状态获取通知列表
     * @param userId 用户ID
     * @param isRead 是否已读
     * @param pageable 分页参数
     * @return 通知分页列表
     */
    Page<Notification> findByUserIdAndIsReadOrderByCreatedAtDesc(Long userId, boolean isRead, Pageable pageable);

    /**
     * 根据用户ID和通知类型获取通知列表
     * @param userId 用户ID
     * @param type 通知类型
     * @param pageable 分页参数
     * @return 通知分页列表
     */
    Page<Notification> findByUserIdAndTypeOrderByCreatedAtDesc(Long userId, NotificationType type, Pageable pageable);

    /**
     * 根据用户ID和已读状态、通知类型获取通知列表
     * @param userId 用户ID
     * @param isRead 是否已读
     * @param type 通知类型
     * @param pageable 分页参数
     * @return 通知分页列表
     */
    Page<Notification> findByUserIdAndIsReadAndTypeOrderByCreatedAtDesc(Long userId, boolean isRead, NotificationType type, Pageable pageable);

    /**
     * 获取用户未读通知数量
     * @param userId 用户ID
     * @return 未读通知数量
     */
    long countByUserIdAndIsReadFalse(Long userId);

    /**
     * 批量标记通知为已读
     * @param userId 用户ID
     * @return 更新的记录数
     */
    int updateByUserIdAndIsReadFalseSetIsReadTrue(Long userId);

    /**
     * 标记单个通知为已读
     * @param id 通知ID
     * @param userId 用户ID
     * @return 更新的记录数
     */
    @Modifying
    @Query("UPDATE Notification n SET n.isRead = true WHERE n.id = :id AND n.userId = :userId")
    int updateByIdAndUserIdSetIsReadTrue(@Param("id") Long id, @Param("userId") Long userId);

    /**
     * 删除用户的通知
     * @param id 通知ID
     * @param userId 用户ID
     * @return 删除的记录数
     */
    int deleteByIdAndUserId(Long id, Long userId);
}