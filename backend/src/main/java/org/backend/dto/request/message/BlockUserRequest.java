package org.backend.dto.request.message;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.backend.base.dto.BaseRequest;

/**
 * 屏蔽用户请求DTO
 * 用于封装用户屏蔽其他用户的请求数据
 */
@EqualsAndHashCode(callSuper = true)
@Data
@Schema(description = "屏蔽用户请求DTO")
public class BlockUserRequest extends BaseRequest {

    @NotNull(message = "目标用户ID不能为空")
    @Positive(message = "目标用户ID必须为正数")
    @Schema(description = "目标用户ID")
    private Long targetUserId;
}