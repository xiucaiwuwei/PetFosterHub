package org.backend.A_general.file.service;

import org.backend.A_general.base.service.BaseService;
import org.backend.A_general.file.entity.FileUpload;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * 分块上传服务接口
 * 提供大文件分块上传、断点续传等功能
 */
public interface ChunkUploadService extends BaseService<FileUpload, Long> {

    /**
     * 检查文件上传状态
     * @param fileId 文件唯一标识
     * @return 已上传的块索引列表
     */
    List<Integer> checkUploadStatus(String fileId);

    /**
     * 上传文件块
     * @param chunk 文件块
     * @param fileId 文件唯一标识
     * @param chunkIndex 当前块索引
     * @param totalChunks 总块数
     * @param fileName 文件名
     * @param fileSize 文件大小
     * @param fileType 文件类型
     * @return 是否上传成功
     */
    boolean uploadChunk(MultipartFile chunk, String fileId, int chunkIndex, int totalChunks,
                       String fileName, long fileSize, String fileType);

    /**
     * 合并文件块
     * @param fileId 文件唯一标识
     * @param fileName 文件名
     * @param fileType 文件类型
     * @return 合并后的文件URL
     */
    String mergeChunks(String fileId, String fileName, String fileType);

    /**
     * 清理文件块
     * @param fileId 文件唯一标识
     */
    void cleanupChunks(String fileId);
}