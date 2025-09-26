package org.backend.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.backend.base.dto.BaseRequest;

import java.time.LocalDateTime;

@EqualsAndHashCode(callSuper = true)
@Data
@Schema(description = "咨询请求DTO")
public class ConsultationRequest extends BaseRequest {

    private Long id;

    @NotNull(message = "用户ID不能为空")
    @Positive(message = "用户ID必须为正数")
    @Schema(description = "用户ID")
    private Long userId;

    @NotNull(message = "宠物ID不能为空")
    @Positive(message = "宠物ID必须为正数")
    @Schema(description = "宠物ID")
    private Long petId;

    @Schema(description = "咨询内容")
    private String content;

    @Schema(description = "咨询类型")
    private String type;

    @Schema(description = "咨询时间")
    private LocalDateTime consultationTime;
}