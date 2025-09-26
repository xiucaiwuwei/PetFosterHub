package org.backend.dto.response;

import org.backend.dto.request.BookingRequest;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
@Schema(description = "预约响应DTO")
public class BookingResponse {
    private boolean success;
    private String message;
    private BookingRequest data;

    public static BookingResponse success(String message, BookingRequest data) {
        return new BookingResponse(true, message, data);
    }

    public static BookingResponse error(String message) {
        return new BookingResponse(false, message, null);
    }
}