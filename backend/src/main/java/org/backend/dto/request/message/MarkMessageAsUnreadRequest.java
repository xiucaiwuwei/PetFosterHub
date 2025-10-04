package org.backend.dto.request.message;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.backend.base.dto.BaseRequest;

/**
 * 标记消息为未读请求DTO
 * 用于封装将消息标记为未读状态的请求数据
 */
@EqualsAndHashCode(callSuper = true)
@Data
@Schema(description = "标记消息为未读请求DTO")
public class MarkMessageAsUnreadRequest extends BaseRequest {

    @NotNull(message = "用户ID不能为空")
    @Positive(message = "用户ID必须为正数")
    @Schema(description = "用户ID")
    private Long userId;
}