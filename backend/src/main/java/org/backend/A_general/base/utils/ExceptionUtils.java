package org.backend.A_general.base.utils;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.PrintWriter;
import java.io.StringWriter;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * 异常处理工具类
 * 提供异常信息提取、转换和处理等功能
 */
public class ExceptionUtils {

    private static final Logger logger = LoggerFactory.getLogger(ExceptionUtils.class);

    /**
     * 获取异常的完整堆栈信息
     *
     * @param throwable 异常对象
     * @return 完整的堆栈信息字符串
     */
    public static String getStackTrace(Throwable throwable) {
        if (throwable == null) {
            return ""; 
        }
        StringWriter sw = new StringWriter();
        try (PrintWriter pw = new PrintWriter(sw)) {
            throwable.printStackTrace(pw);
            return sw.toString();
        } catch (Exception e) {
            logger.error("获取堆栈信息失败: {}", e.getMessage());
            return throwable.toString();
        }
    }

    /**
     * 获取异常的简短信息（异常类名+消息）
     *
     * @param throwable 异常对象
     * @return 简短的异常信息
     */
    public static String getSimpleMessage(Throwable throwable) {
        if (throwable == null) {
            return ""; 
        }
        String message = throwable.getMessage();
        if (StringUtils.isNotBlank(message)) {
            return throwable.getClass().getSimpleName() + ": " + message;
        }
        return throwable.getClass().getSimpleName();
    }

    /**
     * 获取根异常
     *
     * @param throwable 异常对象
     * @return 根异常
     */
    public static Throwable getRootCause(Throwable throwable) {
        if (throwable == null) {
            return null; 
        }
        Throwable cause = throwable;
        while (cause.getCause() != null && cause != cause.getCause()) {
            cause = cause.getCause();
        }
        return cause;
    }

    /**
     * 获取异常链中所有异常的类型
     *
     * @param throwable 异常对象
     * @return 异常类型列表
     */
    public static List<Class<? extends Throwable>> getExceptionTypes(Throwable throwable) {
        List<Class<? extends Throwable>> types = new ArrayList<>();
        if (throwable == null) {
            return types; 
        }
        Throwable current = throwable;
        while (current != null) {
            types.add(current.getClass());
            // 避免循环引用
            if (current == current.getCause()) {
                break;
            }
            current = current.getCause();
        }
        return types;
    }

    /**
     * 检查异常链中是否包含指定类型的异常
     *
     * @param throwable 异常对象
     * @param exceptionType 要检查的异常类型
     * @return 是否包含指定类型的异常
     */
    public static boolean contains(Throwable throwable, Class<? extends Throwable> exceptionType) {
        if (throwable == null || exceptionType == null) {
            return false; 
        }
        Throwable current = throwable;
        while (current != null) {
            if (exceptionType.isAssignableFrom(current.getClass())) {
                return true;
            }
            // 避免循环引用
            if (current == current.getCause()) {
                break;
            }
            current = current.getCause();
        }
        return false;
    }

    /**
     * 在异常链中查找指定类型的异常
     *
     * @param throwable 异常对象
     * @param exceptionType 要查找的异常类型
     * @param <T> 异常类型
     * @return 指定类型的异常，如果不存在则返回null
     */
    @SuppressWarnings("unchecked")
    public static <T extends Throwable> T find(Throwable throwable, Class<T> exceptionType) {
        if (throwable == null || exceptionType == null) {
            return null; 
        }
        Throwable current = throwable;
        while (current != null) {
            if (exceptionType.isAssignableFrom(current.getClass())) {
                return (T) current;
            }
            // 避免循环引用
            if (current == current.getCause()) {
                break;
            }
            current = current.getCause();
        }
        return null;
    }

