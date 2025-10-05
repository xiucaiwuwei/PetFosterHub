package org.backend.A_general.file.util;

import org.backend.A_general.file.entity.FileUpload;
import org.backend.A_general.file.dto.FileUploadRequest;
import org.backend.entity.enums.FileType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.text.DecimalFormat;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

/**
 * 文件信息工具类
 * 提供文件信息格式化、统计、转换等相关功能
 */
public class FileInfoUtils {
    
    private static final Logger logger = LoggerFactory.getLogger(FileInfoUtils.class);
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
    private static final DecimalFormat SIZE_FORMATTER = new DecimalFormat("#.##");
    
    /**
     * 将文件大小转换为友好的显示格式
     * 
     * @param size 文件大小（字节）
     * @return 格式化后的文件大小字符串
     */
    public static String formatFileSize(long size) {
        if (size <= 0) {
            return "0 B";
        }
        
        final String[] units = {"B", "KB", "MB", "GB", "TB"};
        int digitGroups = (int) (Math.log10(size) / Math.log10(1024));
        return SIZE_FORMATTER.format(size / Math.pow(1024, digitGroups)) + " " + units[digitGroups];
    }
    
    /**
     * 格式化文件创建时间
     * 
     * @param dateTime 日期时间
     * @return 格式化后的日期时间字符串
     */
    public static String formatDateTime(LocalDateTime dateTime) {
        if (dateTime == null) {
            return "未知时间";
        }
        return dateTime.format(DATE_FORMATTER);
    }
    
    /**
     * 按文件类型分组统计文件数量和大小
     * 
     * @param files 文件列表
     * @return 文件类型统计信息Map
     */
    public static Map<String, Map<String, Object>> groupByFileType(List<FileUpload> files) {
        if (files == null || files.isEmpty()) {
            return Collections.emptyMap();
        }
        
        return files.stream()
                .filter(file -> !Boolean.TRUE.equals(file.getDeleted()))
                .collect(Collectors.groupingBy(
                        file -> {
                            String extension = FileUtils.getFileExtension(file.getOriginalName());
                            return FileTypeUtils.getFileCategory(extension);
                        },
                        Collectors.collectingAndThen(
                                Collectors.toList(),
                                list -> {
                                    Map<String, Object> stats = new HashMap<>();
                                    stats.put("count", list.size());
                                    stats.put("totalSize", list.stream().mapToLong(FileUpload::getFileSize).sum());
                                    stats.put("formattedSize", formatFileSize(
                                            list.stream().mapToLong(FileUpload::getFileSize).sum()
                                    ));
                                    return stats;
                                }
                        )
                ));
    }
    
    /**
     * 计算文件列表的总大小
     * 
     * @param files 文件列表
     * @return 文件总大小（字节）
     */
    public static long calculateTotalSize(List<FileUpload> files) {
        if (files == null || files.isEmpty()) {
            return 0;
        }
        
        return files.stream()
                .filter(file -> !Boolean.TRUE.equals(file.getDeleted()))
                .mapToLong(FileUpload::getFileSize)
                .sum();
    }
    
    /**
     * 从FileUploadRequest构建文件元数据Map
     * 
     * @param request 文件上传请求
     * @return 包含文件元数据的Map
     */
    public static Map<String, Object> buildFileMetadata(FileUploadRequest request) {
        Map<String, Object> metadata = new HashMap<>();
        
        if (request != null) {
            metadata.put("entityType", request.getEntityType());
            metadata.put("entityId", request.getEntityId());
            metadata.put("uploadTime", LocalDateTime.now().format(DATE_FORMATTER));
            // 可以根据需要添加更多元数据
        }
        
        return metadata;
    }
    
    /**
     * 构建文件下载链接
     * 
     * @param baseUrl 基础URL
     * @param fileId 文件ID
     * @return 完整的下载链接
     */
    public static String buildDownloadUrl(String baseUrl, Long fileId) {
        if (baseUrl == null || fileId == null) {
            return null;
        }
        
        // 确保基础URL以/结尾
        String url = baseUrl.endsWith("/") ? baseUrl : baseUrl + "/";
        return url + "api/files/" + fileId + "/download";
    }
    
    /**
     * 获取文件的显示信息摘要
     * 
     * @param file 文件实体
     * @return 文件摘要信息Map
     */
    public static Map<String, Object> getFileSummary(FileUpload file) {
        if (file == null) {
            return Collections.emptyMap();
        }
        
        Map<String, Object> summary = new HashMap<>();
        summary.put("id", file.getId());
        summary.put("fileName", file.getOriginalName());
        summary.put("fileSize", formatFileSize(file.getFileSize()));
        summary.put("contentType", file.getContentType());
        summary.put("uploadTime", formatDateTime(file.getCreatedAt()));
        summary.put("isPublic", file.getIsPublic());
        
        // 获取文件类型分类和图标
        String extension = FileUtils.getFileExtension(file.getOriginalName());
        summary.put("category", FileTypeUtils.getFileCategory(extension));
        summary.put("iconPath", FileTypeUtils.getFileTypeIconPath(summary.get("category").toString()));
        
        return summary;
    }
    
    /**
     * 过滤无效文件（已删除或路径无效的文件）
     * 
     * @param files 文件列表
     * @return 过滤后的有效文件列表
     */
    public static List<FileUpload> filterValidFiles(List<FileUpload> files) {
        if (files == null) {
            return Collections.emptyList();
        }
        
        return files.stream()
                .filter(file -> file != null)
                .filter(file -> !Boolean.TRUE.equals(file.getDeleted()))
                .filter(file -> file.getFilePath() != null && !file.getFilePath().isEmpty())
                .collect(Collectors.toList());
    }
}