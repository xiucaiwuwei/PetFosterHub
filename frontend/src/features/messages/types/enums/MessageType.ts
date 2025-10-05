/**
 * 消息类型枚举
 * 定义了系统支持的各种消息类型
 * 与后端Java版本保持一致，支持文本、图片、视频、文件、音频、位置、联系人、贴纸和系统消息
 */
export enum MessageType {
  Text = 'Text', // 文本消息
  Image = 'Image', // 图片消息
  Video = 'Video', // 视频消息
  File = 'File', // 文件消息
  Audio = 'Audio', // 音频消息  
  Location = 'Location', // 位置消息  
  Contact = 'Contact', // 联系人消息
  Sticker = 'Sticker', // 贴纸消息
  System = 'System', // 系统消息
  Unknown = 'Unknown', // 未知消息
}