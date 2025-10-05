package org.backend.repository;

import org.backend.A_general.base.repository.BaseRepository;
import org.backend.entity.Message;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends BaseRepository<Message, Long> {

    List<Message> findByConversationIdAndDeletedFalseOrderByCreatedAtAsc(Long conversationId);

    List<Message> findBySenderIdAndReceiverIdAndDeletedFalseOrderByCreatedAtDesc(Long senderId, Long receiverId);

    List<Message> findByReceiverIdAndDeletedFalseOrderByCreatedAtDesc(Long receiverId);

    List<Message> findBySenderIdAndDeletedFalseOrderByCreatedAtDesc(Long senderId);

    List<Message> findByReceiverIdAndIsReadFalseAndDeletedFalseOrderByCreatedAtDesc(Long receiverId);

    long countByReceiverIdAndIsReadFalseAndDeletedFalse(Long receiverId);

    List<Message> findByConversationIdAndReceiverIdAndIsReadFalseAndDeletedFalseOrderByCreatedAtDesc(Long conversationId, Long receiverId);

    List<Message> findByConversationIdAndReceiverIdAndDeletedFalseOrderByCreatedAtDesc(Long conversationId, Long receiverId);

    @Query("SELECT m FROM Message m WHERE m.conversationId = :conversationId AND m.deleted = false " +
            "AND ((m.senderId = :userId1 AND m.receiverId = :userId2) OR " +
            "(m.senderId = :userId2 AND m.receiverId = :userId1)) " +
            "ORDER BY m.createdAt ASC")
    List<Message> findConversationMessages(@Param("conversationId") Long conversationId,
                                           @Param("userId1") Long userId1,
                                           @Param("userId2") Long userId2);

    @Query("SELECT m FROM Message m WHERE m.conversationId IN " +
            "(SELECT DISTINCT conversationId FROM Message WHERE senderId = :userId OR receiverId = :userId) " +
            "AND m.deleted = false AND m.id IN " +
            "(SELECT MAX(id) FROM Message WHERE senderId = :userId OR receiverId = :userId GROUP BY conversationId) " +
            "ORDER BY m.createdAt DESC")
    List<Message> findLatestMessagesByUser(@Param("userId") Long userId);

    /**
     * 查询用户参与的所有对话信息
     * @param userId 用户ID
     * @return 对话信息列表，包含对话ID、对方用户ID、最后一条消息内容、时间和未读数量
     */
    @Query("SELECT DISTINCT m.conversationId, " +
            "CASE WHEN m.senderId = ?1 THEN m.receiverId ELSE m.senderId END AS otherUserId," +
            "(SELECT lastMsg.content FROM Message lastMsg " +
            "WHERE lastMsg.conversationId = m.conversationId " +
            "AND lastMsg.deleted = false " +
            "ORDER BY lastMsg.createdAt DESC LIMIT 1) AS lastMessage," +
            "(SELECT lastMsg.createdAt FROM Message lastMsg " +
            "WHERE lastMsg.conversationId = m.conversationId " +
            "AND lastMsg.deleted = false " +
            "ORDER BY lastMsg.createdAt DESC LIMIT 1) AS lastMessageTime," +
            "(SELECT COUNT(unreadMsg.id) FROM Message unreadMsg " +
            "WHERE unreadMsg.conversationId = m.conversationId " +
            "AND unreadMsg.receiverId = ?1 " +
            "AND unreadMsg.isRead = false " +
            "AND unreadMsg.deleted = false) AS unreadCount " +
            "FROM Message m " +
            "WHERE (m.senderId = ?1 OR m.receiverId = ?1) " +
            "AND m.deleted = false " +
            "GROUP BY m.conversationId, otherUserId " +
            "ORDER BY lastMessageTime DESC")
    List<Object[]> findConversationsByUserId(Long userId);

    /**
     * 查询用户在指定对话中的所有未删除消息
     * @param conversationId 对话ID
     * @param userId 用户ID
     * @return 消息列表
     */
    @Query("SELECT m FROM Message m WHERE m.conversationId = ?1 AND (m.senderId = ?2 OR m.receiverId = ?2) AND m.deleted = false")
    List<Message> findByConversationIdAndUserIdAndDeletedFalse(Long conversationId, Long userId);

    /**
     * 获取指定对话的最后一条消息
     * @param conversationId 对话ID
     * @return 最后一条消息
     */
    @Query("SELECT m FROM Message m WHERE m.conversationId = ?1 AND m.deleted = false ORDER BY m.createdAt DESC LIMIT 1")
    Message findLastMessageByConversationId(Long conversationId);
}