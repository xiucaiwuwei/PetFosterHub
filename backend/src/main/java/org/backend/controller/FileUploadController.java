package org.backend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.Data;
import org.backend.base.controller.BaseController;
import org.backend.base.dto.BaseResponse;
import org.backend.entity.FileUpload;
import org.backend.entity.User;
import org.backend.service.FileUploadService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RestController
@Tag(name = "文件上传管理", description = "文件上传相关接口")
public class FileUploadController extends BaseController {

    private static final Logger logger = LoggerFactory.getLogger(FileUploadController.class);

    private final FileUploadService fileUploadService;

    @Autowired
    public FileUploadController(FileUploadService fileUploadService) {
        this.fileUploadService = fileUploadService;
    }

    @PostMapping("/api/files/upload")
    @Operation(summary = "上传文件")
    public ResponseEntity<BaseResponse<FileUpload>> uploadFile(@RequestParam("file") MultipartFile file, @RequestParam(required = false) String entityType, @RequestParam(required = false) Long entityId, Authentication authentication) {
        try {
            // 参数验证
            if (file == null || file.isEmpty()) {
                return super.failure("上传文件不能为空");
            }

            Long userId = getCurrentUserId(authentication);
            User user = createUser(userId);
            FileUpload uploadedFile = fileUploadService.uploadFile(file, entityType, entityId, false, user);
            logger.info("用户 {} 上传文件成功，文件ID: {}", userId, uploadedFile.getId());
            return super.success("文件上传成功", uploadedFile);
        } catch (Exception e) {
            logger.error("文件上传失败: {}", e.getMessage());
            return super.failure("文件上传失败: " + e.getMessage());
        }
    }

    @PostMapping("/api/upload/image")
    @Operation(summary = "上传图片文件")
    public ResponseEntity<BaseResponse<String>> uploadImage(@RequestParam("file") MultipartFile file, Authentication authentication) {
        try {
            // 参数验证
            if (file == null || file.isEmpty()) {
                return super.failure("上传文件不能为空");
            }

            Long userId = getCurrentUserId(authentication);
            User user = createUser(userId);
            FileUpload uploadedFile = fileUploadService.uploadFile(file, "MESSAGE", null, false, user);
            // 返回文件URL（实际应用中应该返回完整的访问URL）
            logger.info("用户 {} 上传图片成功，文件ID: {}", userId, uploadedFile.getId());
            return super.success("图片上传成功", uploadedFile.getFilePath());
        } catch (Exception e) {
            logger.error("图片上传失败: {}", e.getMessage());
            return super.failure("图片上传失败: " + e.getMessage());
        }
    }

    @PostMapping("/api/upload/video")
    @Operation(summary = "上传视频文件")
    public ResponseEntity<BaseResponse<String>> uploadVideo(@RequestParam("file") MultipartFile file, Authentication authentication) {
        try {
            // 参数验证
            if (file == null || file.isEmpty()) {
                return super.failure("上传文件不能为空");
            }

            Long userId = getCurrentUserId(authentication);
            User user = createUser(userId);
            FileUpload uploadedFile = fileUploadService.uploadFile(file, "MESSAGE", null, false, user);
            // 返回文件URL（实际应用中应该返回完整的访问URL）
            logger.info("用户 {} 上传视频成功，文件ID: {}", userId, uploadedFile.getId());
            return super.success("视频上传成功", uploadedFile.getFilePath());
        } catch (Exception e) {
            logger.error("视频上传失败: {}", e.getMessage());
            return super.failure("视频上传失败: " + e.getMessage());
        }
    }

    @GetMapping("/api/files/user")
    @Operation(summary = "获取当前用户的文件")
    public ResponseEntity<BaseResponse<List<FileUpload>>> getCurrentUserFiles(Authentication authentication) {
        try {
            Long userId = getCurrentUserId(authentication);
            User user = createUser(userId);
            List<FileUpload> files = fileUploadService.getUserFiles(user);
            logger.info("用户 {} 获取文件列表成功，文件数量: {}", userId, files.size());
            return super.success("获取成功", files);
        } catch (Exception e) {
            logger.error("获取用户文件失败: {}", e.getMessage());
            return super.failure("获取文件失败: " + e.getMessage());
        }
    }

