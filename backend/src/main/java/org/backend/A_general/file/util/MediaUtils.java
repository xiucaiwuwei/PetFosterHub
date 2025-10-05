package org.backend.A_general.file.util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Base64;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.imageio.ImageIO;

/**
 * 媒体工具类
 * 提供图片、音频、视频等媒体文件的特定操作功能
 */
public class MediaUtils {
    
    private static final Logger logger = LoggerFactory.getLogger(MediaUtils.class);
    
    // 图片缩略图默认宽度
    public static final int DEFAULT_THUMBNAIL_WIDTH = 300;
    
    // 图片缩略图默认高度
    public static final int DEFAULT_THUMBNAIL_HEIGHT = 200;
    
    /**
     * 生成图片缩略图
     * 
     * @param sourcePath 源图片路径
     * @param targetPath 目标缩略图路径
     * @param width 缩略图宽度
     * @param height 缩略图高度
     * @return 是否生成成功
     */
    public static boolean generateThumbnail(String sourcePath, String targetPath, int width, int height) {
        if (sourcePath == null || targetPath == null) {
            return false;
        }
        
        Path source = Paths.get(sourcePath);
        if (!Files.exists(source) || !Files.isRegularFile(source)) {
            return false;
        }
        
        try {
            // 读取源图片
            BufferedImage originalImage = ImageIO.read(source.toFile());
            if (originalImage == null) {
                return false;
            }
            
            // 计算缩放比例，保持原图比例
            int originalWidth = originalImage.getWidth();
            int originalHeight = originalImage.getHeight();
            double scale = Math.min((double) width / originalWidth, (double) height / originalHeight);
            
            int newWidth = (int) (originalWidth * scale);
            int newHeight = (int) (originalHeight * scale);
            
            // 创建缩略图
            BufferedImage thumbnail = new BufferedImage(newWidth, newHeight, BufferedImage.TYPE_INT_RGB);
            Graphics2D g = thumbnail.createGraphics();
            g.drawImage(originalImage, 0, 0, newWidth, newHeight, null);
            g.dispose();
            
            // 确保目标目录存在
            Path target = Paths.get(targetPath);
            FileUtils.createDirectory(target.getParent().toString());
            
            // 获取文件扩展名作为图片格式
            String extension = FileUtils.getFileExtension(sourcePath);
            if (extension == null || extension.isEmpty()) {
                extension = "jpg";
            }
            
            // 保存缩略图
            return ImageIO.write(thumbnail, extension, target.toFile());
        } catch (IOException e) {
            logger.error("生成缩略图时发生错误: {}", e.getMessage(), e);
            return false;
        }
    }
    
    /**
     * 使用默认尺寸生成图片缩略图
     * 
     * @param sourcePath 源图片路径
     * @param targetPath 目标缩略图路径
     * @return 是否生成成功
     */
    public static boolean generateThumbnail(String sourcePath, String targetPath) {
        return generateThumbnail(sourcePath, targetPath, DEFAULT_THUMBNAIL_WIDTH, DEFAULT_THUMBNAIL_HEIGHT);
    }
    
    /**
     * 图片转换为Base64编码
     * 
     * @param imagePath 图片路径
     * @return Base64编码的图片数据
     */
    public static String imageToBase64(String imagePath) {
        if (imagePath == null || imagePath.isEmpty()) {
            return "";
        }
        
        Path path = Paths.get(imagePath);
        if (!Files.exists(path) || !Files.isRegularFile(path)) {
            return "";
        }
        
        try {
            // 获取图片格式
            String extension = FileUtils.getFileExtension(imagePath);
            if (extension == null || extension.isEmpty()) {
                return "";
            }
            
            // 读取图片并转换为Base64
            byte[] imageData = Files.readAllBytes(path);
            String base64 = Base64.getEncoder().encodeToString(imageData);
            
            // 返回带前缀的数据URI格式
            return "data:image/" + extension.toLowerCase() + ";base64," + base64;
        } catch (IOException e) {
            logger.error("转换图片为Base64时发生错误: {}", e.getMessage(), e);
            return "";
        }
    }
    
    /**
     * 从Base64编码恢复图片
     * 
     * @param base64Image Base64编码的图片数据
     * @param targetPath 目标图片路径
     * @return 是否恢复成功
     */
    public static boolean base64ToImage(String base64Image, String targetPath) {
        if (base64Image == null || base64Image.isEmpty() || targetPath == null || targetPath.isEmpty()) {
            return false;
        }
        
        try {
            // 移除data URI前缀
            String base64Data = base64Image;
            if (base64Image.startsWith("data:image/")) {
                Pattern pattern = Pattern.compile("data:image/[^;]+;base64,(.*)");
                Matcher matcher = pattern.matcher(base64Image);
                if (matcher.find()) {
                    base64Data = matcher.group(1);
                }
            }
            
            // 解码Base64数据
            byte[] imageBytes = Base64.getDecoder().decode(base64Data);
            
            // 确保目标目录存在
            Path target = Paths.get(targetPath);
            FileUtils.createDirectory(target.getParent().toString());
            
            // 写入文件
            Files.write(target, imageBytes);
            return true;
        } catch (IOException | IllegalArgumentException e) {
            logger.error("从Base64恢复图片时发生错误: {}", e.getMessage(), e);
            return false;
        }
    }
    
    /**
     * 获取图片尺寸信息
     * 
     * @param imagePath 图片路径
     * @return 包含宽度和高度的字符串，格式为"widthxheight"，获取失败返回空字符串
     */
    public static String getImageDimensions(String imagePath) {
        if (imagePath == null || imagePath.isEmpty()) {
            return "";
        }
        
        Path path = Paths.get(imagePath);
        if (!Files.exists(path) || !Files.isRegularFile(path)) {
            return "";
        }
        
        try {
            BufferedImage image = ImageIO.read(path.toFile());
            if (image == null) {
                return "";
            }
            return image.getWidth() + "x" + image.getHeight();
        } catch (IOException e) {
            logger.error("获取图片尺寸时发生错误: {}", e.getMessage(), e);
            return "";
        }
    }
    
    /**
     * 检查文件是否为图片
     * 
     * @param filePath 文件路径
     * @return 是否为图片
     */
    public static boolean isImageFile(String filePath) {
        if (filePath == null || filePath.isEmpty()) {
            return false;
        }
        
        String extension = FileUtils.getFileExtension(filePath);
        return FileTypeUtils.isImageFile(extension);
    }
    
    /**
     * 检查文件是否为音频
     * 
     * @param filePath 文件路径
     * @return 是否为音频
     */
    public static boolean isAudioFile(String filePath) {
        if (filePath == null || filePath.isEmpty()) {
            return false;
        }
        
        String extension = FileUtils.getFileExtension(filePath);
        return FileTypeUtils.isAudioFile(extension);
    }
    
    /**
     * 检查文件是否为视频
     * 
     * @param filePath 文件路径
     * @return 是否为视频
     */
    public static boolean isVideoFile(String filePath) {
        if (filePath == null || filePath.isEmpty()) {
            return false;
        }
        
        String extension = FileUtils.getFileExtension(filePath);
        return FileTypeUtils.isVideoFile(extension);
    }
}