package org.backend.A_general.file.util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.nio.file.*;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * 文件上传工具类
 * 提供多部分文件处理、文件类型验证、分块上传等上传相关的工具方法
 */
public class FileUploadUtils {

    private static final Logger logger = LoggerFactory.getLogger(FileUploadUtils.class);
    
    // 允许上传的图片文件类型
    public static final List<String> ALLOWED_IMAGE_TYPES = Arrays.asList(
            "image/jpeg", "image/jpg", "image/png", "image/gif", "image/bmp", "image/webp"
    );
    
    // 允许上传的文档文件类型
    public static final List<String> ALLOWED_DOC_TYPES = Arrays.asList(
            "application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "text/plain", "text/csv"
    );
    
    // 允许上传的音频文件类型
    public static final List<String> ALLOWED_AUDIO_TYPES = Arrays.asList(
            "audio/mpeg", "audio/wav", "audio/ogg", "audio/flac"
    );
    
    // 允许上传的视频文件类型
    public static final List<String> ALLOWED_VIDEO_TYPES = Arrays.asList(
            "video/mp4", "video/avi", "video/mov", "video/mkv", "video/webm"
    );
    
    // 所有允许的文件类型
    public static final List<String> ALLOWED_FILE_TYPES = new ArrayList<>();
    
    static {
        ALLOWED_FILE_TYPES.addAll(ALLOWED_IMAGE_TYPES);
        ALLOWED_FILE_TYPES.addAll(ALLOWED_DOC_TYPES);
        ALLOWED_FILE_TYPES.addAll(ALLOWED_AUDIO_TYPES);
        ALLOWED_FILE_TYPES.addAll(ALLOWED_VIDEO_TYPES);
    }
    
    /**
     * 验证文件类型是否允许上传
     * 
     * @param contentType 文件MIME类型
     * @return 是否允许上传
     */
    public static boolean isAllowedFileType(String contentType) {
        if (contentType == null || contentType.isEmpty()) {
            return false;
        }
        return ALLOWED_FILE_TYPES.contains(contentType.toLowerCase());
    }
    
    /**
     * 验证文件大小是否超过限制
     * 
     * @param fileSize 文件大小（字节）
     * @param maxSize 最大允许大小（字节）
     * @return 是否超过限制
     */
    public static boolean isFileSizeOverLimit(long fileSize, long maxSize) {
        return fileSize > maxSize;
    }
    
    /**
     * 保存MultipartFile到指定路径
     * 
     * @param file MultipartFile对象
     * @param targetPath 目标文件路径
     * @return 保存是否成功
     */
    public static boolean saveMultipartFile(MultipartFile file, String targetPath) {
        if (file == null || file.isEmpty()) {
            logger.warn("文件为空，无法保存");
            return false;
        }
        
        try {
            Path path = Paths.get(targetPath);
            
            // 确保目标目录存在
            FileUtils.createDirectory(path.getParent().toString());
            
            // 保存文件
            file.transferTo(path);
            logger.info("文件保存成功: {}, 大小: {}KB", targetPath, file.getSize() / 1024);
            return true;
        } catch (IOException e) {
            logger.error("保存文件失败: {}", e.getMessage());
            return false;
        }
    }
    
    /**
     * 合并文件分块
     * 
     * @param chunkDir 分块文件目录
     * @param targetFilePath 合并后的目标文件路径
     * @param totalChunks 总分块数
     * @return 合并是否成功
     */
    public static boolean mergeFileChunks(String chunkDir, String targetFilePath, int totalChunks) {
        try {
            Path targetPath = Paths.get(targetFilePath);
            
            // 确保目标目录存在
            FileUtils.createDirectory(targetPath.getParent().toString());
            
            try (FileOutputStream out = new FileOutputStream(targetFilePath)) {
                for (int i = 0; i < totalChunks; i++) {
                    String chunkFilePath = chunkDir + File.separator + i;
                    Path chunkPath = Paths.get(chunkFilePath);
                    
                    if (!Files.exists(chunkPath)) {
                        logger.error("分块文件不存在: {}", chunkFilePath);
                        return false;
                    }
                    
                    byte[] chunkData = Files.readAllBytes(chunkPath);
                    out.write(chunkData);
                    out.flush();
                }
            }
            
            logger.info("文件分块合并成功: {}, 总分块数: {}", targetFilePath, totalChunks);
            return true;
        } catch (IOException e) {
            logger.error("合并文件分块失败: {}", e.getMessage());
            return false;
        }
    }
    
