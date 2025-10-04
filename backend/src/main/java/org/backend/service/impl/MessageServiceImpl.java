package org.backend.service.impl;

import org.backend.dto.request.message.ImageMessageRequest;
import org.backend.dto.request.message.VideoMessageRequest;
import org.backend.entity.Message;
import org.backend.entity.User;
import org.backend.event.NewMessageEvent;
import org.backend.repository.MessageRepository;
import org.backend.repository.UserRepository;
import org.backend.service.MessageService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

/**
 * 消息服务实现类
 * 实现消息管理相关的业务逻辑
 */
@Service
public class MessageServiceImpl implements MessageService {

    private static final Logger logger = LoggerFactory.getLogger(MessageServiceImpl.class);

    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final ApplicationEventPublisher eventPublisher;
    
    // 用于存储用户屏蔽关系
    private static final Map<Long, Set<Long>> blockedUsers = new ConcurrentHashMap<>();

    @Autowired
    public MessageServiceImpl(MessageRepository messageRepository,
                            UserRepository userRepository,
                            ApplicationEventPublisher eventPublisher) {
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
        this.eventPublisher = eventPublisher;
    }

    @Override
    public List<Message> getMessagesByConversationId(Long conversationId) {
        return messageRepository.findByConversationIdAndDeletedFalseOrderByCreatedAtAsc(conversationId);
    }

    @Override
    public Message sendMessage(Message message) {
        // 检查接收者是否屏蔽了发送者
        if (isUserBlocked(message.getSenderId(), message.getReceiverId())) {
            logger.warn("用户 {} 已被屏蔽，无法发送消息", message.getSenderId());
            return null;
        }

        message.setCreatedAt(LocalDateTime.now());
        message.setUpdatedAt(LocalDateTime.now());
        message.setIsRead(false);
        message.setDeleted(false);
        
        Message savedMessage = messageRepository.save(message);
        
        // 通过事件发布新消息通知
        eventPublisher.publishEvent(new NewMessageEvent(savedMessage));
        
        return savedMessage;
    }

    @Override
    public Message sendImageMessage(ImageMessageRequest request, Long currentUserId) {
        Long receiverId = request.getReceiverId();
        Long conversationId = request.getConversationId();
        String content = request.getContent();
        
        Message message = new Message(currentUserId, receiverId, conversationId, content);
        
        return sendMessage(message);
    }

    @Override
    public Message sendVideoMessage(VideoMessageRequest request, Long currentUserId) {
        Long receiverId = request.getReceiverId();
        Long conversationId = request.getConversationId();
        String content = request.getContent();
        
        Message message = new Message(currentUserId, receiverId, conversationId, content);
        
        return sendMessage(message);
    }

    @Override
    public Message sendImageMessage(Map<String, Object> messageData, Long currentUserId) {
        Long receiverId = Long.parseLong(messageData.get("receiverId").toString());
        Long conversationId = Long.parseLong(messageData.get("conversationId").toString());
        String content = (String) messageData.get("content");
        
        Message message = new Message(currentUserId, receiverId, conversationId, content);
        
        return sendMessage(message);
    }

    @Override
    public Message sendVideoMessage(Map<String, Object> messageData, Long currentUserId) {
        // 复用图片消息的逻辑
        return sendImageMessage(messageData, currentUserId);
    }

    @Override
    public void markMessagesAsRead(String conversationId, String userId) {
        try {
            Long convId = Long.parseLong(conversationId);
            Long userid = Long.parseLong(userId);
            
            List<Message> messages = messageRepository.findByConversationIdAndReceiverIdAndIsReadFalseAndDeletedFalseOrderByCreatedAtDesc(
                    convId, userid);
            
            messages.forEach(message -> {
                message.setIsRead(true);
                message.setUpdatedAt(LocalDateTime.now());
            });
            
            messageRepository.saveAll(messages);
            logger.info("已将对话 {} 中的 {} 条消息标记为已读", conversationId, messages.size());
        } catch (NumberFormatException e) {
            logger.error("标记消息已读失败：无效的ID格式", e);
        }
    }

