package org.backend.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.backend.base.dto.BaseRequest;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@EqualsAndHashCode(callSuper = true)
@Data
public class BookingRequest extends BaseRequest {

    private Long id;

    @NotNull(message = "寄养服务ID不能为空")
    @Positive(message = "寄养服务ID必须为正数")
    private Long fosterServiceId;

    @NotNull(message = "宠物ID不能为空")
    @Positive(message = "宠物ID必须为正数")
    private Long petId;

    @NotNull(message = "开始时间不能为空")
    private LocalDateTime startDate;

    @NotNull(message = "结束时间不能为空")
    private LocalDateTime endDate;

    private String specialRequirements;

    private BigDecimal price;
}