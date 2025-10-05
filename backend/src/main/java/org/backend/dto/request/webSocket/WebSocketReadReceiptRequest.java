package org.backend.dto.request.webSocket;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.backend.A_general.base.dto.BaseRequest;

/**
 * WebSocket消息已读确认请求DTO
 * 用于封装通过WebSocket发送的消息已读确认请求数据
 */
@EqualsAndHashCode(callSuper = true)
@Data
@Schema(description = "WebSocket消息已读确认请求DTO")
public class WebSocketReadReceiptRequest extends BaseRequest {

    @NotBlank(message = "对话ID不能为空")
    @Schema(description = "对话ID")
    private String conversationId;
}