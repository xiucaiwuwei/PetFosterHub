package org.backend.dto.response;

import org.backend.dto.request.ConsultationRequest;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
@Schema(description = "咨询响应DTO")
public class ConsultationResponse {
    private boolean success;
    private String message;
    private ConsultationRequest data;

    public static ConsultationResponse success(String message, ConsultationRequest data) {
        return new ConsultationResponse(true, message, data);
    }

    public static ConsultationResponse error(String message) {
        return new ConsultationResponse(false, message, null);
    }
}