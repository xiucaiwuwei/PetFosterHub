package org.backend.A_general.file.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.backend.A_general.base.dto.BaseRequest;

@EqualsAndHashCode(callSuper = true)
@Data
@Schema(description = "文件上传请求DTO")
public class FileUploadRequest extends BaseRequest {

    private Long id;

    @NotBlank(message = "文件名不能为空")
    @Schema(description = "文件名")
    private String fileName;

    @NotBlank(message = "文件路径不能为空")
    @Schema(description = "文件路径")
    private String filePath;

    @NotBlank(message = "文件类型不能为空")
    @Schema(description = "文件类型")
    private String fileType;

    @NotNull(message = "文件大小不能为空")
    @Schema(description = "文件大小")
    private Long fileSize;

    @Schema(description = "关联ID")
    private Long entityId;

    @Schema(description = "关联类型")
    private String entityType;
}