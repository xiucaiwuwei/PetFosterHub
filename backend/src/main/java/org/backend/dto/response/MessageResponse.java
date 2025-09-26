package org.backend.dto.response;

import org.backend.dto.request.MessageRequest;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
@Schema(description = "消息响应DTO")
public class MessageResponse {
    private boolean success;
    private String message;
    private MessageRequest data;

    public static MessageResponse success(String message, MessageRequest data) {
        return new MessageResponse(true, message, data);
    }

    public static MessageResponse error(String message) {
        return new MessageResponse(false, message, null);
    }
}