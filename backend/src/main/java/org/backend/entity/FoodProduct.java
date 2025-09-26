package org.backend.entity;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.backend.base.entity.BaseEntity;

import java.math.BigDecimal;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
@Table(name = "food_products")
@Schema(description = "食品商品实体")
public class FoodProduct extends BaseEntity {

    @Column(nullable = false)
    @Schema(description = "商品名称")
    private String name;

    @Column
    @Schema(description = "分类")
    private String category;

    @Column(precision = 10, scale = 2, nullable = false)
    @Schema(description = "价格")
    private BigDecimal price;

    @Column(precision = 4, scale = 2)
    @Schema(description = "折扣")
    private BigDecimal discount;

    @Column
    @Schema(description = "图片URL")
    private String images;

    @Column
    @Schema(description = "简短描述")
    private String shortDescription;

    @Column(columnDefinition = "TEXT")
    @Schema(description = "详细描述")
    private String detailedDescription;

    @Column(precision = 3, scale = 2)
    @Schema(description = "评分")
    private BigDecimal rating;

    @Column
    @Schema(description = "评价数量")
    private Integer reviewCount;

    @Column
    @Schema(description = "是否新品")
    private Boolean isNew;

    @Column
    @Schema(description = "是否热门")
    private Boolean isHot;

    @Column(nullable = false)
    @Schema(description = "库存")
    private Integer stock;

    @Column
    @Schema(description = "品牌")
    private String brand;

    @Column
    @Schema(description = "重量")
    private String weight;

    @Column(columnDefinition = "TEXT")
    @Schema(description = "成分")
    private String ingredients;

    @Column(columnDefinition = "TEXT")
    @Schema(description = "营养信息")
    private String nutritionInfo;

    @Schema(description = "逻辑删除")
    private Integer deleted;
}
