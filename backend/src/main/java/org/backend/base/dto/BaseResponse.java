package org.backend.base.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;


/**
 * 通用API响应结果类
 * 用于封装所有API接口的返回数据，包含成功状态、消息、数据和时间戳
 * <p>
 * 该类提供了统一的API响应格式，确保前后端交互的一致性。
 * 支持泛型数据类型，可以承载任何类型的业务数据。
 * 
 * @param <T> 响应数据的类型
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "通用API响应结果，用于封装所有API接口的返回数据，包含成功状态、消息、数据和时间戳")
public class BaseResponse<T> {

    @Schema(description = "响应是否成功", example = "true")
    private boolean success;

    @Schema(description = "响应消息", example = "操作成功")
    private String message;

    @Schema(description = "响应数据")
    private T data;

    @Schema(description = "响应时间戳")
    private LocalDateTime timestamp = LocalDateTime.now();

    /**
     * 创建成功的响应结果
     *
     * @param message 响应消息
     * @param data    响应数据
     * @param <T>     数据类型
     * @return BaseResponse实例
     */
    public static <T> BaseResponse<T> success(String message, T data) {
        return createResponse(true, message, data);
    }

    /**
     * 创建成功的响应结果（无数据）
     *
     * @param message 响应消息
     * @param <T>     数据类型
     * @return BaseResponse实例
     */
    public static <T> BaseResponse<T> success(String message) {
        return success(message, null);
    }

    /**
     * 创建失败的响应结果
     *
     * @param message 错误消息
     * @param data    响应数据
     * @param <T>     数据类型
     * @return BaseResponse实例
     */
    public static <T> BaseResponse<T> error(String message, T data) {
        return createResponse(false, message, data);
    }

    /**
     * 创建失败的响应结果（无数据）
     *
     * @param message 错误消息
     * @param <T>     数据类型
     * @return BaseResponse实例
     */
    public static <T> BaseResponse<T> error(String message) {
        return error(message, null);
    }

    /**
     * 创建响应结果的通用方法
     *
     * @param success 响应是否成功
     * @param message 响应消息
     * @param data    响应数据
     * @param <T>     数据类型
     * @return BaseResponse实例
     */
    private static <T> BaseResponse<T> createResponse(boolean success, String message, T data) {
        BaseResponse<T> response = new BaseResponse<>();
        response.setSuccess(success);
        response.setMessage(message);
        response.setData(data);
        response.setTimestamp(LocalDateTime.now());
        return response;
    }
}