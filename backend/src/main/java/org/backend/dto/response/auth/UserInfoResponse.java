package org.backend.dto.response.auth;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.backend.entity.enums.UserRole;

/**
 * 用户信息响应DTO
 * 用于封装用户信息的响应数据，包括用户的基本信息和角色
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "用户信息响应DTO")
public class UserInfoResponse {

    @Schema(description = "用户ID")
    private Long userId;

    @Schema(description = "手机号")
    private String phone;

    @Schema(description = "头像")
    private String avatar;

    @Schema(description = "昵称")
    private String nickname;

    @Schema(description = "角色")
    private UserRole role;

}