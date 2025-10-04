/*
 * 消息输入组件 - QQ风格 美化版
 * 基于QQ聊天界面风格，增强了动画效果和视觉体验
 */
import React, { useState, useRef, useEffect } from 'react';
import { Toolbar } from './Toolbar';
import { EmojiPicker } from './EmojiPicker';
import { MessageTextArea } from './MessageTextArea';
import { SendButton } from './SendButton';
import { toast } from 'sonner';

interface MessageInputProps {
  onSendMessage: (content: string) => void;
  onSendImage?: (file: File) => void;
  onSendVideo?: (file: File) => void;
  disabled?: boolean;
}

/**
 * 消息输入主组件
 * 整合工具栏、输入框、发送按钮和表情选择器
 */
export const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  onSendImage,
  onSendVideo,
  disabled = false
}) => {
  const [content, setContent] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [inputHeight, setInputHeight] = useState<number | null>(null); // 控制整体输入框高度
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleSubmit = () => {
    const trimmedContent = content.trim();
    if (trimmedContent && !disabled) {
      onSendMessage(trimmedContent);
      setContent('');
    }
  };

  const handleEmojiClick = (emoji: string) => {
    setContent(content + emoji);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && onSendImage) {
      // 检查文件大小，限制在10MB以内
      const file = e.target.files[0];
      if (file.size > 10 * 1024 * 1024) {
        toast.error('图片文件大小不能超过10MB');
        return;
      }
      
      // 检查文件类型，确保是图片文件
      if (!file.type.startsWith('image/')) {
        toast.error('请选择有效的图片文件');
        return;
      }
      
      try {
        onSendImage(file);
        toast.success('图片发送成功');
      } catch (error) {
        toast.error('图片发送失败，请重试');
      }
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && onSendVideo) {
      onSendVideo(e.target.files[0]);
      if (videoInputRef.current) {
        videoInputRef.current.value = '';
      }
    }
  };

  const handleVideoUpload = () => {
      if (disabled) return;
      
      if (onSendVideo && videoInputRef.current) {
        videoInputRef.current.click();
      } else {
        // 提供适当的反馈
        console.log('视频上传功能暂不可用');
        // 可以在这里添加一个提示消息组件
        alert('视频上传功能即将上线');
      }
    };

    const handleImageUpload = () => {
    if (disabled) return;
    
    if (onSendImage && fileInputRef.current) {
      fileInputRef.current.click();
    } else {
      // 提供适当的反馈
      console.log('图片上传功能暂不可用');
      // 使用toast替代alert
      toast.info('图片上传功能暂不可用，请稍后再试');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !disabled) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSendClick = () => {
    handleSubmit();
  };

  // 监听窗口大小变化，确保最大高度保持为屏幕高度的一半
  useEffect(() => {
    const handleResize = () => {
      // 如果当前高度超过新的最大高度限制，重新设置高度
      if (inputHeight && inputHeight > window.innerHeight / 2) {
        setInputHeight(window.innerHeight / 2);
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [inputHeight]);

  // 拖拽调整大小效果 - 最终可靠实现
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // 在鼠标按下时就记录初始位置和容器高度
    const container = containerRef.current;
    if (!container) return;
    
    // 直接获取当前容器高度
    const startHeight = container.offsetHeight;
    const startY = e.clientY;
    
    // 定义拖动过程中的处理函数
    const handleDragMove = (moveEvent: MouseEvent) => {
      // 计算高度变化 - 翻转方向使拖动行为符合直觉
      const deltaY = moveEvent.clientY - startY;
      const newHeight = startHeight - deltaY; // 向上拖动增加高度，向下拖动减小高度
      const minHeight = 240;
      const maxHeight = window.innerHeight / 2;
      
      // 应用高度限制并更新状态
      const clampedHeight = Math.max(minHeight, Math.min(maxHeight, newHeight));
      setInputHeight(clampedHeight);
    };

    const handleDragEnd = () => {
      // 移除事件监听器
      document.removeEventListener('mousemove', handleDragMove);
      document.removeEventListener('mouseup', handleDragEnd);
      document.removeEventListener('mouseleave', handleDragEnd); // 添加mouseleave监听
      setIsDragging(false);
    };

    // 设置拖动状态并添加事件监听
    setIsDragging(true);
    document.addEventListener('mousemove', handleDragMove);
    document.addEventListener('mouseup', handleDragEnd);
    document.addEventListener('mouseleave', handleDragEnd); // 添加mouseleave监听
  };

  // 确保在组件卸载时清理所有事件监听器
  useEffect(() => {
    // 这是安全的组件卸载清理
    return () => {
      // 组件卸载时设置isDragging为false
      if (isDragging) {
        setIsDragging(false);
      }
    };
  }, [isDragging]);

  return (
    <div 
      className="border-t border-gray-200 bg-white relative overflow-hidden flex flex-col"
      ref={containerRef}
      style={inputHeight ? { height: `${inputHeight}px` } : { minHeight: '240px' }}
    >
      {/* 上：工具栏 - 固定大小 */}
      <div className="relative">
        {/* 拖动条 - 最小高度设计 */}
        <div 
          className={`h-2 w-full cursor-ns-resize transition-all duration-200 ${isDragging ? 'bg-blue-100' : 'hover:bg-gray-50 bg-transparent'}`}
          onMouseDown={handleMouseDown}
          style={{ 
            userSelect: 'none', 
            position: 'absolute', 
            top: '0', 
            left: '0', 
            right: '0', 
            zIndex: '100',
            pointerEvents: 'auto'
          }}
        />
        
        {/* 工具栏组件 */}
        <div className="h-14">
          <Toolbar
            showEmojiPicker={showEmojiPicker}
            onToggleEmojiPicker={() => setShowEmojiPicker(!showEmojiPicker)}
            onImageUpload={handleImageUpload}
            onVideoUpload={handleVideoUpload}
            disabled={disabled}
            hasImageUpload={true}
            hasVideoUpload={true}
            contentLength={content.length}
          />
        </div>
      </div>
      
      {/* 中：文本框区域 - 自适应高度 */}
      <div className="flex-1 p-3">
        <MessageTextArea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          // 当inputHeight存在时才传递controlledHeight属性，避免传递undefined值
          {...(inputHeight && { controlledHeight: `${inputHeight - 120}px` })} // 传递受控高度，减去工具栏和底部按钮高度
        />
        
        {/* 隐藏的文件上传输入 */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          disabled={disabled}
        />
        
        {/* 隐藏的视频上传输入 */}
        <input
          ref={videoInputRef}
          type="file"
          accept="video/*"
          onChange={handleVideoChange}
          className="hidden"
          disabled={disabled}
        />
        
        {/* 表情选择器 */}
        <EmojiPicker
          isOpen={showEmojiPicker}
          onClose={() => setShowEmojiPicker(false)}
          onEmojiSelect={handleEmojiClick}
        />
      </div>
      
      {/* 下：发送按钮 - 固定在屏幕最下边 */}
      <div className="fixed right-4 bottom-4 z-10 flex items-center justify-center">
        <SendButton
          isDisabled={disabled}
          onClick={handleSendClick}
          hasContent={!!content.trim()}
        />
      </div>
    </div>
  );
};