    @Override
    public void markLatestMessageAsUnread(Long conversationId, Long userId) {
        List<Message> messages = messageRepository.findByConversationIdAndReceiverIdAndDeletedFalseOrderByCreatedAtDesc(
                conversationId, userId);
        
        if (!messages.isEmpty()) {
            Message latestMessage = messages.getFirst();
            latestMessage.setIsRead(false);
            latestMessage.setUpdatedAt(LocalDateTime.now());
            messageRepository.save(latestMessage);
        }
    }

    @Override
    public void deleteMessage(Long messageId, Long userId) {
        Optional<Message> optionalMessage = messageRepository.findById(messageId);
        
        if (optionalMessage.isPresent()) {
            Message message = optionalMessage.get();
            // 验证用户权限
            if (message.getSenderId().equals(userId) || message.getReceiverId().equals(userId)) {
                message.setDeleted(true);
                message.setUpdatedAt(LocalDateTime.now());
                messageRepository.save(message);
            }
        }
    }

    @Override
    public void blockUser(Long userId, Long targetUserId) {
        blockedUsers.computeIfAbsent(userId, k -> ConcurrentHashMap.newKeySet()).add(targetUserId);
        logger.info("用户 {} 已屏蔽用户 {}", userId, targetUserId);
    }

    @Override
    public void unblockUser(Long userId, Long targetUserId) {
        Set<Long> blocked = blockedUsers.get(userId);
        if (blocked != null) {
            blocked.remove(targetUserId);
            if (blocked.isEmpty()) {
                blockedUsers.remove(userId);
            }
            logger.info("用户 {} 已取消屏蔽用户 {}", userId, targetUserId);
        }
    }

    @Override
    public boolean isUserBlocked(Long senderId, Long receiverId) {
        Set<Long> blocked = blockedUsers.get(receiverId);
        return blocked != null && blocked.contains(senderId);
    }

    @Override
    public int getUnreadMessageCount(Long userId) {
        return Math.toIntExact(messageRepository.countByReceiverIdAndIsReadFalseAndDeletedFalse(userId));
    }

    @Override
    public List<Map<String, Object>> getUserConversations(Long userId) {
        List<Map<String, Object>> conversations = new ArrayList<>();
        
        // 查询用户参与的所有对话
        List<Object[]> results = messageRepository.findConversationsByUserId(userId);
        
        for (Object[] result : results) {
            Long conversationId = (Long) result[0];
            Long otherUserId = (Long) result[1];
            String lastMessage = (String) result[2];
            LocalDateTime lastMessageTime = (LocalDateTime) result[3];
            Long unreadCount = (Long) result[4];
            
            // 获取对方用户信息
            Optional<User> otherUserOpt = userRepository.findById(otherUserId);
            if (otherUserOpt.isPresent()) {
                User otherUser = otherUserOpt.get();
                Map<String, Object> conversation = new HashMap<>();
                conversation.put("id", conversationId);
                conversation.put("userId", otherUserId);
                conversation.put("nickname", otherUser.getNickname());
                conversation.put("avatar", otherUser.getAvatar());
                conversation.put("lastMessage", lastMessage);
                conversation.put("lastMessageTime", lastMessageTime);
                conversation.put("unreadCount", unreadCount);
                
                conversations.add(conversation);
            }
        }
        
        // 按最后消息时间排序
        conversations.sort((a, b) -> {
            LocalDateTime timeA = (LocalDateTime) a.get("lastMessageTime");
            LocalDateTime timeB = (LocalDateTime) b.get("lastMessageTime");
            return timeB.compareTo(timeA);
        });
        
        return conversations;
    }

    @Override
    public boolean deleteConversation(Long conversationId, Long userId) {
        // 逻辑删除用户在该对话中的所有消息
        List<Message> messages = messageRepository.findByConversationIdAndUserIdAndDeletedFalse(conversationId, userId);
        
        if (!messages.isEmpty()) {
            messages.forEach(message -> {
                message.setDeleted(true);
                message.setUpdatedAt(LocalDateTime.now());
            });
            messageRepository.saveAll(messages);
            return true;
        }
        return false;
    }
}