package org.backend.entity;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.backend.A_general.base.entity.BaseEntity;
import org.backend.entity.enums.MessageType;

/**
 * 消息实体类
 * 用于表示用户之间的消息，支持文本、图片、视频等多种消息类型
 * 与前端TypeScript的Message接口保持一致
 */
@EqualsAndHashCode(callSuper = true)
@Data
@Entity
@Table(name = "messages")
@Schema(description = "消息实体")
@NoArgsConstructor
public class Message extends BaseEntity {

    @NotNull
    @Column(name = "conversation_id")
    @Schema(description = "会话ID")
    private Long conversationId;

    @NotNull
    @Column(name = "sender_id")
    @Schema(description = "发送者ID")
    private Long senderId;

    @NotNull
    @Column(name = "receiver_id")
    @Schema(description = "接收者ID")
    private Long receiverId;

    @NotBlank
    @Column(columnDefinition = "TEXT")
    @Schema(description = "内容")
    private String content;

    @Column(name = "is_read")
    @Schema(description = "是否已读")
    private boolean isRead = false;

    @Column(name = "deleted")
    @Schema(description = "逻辑删除")
    private boolean deleted = false;

    @Column(name = "message_type", nullable = false)
    @Schema(description = "消息类型 (text, image, video等)")
    private MessageType messageType = MessageType.Text;

    @Column(name = "media_url")
    @Schema(description = "媒体文件URL")
    private String mediaUrl;

    @Column(name = "file_name")
    @Schema(description = "文件名")
    private String fileName;

    @PositiveOrZero
    @Column(name = "file_size")
    @Schema(description = "文件大小")
    private Long fileSize;

    /**
     * 构造函数，用于快速创建文本消息对象
     * 
     * @param senderId 发送者ID
     * @param receiverId 接收者ID
     * @param conversationId 会话ID
     * @param content 消息内容
     */
    public Message(Long senderId, Long receiverId, Long conversationId, String content) {
        this.senderId = senderId;
        this.receiverId = receiverId;
        this.conversationId = conversationId;
        this.content = content;
    }

    /**
     * 构造函数，用于创建指定类型的消息对象
     * 
     * @param senderId 发送者ID
     * @param receiverId 接收者ID
     * @param conversationId 会话ID
     * @param content 消息内容
     * @param messageType 消息类型
     */
    public Message(Long senderId, Long receiverId, Long conversationId, String content, MessageType messageType) {
        this.senderId = senderId;
        this.receiverId = receiverId;
        this.conversationId = conversationId;
        this.content = content;
        this.messageType = messageType;
    }

    /**
     * 设置消息是否已读状态
     * 
     * @param isRead 是否已读
     */
    public void setIsRead(boolean isRead) {
        this.isRead = isRead;
    }

    /**
     * 获取消息是否已读状态
     * 
     * @return 是否已读
     */
    public boolean getIsRead() {
        return isRead;
    }

    /**
     * 设置消息是否已删除状态
     * 
     * @param deleted 是否已删除
     */
    public void setDeleted(boolean deleted) {
        this.deleted = deleted;
    }

    /**
     * 获取消息是否已删除状态
     * 
     * @return 是否已删除
     */
    public boolean getDeleted() {
        return deleted;
    }

    @Override
    public String toString() {
        return "Message{" +
                "id=" + getId() +
                ", conversationId=" + conversationId +
                ", senderId=" + senderId +
                ", receiverId=" + receiverId +
                ", isRead=" + isRead +
                ", deleted=" + deleted +
                ", messageType='" + messageType + '\'' +
                ", createdAt=" + getCreatedAt() +
                ", updatedAt=" + getUpdatedAt() +
                '}';
    }
}