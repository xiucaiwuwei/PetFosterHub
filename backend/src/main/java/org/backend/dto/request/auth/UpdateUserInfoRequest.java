package org.backend.dto.request.auth;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.backend.base.dto.BaseRequest;

@EqualsAndHashCode(callSuper = true)
@Data
@Schema(description = "用户信息更新请求DTO")
public class UpdateUserInfoRequest extends BaseRequest {

    @NotBlank(message = "用户ID不能为空")
    @Pattern(regexp = "^\\d+$", message = "用户ID必须为数字")
    @Schema(description = "用户ID", example = "123456")
    private String userId;
    
    @NotBlank(message = "昵称不能为空")
    @Pattern(regexp = "^[\\u4e00-\\u9fa5A-Za-z0-9_]{2,16}$", message = "昵称只能包含中文、英文、数字和下划线，长度2-16位")
    @Schema(description = "用户昵称", example = "张三")
    private String nickname;

    @NotBlank(message = "密码不能为空")
    @Schema(description = "用户密码")
    @Pattern(regexp = "^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,20}$", message = "密码必须包含字母和数字，长度8-20位")
    private String password;
}
