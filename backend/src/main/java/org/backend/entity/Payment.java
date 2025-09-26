package org.backend.entity;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.backend.base.entity.BaseEntity;
import org.backend.entity.enums.PaymentStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
@Table(name = "payments")
@Schema(description = "支付记录实体")
public class Payment extends BaseEntity {

    @Column(name = "booking_id", nullable = false)
    @Schema(description = "关联的预约ID")
    private Long bookingId;

    @Column(name = "user_id", nullable = false)
    @Schema(description = "支付用户ID")
    private Long userId;

    @Column(name = "amount", nullable = false, precision = 10, scale = 2)
    @Schema(description = "支付金额")
    private BigDecimal amount;

    @Column(name = "currency", length = 3, nullable = false)
    @Schema(description = "货币类型")
    private String currency = "CNY";

    @Column(name = "payment_method", length = 50)
    @Schema(description = "支付方式")
    private String paymentMethod;

    @Column(name = "transaction_id", length = 100, unique = true)
    @Schema(description = "第三方交易ID")
    private String transactionId;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 20, nullable = false)
    @Schema(description = "支付状态")
    private PaymentStatus status = PaymentStatus.PENDING;

    @Column(name = "description")
    @Schema(description = "支付描述")
    private String description;

    @Column(name = "paid_at")
    @Schema(description = "支付完成时间")
    private LocalDateTime paidAt;

    @Column(name = "deleted")
    @Schema(description = "逻辑删除")
    private Boolean deleted = false;
}