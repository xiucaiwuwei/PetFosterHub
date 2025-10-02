import React from 'react';
import Carousel from '@/components/display/Carousel';

interface PetStoreCarouselProps {
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

const PetStoreCarousel: React.FC<PetStoreCarouselProps> = ({
  autoPlay = true,
  autoPlayInterval = 5000
}) => {
  // 宠物商店专用轮播图数据
  const petStoreSlides = [
    {
      id: 1,
      title: '宠物商店',
      description: '为您的爱宠挑选高品质的食品和用品',
      backgroundColor: 'bg-orange-500',
      backgroundGradient: 'from-orange-500 to-orange-600',
      stats: [
        { label: '优质商品', value: '300+' },
        { label: '品牌种类', value: '50+' },
        { label: '满意评价', value: '96%' },
        { label: '配送城市', value: '15+' }
      ]
    },
    {
      id: 2,
      title: '新品上市',
      description: '限时优惠，新品宠物零食8折起',
      backgroundColor: 'bg-blue-500',
      backgroundGradient: 'from-blue-500 to-blue-600',
      stats: [
        { label: '新品数量', value: '50+' },
        { label: '限时折扣', value: '8折起' },
        { label: '活动时间', value: '30天' },
        { label: '已购用户', value: '2000+' }
      ]
    },
    {
      id: 3,
      title: '会员专享',
      description: '加入会员享受更多专属福利和服务',
      backgroundColor: 'bg-purple-500',
      backgroundGradient: 'from-purple-500 to-purple-600',
      stats: [
        { label: '会员权益', value: '12项' },
        { label: '生日礼包', value: '¥50' },
        { label: '专属客服', value: '24h' },
        { label: '积分倍数', value: '1.5x' }
      ]
    }
  ];

  return (
    <Carousel
      slides={petStoreSlides}
      autoPlay={autoPlay}
      autoPlayInterval={autoPlayInterval}
      minHeight="240px"
      maxHeight="360px"
      paddingClass="py-6 md:py-10"
      controlButtonsBottomPosition="bottom-[-30px]"
    />
  );
};

export default PetStoreCarousel;