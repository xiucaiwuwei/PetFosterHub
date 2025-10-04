package org.backend.dto.request.auth;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.backend.base.dto.BaseRequest;
import org.backend.entity.enums.LoginType;
import org.backend.entity.enums.UserRole;

/**
 * 登录请求DTO
 * 用于封装用户登录的请求数据，支持密码登录和验证码登录两种方式
 */
@EqualsAndHashCode(callSuper = true)
@Data
@Schema(description = "登录请求DTO")
public class LoginRequest extends BaseRequest {

    @NotBlank(message = "手机号不能为空")
    @Pattern(regexp = "^1[3-9]\\d{9}$", message = "手机号格式不正确")
    @Schema(description = "手机号")
    private String phone;

    @Schema(description = "密码")
    @Pattern(regexp = "^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,20}$", message = "密码必须包含字母和数字，长度8-20位")
    private String password;

    @Schema(description = "验证码")
    @Pattern(regexp = "^\\d{6}$", message = "验证码应为6位数字")
    private String verificationCode;

    @NotNull(message = "角色不能为空")
    @Schema(description = "用户角色")
    private UserRole role;

    @NotNull(message = "登录类型不能为空")
    @Schema(description = "登录类型: password(密码登录), verificationCode(验证码登录)")
    private LoginType loginType;
}