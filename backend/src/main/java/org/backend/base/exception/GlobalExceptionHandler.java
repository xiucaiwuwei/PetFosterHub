package org.backend.base.exception;

import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.ConstraintViolationException;
import org.backend.base.dto.BaseResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

import java.util.HashMap;
import java.util.Map;

/**
 * 全局异常处理器
 * 处理应用程序中未被捕获的异常，并返回统一格式的错误响应
 * <p>
 * 该类使用@RestControllerAdvice注解，可以捕获所有控制器中抛出的异常，
 * 并根据异常类型返回相应的错误信息和HTTP状态码，确保API错误响应的一致性。
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    /**
     * 处理参数验证异常
     *
     * @param ex MethodArgumentNotValidException异常
     * @return 错误响应
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<BaseResponse<Map<String, String>>> handleValidationExceptions(
            MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error ->
                errors.put(error.getField(), error.getDefaultMessage()));
        logger.warn("参数验证失败");
        return ResponseEntity.badRequest().body(BaseResponse.error("参数验证失败", errors));
    }

    /**
     * 处理认证异常
     *
     * @param ignoredEx AuthenticationException异常
     * @return 错误响应
     */
    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<BaseResponse<Void>> handleAuthenticationException(AuthenticationException ignoredEx) {
        logger.warn("认证失败");
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(BaseResponse.error("认证失败"));
    }

    /**
     * 处理参数类型不匹配异常
     *
     * @param ex MethodArgumentTypeMismatchException异常
     * @return 错误响应
     */
    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<BaseResponse<Void>> handleMethodArgumentTypeMismatch(
            MethodArgumentTypeMismatchException ex) {
        logger.warn("参数类型不匹配");
        String message = "参数类型错误";
        if (ex.getRequiredType() != null) {
            message = String.format("参数 '%s' 类型错误，期望类型: %s",
                    ex.getName(), ex.getRequiredType().getSimpleName());
        }
        return ResponseEntity.badRequest().body(BaseResponse.error(message));
    }

    /**
     * 处理实体未找到异常
     *
     * @param ignoredEx EntityNotFoundException异常
     * @return 错误响应
     */
    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<BaseResponse<Void>> handleEntityNotFoundException(EntityNotFoundException ignoredEx) {
        logger.warn("实体未找到");
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(BaseResponse.error("数据不存在"));
    }

    /**
     * 处理查询结果为空异常
     *
     * @param ignoredEx EmptyResultDataAccessException异常
     * @return 错误响应
     */
    @ExceptionHandler(EmptyResultDataAccessException.class)
    public ResponseEntity<BaseResponse<Void>> handleEmptyResultDataAccessException(EmptyResultDataAccessException ignoredEx) {
        logger.warn("查询结果为空");
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(BaseResponse.error("查询结果不存在"));
    }

    /**
     * 处理数据完整性约束违反异常
     *
     * @param ignoredEx DataIntegrityViolationException异常
     * @return 错误响应
     */
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<BaseResponse<Void>> handleDataIntegrityViolationException(DataIntegrityViolationException ignoredEx) {
        logger.error("数据完整性约束违反");
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(BaseResponse.error("数据操作违反约束"));
    }

    /**
     * 处理约束验证异常
     *
     * @param ex ConstraintViolationException异常
     * @return 错误响应
     */
    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<BaseResponse<Map<String, String>>> handleConstraintViolationException(ConstraintViolationException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getConstraintViolations().forEach(violation ->
                errors.put(violation.getPropertyPath().toString(), violation.getMessage()));
        logger.warn("约束验证失败");
        return ResponseEntity.badRequest().body(BaseResponse.error("数据约束验证失败", errors));
    }

    /**
     * 处理文件上传大小超限异常
     *
     * @param ignoredEx MaxUploadSizeExceededException异常
     * @return 错误响应
     */
    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<BaseResponse<Void>> handleMaxUploadSizeExceededException(MaxUploadSizeExceededException ignoredEx) {
        logger.warn("文件上传大小超限");
        return ResponseEntity.status(HttpStatus.PAYLOAD_TOO_LARGE)
                .body(BaseResponse.error("文件大小超过限制"));
    }

    /**
     * 处理非法参数异常
     *
     * @param ex IllegalArgumentException异常
     * @return 错误响应
     */
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<BaseResponse<Void>> handleIllegalArgumentException(IllegalArgumentException ex) {
        logger.warn("非法参数");
        return ResponseEntity.badRequest()
                .body(BaseResponse.error("参数错误: " + ex.getMessage()));
    }

    /**
     * 处理访问拒绝异常
     *
     * @param ignoredEx AccessDeniedException异常
     * @return 错误响应
     */
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<BaseResponse<Void>> handleAccessDeniedException(AccessDeniedException ignoredEx) {
        logger.warn("访问被拒绝");
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(BaseResponse.error("访问权限不足"));
    }

    /**
     * 处理通用异常
     *
     * @param ex Exception异常
     * @return 错误响应
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<BaseResponse<Void>> handleGenericException(Exception ex) {
        logger.error("发生未处理的异常", ex);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(BaseResponse.error("服务器内部错误"));
    }
}