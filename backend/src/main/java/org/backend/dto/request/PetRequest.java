package org.backend.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.backend.A_general.base.dto.BaseRequest;

@EqualsAndHashCode(callSuper = true)
@Data
@Schema(description = "宠物请求DTO")
public class PetRequest extends BaseRequest {

    private Long id;

    @NotBlank(message = "宠物名称不能为空")
    @Schema(description = "宠物名称")
    private String name;

    @Schema(description = "宠物类型")
    private String type;

    @Schema(description = "宠物品种")
    private String breed;

    @Schema(description = "宠物年龄")
    private Integer age;

    @Schema(description = "宠物性别")
    private String gender;

    @Schema(description = "宠物描述")
    private String description;

    @Schema(description = "宠物健康状况")
    private String healthCondition;

    @Schema(description = "疫苗接种情况")
    private String vaccinationStatus;

    @Schema(description = "是否绝育")
    private Boolean neutered;

    @NotNull(message = "主人ID不能为空")
    @Positive(message = "主人ID必须为正数")
    @Schema(description = "主人ID")
    private Long ownerId;
}