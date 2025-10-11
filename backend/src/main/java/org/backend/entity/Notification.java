package org.backend.entity;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.backend.A_general.base.entity.BaseEntity;
import org.backend.entity.enums.NotificationType;

import java.time.LocalDateTime;
import java.time.ZoneOffset;

/**
 * 通知实体类
 * 用于表示系统中的通知消息
 * 与前端TypeScript的Notification接口保持一致
 */
@EqualsAndHashCode(callSuper = true)
@Data
@Entity
@Table(name = "notifications")
@Schema(description = "通知实体")
@NoArgsConstructor
public class Notification extends BaseEntity {

    @NotNull
    @Column(name = "user_id")
    @Schema(description = "接收通知的用户ID")
    private Long userId;

    @Column
    @Schema(description = "通知标题")
    private String title;

    @NotBlank
    @Column(columnDefinition = "TEXT")
    @Schema(description = "通知内容")
    private String message;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column
    @Schema(description = "通知类型")
    private NotificationType type;

    @Column(name = "is_read")
    @Schema(description = "是否已读")
    private boolean isRead = false;

    @Column(name = "duration")
    @Schema(description = "显示时长(ms)，默认为5000ms")
    private Integer duration = 5000;

    @Column(name = "target_url")
    @Schema(description = "点击通知后跳转的URL")
    private String targetUrl;

    /**
     * 获取时间戳（转换为前端需要的Unix时间戳格式）
     * @return Unix时间戳
     */
    @Schema(description = "通知创建时间戳")
    @Transient
    public long getTimestamp() {
        return getCreatedAt().toInstant(ZoneOffset.ofHours(8)).toEpochMilli();
    }

    /**
     * 设置时间戳（从前端传入的Unix时间戳转换为LocalDateTime）
     * @param timestamp Unix时间戳
     */
    public void setTimestamp(long timestamp) {
        setCreatedAt(LocalDateTime.ofEpochSecond(timestamp / 1000, 0, ZoneOffset.ofHours(8)));
    }
}