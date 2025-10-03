/**
 * 寄养服务详情表单相关的自定义Hook
 * 封装了寄养服务详情页面的表单逻辑，包括宠物选择、日期选择、支付方式选择等
 */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import type { Pet } from '@/types';
import type { FosterServiceDetailResponse } from '../types/dto';
import fosterService from '../services/fosterService';
import type { FosterOrderRequest } from '../types/dto/FosterOrderDTO';
import { PetType, PaymentMethod } from '../types/enums';

interface UseFosterDetailFormProps {
  service: any | null;
  error: string | null;
}

interface UseFosterDetailFormReturn {
  pets: Pet[];
  selectedPet: string | null;
  checkInDate: string;
  checkOutDate: string;
  isBookingModalOpen: boolean;
  setSelectedPet: (petId: string | null) => void;
  setCheckInDate: (date: string) => void;
  setCheckOutDate: (date: string) => void;
  setIsBookingModalOpen: (open: boolean) => void;
  handleBookingSubmit: (e: React.FormEvent) => Promise<void>;
}

/**
 * 寄养详情表单的自定义Hook
 * 封装了寄养详情页面的表单逻辑
 */
export const useFosterDetailForm = ({ service, error }: UseFosterDetailFormProps): UseFosterDetailFormReturn => {
  const navigate = useNavigate();
  
  // 状态定义
  const [pets, setPets] = useState<Pet[]>([]);
  const [selectedPet, setSelectedPet] = useState<string | null>(null);
  const [checkInDate, setCheckInDate] = useState<string>('');
  const [checkOutDate, setCheckOutDate] = useState<string>('');
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  // 设置初始数据
  useEffect(() => {
    // 模拟当前用户的宠物列表
    const mockPets: Pet[] = [
      {
        id: 'pet1',
        name: '豆豆',
        type: 'dog',
        breed: '金毛',
        age: 2,
        size: 'large',
        description: '活泼可爱的金毛犬，喜欢户外活动',
        imageUrls: ['https://images.unsplash.com/photo-1507652313519-d4e9174996dd?q=80&w=1964'],
        ownerId: 'u4',
        specialNeeds: '无',
        vaccinated: true
      },
      {
        id: 'pet2',
        name: '咪咪',
        type: 'cat',
        breed: '英短',
        age: 3,
        size: 'medium',
        description: '安静乖巧的英短猫，喜欢独处',
        imageUrls: ['https://images.unsplash.com/photo-1529778873920-4da4926a72c2?q=80&w=1964'],
        ownerId: 'u4',
        specialNeeds: '需要每天梳毛',
        vaccinated: true
      }
    ];
    
    setPets(mockPets);
    if (mockPets.length > 0) {
      setSelectedPet(mockPets[0].id);
    }
    
    // 设置默认日期（今天和明天）
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    
    setCheckInDate(today.toISOString().split('T')[0]);
    setCheckOutDate(tomorrow.toISOString().split('T')[0]);
  }, []);

  // 处理错误
  useEffect(() => {
    if (error) {
      toast.error(error);
      navigate('/fosters');
    }
  }, [error, navigate]);

  // 处理预订提交
  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPet) {
      toast.error('请选择要寄养的宠物');
      return;
    }
    
    if (!checkInDate || !checkOutDate) {
      toast.error('请选择入住和离店日期');
      return;
    }
    
    if (!service) {
      toast.error('服务信息不存在');
      return;
    }
    
    try {
      // 查找选中的宠物信息
      const selectedPetInfo = pets.find(pet => pet.id === selectedPet);
      
      if (!selectedPetInfo) {
        toast.error('未找到选中的宠物信息');
        return;
      }
      
      // 计算总价 (示例：服务价格 * 天数)
      const startDate = new Date(checkInDate);
      const endDate = new Date(checkOutDate);
      const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      const totalPrice = days * service.price;
      
      // 构建创建订单的请求参数
      const requestData: FosterOrderRequest = {
        fosterServiceId: service.id,
        startDate: checkInDate,
        endDate: checkOutDate,
        totalPrice,
        petInfo: {
          id: selectedPet,
          name: selectedPetInfo.name,
          type: selectedPetInfo.type === 'dog' ? 'DOG' : selectedPetInfo.type === 'cat' ? 'CAT' : 'OTHER',
          breed: selectedPetInfo.breed,
          age: selectedPetInfo.age,
          weight: 0, // 模拟数据中没有体重字段
          healthCondition: '健康', // 模拟健康状况
          specialRequirements: selectedPetInfo.specialNeeds || ''
        },
        paymentMethod: PaymentMethod.ALIPAY // 默认使用支付宝
      };
      
      // 调用API创建寄养订单
      await fosterService.createFosterOrder(requestData);
      
      toast.success('支付成功！');
      navigate('/profile?tab=bookings');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : '预订失败，请稍后重试');
    }
  };

  return {
    pets,
    selectedPet,
    checkInDate,
    checkOutDate,
    isBookingModalOpen,
    setSelectedPet,
    setCheckInDate,
    setCheckOutDate,
    setIsBookingModalOpen,
    handleBookingSubmit
  };
};

export default useFosterDetailForm;