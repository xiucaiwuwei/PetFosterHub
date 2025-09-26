package org.backend.entity;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.backend.base.entity.BaseEntity;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
@Table(name = "messages")
@Schema(description = "消息实体")
public class Message extends BaseEntity {

    @Column(name = "conversation_id")
    @Schema(description = "会话ID")
    private Long conversationId;

    @Column(name = "sender_id")
    @Schema(description = "发送者ID")
    private Long senderId;

    @Column(name = "receiver_id")
    @Schema(description = "接收者ID")
    private Long receiverId;

    @Column(columnDefinition = "TEXT")
    @Schema(description = "内容")
    private String content;

    @Column(name = "is_read")
    @Schema(description = "是否已读")
    private Boolean isRead = false;

    @Column(name = "deleted")
    @Schema(description = "逻辑删除")
    private Boolean deleted = false;
}
