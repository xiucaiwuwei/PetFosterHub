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

import java.util.List;

@RestController
@RequestMapping("/api/messages/conversations")
@RequiredArgsConstructor
@Tag(name = "对话管理", description = "对话相关接口")
public class ConversationController extends BaseController {

    private final MessageRepository messageRepository;

    @GetMapping("/{userId}")
    @Operation(summary = "获取用户的对话列表")
    public ResponseEntity<BaseResponse<List<Message>>> getConversations(@PathVariable Long userId) {
        List<Message> conversations = messageRepository.findLatestMessagesByUser(userId);
        return super.success("获取成功", conversations);
    }

    @DeleteMapping("/{conversationId}")
    @Operation(summary = "删除对话")
    public ResponseEntity<BaseResponse<Boolean>> deleteConversation(
            @PathVariable Long conversationId,
            @RequestParam Long userId,
            Authentication authentication) {
        // 验证用户身份
        Long currentUserId = Long.parseLong(authentication.getName());
        if (!currentUserId.equals(userId)) {
            return super.forbidden("无权限操作");
        }

        try {
            // 软删除该对话的所有消息
            List<Message> messages = messageRepository.findByConversationIdAndDeletedFalseOrderByCreatedAtAsc(conversationId);
            messages.forEach(message -> {
                message.setDeleted(true);
                messageRepository.save(message);
            });
            return super.success("对话删除成功", true);
        } catch (Exception e) {
            return super.failure("对话删除失败");
        }
    }
}