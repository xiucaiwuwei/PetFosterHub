package org.backend.A_general.base.interceptor;

import org.backend.A_general.base.security.JwtTokenProvider;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpRequest;
import org.springframework.lang.NonNull;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;

import java.util.Map;

/**
 * WebSocket认证拦截器
 * 用于验证WebSocket连接的用户身份
 */
@Component
public class WebSocketAuthenticationInterceptor implements HandshakeInterceptor {

    private static final Logger logger = LoggerFactory.getLogger(WebSocketAuthenticationInterceptor.class);
    
    private final JwtTokenProvider jwtTokenProvider;

    public WebSocketAuthenticationInterceptor(JwtTokenProvider jwtTokenProvider) {
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @Override
    public boolean beforeHandshake(@NonNull ServerHttpRequest request,
                                   @NonNull ServerHttpResponse response,
                                   @NonNull WebSocketHandler wsHandler,
                                   @NonNull Map<String, Object> attributes) {
        // 从请求URL中提取token参数
        if (request instanceof ServletServerHttpRequest servletRequest) {
            String token = servletRequest.getServletRequest().getParameter("token");
            String[] uriParts = servletRequest.getServletRequest().getRequestURI().split("/");
            // 从路径/api/ws/messages/{userId}中提取userId (索引4)
            String userId = uriParts.length > 4 ? uriParts[4] : null;

            // 验证token和用户ID
            if (token != null && userId != null && jwtTokenProvider.validateToken(token)) {
                String tokenUserId = jwtTokenProvider.getUserIdFromToken(token);
                // 确保token中的用户ID与请求路径中的用户ID匹配
                if (userId.equals(tokenUserId)) {
                    // 设置用户认证信息
                    Authentication authentication = jwtTokenProvider.getAuthentication(token);
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                    // 将用户ID存储在attributes中，供后续使用
                    attributes.put("userId", userId);
                    return true;
                } else {
                    logger.warn("Token中的用户ID与请求路径中的用户ID不匹配: tokenUserId={}, pathUserId={}", tokenUserId, userId);
                }
            } else {
                logger.warn("WebSocket认证失败: token={}, userId={}", token, userId);
            }
        }
        return false; // 认证失败，拒绝连接
    }

    @Override
    public void afterHandshake(@NonNull ServerHttpRequest request,
                              @NonNull ServerHttpResponse response,
                              @NonNull WebSocketHandler wsHandler,
                              Exception exception) {
        // 握手后的处理，可以留空
        
    }
}