package org.backend.A_general.file.util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.util.Base64;

/**
 * Base64工具类
 * 提供Base64编码解码相关的工具方法
 * 用于文件和数据的Base64编码处理
 */
public class Base64Utils {

    private static final Logger logger = LoggerFactory.getLogger(Base64Utils.class);
    private static final Base64.Encoder ENCODER = Base64.getEncoder();
    private static final Base64.Decoder DECODER = Base64.getDecoder();
    
    /**
     * 将字符串编码为Base64
     * 
     * @param input 输入字符串
     * @return Base64编码后的字符串
     */
    public static String encodeString(String input) {
        if (input == null) {
            return null;
        }
        return ENCODER.encodeToString(input.getBytes(StandardCharsets.UTF_8));
    }
    
    /**
     * 将Base64编码的字符串解码为原始字符串
     * 
     * @param base64String Base64编码的字符串
     * @return 解码后的原始字符串
     */
    public static String decodeToString(String base64String) {
        if (base64String == null) {
            return null;
        }
        try {
            byte[] decodedBytes = DECODER.decode(base64String);
            return new String(decodedBytes, StandardCharsets.UTF_8);
        } catch (IllegalArgumentException e) {
            logger.error("Base64解码字符串失败: {}", e.getMessage());
            return null;
        }
    }
    
    /**
     * 将字节数组编码为Base64字符串
     * 
     * @param bytes 字节数组
     * @return Base64编码后的字符串
     */
    public static String encodeBytes(byte[] bytes) {
        if (bytes == null) {
            return null;
        }
        return ENCODER.encodeToString(bytes);
    }
    
    /**
     * 将Base64编码的字符串解码为字节数组
     * 
     * @param base64String Base64编码的字符串
     * @return 解码后的字节数组
     */
    public static byte[] decodeToBytes(String base64String) {
        if (base64String == null) {
            return null;
        }
        try {
            return DECODER.decode(base64String);
        } catch (IllegalArgumentException e) {
            logger.error("Base64解码字节数组失败: {}", e.getMessage());
            return null;
        }
    }
    
    /**
     * 将文件编码为Base64字符串
     * 
     * @param filePath 文件路径
     * @return Base64编码后的文件内容
     */
    public static String encodeFile(String filePath) {
        try {
            File file = new File(filePath);
            if (!file.exists() || !file.isFile()) {
                logger.warn("文件不存在或不是常规文件: {}", filePath);
                return null;
            }
            
            byte[] fileContent = new byte[(int) file.length()];
            try (FileInputStream fis = new FileInputStream(file)) {
                fis.read(fileContent);
            }
            
            return ENCODER.encodeToString(fileContent);
        } catch (IOException e) {
            logger.error("文件编码为Base64失败: {}", e.getMessage());
            return null;
        }
    }
    
    /**
     * 将Base64编码的字符串解码并保存为文件
     * 
     * @param base64String Base64编码的文件内容
     * @param targetFilePath 目标文件路径
     * @return 保存是否成功
     */
    public static boolean decodeToFile(String base64String, String targetFilePath) {
        if (base64String == null || targetFilePath == null) {
            return false;
        }
        
        try {
            byte[] decodedBytes = DECODER.decode(base64String);
            
            // 确保目标目录存在
            File targetFile = new File(targetFilePath);
            File parentDir = targetFile.getParentFile();
            if (parentDir != null && !parentDir.exists()) {
                boolean dirCreated = parentDir.mkdirs();
                if (!dirCreated) {
                    logger.error("创建目标目录失败: {}", parentDir.getAbsolutePath());
                    return false;
                }
            }
            
            try (FileOutputStream fos = new FileOutputStream(targetFile)) {
                fos.write(decodedBytes);
            }
            
            logger.info("Base64解码并保存文件成功: {}", targetFilePath);
            return true;
        } catch (IOException | IllegalArgumentException e) {
            logger.error("Base64解码并保存文件失败: {}", e.getMessage());
            return false;
        }
    }
    
    /**
     * 检查字符串是否为有效的Base64编码
     * 
     * @param input 输入字符串
     * @return 是否为有效的Base64编码
     */
    public static boolean isValidBase64(String input) {
        if (input == null || input.isEmpty()) {
            return false;
        }
        
        // Base64字符串长度必须是4的倍数
        if (input.length() % 4 != 0) {
            return false;
        }
        
        // 检查是否只包含Base64字符
        if (!input.matches("^[A-Za-z0-9+/]+=*$")) {
            return false;
        }
        
        // 尝试解码以验证
        try {
            DECODER.decode(input);
            return true;
        } catch (IllegalArgumentException e) {
            return false;
        }
    }
    
    /**
     * 移除Base64字符串中的填充字符
     * 
     * @param base64String 包含填充字符的Base64字符串
     * @return 移除填充后的Base64字符串
     */
    public static String removePadding(String base64String) {
        if (base64String == null) {
            return null;
        }
        return base64String.replaceAll("=*$", "");
    }
    
    /**
     * 添加必要的填充字符使Base64字符串长度为4的倍数
     * 
     * @param base64String 缺少填充的Base64字符串
     * @return 填充后的Base64字符串
     */
    public static String addPadding(String base64String) {
        if (base64String == null) {
            return null;
        }
        
        int padLength = 4 - (base64String.length() % 4);
        if (padLength < 4) {
            StringBuilder sb = new StringBuilder(base64String);
            for (int i = 0; i < padLength; i++) {
                sb.append('=');
            }
            return sb.toString();
        }
        return base64String;
    }
    
    /**
     * 获取URL安全的Base64编码
     * 
     * @param input 输入字符串
     * @return URL安全的Base64编码
     */
    public static String encodeUrlSafe(String input) {
        if (input == null) {
            return null;
        }
        return Base64.getUrlEncoder().withoutPadding().encodeToString(input.getBytes(StandardCharsets.UTF_8));
    }
    
    /**
     * 解码URL安全的Base64编码
     * 
     * @param urlSafeBase64 URL安全的Base64编码
     * @return 解码后的原始字符串
     */
    public static String decodeUrlSafe(String urlSafeBase64) {
        if (urlSafeBase64 == null) {
            return null;
        }
        try {
            byte[] decodedBytes = Base64.getUrlDecoder().decode(urlSafeBase64);
            return new String(decodedBytes, StandardCharsets.UTF_8);
        } catch (IllegalArgumentException e) {
            logger.error("URL安全Base64解码失败: {}", e.getMessage());
            return null;
        }
    }
}