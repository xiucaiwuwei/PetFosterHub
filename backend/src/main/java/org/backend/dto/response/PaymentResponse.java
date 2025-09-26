package org.backend.dto.response;

import org.backend.dto.request.PaymentRequest;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
@Schema(description = "支付响应DTO")
public class PaymentResponse {
    private boolean success;
    private String message;
    private PaymentRequest data;

    public static PaymentResponse success(String message, PaymentRequest data) {
        return new PaymentResponse(true, message, data);
    }

    public static PaymentResponse error(String message) {
        return new PaymentResponse(false, message, null);
    }
}