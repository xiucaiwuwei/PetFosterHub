package org.backend.A_general.base.exception;

import org.springframework.http.HttpStatus;

/**
 * 服务层异常
 * 当服务层执行过程中发生错误时抛出
 */
public class ServiceException extends BusinessException {

    /**
     * 默认错误代码
     */
    private static final String DEFAULT_ERROR_CODE = "SERVICE_ERROR";

    /**
     * 构造函数
     * 
     * @param message 错误消息
     */
    public ServiceException(String message) {
        super(message, DEFAULT_ERROR_CODE, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    /**
     * 构造函数
     * 
     * @param message 错误消息
     * @param errorCode 错误代码
     */
    public ServiceException(String message, String errorCode) {
        super(message, errorCode, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    /**
     * 构造函数
     * 
     * @param message 错误消息
     * @param cause 异常原因
     */
    public ServiceException(String message, Throwable cause) {
        super(message, DEFAULT_ERROR_CODE, HttpStatus.INTERNAL_SERVER_ERROR, cause);
    }

    /**
     * 构造函数
     * 
     * @param message 错误消息
     * @param errorCode 错误代码
     * @param cause 异常原因
     */
    public ServiceException(String message, String errorCode, Throwable cause) {
        super(message, errorCode, HttpStatus.INTERNAL_SERVER_ERROR, cause);
    }
}