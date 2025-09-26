package org.backend.base.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "通用API响应结果")
public class BaseResponse<T> {

    /**
     * 响应是否成功
     */
    @Schema(description = "响应是否成功", example = "true")
    private boolean success;

    /**
     * 响应消息
     */
    @Schema(description = "响应消息", example = "操作成功")
    private String message;

    /**
     * 响应数据
     */
    @Schema(description = "响应数据")
    private T data;

    /**
     * 响应时间戳
     */
    @Schema(description = "响应时间戳")
    private LocalDateTime timestamp;

    /**
     * 创建成功地响应结果
     *
     * @param message 响应消息
     * @param data    响应数据
     * @param <T>     数据类型
     * @return BaseResponse实例
     */
    public static <T> BaseResponse<T> success(String message, T data) {
        BaseResponse<T> response = new BaseResponse<>();
        response.setSuccess(true);
        response.setMessage(message);
        response.setData(data);
        response.setTimestamp(LocalDateTime.now());
        return response;
    }

    /**
     * 创建成功地响应结果（无数据）
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
        BaseResponse<T> response = new BaseResponse<>();
        response.setSuccess(false);
        response.setMessage(message);
        response.setData(data);
        response.setTimestamp(LocalDateTime.now());
        return response;
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
}
