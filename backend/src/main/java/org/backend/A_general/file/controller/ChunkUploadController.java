package org.backend.A_general.file.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.backend.A_general.base.controller.BaseController;
import org.backend.A_general.base.dto.BaseResponse;
import org.backend.A_general.file.service.ChunkUploadService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@Tag(name = "分块上传管理", description = "大文件分块上传和断点续传接口")
@RequestMapping("/api/upload/chunk")
public class ChunkUploadController extends BaseController {

    private static final Logger logger = LoggerFactory.getLogger(ChunkUploadController.class);

    private final ChunkUploadService chunkUploadService;

    @Autowired
    public ChunkUploadController(ChunkUploadService chunkUploadService) {
        this.chunkUploadService = chunkUploadService;
    }

    @GetMapping("/{fileId}/status")
    @Operation(summary = "检查文件上传状态")
    public ResponseEntity<BaseResponse<List<Integer>>> checkUploadStatus(@PathVariable String fileId) {
        try {
            logger.info("检查文件上传状态: {}", fileId);
            List<Integer> uploadedChunks = chunkUploadService.checkUploadStatus(fileId);
            return super.success("查询成功", uploadedChunks);
        } catch (Exception e) {
            logger.error("检查文件上传状态失败: {}", e.getMessage());
            return super.failure("查询失败: " + e.getMessage());
        }
    }

    @PostMapping
    @Operation(summary = "上传文件块")
    public ResponseEntity<BaseResponse<Boolean>> uploadChunk(
            @RequestParam("file") MultipartFile chunk,
            @RequestParam("fileId") String fileId,
            @RequestParam("chunkIndex") int chunkIndex,
            @RequestParam("totalChunks") int totalChunks,
            @RequestParam("fileName") String fileName,
            @RequestParam("fileSize") long fileSize,
            @RequestParam("fileType") String fileType) {
        try {
            logger.info("上传文件块: {} 块 {}/{}", fileId, chunkIndex + 1, totalChunks);
            boolean success = chunkUploadService.uploadChunk(
                    chunk, fileId, chunkIndex, totalChunks, fileName, fileSize, fileType);
            if (success) {
                return super.success("文件块上传成功", true);
            } else {
                return super.failure("文件块上传失败");
            }
        } catch (Exception e) {
            logger.error("文件块上传失败: {}", e.getMessage());
            return super.failure("上传失败: " + e.getMessage());
        }
    }

    @PostMapping("/merge")
    @Operation(summary = "合并文件块")
    public ResponseEntity<BaseResponse<String>> mergeChunks(
            @RequestParam("fileId") String fileId,
            @RequestParam("fileName") String fileName,
            @RequestParam("fileType") String fileType) {
        try {
            logger.info("合并文件块: {}", fileId);
            String fileUrl = chunkUploadService.mergeChunks(fileId, fileName, fileType);
            if (fileUrl != null) {
                return super.success("文件合并成功", fileUrl);
            } else {
                return super.failure("文件合并失败");
            }
        } catch (Exception e) {
            logger.error("文件合并失败: {}", e.getMessage());
            return super.failure("合并失败: " + e.getMessage());
        }
    }

    @DeleteMapping("/{fileId}")
    @Operation(summary = "清理文件块")
    public ResponseEntity<BaseResponse<Boolean>> cleanupChunks(@PathVariable String fileId) {
        try {
            logger.info("清理文件块: {}", fileId);
            chunkUploadService.cleanupChunks(fileId);
            return super.success("清理成功", true);
        } catch (Exception e) {
            logger.error("清理文件块失败: {}", e.getMessage());
            return super.failure("清理失败: " + e.getMessage());
        }
    }
}