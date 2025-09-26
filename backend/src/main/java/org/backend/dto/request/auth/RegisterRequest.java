package org.backend.dto.request.auth;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.backend.base.dto.BaseRequest;
import org.backend.entity.enums.UserRole;

@EqualsAndHashCode(callSuper = true)
@Data
@Schema(description = "注册请求DTO")
public class RegisterRequest extends BaseRequest {

    @NotBlank(message = "手机号不能为空")
    @Pattern(regexp = "^1[3-9]\\d{9}$", message = "手机号格式不正确")
    @Schema(description = "手机号")
    private String phone;

    @NotNull(message = "角色不能为空")
    @Schema(description = "用户角色")
    private UserRole role;

    @NotBlank(message = "验证码不能为空")
    @Pattern(regexp = "^\\d{6}$", message = "验证码应为6位数字")
    @Schema(description = "验证码")
    private String verificationCode;
}
