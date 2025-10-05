package org.backend.A_general.base.utils;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import org.backend.A_general.base.exception.ValidationException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.util.StringUtils;

import java.util.*;
import java.util.regex.Pattern;

/**
 * 数据验证工具类
 * 提供常用的数据验证方法
 */
public class ValidationUtils {

    private static final Logger logger = LoggerFactory.getLogger(ValidationUtils.class);
    private static final Validator validator = Validation.buildDefaultValidatorFactory().getValidator();
    
    // 邮箱正则表达式
    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,6}$");
    
    // 手机号正则表达式（中国大陆）
    private static final Pattern PHONE_PATTERN = Pattern.compile("^1[3-9]\\d{9}$");
    
    // 身份证号正则表达式（中国大陆）
    private static final Pattern ID_CARD_PATTERN = Pattern.compile("(^\\d{15}$)|(^\\d{18}$)|(^\\d{17}(\\d|X|x)$)");

    /**
     * 使用JSR-380验证对象
     *
     * @param object 要验证的对象
     * @throws ValidationException 如果验证失败
     */
    public static void validate(Object object) {
        Set<ConstraintViolation<Object>> violations = validator.validate(object);
        if (!violations.isEmpty()) {
            Map<String, String> errors = new HashMap<>();
            for (ConstraintViolation<Object> violation : violations) {
                errors.put(violation.getPropertyPath().toString(), violation.getMessage());
            }
            throw new ValidationException("数据验证失败", errors);
        }
    }

    /**
     * 验证邮箱格式
     *
     * @param email 邮箱地址
     * @return 是否有效
     */
    public static boolean isValidEmail(String email) {
        if (!StringUtils.hasText(email)) {
            return false;
        }
        return EMAIL_PATTERN.matcher(email).matches();
    }

    /**
     * 验证手机号格式（中国大陆）
     *
     * @param phone 手机号
     * @return 是否有效
     */
    public static boolean isValidPhone(String phone) {
        if (!StringUtils.hasText(phone)) {
            return false;
        }
        return PHONE_PATTERN.matcher(phone).matches();
    }

    /**
     * 验证身份证号格式（中国大陆）
     *
     * @param idCard 身份证号
     * @return 是否有效
     */
    public static boolean isValidIdCard(String idCard) {
        if (!StringUtils.hasText(idCard)) {
            return false;
        }
        return ID_CARD_PATTERN.matcher(idCard).matches();
    }

    /**
     * 验证字符串长度
     *
     * @param str 字符串
     * @param minLength 最小长度
     * @param maxLength 最大长度
     * @return 是否在范围内
     */
    public static boolean isValidLength(String str, int minLength, int maxLength) {
        if (str == null) {
            return minLength <= 0;
        }
        int length = str.length();
        return length >= minLength && length <= maxLength;
    }

    /**
     * 验证集合大小
     *
     * @param collection 集合
     * @param minSize 最小大小
     * @param maxSize 最大大小
     * @return 是否在范围内
     */
    public static boolean isValidCollectionSize(Collection<?> collection, int minSize, int maxSize) {
        if (collection == null) {
            return minSize <= 0;
        }
        int size = collection.size();
        return size >= minSize && size <= maxSize;
    }

    /**
     * 验证数值范围
     *
     * @param value 数值
     * @param min 最小值（包含）
     * @param max 最大值（包含）
     * @return 是否在范围内
     */
    public static boolean isValidRange(Number value, Number min, Number max) {
        if (value == null) {
            return false;
        }
        double doubleValue = value.doubleValue();
        if (min != null && doubleValue < min.doubleValue()) {
            return false;
        }
        return max == null || !(doubleValue > max.doubleValue());
    }

    /**
     * 检查对象是否为null
     *
     * @param obj 要检查的对象
     * @param fieldName 字段名
     * @throws ValidationException 如果对象为null
     */
    public static void notNull(Object obj, String fieldName) {
        if (obj == null) {
            throw new ValidationException(fieldName + " 不能为空");
        }
    }

    /**
     * 检查字符串是否为空
     *
     * @param str 要检查的字符串
     * @param fieldName 字段名
     * @throws ValidationException 如果字符串为空
     */
    public static void notEmpty(String str, String fieldName) {
        if (!StringUtils.hasText(str)) {
            throw new ValidationException(fieldName + " 不能为空");
        }
    }

    /**
     * 检查集合是否为空
     *
     * @param collection 要检查的集合
     * @param fieldName 字段名
     * @throws ValidationException 如果集合为空
     */
    public static void notEmpty(Collection<?> collection, String fieldName) {
        if (CollectionUtils.isEmpty(collection)) {
            throw new ValidationException(fieldName + " 不能为空集合");
        }
    }

    /**
     * 检查Map是否为空
     *
     * @param map 要检查的Map
     * @param fieldName 字段名
     * @throws ValidationException 如果Map为空
     */
    public static void notEmpty(Map<?, ?> map, String fieldName) {
        if (CollectionUtils.isEmpty(map)) {
            throw new ValidationException(fieldName + " 不能为空Map");
        }
    }

    /**
     * 检查两个对象是否相等
     *
     * @param obj1 第一个对象
     * @param obj2 第二个对象
     * @param message 错误消息
     * @throws ValidationException 如果对象不相等
     */
    public static void equals(Object obj1, Object obj2, String message) {
        if (!Objects.equals(obj1, obj2)) {
            throw new ValidationException(message);
        }
    }

    /**
     * 检查条件是否为true
     *
     * @param condition 要检查的条件
     * @param message 错误消息
     * @throws ValidationException 如果条件为false
     */
    public static void isTrue(boolean condition, String message) {
        if (!condition) {
            throw new ValidationException(message);
        }
    }

    /**
     * 检查条件是否为false
     *
     * @param condition 要检查的条件
     * @param message 错误消息
     * @throws ValidationException 如果条件为true
     */
    public static void isFalse(boolean condition, String message) {
        if (condition) {
            throw new ValidationException(message);
        }
    }

    /**
     * 从ConstraintViolationException中提取错误信息
     *
     * @param ex ConstraintViolationException异常
     * @return 错误信息映射
     */
    public static Map<String, String> extractErrors(ConstraintViolationException ex) {
        Map<String, String> errors = new HashMap<>();
        for (ConstraintViolation<?> violation : ex.getConstraintViolations()) {
            errors.put(violation.getPropertyPath().toString(), violation.getMessage());
        }
        return errors;
    }
}