    /**
     * 保存文件分块
     * 
     * @param chunkData 分块数据
     * @param chunkDir 分块文件目录
     * @param chunkIndex 分块索引
     * @return 保存是否成功
     */
    public static boolean saveFileChunk(byte[] chunkData, String chunkDir, int chunkIndex) {
        try {
            // 确保分块目录存在
            FileUtils.createDirectory(chunkDir);
            
            String chunkFilePath = chunkDir + File.separator + chunkIndex;
            Files.write(Paths.get(chunkFilePath), chunkData);
            
            logger.info("文件分块保存成功: {}, 索引: {}", chunkFilePath, chunkIndex);
            return true;
        } catch (IOException e) {
            logger.error("保存文件分块失败: {}", e.getMessage());
            return false;
        }
    }
    
    /**
     * 清理分块文件目录
     * 
     * @param chunkDir 分块文件目录
     */
    public static void cleanupChunkDirectory(String chunkDir) {
        try {
            FileUtils.deleteDirectory(chunkDir);
        } catch (Exception e) {
            logger.warn("清理分块文件目录失败: {}", e.getMessage());
        }
    }
    
    /**
     * 获取文件类型对应的图标或显示类型
     * 
     * @param contentType 文件MIME类型
     * @return 显示类型
     */
    public static String getFileDisplayType(String contentType) {
        if (contentType == null) {
            return "未知文件";
        }
        
        String type = contentType.toLowerCase();
        if (ALLOWED_IMAGE_TYPES.contains(type)) {
            return "图片";
        } else if (ALLOWED_DOC_TYPES.contains(type)) {
            return "文档";
        } else if (ALLOWED_AUDIO_TYPES.contains(type)) {
            return "音频";
        } else if (ALLOWED_VIDEO_TYPES.contains(type)) {
            return "视频";
        } else {
            return "其他";
        }
    }
    
    /**
     * 获取文件大小的友好显示
     * 
     * @param sizeBytes 文件大小（字节）
     * @return 友好显示的文件大小
     */
    public static String getFriendlyFileSize(long sizeBytes) {
        if (sizeBytes < 0) {
            return "未知大小";
        }
        
        if (sizeBytes < 1024) {
            return sizeBytes + " B";
        } else if (sizeBytes < 1024 * 1024) {
            return String.format("%.2f KB", sizeBytes / 1024.0);
        } else if (sizeBytes < 1024 * 1024 * 1024) {
            return String.format("%.2f MB", sizeBytes / (1024.0 * 1024.0));
        } else {
            return String.format("%.2f GB", sizeBytes / (1024.0 * 1024.0 * 1024.0));
        }
    }
    
    /**
     * 生成安全的文件名（移除可能的路径分隔符等）
     * 
     * @param originalFilename 原始文件名
     * @return 安全的文件名
     */
    public static String generateSafeFilename(String originalFilename) {
        if (originalFilename == null || originalFilename.isEmpty()) {
            return FileUtils.generateUniqueFileName("file");
        }
        
        // 移除路径分隔符和可能的特殊字符
        String safeName = originalFilename.replaceAll("[/\\:*?\"<>|]", "_");
        
        // 截断过长的文件名
        int maxLength = 255;
        if (safeName.length() > maxLength) {
            String extension = FileUtils.getFileExtension(safeName);
            String baseName = FileUtils.getFileNameWithoutExtension(safeName);
            baseName = baseName.substring(0, maxLength - extension.length() - 1);
            safeName = baseName + "." + extension;
        }
        
        return safeName;
    }
    
    /**
     * 检查文件是否为图片
     * 
     * @param contentType 文件MIME类型
     * @return 是否为图片
     */
    public static boolean isImageFile(String contentType) {
        return contentType != null && ALLOWED_IMAGE_TYPES.contains(contentType.toLowerCase());
    }
    
    /**
     * 检查文件是否为文档
     * 
     * @param contentType 文件MIME类型
     * @return 是否为文档
     */
    public static boolean isDocumentFile(String contentType) {
        return contentType != null && ALLOWED_DOC_TYPES.contains(contentType.toLowerCase());
    }
    
    /**
     * 检查文件是否为音频
     * 
     * @param contentType 文件MIME类型
     * @return 是否为音频
     */
    public static boolean isAudioFile(String contentType) {
        return contentType != null && ALLOWED_AUDIO_TYPES.contains(contentType.toLowerCase());
    }
    
    /**
     * 检查文件是否为视频
     * 
     * @param contentType 文件MIME类型
     * @return 是否为视频
     */
    public static boolean isVideoFile(String contentType) {
        return contentType != null && ALLOWED_VIDEO_TYPES.contains(contentType.toLowerCase());
    }
}