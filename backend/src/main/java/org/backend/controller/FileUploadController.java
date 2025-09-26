package org.backend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.backend.base.controller.BaseController;
import org.backend.base.dto.BaseResponse;
import org.backend.entity.FileUpload;
import org.backend.entity.User;
import org.backend.service.FileUploadService;
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
@RequestMapping("/api/files")
@Tag(name = "文件上传管理", description = "文件上传相关接口")
public class FileUploadController extends BaseController {

    @Autowired
    private FileUploadService fileUploadService;

    @PostMapping("/upload")
    @Operation(summary = "上传文件")
    public ResponseEntity<BaseResponse<FileUpload>> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam(required = false) String entityType,
            @RequestParam(required = false) Long entityId,
            @RequestParam(required = false, defaultValue = "OTHER") String fileType,
            Authentication authentication) {
        try {
            Long userId = getCurrentUserId(authentication);
            User user = new User();
            user.setId(userId);
            FileUpload uploadedFile = fileUploadService.uploadFile(file, entityType, entityId, false, user);
            return super.success("文件上传成功", uploadedFile);
        } catch (Exception e) {
            return super.failure("文件上传失败: " + e.getMessage());
        }
    }

    @GetMapping("/user")
    @Operation(summary = "获取当前用户的文件")
    public ResponseEntity<BaseResponse<List<FileUpload>>> getCurrentUserFiles(Authentication authentication) {
        Long userId = getCurrentUserId(authentication);
        User user = new User();
        user.setId(userId);
        List<FileUpload> files = fileUploadService.getUserFiles(user);
        return super.success("获取成功", files);
    }

    @GetMapping("/entity/{entityType}/{entityId}")
    @Operation(summary = "获取实体的文件")
    public ResponseEntity<BaseResponse<List<FileUpload>>> getEntityFiles(
            @PathVariable String entityType,
            @PathVariable Long entityId) {
        List<FileUpload> files = fileUploadService.getPublicFilesByEntity(entityType, entityId);
        return super.success("获取成功", files);
    }

    @GetMapping("/{fileId}")
    @Operation(summary = "获取文件信息")
    public ResponseEntity<BaseResponse<FileUpload>> getFileInfo(
            @PathVariable Long fileId,
            Authentication authentication) {
        Long userId = getCurrentUserId(authentication);

        FileUpload file = fileUploadService.getFileById(fileId);
        if (file == null) {
            return super.notFound("文件不存在");
        }
        if (file.getDeleted() ||
                (!file.getIsPublic() && !file.getUserId().equals(userId))) {
            return super.forbidden("无权限访问该文件");
        }

        return super.success("获取成功", file);
    }

    @GetMapping("/{fileId}/download")
    @Operation(summary = "下载文件")
    public ResponseEntity<Resource> downloadFile(
            @PathVariable Long fileId,
            Authentication authentication) {
        Long userId = getCurrentUserId(authentication);

        FileUpload fileUpload = fileUploadService.getFileById(fileId);
        if (fileUpload == null) {
            return ResponseEntity.notFound().build();
        }
        if (fileUpload.getDeleted() ||
                (!fileUpload.getIsPublic() && !fileUpload.getUserId().equals(userId))) {
            return ResponseEntity.notFound().build();
        }

        try {
            Path filePath = Paths.get(fileUpload.getFilePath());
            Resource resource = new UrlResource(filePath.toUri());

            if (!resource.exists()) {
                return ResponseEntity.notFound().build();
            }

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(fileUpload.getContentType()))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileUpload.getOriginalName() + "\"")
                    .body(resource);
        } catch (MalformedURLException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{fileId}")
    @Operation(summary = "删除文件")
    public ResponseEntity<BaseResponse<Void>> deleteFile(
            @PathVariable Long fileId,
            Authentication authentication) {
        Long userId = getCurrentUserId(authentication);

        try {
            User user = new User();
            user.setId(userId);
            fileUploadService.deleteFile(fileId, user);
            return super.success("文件删除成功");
        } catch (Exception e) {
            return super.failure("删除文件失败: " + e.getMessage());
        }
    }

    @GetMapping("/stats")
    @Operation(summary = "获取用户文件统计")
    public ResponseEntity<BaseResponse<FileStats>> getUserFileStats(Authentication authentication) {
        Long userId = getCurrentUserId(authentication);
        User user = new User();
        user.setId(userId);
        long fileCount = fileUploadService.countUserFiles(user);

        FileStats stats = new FileStats();
        stats.setTotalFiles(fileCount);

        return super.success("获取成功", stats);
    }

    @GetMapping("/entity/{entityType}/{entityId}/{fileType}")
    @Operation(summary = "根据实体类型、ID和文件类型获取文件")
    public ResponseEntity<BaseResponse<List<FileUpload>>> getEntityFilesByFileType(
            @PathVariable String entityType,
            @PathVariable Long entityId,
            @PathVariable String fileType) {
        List<FileUpload> files = fileUploadService.findByEntityTypeAndEntityIdAndFileType(entityType, entityId, fileType);
        return super.success("获取成功", files);
    }

    @GetMapping("/user/type/{fileType}")
    @Operation(summary = "根据用户ID和文件类型获取文件")
    public ResponseEntity<BaseResponse<List<FileUpload>>> getUserFilesByFileType(
            @PathVariable String fileType,
            Authentication authentication) {
        Long userId = getCurrentUserId(authentication);
        List<FileUpload> files = fileUploadService.findByUserIdAndFileType(userId, fileType);
        return super.success("获取成功", files);
    }

    private Long getCurrentUserId(Authentication authentication) {
        return Long.parseLong(authentication.getName());
    }

    public static class FileStats {
        private long totalFiles;

        public long getTotalFiles() {
            return totalFiles;
        }

        public void setTotalFiles(long totalFiles) {
            this.totalFiles = totalFiles;
        }
    }
}