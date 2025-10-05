package org.backend.A_general.file.service.impl;

import org.backend.A_general.base.service.impl.BaseServiceImpl;
import org.backend.A_general.file.entity.FileUpload;
import org.backend.A_general.file.repository.FileUploadRepository;
import org.backend.A_general.file.service.ChunkUploadService;
import org.backend.A_general.file.util.FileUtils;
import org.backend.A_general.file.util.FileUploadUtils;
import org.backend.A_general.file.util.ChunkUploadUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

@Service
public class ChunkUploadServiceImpl extends BaseServiceImpl<FileUpload, Long, FileUploadRepository> implements ChunkUploadService {

    private static final Logger logger = LoggerFactory.getLogger(ChunkUploadServiceImpl.class);

    @Value("${file.upload-dir:uploads}")
    private String uploadDir;

    /**
     * 构造函数
     *
     * @param fileUploadRepository 文件上传仓库
     */
    public ChunkUploadServiceImpl(FileUploadRepository fileUploadRepository) {
        super(fileUploadRepository);
    }

    @Override
    public List<Integer> checkUploadStatus(String fileId) {
        try {
            Path chunkDir = getChunkDir(fileId);
            return ChunkUploadUtils.checkUploadStatus(chunkDir);
        } catch (Exception e) {
            // 记录异常但不抛出，返回空列表表示检查失败
            logger.error("检查上传状态时发生错误: {}", e.getMessage(), e);
            return new ArrayList<>();
        }
    }

    @Override
    public boolean uploadChunk(MultipartFile chunk, String fileId, int chunkIndex, int totalChunks, 
                              String fileName, long fileSize, String fileType) {
        if (chunk == null || chunk.isEmpty()) {
            return false;
        }

        try {
            // 验证文件类型
            if (!FileUploadUtils.isAllowedFileType(chunk.getContentType())) {
                logger.warn("不支持的文件类型: {}", chunk.getContentType());
                return false;
            }

            // 验证分块索引
            if (!ChunkUploadUtils.isValidChunkIndex(chunkIndex, totalChunks)) {
                logger.warn("无效的分块索引: {}, 总分块数: {}", chunkIndex, totalChunks);
                return false;
            }

            // 保存分块文件
            Path chunkDir = getChunkDir(fileId);
            return ChunkUploadUtils.saveChunk(chunk, chunkDir, chunkIndex);
        } catch (Exception e) {
            logger.error("上传文件块时发生错误: {}", e.getMessage(), e);
            return false;
        }
    }

    @Override
    public String mergeChunks(String fileId, String fileName, String fileType) {
        try {
            Path chunkDir = getChunkDir(fileId);
            
            // 创建目标文件
            String fileExtension = FileUtils.getFileExtension(fileName);
            String uniqueFileName = fileId + (!fileExtension.isEmpty() ? "." + fileExtension : "");
            
            // 确保上传目录存在
            FileUtils.createDirectory(uploadDir);
            
            String targetFilePath = Paths.get(uploadDir, uniqueFileName).toString();

            // 合并文件块
            boolean mergeSuccess = ChunkUploadUtils.mergeChunks(chunkDir, targetFilePath);
            if (!mergeSuccess) {
                throw new IOException("文件块合并失败");
            }

            // 清理临时文件块
            ChunkUploadUtils.cleanupChunks(chunkDir);

            // 返回文件路径（实际应用中应该返回完整的访问URL）
            return targetFilePath;
        } catch (IOException e) {
            logger.error("合并文件块时发生错误: {}", e.getMessage(), e);
            return null;
        }
    }

    @Override
    public void cleanupChunks(String fileId) {
        try {
            Path chunkDir = getChunkDir(fileId);
            ChunkUploadUtils.cleanupChunks(chunkDir);
        } catch (Exception ignored) {
            // 忽略清理过程中的异常
        }
    }

    private Path getChunkDir(String fileId) {
        // 创建临时目录存储分块文件
        return ChunkUploadUtils.getChunkDir(uploadDir, fileId);
    }
}