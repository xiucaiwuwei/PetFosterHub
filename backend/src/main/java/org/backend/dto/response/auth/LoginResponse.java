package org.backend.dto.response.auth;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.backend.entity.enums.UserRole;

/**
 * 登录响应DTO
 * 用于封装用户登录成功后的响应数据，包括访问令牌、用户信息等
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "登录响应DTO")
public class LoginResponse {

    @Schema(description = "访问令牌")
    private String accessToken;

    @Schema(description = "刷新令牌")
    private String refreshToken;

    @Schema(description = "用户ID")
    private Integer userId;

    @Schema(description = "手机号")
    private String phone;

    @Schema(description = "用户角色")
    private UserRole role;

    @Schema(description = "用户昵称")
    private String nickname;

    @Schema(description = "用户头像")
    private String avatar;

}