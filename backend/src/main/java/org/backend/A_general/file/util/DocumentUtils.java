package org.backend.A_general.file.util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Base64;
import java.util.List;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

/**
 * 文档工具类
 * 提供文档类型文件的特定操作，如内容预览、文本提取等功能
 */
public class DocumentUtils {
    
    private static final Logger logger = LoggerFactory.getLogger(DocumentUtils.class);
    
    // 支持直接预览的文档扩展名
    private static final List<String> PREVIEWABLE_DOCS = List.of("txt", "csv", "log", "xml", "json", "html", "htm", "css", "js", "java", "py", "c", "cpp", "php", "rb", "go", "sh");
    
    // 文本文件编码
    private static final String DEFAULT_ENCODING = StandardCharsets.UTF_8.name();
    
    /**
     * 检查文档是否可直接预览
     * 
     * @param extension 文件扩展名
     * @return 是否可直接预览
     */
    public static boolean isPreviewableDocument(String extension) {
        if (extension == null || extension.isEmpty()) {
            return false;
        }
        return PREVIEWABLE_DOCS.contains(extension.toLowerCase());
    }
    
    /**
     * 获取文档文件的内容预览
     * 
     * @param filePath 文件路径
     * @param maxLines 最大行数
     * @return 文档内容预览
     */
    public static String getDocumentPreview(String filePath, int maxLines) {
        if (filePath == null || filePath.isEmpty()) {
            return "";
        }
        
        Path path = Paths.get(filePath);
        if (!Files.exists(path) || !Files.isRegularFile(path)) {
            return "";
        }
        
        // 检查文件类型是否支持预览
        String extension = FileUtils.getFileExtension(filePath);
        if (!isPreviewableDocument(extension)) {
            return "不支持的文件类型，无法预览内容";
        }
        
        try {
            // 读取文件内容，限制行数
            return Files.lines(path, StandardCharsets.UTF_8)
                    .limit(maxLines)
                    .collect(Collectors.joining("\n"));
        } catch (IOException e) {
            logger.error("读取文档预览时发生错误: {}", e.getMessage(), e);
            return "无法读取文件内容";
        }
    }
    
    /**
     * 提取文本文件的纯文本内容
     * 
     * @param filePath 文件路径
     * @return 文本内容
     */
    public static String extractTextContent(String filePath) {
        if (filePath == null || filePath.isEmpty()) {
            return "";
        }
        
        Path path = Paths.get(filePath);
        if (!Files.exists(path) || !Files.isRegularFile(path)) {
            return "";
        }
        
        try {
            return new String(Files.readAllBytes(path), DEFAULT_ENCODING);
        } catch (IOException e) {
            logger.error("提取文本内容时发生错误: {}", e.getMessage(), e);
            return "";
        }
    }
    
    /**
     * 将小文本文件转换为Base64编码
     * 
     * @param filePath 文件路径
     * @return Base64编码的文件内容
     */
    public static String convertToBase64(String filePath) {
        if (filePath == null || filePath.isEmpty()) {
            return "";
        }
        
        Path path = Paths.get(filePath);
        if (!Files.exists(path) || !Files.isRegularFile(path)) {
            return "";
        }
        
        try {
            byte[] fileContent = Files.readAllBytes(path);
            return Base64.getEncoder().encodeToString(fileContent);
        } catch (IOException e) {
            logger.error("转换文件为Base64时发生错误: {}", e.getMessage(), e);
            return "";
        }
    }
    
    /**
     * 从Base64编码恢复文本文件
     * 
     * @param base64Content Base64编码的内容
     * @param targetPath 目标文件路径
     * @return 是否恢复成功
     */
    public static boolean restoreFromBase64(String base64Content, String targetPath) {
        if (base64Content == null || base64Content.isEmpty() || targetPath == null || targetPath.isEmpty()) {
            return false;
        }
        
        try {
            // 确保目标目录存在
            Path targetFilePath = Paths.get(targetPath);
            FileUtils.createDirectory(targetFilePath.getParent().toString());
            
            // 解码并写入文件
            byte[] decodedContent = Base64.getDecoder().decode(base64Content);
            Files.write(targetFilePath, decodedContent);
            return true;
        } catch (IOException | IllegalArgumentException e) {
            logger.error("从Base64恢复文件时发生错误: {}", e.getMessage(), e);
            return false;
        }
    }
    
    /**
     * 搜索文本文件中的关键词
     * 
     * @param filePath 文件路径
     * @param keyword 关键词
     * @return 包含关键词的行号和内容列表
     */
    public static List<String> searchInTextFile(String filePath, String keyword) {
        if (filePath == null || filePath.isEmpty() || keyword == null || keyword.isEmpty()) {
            return List.of();
        }
        
        Path path = Paths.get(filePath);
        if (!Files.exists(path) || !Files.isRegularFile(path)) {
            return List.of();
        }
        
        try {
            // 编译关键词为正则表达式，忽略大小写
            Pattern pattern = Pattern.compile(keyword, Pattern.CASE_INSENSITIVE);
            
            // 逐行搜索
            List<String> results = new java.util.ArrayList<>();
            try (BufferedReader reader = new BufferedReader(new FileReader(filePath, StandardCharsets.UTF_8))) {
                String line;
                int lineNum = 0;
                while ((line = reader.readLine()) != null) {
                    lineNum++;
                    if (pattern.matcher(line).find()) {
                        results.add("第" + lineNum + "行: " + line);
                    }
                }
            }
            
            return results;
        } catch (IOException e) {
            logger.error("搜索文本文件时发生错误: {}", e.getMessage(), e);
            return List.of();
        }
    }
    
    /**
     * 计算文本文件的行数
     * 
     * @param filePath 文件路径
     * @return 行数
     */
    public static int countLines(String filePath) {
        if (filePath == null || filePath.isEmpty()) {
            return 0;
        }
        
        Path path = Paths.get(filePath);
        if (!Files.exists(path) || !Files.isRegularFile(path)) {
            return 0;
        }
        
        try {
            return (int) Files.lines(path).count();
        } catch (IOException e) {
            logger.error("计算文件行数时发生错误: {}", e.getMessage(), e);
            return 0;
        }
    }
}