package org.backend.dto.response.user;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.backend.entity.enums.UserRole;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 用户个人资料响应DTO
 * 用于封装用户个人资料的响应数据，确保不包含敏感信息
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "用户个人资料响应DTO")
public class UserProfileResponse {

    @Schema(description = "用户ID")
    private Long id;

    @Schema(description = "手机号")
    private String phone;

    @Schema(description = "头像")
    private String avatar;

    @Schema(description = "昵称")
    private String nickname;

    @Schema(description = "角色")
    private UserRole role;

    @Schema(description = "姓名")
    private String fullName;

    @Schema(description = "地址")
    private String address;

    @Schema(description = "个人简介")
    private String bio;

    @Schema(description = "评分")
    private BigDecimal rating;

    @Schema(description = "评价数量")
    private Integer reviewCount;

    @Schema(description = "创建时间")
    private LocalDateTime createdAt;

    @Schema(description = "更新时间")
    private LocalDateTime updatedAt;
}