package org.backend.dto.request.auth;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.backend.base.dto.BaseRequest;
import org.backend.entity.enums.UserRole;

@EqualsAndHashCode(callSuper = true)
@Data
@Schema(description = "验证码请求DTO")
@JsonIgnoreProperties(ignoreUnknown = true)
public class VerificationCodeRequest extends BaseRequest {

    @NotBlank(message = "手机号不能为空")
    @Schema(description = "手机号")
    private String phone;

    @NotBlank(message = "验证码类型不能为空")
    @Schema(description = "验证码类型: login(登录), register(注册), resetPassword(重置密码)")
    private String type;
    
    @Schema(description = "用户角色")
    private UserRole role;
}