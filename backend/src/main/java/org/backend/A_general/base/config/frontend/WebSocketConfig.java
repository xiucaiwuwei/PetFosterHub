package org.backend.A_general.base.config.frontend;

import io.swagger.v3.oas.annotations.media.Schema;
import org.backend.A_general.base.interceptor.WebSocketAuthenticationInterceptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

/**
 * WebSocket配置类
 * 配置WebSocket消息代理和端点
 * 该配置类启用WebSocket消息代理，注册STOMP端点，并配置消息路由规则。
 * 支持广播消息、点对点消息以及客户端与服务器之间的实时通信。
 */
@Configuration
@EnableWebSocketMessageBroker
@Schema(description = "WebSocket配置类")
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    private final WebSocketAuthenticationInterceptor webSocketAuthenticationInterceptor;
    
    @Value("${websocket.allowed-origins:*}")
    private String[] allowedOrigins;

    @Autowired
    public WebSocketConfig(WebSocketAuthenticationInterceptor webSocketAuthenticationInterceptor) {
        this.webSocketAuthenticationInterceptor = webSocketAuthenticationInterceptor;
    }

    /**
     * 配置消息代理
     * 
     * @param config 消息代理注册表，用于配置消息路由规则
     */
    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // 启用简单的消息代理，用于将消息广播给客户端
        config.enableSimpleBroker("/topic", "/queue");
        // 设置应用程序目的地前缀，客户端发送消息到服务器时使用
        config.setApplicationDestinationPrefixes("/app");
        // 设置用户目的地前缀，用于发送消息给特定用户
        config.setUserDestinationPrefix("/user");
    }

    /**
     * 注册STOMP端点
     * 
     * @param registry STOMP端点注册表，用于注册WebSocket连接端点
     */
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // 注册WebSocket端点，客户端将使用这个端点连接服务器
        // 支持SockJS协议，以便在不支持WebSocket的浏览器中使用备用传输方式
        registry.addEndpoint("/api/ws/messages/{userId}")
                .setAllowedOrigins(allowedOrigins)  // 允许所有源访问，生产环境应该限制特定源
                .addInterceptors(webSocketAuthenticationInterceptor)
                .withSockJS();
    }
}