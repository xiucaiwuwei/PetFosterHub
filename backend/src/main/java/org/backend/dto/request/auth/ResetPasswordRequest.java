package org.backend.dto.request.auth;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.backend.A_general.base.dto.BaseRequest;
import org.backend.entity.enums.UserRole;

/**
 * 重置密码请求DTO
 * 用于封装用户重置密码的请求数据
 */
@EqualsAndHashCode(callSuper = true)
@Data
@Schema(description = "重置密码请求DTO")
public class ResetPasswordRequest extends BaseRequest {

    @NotBlank(message = "手机号不能为空")
    @Schema(description = "手机号")
    private String phone;

    @NotBlank(message = "角色不能为空")
    @Schema(description = "用户角色")
    private UserRole role;

    @NotBlank(message = "验证码不能为空")
    @Schema(description = "验证码")
    private String verificationCode;

    @NotBlank(message = "新密码不能为空")
    @Schema(description = "新密码")
    private String newPassword;
}