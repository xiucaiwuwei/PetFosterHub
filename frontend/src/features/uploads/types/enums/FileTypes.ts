/*
 * 文件类型枚举
 * 定义了系统支持的各种文件类型
 * 用于文件上传、预览和处理
 */
export enum FileTypes {
  // 基础类型
  Image = 'Image', // 图片文件
  Video = 'Video', // 视频文件
  Audio = 'Audio', // 音频文件
  Document = 'Document', // 文档文件
  Archive = 'Archive', // 压缩包文件
  Code = 'Code', // 代码文件
  Other = 'Other', // 其他文件
  
  // 专业类型扩展
  MedicalImage = 'MedicalImage', // 医学影像文件
  CAD = 'CAD', // CAD设计文件
  GIS = 'GIS', // 地理信息系统文件
  ThreeDModel = '3DModel', // 3D模型文件
  Database = 'Database', // 数据库文件
  Executable = 'Executable', // 可执行文件
  Font = 'Font', // 字体文件
  Vector = 'Vector' // 矢量图形文件
}