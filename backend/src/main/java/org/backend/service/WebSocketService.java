package org.backend.service;

import org.backend.dto.response.webSocket.WebSocketMessageResponse;
import org.backend.dto.response.webSocket.WebSocketUserStatusResponse;
import org.backend.entity.Message;
import java.util.Map;

/**
 * WebSocket服务接口
 * 定义WebSocket相关的操作方法
 */
public interface WebSocketService {

    /**
     * 发送消息给指定用户
     * @param userId 用户ID
     * @param message 消息响应对象
     */
    void sendMessageToUser(String userId, WebSocketMessageResponse message);

    /**
     * 广播对话更新
     * @param userId 用户ID
     * @param conversation 对话更新信息
     */
    void broadcastConversationUpdate(String userId, Object conversation);

    /**
     * 发送用户状态更新
     * @param userId 用户ID
     * @param statusResponse 用户状态响应对象
     */
    void sendUserStatusUpdate(String userId, WebSocketUserStatusResponse statusResponse);

    /**
     * 广播正在输入状态
     * @param conversationId 对话ID
     * @param userId 用户ID
     * @param isTyping 是否正在输入
     */
    void broadcastTypingStatus(String conversationId, String userId, Boolean isTyping);

    /**
     * 处理用户连接
     * @param userId 用户ID
     * @param sessionId 会话ID
     */
    void handleUserConnect(String userId, String sessionId);

    /**
     * 处理用户断开连接
     * @param userId 用户ID
     */
    void handleUserDisconnect(String userId);

    /**
     * 获取用户连接状态
     * @param userId 用户ID
     * @return 是否连接
     */
    boolean isUserConnected(String userId);

    /**
     * 将消息实体转换为WebSocket消息响应
     * @param message 消息实体
     * @return WebSocket消息响应
     */
    WebSocketMessageResponse convertToWebSocketResponse(Message message);
}