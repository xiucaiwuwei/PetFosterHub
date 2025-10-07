/**
 * 上传任务状态枚举
 * 定义了文件上传任务的各种状态
 * 用于跟踪上传任务的进度和结果
 */
export enum UploadStatus {
  Idle = 'idle', // 任务已创建但未开始上传
  Uploading = 'uploading', // 任务正在上传中
  Success = 'success', // 任务上传成功
  Error = 'error' // 任务上传失败
}