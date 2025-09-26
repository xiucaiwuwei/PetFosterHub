package org.backend.dto.response;

import org.backend.dto.request.PetRequest;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
@Schema(description = "宠物响应DTO")
public class PetResponse {
    private boolean success;
    private String message;
    private PetRequest data;

    public static PetResponse success(String message, PetRequest data) {
        return new PetResponse(true, message, data);
    }

    public static PetResponse error(String message) {
        return new PetResponse(false, message, null);
    }
}