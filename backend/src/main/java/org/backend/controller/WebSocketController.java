package org.backend.controller;

import org.backend.dto.request.webSocket.WebSocketReadReceiptRequest;
import org.backend.dto.request.webSocket.WebSocketTypingStatusRequest;
import org.backend.dto.response.webSocket.WebSocketMessageResponse;
import org.backend.dto.response.webSocket.WebSocketUserStatusResponse;
import org.backend.entity.Message;
import org.backend.event.NewMessageEvent;
import org.backend.service.MessageService;
import org.backend.service.WebSocketService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;

import java.util.Map;

/**
 * WebSocket消息控制器
 * 处理实时消息通信，包括消息已读确认、正在输入状态等
 */
@Controller
public class WebSocketController {

    private static final Logger logger = LoggerFactory.getLogger(WebSocketController.class);

    private final SimpMessagingTemplate messagingTemplate;
    private final MessageService messageService;
    private final WebSocketService webSocketService;

    @Autowired
    public WebSocketController(SimpMessagingTemplate messagingTemplate, 
                              MessageService messageService,
                              WebSocketService webSocketService) {
        this.messagingTemplate = messagingTemplate;
        this.messageService = messageService;
        this.webSocketService = webSocketService;
    }

    /**
     * 处理消息已读确认
     */
    @MessageMapping("/message.read_receipt")
    public void handleReadReceipt(@Payload WebSocketReadReceiptRequest request) {
        try {
            String conversationId = request.getConversationId();
            logger.info("收到消息已读确认: conversationId={}", conversationId);
            
            // 标记消息为已读
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication != null && authentication.isAuthenticated()) {
                String currentUserId = authentication.getName();
                // 使用MessageService来标记消息为已读
                messageService.markMessagesAsRead(conversationId, currentUserId);
                logger.info("消息已读确认处理成功，用户ID: {}, 对话ID: {}", currentUserId, conversationId);
            } else {
                logger.warn("未认证用户尝试确认消息已读，对话ID: {}", conversationId);
            }
        } catch (Exception e) {
            logger.error("处理消息已读确认失败: {}", e.getMessage());
        }
    }
    
    /**
     * 处理消息发送
     */
    @MessageMapping("/message.send")
    public void handleSendMessage(@Payload Message message) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication != null && authentication.isAuthenticated()) {
                String currentUserId = authentication.getName();
                Long senderId = Long.parseLong(currentUserId);
                
                // 设置发送者ID为当前认证用户
                message.setSenderId(senderId);
                
                // 发送消息
                Message savedMessage = messageService.sendMessage(message);
                if (savedMessage != null) {
                    logger.info("通过WebSocket发送消息成功: senderId={}, receiverId={}, conversationId={}", 
                            senderId, message.getReceiverId(), message.getConversationId());
                    
                    // 通知接收者有新消息
                    WebSocketMessageResponse response = webSocketService.convertToWebSocketResponse(savedMessage);
                    webSocketService.sendMessageToUser(savedMessage.getReceiverId().toString(), response);
                } else {
                    logger.warn("通过WebSocket发送消息失败: senderId={}, receiverId={}", senderId, message.getReceiverId());
                }
            } else {
                logger.warn("未认证用户尝试发送消息");
            }
        } catch (Exception e) {
            logger.error("处理WebSocket消息发送失败: {}", e.getMessage());
        }
    }

    /**
     * 处理正在输入状态
     */
    @MessageMapping("/message.typing_status")
    public void handleTypingStatus(@Payload WebSocketTypingStatusRequest request) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication != null && authentication.isAuthenticated()) {
                String currentUserId = authentication.getName();
                logger.info("收到输入状态更新: userId={}, conversationId={}, isTyping={}", 
                        currentUserId, request.getConversationId(), request.getIsTyping());
                
                // 广播输入状态到特定对话
                webSocketService.broadcastTypingStatus(
                        request.getConversationId(), 
                        currentUserId, 
                        request.getIsTyping());
                
                logger.info("输入状态更新处理成功: userId={}, conversationId={}", currentUserId, request.getConversationId());
            } else {
                logger.warn("未认证用户尝试更新输入状态");
            }
        } catch (Exception e) {
            logger.error("处理输入状态更新失败: {}", e.getMessage());
        }
    }

    /**
     * 监听新消息事件并通知用户
     */
    @EventListener
    public void handleNewMessageEvent(NewMessageEvent event) {
        try {
            if (event == null || event.getMessage() == null) {
                logger.warn("收到空的新消息事件");
                return;
            }
            
            Message message = event.getMessage();
            notifyNewMessage(message.getReceiverId().toString(), message);
        } catch (Exception e) {
            logger.error("处理新消息事件失败: {}", e.getMessage());
        }
    }

    /**
     * 发送新消息通知给特定用户
     * @param userId 接收用户ID
     * @param message 消息对象
     */
    public void notifyNewMessage(String userId, Message message) {
        try {
            // 参数验证
            if (userId == null || userId.isEmpty()) {
                return;
            }
            
            if (message == null) {
                return;
            }
            
            WebSocketMessageResponse response = new WebSocketMessageResponse();
            response.setPayload(message);
            
            messagingTemplate.convertAndSendToUser(
                    userId,
                    "/queue/messages",
                    response
            );
            logger.info("已发送新消息通知给用户: userId={}, messageId={}", userId, message.getId());
        } catch (Exception e) {
            logger.error("发送新消息通知失败: {}", e.getMessage());
        }
    }

    /**
     * 发送对话更新通知给特定用户
     * @param userId 接收用户ID
     * @param conversation 对话对象
     */
    public void notifyConversationUpdate(String userId, Object conversation) {
        try {
            // 参数验证
            if (userId == null || userId.isEmpty()) {
                return;
            }
            
            Map<String, Object> payload = Map.of(
                    "type", "CONVERSATION_UPDATE",
                    "payload", conversation
            );
            messagingTemplate.convertAndSendToUser(
                    userId,
                    "/queue/conversations",
                    payload
            );
            logger.info("已发送对话更新通知给用户: userId={}", userId);
        } catch (Exception e) {
            logger.error("发送对话更新通知失败: {}", e.getMessage());
        }
    }

    /**
     * 发送用户状态变化通知
     * @param userId 状态变化的用户ID
     * @param status 新状态
     */
    public void notifyUserStatusChange(String userId, String status) {
        try {
            // 参数验证
            if (userId == null || userId.isEmpty()) {
                return;
            }
            
            if (status == null || status.isEmpty()) {
                return;
            }
            
            WebSocketUserStatusResponse.UserStatusData userStatusData = 
                new WebSocketUserStatusResponse.UserStatusData();
            userStatusData.setUserId(userId);
            userStatusData.setStatus(status);
            
            WebSocketUserStatusResponse response = new WebSocketUserStatusResponse();
            response.setPayload(userStatusData);
            
            messagingTemplate.convertAndSend("/topic/user_status", response);
            logger.info("已发送用户状态变化通知: userId={}, status={}", userId, status);
        } catch (Exception e) {
            logger.error("发送用户状态变化通知失败: {}", e.getMessage());
        }
    }
}