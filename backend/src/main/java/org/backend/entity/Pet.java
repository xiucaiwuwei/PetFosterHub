package org.backend.entity;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.backend.A_general.base.entity.BaseEntity;
import org.backend.entity.enums.*;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
@Table(name = "pets")
@Schema(description = "宠物实体")
public class Pet extends BaseEntity {

    @Column(nullable = false)
    @Schema(description = "用户")
    private Long userId;

    @Column(nullable = false)
    @Schema(description = "宠物名称")
    private String name;

    @Column(nullable = false)
    @Schema(description = "宠物类型")
    private PetType type;

    @Column(nullable = false)
    @Schema(description = "宠物品种")
    private String breed;

    @Column
    @Schema(description = "宠物年龄")
    private Integer age;

    @Column
    @Schema(description = "宠物大小")
    private PetSize size;

    @Column
    @Schema(description = "宠物性别")
    private PetGender gender;

    @Column
    @Schema(description = "健康状况")
    private HealthStatus healthStatus;

    @Column
    @Schema(description = "疫苗接种情况")
    private VaccinationStatus vaccinationStatus;

    @Column
    @Schema(description = "特殊需求")
    private String specialNeeds;

    @Column(columnDefinition = "TEXT")
    @Schema(description = "宠物描述")
    private String description;

    @Column
    @Schema(description = "宠物图片")
    private String images;

    @Schema(description = "逻辑删除")
    private Integer deleted;
}
