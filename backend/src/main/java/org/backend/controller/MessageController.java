package org.backend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.backend.base.controller.BaseController;
import org.backend.base.dto.BaseResponse;
import org.backend.entity.Message;
import org.backend.entity.User;
import org.backend.repository.MessageRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
@Tag(name = "消息管理", description = "消息管理接口")
public class MessageController extends BaseController {

    private final MessageRepository messageRepository;

    @GetMapping("/conversation/{conversationId}")
    @Operation(summary = "获取会话消息")
    public ResponseEntity<BaseResponse<List<Message>>> getConversationMessages(
            @PathVariable Long conversationId) {
        List<Message> messages = messageRepository.findByConversationIdAndDeletedFalseOrderByCreatedAtAsc(conversationId);
        return super.success("获取成功", messages);
    }

    @GetMapping("/received")
    @Operation(summary = "获取当前用户收到的消息")
    public ResponseEntity<BaseResponse<List<Message>>> getReceivedMessages(Authentication authentication) {
        Long userId = Long.parseLong(authentication.getName());
        User user = new User();
        user.setId(userId);
        List<Message> messages = messageRepository.findByReceiverIdAndDeletedFalseOrderByCreatedAtDesc(user.getId());
        return super.success("获取成功", messages);
    }

    @GetMapping("/sent")
    @Operation(summary = "获取当前用户发送的消息")
    public ResponseEntity<BaseResponse<List<Message>>> getSentMessages(Authentication authentication) {
        Long userId = Long.parseLong(authentication.getName());
        User user = new User();
        user.setId(userId);
        List<Message> messages = messageRepository.findBySenderIdAndDeletedFalseOrderByCreatedAtDesc(user.getId());
        return super.success("获取成功", messages);
    }

    @GetMapping("/unread")
    @Operation(summary = "获取当前用户未读消息")
    public ResponseEntity<BaseResponse<List<Message>>> getUnreadMessages(Authentication authentication) {
        Long userId = Long.parseLong(authentication.getName());
        User user = new User();
        user.setId(userId);
        List<Message> messages = messageRepository.findByReceiverIdAndIsReadFalseAndDeletedFalseOrderByCreatedAtDesc(user.getId());
        return super.success("获取成功", messages);
    }

    @GetMapping("/unread-count")
    @Operation(summary = "获取当前用户未读消息数量")
    public ResponseEntity<BaseResponse<Long>> getUnreadMessageCount(Authentication authentication) {
        Long userId = Long.parseLong(authentication.getName());
        User user = new User();
        user.setId(userId);
        long count = messageRepository.countByReceiverIdAndIsReadFalseAndDeletedFalse(user.getId());
        return super.success("获取成功", count);
    }

    @GetMapping("/latest")
    @Operation(summary = "获取当前用户最新的会话列表")
    public ResponseEntity<BaseResponse<List<Message>>> getLatestMessages(Authentication authentication) {
        Long userId = Long.parseLong(authentication.getName());
        User user = new User();
        user.setId(userId);
        List<Message> messages = messageRepository.findLatestMessagesByUser(user.getId());
        return super.success("获取成功", messages);
    }

    @GetMapping("/between/{otherUserId}")
    @Operation(summary = "获取与指定用户的消息")
    public ResponseEntity<BaseResponse<List<Message>>> getMessagesBetweenUsers(
            Authentication authentication,
            @PathVariable Long otherUserId) {
        Long userId = Long.parseLong(authentication.getName());
        User user = new User();
        user.setId(userId);
        List<Message> messages = messageRepository.findBySenderIdAndReceiverIdAndDeletedFalseOrderByCreatedAtDesc(
                user.getId(), otherUserId);
        return super.success("获取成功", messages);
    }

    @PostMapping
    @Operation(summary = "发送消息")
    public ResponseEntity<BaseResponse<Message>> sendMessage(
            Authentication authentication,
            @RequestBody Message message) {
        Long userId = Long.parseLong(authentication.getName());
        User user = new User();
        user.setId(userId);

        message.setSenderId(user.getId());
        message.setCreatedAt(LocalDateTime.now());
        message.setUpdatedAt(LocalDateTime.now());
        message.setIsRead(false);

        Message savedMessage = messageRepository.save(message);
        return super.success("消息发送成功", savedMessage);
    }

    @PutMapping("/{id}/read")
    @Operation(summary = "标记消息为已读")
    public ResponseEntity<BaseResponse<String>> markAsRead(
            @PathVariable Long id,
            Authentication authentication) {
        Long userId = Long.parseLong(authentication.getName());
        User user = new User();
        user.setId(userId);

        Message message = messageRepository.findById(id).orElse(null);
        if (message == null) {
            return super.notFound("消息不存在");
        }
        if (message.getReceiverId() != user.getId()) {
            return super.forbidden("无权限操作");
        }

        message.setIsRead(true);
        message.setUpdatedAt(LocalDateTime.now());
        messageRepository.save(message);

        return super.success("消息已标记为已读");
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "删除消息")
    public ResponseEntity<BaseResponse<String>> deleteMessage(
            @PathVariable Long id,
            Authentication authentication) {
        Long userId = Long.parseLong(authentication.getName());
        User user = new User();
        user.setId(userId);

        Message message = messageRepository.findById(id).orElse(null);
        if (message == null) {
            return super.notFound("消息不存在");
        }
        if (message.getSenderId() != user.getId() && message.getReceiverId() != user.getId()) {
            return super.forbidden("无权限操作");
        }

        message.setDeleted(true);
        message.setUpdatedAt(LocalDateTime.now());
        messageRepository.save(message);

        return super.success("消息删除成功");
    }
}