package org.backend.A_general.file.util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.nio.file.*;
import java.nio.file.StandardOpenOption;
import java.util.*;
import java.util.Comparator;
import java.util.stream.Collectors;
import java.util.stream.Stream;

/**
 * 分块上传工具类
 * 提供文件分块上传、合并、状态检查等相关功能
 */
public class ChunkUploadUtils {
    
    private static final Logger logger = LoggerFactory.getLogger(ChunkUploadUtils.class);
    
    // 分块文件扩展名
    public static final String CHUNK_EXTENSION = ".part";
    
    // 临时目录名称
    public static final String TEMP_DIR = "temp";
    
    /**
     * 获取分块存储目录
     * 
     * @param baseDir 基础上传目录
     * @param fileId 文件唯一标识符
     * @return 分块存储目录路径
     */
    public static Path getChunkDir(String baseDir, String fileId) {
        if (baseDir == null || fileId == null) {
            return null;
        }
        
        // 构建临时目录路径
        Path tempDir = Paths.get(baseDir, TEMP_DIR);
        // 构建文件ID对应的分块目录
        return tempDir.resolve(fileId);
    }
    
    /**
     * 检查上传状态，获取已上传的分块索引
     * 
     * @param chunkDir 分块存储目录
     * @return 已上传的分块索引列表
     */
    public static List<Integer> checkUploadStatus(Path chunkDir) {
        List<Integer> uploadedChunks = new ArrayList<>();
        
        if (chunkDir == null) {
            return uploadedChunks;
        }
        
        try {
            if (Files.exists(chunkDir)) {
                // 读取目录中的所有块文件，提取块索引
                try (Stream<Path> filesStream = Files.list(chunkDir)) {
                    filesStream
                            .filter(Files::isRegularFile)
                            .map(Path::getFileName)
                            .map(Path::toString)
                            .filter(name -> name.endsWith(CHUNK_EXTENSION))
                            .forEach(name -> {
                                try {
                                    String indexStr = name.substring(0, name.lastIndexOf('.'));
                                    uploadedChunks.add(Integer.parseInt(indexStr));
                                } catch (NumberFormatException ignored) {
                                    // 忽略无效的块文件
                                }
                            });
                }
                Collections.sort(uploadedChunks);
            }
        } catch (IOException e) {
            // 记录异常但不抛出，返回已收集的块索引
            logger.error("检查上传状态时发生错误: {}", e.getMessage(), e);
        }
        
        return uploadedChunks;
    }
    
    /**
     * 保存文件分块
     * 
     * @param chunk 分块文件
     * @param chunkDir 分块存储目录
     * @param chunkIndex 分块索引
     * @return 是否保存成功
     */
    public static boolean saveChunk(MultipartFile chunk, Path chunkDir, int chunkIndex) {
        if (chunk == null || chunk.isEmpty() || chunkDir == null) {
            return false;
        }
        
        try {
            // 确保分块目录存在
            FileUtils.createDirectory(chunkDir.toString());
            
            // 构建分块文件路径
            String chunkFileName = chunkIndex + CHUNK_EXTENSION;
            Path chunkFilePath = chunkDir.resolve(chunkFileName);
            
            // 保存分块文件
            chunk.transferTo(chunkFilePath);
            logger.info("分块 {} 保存成功，大小: {}KB", chunkIndex, chunk.getSize() / 1024);
            return true;
        } catch (IOException e) {
            logger.error("保存文件分块时发生错误: {}", e.getMessage(), e);
            return false;
        }
    }
    
    /**
     * 合并文件分块
     * 
     * @param chunkDir 分块存储目录
     * @param targetFilePath 目标文件路径
     * @return 是否合并成功
     */
    public static boolean mergeChunks(Path chunkDir, String targetFilePath) {
        if (chunkDir == null || !Files.exists(chunkDir) || targetFilePath == null) {
            return false;
        }
        
        try {
            // 读取所有分块文件并按索引排序
            List<Path> chunkFiles;
            try (Stream<Path> filesStream = Files.list(chunkDir)) {
                chunkFiles = filesStream
                        .filter(Files::isRegularFile)
                        .filter(path -> path.toString().endsWith(CHUNK_EXTENSION))
                        .sorted(Comparator.comparing(path -> {
                            String fileNameStr = path.getFileName().toString();
                            String indexStr = fileNameStr.substring(0, fileNameStr.lastIndexOf('.'));
                            return Integer.parseInt(indexStr);
                        }))
                        .collect(Collectors.toList());
            }
            
            if (chunkFiles.isEmpty()) {
                logger.error("没有找到文件分块");
                return false;
            }
            
            // 确保目标文件目录存在
            Path targetPath = Paths.get(targetFilePath);
            FileUtils.createDirectory(targetPath.getParent().toString());
            
            // 合并分块文件
            try (OutputStream out = new BufferedOutputStream(
                    Files.newOutputStream(targetPath, StandardOpenOption.CREATE, StandardOpenOption.TRUNCATE_EXISTING))) {
                for (Path chunkFile : chunkFiles) {
                    try (InputStream in = new BufferedInputStream(Files.newInputStream(chunkFile))) {
                        byte[] buffer = new byte[8192];
                        int bytesRead;
                        while ((bytesRead = in.read(buffer)) != -1) {
                            out.write(buffer, 0, bytesRead);
                        }
                    }
                }
            }
            
            logger.info("文件分块合并成功，目标文件: {}", targetFilePath);
            return true;
        } catch (IOException e) {
            logger.error("合并文件分块时发生错误: {}", e.getMessage(), e);
            return false;
        }
    }
    
    /**
     * 清理临时分块文件
     * 
     * @param chunkDir 分块存储目录
     * @return 是否清理成功
     */
    public static boolean cleanupChunks(Path chunkDir) {
        if (chunkDir == null || !Files.exists(chunkDir)) {
            return true; // 目录不存在视为清理成功
        }
        
        // 递归删除分块目录及其内容
        boolean deleted = FileUtils.deleteDirectory(chunkDir.toString());
        if (deleted) {
            logger.info("临时分块文件清理成功");
        }
        return deleted;
    }
    
    /**
     * 计算文件需要分成的块数
     * 
     * @param fileSize 文件大小（字节）
     * @param chunkSize 每块大小（字节）
     * @return 块数
     */
    public static int calculateChunkCount(long fileSize, long chunkSize) {
        if (fileSize <= 0 || chunkSize <= 0) {
            return 0;
        }
        
        return (int) Math.ceil((double) fileSize / chunkSize);
    }
    
    /**
     * 生成文件唯一标识符
     * 
     * @param fileName 文件名
     * @param fileSize 文件大小
     * @param fileType 文件类型
     * @return 文件唯一标识符
     */
    public static String generateFileId(String fileName, long fileSize, String fileType) {
        String content = fileName + "+" + fileSize + "+" + fileType + "+" + System.currentTimeMillis();
        return Base64.getEncoder().encodeToString(content.getBytes())
                .replace("+", "-")
                .replace("/", "_")
                .replace("=", "");
    }
    
    /**
     * 验证分块索引是否有效
     * 
     * @param chunkIndex 当前分块索引
     * @param totalChunks 总分块数
     * @return 是否有效
     */
    public static boolean isValidChunkIndex(int chunkIndex, int totalChunks) {
        return chunkIndex >= 0 && chunkIndex < totalChunks;
    }
}