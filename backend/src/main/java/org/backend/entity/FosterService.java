package org.backend.entity;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.backend.A_general.base.entity.BaseEntity;

import java.math.BigDecimal;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
@Table(name = "foster_services")
@Schema(description = "寄养服务实体")
public class FosterService extends BaseEntity {

    @Column(nullable = false)
    @Schema(description = "提供者")
    private Long providerId;

    @Column(nullable = false)
    @Schema(description = "服务标题")
    private String title;

    @Column(columnDefinition = "TEXT")
    @Schema(description = "服务描述")
    private String description;

    @Column(precision = 10, scale = 2, nullable = false)
    @Schema(description = "服务价格")
    private BigDecimal price;

    @Column(nullable = false)
    @Schema(description = "服务位置")
    private String location;

    @Column(nullable = false)
    @Schema(description = "服务类型")
    private String serviceType;

    @Column(nullable = false)
    @Schema(description = "最大容量")
    private Integer maxCapacity;

    @Column(nullable = false)
    @Schema(description = "可用状态")
    private Boolean available;

    @Column
    @Schema(description = "服务图片")
    private String images;

    @Schema(description = "逻辑删除")
    private Integer deleted;
}