    /**
     * 转换异常类型
     *
     * @param throwable 原始异常
     * @param targetType 目标异常类型
     * @param <T> 目标异常类型
     * @return 转换后的异常
     */
    @SuppressWarnings("unchecked")
    public static <T extends Throwable> T convert(Throwable throwable, Class<T> targetType) {
        if (throwable == null || targetType == null) {
            return null; 
        }
        // 如果已经是目标类型，直接返回
        if (targetType.isAssignableFrom(throwable.getClass())) {
            return (T) throwable;
        }
        try {
            // 尝试创建新的目标类型异常
            String message = getSimpleMessage(throwable);
            T targetException;
            try {
                // 尝试使用带message和cause的构造函数
                targetException = targetType.getDeclaredConstructor(String.class, Throwable.class)
                        .newInstance(message, throwable);
            } catch (Exception e) {
                try {
                    // 尝试使用带message的构造函数
                    targetException = targetType.getDeclaredConstructor(String.class)
                            .newInstance(message);
                } catch (Exception ex) {
                    try {
                        // 尝试使用默认构造函数
                        targetException = targetType.getDeclaredConstructor().newInstance();
                    } catch (Exception exc) {
                        logger.error("转换异常类型失败: {}", exc.getMessage());
                        return null;
                    }
                }
            }
            return targetException;
        } catch (Exception e) {
            logger.error("转换异常类型失败: {}", e.getMessage());
            return null;
        }
    }

    /**
     * 包装异常
     *
     * @param throwable 原始异常
     * @param wrapperType 包装异常类型
     * @param <T> 包装异常类型
     * @return 包装后的异常
     */
    public static <T extends Throwable> T wrap(Throwable throwable, Class<T> wrapperType) {
        if (throwable == null || wrapperType == null) {
            return null; 
        }
        try {
            return wrapperType.getDeclaredConstructor(String.class, Throwable.class)
                    .newInstance(throwable.getMessage(), throwable);
        } catch (Exception e) {
            logger.error("包装异常失败: {}", e.getMessage());
            return null;
        }
    }

    /**
     * 解包异常（获取被包装的原始异常）
     *
     * @param throwable 包装异常
     * @return 原始异常
     */
    public static Throwable unwrap(Throwable throwable) {
        return switch (throwable) {
            case null -> null;

            // 特殊处理一些常见的包装异常
            case java.lang.reflect.UndeclaredThrowableException undeclaredThrowableException ->
                    unwrap(undeclaredThrowableException.getUndeclaredThrowable());
            case java.util.concurrent.ExecutionException executionException -> unwrap(executionException.getCause());
            case java.lang.reflect.InvocationTargetException invocationTargetException ->
                    unwrap(invocationTargetException.getTargetException());
            default -> throwable;
        };
    }

    /**
     * 安全地抛出检查型异常而无需声明throws
     *
     * @param throwable 要抛出的异常
     */
    public static void throwCheckedException(Throwable throwable) {
        if (throwable == null) {
            return; 
        }
        ExceptionUtils.throwException(throwable);
    }

    @SuppressWarnings("unchecked")
    private static <E extends Throwable> void throwException(Throwable throwable) throws E {
        throw (E) throwable;
    }

    /**
     * 提取SQL异常中的错误码
     *
     * @param throwable 异常对象
     * @return SQL错误码
     */
    public static Integer extractSqlErrorCode(Throwable throwable) {
        SQLException sqlException = find(throwable, SQLException.class);
        if (sqlException != null) {
            return sqlException.getErrorCode();
        }
        return null;
    }

    /**
     * 提取SQL异常中的SQL状态
     *
     * @param throwable 异常对象
     * @return SQL状态
     */
    public static String extractSqlState(Throwable throwable) {
        SQLException sqlException = find(throwable, SQLException.class);
        if (sqlException != null) {
            return sqlException.getSQLState();
        }
        return null;
    }

    /**
     * 提取异常信息中的关键字段
     *
     * @param throwable 异常对象
     * @param pattern 正则表达式模式
     * @return 匹配的字段值
     */
    public static String extractField(Throwable throwable, String pattern) {
        if (throwable == null || StringUtils.isBlank(pattern)) {
            return null; 
        }
        String message = throwable.getMessage();
        if (StringUtils.isBlank(message)) {
            return null; 
        }
        Pattern p = Pattern.compile(pattern);
        Matcher m = p.matcher(message);
        if (m.find() && m.groupCount() > 0) {
            return m.group(1);
        }
        return null;
    }

