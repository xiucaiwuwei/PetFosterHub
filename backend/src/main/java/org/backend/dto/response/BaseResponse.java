package org.backend.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * 基础响应DTO
 * 所有API响应都应该使用此类或其子类
 * @param <T> 响应数据类型
 */
@Data
@AllArgsConstructor
@Schema(description = "基础响应DTO")
public class BaseResponse<T> {
    private boolean success;
    private String message;
    private T data;

    /**
     * 创建成功响应
     * @param message 成功消息
     * @param data 响应数据
     * @param <T> 数据类型
     * @return 成功响应对象
     */
    public static <T> BaseResponse<T> success(String message, T data) {
        return new BaseResponse<>(true, message, data);
    }

    /**
     * 创建成功响应（简洁版）
     * @param data 响应数据
     * @param <T> 数据类型
     * @return 成功响应对象
     */
    public static <T> BaseResponse<T> success(T data) {
        return new BaseResponse<>(true, "操作成功", data);
    }

    /**
     * 创建错误响应
     * @param message 错误消息
     * @param <T> 数据类型
     * @return 错误响应对象
     */
    public static <T> BaseResponse<T> error(String message) {
        return new BaseResponse<>(false, message, null);
    }
}