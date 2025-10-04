package org.backend.dto.response.home;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 首页评价响应类
 * 用于首页展示的用户评价数据，包括用户信息、评价内容和评分
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "首页评价响应类")
public class ReviewHomeResponse {

    @Schema(description = "评价ID")
    private String id;

    @Schema(description = "用户名称")
    private String name;

    @Schema(description = "用户头像URL")
    private String avatar;

    @Schema(description = "评价内容")
    private String content;

    @Schema(description = "评分等级（1-5分）")
    private Integer rating;
}