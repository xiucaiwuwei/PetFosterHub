package org.backend.dto.response.home;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 首页评价响应类
 * 用于首页展示的用户评价数据
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReviewHomeResponse {
    /**
     * 评价ID
     */
    @Schema(description = "评价ID")
    private String id;

    /**
     * 用户名称
     */
    @Schema(description = "用户名称")
    private String name;

    /**
     * 用户头像URL
     */
    @Schema(description = "用户头像URL")
    private String avatar;

    /**
     * 评价内容
     */
    @Schema(description = "评价内容")
    private String content;

    /**
     * 评分等级（1-5分）
     */
    @Schema(description = "评分等级（1-5分）")
    private Integer rating;
}