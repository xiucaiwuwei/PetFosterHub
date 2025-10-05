/*
 * 文件上传请求DTO
 * 用于定义文件上传的请求参数
 */
export interface UploadFileDto {
  /** 文件对象 */
  file: File;
  /** 文件类型 */
  fileType: string;
  /** 可选的文件标题 */
  title?: string;
  /** 可选的文件描述 */
  description?: string;
  /** 可选的上传上下文信息 */
  context?: Record<string, string>;
}