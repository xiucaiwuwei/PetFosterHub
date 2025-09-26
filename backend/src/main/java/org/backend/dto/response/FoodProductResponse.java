package org.backend.dto.response;

import org.backend.dto.request.FoodProductRequest;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
@Schema(description = "宠物食品响应DTO")
public class FoodProductResponse {
    private boolean success;
    private String message;
    private FoodProductRequest data;

    public static FoodProductResponse success(String message, FoodProductRequest data) {
        return new FoodProductResponse(true, message, data);
    }

    public static FoodProductResponse error(String message) {
        return new FoodProductResponse(false, message, null);
    }
}