package org.backend.dto.response.home;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * 首页寄养服务响应类
 * 用于首页展示的寄养服务数据
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FosterServiceHomeResponse {
    /**
     * 服务ID
     */
    @Schema(description = "服务ID")
    private String id;

    /**
     * 服务提供者ID
     */
    @Schema(description = "服务提供者ID")
    private String providerId;

    /**
     * 服务提供者名称
     */
    @Schema(description = "服务提供者名称")
    private String providerName;

    /**
     * 服务提供者头像URL
     */
    @Schema(description = "服务提供者头像URL")
    private String providerAvatar;

    /**
     * 服务标题
     */
    @Schema(description = "服务标题")
    private String title;

    /**
     * 服务描述
     */
    @Schema(description = "服务描述")
    private String description;

    /**
     * 每日价格
     */
    @Schema(description = "每日价格")
    private Double pricePerDay;

    /**
     * 货币类型
     */
    @Schema(description = "货币类型")
    private String currency = "CNY";

    /**
     * 服务地点
     */
    @Schema(description = "服务地点")
    private String location;

    /**
     * 服务图片URL列表
     */
    @Schema(description = "服务图片URL列表")
    private List<String> images;

    /**
     * 服务提供的便利设施
     */
    @Schema(description = "服务提供的便利设施")
    private List<String> amenities;

    /**
     * 服务评分
     */
    @Schema(description = "服务评分")
    private Double rating;

    /**
     * 评论数量
     */
    @Schema(description = "评论数量")
    private Long reviewsCount;

    /**
     * 是否可用
     */
    @Schema(description = "是否可用")
    private Boolean isAvailable;

    /**
     * 服务创建时间
     */
    @Schema(description = "服务创建时间")
    private String createdAt;

    /**
     * 服务更新时间
     */
    @Schema(description = "服务更新时间")
    private String updatedAt;
}