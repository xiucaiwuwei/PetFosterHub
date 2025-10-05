package org.backend.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.backend.A_general.base.dto.BaseRequest;

import java.math.BigDecimal;

@EqualsAndHashCode(callSuper = true)
@Data
@Schema(description = "寄养服务请求DTO")
public class FosterServiceRequest extends BaseRequest {

    private Long id;

    @NotBlank(message = "服务名称不能为空")
    @Schema(description = "服务名称")
    private String name;

    @Schema(description = "服务描述")
    private String description;

    @Schema(description = "服务类型")
    private String type;

    @NotNull(message = "价格不能为空")
    @Schema(description = "价格")
    private BigDecimal price;

    @Schema(description = "服务时长（天）")
    private Integer duration;

    @Schema(description = "服务提供者ID")
    private Long providerId;

    @Schema(description = "服务地址")
    private String address;

    @Schema(description = "服务状态")
    private String status;
}