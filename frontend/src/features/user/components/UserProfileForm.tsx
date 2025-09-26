import React, { useState } from 'react';
import { GetUserInfoDto, UpdateUserInfoDto } from '../types';
import { UserService } from '../services/userService';
import { toast } from 'sonner';

interface UserProfileFormProps {
  userInfo: GetUserInfoDto | null;
  editedUserInfo: GetUserInfoDto | null;
  setEditedUserInfo: (userInfo: GetUserInfoDto | null) => void;
  onCancel: () => void;
  onSubmit: (userData: UpdateUserInfoDto) => Promise<void>;
}

/**
 * 用户个人资料表单组件
 */
export const UserProfileForm: React.FC<UserProfileFormProps> = ({
  userInfo,
  editedUserInfo,
  setEditedUserInfo,
  onCancel,
  onSubmit
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 如果没有用户信息，显示加载状态
  if (!userInfo || !editedUserInfo) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        <span className="ml-3 text-gray-600">加载中...</span>
      </div>
    );
  }

  /**
   * 处理表单输入变化
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedUserInfo(prev => prev ? { ...prev, [name]: value } : null);
    
    // 清除该字段的错误
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  /**
   * 验证表单并提交
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 准备要更新的数据
    const userData: UpdateUserInfoDto = {
      name: editedUserInfo.name,
      phone: editedUserInfo.phone,
      address: editedUserInfo.address,
      bio: editedUserInfo.bio
    };

    // 验证用户输入
    const validation = UserService.validateUserInput(userData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    // 提交表单
    setIsSubmitting(true);
    try {
      await onSubmit(userData);
    } catch (error) {
      toast.error('更新失败，请稍后重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          姓名 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={editedUserInfo.name}
          onChange={handleInputChange}
          className={`block w-full px-4 py-2 border ${errors.name ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500`}
          required
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          邮箱 <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={editedUserInfo.email}
          onChange={handleInputChange}
          className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          required
        />
      </div>
      
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
          电话
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={editedUserInfo.phone || ''}
          onChange={handleInputChange}
          className={`block w-full px-4 py-2 border ${errors.phone ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500`}
          placeholder="请输入手机号码"
        />
        {errors.phone && (
          <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
          地址
        </label>
        <input
          type="text"
          id="address"
          name="address"
          value={editedUserInfo.address || ''}
          onChange={handleInputChange}
          className={`block w-full px-4 py-2 border ${errors.address ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500`}
          placeholder="请输入详细地址"
        />
        {errors.address && (
          <p className="mt-1 text-sm text-red-600">{errors.address}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
          个人简介
        </label>
        <textarea
          id="bio"
          name="bio"
          rows={4}
          value={editedUserInfo.bio || ''}
          onChange={handleInputChange}
          className={`block w-full px-4 py-2 border ${errors.bio ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500`}
          placeholder="介绍一下自己吧"
        ></textarea>
        {errors.bio && (
          <p className="mt-1 text-sm text-red-600">{errors.bio}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          还可以输入 {500 - (editedUserInfo.bio?.length || 0)} 个字符
        </p>
      </div>
      
      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
        >
          取消
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
        >
          {isSubmitting ? (
            <span className="inline-flex items-center">
              <i className="fa-solid fa-spinner fa-spin mr-2"></i>
              保存中...
            </span>
          ) : (
            '保存更改'
          )}
        </button>
      </div>
    </form>
  );
};