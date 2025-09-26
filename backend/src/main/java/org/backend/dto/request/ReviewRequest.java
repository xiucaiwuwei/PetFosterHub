package org.backend.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.backend.base.dto.BaseRequest;

@EqualsAndHashCode(callSuper = true)
@Data
@Schema(description = "评价请求DTO")
public class ReviewRequest extends BaseRequest {

    private Long id;

    @NotNull(message = "服务ID不能为空")
    @Positive(message = "服务ID必须为正数")
    @Schema(description = "服务ID")
    private Long serviceId;

    @NotNull(message = "用户ID不能为空")
    @Positive(message = "用户ID必须为正数")
    @Schema(description = "用户ID")
    private Long userId;

    @NotNull(message = "评分不能为空")
    @Min(value = 1, message = "评分不能低于1分")
    @Max(value = 5, message = "评分不能高于5分")
    @Schema(description = "评分")
    private Integer rating;

    @Schema(description = "评价内容")
    private String comment;
}