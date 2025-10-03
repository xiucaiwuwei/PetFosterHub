/**
 * 寄养服务预订相关的自定义Hook
 * 封装认证检查、预订状态管理、日期和价格计算等逻辑
 */
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import { RootState } from '@/app/store/store';
import type { FosterService, Pet } from '@/types';
import { calculateDaysBetween } from '@/features/foster/utils/formatUtils';

interface UseBookingResult {
  // 认证相关
  isAuthenticated: boolean;
  handleBookClick: (service: FosterService, onBookNow: () => void) => void;
  
  // 预订模态框相关状态
  isBookingModalOpen: boolean;
  setIsBookingModalOpen: (value: boolean) => void;
  handleCloseModal: () => void;
  
  // 预订信息相关状态
  selectedPet: string | null;
  setSelectedPet: (petId: string | null) => void;
  checkInDate: string;
  setCheckInDate: (date: string) => void;
  checkOutDate: string;
  setCheckOutDate: (date: string) => void;
  specialRequests: string;
  setSpecialRequests: (value: string) => void;
  
  // 计算函数
  calculateDays: (checkInDate: string, checkOutDate: string) => number;
  calculateTotalPrice: (service: FosterService, checkInDate: string, checkOutDate: string) => number;
  calculateBasePrice: (service: FosterService, checkInDate: string, checkOutDate: string) => number;
  calculateServiceFee: (service: FosterService, checkInDate: string, checkOutDate: string) => number;
  
  // 导航函数
  navigateToAddPet: () => void;
}

/**
 * 寄养服务预订相关的自定义Hook
 * 封装认证检查、预订状态管理、日期和价格计算等逻辑
 * @returns 预订相关的状态和操作函数
 */
export const useBooking = (): UseBookingResult => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  
  // 预订模态框状态
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  
  // 预订信息状态
  const [selectedPet, setSelectedPet] = useState<string | null>(null);
  const [checkInDate, setCheckInDate] = useState(new Date().toISOString().split('T')[0]);
  const [checkOutDate, setCheckOutDate] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  
  // 处理预订按钮点击
  const handleBookClick = useCallback((service: FosterService, onBookNow: () => void) => {
    if (!isAuthenticated) {
      navigate('/login?redirect=' + encodeURIComponent(`/fosters/${service.id}`));
      toast.info('请先登录后再进行预订');
    } else {
      onBookNow();
    }
  }, [isAuthenticated, navigate]);
  
  // 关闭模态框
  const handleCloseModal = useCallback(() => {
    setIsBookingModalOpen(false);
  }, []);
  
  // 计算预订天数
  const calculateDays = useCallback((checkInDate: string, checkOutDate: string): number => {
    if (!checkInDate || !checkOutDate) return 0;
    return calculateDaysBetween(checkInDate, checkOutDate);
  }, []);
  
  // 计算基础价格
  const calculateBasePrice = useCallback((service: FosterService, checkInDate: string, checkOutDate: string): number => {
    const days = calculateDays(checkInDate, checkOutDate);
    return service.pricePerDay * days;
  }, [calculateDays]);
  
  // 计算服务费
  const calculateServiceFee = useCallback((service: FosterService, checkInDate: string, checkOutDate: string): number => {
    const basePrice = calculateBasePrice(service, checkInDate, checkOutDate);
    return Math.round(basePrice * 0.1);
  }, [calculateBasePrice]);
  
  // 计算总价
  const calculateTotalPrice = useCallback((service: FosterService, checkInDate: string, checkOutDate: string): number => {
    const basePrice = calculateBasePrice(service, checkInDate, checkOutDate);
    const serviceFee = calculateServiceFee(service, checkInDate, checkOutDate);
    return basePrice + serviceFee;
  }, [calculateBasePrice, calculateServiceFee]);
  
  // 导航到添加宠物页面
  const navigateToAddPet = useCallback(() => {
    setIsBookingModalOpen(false);
    navigate('/profile?tab=pets');
  }, [navigate]);
  
  return {
    isAuthenticated,
    handleBookClick,
    isBookingModalOpen,
    setIsBookingModalOpen,
    handleCloseModal,
    selectedPet,
    setSelectedPet,
    checkInDate,
    setCheckInDate,
    checkOutDate,
    setCheckOutDate,
    specialRequests,
    setSpecialRequests,
    calculateDays,
    calculateTotalPrice,
    calculateBasePrice,
    calculateServiceFee,
    navigateToAddPet
  };
};

export default useBooking;