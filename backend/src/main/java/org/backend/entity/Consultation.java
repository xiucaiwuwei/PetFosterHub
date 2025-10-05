package org.backend.entity;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.backend.A_general.base.entity.BaseEntity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
@Table(name = "consultations")
@Schema(description = "问诊实体")
public class Consultation extends BaseEntity {

    @Column
    @Schema(description = "用户ID")
    private Long userId;

    @Column
    @Schema(description = "宠物名称")
    private String petName;

    @Column
    @Schema(description = "宠物类型")
    private String petType;

    @Column
    @Schema(description = "兽医ID")
    private Long veterinarianId;

    @Column
    @Schema(description = "问诊类型")
    private String consultationType;

    @Column
    @Schema(description = "状态")
    private String status;

    @Column
    @Schema(description = "问诊日期")
    private LocalDate consultationDate;

    @Column
    @Schema(description = "问诊时间")
    private LocalTime consultationTime;

    @Column
    @Schema(description = "持续时间")
    private Integer duration;

    @Column
    @Schema(description = "症状描述")
    private String symptoms;

    @Column
    @Schema(description = "诊断结果")
    private String diagnosis;

    @Column
    @Schema(description = "治疗方案")
    private String treatmentPlan;

    @Column
    @Schema(description = "费用")
    private BigDecimal fee;

    @Schema(description = "逻辑删除")
    private Integer deleted;
}