    @GetMapping("/api/files/entity/{entityType}/{entityId}")
    @Operation(summary = "获取实体的文件")
    public ResponseEntity<BaseResponse<List<FileUpload>>> getEntityFiles(@PathVariable String entityType, @PathVariable Long entityId) {
        try {
            // 参数验证
            if (entityType == null || entityType.isEmpty()) {
                return super.failure("实体类型不能为空");
            }

            if (entityId == null || entityId <= 0) {
                return super.failure("实体ID无效");
            }

            List<FileUpload> files = fileUploadService.getPublicFilesByEntity(entityType, entityId);
            logger.info("获取实体 {}-{} 的文件成功，文件数量: {}", entityType, entityId, files.size());
            return super.success("获取成功", files);
        } catch (Exception e) {
            logger.error("获取实体文件失败: {}", e.getMessage());
            return super.failure("获取文件失败: " + e.getMessage());
        }
    }

    @GetMapping("/api/files/{fileId}")
    @Operation(summary = "获取文件信息")
    public ResponseEntity<BaseResponse<FileUpload>> getFileInfo(@PathVariable Long fileId, Authentication authentication) {
        try {
            // 参数验证
            if (fileId == null || fileId <= 0) {
                return super.failure("文件ID无效");
            }

            Long userId = getCurrentUserId(authentication);

            FileUpload file = fileUploadService.getFileById(fileId);
            if (file == null) {
                logger.warn("文件不存在，文件ID: {}", fileId);
                return super.notFound("文件不存在");
            }
            if (file.getDeleted() || (!file.getIsPublic() && !file.getUserId().equals(userId))) {
                logger.warn("用户 {} 无权限访问文件 {}", userId, fileId);
                return super.forbidden("无权限访问该文件");
            }

            logger.info("用户 {} 获取文件信息成功，文件ID: {}", userId, fileId);
            return super.success("获取成功", file);
        } catch (Exception e) {
            logger.error("获取文件信息失败: {}", e.getMessage());
            return super.failure("获取文件信息失败: " + e.getMessage());
        }
    }

