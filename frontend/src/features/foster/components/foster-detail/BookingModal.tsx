import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import type { FosterService, Pet } from '../../types';
import { calculateDaysBetween } from '@/features/foster/utils/formatUtils';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: FosterService;
  pets: Pet[];
  selectedPet: string | null;
  setSelectedPet: (petId: string | null) => void;
  checkInDate: string;
  setCheckInDate: (date: string) => void;
  checkOutDate: string;
  setCheckOutDate: (date: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const BookingModal = ({ 
  isOpen, 
  onClose, 
  service, 
  pets, 
  selectedPet, 
  setSelectedPet, 
  checkInDate, 
  setCheckInDate, 
  checkOutDate, 
  setCheckOutDate, 
  onSubmit 
}: BookingModalProps) => {
  const navigate = useNavigate();

  // 计算预订天数
  const calculateDays = () => {
    if (!checkInDate || !checkOutDate) return 0;
    return calculateDaysBetween(checkInDate, checkOutDate);
  };

  // 计算总价
  const calculateTotalPrice = () => {
    const days = calculateDays();
    const basePrice = service.pricePerDay * days;
    const serviceFee = Math.round(basePrice * 0.1);
    return basePrice + serviceFee;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">预订寄养服务</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <i className="fa-solid fa-times"></i>
            </button>
          </div>
        </div>
        
        <form onSubmit={onSubmit} className="p-6">
          {/* 选择宠物 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              选择要寄养的宠物
            </label>
            {pets.length > 0 ? (
              <select
                value={selectedPet || ''}
                onChange={(e) => setSelectedPet(e.target.value)}
                className="block w-full pl-3 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                required
              >
                {pets.map((pet) => (
                  <option key={pet.id} value={pet.id}>
                    {pet.name} ({pet.breed})
                  </option>
                ))}
              </select>
            ) : (
              <div className="bg-gray-lighter p-4 rounded-lg text-center">
                <p className="text-sm text-gray-500 mb-3">您还没有添加宠物</p>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    navigate('/profile?tab=pets');
                  }}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent rounded-md shadow-sm text-xs font-medium text-white bg-orange-500 hover:bg-orange-600"
                >
                  <i className="fa-solid fa-plus mr-1"></i> 添加宠物
                </button>
              </div>
            )}
          </div>
          
          {/* 日期选择 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label htmlFor="checkIn" className="block text-sm font-medium text-gray-700 mb-2">
                入住日期
              </label>
              <input
                type="date"
                id="checkIn"
                value={checkInDate}
                onChange={(e) => setCheckInDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                max={service.availableTo.toISOString().split('T')[0]}
                className="block w-full pl-3 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                required
              />
            </div>
            
            <div>
              <label htmlFor="checkOut" className="block text-sm font-medium text-gray-700 mb-2">
                离店日期
              </label>
              <input
                type="date"
                id="checkOut"
                value={checkOutDate}
                onChange={(e) => setCheckOutDate(e.target.value)}
                min={checkInDate ? new Date(checkInDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]}
                max={service.availableTo.toISOString().split('T')[0]}
                className="block w-full pl-3 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                required
              />
            </div>
          </div>
          
          {/* 特殊要求 */}
          <div className="mb-6">
            <label htmlFor="specialRequests" className="block text-sm font-medium text-gray-700 mb-2">
              特殊要求 (可选)
            </label>
            <textarea
              id="specialRequests"
              rows={3}
              className="block w-full pl-3 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              placeholder="请告诉寄养提供者您的宠物有什么特殊需求或习惯..."
            ></textarea>
          </div>
          
          {/* 预订摘要 */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h4 className="text-sm font-medium text-gray-900 mb-3">预订摘要</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">价格 ({calculateDays()}天)</span>
                <span className="text-gray-900">¥{service.pricePerDay * calculateDays()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">服务 fee</span>
                <span className="text-gray-900">¥{Math.round(service.pricePerDay * calculateDays() * 0.1)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-200 mt-2">
                <span className="font-medium text-gray-900">总计</span>
                <span className="font-medium text-gray-900">¥{calculateTotalPrice()}</span>
              </div>
            </div>
          </div>
          
          <button
            type="submit"
            disabled={pets.length === 0}
            className="w-full py-4 px-6 border border-transparent rounded-xl shadow-lg text-base font-semibold text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center group"
          >
            <span>确认预订并支付</span>
            <i className="fa-solid fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform"></i>
          </button>
        </form>
      </motion.div>
    </div>
  );
};