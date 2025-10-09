package org.backend.service.impl;

import org.backend.dto.response.webSocket.WebSocketMessageResponse;
import org.backend.dto.response.webSocket.WebSocketUserStatusResponse;
import org.backend.entity.Message;
import org.backend.entity.User;
import org.backend.service.UserService;
import org.backend.service.WebSocketService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * WebSocket服务实现类
 * 负责处理WebSocket消息的发送、广播等功能
 */
@Service
public class WebSocketServiceImpl implements WebSocketService {

    private static final Logger logger = LoggerFactory.getLogger(WebSocketServiceImpl.class);

    private final SimpMessagingTemplate messagingTemplate;
    private final UserService userService;

    // 存储用户连接状态
    private final Map<String, String> userConnections = new ConcurrentHashMap<>();
    // 存储用户在线状态
    private final Map<String, String> userStatuses = new ConcurrentHashMap<>();

    @Autowired
    public WebSocketServiceImpl(SimpMessagingTemplate messagingTemplate, UserService userService) {
        this.messagingTemplate = messagingTemplate;
        this.userService = userService;
    }

    /**
     * 发送消息给指定用户
     * @param userId 用户ID
     * @param message 消息响应对象
     */
    public void sendMessageToUser(String userId, WebSocketMessageResponse message) {
        try {
            messagingTemplate.convertAndSendToUser(
                userId,
                "/queue/messages",
                message
            );
            logger.debug("已发送消息给用户: userId={}", userId);
        } catch (Exception e) {
            logger.error("发送消息给用户失败: userId={}, error={}", userId, e.getMessage());
        }
    }

    /**
     * 广播对话更新
     * @param userId 用户ID
     * @param conversation 对话更新信息
     */
    public void broadcastConversationUpdate(String userId, Object conversation) {
        try {
            messagingTemplate.convertAndSendToUser(
                userId,
                "/queue/conversation-updates",
                conversation
            );
            logger.debug("已广播对话更新给用户: userId={}", userId);
        } catch (Exception e) {
            logger.error("广播对话更新失败: userId={}, error={}", userId, e.getMessage());
        }
    }

    /**
     * 发送用户状态更新
     * @param userId 用户ID
     * @param statusResponse 用户状态响应对象
     */
    public void sendUserStatusUpdate(String userId, WebSocketUserStatusResponse statusResponse) {
        try {
            messagingTemplate.convertAndSendToUser(
                userId,
                "/queue/user-status",
                statusResponse
            );
            
            // 安全地记录用户状态更新日志，避免访问不存在的getUserId方法
            if (statusResponse != null && statusResponse.getPayload() != null) {
                logger.debug("已发送用户状态更新: userId={}, targetUserId={}", 
                        userId, statusResponse.getPayload().getUserId());
            } else {
                logger.debug("已发送用户状态更新: userId={}", userId);
            }
        } catch (Exception e) {
            logger.error("发送用户状态更新失败: userId={}, error={}", userId, e.getMessage());
        }
    }

    /**
     * 广播正在输入状态
     * @param conversationId 对话ID
     * @param userId 用户ID
     * @param isTyping 是否正在输入
     */
    public void broadcastTypingStatus(String conversationId, String userId, Boolean isTyping) {
        try {
            // 创建正在输入状态对象
            Map<String, Object> typingStatus = new HashMap<>();
            typingStatus.put("userId", userId);
            typingStatus.put("conversationId", conversationId);
            typingStatus.put("isTyping", isTyping);
            
            // 广播到所有订阅了该主题的客户端
            messagingTemplate.convertAndSend(
                "/topic/typing",
                typingStatus
            );
            logger.debug("已广播正在输入状态: userId={}, conversationId={}, isTyping={}", 
                    userId, conversationId, isTyping);
        } catch (Exception e) {
            logger.error("广播正在输入状态失败: userId={}, conversationId={}, error={}", 
                    userId, conversationId, e.getMessage());
        }
    }

    /**
     * 处理用户连接
     * @param userId 用户ID
     * @param sessionId 会话ID
     */
    public void handleUserConnect(String userId, String sessionId) {
        userConnections.put(userId, sessionId);
        updateUserStatus(userId, "online");
        logger.info("用户已连接WebSocket: userId={}, sessionId={}", userId, sessionId);
    }

    /**
     * 处理用户断开连接
     * @param userId 用户ID
     */
    public void handleUserDisconnect(String userId) {
        userConnections.remove(userId);
        updateUserStatus(userId, "offline");
        logger.info("用户已断开WebSocket连接: userId={}", userId);
    }

    /**
     * 更新用户状态
     * @param userId 用户ID
     * @param status 状态 (online, offline, away)
     */
    private void updateUserStatus(String userId, String status) {
        userStatuses.put(userId, status);
        logger.info("用户状态已更新: userId={}, status={}", userId, status);
        
        // 创建用户状态响应对象
        WebSocketUserStatusResponse statusResponse = new WebSocketUserStatusResponse();
        // 设置消息类型为USER_STATUS_CHANGE（默认为此值，这里显式设置以便清晰）
        statusResponse.setType("USER_STATUS_CHANGE");
        
        // 创建用户状态数据对象
        WebSocketUserStatusResponse.UserStatusData statusData = 
                new WebSocketUserStatusResponse.UserStatusData();
        statusData.setUserId(userId);
        statusData.setStatus(status);
        
        // 设置payload
        statusResponse.setPayload(statusData);
        
        // 在实际应用中，这里应该只通知与该用户有对话的其他用户
        // 为简化实现，这里暂时只记录日志，不实际发送通知
        // TODO: 实现获取用户对话列表，并向相关用户发送状态更新
        logger.debug("用户状态更新已创建，等待发送通知: userId={}, status={}", userId, status);
    }

    /**
     * 获取用户连接状态
     * @param userId 用户ID
     * @return 是否连接
     */
    public boolean isUserConnected(String userId) {
        return userConnections.containsKey(userId);
    }

    /**
     * 将消息实体转换为WebSocket消息响应
     * @param message 消息实体
     * @return WebSocket消息响应
     */
    public WebSocketMessageResponse convertToWebSocketResponse(Message message) {
        WebSocketMessageResponse response = new WebSocketMessageResponse();
        // 设置消息类型为NEW_MESSAGE（默认为此值，这里显式设置以便清晰）
        response.setType("NEW_MESSAGE");
        // 直接将消息实体设置为payload
        response.setPayload(message);
        
        return response;
    }
}