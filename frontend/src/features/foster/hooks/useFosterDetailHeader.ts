/**
 * 寄养服务详情页头部导航栏的自定义Hook
 * 封装头部导航栏的状态管理和事件处理逻辑
 */
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

interface FosterDetailHeaderParams {
  serviceId?: string | undefined;
  isFavorite?: boolean | undefined;
  onToggleFavorite?: (() => void) | undefined;
  onBack?: (() => void) | undefined;
  onReport?: ((serviceId: string) => Promise<void>) | undefined;
  onShare?: ((serviceId: string) => Promise<void>) | undefined;
}

interface UseFosterDetailHeaderReturn {
  isShareMenuOpen: boolean;
  isCopied: boolean;
  localIsFavorite: boolean;
  shareMenuRef: React.RefObject<HTMLDivElement>;
  handleBack: () => void;
  handleShare: () => void;
  handleCopyLink: () => Promise<void>;
  handleNativeShare: () => Promise<void>;
  handleReport: () => Promise<void>;
  handleToggleFavorite: () => void;
  setIsShareMenuOpen: (value: boolean) => void;
  setIsCopied: (value: boolean) => void;
  setLocalIsFavorite: (value: boolean) => void;
}

/**
 * 寄养服务详情页头部导航栏的自定义Hook
 * @param params 头部导航栏所需的参数
 * @returns 头部导航栏的状态和操作函数
 */
export const useFosterDetailHeader = (params: FosterDetailHeaderParams): UseFosterDetailHeaderReturn => {
  const {
    serviceId = '',
    isFavorite = false,
    onToggleFavorite,
    onBack,
    onReport,
    onShare
  } = params;

  const navigate = useNavigate();
  const [isShareMenuOpen, setIsShareMenuOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [localIsFavorite, setLocalIsFavorite] = useState(isFavorite);
  const shareMenuRef = useRef<HTMLDivElement>(null);

  // 当外部isFavorite属性变化时，同步本地状态
  useEffect(() => {
    setLocalIsFavorite(isFavorite);
  }, [isFavorite]);

  // 点击外部关闭分享菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (shareMenuRef.current && !shareMenuRef.current.contains(event.target as Node)) {
        setIsShareMenuOpen(false);
      }
    };

    if (isShareMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isShareMenuOpen]);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate('/fosters');
    }
  };

  const handleShare = () => {
    // 打开分享菜单
    setIsShareMenuOpen(!isShareMenuOpen);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      // 2秒后恢复复制状态
      setTimeout(() => setIsCopied(false), 2000);
      // 如果有外部分享回调，也调用它
      if (onShare && serviceId) {
        await onShare(serviceId);
      }
    } catch (err) {
      console.error('复制链接失败:', err);
      alert('复制链接失败，请手动复制URL');
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: document.title,
          url: window.location.href
        });
        // 如果有外部分享回调，也调用它
        if (onShare && serviceId) {
          await onShare(serviceId);
        }
        setIsShareMenuOpen(false);
      } catch (err) {
        console.error('分享失败:', err);
      }
    }
  };

  const handleReport = async () => {
    if (window.confirm('确定要举报此服务吗？举报后将提交给管理员审核。')) {
      try {
        // 调用外部举报回调（如果提供）
        if (onReport && serviceId) {
          await onReport(serviceId);
        } else {
          // 模拟举报API调用
          console.log(`举报服务: ${serviceId || '未知ID'}`);
          // 模拟网络延迟
          await new Promise(resolve => setTimeout(resolve, 500));
        }
        alert('举报已提交，我们会尽快处理');
      } catch (error) {
        console.error('举报提交失败:', error);
        alert('举报提交失败，请稍后重试');
      }
    }
  };

  const handleToggleFavorite = () => {
    try {
      // 更新本地状态以提供即时视觉反馈
      const newFavoriteState = !localIsFavorite;
      setLocalIsFavorite(newFavoriteState);
      
      // 如果有外部回调，则调用它
      if (onToggleFavorite) {
        onToggleFavorite();
      } else if (!onToggleFavorite && serviceId) {
        // 如果没有外部回调但有serviceId，记录日志以便调试
        console.log(`收藏状态切换: 服务ID=${serviceId}, 新状态=${newFavoriteState}`);
      }
    } catch (error) {
      console.error('切换收藏状态失败:', error);
      // 如果出错，恢复到之前的状态
      setLocalIsFavorite(localIsFavorite);
    }
  };

  return {
    isShareMenuOpen,
    isCopied,
    localIsFavorite,
    shareMenuRef,
    handleBack,
    handleShare,
    handleCopyLink,
    handleNativeShare,
    handleReport,
    handleToggleFavorite,
    setIsShareMenuOpen,
    setIsCopied,
    setLocalIsFavorite
  };
};

export default useFosterDetailHeader;