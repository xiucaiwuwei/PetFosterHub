package org.backend.dto.response;

import org.backend.dto.request.ReviewRequest;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
@Schema(description = "评价响应DTO")
public class ReviewResponse {
    private boolean success;
    private String message;
    private ReviewRequest data;

    public static ReviewResponse success(String message, ReviewRequest data) {
        return new ReviewResponse(true, message, data);
    }

    public static ReviewResponse error(String message) {
        return new ReviewResponse(false, message, null);
    }
}