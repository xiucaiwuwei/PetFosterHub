package org.backend.A_general.base.controller;

import org.backend.A_general.base.dto.BaseResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

/**
 * 控制器基类
 * 提供统一的响应处理方法，包括成功响应、失败响应、未授权响应等
 * <p>
 * 该基类封装了常用的HTTP响应处理逻辑，所有控制器类都应该继承此类，
 * 以便保持响应格式的一致性。
 */
public abstract class BaseController {

    /**
     * 返回成功响应
     *
     * @param message 成功消息
     * @param data    响应数据
     * @param <T>     数据类型
     * @return ResponseEntity
     */
    protected <T> ResponseEntity<BaseResponse<T>> success(String message, T data) {
        return ResponseEntity.ok(BaseResponse.success(message, data));
    }

    /**
     * 返回成功响应（无数据）
     *
     * @param message 成功消息
     * @param <T>     数据类型
     * @return ResponseEntity
     */
    protected <T> ResponseEntity<BaseResponse<T>> success(String message) {
        return ResponseEntity.ok(BaseResponse.success(message));
    }

    /**
     * 返回失败响应 (400 Bad Request)
     *
     * @param message 错误消息
     * @param <T>     数据类型
     * @return ResponseEntity
     */
    protected <T> ResponseEntity<BaseResponse<T>> failure(String message) {
        return ResponseEntity.badRequest().body(BaseResponse.error(message));
    }

    /**
     * 返回失败响应（带状态码）
     *
     * @param status  HTTP状态码
     * @param message 错误消息
     * @param <T>     数据类型
     * @return ResponseEntity
     */
    protected <T> ResponseEntity<BaseResponse<T>> failure(HttpStatus status, String message) {
        return ResponseEntity.status(status).body(BaseResponse.error(message));
    }

    /**
     * 返回未找到响应 (404 Not Found)
     *
     * @param message 错误消息
     * @param <T>     数据类型
     * @return ResponseEntity
     */
    protected <T> ResponseEntity<BaseResponse<T>> notFound(String message) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(BaseResponse.error(message));
    }

    /**
     * 返回服务器内部错误响应 (500 Internal Server Error)
     *
     * @param message 错误消息
     * @param <T>     数据类型
     * @return ResponseEntity
     */
    protected <T> ResponseEntity<BaseResponse<T>> internalServerError(String message) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(BaseResponse.error(message));
    }

    /**
     * 返回未授权响应 (401 Unauthorized)
     *
     * @param <T> 数据类型
     * @return ResponseEntity
     */
    protected <T> ResponseEntity<BaseResponse<T>> unauthorized() {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(BaseResponse.error("未授权访问"));
    }

    /**
     * 返回禁止访问响应 (403 Forbidden)
     *
     * @param message 错误消息
     * @param <T>     数据类型
     * @return ResponseEntity
     */
    protected <T> ResponseEntity<BaseResponse<T>> forbidden(String message) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(BaseResponse.error(message));
    }
}