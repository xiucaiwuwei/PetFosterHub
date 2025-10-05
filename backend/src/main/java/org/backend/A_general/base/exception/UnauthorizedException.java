package org.backend.A_general.base.exception;

import org.springframework.http.HttpStatus;

/**
 * 未授权异常
 * 当用户未提供有效的认证信息或认证信息无效时抛出
 */
public class UnauthorizedException extends BusinessException {

    /**
     * 默认错误代码
     */
    private static final String DEFAULT_ERROR_CODE = "AUTH_UNAUTHORIZED";

    /**
     * 构造函数
     * 
     * @param message 错误消息
     */
    public UnauthorizedException(String message) {
        super(message, DEFAULT_ERROR_CODE, HttpStatus.UNAUTHORIZED);
    }

    /**
     * 构造函数
     * 
     * @param message 错误消息
     * @param errorCode 错误代码
     */
    public UnauthorizedException(String message, String errorCode) {
        super(message, errorCode, HttpStatus.UNAUTHORIZED);
    }

    /**
     * 构造函数
     * 
     * @param message 错误消息
     * @param cause 异常原因
     */
    public UnauthorizedException(String message, Throwable cause) {
        super(message, DEFAULT_ERROR_CODE, HttpStatus.UNAUTHORIZED, cause);
    }

    /**
     * 构造函数
     * 
     * @param message 错误消息
     * @param errorCode 错误代码
     * @param cause 异常原因
     */
    public UnauthorizedException(String message, String errorCode, Throwable cause) {
        super(message, errorCode, HttpStatus.UNAUTHORIZED, cause);
    }
}