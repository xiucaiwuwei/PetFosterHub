package org.backend.dto.request.webSocket;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.backend.base.dto.BaseRequest;

/**
 * WebSocket输入状态请求DTO
 * 用于封装通过WebSocket发送的用户输入状态信息，如正在输入或停止输入
 */
@EqualsAndHashCode(callSuper = true)
@Data
@Schema(description = "WebSocket输入状态请求DTO")
public class WebSocketTypingStatusRequest extends BaseRequest {

    @NotBlank(message = "对话ID不能为空")
    @Schema(description = "对话ID")
    private String conversationId;

    @NotNull(message = "是否正在输入不能为空")
    @Schema(description = "是否正在输入")
    private Boolean isTyping;
    
    @Schema(description = "用户ID")
    private String userId;
}