package org.backend.dto.response;

import org.backend.dto.request.FileUploadRequest;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
@Schema(description = "文件上传响应DTO")
public class FileUploadResponse {
    private boolean success;
    private String message;
    private FileUploadRequest data;

    public static FileUploadResponse success(String message, FileUploadRequest data) {
        return new FileUploadResponse(true, message, data);
    }

    public static FileUploadResponse error(String message) {
        return new FileUploadResponse(false, message, null);
    }
}