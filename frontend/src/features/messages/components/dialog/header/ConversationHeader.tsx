/**
 * 对话头部组件
 * 显示聊天对方的信息和操作按钮
 */
import React, { useState } from 'react';
import type { UserInfo } from '../../types/entity/Conversation';

interface ConversationHeaderProps {
  otherUser: UserInfo;
  onBack?: () => void;
  showBackButton?: boolean;
  isOptionsDrawerOpen: boolean;
  onToggleOptionsDrawer: () => void;
}

/**
 * 对话头部组件
 * 显示聊天对方的信息和操作按钮
 */
export const ConversationHeader: React.FC<ConversationHeaderProps> = ({
  otherUser,
  onBack,
  showBackButton = false,
  isOptionsDrawerOpen,
  onToggleOptionsDrawer
}) => {
  // 添加用户状态处理
  const [userStatus, setUserStatus] = useState<'online' | 'offline' | 'away'>('online');
  
  // 生成随机背景色（基于用户名）
  const getAvatarBackgroundColor = (name: string) => {
    if (!name) return 'bg-gradient-to-br from-orange-400 to-orange-500';
    
    // 简单的哈希函数来生成颜色
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    // 预设的颜色组合
    const colorCombinations = [
      'from-blue-400 to-indigo-500',
      'from-green-400 to-teal-500',
      'from-purple-400 to-pink-500',
      'from-red-400 to-orange-500',
      'from-yellow-400 to-amber-500',
      'from-cyan-400 to-blue-500',
    ];
    
    const colorIndex = Math.abs(hash) % colorCombinations.length;
    return `bg-gradient-to-br ${colorCombinations[colorIndex]}`;
  };
  
  // 获取状态样式
  const getStatusConfig = () => {
    switch (userStatus) {
      case 'online':
        return { text: '在线', color: 'text-green-500', bg: 'bg-green-500' };
      case 'offline':
        return { text: '离线', color: 'text-gray-500', bg: 'bg-gray-500' };
      case 'away':
        return { text: '离开', color: 'text-yellow-500', bg: 'bg-yellow-500' };
    }
  };
  
  const statusConfig = getStatusConfig();
  
  // 处理用户头像加载错误
  const handleAvatarError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.style.display = 'none';
    const fallback = e.currentTarget.nextElementSibling as HTMLElement;
    if (fallback) fallback.style.display = 'flex';
  };
  
  return (
    <div className="sticky top-0 z-10 p-4 border-b border-gray-200 flex items-center justify-between bg-white shadow-sm">
      <div className="flex items-center space-x-3">
        {showBackButton && onBack && (
          <button 
            onClick={onBack} 
            className="p-2 rounded-full hover:bg-gray-100 transition-all duration-200 text-gray-600"
            aria-label="返回"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              ></path>
            </svg>
          </button>
        )}
        
        <div className="relative">
          {otherUser && otherUser.avatar && (
            <img
              src={otherUser.avatar}
              alt={otherUser.name || '用户头像'}
              className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
              onError={handleAvatarError}
              loading="lazy"
            />
          )}
          <div 
            className={`w-12 h-12 rounded-full ${getAvatarBackgroundColor(otherUser?.name || '')} 
              flex items-center justify-center text-white text-sm font-medium ${otherUser?.avatar ? 'hidden' : ''}`}
          >
            {otherUser && otherUser.name 
              ? otherUser.name.charAt(0).toUpperCase()
              : '?'}
          </div>
          <span 
            className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white ${statusConfig.bg} transition-all duration-300`}
            aria-label={statusConfig.text}
          />
        </div>
        
        <div>
          <h3 className="font-semibold text-gray-800 text-lg tracking-tight">
            {otherUser && otherUser.name 
              ? otherUser.name
              : '未知用户'}
          </h3>
          <div className="flex items-center space-x-1 mt-0.5">
            <span className={`text-xs ${statusConfig.color} font-medium`}>{statusConfig.text}</span>
            {userStatus === 'online' && (
              <span className="text-xs text-gray-400">- 最后活跃: 刚刚</span>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <button 
          className="p-2 rounded-full hover:bg-gray-100 transition-all duration-200 text-gray-600 hover:text-blue-600"
          aria-label="更多选项"
          onClick={onToggleOptionsDrawer}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
            ></path>
          </svg>
        </button>
      </div>
    </div>
  );
};