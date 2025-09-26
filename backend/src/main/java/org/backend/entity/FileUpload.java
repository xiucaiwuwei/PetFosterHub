package org.backend.entity;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.backend.base.entity.BaseEntity;
import org.backend.entity.enums.FileType;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
@Table(name = "file_uploads")
@Schema(description = "文件上传实体")
public class FileUpload extends BaseEntity {

    @Column(name = "user_id", nullable = false)
    @Schema(description = "上传用户ID")
    private Long userId;

    @Column(name = "file_name", nullable = false)
    @Schema(description = "文件名")
    private String fileName;

    @Column(name = "original_name", nullable = false)
    @Schema(description = "原始文件名")
    private String originalName;

    @Column(name = "file_path", nullable = false)
    @Schema(description = "文件路径")
    private String filePath;

    @Column(name = "file_type", nullable = false)
    @Schema(description = "文件类型")
    private FileType fileType;

    @Column(name = "file_size")
    @Schema(description = "文件大小 (字节)")
    private Long fileSize;

    @Column(name = "content_type")
    @Schema(description = "内容类型")
    private String contentType;

    @Column(name = "entity_type")
    @Schema(description = "关联实体类型")
    private String entityType;

    @Column(name = "entity_id")
    @Schema(description = "关联实体ID")
    private Long entityId;

    @Column(name = "is_public")
    @Schema(description = "是否公开访问")
    private Boolean isPublic = false;

    @Column(name = "deleted")
    @Schema(description = "逻辑删除")
    private Boolean deleted = false;

}