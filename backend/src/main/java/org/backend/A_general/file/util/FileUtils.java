package org.backend.A_general.file.util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;

import java.io.*;
import java.nio.file.*;
import java.nio.file.attribute.BasicFileAttributes;
import java.util.UUID;
import java.util.stream.Stream;

/**
 * 文件操作工具类
 * 提供文件创建、复制、移动、删除等通用操作方法
 */
public class FileUtils {

    private static final Logger logger = LoggerFactory.getLogger(FileUtils.class);
    
    /**
     * 生成唯一文件名
     * 
     * @param originalFilename 原始文件名
     * @return 唯一文件名
     */
    public static String generateUniqueFileName(String originalFilename) {
        if (originalFilename == null || originalFilename.isEmpty()) {
            return UUID.randomUUID().toString();
        }
        
        String extension = getFileExtension(originalFilename);
        String baseName = getFileNameWithoutExtension(originalFilename);
        
        if (extension.isEmpty()) {
            return baseName + "_" + UUID.randomUUID().toString();
        } else {
            return baseName + "_" + UUID.randomUUID().toString() + "." + extension;
        }
    }
    
    /**
     * 创建目录，如果目录已存在则不操作
     * 
     * @param directoryPath 目录路径
     * @return 创建是否成功
     */
    public static boolean createDirectory(String directoryPath) {
        Path path = Paths.get(directoryPath);
        try {
            if (!Files.exists(path)) {
                Files.createDirectories(path);
                logger.info("目录创建成功: {}", directoryPath);
                return true;
            }
            return true;
        } catch (IOException e) {
            logger.error("创建目录失败: {}", e.getMessage());
            return false;
        }
    }
    
    /**
     * 复制文件
     * 
     * @param sourcePath 源文件路径
     * @param targetPath 目标文件路径
     * @return 复制是否成功
     */
    public static boolean copyFile(String sourcePath, String targetPath) {
        try {
            Path source = Paths.get(sourcePath);
            Path target = Paths.get(targetPath);
            
            // 确保目标目录存在
            createDirectory(target.getParent().toString());
            
            Files.copy(source, target, StandardCopyOption.REPLACE_EXISTING);
            logger.info("文件复制成功: {} -> {}", sourcePath, targetPath);
            return true;
        } catch (IOException e) {
            logger.error("复制文件失败: {}", e.getMessage());
            return false;
        }
    }
    
    /**
     * 移动文件
     * 
     * @param sourcePath 源文件路径
     * @param targetPath 目标文件路径
     * @return 移动是否成功
     */
    public static boolean moveFile(String sourcePath, String targetPath) {
        try {
            Path source = Paths.get(sourcePath);
            Path target = Paths.get(targetPath);
            
            // 确保目标目录存在
            createDirectory(target.getParent().toString());
            
            Files.move(source, target, StandardCopyOption.REPLACE_EXISTING);
            logger.info("文件移动成功: {} -> {}", sourcePath, targetPath);
            return true;
        } catch (IOException e) {
            logger.error("移动文件失败: {}", e.getMessage());
            return false;
        }
    }
    
    /**
     * 删除文件
     * 
     * @param filePath 文件路径
     * @return 删除是否成功
     */
    public static boolean deleteFile(String filePath) {
        try {
            Path path = Paths.get(filePath);
            if (Files.exists(path)) {
                Files.delete(path);
                logger.info("文件删除成功: {}", filePath);
                return true;
            }
            return false;
        } catch (IOException e) {
            logger.error("删除文件失败: {}", e.getMessage());
            return false;
        }
    }
    
    /**
     * 递归删除目录
     * 
     * @param directoryPath 目录路径
     * @return 删除是否成功
     */
    public static boolean deleteDirectory(String directoryPath) {
        try {
            Path path = Paths.get(directoryPath);
            if (Files.exists(path)) {
                Files.walkFileTree(path, new SimpleFileVisitor<Path>() {
                    @Override
                    public FileVisitResult visitFile(Path file, BasicFileAttributes attrs) throws IOException {
                        Files.delete(file);
                        return FileVisitResult.CONTINUE;
                    }
                    
                    @Override
                    public FileVisitResult postVisitDirectory(Path dir, IOException exc) throws IOException {
                        Files.delete(dir);
                        return FileVisitResult.CONTINUE;
                    }
                });
                logger.info("目录删除成功: {}", directoryPath);
                return true;
            }
            return false;
        } catch (IOException e) {
            logger.error("删除目录失败: {}", e.getMessage());
            return false;
        }
    }
    
