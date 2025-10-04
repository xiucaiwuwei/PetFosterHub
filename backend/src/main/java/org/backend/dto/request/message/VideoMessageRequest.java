package org.backend.dto.request.message;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.backend.base.dto.BaseRequest;

/**
 * 视频消息请求DTO
 * 用于封装发送视频消息的请求数据
 */
@EqualsAndHashCode(callSuper = true)
@Data
@Schema(description = "视频消息请求DTO")
public class VideoMessageRequest extends BaseRequest {

    @NotNull(message = "接收者ID不能为空")
    @Positive(message = "接收者ID必须为正数")
    @Schema(description = "接收者ID")
    private Long receiverId;

    @NotNull(message = "对话ID不能为空")
    @Positive(message = "对话ID必须为正数")
    @Schema(description = "对话ID")
    private Long conversationId;

    @Schema(description = "视频描述文字")
    private String content;
}