package org.backend.A_general.file.util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;

/**
 * 文件类型工具类
 * 提供文件类型判断、文件扩展名与MIME类型映射等功能
 */
public class FileTypeUtils {

    private static final Logger logger = LoggerFactory.getLogger(FileTypeUtils.class);
    
    // 文件扩展名到MIME类型的映射
    private static final Map<String, String> EXTENSION_TO_MIME_TYPE = new HashMap<>();
    
    // MIME类型到文件扩展名的映射
    private static final Map<String, String> MIME_TYPE_TO_EXTENSION = new HashMap<>();
    
    // 常见图片文件类型
    private static final Map<String, String> IMAGE_FILE_TYPES = new HashMap<>();
    
    // 常见文档文件类型
    private static final Map<String, String> DOCUMENT_FILE_TYPES = new HashMap<>();
    
    // 常见音频文件类型
    private static final Map<String, String> AUDIO_FILE_TYPES = new HashMap<>();
    
    // 常见视频文件类型
    private static final Map<String, String> VIDEO_FILE_TYPES = new HashMap<>();
    
    // 文件类型图标映射
    private static final Map<String, String> FILE_TYPE_ICONS = new HashMap<>();
    
    static {
        // 初始化图片文件类型
        addFileType("jpg", "image/jpeg", "jpg", "图片", "image");
        addFileType("jpeg", "image/jpeg", "jpg", "图片", "image");
        addFileType("png", "image/png", "png", "图片", "image");
        addFileType("gif", "image/gif", "gif", "图片", "image");
        addFileType("bmp", "image/bmp", "bmp", "图片", "image");
        addFileType("webp", "image/webp", "webp", "图片", "image");
        
        // 初始化文档文件类型
        addFileType("pdf", "application/pdf", "pdf", "文档", "document");
        addFileType("doc", "application/msword", "doc", "文档", "document");
        addFileType("docx", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "docx", "文档", "document");
        addFileType("xls", "application/vnd.ms-excel", "xls", "文档", "document");
        addFileType("xlsx", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "xlsx", "文档", "document");
        addFileType("ppt", "application/vnd.ms-powerpoint", "ppt", "文档", "document");
        addFileType("pptx", "application/vnd.openxmlformats-officedocument.presentationml.presentation", "pptx", "文档", "document");
        addFileType("txt", "text/plain", "txt", "文档", "document");
        addFileType("csv", "text/csv", "csv", "文档", "document");
        addFileType("md", "text/markdown", "md", "文档", "document");
        
        // 初始化音频文件类型
        addFileType("mp3", "audio/mpeg", "mp3", "音频", "audio");
        addFileType("wav", "audio/wav", "wav", "音频", "audio");
        addFileType("ogg", "audio/ogg", "ogg", "音频", "audio");
        addFileType("flac", "audio/flac", "flac", "音频", "audio");
        addFileType("aac", "audio/aac", "aac", "音频", "audio");
        
        // 初始化视频文件类型
        addFileType("mp4", "video/mp4", "mp4", "视频", "video");
        addFileType("avi", "video/avi", "avi", "视频", "video");
        addFileType("mov", "video/quicktime", "mov", "视频", "video");
        addFileType("mkv", "video/x-matroska", "mkv", "视频", "video");
        addFileType("webm", "video/webm", "webm", "视频", "video");
        addFileType("wmv", "video/x-ms-wmv", "wmv", "视频", "video");
        
        // 初始化其他常见文件类型
        addFileType("zip", "application/zip", "zip", "压缩包", "archive");
        addFileType("rar", "application/x-rar-compressed", "rar", "压缩包", "archive");
        addFileType("7z", "application/x-7z-compressed", "7z", "压缩包", "archive");
        addFileType("tar", "application/x-tar", "tar", "压缩包", "archive");
        addFileType("gz", "application/gzip", "gz", "压缩包", "archive");
        
        // 初始化可执行文件类型
        addFileType("exe", "application/x-msdownload", "exe", "可执行文件", "executable");
        addFileType("bat", "application/x-bat", "bat", "可执行文件", "executable");
        addFileType("sh", "application/x-sh", "sh", "可执行文件", "executable");
        
        // 初始化文件类型图标
        FILE_TYPE_ICONS.put("image", "/icons/image.svg");
        FILE_TYPE_ICONS.put("document", "/icons/document.svg");
        FILE_TYPE_ICONS.put("audio", "/icons/audio.svg");
        FILE_TYPE_ICONS.put("video", "/icons/video.svg");
        FILE_TYPE_ICONS.put("archive", "/icons/archive.svg");
        FILE_TYPE_ICONS.put("executable", "/icons/executable.svg");
        FILE_TYPE_ICONS.put("default", "/icons/file.svg");
    }
    
    /**
     * 添加文件类型信息
     */
    private static void addFileType(String extension, String mimeType, String defaultExtension, String category, String iconType) {
        EXTENSION_TO_MIME_TYPE.put(extension.toLowerCase(), mimeType);
        MIME_TYPE_TO_EXTENSION.put(mimeType.toLowerCase(), defaultExtension);
        
        switch (category) {
            case "图片":
                IMAGE_FILE_TYPES.put(extension.toLowerCase(), mimeType);
                break;
            case "文档":
                DOCUMENT_FILE_TYPES.put(extension.toLowerCase(), mimeType);
                break;
            case "音频":
                AUDIO_FILE_TYPES.put(extension.toLowerCase(), mimeType);
                break;
            case "视频":
                VIDEO_FILE_TYPES.put(extension.toLowerCase(), mimeType);
                break;
        }
    }
    
