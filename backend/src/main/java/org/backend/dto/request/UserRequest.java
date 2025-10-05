package org.backend.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.backend.A_general.base.dto.BaseRequest;
import org.backend.entity.enums.UserRole;

@EqualsAndHashCode(callSuper = true)
@Data
@Schema(description = "用户请求DTO")
public class UserRequest extends BaseRequest {

    private Long id;

    @NotBlank(message = "用户名不能为空")
    @Size(min = 3, max = 20, message = "用户名长度必须在3-20位之间")
    @Schema(description = "用户名")
    private String username;

    @NotBlank(message = "邮箱不能为空")
    @Email(message = "邮箱格式不正确")
    @Schema(description = "邮箱")
    private String email;

    @Size(min = 6, max = 20, message = "密码长度必须在6-20位之间")
    @Schema(description = "密码")
    private String password;

    @Schema(description = "姓名")
    private String fullName;

    @Schema(description = "手机号")
    private String phone;

    @Schema(description = "地址")
    private String address;

    @Schema(description = "个人简介")
    private String bio;

    @Schema(description = "用户角色")
    private UserRole role;
}