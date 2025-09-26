package org.backend.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.backend.entity.User;

@Data
@AllArgsConstructor
@Schema(description = "用户响应DTO")
public class UserResponse {
    private boolean success;
    private String message;
    private User data;

    public static UserResponse success(String message, User data) {
        return new UserResponse(true, message, data);
    }

    public static UserResponse error(String message) {
        return new UserResponse(false, message, null);
    }
}