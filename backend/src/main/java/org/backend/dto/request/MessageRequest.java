package org.backend.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.backend.base.dto.BaseRequest;

import java.time.LocalDateTime;

@EqualsAndHashCode(callSuper = true)
@Data
@Schema(description = "消息请求DTO")
public class MessageRequest extends BaseRequest {

    private Long id;

    @NotNull(message = "发送者ID不能为空")
    @Positive(message = "发送者ID必须为正数")
    @Schema(description = "发送者ID")
    private Long senderId;

    @NotNull(message = "接收者ID不能为空")
    @Positive(message = "接收者ID必须为正数")
    @Schema(description = "接收者ID")
    private Long receiverId;

    @NotBlank(message = "消息内容不能为空")
    @Schema(description = "消息内容")
    private String content;

    @Schema(description = "发送时间")
    private LocalDateTime sentTime;

    @Schema(description = "是否已读")
    private Boolean read;
}