    @GetMapping("/api/files/{fileId}/download")
    @Operation(summary = "下载文件")
    public ResponseEntity<Resource> downloadFile(@PathVariable Long fileId, Authentication authentication) {
        try {
            // 参数验证
            if (fileId == null || fileId <= 0) {
                return ResponseEntity.badRequest().build();
            }

            Long userId = getCurrentUserId(authentication);

            FileUpload fileUpload = fileUploadService.getFileById(fileId);
            if (fileUpload == null) {
                logger.warn("下载文件不存在，文件ID: {}", fileId);
                return ResponseEntity.notFound().build();
            }
            if (fileUpload.getDeleted() || (!fileUpload.getIsPublic() && !fileUpload.getUserId().equals(userId))) {
                logger.warn("用户 {} 无权限下载文件 {}", userId, fileId);
                return ResponseEntity.notFound().build();
            }

            try {
                Path filePath = Paths.get(fileUpload.getFilePath());
                Resource resource = new UrlResource(filePath.toUri());

                if (!resource.exists()) {
                    logger.warn("文件资源不存在，文件路径: {}", fileUpload.getFilePath());
                    return ResponseEntity.notFound().build();
                }

                logger.info("用户 {} 下载文件成功，文件ID: {}", userId, fileId);
                return ResponseEntity.ok().contentType(MediaType.parseMediaType(fileUpload.getContentType())).header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileUpload.getOriginalName() + "\"").body(resource);
            } catch (MalformedURLException e) {
                logger.error("文件URL解析失败: {}", e.getMessage());
                return ResponseEntity.badRequest().build();
            }
        } catch (Exception e) {
            logger.error("下载文件失败: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/api/files/{fileId}")
    @Operation(summary = "删除文件")
    public ResponseEntity<BaseResponse<Void>> deleteFile(@PathVariable Long fileId, Authentication authentication) {
        try {
            // 参数验证
            if (fileId == null || fileId <= 0) {
                return super.failure("文件ID无效");
            }

            Long userId = getCurrentUserId(authentication);
            User user = createUser(userId);
            fileUploadService.deleteFile(fileId, user);
            logger.info("用户 {} 删除文件成功，文件ID: {}", userId, fileId);
            return super.success("文件删除成功");
        } catch (Exception e) {
            logger.error("删除文件失败: {}", e.getMessage());
            return super.failure("删除文件失败: " + e.getMessage());
        }
    }

    @GetMapping("/api/files/stats")
    @Operation(summary = "获取用户文件统计")
    public ResponseEntity<BaseResponse<FileStats>> getUserFileStats(Authentication authentication) {
        try {
            Long userId = getCurrentUserId(authentication);
            User user = createUser(userId);
            long fileCount = fileUploadService.countUserFiles(user);

            FileStats stats = new FileStats();
            logger.info("用户 {} 获取文件统计成功，文件总数: {}", userId, fileCount);
            return super.success("获取成功", stats);
        } catch (Exception e) {
            logger.error("获取文件统计失败: {}", e.getMessage());
            return super.failure("获取文件统计失败: " + e.getMessage());
        }
    }

    @GetMapping("/api/files/entity/{entityType}/{entityId}/{fileType}")
    @Operation(summary = "根据实体类型、ID和文件类型获取文件")
    public ResponseEntity<BaseResponse<List<FileUpload>>> getEntityFilesByFileType(@PathVariable String entityType, @PathVariable Long entityId, @PathVariable String fileType) {
        try {
            // 参数验证
            if (entityType == null || entityType.isEmpty()) {
                return super.failure("实体类型不能为空");
            }

            if (entityId == null || entityId <= 0) {
                return super.failure("实体ID无效");
            }

            if (fileType == null || fileType.isEmpty()) {
                return super.failure("文件类型不能为空");
            }

            List<FileUpload> files = fileUploadService.findByEntityTypeAndEntityIdAndFileType(entityType, entityId, fileType);
            logger.info("获取实体 {}-{} 类型 {} 的文件成功，文件数量: {}", entityType, entityId, fileType, files.size());
            return super.success("获取成功", files);
        } catch (Exception e) {
            logger.error("根据实体类型和文件类型获取文件失败: {}", e.getMessage());
            return super.failure("获取文件失败: " + e.getMessage());
        }
    }

    @GetMapping("/api/files/user/type/{fileType}")
    @Operation(summary = "根据用户ID和文件类型获取文件")
    public ResponseEntity<BaseResponse<List<FileUpload>>> getUserFilesByFileType(@PathVariable String fileType, Authentication authentication) {
        try {
            // 参数验证
            if (fileType == null || fileType.isEmpty()) {
                return super.failure("文件类型不能为空");
            }

            Long userId = getCurrentUserId(authentication);
            List<FileUpload> files = fileUploadService.findByUserIdAndFileType(userId, fileType);
            logger.info("用户 {} 获取类型 {} 的文件成功，文件数量: {}", userId, fileType, files.size());
            return super.success("获取成功", files);
        } catch (Exception e) {
            logger.error("根据文件类型获取用户文件失败: {}", e.getMessage());
            return super.failure("获取文件失败: " + e.getMessage());
        }
    }

    /**
     * 从认证信息中获取当前用户ID
     *
     * @param authentication 认证信息
     * @return 当前用户ID
     * @throws NumberFormatException 当用户ID不是有效数字时抛出
     */
    private Long getCurrentUserId(Authentication authentication) throws NumberFormatException {
        if (authentication == null || authentication.getName() == null) {
            throw new NumberFormatException("认证信息为空");
        }
        return Long.parseLong(authentication.getName());
    }

    /**
     * 根据用户ID创建User对象
     *
     * @param userId 用户ID
     * @return User对象
     */
    private User createUser(Long userId) {
        User user = new User();
        user.setId(userId);
        return user;
    }

    /**
     * 文件统计信息
     */
    @Data
    public static class FileStats {
        private long totalFiles;
    }
}