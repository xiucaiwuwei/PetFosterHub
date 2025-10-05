package org.backend.A_general.base.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

/**
 * 业务异常基类
 * 所有业务相关的自定义异常都应该继承此类
 */
@Getter
public class BusinessException extends RuntimeException {
    
    private final String errorCode;
    private final HttpStatus status;

    /**
     * 构造函数
     * 
     * @param message 错误消息
     * @param errorCode 错误代码
     */
    public BusinessException(String message, String errorCode) {
        super(message);
        this.errorCode = errorCode;
        this.status = HttpStatus.BAD_REQUEST;
    }

    /**
     * 构造函数
     * 
     * @param message 错误消息
     * @param errorCode 错误代码
     * @param status HTTP状态码
     */
    public BusinessException(String message, String errorCode, HttpStatus status) {
        super(message);
        this.errorCode = errorCode;
        this.status = status;
    }

    /**
     * 构造函数
     * 
     * @param message 错误消息
     * @param errorCode 错误代码
     * @param cause 异常原因
     */
    public BusinessException(String message, String errorCode, Throwable cause) {
        super(message, cause);
        this.errorCode = errorCode;
        this.status = HttpStatus.BAD_REQUEST;
    }

    /**
     * 构造函数
     * 
     * @param message 错误消息
     * @param errorCode 错误代码
     * @param status HTTP状态码
     * @param cause 异常原因
     */
    public BusinessException(String message, String errorCode, HttpStatus status, Throwable cause) {
        super(message, cause);
        this.errorCode = errorCode;
        this.status = status;
    }
}