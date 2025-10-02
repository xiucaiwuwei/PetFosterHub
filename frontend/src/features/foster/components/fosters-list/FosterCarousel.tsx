import React from 'react';
/*
 * 寄养服务轮播图组件
 * 在寄养服务列表页顶部展示宣传横幅
 */
import Carousel from '@/components/display/Carousel';

interface FosterCarouselProps {
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

const FosterCarousel: React.FC<FosterCarouselProps> = ({
  autoPlay = true,
  autoPlayInterval = 5000
}) => {
  // 寄养服务专用轮播图数据
  const fosterSlides = [
    {
      id: 1,
      title: '为您的爱宠找到温暖的临时家园',
      description: '精选优质寄养服务，专业照顾，让您外出无忧，爱宠舒适安心',
      backgroundColor: 'bg-orange-500',
      backgroundGradient: 'from-orange-500 to-orange-600',
      stats: [
        { label: '优质服务', value: '200+' },
        { label: '专业寄养师', value: '50+' },
        { label: '满意评价', value: '98%' },
        { label: '覆盖城市', value: '10+' }
      ]
    },
    {
      id: 2,
      title: '专业寄养师团队',
      description: '所有寄养师均经过严格筛选和培训，确保您的爱宠得到最专业的照顾',
      backgroundColor: 'bg-amber-500',
      backgroundGradient: 'from-amber-500 to-amber-600',
      stats: [
        { label: '专业资质', value: '100%' },
        { label: '平均经验', value: '3年+' },
        { label: '培训认证', value: '100%' },
        { label: '应急处理', value: '24h' }
      ]
    },
    {
      id: 3,
      title: '个性化寄养方案',
      description: '根据宠物的品种、年龄、健康状况和特殊需求，量身定制专属寄养方案',
      backgroundColor: 'bg-yellow-500',
      backgroundGradient: 'from-yellow-500 to-yellow-600',
      stats: [
        { label: '定制方案', value: '1v1' },
        { label: '特殊需求', value: '可满足' },
        { label: '健康监测', value: '每日' },
        { label: '互动时间', value: '充足' }
      ]
    }
  ];

  return (
    <Carousel
      slides={fosterSlides}
      autoPlay={autoPlay}
      autoPlayInterval={autoPlayInterval}
      minHeight="240px"
      maxHeight="360px"
      paddingClass="py-12"
      controlButtonsBottomPosition="bottom-[-30px]"
    />
  );
};

export default FosterCarousel;