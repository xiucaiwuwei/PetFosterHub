package org.backend.dto.response.webSocket;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.backend.entity.Message;

/**
 * WebSocket新消息响应DTO
 * 用于通过WebSocket推送新消息给客户端
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Schema(description = "WebSocket新消息响应DTO")
public class WebSocketMessageResponse {
    @Schema(description = "消息类型")
    private String type = "NEW_MESSAGE";
    @Schema(description = "消息内容")
    private Message payload;
}