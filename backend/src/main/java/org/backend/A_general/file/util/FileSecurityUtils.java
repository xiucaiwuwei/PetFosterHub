package org.backend.A_general.file.util;

import org.backend.A_general.file.entity.FileUpload;
import org.backend.entity.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.nio.file.Path;
import java.nio.file.Paths;

/**
 * 文件安全工具类
 * 提供文件权限验证、安全检查等相关功能
 */
public class FileSecurityUtils {
    
    private static final Logger logger = LoggerFactory.getLogger(FileSecurityUtils.class);
    
    /**
     * 验证用户是否有权限访问文件
     * 
     * @param fileUpload 文件实体
     * @param user 用户实体
     * @return 是否有权限
     */
    public static boolean hasAccessPermission(FileUpload fileUpload, User user) {
        if (fileUpload == null) {
            return false;
        }
        
        // 如果文件是公开的，所有人都可以访问
        if (Boolean.TRUE.equals(fileUpload.getIsPublic())) {
            return true;
        }
        
        // 如果用户为空，则无权限访问私有文件
        if (user == null) {
            return false;
        }
        
        // 验证用户是否是文件所有者
        return user.getId().equals(fileUpload.getUserId());
    }
    
    /**
     * 验证用户是否有权限访问文件
     * 
     * @param fileUpload 文件实体
     * @param userId 用户ID
     * @return 是否有权限
     */
    public static boolean hasAccessPermission(FileUpload fileUpload, Long userId) {
        if (fileUpload == null || userId == null) {
            return false;
        }
        
        // 如果文件是公开的，所有人都可以访问
        if (Boolean.TRUE.equals(fileUpload.getIsPublic())) {
            return true;
        }
        
        // 验证用户ID是否与文件所有者ID匹配
        return userId.equals(fileUpload.getUserId());
    }
    
    /**
     * 验证用户是否有权限删除文件
     * 
     * @param fileUpload 文件实体
     * @param user 用户实体
     * @return 是否有权限
     */
    public static boolean hasDeletePermission(FileUpload fileUpload, User user) {
        // 删除权限要求必须是文件所有者，即使文件是公开的
        if (fileUpload == null || user == null) {
            return false;
        }
        
        return user.getId().equals(fileUpload.getUserId());
    }
    
    /**
     * 验证用户是否有权限删除文件
     * 
     * @param fileUpload 文件实体
     * @param userId 用户ID
     * @return 是否有权限
     */
    public static boolean hasDeletePermission(FileUpload fileUpload, Long userId) {
        // 删除权限要求必须是文件所有者，即使文件是公开的
        if (fileUpload == null || userId == null) {
            return false;
        }
        
        return userId.equals(fileUpload.getUserId());
    }
    
    /**
     * 验证文件路径安全性
     * 防止路径遍历攻击
     * 
     * @param baseDir 基础目录
     * @param filePath 文件路径
     * @return 路径是否安全
     */
    public static boolean isSafeFilePath(String baseDir, String filePath) {
        try {
            Path basePath = Paths.get(baseDir).toAbsolutePath().normalize();
            Path targetPath = Paths.get(filePath).toAbsolutePath().normalize();
            
            // 确保目标路径是基础路径的子路径
            return targetPath.startsWith(basePath);
        } catch (Exception e) {
            logger.error("验证文件路径安全性时发生错误: {}", e.getMessage(), e);
            return false;
        }
    }
    
    /**
     * 构建安全的文件路径
     * 
     * @param baseDir 基础目录
     * @param fileName 文件名
     * @return 安全的文件路径
     */
    public static String buildSafeFilePath(String baseDir, String fileName) {
        // 先清理文件名，去除不安全字符
        String safeFileName = FileUploadUtils.generateSafeFilename(fileName);
        
        // 构建路径
        Path path = Paths.get(baseDir, safeFileName);
        
        // 规范化路径
        return path.normalize().toString();
    }
    
    /**
     * 检查文件是否已被逻辑删除
     * 
     * @param fileUpload 文件实体
     * @return 是否已删除
     */
    public static boolean isFileDeleted(FileUpload fileUpload) {
        return fileUpload == null || Boolean.TRUE.equals(fileUpload.getDeleted());
    }
}