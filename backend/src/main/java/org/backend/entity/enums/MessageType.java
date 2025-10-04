package org.backend.entity.enums;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 * 消息类型枚举
 * 定义了系统支持的各种消息类型
 * 与前端TypeScript版本保持一致
 */
@Schema(description = "消息类型枚举")
public enum MessageType {
    /**
     * 文本消息类型
     * 用于普通文本内容的消息
     */
    @Schema(description = "文本消息类型")
    Text,       
    
    /**
     * 图片消息类型
     * 用于发送图片文件的消息
     */
    @Schema(description = "图片消息类型")
    Image,      
    
    /**
     * 视频消息类型
     * 用于发送视频文件的消息
     */
    @Schema(description = "视频消息类型")
    Video,      
    
    /**
     * 文件消息类型
     * 用于发送文档、压缩包等通用文件的消息
     */
    @Schema(description = "文件消息类型")
    File,       
    
    /**
     * 音频消息类型
     * 用于发送音频文件或语音消息
     */
    @Schema(description = "音频消息类型")
    Audio,      
    
    /**
     * 位置消息类型
     * 用于发送地理位置信息的消息
     */
    @Schema(description = "位置消息类型")
    Location,   
    
    /**
     * 联系人消息类型
     * 用于分享联系人信息的消息
     */
    @Schema(description = "联系人消息类型")
    Contact,    
    
    /**
     * 贴纸消息类型
     * 用于发送表情贴纸的消息
     */
    @Schema(description = "贴纸消息类型")
    Sticker,    
    
    /**
     * 系统消息类型
     * 由系统自动发送的通知消息
     */
    @Schema(description = "系统消息类型")
    System,     
    
    /**
     * 未知消息类型
     * 用于表示无法识别的消息类型
     */
    @Schema(description = "未知消息类型")
    Unknown;
}