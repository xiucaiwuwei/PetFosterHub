package org.backend.A_general.base.exception;

import org.springframework.http.HttpStatus;

/**
 * 禁止访问异常
 * 当用户没有足够的权限执行请求的操作时抛出
 */
public class ForbiddenException extends BusinessException {

    /**
     * 默认错误代码
     */
    private static final String DEFAULT_ERROR_CODE = "AUTH_FORBIDDEN";

    /**
     * 构造函数
     * 
     * @param message 错误消息
     */
    public ForbiddenException(String message) {
        super(message, DEFAULT_ERROR_CODE, HttpStatus.FORBIDDEN);
    }

    /**
     * 构造函数
     * 
     * @param message 错误消息
     * @param errorCode 错误代码
     */
    public ForbiddenException(String message, String errorCode) {
        super(message, errorCode, HttpStatus.FORBIDDEN);
    }

    /**
     * 构造函数
     * 
     * @param message 错误消息
     * @param cause 异常原因
     */
    public ForbiddenException(String message, Throwable cause) {
        super(message, DEFAULT_ERROR_CODE, HttpStatus.FORBIDDEN, cause);
    }

    /**
     * 构造函数
     * 
     * @param message 错误消息
     * @param errorCode 错误代码
     * @param cause 异常原因
     */
    public ForbiddenException(String message, String errorCode, Throwable cause) {
        super(message, errorCode, HttpStatus.FORBIDDEN, cause);
    }
}