package org.backend.dto.response;

import org.backend.dto.request.PetProductRequest;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
@Schema(description = "宠物用品响应DTO")
public class PetProductResponse {
    private boolean success;
    private String message;
    private PetProductRequest data;

    public static PetProductResponse success(String message, PetProductRequest data) {
        return new PetProductResponse(true, message, data);
    }

    public static PetProductResponse error(String message) {
        return new PetProductResponse(false, message, null);
    }
}