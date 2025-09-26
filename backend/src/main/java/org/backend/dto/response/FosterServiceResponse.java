package org.backend.dto.response;

import org.backend.dto.request.FosterServiceRequest;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
@Schema(description = "寄养服务响应DTO")
public class FosterServiceResponse {
    private boolean success;
    private String message;
    private FosterServiceRequest data;

    public static FosterServiceResponse success(String message, FosterServiceRequest data) {
        return new FosterServiceResponse(true, message, data);
    }

    public static FosterServiceResponse error(String message) {
        return new FosterServiceResponse(false, message, null);
    }
}