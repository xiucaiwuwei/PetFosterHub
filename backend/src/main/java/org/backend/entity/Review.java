package org.backend.entity;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.backend.A_general.base.entity.BaseEntity;
import org.backend.entity.enums.ReviewType;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
@Table(name = "reviews")
@Schema(description = "评价实体")
public class Review extends BaseEntity {

    @Column(name = "user_id", nullable = false)
    @Schema(description = "评价用户ID")
    private Long userId;

    @Column(name = "target_id", nullable = false)
    @Schema(description = "被评价对象ID")
    private Long targetId;

    @Enumerated(EnumType.STRING)
    @Column(name = "target_type", length = 20, nullable = false)
    @Schema(description = "评价类型")
    private ReviewType targetType;

    @Column(name = "rating", nullable = false)
    @Schema(description = "评分 (1-5)")
    private Integer rating;

    @Column(name = "comment", columnDefinition = "TEXT")
    @Schema(description = "评价内容")
    private String comment;

    @Column(name = "booking_id")
    @Schema(description = "关联的预约ID")
    private Long bookingId;

    @Column(name = "deleted")
    @Schema(description = "逻辑删除")
    private Boolean deleted = false;
}