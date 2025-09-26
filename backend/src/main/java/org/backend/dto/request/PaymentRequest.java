package org.backend.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.backend.base.dto.BaseRequest;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@EqualsAndHashCode(callSuper = true)
@Data
@Schema(description = "支付请求DTO")
public class PaymentRequest extends BaseRequest {

    private Long id;

    @NotNull(message = "订单ID不能为空")
    @Positive(message = "订单ID必须为正数")
    @Schema(description = "订单ID")
    private Long orderId;

    @NotNull(message = "用户ID不能为空")
    @Positive(message = "用户ID必须为正数")
    @Schema(description = "用户ID")
    private Long userId;

    @NotNull(message = "支付金额不能为空")
    @Schema(description = "支付金额")
    private BigDecimal amount;

    @Schema(description = "支付方式")
    private String paymentMethod;

    @Schema(description = "支付状态")
    private String status;

    @Schema(description = "支付时间")
    private LocalDateTime paymentTime;

    @Schema(description = "交易号")
    private String transactionId;
}