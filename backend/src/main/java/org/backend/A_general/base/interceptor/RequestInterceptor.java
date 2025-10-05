package org.backend.A_general.base.interceptor;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * 请求拦截器，用于填充请求中的通用字段和记录请求日志
 * <p>
 * 该拦截器在每个HTTP请求处理之前执行，用于：
 * 1. 生成并设置请求ID
 * 2. 记录请求时间戳
 * 3. 获取并记录客户端IP地址
 * 4. 记录User-Agent和请求来源
 * 5. 输出请求日志以便追踪和调试
 */
@Component
public class RequestInterceptor implements HandlerInterceptor {

    private static final Logger logger = LoggerFactory.getLogger(RequestInterceptor.class);

    /**
     * 在请求处理之前执行的方法
     *
     * @param request  HTTP请求对象
     * @param response HTTP响应对象
     * @param handler  被调用的处理器对象
     * @return true表示继续执行后续拦截器和处理器，false表示中断执行
     */
    @Override
    public boolean preHandle(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response, @NonNull Object handler) {
        // 设置请求ID
        String requestId = UUID.randomUUID().toString();
        request.setAttribute("requestId", requestId);

        // 设置时间戳
        request.setAttribute("timestamp", LocalDateTime.now());

        // 设置客户端IP
        String clientIp = getClientIp(request);
        request.setAttribute("clientIp", clientIp);

        // 设置User-Agent
        String userAgent = request.getHeader("User-Agent");
        request.setAttribute("userAgent", userAgent);

        // 设置请求来源
        String referer = request.getHeader("Referer");
        request.setAttribute("source", referer);

        // 记录请求日志
        logger.info("请求: {} {} | 客户端IP: {} | 请求ID: {}",
                request.getMethod(), request.getRequestURI(), clientIp, requestId);

        return true;
    }

    /**
     * 获取客户端真实IP地址
     * <p>
     * 该方法会依次检查常见的代理服务器设置的HTTP头信息，
     * 如果都获取不到则使用请求的远程地址
     *
     * @param request HTTP请求对象
     * @return 客户端IP地址
     */
    private String getClientIp(HttpServletRequest request) {
        String[] headers = {
                "X-Forwarded-For",
                "X-Real-IP",
                "Proxy-Client-IP",
                "WL-Proxy-Client-IP",
                "HTTP_X_FORWARDED_FOR",
                "HTTP_X_FORWARDED",
                "HTTP_X_CLUSTER_CLIENT_IP",
                "HTTP_CLIENT_IP",
                "HTTP_FORWARDED_FOR",
                "HTTP_FORWARDED",
                "HTTP_VIA",
                "REMOTE_ADDR"
        };

        for (String header : headers) {
            String ip = request.getHeader(header);
            if (ip != null && !ip.isEmpty() && !"unknown".equalsIgnoreCase(ip)) {
                return ip.split(",")[0].trim();
            }
        }

        return request.getRemoteAddr();
    }
}