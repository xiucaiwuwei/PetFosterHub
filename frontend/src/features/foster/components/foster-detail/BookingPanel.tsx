import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store/store';
import { toast } from 'sonner';
import type { FosterService } from '../../types';

interface BookingPanelProps {
  service: FosterService;
  onBookNow: () => void;
}

export const BookingPanel = ({ service, onBookNow }: BookingPanelProps) => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  const handleBookClick = () => {
    if (!isAuthenticated) {
      navigate('/login?redirect=' + encodeURIComponent(`/fosters/${service.id}`));
      toast.info('请先登录后再进行预订');
    } else {
      onBookNow();
    }
  };

  return (
    <div className="sticky top-20">
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-end">
            <span className="text-3xl font-bold text-gray-900">¥{service.pricePerDay}</span>
            <span className="text-gray-500 ml-1 mb-1">/{service.currency === 'CNY' ? '天' : service.currency}</span>
          </div>
          <p className="text-gray-500 mt-1">包含所有税费</p>
        </div>
        
         <div className="p-6">
           <button
             onClick={handleBookClick}
            className="w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition duration-150 ease-in-out mb-4"
          >
            立即预订
          </button>
          
          <div className="flex items-center justify-center text-gray-500 text-sm">
            <i className="fa-solid fa-shield mr-1"></i>
            <span>预订保障 · 安全支付 · 随时取消</span>
          </div>
        </div>
        
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex items-start mb-4">
            <div className="flex-shrink-0 h-6 w-6 text-orange-500">
              <i className="fa-solid fa-calendar-check"></i>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">灵活取消</p>
              <p className="text-sm text-gray-500">提前3天取消可获得全额退款</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="flex-shrink-0 h-6 w-6 text-orange-500">
              <i className="fa-solid fa-user-check"></i>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">身份认证</p>
              <p className="text-sm text-gray-500">寄养提供者已通过身份验证</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};