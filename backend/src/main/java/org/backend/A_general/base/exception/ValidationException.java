package org.backend.A_general.base.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

import java.util.Map;

/**
 * 数据验证异常
 * 当请求的数据不符合验证规则时抛出
 */
@Getter
public class ValidationException extends BusinessException {

    /**
     * 默认错误代码
     */
    private static final String DEFAULT_ERROR_CODE = "VALIDATION_ERROR";
    
    /**
     * 验证错误详情
     */
    private final Map<String, String> errors;

    /**
     * 构造函数
     * 
     * @param message 错误消息
     */
    public ValidationException(String message) {
        super(message, DEFAULT_ERROR_CODE, HttpStatus.BAD_REQUEST);
        this.errors = null;
    }

    /**
     * 构造函数
     * 
     * @param message 错误消息
     * @param errors 验证错误详情
     */
    public ValidationException(String message, Map<String, String> errors) {
        super(message, DEFAULT_ERROR_CODE, HttpStatus.BAD_REQUEST);
        this.errors = errors;
    }

    /**
     * 构造函数
     * 
     * @param message 错误消息
     * @param errorCode 错误代码
     * @param errors 验证错误详情
     */
    public ValidationException(String message, String errorCode, Map<String, String> errors) {
        super(message, errorCode, HttpStatus.BAD_REQUEST);
        this.errors = errors;
    }

    /**
     * 构造函数
     * 
     * @param message 错误消息
     * @param cause 异常原因
     */
    public ValidationException(String message, Throwable cause) {
        super(message, DEFAULT_ERROR_CODE, HttpStatus.BAD_REQUEST, cause);
        this.errors = null;
    }

    /**
     * 构造函数
     * 
     * @param message 错误消息
     * @param errors 验证错误详情
     * @param cause 异常原因
     */
    public ValidationException(String message, Map<String, String> errors, Throwable cause) {
        super(message, DEFAULT_ERROR_CODE, HttpStatus.BAD_REQUEST, cause);
        this.errors = errors;
    }
}