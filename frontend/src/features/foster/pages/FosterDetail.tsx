/**
 * 寄养服务详情页组件
 * 展示寄养服务的详细信息，包括图片、提供者信息、服务描述、设施、可用日期、预订面板和评论区
 */
import { useParams, useNavigate } from 'react-router-dom';
import { useFosterDetail } from '../hooks/useFosterDetail';
import FosterDetailHeader from '../components/layout/FosterDetailHeader';
import { useFosterDetailForm } from '../hooks/useFosterDetailForm';
import type { FosterServiceItem } from '../types/dto/FosterServiceDTO';
import { FosterServiceStatus } from '../types/enums';
import {
  ServiceImages,
  ProviderInfo,
  ServiceDescription,
  AmenitiesList,
  AvailableDates,
  BookingPanel,
  BookingModal,
  LoadingState,
  ErrorState,
  CommentsSection
} from '../components/foster-detail';
import { useFosterFavorites } from '../components/favorites';

export default function FosterDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { fosterDetail: service, loading: isLoading, error } = useFosterDetail(id || '');
  const { isFavorited, addItem, removeItem } = useFosterFavorites();

  // 添加返回按钮的处理函数
  const handleBack = () => {
    navigate('/fosters');
  };

  // 使用自定义hook处理表单数据逻辑
  const {
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
  } = useFosterDetailForm({ service: null, error });

  // 将FosterService转换为FosterServiceItem格式
  const convertToFosterServiceItem = (serviceDetail: typeof service): FosterServiceItem | null => {
    if (!serviceDetail) return null;

    return {
      id: serviceDetail.id,
      title: serviceDetail.title,
      description: serviceDetail.description,
      price: serviceDetail.pricePerDay,
      images: serviceDetail.images,
      location: serviceDetail.location,
      rating: serviceDetail.rating,
      reviewCount: serviceDetail.reviewsCount || 0,
      tags: [], // 空数组作为默认值
      status: FosterServiceStatus.ACTIVE, // 假设收藏的服务都是活跃的
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  };

  // 处理收藏状态切换
  const handleToggleFavorite = () => {
    if (service) {
      try {
        const favoriteStatus = isFavorited(service.id);
        if (favoriteStatus) {
          // 取消收藏
          removeItem(service.id);
          console.log('取消收藏服务:', service.id, service.title);
        } else {
          // 添加收藏 - 先转换类型
          const serviceItem = convertToFosterServiceItem(service);
          if (serviceItem) {
            addItem(serviceItem);
            console.log('收藏服务:', service.id, service.title);
          }
        }
        // 刷新服务详情数据以更新UI
        // 如果需要可以添加一个refresh方法到useFosterDetail hook中
      } catch (err) {
        console.error('切换收藏状态失败:', err);
        alert('操作失败，请稍后重试');
      }
    }
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (!service) {
    return <ErrorState />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* 顶部导航栏 */}
      <FosterDetailHeader
        serviceName={service.title}
        serviceId={service.id}
        isFavorite={isFavorited(service.id)}
        onToggleFavorite={handleToggleFavorite}
        onBack={handleBack}
      />

      {/* 主体内容区域 */}
      <main className="flex-grow pb-12 pt-0">
        {/* 服务图片展示区 */}
        <ServiceImages service={service} />

        {/* 服务详情内容 */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 左侧主要内容 - 大屏幕上占据2/3宽度 */}
            <div className="lg:col-span-2 space-y-6 p-4">
              {/* 服务提供方信息 */}
              <div>
                <ProviderInfo service={service} />
              </div>

              {/* 服务描述 */}
              <div>
                <ServiceDescription service={service} />
              </div>

              {/* 设施列表 */}
              <div>
                <AmenitiesList service={service} />
              </div>
            </div>

            {/* 右侧预订面板 - 大屏幕上占据1/3宽度 */}
            <div className="lg:col-span-1 space-y-6 p-4">
              {/* 预订面板组件 */}
              <div>
                <BookingPanel service={service} onBookNow={() => setIsBookingModalOpen(true)} />
              </div>

              {/* 可用日期组件 */}
              <div>
                <AvailableDates service={service} />
              </div>
            </div>
          </div>

          {/* 评论区域 */}
          <CommentsSection service={service} />
        </div>
      </main>

      {/* 预订模态框 */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        service={service}
        pets={pets}
        onSubmit={handleBookingSubmit}
      />
    </div>
  );
}