    /**
     * 处理异常并返回默认值
     *
     * @param supplier 可能抛出异常的操作
     * @param defaultValue 默认值
     * @param <T> 返回类型
     * @return 操作结果或默认值
     */
    public static <T> T handleException(SupplierWithException<T> supplier, T defaultValue) {
        if (supplier == null) {
            return defaultValue; 
        }
        try {
            return supplier.get();
        } catch (Exception e) {
            logger.error("执行操作异常: {}", getSimpleMessage(e));
            return defaultValue;
        }
    }

    /**
     * 处理异常并返回默认值，支持指定异常类型
     *
     * @param supplier 可能抛出异常的操作
     * @param defaultValue 默认值
     * @param exceptionTypes 要捕获的异常类型
     * @param <T> 返回类型
     * @return 操作结果或默认值
     */
    @SafeVarargs
    public static <T> T handleException(SupplierWithException<T> supplier, T defaultValue, 
                                        Class<? extends Exception>... exceptionTypes) {
        if (supplier == null) {
            return defaultValue; 
        }
        try {
            return supplier.get();
        } catch (Exception e) {
            if (exceptionTypes == null || exceptionTypes.length == 0 || contains(e, exceptionTypes)) {
                logger.error("执行操作异常: {}", getSimpleMessage(e));
                return defaultValue;
            } else {
                throwException(e);
                return defaultValue; // 不会执行到这里
            }
        }
    }

    /**
     * 处理异常，不返回值
     *
     * @param action 可能抛出异常的操作
     * @param errorMessage 错误信息
     */
    public static void handleException(RunnableWithException action, String errorMessage) {
        if (action == null) {
            return; 
        }
        try {
            action.run();
        } catch (Exception e) {
            if (StringUtils.isNotBlank(errorMessage)) {
                logger.error("{}", errorMessage, e);
            } else {
                logger.error("执行操作异常: {}", getSimpleMessage(e), e);
            }
        }
    }

    /**
     * 检查异常链中是否包含指定类型的异常
     *
     * @param throwable 异常对象
     * @param exceptionTypes 要检查的异常类型数组
     * @return 是否包含任一指定类型的异常
     */
    private static boolean contains(Throwable throwable, Class<? extends Exception>[] exceptionTypes) {
        if (throwable == null || exceptionTypes == null) {
            return false; 
        }
        for (Class<? extends Exception> exceptionType : exceptionTypes) {
            if (contains(throwable, exceptionType)) {
                return true;
            }
        }
        return false;
    }

    /**
     * 带异常的Supplier接口
     *
     * @param <T> 返回类型
     */
    @FunctionalInterface
    public interface SupplierWithException<T> {
        T get() throws Exception;
    }

    /**
     * 带异常的Runnable接口
     */
    @FunctionalInterface
    public interface RunnableWithException {
        void run() throws Exception;
    }

    /**
     * 格式化异常信息，限制长度
     *
     * @param throwable 异常对象
     * @param maxLength 最大长度
     * @return 格式化后的异常信息
     */
    public static String formatException(Throwable throwable, int maxLength) {
        if (throwable == null) {
            return ""; 
        }
        String fullMessage = getStackTrace(throwable);
        if (fullMessage.length() <= maxLength) {
            return fullMessage;
        }
        // 截取部分堆栈信息，并添加省略标记
        return fullMessage.substring(0, maxLength - 3) + "...";
    }

    /**
     * 获取异常的简短堆栈信息（只保留应用代码的堆栈）
     *
     * @param throwable 异常对象
     * @param packagePrefix 应用包前缀
     * @return 简短的堆栈信息
     */
    public static String getApplicationStackTrace(Throwable throwable, String packagePrefix) {
        if (throwable == null || StringUtils.isBlank(packagePrefix)) {
            return getStackTrace(throwable);
        }
        StringBuilder sb = new StringBuilder();
        sb.append(getSimpleMessage(throwable)).append("\n");
        StackTraceElement[] stackTrace = throwable.getStackTrace();
        for (StackTraceElement element : stackTrace) {
            if (element.getClassName().startsWith(packagePrefix)) {
                sb.append("\tat ").append(element).append("\n");
            }
        }
        return sb.toString();
    }

