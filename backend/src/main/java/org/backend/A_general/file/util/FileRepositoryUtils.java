package org.backend.A_general.file.util;

import org.backend.A_general.file.entity.FileUpload;
import org.backend.A_general.file.repository.FileUploadRepository;
import org.backend.entity.User;
import org.backend.entity.enums.FileType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

/**
 * 文件仓储工具类
 * 提供文件实体的通用查询、统计等与仓储层相关的功能
 */
public class FileRepositoryUtils {
    
    /**
     * 根据用户ID和文件类型获取文件列表
     * 
     * @param repository 文件仓储
     * @param userId 用户ID
     * @param fileType 文件类型
     * @return 文件列表
     */
    public static List<FileUpload> findByUserIdAndFileType(FileUploadRepository repository, Long userId, FileType fileType) {
        if (repository == null || userId == null) {
            return Collections.emptyList();
        }
        
        if (fileType != null) {
            return repository.findByUserIdAndFileType(userId, fileType);
        } else {
            return repository.findByUserIdAndDeletedFalseOrderByCreatedAtDesc(userId);
        }
    }
    
    /**
     * 根据实体类型和ID获取文件列表
     * 
     * @param repository 文件仓储
     * @param entityType 实体类型
     * @param entityId 实体ID
     * @param isPublic 是否只获取公开文件
     * @return 文件列表
     */
    public static List<FileUpload> findByEntity(FileUploadRepository repository, String entityType, Long entityId, boolean isPublic) {
        if (repository == null || entityType == null || entityId == null) {
            return Collections.emptyList();
        }
        
        if (isPublic) {
            return repository.findPublicFilesByEntity(entityType, entityId);
        } else {
            return repository.findByEntityTypeAndEntityIdAndDeletedFalseOrderByCreatedAtDesc(entityType, entityId);
        }
    }
    
    /**
     * 获取用户文件的分页数据
     * 
     * @param repository 文件仓储
     * @param userId 用户ID
     * @param pageable 分页参数
     * @return 分页的文件数据
     */
    public static Page<FileUpload> findUserFilesPage(FileUploadRepository repository, Long userId, Pageable pageable) {
        if (repository == null || userId == null) {
            return Page.empty(pageable);
        }
        
        return repository.findByUserIdAndDeletedFalseOrderByCreatedAtDesc(userId, pageable);
    }
    
    /**
     * 检查用户是否拥有指定文件
     * 
     * @param repository 文件仓储
     * @param fileId 文件ID
     * @param userId 用户ID
     * @return 是否拥有
     */
    public static boolean doesUserOwnFile(FileUploadRepository repository, Long fileId, Long userId) {
        if (repository == null || fileId == null || userId == null) {
            return false;
        }
        
        Optional<FileUpload> fileOptional = repository.findById(fileId);
        return fileOptional.isPresent() && 
               !Boolean.TRUE.equals(fileOptional.get().getDeleted()) && 
               userId.equals(fileOptional.get().getUserId());
    }
    
    /**
     * 计算用户的文件总数
     * 
     * @param repository 文件仓储
     * @param userId 用户ID
     * @return 文件总数
     */
    public static long countUserFiles(FileUploadRepository repository, Long userId) {
        if (repository == null || userId == null) {
            return 0;
        }
        
        return repository.countByUserIdAndDeletedFalse(userId);
    }
    
    /**
     * 计算用户的文件总大小
     * 
     * @param repository 文件仓储
     * @param userId 用户ID
     * @return 文件总大小（字节）
     */
    public static long calculateUserTotalFileSize(FileUploadRepository repository, Long userId) {
        if (repository == null || userId == null) {
            return 0;
        }
        
        List<FileUpload> userFiles = repository.findByUserIdAndDeletedFalseOrderByCreatedAtDesc(userId);
        return userFiles.stream().mapToLong(FileUpload::getFileSize).sum();
    }
    
    /**
     * 根据文件名和用户ID查找文件
     * 
     * @param repository 文件仓储
     * @param fileName 文件名
     * @param userId 用户ID
     * @return 文件实体（如果存在）
     */
    public static Optional<FileUpload> findByFileNameAndUserId(FileUploadRepository repository, String fileName, Long userId) {
        if (repository == null || fileName == null || userId == null) {
            return Optional.empty();
        }
        
        return Optional.ofNullable(repository.findByFileNameAndUserId(fileName, userId));
    }
    
    /**
     * 批量逻辑删除文件
     * 
     * @param repository 文件仓储
     * @param fileIds 文件ID列表
     * @param user 用户实体
     * @return 成功删除的文件数量
     */
    public static int batchDeleteFiles(FileUploadRepository repository, List<Long> fileIds, User user) {
        if (repository == null || fileIds == null || fileIds.isEmpty() || user == null) {
            return 0;
        }
        
        int deletedCount = 0;
        Long userId = user.getId();
        
        for (Long fileId : fileIds) {
            Optional<FileUpload> fileOptional = repository.findById(fileId);
            if (fileOptional.isPresent() && 
                !Boolean.TRUE.equals(fileOptional.get().getDeleted()) && 
                userId.equals(fileOptional.get().getUserId())) {
                
                FileUpload file = fileOptional.get();
                file.setDeleted(true);
                repository.save(file);
                deletedCount++;
            }
        }
        
        return deletedCount;
    }
    
    /**
     * 查找用户最近上传的文件
     * 
     * @param repository 文件仓储
     * @param userId 用户ID
     * @param limit 限制数量
     * @return 最近上传的文件列表
     */
    public static List<FileUpload> findRecentUserFiles(FileUploadRepository repository, Long userId, int limit) {
        if (repository == null || userId == null || limit <= 0) {
            return Collections.emptyList();
        }
        
        // 获取用户所有文件（按创建时间倒序），然后取前limit个
        List<FileUpload> allFiles = repository.findByUserIdAndDeletedFalseOrderByCreatedAtDesc(userId);
        int actualLimit = Math.min(limit, allFiles.size());
        return allFiles.subList(0, actualLimit);
    }
    
    /**
     * 根据文件类型统计用户的文件数量
     * 
     * @param repository 文件仓储
     * @param userId 用户ID
     * @param fileType 文件类型
     * @return 该类型文件数量
     */
    public static long countFilesByType(FileUploadRepository repository, Long userId, FileType fileType) {
        if (repository == null || userId == null) {
            return 0;
        }
        
        if (fileType != null) {
            List<FileUpload> files = repository.findByUserIdAndFileType(userId, fileType);
            return files != null ? files.size() : 0;
        } else {
            return repository.countByUserIdAndDeletedFalse(userId);
        }
    }
}