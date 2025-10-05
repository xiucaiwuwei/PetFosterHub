package org.backend.A_general.base.exception;

import org.springframework.http.HttpStatus;

/**
 * 资源未找到异常
 * 当请求的资源不存在时抛出
 */
public class NotFoundException extends BusinessException {

    /**
     * 默认错误代码
     */
    private static final String DEFAULT_ERROR_CODE = "RESOURCE_NOT_FOUND";

    /**
     * 构造函数
     * 
     * @param message 错误消息
     */
    public NotFoundException(String message) {
        super(message, DEFAULT_ERROR_CODE, HttpStatus.NOT_FOUND);
    }

    /**
     * 构造函数
     * 
     * @param message 错误消息
     * @param errorCode 错误代码
     */
    public NotFoundException(String message, String errorCode) {
        super(message, errorCode, HttpStatus.NOT_FOUND);
    }

    /**
     * 构造函数
     * 
     * @param message 错误消息
     * @param cause 异常原因
     */
    public NotFoundException(String message, Throwable cause) {
        super(message, DEFAULT_ERROR_CODE, HttpStatus.NOT_FOUND, cause);
    }

    /**
     * 构造函数
     * 
     * @param message 错误消息
     * @param errorCode 错误代码
     * @param cause 异常原因
     */
    public NotFoundException(String message, String errorCode, Throwable cause) {
        super(message, errorCode, HttpStatus.NOT_FOUND, cause);
    }
}