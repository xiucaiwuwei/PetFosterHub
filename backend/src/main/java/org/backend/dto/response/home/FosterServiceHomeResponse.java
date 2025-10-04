package org.backend.dto.response.home;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * 首页寄养服务响应类
 * 用于首页展示的寄养服务数据，包含服务提供者信息、服务详情、评分等
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FosterServiceHomeResponse {

    @Schema(description = "服务ID")
    private String id;

    @Schema(description = "服务提供者ID")
    private String providerId;

    @Schema(description = "服务提供者名称")
    private String providerName;

    @Schema(description = "服务提供者头像URL")
    private String providerAvatar;

    @Schema(description = "服务标题")
    private String title;

    @Schema(description = "服务描述")
    private String description;

    @Schema(description = "每日价格")
    private Double pricePerDay;

    @Schema(description = "货币类型")
    private String currency = "CNY";

    @Schema(description = "服务地点")
    private String location;

    @Schema(description = "服务图片URL列表")
    private List<String> images;

    @Schema(description = "服务提供的便利设施")
    private List<String> amenities;

    @Schema(description = "服务评分")
    private Double rating;

    @Schema(description = "评论数量")
    private Long reviewsCount;

    @Schema(description = "是否可用")
    private Boolean isAvailable;

    @Schema(description = "服务创建时间")
    private String createdAt;

    @Schema(description = "服务更新时间")
    private String updatedAt;
}