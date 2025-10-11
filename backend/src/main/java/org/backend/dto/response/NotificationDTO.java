package org.backend.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import org.backend.entity.enums.NotificationType;

import java.time.LocalDateTime;
import java.time.ZoneOffset;

/**
 * 通知DTO
 * 用于前端展示的通知数据传输对象
 * 与前端TypeScript的Notification接口保持一致
 */
@Data
@Schema(description = "通知DTO")
public class NotificationDTO {
    @Schema(description = "通知ID")
    private Long id;

    @Schema(description = "通知标题")
    private String title;

    @Schema(description = "通知内容")
    private String message;

    @Schema(description = "通知类型")
    private NotificationType type;

    @Schema(description = "通知创建时间戳")
    private long timestamp;

    @Schema(description = "显示时长(ms)，默认为5000ms")
    private Integer duration;

    @Schema(description = "是否已读")
    private boolean isRead;

    @Schema(description = "点击通知后跳转的URL")
    private String targetUrl;

    /**
     * 设置时间戳（从LocalDateTime转换为Unix时间戳）
     * @param createdAt 创建时间
     */
    public void setCreatedAt(LocalDateTime createdAt) {
        if (createdAt != null) {
            this.timestamp = createdAt.toInstant(ZoneOffset.ofHours(8)).toEpochMilli();
        }
    }
}