package org.backend.entity;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.backend.A_general.base.entity.BaseEntity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
@Table(name = "bookings")
@Schema(description = "预订实体")
public class Booking extends BaseEntity {

    @Column(nullable = false)
    @Schema(description = "宠物主人")
    private Long ownerId;

    @Column(nullable = false)
    @Schema(description = "服务提供者")
    private Long providerId;

    @Column(nullable = false)
    @Schema(description = "寄养服务")
    private Long serviceId;

    @Column(nullable = false)
    @Schema(description = "预订开始时间")
    private LocalDateTime startDate;

    @Column(nullable = false)
    @Schema(description = "预订结束时间")
    private LocalDateTime endDate;

    @Column(nullable = false)
    @Schema(description = "预订状态")
    private String status;

    @Column(precision = 10, scale = 2, nullable = false)
    @Schema(description = "总价")
    private BigDecimal totalPrice;

    @Column(columnDefinition = "TEXT")
    @Schema(description = "特殊要求")
    private String specialRequirements;

    @Schema(description = "逻辑删除")
    private Integer deleted;
}
