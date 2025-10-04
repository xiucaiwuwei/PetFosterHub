package org.backend.dto.response.webSocket;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * WebSocket用户状态变化响应DTO
 * 用于通过WebSocket推送用户状态变化信息给客户端
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Schema(description = "WebSocket用户状态变化响应DTO")
public class WebSocketUserStatusResponse {
    @Schema(description = "消息类型")
    private String type = "USER_STATUS_CHANGE";
    @Schema(description = "用户状态数据")
    private UserStatusData payload;

    /**
     * 用户状态数据
     * 用于封装用户状态变化的具体信息
     */
    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Schema(description = "用户状态数据")
    public static class UserStatusData {
        @Schema(description = "用户ID")
        private String userId;
        @Schema(description = "用户状态")
        private String status;
    }
}