    /**
     * 根据文件扩展名获取MIME类型
     * 
     * @param extension 文件扩展名（不含点号）
     * @return MIME类型，如果未知返回null
     */
    public static String getMimeTypeByExtension(String extension) {
        if (extension == null || extension.isEmpty()) {
            return null;
        }
        return EXTENSION_TO_MIME_TYPE.get(extension.toLowerCase());
    }
    
    /**
     * 根据MIME类型获取默认文件扩展名
     * 
     * @param mimeType MIME类型
     * @return 文件扩展名（不含点号），如果未知返回null
     */
    public static String getExtensionByMimeType(String mimeType) {
        if (mimeType == null || mimeType.isEmpty()) {
            return null;
        }
        return MIME_TYPE_TO_EXTENSION.get(mimeType.toLowerCase());
    }
    
    /**
     * 从文件名获取扩展名
     * 
     * @param fileName 文件名
     * @return 文件扩展名（不含点号），如果没有扩展名返回空字符串
     */
    public static String getExtensionFromFileName(String fileName) {
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
     * 判断是否为图片文件
     * 
     * @param extension 文件扩展名（不含点号）
     * @return 是否为图片文件
     */
    public static boolean isImageFile(String extension) {
        if (extension == null || extension.isEmpty()) {
            return false;
        }
        return IMAGE_FILE_TYPES.containsKey(extension.toLowerCase());
    }
    
    /**
     * 判断是否为文档文件
     * 
     * @param extension 文件扩展名（不含点号）
     * @return 是否为文档文件
     */
    public static boolean isDocumentFile(String extension) {
        if (extension == null || extension.isEmpty()) {
            return false;
        }
        return DOCUMENT_FILE_TYPES.containsKey(extension.toLowerCase());
    }
    
    /**
     * 判断是否为音频文件
     * 
     * @param extension 文件扩展名（不含点号）
     * @return 是否为音频文件
     */
    public static boolean isAudioFile(String extension) {
        if (extension == null || extension.isEmpty()) {
            return false;
        }
        return AUDIO_FILE_TYPES.containsKey(extension.toLowerCase());
    }
    
    /**
     * 判断是否为视频文件
     * 
     * @param extension 文件扩展名（不含点号）
     * @return 是否为视频文件
     */
    public static boolean isVideoFile(String extension) {
        if (extension == null || extension.isEmpty()) {
            return false;
        }
        return VIDEO_FILE_TYPES.containsKey(extension.toLowerCase());
    }
    
    /**
     * 获取文件类型分类
     * 
     * @param extension 文件扩展名（不含点号）
     * @return 文件类型分类名称
     */
    public static String getFileCategory(String extension) {
        if (extension == null || extension.isEmpty()) {
            return "其他文件";
        }
        
        String ext = extension.toLowerCase();
        if (IMAGE_FILE_TYPES.containsKey(ext)) {
            return "图片";
        } else if (DOCUMENT_FILE_TYPES.containsKey(ext)) {
            return "文档";
        } else if (AUDIO_FILE_TYPES.containsKey(ext)) {
            return "音频";
        } else if (VIDEO_FILE_TYPES.containsKey(ext)) {
            return "视频";
        } else if (ext.equals("zip") || ext.equals("rar") || ext.equals("7z") || ext.equals("tar") || ext.equals("gz")) {
            return "压缩包";
        } else if (ext.equals("exe") || ext.equals("bat") || ext.equals("sh")) {
            return "可执行文件";
        } else {
            return "其他文件";
        }
    }
    
    /**
     * 获取文件类型图标路径
     * 
     * @param category 文件类型分类
     * @return 图标路径
     */
    public static String getFileTypeIconPath(String category) {
        if (category == null || category.isEmpty()) {
            return FILE_TYPE_ICONS.get("default");
        }
        
        switch (category) {
            case "图片":
                return FILE_TYPE_ICONS.get("image");
            case "文档":
                return FILE_TYPE_ICONS.get("document");
            case "音频":
                return FILE_TYPE_ICONS.get("audio");
            case "视频":
                return FILE_TYPE_ICONS.get("video");
            case "压缩包":
                return FILE_TYPE_ICONS.get("archive");
            case "可执行文件":
                return FILE_TYPE_ICONS.get("executable");
            default:
                return FILE_TYPE_ICONS.get("default");
        }
    }
    
    /**
     * 获取所有支持的文件扩展名
     * 
     * @return 支持的文件扩展名集合
     */
    public static Set<String> getAllSupportedExtensions() {
        return EXTENSION_TO_MIME_TYPE.keySet();
    }
    
    /**
     * 获取所有支持的MIME类型
     * 
     * @return 支持的MIME类型集合
     */
    public static Set<String> getAllSupportedMimeTypes() {
        return MIME_TYPE_TO_EXTENSION.keySet();
    }
    
    /**
     * 检查文件扩展名是否被支持
     * 
     * @param extension 文件扩展名（不含点号）
     * @return 是否被支持
     */
    public static boolean isExtensionSupported(String extension) {
        if (extension == null || extension.isEmpty()) {
            return false;
        }
        return EXTENSION_TO_MIME_TYPE.containsKey(extension.toLowerCase());
    }
    
    /**
     * 检查MIME类型是否被支持
     * 
     * @param mimeType MIME类型
     * @return 是否被支持
     */
    public static boolean isMimeTypeSupported(String mimeType) {
        if (mimeType == null || mimeType.isEmpty()) {
            return false;
        }
        return MIME_TYPE_TO_EXTENSION.containsKey(mimeType.toLowerCase());
    }
}