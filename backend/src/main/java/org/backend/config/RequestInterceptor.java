package org.backend.config;

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
 */
@Component
public class RequestInterceptor implements HandlerInterceptor {

    private static final Logger logger = LoggerFactory.getLogger(RequestInterceptor.class);

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
