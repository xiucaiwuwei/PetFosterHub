/**
 * FosterDetail.tsx
 */
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Navbar } from '@/components/layout/Navbar.tsx';
import { Footer } from '@/features/home/components/Footer.tsx';
import { useFosterDetail } from '@/features/foster';
import { useState } from 'react';
import type { Pet } from '@/types';
import { 
  ServiceImages, 
  ProviderInfo, 
  ServiceDescription, 
  AmenitiesList, 
  AvailableDates, 
  BookingPanel, 
  BookingModal,
  LoadingState,
  ErrorState 
} from '../components/foster-detail';

export default function FosterDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { fosterDetail: service, loading: isLoading, error } = useFosterDetail(id || '');
  
  const [pets, setPets] = useState<Pet[]>([]);
  const [selectedPet, setSelectedPet] = useState<string | null>(null);
  const [checkInDate, setCheckInDate] = useState<string>('');
  const [checkOutDate, setCheckOutDate] = useState<string>('');
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  // 设置初始数据
  useState(() => {
    // 模拟当前用户的宠物列表
    const mockPets: Pet[] = [
      {
        id: 'pet1',
        name: '豆豆',
        type: 'dog',
        breed: '金毛',
        age: 2,
        weight: 25,
        healthCondition: '健康',
        specialRequirements: '无',
        ownerId: 'u4'
      },
      {
        id: 'pet2',
        name: '咪咪',
        type: 'cat',
        breed: '英短',
        age: 3,
        weight: 5,
        healthCondition: '健康',
        specialRequirements: '需要每天梳毛',
        ownerId: 'u4'
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
  useState(() => {
    if (error) {
      toast.error(error);
      navigate('/fosters');
    }
  }, [error, navigate]);

  // 处理预订提交
  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPet) {
      toast.error('请选择要寄养的宠物');
      return;
    }
    
    if (!checkInDate || !checkOutDate) {
      toast.error('请选择入住和离店日期');
      return;
    }
     
    // 在实际应用中，这里应该调用预订API
    toast.success('支付成功！');
    navigate('/profile?tab=bookings');
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (!service) {
    return <ErrorState />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="flex-grow pt-16 pb-12">
        {/* 服务图片展示区 */}
        <ServiceImages service={service} />
        
        {/* 服务详情内容 */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 左侧主要内容 */}
            <div className="lg:col-span-2">
              <ProviderInfo service={service} />
              <ServiceDescription service={service} />
              <AmenitiesList service={service} />
              <AvailableDates service={service} />
            </div>
            
            {/* 右侧预订面板 */}
            <div className="lg:col-span-1">
              <BookingPanel service={service} onBookNow={() => setIsBookingModalOpen(true)} />
            </div>
          </div>
        </div>
      </main>
      
      {/* 预订模态框 */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        service={service}
        pets={pets}
        selectedPet={selectedPet}
        setSelectedPet={setSelectedPet}
        checkInDate={checkInDate}
        setCheckInDate={setCheckInDate}
        checkOutDate={checkOutDate}
        setCheckOutDate={setCheckOutDate}
        onSubmit={handleBookingSubmit}
      />
      
      <Footer />
    </div>
  );
}