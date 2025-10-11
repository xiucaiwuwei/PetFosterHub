/**
 * 用户个人资料表单组件 - 美化增强版
 */
import React, { useState, useEffect } from 'react';
import { UserProfileResponse, UpdateUserInfoRequest } from '../types';
import { UserService } from '../services/userService';
import { toast } from 'sonner';
import { Loader2, User, Phone as PhoneIcon, MapPin, BookOpen } from 'lucide-react';

interface UserProfileFormProps {
  userInfo: UserProfileResponse | null;
  editedUserInfo: UserProfileResponse | null;
  setEditedUserInfo: (userInfo: UserProfileResponse | null) => void;
  onCancel: () => void;
  onSubmit: (userData: UpdateUserInfoRequest) => Promise<void>;
}

/**
 * 用户个人资料表单组件 - 美化增强版
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
  const [formIsDirty, setFormIsDirty] = useState(false);

  // 检测表单是否被修改
  useEffect(() => {
    if (userInfo && editedUserInfo) {
      const isDirty = Object.keys(userInfo).some(key => {
        return key === 'bio' || key === 'nickname' || key === 'phone' || key === 'address' 
          ? userInfo[key as keyof UserProfileResponse] !== editedUserInfo[key as keyof UserProfileResponse]
          : false;
      });
      setFormIsDirty(isDirty);
    }
  }, [userInfo, editedUserInfo]);

  // 如果没有用户信息，显示加载状态
  if (!userInfo || !editedUserInfo) {
    return (
      <div className="p-8 flex items-center justify-center bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-100 border-t-orange-500"></div>
        <span className="ml-3 text-gray-600">加载中...</span>
      </div>
    );
  }

  /**
   * 处理表单输入变化
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    // 限制bio字段的最大长度
    if (name === 'bio' && value.length > 500) return;
    
    // 直接创建新的用户信息对象
    setEditedUserInfo(editedUserInfo ? { ...editedUserInfo, [name]: value } : null);
    
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
    const userData: UpdateUserInfoRequest = {
      nickname: editedUserInfo.nickname || '',
      address: editedUserInfo.address || '',
      bio: editedUserInfo.bio || '',
      operationType: 'UPDATE',
      operationContent: '更新个人资料'
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

  // 表单字段组件
  const FormField = ({ 
    label, 
    id, 
    type = 'text', 
    value, 
    onChange, 
    placeholder = '', 
    required = false,
    icon: Icon,
    errorMessage,
    maxLength = undefined 
  }: {
    label: string;
    id: string;
    type?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    required?: boolean;
    icon?: React.ElementType;
    errorMessage?: string;
    maxLength?: number;
  }) => (
    <div className="mb-6">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon size={18} className="text-gray-400" />
          </div>
        )}
        <input
          type={type}
          id={id}
          name={id}
          value={value}
          onChange={onChange}
          maxLength={maxLength}
          className={`block w-full pl-${Icon ? '10' : '4'} pr-4 py-2.5 rounded-lg border ${errorMessage ? 'border-red-300 bg-red-50' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 shadow-sm placeholder-gray-300`}
          placeholder={placeholder}
          required={required}
        />
        {maxLength && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-xs text-gray-400">
            {value.length}/{maxLength}
          </div>
        )}
      </div>
      {errorMessage && (
        <p className="mt-1.5 text-sm text-red-600 flex items-center bg-red-50 px-3 py-2 rounded-md">
          <span className="mr-2 text-red-500">⚠️</span>
          {errorMessage}
        </p>
      )}
    </div>
  );

  // 文本区域组件
  const TextAreaField = ({ 
    label, 
    id, 
    value, 
    onChange, 
    placeholder = '', 
    required = false,
    icon: Icon,
    errorMessage,
    maxLength = 500 
  }: {
    label: string;
    id: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    placeholder?: string;
    required?: boolean;
    icon?: React.ElementType;
    errorMessage?: string;
    maxLength?: number;
  }) => (
    <div className="mb-6">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <textarea
          id={id}
          name={id}
          rows={5}
          value={value}
          onChange={onChange}
          maxLength={maxLength}
          className={`block w-full px-4 py-3 rounded-lg border ${errorMessage ? 'border-red-300 bg-red-50' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 shadow-sm placeholder-gray-300 resize-none`}
          placeholder={placeholder}
          required={required}
        ></textarea>
        <div className="absolute bottom-3 right-3 text-xs text-gray-400">
          {value.length}/{maxLength}
        </div>
      </div>
      {errorMessage && (
        <p className="mt-1.5 text-sm text-red-600 flex items-center bg-red-50 px-3 py-2 rounded-md">
          <span className="mr-2 text-red-500">⚠️</span>
          {errorMessage}
        </p>
      )}
    </div>
  );

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-lg overflow-hidden">
      {/* 表单标题栏 */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-4">
        <h2 className="text-lg font-semibold text-white flex items-center">
          <User size={18} className="mr-2" />
          编辑个人资料
        </h2>
      </div>
      
      {/* 表单内容 */}
      <form onSubmit={handleSubmit} className="p-6">
        {/* 表单字段分组 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="relative">
            {/* 装饰线 */}
            <div className="absolute -left-4 top-0 bottom-0 w-1 bg-orange-100 rounded-full hidden md:block"></div>
            <FormField
              label="昵称"
              id="nickname"
              value={editedUserInfo.nickname || ''}
              onChange={handleInputChange}
              placeholder="请输入您的昵称"
              required={true}
              icon={User}
              errorMessage={errors.nickname}
              maxLength={20}
            />
          </div>
          
          <div>
            <FormField
              label="电话"
              id="phone"
              type="tel"
              value={editedUserInfo.phone || ''}
              onChange={handleInputChange}
              placeholder="请输入您的手机号码"
              icon={PhoneIcon}
              errorMessage={errors.phone}
              maxLength={11}
            />
          </div>
        </div>
        
        <div className="mb-8">
          <FormField
            label="地址"
            id="address"
            value={editedUserInfo.address || ''}
            onChange={handleInputChange}
            placeholder="请输入您的详细地址"
            icon={MapPin}
            errorMessage={errors.address}
            maxLength={100}
          />
        </div>
        
        <div className="mb-8">
          <TextAreaField
            label="个人简介"
            id="bio"
            value={editedUserInfo.bio || ''}
            onChange={handleInputChange}
            placeholder="介绍一下自己吧，让更多人了解您..."
            icon={BookOpen}
            errorMessage={errors.bio}
          />
        </div>
        
        {/* 操作按钮 */}
        <div className="flex justify-end space-x-4 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-6 py-2.5 border border-gray-200 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-300 transform hover:-translate-y-1"
          >
            取消
          </button>
          <button
            type="submit"
            disabled={isSubmitting || !formIsDirty}
            className={`px-6 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg ${isSubmitting || !formIsDirty ? 'bg-gray-300 cursor-not-allowed' : 'bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500'}`}
          >
            {isSubmitting ? (
              <span className="inline-flex items-center">
                <Loader2 size={16} className="mr-2 animate-spin" />
                保存中...
              </span>
            ) : (
              '保存更改'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};