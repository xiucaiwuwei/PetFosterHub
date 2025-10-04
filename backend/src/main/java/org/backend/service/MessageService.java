package org.backend.service;

import org.backend.dto.request.message.ImageMessageRequest;
import org.backend.dto.request.message.VideoMessageRequest;
import org.backend.entity.Message;

import java.util.List;
import java.util.Map;

/**
 * 消息服务接口
 * 提供消息管理相关的业务逻辑
 */
public interface MessageService {

    /**
     * 获取对话中的消息列表
     * @param conversationId 对话ID
     * @return 消息列表
     */
    List<Message> getMessagesByConversationId(Long conversationId);

    /**
     * 发送消息
     * @param message 消息对象
     * @return 发送后的消息
     */
    Message sendMessage(Message message);

    /**
     * 发送图片消息
     * @param request 图片消息请求
     * @param currentUserId 当前用户ID
     * @return 发送后的消息
     */
    Message sendImageMessage(ImageMessageRequest request, Long currentUserId);

    /**
     * 发送视频消息
     * @param request 视频消息请求
     * @param currentUserId 当前用户ID
     * @return 发送后的消息
     */
    Message sendVideoMessage(VideoMessageRequest request, Long currentUserId);

    /**
     * 发送图片消息（兼容旧版本）
     * @param messageData 消息数据
     * @param currentUserId 当前用户ID
     * @return 发送后的消息
     * @deprecated 请使用sendImageMessage(ImageMessageRequest, Long)方法
     */
    @Deprecated
    Message sendImageMessage(Map<String, Object> messageData, Long currentUserId);

    /**
     * 发送视频消息（兼容旧版本）
     * @param messageData 消息数据
     * @param currentUserId 当前用户ID
     * @return 发送后的消息
     * @deprecated 请使用sendVideoMessage(VideoMessageRequest, Long)方法
     */
    @Deprecated
    Message sendVideoMessage(Map<String, Object> messageData, Long currentUserId);

    /**
     * 标记对话中所有消息为已读
     * @param conversationId 对话ID
     * @param userId 用户ID
     */
    void markMessagesAsRead(String conversationId, String userId);

    /**
     * 标记最新消息为未读
     * @param conversationId 对话ID
     * @param userId 用户ID
     */
    void markLatestMessageAsUnread(Long conversationId, Long userId);

    /**
     * 逻辑删除消息
     *
     * @param messageId 消息ID
     * @param userId    用户ID
     */
    void deleteMessage(Long messageId, Long userId);

    /**
     * 屏蔽用户
     * @param userId 当前用户ID
     * @param targetUserId 目标用户ID
     */
    void blockUser(Long userId, Long targetUserId);

    /**
     * 取消屏蔽用户
     * @param userId 当前用户ID
     * @param targetUserId 目标用户ID
     */
    void unblockUser(Long userId, Long targetUserId);

    /**
     * 检查用户是否被屏蔽
     * @param senderId 发送者ID
     * @param receiverId 接收者ID
     * @return 是否被屏蔽
     */
    boolean isUserBlocked(Long senderId, Long receiverId);

    /**
     * 获取用户未读消息数量
     * @param userId 用户ID
     * @return 未读消息数量
     */
    int getUnreadMessageCount(Long userId);

    /**
     * 获取用户的对话列表
     * @param userId 用户ID
     * @return 对话列表信息
     */
    List<Map<String, Object>> getUserConversations(Long userId);

    /**
     * 删除对话
     * @param conversationId 对话ID
     * @param userId 用户ID
     * @return 是否删除成功
     */
    boolean deleteConversation(Long conversationId, Long userId);
}