    /**
     * 获取文件大小
     * 
     * @param filePath 文件路径
     * @return 文件大小（字节），如果文件不存在返回-1
     */
    public static long getFileSize(String filePath) {
        try {
            Path path = Paths.get(filePath);
            if (Files.exists(path) && Files.isRegularFile(path)) {
                return Files.size(path);
            }
            return -1;
        } catch (IOException e) {
            logger.error("获取文件大小失败: {}", e.getMessage());
            return -1;
        }
    }
    
    /**
     * 读取文件内容为字符串
     * 
     * @param filePath 文件路径
     * @param charset 字符集
     * @return 文件内容字符串
     */
    public static String readFileToString(String filePath, String charset) {
        try {
            Path path = Paths.get(filePath);
            if (Files.exists(path) && Files.isRegularFile(path)) {
                return new String(Files.readAllBytes(path), charset);
            }
            return null;
        } catch (IOException e) {
            logger.error("读取文件内容失败: {}", e.getMessage());
            return null;
        }
    }
    
    /**
     * 写入字符串到文件
     * 
     * @param filePath 文件路径
     * @param content 要写入的内容
     * @param charset 字符集
     * @return 写入是否成功
     */
    public static boolean writeStringToFile(String filePath, String content, String charset) {
        try {
            Path path = Paths.get(filePath);
            
            // 确保目标目录存在
            createDirectory(path.getParent().toString());
            
            Files.write(path, content.getBytes(charset));
            logger.info("写入文件成功: {}", filePath);
            return true;
        } catch (IOException e) {
            logger.error("写入文件失败: {}", e.getMessage());
            return false;
        }
    }
    
    /**
     * 列出目录下的所有文件
     * 
     * @param directoryPath 目录路径
     * @return 文件路径列表
     */
    public static String[] listFiles(String directoryPath) {
        try {
            Path path = Paths.get(directoryPath);
            if (Files.exists(path) && Files.isDirectory(path)) {
                try (Stream<Path> paths = Files.list(path)) {
                    return paths
                            .map(Path::toString)
                            .toArray(String[]::new);
                }
            }
            return new String[0];
        } catch (IOException e) {
            logger.error("列出目录文件失败: {}", e.getMessage());
            return new String[0];
        }
    }
    
    /**
     * 获取文件扩展名
     * 
     * @param fileName 文件名
     * @return 文件扩展名（不含点号）
     */
    public static String getFileExtension(String fileName) {
        if (fileName == null || fileName.isEmpty()) {
            return "";
        }
        
        int lastDotIndex = fileName.lastIndexOf(".");
        if (lastDotIndex == -1 || lastDotIndex == fileName.length() - 1) {
            return "";
        }
        
        return fileName.substring(lastDotIndex + 1).toLowerCase();
    }
    
    /**
     * 获取文件名（不含扩展名）
     * 
     * @param fileName 文件名
     * @return 文件名（不含扩展名）
     */
    public static String getFileNameWithoutExtension(String fileName) {
        if (fileName == null || fileName.isEmpty()) {
            return "";
        }
        
        int lastDotIndex = fileName.lastIndexOf(".");
        if (lastDotIndex == -1) {
            return fileName;
        }
        
        return fileName.substring(0, lastDotIndex);
    }
    
    /**
     * 检查文件是否存在
     * 
     * @param filePath 文件路径
     * @return 文件是否存在
     */
    public static boolean fileExists(String filePath) {
        if (filePath == null || filePath.isEmpty()) {
            return false;
        }
        
        try {
            Path path = Paths.get(filePath);
            return Files.exists(path) && Files.isRegularFile(path);
        } catch (Exception e) {
            logger.error("检查文件存在性失败: {}", e.getMessage());
            return false;
        }
    }
    
    /**
     * 获取文件资源
     * 
     * @param filePath 文件路径
     * @return 文件资源对象
     * @throws IOException 如果获取资源失败
     */
    public static Resource getFileResource(String filePath) throws IOException {
        if (filePath == null || filePath.isEmpty()) {
            throw new IOException("文件路径为空");
        }
        
        Path path = Paths.get(filePath);
        Resource resource = new UrlResource(path.toUri());
        
        if (!resource.exists() || !resource.isReadable()) {
            throw new IOException("无法读取文件资源: " + filePath);
        }
        
        return resource;
    }
}