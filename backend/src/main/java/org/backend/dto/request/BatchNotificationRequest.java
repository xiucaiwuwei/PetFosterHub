package org.backend.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

/**
 * 批量通知操作请求DTO
 * 用于批量删除或批量标记已读等操作
 */
@Data
@Schema(description = "批量通知操作请求DTO")
public class BatchNotificationRequest {
    @Schema(description = "通知ID列表", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotNull(message = "通知ID列表不能为空")
    private List<Long> notificationIds;
}