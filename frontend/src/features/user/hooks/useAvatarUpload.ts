/**
 * 用于管理头像上传的自定义hook
 */
import { useState } from 'react';
import { UserService } from '../services/userService';
import { toast } from 'sonner';

interface UseAvatarUploadReturn {
  showAvatarModal: boolean;
  avatarPreview: string;
  selectedAvatarFile: File | null;
  isUploading: boolean;
  handleAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  confirmAvatarUpload: () => Promise<void>;
  cancelAvatarUpload: () => void;
}

/**
 * 用于管理头像上传的自定义hook
 */
export const useAvatarUpload = (
  onAvatarUpdate: (avatarUrl: string) => void
): UseAvatarUploadReturn => {
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [selectedAvatarFile, setSelectedAvatarFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  /**
   * 处理头像文件选择
   */
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 检查文件类型是否为图片
      if (!file.type.startsWith('image/')) {
        toast.error('请选择图片文件');
        return;
      }

      // 检查文件大小（不超过5MB）
      if (file.size > 5 * 1024 * 1024) {
        toast.error('图片文件不能超过5MB');
        return;
      }

      setSelectedAvatarFile(file);

      // 创建图片预览
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
        setShowAvatarModal(true);
      };
      reader.readAsDataURL(file);
    }
  };

  /**
   * 确认上传头像
   */
  const confirmAvatarUpload = async () => {
    if (!selectedAvatarFile) return;

    setIsUploading(true);
    try {
      const avatarUrl = await UserService.uploadAvatar(selectedAvatarFile);
      onAvatarUpdate(avatarUrl);
      setShowAvatarModal(false);
      setSelectedAvatarFile(null);
      setAvatarPreview('');
      toast.success('头像上传成功');
    } catch (error) {
      console.error('上传头像失败:', error);
      toast.error('头像上传失败，请重试');
    } finally {
      setIsUploading(false);
    }
  };

  /**
   * 取消头像上传
   */
  const cancelAvatarUpload = () => {
    setShowAvatarModal(false);
    setSelectedAvatarFile(null);
    setAvatarPreview('');
  };

  return {
    showAvatarModal,
    avatarPreview,
    selectedAvatarFile,
    isUploading,
    handleAvatarChange,
    confirmAvatarUpload,
    cancelAvatarUpload
  };
};