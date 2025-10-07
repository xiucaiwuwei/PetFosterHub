/*
 * 文件上传页面
 * 展示文件上传功能的使用示例
 */
import React from 'react';
import { FileUploader, UploadProgress } from '../components';
import { useFileUpload } from '../hooks';
import { FileTypes } from '../types/enums/A_index';
import { uploadImage, uploadFile } from '../api/uploadApi';
import { UploadFileDto } from '../types/dto/A_index';

/**
 * 文件上传示例页面
 */
export const FileUploadPage: React.FC = () => {
  const { uploadTasks, startUpload, pauseUpload, removeUpload } = useFileUpload();

  /**
   * 处理图片上传
   */
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      // 使用API直接上传
      const imageUrl = await uploadImage(file);
      console.log('图片上传成功:', imageUrl);
      alert(`图片上传成功: ${imageUrl}`);
    } catch (error) {
      console.error('图片上传失败:', error);
      alert(`图片上传失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
    
    // 重置文件输入
    if (event.target) {
      event.target.value = '';
    }
  };

  /**
   * 处理自定义文件上传
   */
  const handleCustomUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      // 准备上传数据
      const fileDto: UploadFileDto = {
        file,
        fileType: FileTypes.Document,
        title: `自定义标题_${file.name}`,
        description: '这是一个测试文件',
        context: {
          uploadSource: 'FileUploadPage',
          timestamp: new Date().toISOString()
        }
      };

      // 使用uploadFile函数上传
      const fileUrl = await uploadFile(fileDto);
      console.log('文件上传成功:', fileUrl);
      alert(`文件上传成功: ${fileUrl}`);
    } catch (error) {
      console.error('文件上传失败:', error);
      alert(`文件上传失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
    
    // 重置文件输入
    if (event.target) {
      event.target.value = '';
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">文件上传示例</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* 拖拽上传区域 */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">拖拽上传</h2>
          <FileUploader
            allowedTypes={[FileTypes.Image, FileTypes.Video, FileTypes.Audio]}
            maxSize={20 * 1024 * 1024} // 20MB
            multiple
            buttonText="选择文件上传"
            buttonClassName="px-6"
            hintText="支持图片、视频和音频文件，最大20MB"
            onFileSelect={(files) => {
              console.log('选择了文件:', files);
            }}
            onUploadSuccess={(fileUrl) => {
              console.log('上传成功:', fileUrl);
            }}
            onUploadError={(error) => {
              console.error('上传失败:', error);
            }}
          />
        </div>

        {/* 直接API调用示例 */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">直接API调用</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                上传图片
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-medium
                  file:bg-blue-600 file:text-white
                  hover:file:bg-blue-700
                "
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                自定义上传（带元数据）
              </label>
              <input
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                onChange={handleCustomUpload}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-medium
                  file:bg-green-600 file:text-white
                  hover:file:bg-green-700
                "
              />
            </div>
          </div>
        </div>
      </div>

      {/* 上传进度区域 */}
      <UploadProgress 
        showFileSize 
        showUploadSpeed 
        showRemainingTime 
        showStatusText 
      />

      {/* 上传任务列表（用于展示和控制） */}
      {uploadTasks.length > 0 && (
        <div className="mt-8 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">上传任务管理</h2>
          
          <div className="space-y-3">
            {uploadTasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800 truncate">{task.file.name}</p>
                  <p className="text-sm text-gray-500">
                    状态: {task.status}, 进度: {task.progress}%
                  </p>
                </div>
                
                <div className="flex space-x-2 ml-4">
                  {task.status === 'idle' && (
                    <button
                      onClick={() => startUpload(task.id)}
                      className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      开始
                    </button>
                  )}
                  
                  {task.status === 'uploading' && (
                    <button
                      onClick={() => pauseUpload(task.id)}
                      className="px-3 py-1 text-xs bg-yellow-500 text-white rounded hover:bg-yellow-600"
                    >
                      暂停
                    </button>
                  )}
                  
                  <button
                    onClick={() => removeUpload(task.id)}
                    className="px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    移除
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};