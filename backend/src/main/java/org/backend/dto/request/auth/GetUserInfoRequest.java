package org.backend.dto.request.auth;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.backend.A_general.base.dto.BaseRequest;
import org.backend.entity.enums.UserRole;

/**
 * 查询用户信息请求DTO
 * 用于封装根据手机号和角色查询用户信息的请求数据
 */
@EqualsAndHashCode(callSuper = true)
@Data
@Schema(description = "查询用户信息请求DTO")
public class GetUserInfoRequest extends BaseRequest {

    @NotBlank(message = "手机号不能为空")
    @Schema(description = "手机号(格式: 11位数字)")
    @Pattern(regexp = "^1[3-9]\\d{9}$", message = "手机号格式不正确")
    private String phone;

    @NotNull(message = "角色不能为空")
    @Schema(description = "用户角色")
    private UserRole role;

}