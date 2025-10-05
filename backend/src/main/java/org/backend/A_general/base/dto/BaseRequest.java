package org.backend.A_general.base.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 通用请求基类
 * 所有请求DTO都应该继承此类，以提供统一的字段和功能
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "通用请求基类")
public class BaseRequest {

    @NotNull(message = "操作类型不能为空")
    @Schema(description = "操作类型", example = "CREATE, UPDATE, DELETE, QUERY")
    private String operationType;

    @NotNull(message = "操作内容不能为空")
    @Schema(description = "操作内容", example = "创建用户, 更新用户, 删除用户, 查询用户")
    private String operationContent;
}