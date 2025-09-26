package org.backend.repository;

import org.backend.base.repository.BaseRepository;
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
}