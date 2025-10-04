package org.backend.dto.response.message;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.Map;

/**
 * 对话响应DTO
 * 用于封装对话相关信息的响应数据，包括对话参与者信息、最后消息和未读计数等
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Schema(description = "对话响应DTO")
public class ConversationResponse {
    @Schema(description = "是否成功")
    private boolean success;
    @Schema(description = "响应消息")
    private String message;
    @Schema(description = "对话数据")
    private ConversationData data;

    /**
     * 创建成功的对话响应
     * 
     * @param message 响应消息
     * @param data 对话数据
     * @return 成功的对话响应对象
     */
    public static ConversationResponse success(String message, ConversationData data) {
        return new ConversationResponse(true, message, data);
    }

    /**
     * 创建错误的对话响应
     * 
     * @param message 错误消息
     * @return 错误的对话响应对象
     */
    public static ConversationResponse error(String message) {
        return new ConversationResponse(false, message, null);
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Schema(description = "对话数据")
    public static class ConversationData {
        @Schema(description = "对话ID")
        private Long id;
        @Schema(description = "用户ID")
        private Long userId;
        @Schema(description = "用户昵称")
        private String nickname;
        @Schema(description = "用户头像")
        private String avatar;
        @Schema(description = "最后一条消息")
        private String lastMessage;
        @Schema(description = "最后消息时间")
        private LocalDateTime lastMessageTime;
        @Schema(description = "未读消息数量")
        private Long unreadCount;
        @Schema(description = "其他用户信息")
        private Map<String, Object> otherUserInfo;
    }
}