    /**
     * 获取异常的根本原因消息
     *
     * @param throwable 异常对象
     * @return 根本原因的消息
     */
    public static String getRootCauseMessage(Throwable throwable) {
        Throwable rootCause = getRootCause(throwable);
        if (rootCause != null) {
            String message = rootCause.getMessage();
            return StringUtils.isNotBlank(message) ? message : rootCause.getClass().getSimpleName();
        }
        return getSimpleMessage(throwable);
    }

    /**
     * 记录异常日志，根据异常类型选择日志级别
     *
     * @param throwable 异常对象
     * @param message 日志消息
     * @param args 日志参数
     */
    public static void logException(Throwable throwable, String message, Object... args) {
        switch (throwable) {
            case null -> {
            }
            case Error ignored -> logger.error(message, args, throwable);
            case RuntimeException ignored -> logger.warn(message, args, throwable);
            default -> logger.info(message, args, throwable);
        }
    }

    /**
     * 安全地关闭资源
     *
     * @param resource 要关闭的资源（实现了AutoCloseable接口）
     */
    public static void closeQuietly(AutoCloseable resource) {
        if (resource != null) {
            try {
                resource.close();
            } catch (Exception e) {
                logger.debug("关闭资源异常: {}", e.getMessage());
            }
        }
    }

    /**
     * 重试执行操作直到成功或达到最大重试次数
     *
     * @param action 要执行的操作
     * @param maxRetries 最大重试次数
     * @param retryDelayMs 重试间隔（毫秒）
     * @param <T> 返回类型
     * @return 操作结果
     * @throws Exception 如果所有重试都失败
     */
    public static <T> T retry(SupplierWithException<T> action, int maxRetries, long retryDelayMs) throws Exception {
        if (action == null) {
            throw new IllegalArgumentException("操作不能为空");
        }
        if (maxRetries < 0) {
            maxRetries = 0;
        }
        Exception lastException = null;
        for (int i = 0; i <= maxRetries; i++) {
            try {
                return action.get();
            } catch (Exception e) {
                lastException = e;
                // 如果是最后一次重试，不再等待
                if (i < maxRetries) {
                    try {
                        Thread.sleep(retryDelayMs);
                    } catch (InterruptedException ie) {
                        Thread.currentThread().interrupt();
                        throw new RuntimeException("重试被中断", ie);
                    }
                }
            }
        }
        // 所有重试都失败，抛出最后一次异常
        throw lastException;
    }

    /**
     * 重试执行操作直到成功或达到最大重试次数，支持指定重试的异常类型
     *
     * @param action 要执行的操作
     * @param maxRetries 最大重试次数
     * @param retryDelayMs 重试间隔（毫秒）
     * @param retryableExceptions 可重试的异常类型
     * @param <T> 返回类型
     * @return 操作结果
     * @throws Exception 如果所有重试都失败或遇到不可重试的异常
     */
    @SafeVarargs
    public static <T> T retry(SupplierWithException<T> action, int maxRetries, long retryDelayMs, 
                             Class<? extends Exception>... retryableExceptions) throws Exception {
        if (action == null) {
            throw new IllegalArgumentException("操作不能为空");
        }
        if (maxRetries < 0) {
            maxRetries = 0;
        }
        Exception lastException = null;
        for (int i = 0; i <= maxRetries; i++) {
            try {
                return action.get();
            } catch (Exception e) {
                // 检查是否是可重试的异常类型
                if (retryableExceptions == null || retryableExceptions.length == 0 || contains(e, retryableExceptions)) {
                    lastException = e;
                    // 如果是最后一次重试，不再等待
                    if (i < maxRetries) {
                        try {
                            Thread.sleep(retryDelayMs);
                        } catch (InterruptedException ie) {
                            Thread.currentThread().interrupt();
                            throw new RuntimeException("重试被中断", ie);
                        }
                    }
                } else {
                    // 不可重试的异常，直接抛出
                    throw e;
                }
            }
        }
        // 所有重试都失败，抛出最后一次异常
        throw lastException;
    }
}