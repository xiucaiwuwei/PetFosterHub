package org.backend.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.backend.base.dto.BaseRequest;

import java.math.BigDecimal;

@EqualsAndHashCode(callSuper = true)
@Data
@Schema(description = "宠物用品请求DTO")
public class PetProductRequest extends BaseRequest {

    private Long id;

    @NotBlank(message = "产品名称不能为空")
    @Schema(description = "产品名称")
    private String name;

    @Schema(description = "产品描述")
    private String description;

    @Schema(description = "产品类型")
    private String type;

    @NotNull(message = "价格不能为空")
    @Schema(description = "价格")
    private BigDecimal price;

    @Schema(description = "库存")
    private Integer stock;

    @Schema(description = "品牌")
    private String brand;

    @Schema(description = "适用宠物类型")
    private String suitableFor;
}